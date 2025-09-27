# Design Review — Zodiac App (FINAL, Build-Strict)

> **Source of visual truth. Implement pixel-for-pixel.**  
> **Never delete/rename any `docs/*.md`.**  
> **Tokens only**—no hardcoded hex/sizes in components (see §1).

---

## 0) Platform, Density, Safe Areas

- **Platforms**: iOS 15+ / Android 10+. Portrait primary; landscape supported (tablet).
- **Safe areas**: All screens respect safe inset (top/bottom) and **80dp** bottom bar height.
- **Density**: Provide raster assets at **1x/2x/3x**. Prefer vector (SVG → RN SVG) for icons where possible.
- **Performance**: 60fps scroll & swipe on mid Android (Pixel 4a) and iPhone SE (2nd gen).

---

## 1) Theme & Tokens (dark-first)

All colors/sizes come from `constants/theme.ts` and `constants/signs.ts`.

### 1.1 Colors

- **Background gradient**: top `#0D0B1A` → bottom `#161325`
- **Surface (cards/nav)**: `#1E1B2E` (elevation 2)
- **Text**: primary `rgba(255,255,255,0.87)`, secondary `rgba(255,255,255,0.60)`
- **Primary (CTA/dots/active)**: `#7C4DFF`
- **Secondary (W/M/Y headers)**: `#4F7BFF`
- **Divider/outline**: `#2F2B3F`
- **Inactive icon/label**: `#8E8E93`
- **Gold (stars)**: `#F5A623`
- **Active pill (tab bg)**: `#2A2440`
- **Dot inactive**: `#5C5C66`
- **Per-sign accent**: from `constants/signs.ts` (use at **20% alpha** for avatar background)

> **Rule**: No hex in components. Import from tokens only.

### 1.2 Typography (sp = “scale-independent pixels”)

- **Greeting**: DisplayLarge (system SF Pro/Roboto or Merriweather if bundled), **clamp 36–48sp**, weight 700, 1 line, `adjustsFontSizeToFit`, `minimumFontScale=0.75`, line-height = fontSize + 8.
- **Section title**: 16sp / 24 line height, weight 600.
- **Body**: 14sp / 24 line height.
- **Label**: 11sp / 16 line height.
- **Tab labels**: 11sp.

### 1.3 Spacing & Shapes

- **Screen padding (H)**: 16dp
- **Block gap (V)**: 16dp
- **Card radius**: 24dp
- **Card inner padding**: 20dp
- **Divider height**: 1dp (`#2F2B3F`)
- **Top greeting offset**: 32dp below status bar
- **Dots**: size 8dp, spacing 6dp

### 1.4 Elevation / Shadows

- **Cards**: Android `elevation: 2–4`; iOS `shadowColor: #000`, `shadowOpacity: 0.2`, `shadowRadius: 8`, `shadowOffset: {0,4}`.
- **FAB**: Android `elevation: 8`; iOS `shadowOpacity: 0.3`, `shadowRadius: 12`, offset `{0,6}`.

---

## 2) Sign System (identity)

- **Emoji**: 32dp inside **48dp circle**; circle bg = sign accent @ **20%** alpha.
- **Sign name**: 16sp bold; **date range**: 12sp, 70% opacity.
- **Canonical mapping** (emoji, date range, accent) in `constants/signs.ts`.  
  UI must **not** compute or hardcode these.

---

## 3) Components (pixel-perfect)

### 3.1 Greeting (hero)

- Text by time:
  - Morning (00–11): “Good morning ✨”
  - Afternoon (11–17): “Good afternoon ☀️”
  - Evening (17–24): “Good evening 🌙”
- Left-aligned; top margin **32dp** from safe top; left padding **16dp**.
- **Date line** under greeting: 14sp, 60% opacity.

### 3.2 Sign Card

- Container: width = screen − 32dp; **height 88dp**; surface bg; radius 24; elevation 2; margin-top 16; padding-X 16.
- Left: **48dp circle**; emoji **32dp** centered; bg = accent@20%.
- Right (center-aligned vertically):
  - Line 1: Sign 16sp
  - Line 2: Date range 12sp (70%)
- Top-right: **Premium chip**: height 24dp, radius 12, padding-X 12, bg `#EADDFF`, text 11sp, ⭐ 16dp.

### 3.3 Horoscope Pager (Today / Weekly / Monthly / Yearly)

- Pager: **`react-native-pager-view`**; snap; native feel; velocity threshold tuned to avoid accidental flips.
- Page card: surface bg, radius 24, padding 20, **min height 240dp** (auto grows).
- Titles:
  - Today: Title 16sp, white.
  - W/M/Y: Title 16sp, **blue `#4F7BFF`**. Show small “Premium” chip if gated.
- Body text: Body 14/24.
- **Today content**:
  - Show **4-line preview**; below it **“Read more ▾”** (Label 12sp, purple).
  - Expanding **animates height** (≈300ms). If longer than viewport, outer screen scrolls—**no clipping**.
  - **Lucky Row** beneath text: 3 equal columns
    - Lucky number: 16sp bold, purple.
    - Lucky color: value text colored by actual color token/string.
    - Mood: 16sp white.
