# Design Review — Zodiac App (FINAL, Build-Strict)

> Source of visual truth. No improvisation.  
> **Never delete/rename any `docs/*.md`.**

---

## 0) Theme & Tokens (dark-first)

- **Background gradient:** top `#0D0B1A` → bottom `#161325`
- **Surface (cards, nav):** `#1E1B2E` (elevation 2)
- **Text:** primary `rgba(255,255,255,0.87)`, secondary `rgba(255,255,255,0.60)`
- **Primary UI accent (CTA/dots/active):** `#7C4DFF`
- **Secondary blue (W/M/Y headers):** `#4F7BFF`
- **Divider/outline:** `#2F2B3F`
- **Inactive icon/label:** `#8E8E93`
- **Gold (stars):** `#F5A623`
- **Active pill (tab bg):** `#2A2440`
- **Dot inactive:** `#5C5C66`
- **Per-sign accents & emoji:** see `constants/signs.ts` (use accent @ 20% alpha for avatar bg)

> **Rule:** Use only tokens from `constants/theme.ts` & `constants/signs.ts`. No hardcoded hex in components.

---

## 1) Typography

- **Greeting (hero):** Merriweather DisplayLarge; **clamp 36–48sp**, line-height +8; `numberOfLines=1`, `adjustsFontSizeToFit`, `minimumFontScale=0.75`
- **Section title:** TitleMedium **16sp** / 24
- **Body:** BodyMedium **14sp** / 24
- **Label:** LabelSmall **11sp** / 16
- **Tab labels:** LabelSmall **11sp**

---

## 2) Spacing, Layout, Shapes

- **Screen horizontal padding:** **16dp**
- **Block vertical gap:** **16dp**
- **Card corner radius:** **24dp**
- **Card inner padding:** **20dp**
- **Divider height:** **1dp** (`#2F2B3F`)
- **Top greeting offset:** **32dp** below status bar
- **Dots:** size **8dp**, spacing **6dp**

---

## 3) Components (pixel-perfect)

### 3.1 Greeting
- Content by time:
  - Morning (00–11): “Good morning ✨”
  - Afternoon (11–17): “Good afternoon ☀️”
  - Evening (17–24): “Good evening 🌙”
- Single line; left aligned; top margin **32dp**; left padding **16dp**
- Date line below (14sp, 60% opacity), left aligned

### 3.2 Sign Card (identity)
- Container: width = screen − 32dp; **height 88dp**; surface bg; radius 24dp; elevation 2; margin-top 16dp; padding-X 16dp
- Left: **48dp circle**; bg = sign accent @ 20%; **emoji 32dp** centered
- Right (stacked, center vertically):
  - Sign name **16sp**
  - Date range **12sp** (70% opacity)
- Top-right: **Premium chip**: 24dp height, radius 12dp, inner pad-X 12dp, bg `#EADDFF`, text 11sp, ⭐ 16dp

### 3.3 Horoscope Pager (Today / Weekly / Monthly / Yearly)
- **Pager:** `react-native-pager-view`; snap; height auto (min 240dp)
- Card container (each page): surface bg, radius 24dp, padding 20dp
- **Headers:**
  - Today title: TitleMedium 16sp, white
  - Weekly/Monthly/Yearly title: TitleMedium 16sp, **blue `#4F7BFF`**, small “Premium” chip if gated
- **Body text:** Body 14sp/24; Today shows **4-line preview** + “Read more ▾” (Label 12sp, purple)
- **Lucky Row (Today only):** 3 equal columns
  - Icon 28dp
  - Label 11sp (secondary)
  - Value 16sp (Number purple; Color in that color; Mood white)
- **Dots:** centered below pager; 8dp; active purple; inactive `#5C5C66`
- **Blur for non-premium (W/M/Y):**
  - Apply **Gaussian blur** (or masked gradient overlay) to body area so text is unreadable (blur radius ~8–12) but layout height is preserved
  - Sticky **“Upgrade to Premium”** text button inside card bottom-right (Label 12sp, purple)
  - Tapping the page, Read more, or CTA navigates to `/paywall?src=<timeframe>`

### 3.4 Life Aspects (stars)
- One card titled **“Life Aspects”**
- **3 columns**: Love ❤️, Career 💼, Health 🩺
- For each:
  - Stars row: **5 icons**; filled = Gold `#F5A623`; empty = `#8E8E93`; size **18–20dp**
  - Numeric label beneath: **x/10** (secondary text)
