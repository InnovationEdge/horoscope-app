# Acceptance Criteria — Zodiac App (FINAL, BUILD-STRICT)

> All items are REQUIRED for merge.  
> Never delete/rename any `docs/*.md`.

---

## 0) Global & Theming
- [ ] Dark theme only: background gradient `#0D0B1A → #161325`, surfaces `#1E1B2E`.
- [ ] Tokens only (no hardcoded hex): colors/sizes from `constants/theme.ts`.
- [ ] Typography: Greeting clamp **36–48sp** (single line), Titles 16sp, Body 14sp/24, Labels 11sp.
- [ ] Touch targets ≥ 48×48dp; TalkBack/VoiceOver labels present.
- [ ] 60fps scroll on mid devices; images cached.

---

## 1) Navigation Map (Expo Router)
- [ ] Tabs (exact order):  
  1. `/(tabs)/today`  → label **Today**  
  2. `/(tabs)/traits` → label **Traits**  
  3. `/(tabs)/compat` → label **Compatibility** (CENTER FAB, 🫰🏼 icon)  
  4. `/(tabs)/druid`  → label **Druid** (contains Chinese toggle)  
  5. `/(tabs)/profile`→ label **Profile**
- [ ] Deep links (must work):
  - `app://today` → `/(tabs)/today`
  - `app://traits?sign=<sign>` → `/(tabs)/traits` preselect `<sign>`
  - `app://compat?with=<sign>` → `/(tabs)/compat` prefill other sign
  - `app://druid` → `/(tabs)/druid`
  - `app://chinese` → `/(tabs)/druid?mode=chinese`
  - `app://paywall?src=<source>` → `/paywall`
- [ ] Banners must navigate using the above routes only.

---

## 2) Bottom Navigation (Visual & Behavior)
- [ ] Height **80dp** (+ bottom inset). Background `#1E1B2E`, top hairline `#2F2B3F`.
- [ ] Center tab = **64dp FAB** with **🫰🏼** white (~32dp), bg `#7C4DFF`, floating **−16dp**, scale on press, shadow.
- [ ] Side tabs: `flex:1`, icon active 28dp purple, inactive 24dp `#8E8E93`.
- [ ] Active pill on active side tab: **56×32dp**, radius 16dp, `#2A2440`.
- [ ] Tapping a tab activates only that tab (no dual selection/overlap).
- [ ] `tab_selected { tab }` event emitted.

---

## 3) Today Tab (Home)

### 3.1 Greeting & Sign Card
- [ ] Salutation by time + emoji:
  - Morning (00–11) → “Good morning ✨”
  - Afternoon (11–17) → “Good afternoon ☀️”
  - Evening (17–24) → “Good evening 🌙”
- [ ] Greeting is **single line**, clamped **36–48sp**, positioned **32dp** from status bar.
- [ ] Date below greeting (14sp, 60% opacity).
- [ ] **Sign Card** (height **88dp**):
  - Left: 48dp avatar (sign accent @20%), emoji 32dp center.
  - Right: Sign 16sp; Date range 12sp (70%).
  - Top-right: **Premium** chip 24dp high, `#EADDFF`, text 11sp + ⭐ 16dp.

### 3.2 Horoscope Pager (Swipeable with Blur for Premium)
- [ ] Implement with **`react-native-pager-view`**; snap swipe; dots (8dp).
- [ ] **Pages = 4** (in order): **Today · Weekly · Monthly · Yearly**.
- [ ] Dots centered below (active `#7C4DFF`, inactive `#5C5C66`).
- [ ] **Today page**:
  - [ ] 4-line preview; **Read more** expands to full text.
  - [ ] **Lucky Row** visible: 3 columns (Number purple, Color in that color, Mood white).
  - [ ] `read_more_clicked { timeframe:'today' }` event.
- [ ] **Weekly / Monthly / Yearly pages (non-premium)**:
  - [ ] Header/title tinted **blue `#4F7BFF`**.
  - [ ] Body **blurred** (Gaussian blur or masked gradient) so text is unreadable but length visible.
  - [ ] Show **sticky CTA** inside card bottom-right: **“Upgrade to Premium”** (text button, purple).
  - [ ] Any of: swipe to W/M/Y, tap card, tap Read more, or tap CTA → navigate to `/paywall?src=<timeframe>`.
  - [ ] `paywall_shown { trigger:'<timeframe>' }` event.
- [ ] **Weekly / Monthly / Yearly (premium)**:
  - [ ] No blur; full text visible; Read more expands/collapses.
- [ ] `today_pager_swiped { to:'weekly'|'monthly'|'yearly' }` event on swipe.

### 3.3 Life Aspects (Stars)
- [ ] One card: title **“Life Aspects”**.
- [ ] 3 equal columns: **Love ❤️**, **Career 💼**, **Health 🩺**.
- [ ] For each: **0–5 stars** (from score 0–100 rounded), filled = **Gold `#F5A623`**, empty = **`#8E8E93`**.
- [ ] Below stars show **x/10** (rounded score/10).
- [ ] Fully visible on small devices; no overflow/clipping.

