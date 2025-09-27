# Project Flow — Zodiac App (FINAL, Build-Strict, Working Blueprint)

> **Purpose:** One operational playbook for planning → coding → testing → shipping.  
> **Source of truth:** `docs/*.md` (NEVER delete/rename). Code must match them exactly.  
> **Stack:** React Native (Expo) + Django API. GitHub for VCS. Flitt PSP for payments.

---

## 0) Roles, Tools, Environments

**Roles**

- Product/Owner: maintains `docs/*.md`, signs off releases.
- Dev (Claude Code + human): implements strictly per docs.
- Reviewer: checks PRs against `CODE_REVIEW.md`, `ACCEPTANCE.md`, `DESIGN_REVIEW.md`.

**Tools**

- VS Code, Node 20 LTS, Expo SDK (RN), Python 3.11, Django + DRF.
- GitHub, GitHub Actions CI, Husky + lint-staged.
- Optional: EAS (later), Sentry/Crashlytics (later).

**Environments**

- **dev**: local devices (Expo), Django `localhost:8000`
- **staging**: `api-staging.salamene.app`, Expo build profile `staging`
- **prod**: `api.salamene.app`, App Store / Play Store

---

## 1) Golden Rules (applies to EVERY task)

1. Update **docs first** (acceptance/design/content/analytics/api).
2. Implement **exactly** per docs. **No improvisation**.
3. Keep code **tokenized** (no hex, no magic sizes).
4. **Static** copy comes from `content/*.json`.
5. **Never** delete/rename any `docs/*.md`. If missing, recreate, then proceed.
6. Every change ends with: **save → commit → push → PR → CI green → review → merge**.

---

## 2) Branching & Git (copy/paste)

**Branching**

- `main` = protected.
- `feat/<scope>` e.g. `feat/today-pager`, `fix/life-aspects-stars`.

**Daily basics (PowerShell/Terminal)**

