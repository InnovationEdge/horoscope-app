# Acceptance Criteria — Zodiac App (FINAL BLUEPRINT SPEC)

> **Strict implementation contract for merge.**  
> **All items are REQUIRED.**  
> **Never delete/rename any `docs/*.md`.**  
> Deviations must be logged in `docs/DELTA.md` before PR.

---

## 0) Global System & Theming

- [ ] **Dark-only UI** with background gradient **#0D0B1A → #161325**; surfaces **#1E1B2E**.
- [ ] **Tokens only**: all colors/sizes/typography from `constants/theme.ts` and sign accents from `constants/signs.ts` (no hex in components).
- [ ] **Typography**
  - [ ] Greeting clamp **36–48sp**, weight **700**, **single line** (`numberOfLines=1`, `adjustsFontSizeToFit`, `minimumFontScale=0.75`).
  - [ ] Title **16sp** / 24, weight **600**. Body **14sp** / 24. Label **11sp** / 16.
- [ ] **Touch targets** ≥ 48×48dp. HitSlop ≥ 8dp for small pressables (“Read more”, dots).
- [ ] **Accessibility**: every icon/emoji/CTA has `accessibilityLabel` & proper `accessibilityRole`.
- [ ] **Performance**: 60fps scroll/swipe on mid Android (Pixel 4a) & iPhone SE; no dropped frames in profiler.
- [ ] **Images**: cached via `expo-image`, each banner/onboarding image ≤ 200 KB (compressed).
- [ ] **Safe areas** respected top/bottom on all screens; tab bar height accounted (80dp).

---

## 1) Navigation Blueprint (Expo Router)

- [ ] Tabs in **this exact order**:
  1. `/(tabs)/today` → label **Today**
  2. `/(tabs)/traits` → **Traits**
  3. `/(tabs)/compat` → **Compatibility** (**center FAB 🫰🏼**)
  4. `/(tabs)/druid` → **Druid** (toggle for Chinese inside)
  5. `/(tabs)/profile` → **Profile**
- [ ] **Deep links** (must work):
  - [ ] `app://today`
  - [ ] `app://traits?sign=<sign>`
  - [ ] `app://compat?with=<sign>`
  - [ ] `app://druid`
  - [ ] `app://druid?mode=chinese` **(alias: `app://chinese`)**
  - [ ] `app://paywall?src=<source>`
- [ ] **Banners/buttons** navigate **only** via these routes.

---

## 2) Bottom Navigation (Pixel-Perfect & Behavior)

- [ ] Height **80dp** (+ bottom inset); bg **#1E1B2E**; top hairline **#2F2B3F** (1dp).
- [ ] **Center FAB (Compatibility)**:
  - [ ] **64dp circle**, bg **#7C4DFF**, icon **🫰🏼** white ≈ 32dp.
  - [ ] Floats **−16dp** above bar; elevation 8 (Android) / shadow radius 12 (iOS).
  - [ ] Press animation: spring scale **0.96 → 1.0** (≈120ms).
- [ ] **Side tabs**:
  - [ ] Icon inactive 24dp `#8E8E93`, active 28dp **#7C4DFF**.
  - [ ] **Active pill** 56×32dp, radius 16, bg **#2A2440** under the active icon.
  - [ ] Labels 11sp, never overlap icons; one active tab **only** at a time.
- [ ] **Analytics**: fire `tab_selected { tab }` on every tab press.

---

## 3) Today Tab (Home)

### 3.1 Greeting & Date

- [ ] Salutation by time:
  - Morning (00–11): **“Good morning ✨”**
  - Afternoon (11–17): **“Good afternoon ☀️”**
  - Evening (17–24): **“Good evening 🌙”**
- [ ] Positioned **32dp** below safe top; single line; date below (14sp, 60% opacity).
- [ ] Card/header title for Today section shows **“Salamene Horoscope”** (brand) instead of generic “Daily”.