### 3.4 Banner Carousel (Promotions with Deep Links)
- [ ] Placed **below Life Aspects**; 3–4 banners; height **120dp**; radius **24dp**.
- [ ] Each banner is **Pressable** entire card; `banner_clicked { id }` emitted.
- [ ] Each banner supports **bullet list** (“• point …”) up to 3 lines.
- [ ] Dots centered below (same spec as pager).
- [ ] **Routing per banner.target**:
  - `traits:<sign>`    → `app://traits?sign=<sign>`
  - `compat:<sign>`    → `app://compat?with=<sign>`
  - `druid`            → `app://druid`
  - `chinese`          → `app://chinese`
  - `premium`          → `app://paywall?src=banner_<id>`
- [ ] If `premium_required && !isPremium` → force `app://paywall`.

---

## 4) Traits (Characteristics) Tab
- [ ] **Default selection = user.sign**.  
- [ ] User can **change sign** via a selector (chips or dropdown) without leaving tab.
- [ ] Content source: `content/characteristics.json`.
- [ ] Render:
  - Header: avatar (emoji 32dp in 48dp circle), sign name (16sp), date range (12sp).
  - Traits: 3–5 chips.
  - Strengths card (min 120dp), Weaknesses card (min 120dp).
  - Element, Ruling planet, Lucky color/number (inline row).
- [ ] Route param `?sign=<sign>` sets selection on open.
- [ ] No API calls for traits (static).

---

## 5) Compatibility (Center Tab — Best-in-Class)
- [ ] **Pre-filled user sign** on the left (non-editable by default); right selector = other sign.
- [ ] Button **Calculate Match** (filled, purple); haptic/light animation on press.
- [ ] Output (free):
  - Overall % (0–100) in circular dial (128dp, track 4dp).
  - Category bars: Love, Career, Friendship.
  - **Short preview** (1–2 sentences).
- [ ] Output (premium):
  - Adds **250–400 word** breakdown with tips per category.
- [ ] Free users see **“Upgrade to Premium”** CTA under preview; tap → `/paywall?src=compat`.
- [ ] Deep-link `app://compat?with=<sign>` preselects the right sign and scrolls to result.
- [ ] Event: `compatibility_calculated { signA:userSign, signB:selectedSign }`.

---

## 6) Druid & Chinese (Real Content & User-Tied)
- [ ] Default mode: **Druid**; toggle switch **Druid | Chinese** at top.
- [ ] Druid:
  - Maps from birth date to tree sign using `content/druid.json`.
  - Shows **150–250 words**; avatar/icon 48dp; title 16sp.
  - Save computed `user.druidSign` in store for reuse.
- [ ] Chinese:
  - Maps from birth year to animal using `content/chinese.json`.
  - Shows **150–250 words**; avatar/icon 48dp; title 16sp.
  - Save computed `user.chineseAnimal`.
- [ ] Route param `?mode=chinese` opens Chinese view by default.
- [ ] No network dependency for text (static JSON).

---

## 7) Profile
- [ ] Shows: avatar (sign), name (if present), birth date/time/place, zodiac sign & range.
- [ ] Subscription chip: **Free** or **Premium until {date}**.
- [ ] Buttons: **Upgrade to Premium** (if free) / **Manage Subscription** (if premium).
- [ ] Settings list:
  - Notifications (switch)
  - Theme (switch)
  - Edit birth info (moves to onboarding-style card)
  - Logout

---

## 8) Onboarding (with Images & Dots)
- [ ] Flow: `/onboarding/splash → signin → birth-date → birth-time → birth-place (optional) → confirm`.
- [ ] **Top progress bar 4dp** across steps.
- [ ] Use images from `assets/onboarding/`:
  - `welcome.png` on **splash/signin**.
  - `birth.png` on **birth-date/time/place**.
  - `insights.png` on **confirm**.
- [ ] On signin/birth-* screens show **3 indicator dots** under image (active `#7C4DFF`).
- [ ] Birth-time has **“I don’t remember”** toggle → default 12:00 and disables picker.
- [ ] **Confirm** computes zodiac via `utils/zodiac.ts`, saves `user.sign`, persists birth data, sets `user.onboarded=true`, then `router.replace('/(tabs)/today')`.

---

## 9) API & Data Contracts
- [ ] Predictions & Compatibility follow `docs/API_CONTRACT.md` exactly.
- [ ] Traits/Druid/Chinese/Banners loaded from `content/*.json` (no lorem).
- [ ] Premium gating rules:
  - Non-premium: Weekly/Monthly/Yearly content **blurred** with **Upgrade CTA**.
  - Any attempt to access gated content → `/paywall?src=<context>`.

---

## 10) Events (must emit)
- [ ] `today_pager_swiped { to }`
- [ ] `read_more_clicked { timeframe }`
- [ ] `banner_clicked { id }`
- [ ] `tab_selected { tab }`
- [ ] `compatibility_calculated { signA, signB }`
- [ ] `paywall_shown { trigger }`
- [ ] `purchase_success { plan }`

---

## 11) Non-Deletion Rule
- [ ] **Never delete/rename** any `docs/*.md`. If missing, stop and recreate before coding.