# Claude Instructions for Horoscope App

## Project Overview
A monetizable horoscope mobile app built with React Native and Expo, featuring daily horoscopes, zodiac compatibility, premium content, and subscription features.

## Key Technologies
- **Framework**: React Native with Expo SDK
- **Navigation**: Expo Router with file-based routing
- **Language**: TypeScript
- **UI/UX**: React Native components with custom styling
- **Animations**: React Native Reanimated
- **Icons**: @expo/vector-icons
- **Monetization**: In-app purchases, subscriptions, ads

## Project Structure
- `app/` - Main application screens (Expo Router file-based routing)
- `components/` - Reusable UI components
- `constants/` - App constants, zodiac data, colors
- `hooks/` - Custom React hooks
- `services/` - API calls, monetization services
- `types/` - TypeScript type definitions
- `utils/` - Helper functions and utilities
- `assets/` - Images, icons, zodiac symbols

## Development Commands
- **Start development server**: `npm start`
- **Run on iOS**: `npm run ios`
- **Run on Android**: `npm run android`
- **Run on web**: `npm run web`

## Key Features for Monetization
1. **Daily Horoscopes** - Free daily content with premium detailed versions
2. **Compatibility Reports** - Premium zodiac compatibility analysis
3. **Personalized Birth Charts** - Premium astrological chart generation
4. **Weekly/Monthly Predictions** - Subscription-based extended forecasts
5. **Push Notifications** - Daily horoscope reminders
6. **Premium Content** - Exclusive horoscopes and insights
7. **In-App Purchases** - One-time premium features
8. **Subscription Tiers** - Weekly/monthly/yearly plans

## App Structure
- **Onboarding** - Zodiac sign selection and birth info
- **Home** - Daily horoscope and quick access
- **Horoscope** - Detailed daily/weekly/monthly horoscopes
- **Compatibility** - Love and friendship compatibility
- **Profile** - Birth chart, settings, subscription management
- **Premium** - Subscription and purchase flows

## Development Guidelines
- Follow React Native and Expo best practices
- Implement proper TypeScript typing
- Create reusable components for zodiac content
- Design with monetization UX in mind
- Test subscription and purchase flows
- Optimize for both iOS and Android
- Support light and dark themes

## Monetization Implementation
- Use expo-in-app-purchases for subscriptions
- Implement paywall components
- Track user engagement for optimization
- A/B test premium feature placement
- Design compelling upgrade prompts# CLAUDE.md — Build Control (FINAL)

**You are the code assistant for this repo.**  
Follow this file **exactly**. Do **not** improvise design, content, or routes.

---

## 0) Non-Negotiable Rules

1) **Never delete/rename** any file under `docs/*.md`.  
2) **Always read first** (in this order) before coding:
   - `docs/DESIGN_REVIEW.md`
   - `docs/ACCEPTANCE.md`
   - `docs/CONTENT_GUIDELINES.md`
   - `docs/API_CONTRACT.md`
   - `docs/CODE_REVIEW.md`
   - `docs/ANALYTICS.md`
3) If any above file is missing: **create an empty file** at that path and continue.  
4) Use only tokens from `constants/theme.ts` and `constants/signs.ts`. **No hardcoded hex/sizes.**  
5) **Do not** add new tabs or routes not in Design Review.  
6) Traits/Druid/Chinese are **static JSON** from `content/*.json`. No lorem in code.  
7) Weekly/Monthly/Yearly for free users = **blurred body + “Upgrade to Premium” CTA**; any interaction opens `/paywall?src=<timeframe>`.  
8) Banners must be full-card **Pressable** and deep-link to the specified route mapping.  
9) Pricing is **region-based** (server-driven). Use `pricing.monthly_display` from API; **never** hardcode currency.

---

## 1) Session Bootstrap (paste this at the top of every coding session)

> **Bootstrap Checklist (Claude must do silently before coding):**
> 1. Ensure these files exist; if missing, create empty:  
>    `docs/API_CONTRACT.md`, `docs/CODE_REVIEW.md`, `docs/CONTENT_GUIDELINES.md`,  
>    `docs/PROJECT_FLOW.md`, `docs/ANALYTICS.md`, `docs/README.md`  
> 2. Read all `docs/*.md` listed in §0.  
> 3. Confirm assets: `assets/onboarding/welcome.png`, `birth.png`, `insights.png` (create zero-byte placeholders if missing).  
> 4. Confirm folders: `content/` exists (create if missing).  
> 5. Do not alter `docs/DESIGN_REVIEW.md` or `docs/ACCEPTANCE.md`.

---

## 2) Allowed File Areas (modify only these unless asked)

- `app/` (Expo Router): screens, stacks, tabs  
- `components/`: reusable UI (BottomNav, HoroscopePager, LifeAspects, BannerCarousel, SignCard, ProgressBarTop)  
- `services/`: api, analytics, pricing  
- `store/`: user/subscription state  
- `utils/`: helpers (e.g., zodiac, text clamp)  
- `constants/`: theme/signs tokens  
- `assets/`: onboarding images, banners, zodiac icons

**Do not** modify or delete `docs/*.md`.

---

## 3) Canonical Behaviors (implement exactly)

### Tabs (order & visuals)
- Today · Traits · **(Center) Compatibility** · Druid · Profile  
- Center is a **64dp FAB** with **🫰🏼** (white), bg `#7C4DFF`, floats −16dp.  
- Active pill under active side tab **56×32dp**, `#2A2440`. No overlapping labels.

