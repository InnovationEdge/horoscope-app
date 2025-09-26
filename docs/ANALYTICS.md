# Analytics Spec — Zodiac App (FINAL)

> **Goals**: Measure feature usage, monetization, and UX quality without guesswork.  
> **Principles**: Minimal PII, consistent schemas, low overhead, offline-safe, scalable.

---

## 0) Stack & Routing

- **Client**: React Native (Expo).  
- **Collector**: POST `/api/v1/analytics/events` (Django) → fan out to GA4/BigQuery (server).  
- **Format**: JSON Lines batch (array).  
- **Dispatch**: Background, retries, offline queue.  
- **Session**: 30 min rolling inactivity window.

---

## 1) Global Payload (sent with EVERY event)

| Field              | Type     | Example                         | Notes                                      |
|--------------------|----------|----------------------------------|--------------------------------------------|
| `event`            | string   | `"tab_selected"`                 | See catalog below                           |
| `ts`               | int      | `1732645123456`                  | Epoch ms (client time)                      |
| `session_id`       | string   | `"s_2025-09-26_abc123"`          | Roll after 30m inactivity                   |
| `user_id`          | string?  | `"u_9f3..."` or null             | JWT sub or null                             |
| `install_id`       | string   | `"iid_..."`                      | Stable per install                          |
| `app_version`      | string   | `"1.0.0"`                        | From app.json                               |
| `build_number`     | string   | `"100"`                          |                                            |
| `platform`         | string   | `"ios"|"android"`                |                                            |
| `locale`           | string   | `"en-US"`                        |                                            |
| `region`           | string?  | `"europe-west3"`                 | Optional                                    |
| `ab_variant`       | string?  | `"paywall_v2"`                   | Exposure recorded separately                |
| `user_props`       | object   | see below                        | Shallow object                              |
| `params`           | object   | event-specific payload           | Shallow object                              |

### `user_props` (kept small)
{
"is_premium": boolean,
"sign": "aries" | ...,
"druid_sign": string?, // cached once computed
"chinese_animal": string?, // cached once computed
"tz": "Asia/Tbilisi"
}

markdown
Copy code

---

## 2) Event Catalog (authoritative)

> **Do not rename**. Only append new fields.

### Navigation & Screens
- `screen_view` `{ name: "today"|"traits"|"compat"|"druid"|"profile"|"onboarding_<step>" }`
- `tab_selected` `{ tab: "today"|"traits"|"compat"|"druid"|"profile" }`

### Onboarding
- `onboarding_step_viewed` `{ step: "splash"|"signin"|"birth_date"|"birth_time"|"birth_place"|"confirm" }`
- `auth_completed` `{ provider: "google"|"apple"|"facebook"|"guest" }`

### Today — Pager & Reading
- `today_pager_swiped` `{ to: "weekly"|"monthly"|"yearly" }`
- `read_more_clicked` `{ timeframe: "today"|"weekly"|"monthly"|"yearly" }`
- `horoscope_loaded` `{ timeframe: "daily"|"weekly"|"monthly"|"yearly", cache: "hit"|"miss" }`

### Premium Gating (blur + CTA)
- `paywall_shown` `{ trigger: "weekly"|"monthly"|"yearly"|"banner_<id>"|"compat" }`
- `upgrade_cta_clicked` `{ source: "pager_<timeframe>"|"banner_<id>"|"compat" }`

### Banners (Explore More)
- `banner_clicked` `{ id: string, target: "traits:<sign>"|"compat:<sign>"|"druid"|"chinese"|"premium" }`

### Traits / Characteristics
- `traits_sign_changed` `{ from: "<sign>", to: "<sign>" }`  // default open uses user.sign

### Compatibility
- `compatibility_calculated` `{ signA: "<userSign>", signB: "<otherSign>", overall: number }`
- `compat_viewed` `{ signB: "<otherSign>" }`

### Druid & Chinese
- `druid_viewed` `{ sign: "<druidSign>" }`
- `chinese_viewed` `{ animal: "<animal>" }`

### Monetization (Flitt)
- `purchase_initiated` `{ plan: "weekly"|"monthly"|"yearly", price_minor: number, currency: "GEL" }`
- `purchase_success` `{ plan: "...", price_minor: number, currency: "GEL", tx_id: string }`
- `purchase_failed` `{ plan: "...", reason: "cancelled"|"error" }`
- (Server-side only) `flitt_webhook_received` `{ tx_id, status: "paid"|"failed" }`

### Notifications
- `push_opened` `{ screen: "today"|"traits"|... }`

### Reliability
- `api_error` `{ endpoint: "/predictions/daily", code: 500 }`
- `screen_time_ms` `{ name: "today", ms: 14500 }`   // duration on screen

---

## 3) Routing Rules (deep links from banners)

