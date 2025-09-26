# Code Review — Zodiac App (FINAL, Build-Strict)

> Goal: production-grade, readable, testable code that exactly matches DESIGN_REVIEW.md and ACCEPTANCE.md.  
> **Never delete or rename any `docs/*.md`.**

---

## 0) Golden Rules
- **Do not improvise UI or copy.** Follow `docs/DESIGN_REVIEW.md` + `docs/ACCEPTANCE.md`.
- **No hardcoded hex/sizes.** Use tokens from `constants/theme.ts` and `constants/signs.ts`.
- **Static content only from `content/*.json`.** No lorem in code.
- **TypeScript strict.** No `any`, no implicit `any`, no `// @ts-ignore` unless justified in PR.
- **Never delete/rename** `docs/*.md`. If missing, stop and recreate.

---

## 1) Project Architecture
- **Expo Router** with tabs and stacks:
  - Tabs: `app/(tabs)/today.tsx`, `traits.tsx`, `compat.tsx`, `druid.tsx`, `profile.tsx`
  - Onboarding stack: `app/onboarding/*`
  - Custom bottom bar: `components/BottomNav.tsx`
- **State**:
  - `store/user.ts` → auth, birth info, computed zodiac sign, onboarding.
  - `store/subscription.ts` → `isPremium`.
- **Data fetching**: `react-query` per endpoint, cache TTLs match backend.
- **Services**: `services/*` (api, predictions, compatibility, payments, analytics).
- **UI**: `components/*` (pure, reusable).
- **Utils**: `utils/*` (pure, no side effects).
- **Assets**: `assets/onboarding/*`, `assets/banners/*`, `assets/zodiac/*`.

---

