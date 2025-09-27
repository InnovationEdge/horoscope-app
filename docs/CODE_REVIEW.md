# Code Review — Zodiac App (FINAL, Build-Strict, Full Blueprint)

> **Goal**: Ensure every commit results in production-grade, pixel-perfect, testable, and scalable code.  
> **Alignment**: All code must follow these documents exactly:
>
> - `docs/ACCEPTANCE.md`
> - `docs/DESIGN_REVIEW.md`
> - `docs/ANALYTICS.md`
> - `docs/API_CONTRACT.md`
> - `docs/CONTENT_GUIDELINES.md`
>
> **Rules**:
>
> - Never delete or rename any `docs/*.md`.
> - No hardcoded hex/sizes. Use tokens from `constants/theme.ts` and `constants/signs.ts`.
> - No lorem or filler text in code (all static text must come from `content/*.json`).
> - TypeScript strict mode required. No `any`.
> - No TODOs, no placeholders left behind.

---

## 0) Repo Hygiene

**Required in root:**

- `.editorconfig`
- `.gitattributes`
- `.gitignore`
- `eslint.config.js`
- `.prettierrc`
- `tsconfig.json`
- `jest.config.ts` or `vitest.config.ts`
- `.husky/` pre-commit hook (lint, typecheck, tests)
- `.github/workflows/ci.yml` (lint + test in CI)

**Commits & Branching**

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).  
  Examples: `feat: add horoscope pager`, `fix: banner deep link nav`.
- No direct pushes to `main`. PRs only.
- Small, atomic commits. PRs must be reviewable in <500 LOC.

---

## 1) Project Architecture

**File tree (core):**
app/
(tabs)/
today.tsx
traits.tsx
compat.tsx
druid.tsx
profile.tsx
onboarding/
splash.tsx
signin.tsx
birth-date.tsx
birth-time.tsx
birth-place.tsx
confirm.tsx
paywall.tsx
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
services/
api.ts
analytics.ts
predictions.ts
compatibility.ts
payments.ts
pricing.ts
store/
user.ts
subscription.ts
utils/
zodiac.ts
format.ts
metrics.ts
hooks/
useAnalytics.ts
usePremiumGate.ts
assets/
onboarding/ (welcome.png, birth.png, insights.png)
icon.png
tests/
unit/
snapshot/
docs/
\*.md (never delete/rename)

markdown
Copy code

**Responsibilities**

- **Screens (app/)**: orchestrate data + render components.
- **Components (components/)**: pure UI, no side effects.
- **Services (services/)**: network, payments, analytics.
- **Store (store/)**: user state, premium status.
- **Utils (utils/)**: pure helpers.
- **Content (content/)**: static JSON (traits, druid, banners).

---

## 2) Theming & Tokens