- Entire card fully visible on small screens; no overflow

### 3.5 Banner Carousel (Explore More)
- Position: **below Life Aspects**
- Each banner: **height 120dp**, radius 24dp, surface or gradient bg, **Pressable (full card)**
- Content:
  - Title 16sp (white 87%)
  - Subtitle 14sp (white 70%)
  - Optional **bullet list** (• 14sp, max 3 lines)
- **Dots** under carousel (same spec as pager)
- **Deep link mapping** (banner.target → route):
  - `traits:<sign>`    → `/(tabs)/traits?sign=<sign>`
  - `compat:<sign>`    → `/(tabs)/compat?with=<sign>`
  - `druid`            → `/(tabs)/druid`
  - `chinese`          → `/(tabs)/druid?mode=chinese`
  - `premium`          → `/paywall?src=banner_<id>`

### 3.6 Bottom Navigation
- Container: height **80dp** + bottom inset; bg surface; top hairline `#2F2B3F`
- Tabs: **Today · Traits · (Center) Compatibility · Druid · Profile**
- **Center FAB (Compatibility):**
  - **64dp circle**, bg `#7C4DFF`, icon **🫰🏼** white (~32dp)
  - Float **−16dp**; label below 11sp; **pointerEvents='box-none'** on container
  - Press: scale 0.96 → 1.0 (120ms), shadow/elevation
- Side tabs:
  - `flex:1` each; icon active **28dp** purple; inactive **24dp** gray
  - **Active pill** under active tab: **56×32dp**, radius 16dp, `#2A2440`
  - Labels always visible (11sp)

### 3.7 Onboarding (with images & dots)
- Screens: splash → signin → birth-date → birth-time → birth-place (optional) → confirm
- **Top progress bar:** height **4dp**, full width
- Cards: surface bg; radius 24dp; inner padding 20dp
- **Images:** from `assets/onboarding/`
  - `welcome.png` on splash/signin (height 160–220dp)
  - `birth.png` on birth-* screens
  - `insights.png` on confirm
- On signin/birth screens, show **3 indicator dots** under the image (active purple)

---

## 4) Motion (Material-aligned)

- **Tab transitions:** fade-through (enter 250ms, exit 200ms)
- **Pager swipe:** native snap; dot indicator updates in 120ms
- **Read more expand:** container transform + cross-fade (300ms)
- **Stars:** animate fill opacity 0 → 1 (200ms) on mount
- **Banners:** auto-scroll 5s (pause on user interaction)
- **FAB press:** spring/bounce subtle (scale 0.96 → 1.0)

---

## 5) Accessibility

- **Min touch target:** 48×48dp
- **Screen reader labels:** tabs, pager pages (“Today/Weekly/Monthly/Yearly”), “Upgrade to Premium” buttons, banners
- **Color contrast:** all text ≥ 4.5:1 on surfaces
- **Dynamic type:** body text can scale; clamp greeting to 1 line

---

## 6) Screenshots (visual truth)

- Today: `docs/screens/today.png`  
- Traits: `docs/screens/traits.png`  
- Compatibility: `docs/screens/compat.png`  
- Druid: `docs/screens/druid.png`  
- Profile: `docs/screens/profile.png`

> If mockups change, replace these PNGs and update nothing else.

---

## 7) Behavioral Rules (navigation & gating)

- **Pager non-premium:** Weekly/Monthly/Yearly body **blurred**; any interaction opens `/paywall?src=<timeframe>`
- **Banners:** entire card navigates via mapping in 3.5; if `premium_required && !isPremium` → `/paywall?src=banner_<id>`
- **Traits default sign:** Use `user.sign` by default; `?sign=<sign>` overrides
- **Compatibility default:** Left sign = `user.sign`; right sign selectable; `?with=<sign>` prefills and scrolls to result
- **Druid/Chinese:** default tab = Druid; `?mode=chinese` opens Chinese
- **Onboarding end:** compute zodiac (utils/zodiac.ts), save to store, set `onboarded=true`, `router.replace('/(tabs)/today')`

---

## 8) Non-Deletion Rule

- **Never delete or rename** any `docs/*.md`.  
- If a doc is missing, **stop** and recreate before coding.