## 2) Styling & Theming
- Import tokens only:
  ```ts
  import { Colors, Sizes } from '@/constants/theme';
  import { SIGNS } from '@/constants/signs';
Forbidden: inline hex colors (except temporary debug), magic numbers for spacing, ad-hoc radii.

Shapes: radius 24dp; card padding 20dp; screen pad 16dp.

Typography: Greeting clamp 36–48sp; titles 16sp; body 14sp/24; labels 11sp.

3) Components & Patterns
3.1 Required components (do not duplicate)
BottomNav.tsx — center FAB 🫰🏼 64dp; active pill; flex:1 side tabs.

HoroscopePager.tsx — react-native-pager-view, 4 pages, dots, blur + Upgrade CTA for W/M/Y when not premium, Today has LuckyRow.

LifeAspects.tsx — 3 columns with stars (0–5) and x/10.

BannerCarousel.tsx — pressable cards, optional bullet list, dots, deep links.

SignCard.tsx — 88dp card with 48dp avatar and 24dp premium chip.

ProgressBarTop.tsx — onboarding 4dp progress.

3.2 Do
Keep components pure (props in, render out).

Hoist API calls to screens or services/* with react-query.

Memoize large lists; use React.memo only when measured.

Use Pressable/TouchableOpacity with accessibilityLabel.

3.3 Don’t
Don’t fetch in component bodies without cache.

Don’t duplicate button/row layouts—extract to shared components.

Don’t mix business logic with view code.

4) Navigation & Deep Links
Tabs order fixed: Today · Traits · (Center) Compatibility · Druid · Profile.

Deep link mapping (must use):

traits:<sign> → /(tabs)/traits?sign=<sign>

compat:<sign> → /(tabs)/compat?with=<sign>

druid → /(tabs)/druid

chinese → /(tabs)/druid?mode=chinese

premium → /paywall?src=banner_<id>

Traits default = user.sign. Respect ?sign= override.

Compatibility default left sign = user.sign; right sign selectable; ?with= prefilled.

5) Premium Gating (Exact Behavior)
Weekly/Monthly/Yearly pages: if !isPremium:

Body text blurred (radius ~8–12) or masked gradient so unreadable.

Show sticky “Upgrade to Premium” CTA (Label 12sp, purple) inside card bottom-right.

Any interaction (swipe to page, tap body, tap Read more, tap CTA) → navigate /paywall?src=<timeframe>.

When isPremium, remove blur and show full text + Read more.

6) Data Contracts (Frontend expectations)
Predictions (all timeframes):

ts
Copy code
type Prediction = {
  sign: string;
  type: 'daily'|'weekly'|'monthly'|'yearly';
  period: { start: string; end: string };
  preview: string;
  full_text?: string | null; // null for free daily; present for premium and daily "read more"
  mood_tags: string[];
  lucky?: { number: number; color: string; mood: string };
  scores: { love: number; career: number; health: number }; // 0..100
};
Characteristics from content/characteristics.json (static).

Compatibility:

ts
Copy code
type Compat = {
  signA: string; signB: string;
  overall: number;
  love: number; career: number; friendship: number;
  preview: string; full_text?: string | null;
};
7) Accessibility
Min touch size 48×48dp.

All interactive elements have accessibilityLabel.

Pager pages have labels: “Today”, “Weekly”, “Monthly”, “Yearly”.

Maintain contrast (text ≥ 4.5:1 on surfaces).

8) Performance
Avoid re-render storms: keep state local to screens or Zustand stores.

Use react-native-pager-view (not DIY scroll) for horoscope pages.

Cache images (banners, onboarding) with expo-image if available.

Keep bundle clean: no unused libraries.

9) Analytics (must fire)
Use services/analytics.ts (track) from docs/ANALYTICS.md.

Pager: today_pager_swiped, read_more_clicked

Gating: paywall_shown, upgrade_cta_clicked

Banners: banner_clicked (fire before navigation)

Tabs: tab_selected

Compat: compatibility_calculated

10) Testing
Unit:

utils/zodiac.ts (date → sign) with edge dates.

Score → stars conversion (0..100 → 0..5).

Snapshot:

app/(tabs)/today.tsx with mock data (free vs premium states).

components/BottomNav.tsx active pill and FAB.

Smoke:

Pager swipes & dots update.

Blur + CTA shows for free users.

Banners navigate to mapped routes.

11) Linting & Formatting
ESLint (RN + TS), Prettier (120 cols, single quotes).

Sample tsconfig.json flags:

json
Copy code
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx"
  }
}
Import order: react/react-native → expo/router → third-party → local (constants, services, store,components).

12) Security & Privacy

No secrets in code. Use env/Secret Manager on backend.

Don’t log PII to analytics. Use pseudo IDs per docs/ANALYTICS.md.

Payment flows (Flitt): handle only session URL on client; verify on server via webhook.

13) Error Handling

UI: show inline friendly errors (no raw stack).

API: central services/api.ts with interceptors; map 402 to paywall gating.

Analytics: never throw; queue offline.

14) PR Checklist (Reviewer must tick all)

 Matches DESIGN_REVIEW.md visuals (sizes, colors, spacing, motion).

 Passes docs/ACCEPTANCE.md for the touched screens.

 No hardcoded hex/sizes; tokens only.

 TS strict, no any/@ts-ignore.

 Components are pure; no duplicate UI.

 Premium gating implemented (blur + Upgrade CTA) for W/M/Y when !isPremium.

 Banners use deep link mapping and are fully pressable.

 Required analytics events fired.

 Unit + snapshot tests added/updated.

 No docs/*.md deleted/renamed.

15) Anti-Patterns (auto-reject)

❌ Hardcoded colors/sizes (e.g., #fff, margin: 17)

❌ Rebuilding pager with ScrollView instead of react-native-pager-view

❌ Pulling traits/druid/chinese text from code constants (must read content/*.json)

❌ Mixed responsibilities (network calls inside dumb UI components)

❌ Creating new routes/tabs not in spec

❌ Deleting or renaming any docs/*.md

16) Notes for Onboarding (Salamene Onboarding)

Splash: fade 2.5s → /onboarding/signin.

Sign-in: uses assets/onboarding/welcome.png; two buttons (outlined “Continue without account”, filled “Continue”) route to /(tabs)/today until real auth is wired.

Future steps (birth-date/time/place/confirm) must follow progress bar and image indicators per design.

::contentReference[oaicite:0]{index=0}