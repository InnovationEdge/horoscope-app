# Salamene Horoscope — Mobile App (React Native + Django)

> **Goal**: Ship a premium-grade, native-feeling Zodiac app with **perfect UX**, **regional pricing**, and **strict docs compliance**.  
> **Source of truth**: `docs/*.md`. **Never delete or rename** any file under `docs/`.

---

## 1) What’s in this repo

- **App (Expo RN)** — Tabs (Today / Traits / 🫰🏼 Compatibility / Druid / Profile), onboarding, paywall.
- **API (Django/DRF)** — Predictions, compatibility, pricing (Flitt PSP), analytics ingest.
- **Docs (Build-Strict)** — Acceptance, Design, Content, Analytics, API, Project Flow, Code Review.

**Docs index**
- Visuals & behavior → `docs/DESIGN_REVIEW.md`
- Must-have checks → `docs/ACCEPTANCE.md`
- API shapes → `docs/API_CONTRACT.md`
- Coding rules → `docs/CODE_REVIEW.md`
- Content rules/data → `docs/CONTENT_GUIDELINES.md`
- Analytics events → `docs/ANALYTICS.md`
- Build flow → `docs/PROJECT_FLOW.md`
- Screen mockups → `docs/screens/*.png`

> If any doc is missing, **stop** and recreate before coding.

---

## 2) Requirements

- **Node.js** 20 LTS, **npm** 10+
- **Expo** CLI (`npm i -g expo`)
- **Android Studio** (SDK + emulator) and/or **Xcode** (iOS Simulator)
- **Python** 3.11, **pip**, **virtualenv**
- **PostgreSQL** (optional for dev; SQLite fine to start)
- **Git** + GitHub

---

## 3) Quick Start (Dev)

