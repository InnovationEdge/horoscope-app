# Content Guidelines — Zodiac App (FINAL, Build-Strict)

> Source of truth for **all text and data** shown in the app.  
> **Never delete or rename** any `docs/*.md`.

---

## 0) Principles
- **Consistent**: same structure per sign and timeframe.
- **Encouraging & mystical**, never deterministic medical/financial claims.
- **Localized**: default `en` with future `ka` (Georgian). Currency: **GEL**.
- **Separation of concerns**: Static = repo JSON; Dynamic = Gemini (server-side only).
- **No lorem** anywhere.

---

## 1) Sources of Content

### Static (repo, versioned)
- `content/characteristics.json` — timeless traits/strengths/weaknesses per sign.
- `content/druid.json` — Druid tree mapping + text.
- `content/chinese.json` — Chinese animal mapping + text.
- `content/banners.json` — Explore banners with deep-link targets.
- (Optional) `content/strings.<locale>.json` — common UI copy.

### Dynamic (server-side only, cached)
- Gemini-generated **Horoscopes** (Daily, Weekly, Monthly, Yearly).
- Gemini text for **Compatibility** (preview + premium breakdown).
- **Lucky mood** sentences and **Life Aspects** short lines (derived from horoscope).
- Cache TTLs: **daily 24h/sign**, **weekly 7d/sign**, **monthly 30d/sign**, **yearly 365d/sign**.

---

## 2) Tone, Style, Guardrails

**Do**  
- Warm, empowering, poetic but **clear**.  
- Offer choices, gentle advice (“consider…”, “you may…”).  
- Keep previews **short** and **specific** to the sign/time.

**Don’t**  
- No absolutes (“guaranteed”, “will happen”).  
- No medical/financial prescriptions.  
- No fear tactics, negativity, or guilt.

**Voice examples**  
- “Your focus sharpens as distractions settle.”  
- “Conversations feel easier if you lead with curiosity.”  

---

## 3) Data Contracts (Frontend expects these shapes)