### 3.2 Sign Card

- [ ] Card height **88dp**; width = screen − 32dp; radius **24dp**; px padding **16dp**; elevation 2.
- [ ] Left avatar **48dp** circle; bg = sign accent @ **20% alpha**; emoji **32dp** centered.
- [ ] Right stack: **Sign 16sp** bold; **date range 12sp** (70%).
- [ ] Top-right **Premium chip**: 24dp height, radius 12, px 12, bg **#EADDFF**, text 11sp + ⭐ 16dp.

### 3.3 Horoscope Pager (native swipe with gating)

- [ ] **`react-native-pager-view`**; pages **Today → Weekly → Monthly → Yearly**; snap; velocity threshold tuned to feel native.
- [ ] **Dots** centered below pager: **8dp**; active **#7C4DFF**, inactive **#5C5C66**.
- [ ] Each page inside a surface card (radius 24, padding 20, min-height 240dp).

**Today Page (free)**

- [ ] Title “Today’s Horoscope” or brand variant per §3.1.
- [ ] Body **4-line preview**; **“Read more ▾”** expands/collapses with animated height (~300ms); long text **scrolls via outer screen** (no clipping).
- [ ] **Lucky Row** visible:
  - [ ] 3 equal columns: **number** (16sp bold, purple), **color** (value text tinted to that color), **mood** (white).
- [ ] **Analytics**: `read_more_clicked { timeframe:'today' }` on expand.

**Weekly / Monthly / Yearly (non-premium)**

- [ ] Title tinted blue **#4F7BFF**; “Premium” subchip allowed.
- [ ] **Blur** (Gaussian or masked gradient) on body text: radius ~8–12; **text unreadable** yet height preserved.
- [ ] **Sticky CTA** bottom-right inside card: **“Upgrade to Premium”** (Label 12sp, purple).
- [ ] **Any interaction** (tap card/body/Read more/CTA or swipe to page) → navigate `/paywall?src=<timeframe>`.
- [ ] **Analytics**: `paywall_shown { trigger:'<timeframe>' }` upon gating view.

**Weekly / Monthly / Yearly (premium)**

- [ ] No blur; full text; same expand/collapse behavior with **“Read more ▾ / Read less ▴”**.

### 3.4 Life Aspects (stars only)

- [ ] One card titled **“Life Aspects”**; **3 columns**: **Love ❤️**, **Career 💼**, **Health 🩺**.
- [ ] **Stars**: convert score 0–100 → `Math.round(score/20)` (**0–5** stars).
- [ ] **Gold** filled `#F5A623`; empty `#8E8E93`; star size **18–20dp**.
- [ ] **Below** each stars row show **`x/10`** (rounded score/10). **Example**: 83 → **8/10**.
- [ ] Entire card fully visible on small devices (iPhone SE); **no overflow**.

### 3.5 Banner Carousel (Explore more)

- [ ] Placed below Life Aspects; card height **120dp**, radius **24dp**; **whole card Pressable**.
- [ ] Content left aligned: **Title 16sp bold**, **Subtitle 14sp (70%)**, optional **• bullets** (≤3 lines).
- [ ] Dots centered below (same spec as pager).
- [ ] Auto-scroll every **5s**, pause on touch, resume after **2s**.
- [ ] **Routing by `target`** (from `content/banners.json`):
  - `traits:<sign>` → `app://traits?sign=<sign>`
  - `compat:<sign>` → `app://compat?with=<sign>`
  - `druid` → `app://druid`
  - `chinese` → `app://druid?mode=chinese`
  - `premium` → `app://paywall?src=banner_<id>`
- [ ] If `premium_required && !isPremium` → force paywall route.
- [ ] **Analytics**: `banner_clicked { id }` **before** navigation.

---

## 4) Traits (Characteristics)