### Today
- Greeting single line, clamped 36–48sp, 32dp from top; date below.  
- Sign Card 88dp (48dp avatar bg = sign accent @20%, emoji 32dp, 24dp Premium chip).  
- **Horoscope Pager** with `react-native-pager-view`: Today · Weekly · Monthly · Yearly.  
  - Today: 4-line preview + **Read more** expands; **Lucky Row** (Number purple, Color actual color, Mood white).  
  - Weekly/Monthly/Yearly (free): **blur body** (radius 8–12) + sticky **Upgrade to Premium** CTA; **any** interaction → `/paywall?src=<timeframe>`.  
  - Weekly/Monthly/Yearly (premium): no blur; full text + expand.  
  - Dots centered (8dp; active purple, inactive `#5C5C66`).  
- **Life Aspects**: 3 columns (Love/Career/Health) with **0–5 stars** (gold) and **x/10** label.  
- **Banner Carousel** 120dp, full-card press; optional bullet list (• up to 3 lines).  
  - Deep links:  
    - `traits:<sign>`  → `/(tabs)/traits?sign=<sign>`  
    - `compat:<sign>`  → `/(tabs)/compat?with=<sign>`  
    - `druid`          → `/(tabs)/druid`  
    - `chinese`        → `/(tabs)/druid?mode=chinese`  
    - `premium`        → `/paywall?src=banner_<id>`  
  - If `premium_required && !isPremium` → paywall route.

### Traits
- Default to **user.sign**; user can change sign in place.  
- Load from `content/characteristics.json` only (no network).  
- Show traits chips (3–5), strengths, weaknesses, element, planet, lucky color/number.

### Compatibility
- Left = `user.sign`, right = selected sign.  
- Free: overall %, category scores, short preview.  
- Premium: adds 250–400 word breakdown + tips; show Upgrade CTA for free.  
- Deep link `?with=<sign>` preselects right sign.

### Druid & Chinese
- Default **Druid**; toggle to **Chinese** (or `?mode=chinese`).  
- Static texts from `content/druid.json` / `content/chinese.json`.  
- Compute and cache `user.druidSign` / `user.chineseAnimal`.

### Onboarding (Salamene Onboarding)
- Splash → Signin → Birth-Date → Birth-Time (with “I don’t remember”) → Birth-Place (optional) → Confirm.  
- Top progress bar 4dp; images from `assets/onboarding/`.  
- Confirm computes zodiac (utils/zodiac.ts), persist to store, `router.replace('/(tabs)/today')`.

### Regional Pricing (server-driven)
- Always read `pricing` from `/api/v1/payments/products`.  
- Show `pricing.monthly_display` (GE=“5 GEL”, EU=“5 EUR”, US/other=“5 USD”).  
- Replace banner `{PRICE}` placeholders with `monthly_display`.

---

## 4) Analytics (must emit)

Use `services/analytics.ts` (`track`):  
- `screen_view`, `tab_selected`  
- `today_pager_swiped`, `read_more_clicked`  
- `paywall_shown`, `upgrade_cta_clicked`  
- `banner_clicked`  
- `traits_sign_changed`  
- `compatibility_calculated`  
- `purchase_initiated`, `purchase_success`, `purchase_failed`

---

## 5) Required Files to Create on Demand

If absent, **create empty files** (do not add content unless asked):
- `docs/API_CONTRACT.md`
- `docs/CODE_REVIEW.md`
- `docs/CONTENT_GUIDELINES.md`
- `docs/PROJECT_FLOW.md`
- `docs/ANALYTICS.md`
- `docs/README.md`

Create folders if missing:
- `content/`
- `assets/onboarding/` with placeholders:
  - `welcome.png`, `birth.png`, `insights.png`

---

## 6) Output Format (every time you finish a task)

Reply with a **delta report**:

CHANGED:

app/(tabs)/today.tsx

components/HoroscopePager.tsx

components/BannerCarousel.tsx

CREATED:

app/onboarding/signin.tsx

services/pricing.ts

SKIPPED (already existed):

docs/DESIGN_REVIEW.md

docs/ACCEPTANCE.md

NOTES:

Installed react-native-pager-view

Weekly/Monthly/Yearly blurred for free users per spec

yaml
Copy code

Do **not** include unrelated files. Do **not** modify docs unless explicitly asked.

---

## 7) Self-Check Before Reply

- [ ] Matches `docs/DESIGN_REVIEW.md` (sizes, colors, blur, dots, FAB).  
- [ ] Passes `docs/ACCEPTANCE.md` for the touched screen(s).  
- [ ] Uses deep-link mapping for banners.  
- [ ] Traits/Druid/Chinese read from `content/*.json`.  
- [ ] Uses server `pricing.monthly_display` for any price string.  
- [ ] Emits required analytics events.  
- [ ] No `docs/*.md` deleted/renamed.  
- [ ] TypeScript strict; no `any`; no hardcoded hex/sizes.

---

## 8) First Tasks Queue (use as starting points if asked)

1) **Onboarding Signin** (`app/onboarding/signin.tsx`): Salamene Onboarding screen, two buttons → `/(tabs)/today` (temp).  
2) **Today Tab**: implement pager (blur W/M/Y + Upgrade CTA), Life Aspects stars, Banner Carousel with deep links.  
3) **BottomNav**: center 🫰🏼 FAB, active pill, no overlap.  
4) **Paywall Screen**: reads pricing, shows `{PRICE}`.  
5) **Traits Tab**: default to user sign; switchable.  
6) **Compat Tab**: calculate, preview (free), full (premium).  
7) **Druid/Chinese Tab**: static texts; user mapping.

---

## 9) If Something Is Missing

- Create the empty file(s) under `docs/` or `content/` as specified.  
- Proceed with code that reads from them (even if empty).  
- Report missing real content as **NOTE** in the delta report.