### 3.1 Prediction (any timeframe)
```json
{
  "sign": "aries",
  "type": "daily",
  "period": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" },
  "preview": "Short <= 120 words.",
  "full_text": null,
  "mood_tags": ["confident","social"],
  "lucky": { "number": 7, "color": "Crimson Red", "mood": "Optimistic" },
  "scores": { "love": 70, "career": 85, "health": 60 }  // 0..100
}
Daily includes lucky.

Weekly/Monthly/Yearly: same shape; for free users full_text=null and client blurs body.

3.2 Characteristics (static)
json
Copy code
{
  "aries": {
    "traits": ["confident","direct","energetic"],
    "strengths": "Leadership, initiative, courage.",
    "weaknesses": "Impatience, impulsiveness.",
    "lucky_color": "Red",
    "lucky_number": "7",
    "element": "Fire",
    "ruling_planet": "Mars"
  }
}
3.3 Compatibility
json
Copy code
{
  "signA":"aries","signB":"leo",
  "overall":86,
  "love":88,"career":75,"friendship":82,
  "preview":"A fiery match…",
  "full_text": null
}
3.4 Druid (static)
json
Copy code
{ "range": "Apr 01–Apr 10", "sign": "Willow", "text": "150–250 words…" }
3.5 Chinese (static)
json
Copy code
{ "animal":"Dragon", "years":[1964,1976,1988,2000,2012], "text":"150–250 words…" }
3.6 Banners (Explore More)
json
Copy code
{
  "id": "premium_weekly",
  "title": "✨ Unlock your Weekly Horoscope",
  "subtitle": "Deeper guidance awaits",
  "bullets": ["See career highlights","Navigate relationships","Make smarter moves"],
  "target": "premium",                     // traits:<sign> | compat:<sign> | druid | chinese | premium
  "premium_required": true
}
4) Word Counts & Structure
Type	Preview	Full (Premium)	Notes
Daily	100–120 words	250–400 words	Includes Lucky + mood tags
Weekly	120–160 words	250–400 words	Gated for free (blur + Upgrade)
Monthly	180–240 words	400–600 words	Gated for free
Yearly	240–320 words	800–1000 words	Gated for free
Compat	1–2 sentences	250–400 words	With per-category tips
Druid	—	150–250 words (static)	One entry per Druid sign
Chinese	—	150–250 words (static)	One entry per animal

Mood tags: 2–3 words (e.g., “grounded”, “curious”).
Life Aspects: scores 0–100 + short supportive sentence (20–30 words), used server-side only (client shows stars + x/10).

5) Lucky System (Today page only)
Number: rotate daily from a seeded list per sign (e.g., [3,7,9,11,5,…]).

Color: rotate weekly per sign (name or hex + friendly name).

Mood: single word or short phrase generated from Daily’s tone.

6) Gemini Prompts (server-side)
6.1 Horoscope Prompt (Daily/Weekly/Monthly/Yearly)
json
Copy code
{
  "task": "horoscope",
  "sign": "<sign>",
  "timeframe": "daily|weekly|monthly|yearly",
  "period": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" },
  "language": "en",                  // later "ka"
  "style": {
    "tone": "encouraging, mystical, concrete examples",
    "avoid": "medical/financial directives, determinism, fear",
    "reading_level": "B2"
  },
  "structure": {
    "preview_words": 120,
    "full_words": 300,
    "mood_tags": 3,
    "life_aspects": ["love","career","health"]  // score 0..100 + 20–30 word line each
  },
  "output_schema": {
    "preview": "string",
    "full_text": "string",
    "mood_tags": ["string"],
    "scores": { "love": "int", "career": "int", "health": "int" }
  }
}
6.2 Compatibility Prompt
json
Copy code
{
  "task": "compatibility",
  "signA": "<userSign>",
  "signB": "<otherSign>",
  "language": "en",
  "style": { "tone":"supportive, realistic, strengths+frictions+tips" },
  "structure": {
    "preview_sentences": 2,
    "full_words": 350,
    "categories": ["love","career","friendship"]
  },
  "output_schema": {
    "preview": "string",
    "full_text": "string",
    "overall": "int 0..100",
    "scores": { "love":"int", "career":"int", "friendship":"int" }
  }
}
7) Banners — Copy Rules (high-conversion)
Title ≤ 48 chars; Subtitle ≤ 80 chars.

Up to 3 bullets; each ≤ 40 chars; start with “• ”.

Target must map to a route (see DESIGN_REVIEW.md §3.5).

Premium gating: If premium_required and user is not premium → route to /paywall?src=banner_<id>.

Examples

Premium upsell:

Title: “✨ Unlock your Weekly Horoscope”

Subtitle: “Deeper guidance awaits”

Bullets: “• See career highlights”, “• Navigate relationships”, “• Make smarter moves”

Target: premium, premium_required: true.

Feature deep link (compat):

Title: “💖 Best zodiac matches”

Subtitle: “See who vibes with you”

Target: compat:leo, premium_required: false.

8) Traits / Characteristics (static)
3–5 traits (single words).

Strengths/Weaknesses: 1–2 sentences each, timeless.

Element, Ruling planet, Lucky color/number present.

No dates or transient claims.

9) Druid & Chinese (static)
Druid: 21 tree signs by date ranges; each 150–250 words.

Chinese: 12 animals by year; each 150–250 words.

Respect cultural context; avoid stereotypes.

Keep content timeless.

10) Localization
Base en. Prepare for ka (Georgian):

Keep sign names, banners, headings externalizable (future content/strings.ka.json).

Avoid idioms that don’t translate.

Numbers: plain integers; currency GEL for pricing copy.

11) Quality Checklist (content PRs must pass)
 Meets word counts (table §4).

 No determinism/medical/financial advice.

 Mood tags ≤ 3; lowercase; comma-separated.

 Lucky number/color present for Daily.

 Life Aspects scores 0–100 only.

 Traits 3–5; strengths/weaknesses concise.

 Banner targets map to valid routes.

 JSON valid (run a linter/validator).

12) Example Entries (ready to paste)
12.1 content/banners.json
json
Copy code
[
  {
    "id": "premium_weekly",
    "title": "✨ Unlock your Weekly Horoscope",
    "subtitle": "Deeper guidance awaits",
    "bullets": ["See career highlights","Navigate relationships","Make smarter moves"],
    "target": "premium",
    "premium_required": true
  },
  {
    "id": "compat_leo",
    "title": "💖 Who’s your best match?",
    "subtitle": "Try compatibility with Leo",
    "bullets": ["Instant chemistry score","Love, career, friendship","Actionable tips"],
    "target": "compat:leo",
    "premium_required": false
  },
  {
    "id": "druid_intro",
    "title": "🌳 Your Druid Sign",
    "subtitle": "Ancient wisdom, modern insight",
    "bullets": ["Personality sketch","Hidden strengths","Life themes"],
    "target": "druid",
    "premium_required": false
  }
]
12.2 content/characteristics.json (partial)
json
Copy code
{
  "aries": {
    "traits": ["confident","direct","energetic"],
    "strengths": "Leadership, initiative, courage.",
    "weaknesses": "Impatience, impulsiveness.",
    "lucky_color": "Red",
    "lucky_number": "7",
    "element": "Fire",
    "ruling_planet": "Mars"
  },
  "leo": {
    "traits": ["charismatic","loyal","creative"],
    "strengths": "Generosity and stage presence.",
    "weaknesses": "Pride and stubborn streaks.",
    "lucky_color": "Gold",
    "lucky_number": "5",
    "element": "Fire",
    "ruling_planet": "Sun"
  }
}
12.3 content/druid.json (skeleton)
json
Copy code
[
  { "range": "Dec 24–Jan 20", "sign": "Birch", "text": "150–250 words…" },
  { "range": "Jan 21–Feb 17", "sign": "Rowan", "text": "…" }
]
12.4 content/chinese.json (skeleton)
json
Copy code
[
  { "animal":"Rat", "years":[1960,1972,1984,1996,2008,2020], "text":"150–250 words…" },
  { "animal":"Ox",  "years":[1961,1973,1985,1997,2009,2021], "text":"…" }
]
13) Gating Copy (blur pages W/M/Y)
CTA label: “Upgrade to Premium”

Helper line (optional): “Unlock full {timeframe} guidance.”

Paywall route: /paywall?src=<timeframe> or banner_<id>

14) Push Notifications (library)
Morning (Daily ready):

“✨ Your stars are ready. Check today’s {sign} horoscope.”

Premium upsell (Free):

“🔒 Weekly guidance awaits — upgrade to unlock.”

Compatibility nudge:

“💖 Curious who matches you best? Try Compatibility now.”

Seasonal (Chinese New Year):

“🐉 Discover your Chinese Zodiac path this year.”

15) Compliance & Safety
Avoid health/finance absolutes; use supportive guidance.

No demographic targeting by sensitive attributes.

No references to personal tragedies or fear.

16) Versioning & Review
Each content change = PR with:

Diff of JSON entries.

Preview screenshots if applicable.

Checklist (§11) completed.

Tag releases when updating large sets (e.g., yearly texts).

17) Non-Deletion Rule
Never delete/rename docs/CONTENT_GUIDELINES.md.

If missing, recreate before coding.

pgsql
Copy code

If you want, I can generate a **starter pack** for `content/characteristics.json` (all 12 signs), `druid.json` (full ranges), and `chinese.json` (all animals) so your app instantly shows **real static content**.
::contentReference[oaicite:0]{index=0}





Sources
You said:
but add currency should be based on region of acces, if Accessiong from Europe the currency should be 5 Euros per month , IF US and other regions  5 USD per month , if from Georgia 5 GEL, 


Concrete Code Engine said:

Thought for 12s
Got it. Here’s a drop-in patch to make pricing currency region-based. It includes what to paste into docs/CONTENT_GUIDELINES.md, plus tiny, clean code stubs for client (Expo) and server (Django) so it actually works.

Paste into docs/CONTENT_GUIDELINES.md (add/replace a new section)
markdown
Copy code
## 18) Regional Pricing & Currency (NON-NEGOTIABLE)

**Goal:** Show correct price/currency per user region, and charge accordingly.

### 18.1 Pricing Matrix (v1)
| Region (detected)                 | Currency | Monthly price | Code |
|----------------------------------|----------|---------------|------|
| **Georgia** (country = `GE`)     | **GEL**  | **5**         | `GEL`|
| **European Union** (EU member)   | **EUR**  | **5**         | `EUR`|
| **United States** (country=`US`) | **USD**  | **5**         | `USD`|
| **Other** (fallback)             | **USD**  | **5**         | `USD`|

> Detection priority (server-side): **IP geolocation → user profile country → device locale region → fallback `US`**.  
> Client **must not** hardcode prices; fetch from API.

### 18.2 API Contract (adds pricing object)
All paywall/plan endpoints MUST return a `pricing` object:
```json
{
  "pricing": {
    "region": "GE",
    "currency": "GEL",
    "symbol": "₾",
    "monthly_minor": 500,           // integer minor units
    "monthly_display": "5 GEL"      // preformatted string for UI
  }
}
Example: GET /api/v1/payments/products