### 3.1 Clone & install
```bash
git clone <your-repo-url> horoscope-app
cd horoscope-app

# App
npm i
3.2 Environment files
Create frontend .env (root):

env
Copy code
API_BASE_URL=http://10.0.2.2:8000        # Android emulator
API_BASE_URL_IOS=http://localhost:8000   # iOS simulator
Create backend .env (in api/ or project root as you prefer):

env
Copy code
DJANGO_SETTINGS_MODULE=config.settings
SECRET_KEY=replace-me
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
3.3 Backend (Django)
bash
Copy code
cd api
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
3.4 App (Expo)
In a second terminal at repo root:

bash
Copy code
npm start
# press "i" for iOS simulator OR "a" for Android emulator
4) Folder Map (Front + Back)
pgsql
Copy code
app/
  (tabs)/today.tsx, traits.tsx, compat.tsx, druid.tsx, profile.tsx
  onboarding/ splash.tsx, signin.tsx, birth-date.tsx, birth-time.tsx, birth-place.tsx, confirm.tsx
  paywall.tsx
components/
  BottomNav.tsx, HoroscopePager.tsx, LifeAspects.tsx, BannerCarousel.tsx, SignCard.tsx, ProgressBarTop.tsx
constants/
  theme.ts, signs.ts
content/
  characteristics.json, druid.json, chinese.json, banners.json, compatibility.json
services/
  api.ts, predictions.ts, compatibility.ts, analytics.ts, payments.ts, pricing.ts
store/
  user.ts, subscription.ts
utils/
  zodiac.ts, format.ts, metrics.ts, deepLinks.ts
hooks/
  useAnalytics.ts, usePremiumGate.ts
assets/
  onboarding/welcome.png, birth.png, insights.png
  icon.png
api/
  payments/, analytics/, predictions/, compatibility/  (Django apps)
docs/
  ACCEPTANCE.md, DESIGN_REVIEW.md, CONTENT_GUIDELINES.md, ANALYTICS.md, API_CONTRACT.md, PROJECT_FLOW.md, CODE_REVIEW.md
  screens/ today.png, traits.png, compat.png, druid.png, profile.png
.github/workflows/ci.yml
5) Build Order (never skip)
Design — Confirm docs/DESIGN_REVIEW.md + docs/screens/*.png.

Content — Fill content/*.json (traits, druid, chinese, banners).

API — Implement exactly docs/API_CONTRACT.md (predictions, compatibility, pricing).

Code — Implement one screen/component at a time (tokens only).

Validate — Tick all checks in docs/ACCEPTANCE.md for changed screens.

Review — Enforce docs/CODE_REVIEW.md, run tests.

Release — Tag + attach screenshots.

PRs that fail acceptance or code review are rejected.

6) Regional Pricing (server-driven)
GE → “5 GEL”, EU → “5 EUR”, US/Other → “5 USD”.

App never builds currency strings. UI renders pricing.monthly_display.

API: GET /api/v1/payments/products returns:

json
Copy code
{
  "plans":[{"id":"sub_monthly","name":"Monthly","pricing":{
    "region":"GE","currency":"GEL","symbol":"₾","monthly_minor":500,"monthly_display":"5 GEL"
  }}]
}
Banners may include {PRICE} placeholder → client replaces with monthly_display.

7) Scripts & Commands
App

bash
Copy code
npm start
npm run ios
npm run android
npm run lint
npm run typecheck
npm test
API

bash
Copy code
python manage.py migrate
python manage.py runserver
Git (Windows/macOS/Linux)

bash
Copy code
git checkout -b feat/<scope>
git add -A
git commit -m "feat(today): pager with premium blur + CTA"
git push -u origin feat/<scope>
8) Claude Code — Work Instruction (paste verbatim)
swift
Copy code
Follow /docs/*.md strictly. Never delete or rename docs.
If a required file/folder is missing, create it empty and continue.
Implement the task, save files, then run:
git add -A && git commit -m "<scoped message>" && git push
Report delta as:
CREATED: <files>
CHANGED: <files>
Typical task queue

pgsql
Copy code
1) Implement react-native-pager-view Today/Weekly/Monthly/Yearly with dots.
2) “Read more” expands card height; long text scrolls; no clipping.
3) Weekly/Monthly/Yearly blur + single inline “Upgrade to Premium” CTA.
4) Life Aspects stars = round(score/20) + x/10.
5) BannerCarousel: 120dp, full-card pressable, auto-scroll 5s, deep links from content/banners.json.
6) BottomNav: center 64dp FAB 🫰🏼 floating −16dp, active pill 56x32dp.
9) Quality Gates (must pass)
Acceptance — All boxes in docs/ACCEPTANCE.md.

Design — Pixel sizes/colors/motion per docs/DESIGN_REVIEW.md.

Content — No lorem; static from content/*.json; dynamic follows CONTENT_GUIDELINES.md.

Analytics — Events per docs/ANALYTICS.md (tabs, pager, gating, banners, compat, purchase).

Code — No hardcoded hex/sizes; tokens only; TS strict; tests updated.

Currency — Correct regional price shown (GEL/EUR/USD).

10) Troubleshooting
UI looks flat → add elevation/shadow per DESIGN_REVIEW.md §1.4.

Pager doesn’t swipe → must use react-native-pager-view.

Weekly/Monthly/Yearly readable on free → blur missing (see DESIGN_REVIEW.md §3.3).

Banners not clickable → ensure full card pressable + deep link mapping (see DESIGN_REVIEW.md §3.5).

Wrong currency → backend must return pricing object; see CONTENT_GUIDELINES.md §18.

GitHub “No authentication session” → sign in GitHub in VS Code or use terminal git remote set-url + PAT.

11) Contributing
Branch from main: feat/<scope> or fix/<scope>.

Keep PRs ≤ 500 LOC and focused.

Update docs first if behavior changes; then code.

CI must be green (lint, typecheck, tests).

Do not add routes/tabs not in Design.

Do not inline copy; use content or server data.

Do not delete/rename docs/*.md.

12) Testing
Unit: utils/zodiac.ts edge dates; score→stars mapping; deep link parser.

Snapshot: Today (free vs premium), BottomNav.

Smoke: Pager swipe/dots; blur+CTA; banner deep links; compat calc & deep link prefill.

Targets: ≥ 80% statements/lines.

Run:

bash
Copy code
npm test -- --coverage
13) Release Flow (staging → prod)
bash
Copy code
git checkout -b release/v1.0.0
git push -u origin release/v1.0.0
# QA on real devices, then:
git checkout main
git merge --no-ff release/v1.0.0
git tag v1.0.0
git push && git push --tags
Rollback: revert tag commit → hotfix branch → retag.

14) Security & Privacy
No secrets in client.

Flitt PSP handled on server; client uses checkout URL only.

Analytics has no PII; only pseudo IDs and event params.

15) Non-Negotiables (summary)
Weekly/Monthly/Yearly: blur + single “Upgrade to Premium” CTA if not premium.

Banners: full-card pressable + strict deep links.

Bottom nav: center FAB 🫰🏼 64dp, floating −16dp, side tabs have active pill.

Traits default to user.sign, switchable; static JSON only.

Druid/Chinese: static JSON, tied to user birth data.

Regional pricing: GE→5 GEL, EU→5 EUR, US/Other→5 USD.

Analytics: implement all events in docs/ANALYTICS.md.

Tokens only: colors/sizes from constants/theme.ts and constants/signs.ts.

Docs are law: update docs first; never remove them.

16) Ownership
Product/UX → docs/DESIGN_REVIEW.md + docs/screens/*

Tech Lead → docs/CODE_REVIEW.md enforcement

Content → docs/CONTENT_GUIDELINES.md

Analytics → docs/ANALYTICS.md

When in doubt: update the docs first, then implement.

pgsql
Copy code

If you want, I can also generate **`constants/theme.ts` and `constants/signs.ts`** token scaffolds to lock in colors, sizes, and sign metadata so devs can import and never hardcode values.
::contentReference[oaicite:0]{index=0}