```bash
git checkout -b feat/today-pager
# ... edit files ...
git add -A
git commit -m "feat(today): pager with premium blur + CTA"
git push -u origin feat/today-pager
# open PR to main
Sync with main

bash
Copy code
git fetch origin
git rebase origin/main
# fix conflicts if any
git push --force-with-lease
Hotfix

bash
Copy code
git checkout -b hotfix/nav-fab-overlap
# fix, test
git commit -m "fix(nav): center FAB overlap and labels"
git push -u origin hotfix/nav-fab-overlap
Rollback (local):

bash
Copy code
git checkout -- <file>
git revert HEAD
git push
3) Repository Layout (must exist)
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
docs/
  ACCEPTANCE.md, DESIGN_REVIEW.md, CONTENT_GUIDELINES.md, ANALYTICS.md, API_CONTRACT.md, CODE_REVIEW.md, PROJECT_FLOW.md
.github/workflows/ci.yml
4) Configuration & Env
Frontend .env

ini
Copy code
API_BASE_URL=http://10.0.2.2:8000        # Android emulator
API_BASE_URL_IOS=http://localhost:8000   # iOS simulator
Backend .env

ini
Copy code
DJANGO_SETTINGS_MODULE=config.settings
DATABASE_URL=postgres://user:pass@localhost:5432/zodiac
SECRET_KEY=replace-me
ALLOWED_HOSTS=localhost,127.0.0.1
Region-Based Pricing (server)

Country detection priority: IP → profile → device-region header → fallback US.

Pricing: GE = 5 GEL, EU = 5 EUR, US/Other = 5 USD.

API returns:

json
Copy code
{
  "plans":[{"id":"sub_monthly","name":"Monthly","pricing":{
    "region":"GE","currency":"GEL","symbol":"₾","monthly_minor":500,"monthly_display":"5 GEL"
  }}]
}
5) Daily Developer Cycle (Claude + you)
Refine docs

Update ACCEPTANCE.md, DESIGN_REVIEW.md, CONTENT_GUIDELINES.md, etc.

Be pixel-exact: sizes, blur, labels, routes.

Claude Code prompt (paste each time)

cpp
Copy code
Follow /docs/*.md strictly. Never delete docs.
Implement the next task and save files. Then run:
git add -A && git commit -m "<message>" && git push
Report CHANGED/CREATED files. If a file is missing, create it empty and continue.
Implement feature → run locally

bash
Copy code
# backend
python manage.py runserver
# frontend
npm start
npm run ios   # or android
Self-check using §10 Feature QA checklists below.

Commit & push; open PR; ensure CI green; merge.

6) Feature Implementation Flows (end-to-end)
6.1 Today (Home) — pager, read-more, lucky, blur/CTA
Backend

/predictions/daily?sign=&date= → daily JSON (free).

/predictions/weekly|monthly|yearly → text; mark premium on server OR let client gate; cache per TTL.

Frontend

components/HoroscopePager.tsx:

react-native-pager-view, 4 pages, dots.

Today: 4-line preview; Read more expands card height (no clipping); lucky row visible.

W/M/Y (free): blur text; inline CTA bottom-right; any tap → /paywall?src=<timeframe>.

W/M/Y (premium): no blur; expandable.

Analytics

today_pager_swiped, read_more_clicked, paywall_shown.

QA

Small devices: no overflow.

Blur makes text unreadable; CTA visible.

Swipe feels native.

6.2 Life Aspects — stars only
Frontend

components/LifeAspects.tsx: 3 columns (Love, Career, Health).

Compute stars = Math.round(score/20); show x/10 beneath.

QA

No broken 87/10 values.

Fully visible on small screens.

6.3 Banner Carousel — deep links + dots + bullets
Content

content/banners.json items with id,title,subtitle,bullets,target,premium_required.

Use {PRICE} in subtitle if upsell (client replaces from pricing API).

Frontend

components/BannerCarousel.tsx: 120dp height, radius 24, full Pressable, dots, auto-scroll 5s; map target to route.

Analytics

banner_clicked before navigation; gate → paywall_shown.

QA

Whole card clickable; bullets ≤3; dot indicators visible; deep links correct.

6.4 Traits (Characteristics) — static
Content

content/characteristics.json with emoji, date_range, traits, strengths, weaknesses, element, planet, lucky.

Frontend

/(tabs)/traits.tsx: default = user.sign; dropdown to switch; render chips + two cards.

QA

Zero spinners; instant; correct override via ?sign= deep link.

6.5 Compatibility — calc + preview + premium text
Backend

POST /compatibility { signA, signB } → overall, category scores, preview, optional premium_text.

Frontend

/(tabs)/compat.tsx: left = user.sign (locked), right = selector; “Calculate Match”; animated dial + bars; preview always; premium adds long text.

Analytics

compatibility_calculated { signA, signB, overall }; upsell click → upgrade_cta_clicked { source:'compat' }.

QA

Deep link ?with=<sign> preselects and scrolls to result.

6.6 Druid & Chinese — static, user-tied
Content

content/druid.json, content/chinese.json (150–250 words each).

Frontend

/(tabs)/druid.tsx: toggle “Druid | Chinese”, default Druid; compute sign once and persist.

QA

?mode=chinese opens Chinese; no network.

6.7 Onboarding — images + dots + progress bar
Frontend

Route: /onboarding/splash → signin → birth-date → birth-time → birth-place → confirm

Images from assets/onboarding/.

Birth time: “I don’t remember” → defaults 12:00.

Confirm: compute zodiac with utils/zodiac.ts, persist, router.replace('/(tabs)/today').

QA

Progress bar 4dp; 3 dots; images scaled; safe-area respected.

6.8 Paywall & Pricing — regional
Backend

GET /payments/products returns pricing per §4.

Frontend

services/pricing.ts: fetch pricing; display monthly_display.

Replace {PRICE} in banners; show blur CTA → /paywall?src=<context>.

QA

VPN GE/EU/US show 5 GEL/EUR/USD respectively; analytics carries currency.

7) Claude Code Scripts (use verbatim)
General work instruction (paste before each task)

swift
Copy code
Follow /docs/*.md exactly. Never delete or rename docs.
If a required file/folder is missing, create it empty and continue.
After saving files, run:
git add -A && git commit -m "<scoped message>" && git push
Report delta as:
CREATED: <files>
CHANGED: <files>
Task queue prompt (example)

sql
Copy code
Implement:
1) Fix Today read-more: card expands height and allows screen scroll, no clipping.
2) Replace pager with react-native-pager-view + dots.
3) LifeAspects stars: 0..5 + x/10, remove numeric 87/10 bugs.
4) BannerCarousel: auto-scroll 5s, full-card pressable, deep links per content/banners.json.
5) BottomNav: center 64dp FAB 🫰🏼, active pill 56x32dp, safe-area.
8) Backlog Buckets (prioritized)
P0: Today pager native swipe, blur/CTA, read-more expansion; nav FAB; banners deep-link; pricing.

P1: Traits full, Compatibility calc + preview, Druid/Chinese static.

P2: Paywall polish, analytics coverage, unit+snapshot tests.

P3: Push notifications, Sentry/Crashlytics, EAS build profiles.

9) Commands (quick runbook)
Frontend

bash
Copy code
npm i
npm start
npm run ios   # or: npm run android
npm run lint
npm run typecheck
npm test
Backend

bash
Copy code
python -m venv .venv && . .venv/Scripts/activate  # Windows PowerShell: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
GitHub Actions CI (runs on PR):

npm ci

npm run lint

npm run typecheck

npm test -- --coverage

10) Feature QA Checklists (copy into PR description)
Today / Pager

 Swipe native; dots update ≤120ms.

 Read-more expands smoothly; no clipping; long text scrolls.

 W/M/Y blurred for free; one inline “Upgrade to Premium” CTA.

Life Aspects

 3 columns visible on small devices.

 Stars 0–5 based on 0..100; x/10 sane.

Banners

 Cards 120dp; full pressable; bullets ≤3.

 Deep links map exactly; {PRICE} replaced.

Nav

 FAB 64dp 🫰🏼 centered, float −16dp; labels not overlapped.

 Pill under active tab; one active at a time.

Traits

 Defaults to user.sign; dropdown switches; static JSON only.

Compatibility

 Calculates; shows dial + bars; preview always; premium text gated.

Druid/Chinese

 Static; toggle works; persists computed sign/animal.

Paywall/Pricing

 GE/EU/US show 5 GEL/EUR/USD; analytics includes currency.

Analytics

 tab_selected, today_pager_swiped, read_more_clicked, banner_clicked, paywall_shown, compatibility_calculated.

11) CI Gates & PR Review
CI green (lint, typecheck, tests).

Reviewer validates against Design/Acceptance pixel sizes & copy strings.

Coverage ≥ 80% statements/lines.

No hardcoded hex/sizes; tokens only.

No docs deleted/renamed.

12) Release Flow (staging → prod)
Tag release branch

bash
Copy code
git checkout -b release/v1.0.0
git push -u origin release/v1.0.0
Bump versions (app.json & Android/iOS if needed).

Merge PRs into release/*, QA on real devices.

Merge to main with tag v1.0.0.

Build & submit (later with EAS).

Rollback: revert tag commit → hotfix branch → retag.

13) Incident & Hotfix
Create hotfix/<issue> branch.

Write failing test first if possible.

Fix, QA, merge, tag vX.Y.Z.

Post-mortem: add to docs/DELTA.md (root cause, fix, prevention).

14) Content Lifecycle
Static JSON edits: PR with diffs; run JSON lint; update screenshots if visuals affected.

LLM (Gemini) content: server-side generation; validate lengths & fields; cache with TTLs.

Banners: may include {PRICE} placeholder—client replaces with pricing.monthly_display.

15) Non-Deletion Rule
NEVER delete or rename any docs/*.md.

If any doc is missing, stop, recreate from history/spec, then continue.

bash
Copy code

If you want, I can also generate a **one-shot Claude task script** that will:
1) create any missing folders/files,
2) scaffold the components/services we listed,
3) wire up the pager + banners + nav FAB exactly to spec,
4) save + commit + push in one pass.
::contentReference[oaicite:0]{index=0}





Sources
```