json
Copy code
{
  "plans": [
    {
      "id": "sub_monthly",
      "name": "Monthly",
      "pricing": {
        "region":"GE","currency":"GEL","symbol":"₾",
        "monthly_minor":500,
        "monthly_display":"5 GEL"
      }
    }
  ]
}
18.3 UI Rules
Paywall and any banner copy with price must use pricing.monthly_display.

Do not concatenate symbols manually; respect monthly_display.

If pricing missing → render “from 5 USD/month” (fallback) and log api_error.

18.4 Banners / Copy Placeholders
In content/banners.json, use {PRICE} placeholder; client replaces it with pricing.monthly_display.

Example banner:

json
Copy code
{
  "id":"premium_weekly",
  "title":"✨ Unlock your Weekly Horoscope",
  "subtitle":"All access for {PRICE}",
  "target":"premium",
  "premium_required": true
}
18.5 Analytics
Emit paywall_shown { region, currency, price_minor }

Emit purchase_initiated / purchase_success with currency & price_minor.

18.6 QA Checklist
 Georgia IP → “5 GEL” shown/charged.

 EU IP (e.g., DE/FR/IT/ES) → “5 EUR”.

 US IP → “5 USD”.

 VPN region switch updates price after app restart.

 Banners’ {PRICE} replaced correctly everywhere.