- [ ] Default selected sign = **user.sign**; user can **switch** via chips/dropdown.
- [ ] Data source is **static** `content/characteristics.json` (no network).
- [ ] Render:
  - [ ] Header: 48dp circle avatar (emoji 32dp), sign name 16sp, date range 12sp.
  - [ ] Trait **chips** (3–5).
  - [ ] **Strengths** card (≥120dp); **Weaknesses** card (≥120dp).
  - [ ] Inline row: Element, Ruling planet, Lucky color/number.

---

## 5) Compatibility (Center FAB experience)

- [ ] Left sign **pre-filled** = user.sign (non-editable by default); right selector = other sign.
- [ ] Primary CTA: **“Calculate Match”** (filled purple); haptic + subtle bounce on press.
- [ ] **Free output**:
  - [ ] **Circular dial** 128dp (stroke 4dp) for overall %.
  - [ ] **3 bars**: Love, Career, Friendship.
  - [ ] **Short preview** (1–2 sentences).
- [ ] **Premium output**:
  - [ ] Adds **250–400 words** deep breakdown with tips.
- [ ] Non-premium shows **Upgrade to Premium** CTA under preview (routes `/paywall?src=compat`).
- [ ] Deep link `app://compat?with=<sign>` preselects and **scrolls to result**.
- [ ] **Analytics**: `compatibility_calculated { signA, signB, overall }`.

---

## 6) Druid & Chinese (static, user-tied)

- [ ] Default **Druid**; toggle at top **Druid | Chinese**.
- [ ] **Druid**: map birth date → tree sign using `content/druid.json`; show **150–250 words**, 48dp icon.
- [ ] **Chinese**: map birth year → animal using `content/chinese.json`; show **150–250 words**, 48dp icon.
- [ ] Persist `user.druidSign` and `user.chineseAnimal` after first compute.
- [ ] Route param `?mode=chinese` opens Chinese by default.
- [ ] No network dependency; loads **offline**.

---

## 7) Profile

- [ ] Shows: avatar (emoji), name (if present), birth date/time/place, zodiac sign & range.
- [ ] Subscription chip: **Free** or **Premium until {date}**.
- [ ] Buttons: **Upgrade to Premium** (if free) / **Manage Subscription** (if premium).
- [ ] Settings:
  - [ ] Notifications (switch)
  - [ ] Theme (switch)
  - [ ] Edit birth info (onboarding-style card)
  - [ ] Logout

---

## 8) Onboarding (Salamene)