- **W/M/Y (non-premium)**:
  - Keep full text in layout, but apply **Gaussian blur (intensity 60)** using `expo-blur` or masked gradient overlay (radius **8–12dp**) so unreadable.
  - **Sticky CTA** bottom-right inside card: **“Upgrade to Premium”** (Label 12sp, purple).
  - Any interaction (tap body, Read more, CTA, page tap) → navigate `/paywall?src=<timeframe>`.
- **W/M/Y (premium)**: no blur; same expand/collapse as Today.
- **Dots** below pager: 8dp; active `#7C4DFF`, inactive `#5C5C66`; centered; **hit Slop 8**.

### 3.4 Life Aspects (Stars)

- Card title: **“Life Aspects”**.
- **3 columns** fixed order: **Love ❤️**, **Career 💼**, **Health 🩺**.
- Star row (top): **5 icons**, size **18–20dp**; filled = **Gold `#F5A623`**; empty = `#8E8E93`.
- Label under stars: **x/10** (rounded score/10), secondary text.
- Entire card must be fully visible on iPhone SE; **no overflow**.

### 3.5 Banner Carousel (Explore More)

- Placement: **below Life Aspects**.
- Each banner: **height 120dp**, radius 24, surface or gradient bg.
- **Pressable = whole card** (no tiny hit areas).
- Content layout (left aligned):
  - Title 16sp bold; Subtitle 14sp (70% opacity).
  - Optional **bullet list** (“• …” up to 3 lines), 14sp.
- **Dots** below (same spec as pager). Auto-scroll every **5s**; pause on touch; resume after **2s**.
- **Routing** strictly via target mapping:
  - `traits:<sign>` → `/(tabs)/traits?sign=<sign>`
  - `compat:<sign>` → `/(tabs)/compat?with=<sign>`
  - `druid` → `/(tabs)/druid`
  - `chinese` → `/(tabs)/druid?mode=chinese`
  - `premium` → `/paywall?src=banner_<id>`
- If `premium_required && !isPremium` → force paywall route.

### 3.6 Bottom Navigation (with center FAB)

- Container: **80dp** height + bottom inset; bg surface; top hairline `#2F2B3F`.
- Tabs in exact order: **Today · Traits · (Center) Compatibility · Druid · Profile**.
- **FAB (Compatibility)**:
  - **64dp circle**, bg **#7C4DFF**, icon **🫰🏼** white ≈32dp.
  - Float **−16dp** above bar; z-index above tabs; container `pointerEvents="box-none"`.
  - Press: spring scale **0.96 → 1.0** (120ms), shadow/elevation per §1.4.
- Side tabs:
  - `flex:1`; icon inactive **24dp** `#8E8E93`, active **28dp** purple (`#7C4DFF`).
  - **Active pill** behind active icon: **56×32dp**, radius 16, `#2A2440`.
  - Labels 11sp; never overlap icons.
- Behavior: **exactly one** active tab; no double selection.

### 3.7 Onboarding (Salamene)

- Flow: `splash → signin → birth-date → birth-time → birth-place (optional) → confirm`.
- Top **progress bar 4dp** across steps; animates step changes.
- Cards: surface bg; radius 24; padding 20.
- Images (from `assets/onboarding/`):
  - `welcome.png` on **splash/signin** (height 160–220dp responsive).
  - `birth.png` on **birth-\* screens**.
  - `insights.png` on **confirm**.
- Under image on signin/birth screens show **3 dots** (active purple).
- **Birth-time** has “I don’t remember” toggle → defaults to **12:00**, disables picker.
- **Confirm**: show sign emoji in 48dp circle + label; CTA “Continue”.

---

## 4) Motion (Material-aligned)

- **Tab transitions**: fade-through (enter **250ms**, exit **200ms**).
- **Pager swipe**: native snap; dot indicator color animates ≤ **120ms**.
- **Read more**: container height + cross-fade (**≈300ms**), easing `easeInOutCubic`.
- **Stars**: fill opacity animate **200ms** on mount.
- **Banners**: auto-scroll **5000ms**; pause on gesture; resume after **2000ms**.
- **FAB press**: spring/bounce small (scale 0.96 → 1.0).

---

## 5) Responsiveness & Layout Rules

- **Small phones** (≤375w, e.g., iPhone SE):
  - Greeting clamps to **36sp**; everything else unchanged.
  - Life Aspects uses star size **18dp** (not 20) to avoid wrapping.
- **Normal phones** (390–430w): spec sizes as above.
- **Tablets** (≥768w):
  - Today: two-column layout **(pager left 60%, banners right 40%)**, Life Aspects full-width below; maintain card widths with **24dp gutters**.
  - Tabs/nav remain bottom; FAB still center.
- Do **not** exceed **680dp** card width on large screens; center horizontally (content-max).

