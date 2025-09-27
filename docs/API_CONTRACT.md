# API Contract — Zodiac App (FINAL)

> **Rule**: This file is the **single source of truth** for all API shapes.  
> **Do not delete or rename.** If missing, recreate before coding.

All endpoints are **JSON REST**, prefixed with `/api/v1/`.  
Auth is **JWT Bearer** unless noted.  
Errors use standard format:

```json
{ "error": { "code": "string", "message": "string" } }
0) Auth & User
POST /auth/signup
json
Copy code
{ "provider": "apple|google|facebook|guest", "token": "..." }
→

json
Copy code
{ "jwt": "eyJhbGci...", "user": { "id": "u_123", "is_premium": false } }
GET /users/me
Headers: Authorization: Bearer <jwt>
→

json
Copy code
{
  "id": "u_123",
  "sign": "aries",
  "birth_date": "1996-03-21",
  "birth_time": "12:00",
  "birth_place": "Tbilisi",
  "is_premium": true,
  "premium_until": "2026-03-21",
  "druid_sign": "oak",
  "chinese_animal": "dragon"
}
PATCH /users/me
json
Copy code
{ "birth_date": "1996-03-21", "birth_time": "13:00", "birth_place": "Paris" }
→ 200 OK

1) Predictions
GET /predictions/daily?sign=aries&date=2025-09-27
→

json
Copy code
{
  "sign": "aries",
  "date": "2025-09-27",
  "text": "Today brings powerful energy...",
  "lucky_number": 7,
  "lucky_color": "Crimson Red",
  "mood": "Confident",
  "aspects": { "love": 80, "career": 74, "health": 91 }
}
GET /predictions/weekly?sign=aries&week=2025-W39
→

json
Copy code
{
  "sign": "aries",
  "week": "2025-W39",
  "text": "This week focuses on building lasting foundations...",
  "premium": true
}
GET /predictions/monthly?sign=aries&month=2025-09
→ same shape as weekly

GET /predictions/yearly?sign=aries&year=2025
→ same shape as weekly

Rules:

If premium: true and user.is_premium=false → text is blurred client-side + trigger /paywall.

Daily is always free.

2) Traits (Static)
Source: content/characteristics.json (bundled, no API).
Example entry:

json
Copy code
{
  "sign": "aries",
  "traits": ["confident", "dynamic", "impulsive"],
  "strengths": ["leadership", "courage"],
  "weaknesses": ["impatience", "stubbornness"],
  "element": "Fire",
  "planet": "Mars",
  "lucky_color": "Red",
  "lucky_number": 7
}
3) Compatibility
POST /compatibility
json
Copy code
{ "signA": "aries", "signB": "leo" }
→

json
Copy code
{
  "signA": "aries",
  "signB": "leo",
  "overall": 86,
  "categories": {
    "love": 90,
    "career": 70,
    "friendship": 80
  },
  "preview": "A strong match with fiery chemistry.",
  "premium_text": "For Aries and Leo, 2025 will bring..."
}
Rules:

Free tier → return only overall, categories, preview.

Premium tier → include premium_text (250–400 words).

4) Druid & Chinese (Static JSON)
Bundled under /content/.

content/druid.json
json
Copy code
{ "oak": { "date_range": "Jun 10 – Jun 20", "text": "Oak people are strong..." } }
content/chinese.json
json
Copy code
{ "dragon": { "years": [1976,1988,2000,2012], "text": "Dragons are ambitious..." } }
Frontend maps birth date/year → correct entry.

5) Banners (Promotions)
GET /banners
→

json
Copy code
[
  {
    "id": "premium_weekly",
    "title": "✨ Unlock your Weekly Horoscope",
    "subtitle": "Deeper guidance awaits",
    "bullets": ["See career highlights", "Navigate relationships", "Make smarter moves"],
    "target": "premium",
    "premium_required": true
  },
  {
    "id": "compat_leo",
    "title": "💖 Who’s your best match?",
    "subtitle": "Try compatibility with Leo",
    "bullets": ["Instant chemistry score", "Actionable tips"],
    "target": "compat:leo",
    "premium_required": false
  }
]
Rules:

Client must fire banner_clicked before navigation.

If premium_required && !is_premium → redirect to /paywall.

6) Paywall & Payments (Flitt PSP)
POST /payments/checkout
json
Copy code
{ "plan": "monthly", "currency": "USD" }
→

json
Copy code
{ "checkout_url": "https://flitt.io/pay/tx_abc123" }
POST /payments/webhook (server→server)
json
Copy code
{ "tx_id": "tx_abc123", "status": "paid", "plan": "monthly", "currency": "USD" }
Plans
Weekly: $2.49

Monthly: $5 (region-aware: €5 in EU, ₾5 in Georgia, $5 in US/rest)

Yearly: $49

7) Analytics Endpoint
POST /analytics/events
Body: array of events (see analytics.md).

json
Copy code
[
  {
    "event": "tab_selected",
    "ts": 1732645123456,
    "session_id": "s_...",
    "install_id": "iid_...",
    "app_version": "1.0.0",
    "user_props": { "sign": "aries", "is_premium": false },
    "params": { "tab": "today" }
  }
]
Response: 200 OK

8) Error Codes
AUTH_REQUIRED → 401

PREMIUM_REQUIRED → 402

INVALID_SIGN → 400

RATE_LIMIT → 429

SERVER_ERROR → 500

9) Non-Deletion Rule
Never delete or rename docs/api_contract.md.

If missing, recreate before implementation.

yaml
Copy code

---

✅ This gives Claude **zero ambiguity** about API requests/responses, premium gating, static content, banners, and payments.

Do you want me to now also generate **`content/characteristics.json`, `druid.json`, and `chinese.json` stubs** (empty but structured) so your repo is fully aligned with this contract?



```
