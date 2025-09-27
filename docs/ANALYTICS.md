# Analytics Spec — Zodiac App (FINAL BLUEPRINT)

> **Goal**: Every user interaction is measurable, consistent, and scalable.  
> **Principles**: No PII, flat schemas, offline-safe, always reproducible.  
> **Rule**: Never delete or rename this file. If missing, recreate before coding.

---

## 0) Stack & Transport

- **Client**: React Native (Expo).
- **Queue**: AsyncStorage, max 1,000 events, drop oldest.
- **Batch**: ≤25 events per POST.
- **Endpoint**: `POST /api/v1/analytics/events` (Django backend).
- **Downstream**: BigQuery (or GA4 mirror).
- **Dispatch**: Background, retries with backoff, flush on resume/exit.
- **Session**: 30 min inactivity window → new `session_id`.

---

## 1) Global Event Payload (all events)

| Field          | Type    | Example                   | Notes                   |
| -------------- | ------- | ------------------------- | ----------------------- |
| `event`        | string  | `"tab_selected"`          | Canonical name          |
| `ts`           | int     | `1732645123456`           | Epoch ms (client clock) |
| `session_id`   | string  | `"s_2025-09-26_ab12cd34"` | Rolls after inactivity  |
| `user_id`      | string? | `"u_9f3..."` or null      | From JWT sub            |
| `install_id`   | string  | `"iid_f83e..."`           | Stable per install      |
| `app_version`  | string  | `"1.0.0"`                 | app.json                |
| `build_number` | string  | `"100"`                   | app.json                |
| `platform`     | string  | `"ios"` / `"android"`     | RN Platform             |
| `locale`       | string  | `"en-US"`                 | Device locale           |
| `region`       | string? | `"GE"` / `"US"`           | Server-enriched         |
| `ab_variant`   | string? | `"paywall_v2"`            | For A/B tests           |
| `user_props`   | object  | See below                 | Small, stable           |
| `params`       | object  | Event-specific data       | Flat JSON               |

### `user_props` (attached everywhere)

```json
{
  "is_premium": true,
  "sign": "aries",
  "druid_sign": "oak",
  "chinese_animal": "dragon",
  "tz": "Asia/Tbilisi"
}
2) Event Catalog (authoritative)
⚠️ Do not rename. Only add new fields.

Navigation & Screens
screen_view { name: "today"|"traits"|"compat"|"druid"|"profile"|"onboarding_<step>" }

tab_selected { tab: "today"|"traits"|"compat"|"druid"|"profile" }

Onboarding
onboarding_step_viewed { step: "splash"|"signin"|"birth_date"|"birth_time"|"birth_place"|"confirm" }

auth_completed { provider: "google"|"apple"|"facebook"|"guest" }

Today (Pager & Reading)
today_pager_swiped { to: "weekly"|"monthly"|"yearly" }

read_more_clicked { timeframe: "today"|"weekly"|"monthly"|"yearly" }

horoscope_loaded { timeframe: "daily"|"weekly"|"monthly"|"yearly", cache: "hit"|"miss" }

Premium Gating
paywall_shown { trigger: "weekly"|"monthly"|"yearly"|"banner_<id>"|"compat" }

upgrade_cta_clicked { source: "pager_<timeframe>"|"banner_<id>"|"compat" }

Banners (Explore More)
banner_clicked { id: "<id>", target: "traits:<sign>"|"compat:<sign>"|"druid"|"chinese"|"premium" }

Traits / Characteristics
traits_sign_changed { from: "<sign>", to: "<sign>" }

Compatibility
compatibility_calculated { signA: "<userSign>", signB: "<otherSign>", overall: number }

compat_viewed { signB: "<otherSign>" }

Druid & Chinese
druid_viewed { sign: "<druidSign>" }

chinese_viewed { animal: "<animal>" }

Monetization (Flitt PSP)
purchase_initiated { plan: "weekly"|"monthly"|"yearly", price_minor: number, currency: "USD|EUR|GEL" }

purchase_success { plan, price_minor, currency, tx_id }

purchase_failed { plan, reason: "cancelled"|"error" }

(Server only) flitt_webhook_received { tx_id, status: "paid"|"failed" }

Notifications
push_opened { screen: "today"|"traits"|"compat"|"druid"|"profile" }

Reliability
api_error { endpoint: "/predictions/daily", code: 500 }

screen_time_ms { name: "today", ms: 14500 }

3) Routing Rules (Banners)
traits:<sign> → /(tabs)/traits?sign=<sign>

compat:<sign> → /(tabs)/compat?with=<sign>

druid → /(tabs)/druid

chinese → /(tabs)/druid?mode=chinese

premium → /paywall?src=banner_<id>

Analytics:

Fire banner_clicked before navigation.

If gated → also fire paywall_shown.

4) Client Implementation (Expo)
Files to create
services/analytics.ts → batching, queue, transport.

hooks/useAnalytics.ts → React hook wrapper.

Usage examples
ts
Copy code
track('today_pager_swiped', { to: 'weekly' });
track('read_more_clicked', { timeframe: 'today' });
track('banner_clicked', { id: 'premium_weekly', target: 'premium' });
track('paywall_shown', { trigger: 'weekly' });
track('compatibility_calculated', { signA: 'aries', signB: 'leo', overall: 86 });
Init once at app start:

ts
Copy code
await initAnalytics();
setUserProps({ user_id, is_premium, sign: 'aries' });
5) Server-Side (Django)
Endpoint: POST /api/v1/analytics/events

Batch size: ≤25 items.

Schema: Validate with Pydantic-like model. Drop unknown keys.

Storage: BigQuery or Postgres JSONB. Partition by DATE(ts).

Enrich: region (IP → country), device_agent (optional).

6) A/B Testing
Assign ab_variant once per user (JWT or /users/me).

Fire ab_exposed { experiment, variant } once.

Include ab_variant in all subsequent events.

7) Privacy & Controls
No email/phone in analytics.

Only stable IDs (user_id, install_id).

Respect system privacy toggle.

Add Profile setting: analytics_enabled=false → flush + stop sending.

8) QA Checklist
 initAnalytics() runs once without crash.

 Session ID rolls after 30m inactivity.

 Every event includes sign + is_premium.

 Today pager → fires today_pager_swiped.

 Weekly/Monthly/Yearly blur → paywall_shown.

 Banners fire banner_clicked then navigate.

 Compatibility → compatibility_calculated.

 Purchases emit initiated/success/failed.

 Profile toggle disables analytics.

9) Non-Deletion Rule
Never delete or rename docs/analytics.md.

If missing, recreate immediately before continuing dev.

pgsql
Copy code

---

This version is **clean, event-complete, and ready for Claude to wire into your RN app**.

👉 Do you want me to also generate the **boilerplate `services/analytics.ts` + `hooks/useAnalytics.ts` code** as separate `.ts` files so you can drop them directly into your repo?


```