```ts
import { Colors, Sizes, Radii, Typography } from '@/constants/theme';
Never inline values like #fff, margin: 17.

Card radius: 24dp

Card padding: 20dp

Screen padding: 16dp

Nav bar height: 80dp

FAB size: 64dp

Dots: 8dp

Typography

Greeting: clamp 36–48sp, single line.

Title: 16sp / 24 line height.

Body: 14sp / 24 line height.

Label: 11sp / 16 line height.

3) Components (must exist and behave as specified)
3.1 BottomNav.tsx
5 tabs: Today, Traits, FAB Compatibility 🫰🏼, Druid, Profile.

FAB: 64dp, bg purple, elevated −16dp, spring scale on press.

Side tabs: flex:1, active pill 56×32dp behind icon.

Labels visible, no overlap.

3.2 HoroscopePager.tsx
Built with react-native-pager-view.

Pages: Today, Weekly, Monthly, Yearly.

Dots centered.

Today:

4-line preview + “Read more ▾” expands smoothly.

Lucky row (number, color, mood).

Weekly/Monthly/Yearly:

Free → blurred text (Gaussian 8–12), sticky Upgrade to Premium CTA.

Premium → full text, expandable.

3.3 LifeAspects.tsx
3 columns: Love ❤️, Career 💼, Health 🩺.

Score 0–100 → stars 0–5 (Math.round(score/20)).

Show x/10 under stars.

Always visible, no overflow.

3.4 BannerCarousel.tsx
Cards: 120dp tall, radius 24, full-card pressable.

Left-aligned text + optional bullet list.

Dots centered below.

Auto-scroll every 5s.

Navigate per content/banners.json.

3.5 SignCard.tsx
88dp tall, avatar 48dp circle with emoji.

Premium chip top-right if user is premium.

3.6 ProgressBarTop.tsx
Onboarding progress indicator. 4dp tall, animates between steps.

4) Navigation & Deep Links
Tab order fixed.

Deep links:

traits:<sign> → /(tabs)/traits?sign=<sign>

compat:<sign> → /(tabs)/compat?with=<sign>

druid → /(tabs)/druid

chinese → /(tabs)/druid?mode=chinese

premium → /paywall?src=banner_<id>

5) Premium Gating
W/M/Y pages:

Free → blurred + CTA. Any interaction opens /paywall.

Premium → full text visible.

Compatibility:

Free → show % + short preview.

Premium → add long breakdown.

6) Data Contracts (strict)
ts
Copy code
// Predictions
type Prediction = {
  sign: string;
  type: 'daily'|'weekly'|'monthly'|'yearly';
  period: { start: string; end: string };
  preview: string;
  full_text?: string | null;
  lucky?: { number: number; color: string; mood: string };
  scores: { love: number; career: number; health: number };
};

// Compatibility
type Compat = {
  signA: string;
  signB: string;
  overall: number;
  love: number;
  career: number;
  friendship: number;
  preview: string;
  full_text?: string | null;
};
Static JSON: traits, druid, chinese, banners. Never hardcode.

7) Accessibility
Minimum 48×48dp touch targets.

All pressables labeled.

Pager pages labeled.

Contrast ≥ 4.5:1.

Supports Dynamic Type for body text.

8) Performance
60fps scrolling/swiping on mid Android.

Use react-native-pager-view (not ScrollView hacks).

Memoize heavy components.

Image cache enabled.

9) Motion
Tab transitions: fade-through (250ms).

Pager dots animate ≤120ms.

Read more expands ≤300ms.

FAB spring scale 0.96→1.0.

Banner auto-scroll 5s.

10) Analytics (must follow docs/ANALYTICS.md)
Tabs: tab_selected, screen_view.

Pager: today_pager_swiped, read_more_clicked.

Paywall: paywall_shown, upgrade_cta_clicked.

Banners: banner_clicked before nav.

Compat: compatibility_calculated.

Purchases: purchase_initiated, purchase_success, purchase_failed.

11) Error & Loading States
Use skeletons for loading (no spinners).

Friendly inline errors.

402 → open paywall.

Analytics transport never throws; queue offline.

12) Security & Privacy
No secrets in client.

Payments: Flitt handled server-side; client only gets checkout URL.

Analytics: no PII, only pseudo IDs.

13) Regional Pricing
Pricing always comes from server /payments/products.

Client replaces {PRICE} placeholders in banners with localized pricing.

Fallback if missing → “from 5 USD/month”.

14) Testing
Unit tests: zodiac sign calc, score→stars, deep link parsing.

Snapshot: Today (free vs premium), BottomNav with FAB.

Integration/Smoke:

Pager swipe updates dots.

Blur + CTA for free users.

Banner click navigates properly.

Compat calculation works with deep link prefill.

Coverage: ≥80% statements/lines.

15) Lint, Type, Format
ESLint (strict TS + React Native rules).

Prettier (width 120, single quotes).

TSConfig strict (noImplicitAny, noUncheckedIndexedAccess).

Imports ordered: react → expo/router → 3rd party → constants/services/store/utils → components → relative.

16) CI/CD
GitHub Actions (.github/workflows/ci.yml): lint + typecheck + tests.

Husky pre-commit: lint-staged runs eslint + prettier + tests on staged files.

Main branch protected (PRs only).

17) Review Checklist (must tick all)
 Matches DESIGN_REVIEW.md pixel-for-pixel.

 Passes all acceptance criteria.

 No hardcoded hex/sizes.

 Traits/druid/chinese pulled from JSON only.

 Regional pricing from API.

 Analytics events fired correctly.

 Tests added/updated; coverage ≥80%.

 Lint/type/format clean.

 Friendly error + offline safe.

 No docs/*.md removed or renamed.

18) Anti-Patterns (Reject Immediately)
❌ ScrollView “pager” implementation.

❌ Premium text visible to free users.

❌ Inline zodiac texts in components.

❌ Missing analytics events.

❌ Flat nav bar with broken FAB.

❌ Hardcoded pricing/currency.

❌ Docs deleted or renamed.

19) Onboarding (Salamene)
Splash → fade 2.5s → /onboarding/signin.

Signin: assets/onboarding/welcome.png; two buttons:

Outlined: Continue without account → Today tab.

Filled: Continue (auth) → Today tab.

Birth-date/time/place with progress bar + indicator dots.

“I don’t remember” time → defaults 12:00.

Confirm computes sign, saves to store, sets onboarded flag.

20) Change Control
Any deviations → docs/DELTA.md with:

Rationale

Impacted files

Plan to converge

yaml
Copy code

---

✅ This file is now the **master code review bible**.
No dev can merge code unless it passes this document **and** the other `.md` specs.






```