- `traits:<sign>` → navigate to `/(tabs)/traits?sign=<sign>`
- `compat:<sign>` → navigate to `/(tabs)/compat?with=<sign>`
- `druid`         → `/(tabs)/druid`
- `chinese`       → `/(tabs)/druid?mode=chinese`
- `premium`       → `/paywall?src=banner_<id>`

Analytics:
- Fire `banner_clicked` **before** navigation.
- If `premium_required && !is_premium` → fire `paywall_shown` with `trigger:"banner_<id>"`.

---

## 4) Client Implementation (Expo, TypeScript)

Create these files:

services/analytics.ts
hooks/useAnalytics.ts

csharp
Copy code

### `services/analytics.ts`
```ts
// Minimal, clean analytics with batching, offline queue, sessioning
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type JSONObject = Record<string, any>;

const STORAGE_QUEUE = 'anl_queue_v1';
const STORAGE_SESSION = 'anl_session_v1';
const INSTALL_ID_KEY = 'install_id_v1';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

let installId: string;
let sessionId: string;
let lastEventTs = 0;
let queue: JSONObject[] = [];
let userProps: JSONObject = {};
let baseProps: JSONObject = {};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random()*16)|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

async function getInstallId() {
  const existing = await AsyncStorage.getItem(INSTALL_ID_KEY);
  if (existing) return existing;
  const iid = `iid_${uuid()}`;
  await AsyncStorage.setItem(INSTALL_ID_KEY, iid);
  return iid;
}

async function loadQueue() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_QUEUE);
    queue = raw ? JSON.parse(raw) : [];
  } catch { queue = []; }
}

async function saveQueue() {
  try { await AsyncStorage.setItem(STORAGE_QUEUE, JSON.stringify(queue)); } catch {}
}

function newSession(): string {
  return `s_${new Date().toISOString().slice(0,10)}_${uuid().slice(0,8)}`;
}

async function ensureSession() {
  const now = Date.now();
  if (!sessionId) {
    const raw = await AsyncStorage.getItem(STORAGE_SESSION);
    sessionId = raw || newSession();
    await AsyncStorage.setItem(STORAGE_SESSION, sessionId);
    lastEventTs = now;
    return;
  }
  if (now - lastEventTs > SESSION_TIMEOUT_MS) {
    sessionId = newSession();
    await AsyncStorage.setItem(STORAGE_SESSION, sessionId);
  }
  lastEventTs = now;
}

export async function initAnalytics(props: Partial<typeof baseProps> = {}) {
  installId = await getInstallId();
  await loadQueue();
  baseProps = {
    app_version: Application.nativeApplicationVersion ?? '0',
    build_number: Application.nativeBuildVersion ?? '0',
    platform: Platform.OS,
    locale: Device.locale ?? 'en-US',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
    ...props,
  };
  await ensureSession();
  drain().catch(()=>{});
}

export function setUserProps(up: JSONObject) {
  userProps = { ...userProps, ...up };
}

export async function track(event: string, params: JSONObject = {}) {
  await ensureSession();
  const payload = {
    event,
    ts: Date.now(),
    session_id: sessionId,
    user_id: userProps.user_id ?? null,
    install_id: installId,
    app_version: baseProps.app_version,
    build_number: baseProps.build_number,
    platform: baseProps.platform,
    locale: baseProps.locale,
    ab_variant: userProps.ab_variant,
    user_props: {
      is_premium: !!userProps.is_premium,
      sign: userProps.sign ?? null,
      druid_sign: userProps.druid_sign ?? null,
      chinese_animal: userProps.chinese_animal ?? null,
      tz: baseProps.tz,
    },
    params,
  };
  queue.push(payload);
  if (queue.length >= 10) drain().catch(()=>{});
  else saveQueue().catch(()=>{});
}

async function drain() {
  if (!queue.length) return;
  const batch = queue.slice(0, 25);
  try {
    const res = await fetch('/api/v1/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    queue = queue.slice(batch.length);
    await saveQueue();
    // Keep draining if more remain
    if (queue.length) setTimeout(()=> drain(), 250);
  } catch {
    // Retry later; keep queue
  }
}
hooks/useAnalytics.ts
ts
Copy code
import { useCallback } from 'react';
import { track, setUserProps } from '../services/analytics';

export function useAnalytics() {
  return {
    track: useCallback(track, []),
    setUserProps: useCallback(setUserProps, []),
  };
}
Usage examples (must be implemented in code):

ts
Copy code
// Today pager swipe
track('today_pager_swiped', { to: 'weekly' });

// Read more
track('read_more_clicked', { timeframe: 'today' });

// Banner press (before navigating)
track('banner_clicked', { id: 'premium_weekly', target: 'premium' });

// Paywall (blur CTA)
track('paywall_shown', { trigger: 'weekly' });

// Tab select
track('tab_selected', { tab: 'compat' });

// Compatibility calculated
track('compatibility_calculated', { signA: 'aries', signB: 'leo', overall: 86 });
Initialize once at app start (App.tsx/_layout):

ts
Copy code
await initAnalytics();
setUserProps({ user_id, is_premium, sign: 'aries' });
5) Server Ingestion (Django)
Endpoint: POST /api/v1/analytics/events

Body: [{...event1}, {...event2}, ...]

Validate: max 25 items per request; drop unknown keys; never block app on error.

Pydantic-like schema (pseudo):

python
Copy code
class Event(BaseModel):
    event: constr(strip_whitespace=True, min_length=2, max_length=64)
    ts: conint(ge=0)
    session_id: constr(min_length=3, max_length=64)
    user_id: Optional[str]
    install_id: str
    app_version: str
    build_number: str
    platform: Literal['ios','android']
    locale: str
    ab_variant: Optional[str]
    user_props: Dict[str, Any]
    params: Dict[str, Any]
Storage:

Append to BigQuery (or Postgres table analytics_events with JSONB payload).

Add partition on ts (day).

Enrich server-side: geo (coarse), device_agent (optional).

6) A/B Testing
User gets ab_variant once (server assigns; store in JWT or /users/me).

Fire exposure on first session:

ab_exposed { experiment: "paywall", variant: "v2" }

Include ab_variant in user_props for every event.

7) Privacy & PII
No email/phone in analytics.

Use pseudo user_id (JWT sub).

City-level geo only (server-side).

Respect OS privacy settings; add analytics_enabled toggle in Profile; if false → do not dispatch events (queue cleared).

8) Required Event Hooks (by feature)
Today Pager

On swipe → today_pager_swiped

On Today read more → read_more_clicked

On W/M/Y blur reveal/paywall → paywall_shown, upgrade_cta_clicked if tapped

Banners

On press → banner_clicked

If gated → paywall_shown

Traits

On tab open → screen_view { name:'traits' }

On sign change → traits_sign_changed

Compatibility

On open → screen_view { name:'compat' }

On calculate → compatibility_calculated

If premium CTA tapped → upgrade_cta_clicked { source:'compat' }

Druid/Chinese

On view → druid_viewed / chinese_viewed

Onboarding

Each step view → onboarding_step_viewed

On provider success → auth_completed

Monetization

Start checkout → purchase_initiated

Success/fail → purchase_success / purchase_failed

Server webhook → flitt_webhook_received (server only)

9) QA Checklist
 initAnalytics() runs once on app start; no crashes offline.

 Session rolls after 30m; session_id changes.

 All events include user_props.sign and is_premium.

 Today pager fires on every swipe to W/M/Y.

 Weekly/Monthly/Yearly blur+CTA triggers paywall_shown.

 Banners fire banner_clicked before navigation.

 Compatibility fires compatibility_calculated with % value.

 Purchases emit initiated/success/failed; webhook mirrored server-side.

 Profile toggle analytics_enabled=false disables sending (and clears queue).

10) Naming Conventions
snake_case for events and params.

Keep params flat (no nested objects).

Use stable enum strings (e.g., "weekly" not "wk").

Never log secrets or raw API responses.

11) Failure & Retry
Batch size ≤ 25; backoff 0.25s; keep queue ≤ 1,000 items (drop oldest beyond cap).

On app resume → call initAnalytics() to flush queue.

Endpoint 4xx: drop batch; 5xx: retry later.

12) Example Banner Mapping
content/banners.json record:

json
Copy code
{
  "id": "premium_weekly",
  "title": "✨ Unlock your Weekly Horoscope",
  "subtitle": "Deeper guidance awaits",
  "bullets": ["See career highlights", "Navigate relationships", "Make smarter moves"],
  "target": "premium",
  "premium_required": true
}
Client:

onPress → track('banner_clicked', { id:'premium_weekly', target:'premium' })

If not premium → track('paywall_shown', { trigger:'banner_premium_weekly' }) + navigate /paywall?src=banner_premium_weekly

13) Server → GA4/BigQuery Mapping (example)
Table: analytics.events_v1

Columns: event STRING, ts TIMESTAMP, session_id STRING, user_id STRING, install_id STRING, app_version STRING, build_number STRING, platform STRING, locale STRING, ab_variant STRING, user_props JSON, params JSON

Partition by DATE(TIMESTAMP_MILLIS(ts_ms)).

14) Non-Deletion Rule
Never delete or rename docs/ANALYTICS.md. If missing, recreate before coding.

pgsql
Copy code

### Where to put the code files it references

- `services/analytics.ts`  
- `hooks/useAnalytics.ts`

If you want, I can also paste **ready test calls** you can drop into your Today screen and Banner component to verify events are flowing.
::contentReference[oaicite:0]{index=0}