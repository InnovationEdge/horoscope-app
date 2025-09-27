# Content Guidelines — Zodiac App (FINAL, Build-Strict, Full)

> **Purpose:** One source of truth for **all** text and static content.  
> **Hard rules:**
>
> - No lorem in code. All content comes from `content/*.json` or API.
> - Never delete/rename any `docs/*.md`.
> - Respect `ACCEPTANCE.md` for UI behavior (blur/CTA, layouts).
> - Region-aware pricing strings come from API (do not construct on client).

---

## 0) Voice, Style, Editorial

**Tone:** Warm, encouraging, grounded. No doom.  
**POV:** Second person (“you”).  
**Reading level:** CEFR B2 (~Grade 7–9).  
**Formatting:** Short paragraphs (max 3 sentences each). No emoji spam (≤2 per section).  
**Inclusivity:** Gender-neutral; culture-agnostic; avoid stereotypes.  
**Actionability:** End each daily/weekly section with 1 actionable tip.

---

## 1) Canonical Sign Metadata (static)

Source of truth for sign names, emojis, date ranges, and accent colors used in avatars and chips. Store in `constants/signs.ts` **and** duplicate the non-visual parts (emoji, date_range) in `content/characteristics.json`.

| Sign        | Key           | Emoji | Date Range (inclusive) | Accent Hex |
| ----------- | ------------- | ----: | ---------------------- | ---------- |
| Aries       | `aries`       |    ♈ | Mar 21 – Apr 19        | `#FF6B6B`  |
| Taurus      | `taurus`      |    ♉ | Apr 20 – May 20        | `#8BC34A`  |
| Gemini      | `gemini`      |    ♊ | May 21 – Jun 20        | `#4DD0E1`  |
| Cancer      | `cancer`      |    ♋ | Jun 21 – Jul 22        | `#81D4FA`  |
| Leo         | `leo`         |    ♌ | Jul 23 – Aug 22        | `#FBC02D`  |
| Virgo       | `virgo`       |    ♍ | Aug 23 – Sep 22        | `#A5D6A7`  |
| Libra       | `libra`       |    ♎ | Sep 23 – Oct 22        | `#BA68C8`  |
| Scorpio     | `scorpio`     |    ♏ | Oct 23 – Nov 21        | `#9575CD`  |
| Sagittarius | `sagittarius` |    ♐ | Nov 22 – Dec 21        | `#FFB74D`  |
| Capricorn   | `capricorn`   |    ♑ | Dec 22 – Jan 19        | `#90A4AE`  |
| Aquarius    | `aquarius`    |    ♒ | Jan 20 – Feb 18        | `#4FC3F7`  |
| Pisces      | `pisces`      |    ♓ | Feb 19 – Mar 20        | `#64B5F6`  |

**Usage rules**

- Emoji size = 32dp inside 48dp circle with **accent @ 20% opacity** (avatar background).
- Never hardcode dates in components; read from JSON where copy references them.

---

## 2) Copy Lengths & Structures (authoritative)

| Type    | Free/Premium |        Length | Structure                                                 |
| ------- | ------------ | ------------: | --------------------------------------------------------- |
| Daily   | Free         |  80–120 words | 2–3 short paragraphs; actionable closing.                 |
| Weekly  | Premium      | 200–300 words | 3–5 paragraphs; themes + specific tip.                    |
| Monthly | Premium      | 250–350 words | 4–6 paragraphs; domains (love/career/health).             |
| Yearly  | Premium      | 500–700 words | Sections: Themes, Growth, Relationships, Work, Wellbeing. |

**Lucky row (Daily only):** `{ "lucky_number": int, "lucky_color": "string", "mood": "string" }`  
**Life aspects (Daily only):** scores 0–100 for `love`, `career`, `health`.

---

## 3) JSON Schemas (strict)

### 3.1 `content/characteristics.json`