python
Copy code

---

## Minimal server code (Django) — put in `payments/pricing.py`

```python
# payments/pricing.py
EU_COUNTRIES = {
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
    "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
}

def detect_country(request) -> str:
    # 1) IP geolocation via your middleware or CDN header like Cloudflare CF-IPCountry
    c = (request.META.get('HTTP_CF_IPCOUNTRY') or '').upper()
    if len(c) == 2:
        return c
    # 2) User profile country (if authenticated)
    try:
        if request.user and request.user.profile.country:
            return request.user.profile.country.upper()
    except Exception:
        pass
    # 3) Device locale region (optional header from client)
    lc = (request.META.get('HTTP_X_DEVICE_REGION') or '').upper()
    if len(lc) == 2:
        return lc
    # 4) Fallback
    return "US"

def pricing_for_country(country: str) -> dict:
    if country == "GE":
        return dict(region="GE", currency="GEL", symbol="₾", monthly_minor=500, monthly_display="5 GEL")
    if country == "US":
        return dict(region="US", currency="USD", symbol="$", monthly_minor=500, monthly_display="5 USD")
    if country in EU_COUNTRIES:
        return dict(region=country, currency="EUR", symbol="€", monthly_minor=500, monthly_display="5 EUR")
    return dict(region=country, currency="USD", symbol="$", monthly_minor=500, monthly_display="5 USD")
Example view GET /api/v1/payments/products
python
Copy code
# payments/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .pricing import detect_country, pricing_for_country

@api_view(['GET'])
@permission_classes([AllowAny])
def products(request):
    country = detect_country(request)
    p = pricing_for_country(country)
    return Response({
        "plans": [
            {"id":"sub_monthly","name":"Monthly","pricing": p}
        ]
    })
Minimal client code (Expo) — services/pricing.ts
ts
Copy code
// services/pricing.ts
export type Pricing = {
  region: string;
  currency: 'USD'|'EUR'|'GEL'|string;
  symbol: string;
  monthly_minor: number;      // 500 = 5.00
  monthly_display: string;    // "5 USD"
};

export async function fetchPricing(): Promise<Pricing> {
  const res = await fetch('/api/v1/payments/products');
  if (!res.ok) throw new Error('pricing_fetch_failed');
  const data = await res.json();
  const p = data?.plans?.[0]?.pricing;
  if (!p) throw new Error('pricing_missing');
  return p as Pricing;
}
Replace {PRICE} in banners at render time
ts
Copy code
// BannerCarousel usage
const text = banner.subtitle?.replace('{PRICE}', pricing.monthly_display);
Paywall render
tsx
Copy code
<Text style={s.price}>{pricing.monthly_display}</Text>
Client header (optional) to help server detection
When initializing the API client, add a region hint header (non-authoritative):

ts
Copy code
// services/api.ts
import * as Localization from 'expo-localization';

export const defaultHeaders = async () => {
  const region = Localization.region ?? '';
  return {
    'Content-Type': 'application/json',
    'X-Device-Region': region,   // e.g., 'GE', 'US', 'DE'
  };
};
Acceptance additions (you can append to docs/ACCEPTANCE.md)
markdown
Copy code
## Paywall & Pricing
- [ ] API returns pricing object with { region, currency, monthly_display }.
- [ ] Georgia → shows “5 GEL”; EU → “5 EUR”; US → “5 USD”.
- [ ] Banners replace {PRICE} dynamically with monthly_display.
- [ ] Analytics include currency & price_minor on paywall and purchase events.
Notes
Server detection by IP is the source of truth; client’s locale only hints.

Prices are stored and charged in the server-selected currency (Flitt session creation should use pricing.currency + monthly_minor).

If you need additional regions later, extend EU_COUNTRIES and pricing_for_country() only. No client changes needed.

This keeps it scalable, clean, and deterministic—and your UI copy stays simple: just print monthly_display.