---

## 6) Accessibility

- **Min touch**: 48×48dp.
- **Labels**: Tabs, FAB (“Compatibility”), pager pages (“Today/Weekly/Monthly/Yearly”), “Upgrade to Premium”, banners (“Open {title}”).
- **Contrast**: all text ≥ **4.5:1** on surfaces.
- **Dynamic Type**: body text may scale; greeting stays **1 line** (auto-shrink enabled).

---

## 7) Behavioral Rules (navigation, gating, defaults)

- **Pager (non-premium)**: W/M/Y text blurred; any interaction opens `/paywall?src=<timeframe>`.
- **Banners**: whole card navigates via mapping; gated banners always to paywall.
- **Traits default**: preselect **user.sign**; `?sign=<sign>` overrides.
- **Compatibility default**: left = **user.sign** (locked); right selectable; `?with=<sign>` prefills + scrolls to result.
- **Druid/Chinese**: default **Druid**; `?mode=chinese` opens Chinese.
- **Onboarding finish**: compute zodiac (`utils/zodiac.ts`), persist, set `onboarded=true`, `router.replace('/(tabs)/today')`.

---

## 8) Loading, Empty, Error

- **Skeletons** (no spinners) for Today card text blocks (3 lines shimmer), banners (grey card), Life Aspects (grey stars).
- **Error inline copy**:
  - Today: “We can’t reach your stars right now. Check your connection and try again.”
  - **Retry** button right-aligned, text style Label 12sp, purple.
- **Empty**: “Your horoscope will be ready soon 🌌.”
- When pricing/api unavailable → show fallback **“from 5 USD/month”** in paywall and banners.

---

## 9) Iconography & Emojis

- Use **sign emojis** for identity (♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓).
- **Navigation icons**:
  - Today: calendar/day glyph (filled when active).
  - Traits: sparkles/star-circle.
  - Compatibility (FAB): **🫰🏼** emoji only.
  - Druid: leaf/tree.
  - Profile: person.
- Icons inactive 24dp `#8E8E93`; active 28dp purple.

---

## 10) Copy & Labels (exact strings)

- App display name: **“Salamene Horoscope”**.
- Pager headers:
  - Today → **“Today’s Horoscope”**
  - Weekly → **“This Week’s Horoscope”**
  - Monthly → **“This Month’s Horoscope”**
  - Yearly → **“Your Year Ahead”**
- Actions:
  - **“Read more ▾”** / **“Read less ▴”**
  - **“Upgrade to Premium”**
  - **“Calculate Match”**
  - **“Continue”**, **“Continue without account”**

---

## 11) Regional Pricing (visual)

- Banners and paywall display **`pricing.monthly_display`** from API:
  - **GE** → “5 GEL” ; **EU** → “5 EUR” ; **US/Other** → “5 USD”.
- Replace any `{PRICE}` placeholders at render time.
- Never hardcode currency strings in UI.

---

## 12) Gestures & Native Feel

- Use **RN Gesture Handler**; disable responder conflicts between vertical scroll and horizontal pager:
  - Outer screen scrolls vertically; pager captures horizontal only.
- HitSlop: add **8dp** padding to small pressables (Read more, CTA).
- Disable ripple for banners on iOS (use opacity); on Android use subtle bounded ripple.

---

## 13) QA Reference Devices

- iPhone SE (375×667), iPhone 13/14 (390×844), Pixel 4a (393×851), Pixel 6 (412×915), iPad 11” (834×1194).
- All visual checks must pass on these. No clipped text, no overlapped labels.

---

## 14) Assets

- **App icon** at `assets/icon.png`; referenced in `app.json`.
- **Onboarding** images at `assets/onboarding/`: `welcome.png`, `birth.png`, `insights.png`.
- Optional sign badges at `assets/zodiac/{sign}.svg|png` (emoji remains canonical in UI).

---

## 15) Don’ts (auto-reject)

- ❌ ScrollView-based pager (must use `react-native-pager-view`).
- ❌ Weekly/Monthly/Yearly readable for free users (blur missing).
- ❌ Flat cards with no elevation/shadow (visual looks 2D).
- ❌ FAB overlapping labels or misaligned.
- ❌ Banners with partial pressable area or wrong deep links.
- ❌ Hardcoded hex/sizes; tokens bypassed.
- ❌ “Coming soon” placeholders for Traits/Compat.

---

## 16) Screenshots (visual truth)

- **Today** → `docs/screens/today.png`
- **Traits** → `docs/screens/traits.png`
- **Compatibility** → `docs/screens/compat.png`
- **Druid** → `docs/screens/druid.png`
- **Profile** → `docs/screens/profile.png`

> If visuals change, replace these PNGs. Code must then match images and this spec.

---

## 17) Compliance

- This design spec is binding. Reviewers must validate sizes, spacing, motion, and behavior against this file and screenshots.
- Any deviation requires updating this doc **before** coding, or a `docs/DELTA.md` entry with rationale.

---