```json
{
  "$schema": "https://example.com/zodiac/characteristics.schema.json",
  "signs": [
    {
      "sign": "aries",
      "emoji": "♈",
      "date_range": "Mar 21 – Apr 19",
      "traits": ["confident","dynamic","impulsive"],
      "strengths": ["leadership","courage","independence"],
      "weaknesses": ["impatience","stubbornness","restlessness"],
      "element": "Fire",
      "planet": "Mars",
      "lucky_color": "Red",
      "lucky_number": 7
    }
  ]
}
3.2 content/compatibility.json
json
Copy code
{
  "$schema": "https://example.com/zodiac/compatibility.schema.json",
  "pairs": [
    {
      "signA": "aries",
      "signB": "leo",
      "overall": 86,
      "love": 90,
      "career": 70,
      "friendship": 80,
      "preview": "A strong match with fiery chemistry.",
      "premium_text": "Aries and Leo share a bold fire energy..."
    }
  ]
}
3.3 content/druid.json
json
Copy code
{
  "$schema": "https://example.com/zodiac/druid.schema.json",
  "map": {
    "oak": {
      "date_range": "Jun 10 – Jun 20",
      "text": "Oak people are grounded and resilient..."
    }
  }
}
3.4 content/chinese.json
json
Copy code
{
  "$schema": "https://example.com/zodiac/chinese.schema.json",
  "map": {
    "dragon": {
      "years": [1976, 1988, 2000, 2012, 2024],
      "text": "Dragons are ambitious, charismatic and forward-looking..."
    }
  }
}
3.5 content/banners.json
json
Copy code
{
  "$schema": "https://example.com/zodiac/banners.schema.json",
  "items": [
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
      "bullets": ["Instant chemistry score","Actionable tips"],
      "target": "compat:leo",
      "premium_required": false
    }
  ]
}
4) API Contracts (copy-relevant)
Daily /predictions/daily?sign=<sign>&date=YYYY-MM-DD

json
Copy code
{
  "sign":"aries",
  "date":"2025-09-27",
  "text":"Today brings powerful energy...",
  "lucky_number":7,
  "lucky_color":"Crimson Red",
  "mood":"Confident",
  "aspects":{"love":80,"career":74,"health":91}
}
Weekly/Monthly/Yearly include: text and premium:true. Client blurs text for non-premium.

5) Premium Gating Content Rules
Non-premium: Weekly/Monthly/Yearly text is blurred but occupies correct height. CTA label exactly: “Upgrade to Premium”.

Any interaction (tap body/read more/CTA/swipe) on W/M/Y triggers paywall route and paywall_shown.

Compatibility: Free shows preview; premium reveals premium_text (250–400 words).

No alternate wording—exact strings only.

6) Naming & Microcopy (exact strings)
App title: “Salamene Horoscope”

Today card titles:

Today: “Today’s Horoscope”

Weekly: “This Week’s Horoscope”

Monthly: “This Month’s Horoscope”

Yearly: “Your Year Ahead”

Buttons/CTAs:

“Read more ▾” / “Read less ▴”

“Upgrade to Premium”

“Calculate Match”

“Continue”, “Continue without account”

Empty state: “Your horoscope will be ready soon 🌌.”

7) Onboarding Content (fixed)
Splash/Signin

Title: “Salamene Horoscope”

Subtitle: “Discover your zodiac journey”

Buttons: Continue, Continue without account

Birth Date/Time/Place

Q: “When were you born?”

Q: “What time were you born?” + toggle “I don’t remember” (defaults 12:00)

Q: “Where were you born?” (optional)

Confirm

“You are a(n) <Sign> <Emoji> — ready to see your horoscope?”

8) Push Notifications (templates)
Daily reminder:

Title: “Your daily insight awaits”

Body: “Tap for Today’s <Sign> reading ✨”

Premium nudge (weekly):

Title: “Unlock your week”

Body: “Full Weekly Horoscope for {PRICE} — upgrade now.”

Compatibility teaser:

Title: “Who matches your fire?”

Body: “Try compatibility with {SignB} 💖”

Replace {PRICE} with pricing.monthly_display from API.

9) Pricing & Currency (region-aware)
Source of truth: /payments/products →

json
Copy code
{
  "plans":[
    {"id":"sub_monthly","name":"Monthly","pricing":{
      "region":"GE","currency":"GEL","symbol":"₾",
      "monthly_minor":500,"monthly_display":"5 GEL"
    }}
  ]
}
Client rules

Always display monthly_display.

Replace banner {PRICE} placeholders at render time.

Fallback if missing: “from 5 USD/month” + fire api_error.

10) LLM Content (Gemini) — Prompt Templates
Daily (free)
System: “You are an astrologer writing concise, supportive daily horoscopes.”
User:

pgsql
Copy code
Write a daily horoscope for {SIGN} for {DATE}.
Constraints: 80–120 words, 2–3 paragraphs, positive tone, second person, 1 actionable tip at end.
Output JSON with keys: text, lucky_number (int), lucky_color (string), mood (string),
aspects { love:0..100, career:0..100, health:0..100 }.
Weekly/Monthly/Yearly (premium)
System: “You write premium, insightful forecasts with clear structure.”
User:

css
Copy code
Write a {TIMEFRAME} horoscope for {SIGN} covering themes in love, career, and wellbeing.
Length: {LENGTH_WORDS} words. Second person. 1–2 subtle emojis max.
Return JSON: { "text": "<string>" }.
Compatibility (premium_text)

arduino
Copy code
Generate a 250–400 word compatibility analysis for {SIGN_A} and {SIGN_B}.
Sections: chemistry, strengths, friction, tips. Second person, supportive tone.
Return { "premium_text": "<string>" }.
Validation (client/server)

Enforce length bounds; strip unsafe HTML; collapse whitespace.

Clamp aspects to 0–100; re-calc stars client-side.

11) Caching & Freshness
Daily: cache 24h per sign.

Weekly: per ISO week (e.g., 2025-W39), cache 7d.

Monthly: per YYYY-MM, cache 30d.

Yearly: per YYYY, cache 365d.

Traits/Druid/Chinese/Banners: static bundle (version with app).

If cache expired and API fails → show last cached + “Updated earlier • May differ”.

12) Banners (Explore More) — Craft rules
Title ≤ 40 chars, subtitle ≤ 60 chars, ≤3 bullets (≤40 chars each).

Must have target mapping to a valid deep link (see ACCEPTANCE.md).

If premium_required and user not premium → deep link to paywall.

Avoid clickbait; promise what is delivered.

Visual order: premium upsell first, then compatibility, then druid/chinese.

Examples

json
Copy code
{
  "id":"premium_monthly",
  "title":"🌙 See your month in focus",
  "subtitle":"Detailed guidance for what’s ahead",
  "bullets":["Career turns","Love highlights","Health rhythms"],
  "target":"premium",
  "premium_required":true
}
13) Error & Offline Copy
Network error (Today): “We can’t reach your stars right now. Check your connection and try again.”

Retry button: “Retry”.

Empty: “Your horoscope will be ready soon 🌌.”

Paywall down: “Upgrades are temporarily unavailable. Please try again shortly.”

14) Accessibility Copy
Banner pressable labels: “Open {title}”.

Pager page labels: “Today”, “Weekly”, “Monthly”, “Yearly”.

FAB label: “Compatibility”.

Upgrade CTA: “Upgrade to Premium”.

15) QA Checklist (content)
 All daily entries within 80–120 words and end with a tip.

 Weekly/Monthly/Yearly within length bands and gated for free.

 Aspects in 0–100; stars derived correctly (0–5).

 Traits render from content/characteristics.json (no inline code copy).

 Compatibility previews ≤2 sentences; premium_text 250–400 words.

 Banners resolve to valid deep links; {PRICE} replaced correctly.

 Onboarding strings match exactly (Continue/Continue without account).

 Pricing shows 5 GEL in GE, 5 EUR in EU, 5 USD in US/Other.

 No typos; no multiple emojis per sentence; consistent capitalization.

16) Editorial Safety & Moderation
No medical/financial advice; use soft guidance (“consider”, “might”).

Avoid sensitive topics: health diagnoses, politics, explicit content.

Remove personally identifying info from user-generated prompts (N/A).

Keep cultural references generic unless regionally localized.

17) File Locations & Naming
content/characteristics.json — traits, strengths, weaknesses per sign.

content/compatibility.json — pairs with preview + premium_text.

content/druid.json, content/chinese.json — static maps.

content/banners.json — carousel items with targets.

assets/zodiac/ — optional SVG/PNGs named {sign}.svg/png (emoji still canonical).

assets/onboarding/ — welcome.png, birth.png, insights.png.

18) Localization Readiness
All user-visible UI labels must route through i18n (except horoscope texts).

Content JSON supports language keys in future:

json
Copy code
{ "text": { "en": "…", "ka": "…" } }
Dates: device locale; 24h/12h time from OS.

19) Legal & Attribution
Disclaimer (settings): “For guidance and entertainment only.”

If using LLM content, include: “AI-assisted content reviewed for quality.”

Copyright: © Salamene {YEAR}.

20) Non-Deletion Rule
Never delete/rename docs/CONTENT_GUIDELINES.md.

If missing, recreate before coding.

markdown
Copy code

---

### Want starter files too?
If you want, I can generate **empty but schema-shaped**:
- `content/characteristics.json` (12 signs scaffold)
- `content/compatibility.json` (a few pair stubs)
- `content/druid.json`, `content/chinese.json`
- `content/banners.json` (3 ready banners with `{PRICE}` placeholder)

Say the word and I’ll output them ready to paste.
::contentReference[oaicite:0]{index=0}





Sources
```
