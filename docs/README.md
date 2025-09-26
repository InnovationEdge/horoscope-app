# Project Docs — Zodiac App (FINAL)

> **Single source of truth** for design, content, contracts, and acceptance.  
> **Do not** delete or rename any file under `docs/*.md`.

---

## 1) What these docs control

- **Visuals & behavior** → `DESIGN_REVIEW.md`
- **Must-have checks** → `ACCEPTANCE.md`
- **API shapes** → `API_CONTRACT.md`
- **Coding rules** → `CODE_REVIEW.md`
- **Content rules & data shapes** → `CONTENT_GUIDELINES.md`
- **Analytics events** → `ANALYTICS.md`
- **Build flow** → `PROJECT_FLOW.md`
- **Screen mockups** → `docs/screens/*.png` (visual truth)

If any are missing, stop and recreate before coding.

---

## 2) Quick start (dev)

```bash
# 1) install
npm i

# 2) run
npm start
# press "a" (Android) or "i" (iOS)

# 3) optional: create placeholders if missing
# (images & content)
Minimum files required to begin:

docs/DESIGN_REVIEW.md, docs/ACCEPTANCE.md (already present)

docs/screens/today.png (and other screens when available)

assets/onboarding/welcome.png, birth.png, insights.png

content/characteristics.json, druid.json, chinese.json, banners.json (can start empty)

3) Build order (never skip)
Design — Update/confirm DESIGN_REVIEW.md + docs/screens/*.png.

Content — Fill content/*.json (traits, druid, chinese, banners).

API — Match API_CONTRACT.md (predictions, compatibility, pricing).

Code — Implement one screen/component at a time.

Validate — Tick every box in ACCEPTANCE.md for changed screens.

Review — Enforce CODE_REVIEW.md and run tests.

Release — Tag & attach screenshots.

PRs that fail acceptance or code review are auto-rejected.

4) Folder map (frontend)
pgsql
Copy code
app/
  (tabs)/
    today.tsx
    traits.tsx
    compat.tsx
    druid.tsx
    profile.tsx
  onboarding/
    _layout.tsx
    splash.tsx
    signin.tsx
components/
  BottomNav.tsx
  HoroscopePager.tsx
  LifeAspects.tsx
  BannerCarousel.tsx
  SignCard.tsx
  ProgressBarTop.tsx
constants/
  theme.ts
  signs.ts
content/
  characteristics.json
  druid.json
  chinese.json
  banners.json
  sample_horoscope.json
docs/
  DESIGN_REVIEW.md
  ACCEPTANCE.md
  API_CONTRACT.md
  CODE_REVIEW.md
  CONTENT_GUIDELINES.md
  ANALYTICS.md
  PROJECT_FLOW.md
  screens/
    today.png
    traits.png
    compat.png
    druid.png
    profile.png
assets/
  onboarding/
    welcome.png
    birth.png
    insights.png
5) Non-negotiables (summary)
Blur + “Upgrade to Premium” on Weekly/Monthly/Yearly when not premium.

Banners are pressable and deep-link via mapping (traits, compat, druid, chinese, premium).

Bottom nav: center FAB (🫰🏼) 64dp, floating −16dp, active pill on side tabs.

Traits defaults to user.sign but can switch; reads static JSON.

Druid/Chinese are static JSON; tied to user birth data.

Regional pricing (server-driven): GE→“5 GEL”, EU→“5 EUR”, US/other→“5 USD”.

Analytics: emit events defined in ANALYTICS.md.

No hardcoded colors/sizes; use constants/theme.ts & constants/signs.ts.

6) Acceptance gate (how to pass)
Before merging any PR:

Open every changed screen and tick corresponding items in ACCEPTANCE.md.

Confirm navigation & deep links behave exactly as specified.

Verify premium gating (blur + CTA) and banner routing.

Run unit/snapshot tests (zodiac calc, Today, BottomNav).

Confirm required analytics events fire (see ANALYTICS.md).

7) Backend notes (summary)
Endpoints and payloads in API_CONTRACT.md.

Pricing object must be returned by paywall/product endpoint (regional currency).

Cache TTLs: daily 24h, weekly 7d, monthly 30d, yearly 365d.

Webhook (Flitt) sets is_premium=true.

8) Contributor rules
Don’t add routes/tabs not in DESIGN_REVIEW.md.

Don’t inline copy; use content files or server responses.

Don’t modify or delete docs/*.md. If a change is needed, propose it in a PR that updates docs first, then code.

9) Common commands
bash
Copy code
# lint & typecheck (example)
npm run lint
npm run typecheck

# run tests (example)
npm test
10) Troubleshooting
Looks “flat” → card elevation/shadow missing (see Design §0).

Pager not swiping → must use react-native-pager-view.

Weekly/Monthly/Yearly readable on free → blur not applied; fix per Design §3.3.

Banners don’t navigate → ensure target maps to routes in Design §3.5.

Wrong currency → backend must return pricing object; see Content §18.

11) Contact / Ownership
Product & UX: follows DESIGN_REVIEW.md + docs/screens/*.

Tech Lead: enforces CODE_REVIEW.md.

Content Owner: enforces CONTENT_GUIDELINES.md.

When in doubt: update docs first, then code.

makefile
Copy code
::contentReference[oaicite:0]{index=0}