- [ ] Flow: `/onboarding/splash → signin → birth-date → birth-time → birth-place (opt) → confirm`.
- [ ] **Top progress bar 4dp** (animated between steps).
- [ ] **Images** from `assets/onboarding/`: `welcome.png`, `birth.png`, `insights.png`.
- [ ] On signin/birth screens show **3 dots** under image (active **#7C4DFF**).
- [ ] Birth-time has **“I don’t remember”** toggle → sets default **12:00** and disables picker.
- [ ] **Confirm** computes sign via `utils/zodiac.ts`, saves to store, sets `user.onboarded=true`, then `router.replace('/(tabs)/today')`.

---

## 9) Monetization & Regional Pricing (server-driven)

- [ ] **Free**: Daily visible; W/M/Y **blurred** + in-card **Upgrade** CTA; Compatibility = preview only.
- [ ] **Premium**: Full W/M/Y; full Compatibility breakdown.
- [ ] **Pricing displayed from API** (not hardcoded): `pricing.monthly_display`.
  - [ ] **GE → “5 GEL”**, **EU → “5 EUR”**, **US/Other → “5 USD”** (from server detection).
  - [ ] Banners may include `{PRICE}` placeholder → client replaces with `pricing.monthly_display`.
- [ ] Any gated attempt (pager W/M/Y, compat premium sections, premium banner) routes to `/paywall?src=<context>`.

---

## 10) Analytics (must emit exactly)

- [ ] `screen_view { name: "today"|"traits"|"compat"|"druid"|"profile"|"onboarding_<step>" }`
- [ ] `tab_selected { tab }`
- [ ] `today_pager_swiped { to: "weekly"|"monthly"|"yearly" }`
- [ ] `read_more_clicked { timeframe: "today"|"weekly"|"monthly"|"yearly" }`
- [ ] `banner_clicked { id, target }` **before** navigation
- [ ] `paywall_shown { trigger: "<timeframe>"|"banner_<id>"|"compat" }`
- [ ] `compatibility_calculated { signA, signB, overall }`
- [ ] Purchases (Flitt):
  - [ ] `purchase_initiated { plan, price_minor, currency }`
  - [ ] `purchase_success { plan, price_minor, currency, tx_id }` / `purchase_failed { plan, reason }`
- [ ] All events include `user_props.sign` and `is_premium` (see `docs/ANALYTICS.md`).

---

## 11) Reliability, Motion & Gestures

- [ ] **Read more**: height + cross-fade (~300ms), easing `easeInOutCubic`.
- [ ] **Pager**: native snap; dots update ≤ 120ms after swipe.
- [ ] **FAB**: spring/bounce (scale 0.96 → 1.0).
- [ ] **Banners**: auto-scroll 5s; pause on touch; resume after 2s.
- [ ] **Gesture conflict**: horizontal pager wins vs vertical scroll inside its bounds; outer screen scrolls otherwise (no jitter).
- [ ] **Error states**: inline friendly copy + Retry (no raw stack traces).
- [ ] **Offline**: show last cached daily (≤24h) or empty state “Your horoscope will be ready soon 🌌.”

---

## 12) Accessibility & Contrast

- [ ] Every Pressable has `accessibilityLabel` and role.
- [ ] Pager pages labeled **“Today/Weekly/Monthly/Yearly”** for screen readers.
- [ ] FAB label **“Compatibility”**.
- [ ] Contrast for all text on surfaces **≥ 4.5:1**.

---

## 13) Data & Content Sources (no lorem)

- [ ] **Traits/Druid/Chinese/Banners** loaded from **`content/*.json`** (bundled, offline).
- [ ] **Predictions/Compatibility** from API per `docs/API_CONTRACT.md`.
- [ ] Copy & lengths follow `docs/CONTENT_GUIDELINES.md` (daily 80–120 words; W/M/Y premium lengths; compat preview + premium text).
- [ ] Region pricing from API (`/payments/products`) with `monthly_display`.

---

## 14) Testing & QA (must pass)

- [ ] **Unit**: `utils/zodiac.ts` edge dates; score→stars (0..100 → 0..5).
- [ ] **Snapshot**: Today card (free vs premium), BottomNav with FAB.
- [ ] **Smoke**:
  - [ ] Pager swipe updates dots and pages.
  - [ ] W/M/Y blur + in-card Upgrade CTA for free.
  - [ ] Banners deep-link exactly per mapping; `{PRICE}` replaced.
  - [ ] Traits loads instantly from JSON; switching signs works.
  - [ ] Compat computes and renders; deep link `?with=` preselects.
  - [ ] Druid/Chinese compute offline and persist.
- [ ] Device matrix: iPhone SE, iPhone 13/14, Pixel 4a/6, iPad 11″ (layouts per `docs/DESIGN_REVIEW.md`).

---

## 15) Definition of Done (for any PR)

- [ ] All relevant checkboxes in this **Acceptance** list ticked.
- [ ] Visuals match `docs/DESIGN_REVIEW.md` (sizes, spacing, motion).
- [ ] Analytics events wired per `docs/ANALYTICS.md`.
- [ ] No hardcoded hex/sizes; tokens only.
- [ ] CI green (lint, typecheck, tests); coverage ≥ 80%.
- [ ] `docs/*.md` not deleted/renamed; updates to docs included when behavior changes.

---

## 16) Non-Deletion Rule

- [ ] **Never delete/rename** any `docs/*.md`. If missing, **stop and recreate** before coding.
