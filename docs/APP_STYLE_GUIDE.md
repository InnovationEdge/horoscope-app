# App-Wide Style Guide - Salamene Horoscope App

## Design System Overview
This style guide ensures consistent visual language throughout the entire Salamene Horoscope app, based on the locked paywall design reference.

## Core Design Principles
1. **Premium Feel**: Elegant, mystical design with gradient backgrounds
2. **Consistent Typography**: Strict adherence to Typography scale
3. **Color Harmony**: Purple-themed with gold accents for premium elements
4. **Smooth Animations**: Reanimated-powered transitions
5. **Accessibility First**: Proper labels, roles, and contrast ratios

## Global Layout Standards

### Screen Structure
```
SafeAreaProvider
├── StatusBar (style="light")
├── LinearGradient (Colors.bg.top → Colors.bg.bottom)
│   └── ScrollView
│       ├── Content Sections
│       └── Bottom Spacing (Layout.navbarHeight + 40dp)
└── BottomNav (via Expo Router - only on tab screens)
```

### Spacing System
- **Screen Padding**: `Layout.screenPadding` (16dp) horizontal
- **Section Spacing**: `Layout.sectionSpacing` (24dp) between major sections
- **Element Spacing**: `Spacing.md` (16dp) for related elements
- **Card Padding**: `Layout.cardPadding` (20dp) inside cards
- **Bottom Spacing**: `Layout.navbarHeight + 40dp` for comfortable scrolling

## Typography Hierarchy

### Usage Guidelines
- **Display Large**: Hero titles, main screen headings (36-48sp with clamp)
- **Title Medium**: Section headers, card titles (18-20sp)
- **Title Small**: Subsection headers (16sp)
- **Body Medium**: Primary content, descriptions (14sp)
- **Body Small**: Secondary information (12sp)
- **Label Small**: Fine print, badges, metadata (11sp)

### Font Weights
- **300**: Hero text (greetings)
- **400**: Body text (default)
- **500**: Emphasized content
- **600**: Headers and CTAs
- **700**: Strong emphasis, prices

## Color System

### Primary Colors
- **Background**: Gradient from `Colors.bg.top` to `Colors.bg.bottom`
- **Surface**: `Colors.surface` for cards and elevated elements
- **Primary**: `Colors.primary` (#7C4DFF) for CTAs and active states
- **Gold**: `Colors.gold` for premium elements and highlights

### Text Colors
- **Primary**: `Colors.text.primary` for main content
- **Secondary**: `Colors.text.secondary` for descriptions
- **Inverse**: White for text on colored backgrounds

### Interactive States
- **Active**: `Colors.primary` with 20% opacity background
- **Inactive**: `Colors.iconInactive` (#5C5C66)
- **Disabled**: 60% opacity on normal colors

## Component Standards

### Cards
```typescript
style={{
  backgroundColor: Colors.surface,
  borderRadius: Layout.cardRadius,
  padding: Layout.cardPadding,
  marginBottom: Layout.sectionSpacing,
}}
```

### Buttons
**Primary Button (CTA)**:
- Linear gradient background (Primary → #9C6AFF)
- White text, Typography.titleMedium, 600 weight
- `Layout.buttonRadius` corners
- `Spacing.lg` vertical padding

**Secondary Button**:
- Transparent background with primary border
- Primary text color
- Same sizing as primary

### Pills/Chips
```typescript
style={{
  backgroundColor: Colors.primary + '20',
  borderWidth: 1,
  borderColor: Colors.primary + '40',
  borderRadius: 20,
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.sm,
}}
```

### Premium Elements
- **Badge**: Gold background with dark text
- **Upgrade CTAs**: Primary gradient with white text
- **Blur Effect**: 8-12dp radius for premium content teasers
- **Border**: Gold or primary accent for premium cards

## Animation Standards

### Micro-interactions
- **Press States**: Scale transform 0.95 with spring animation
- **Selection**: Scale pulse 1.0 → 1.2 → 1.0
- **Loading**: Opacity shimmer 0.5 ↔ 1.0, 1500ms duration

### Spring Configuration
```typescript
const springConfig = {
  damping: 15,
  stiffness: 300,
  mass: 1,
}
```

### Timing Configuration
```typescript
const timingConfig = {
  duration: 300,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
}
```

## Screen-Specific Guidelines

### Today Tab
- Greeting: Display Large with font clamping
- Sign Card: 88dp height with accent color theming
- Horoscope Pager: Consistent dot indicators
- Life Aspects: Gold stars for ratings

### Traits Tab
- Sign Selector: Horizontal scroll with chip selection
- Info Cards: Consistent spacing and typography
- Trait Chips: Primary color theming

### Compatibility Tab
- Dual sign layout with VS indicator
- Percentage displays with primary color
- Premium blur overlay for restricted content

### Profile Tab
- Settings list with consistent row heights
- Toggle switches using primary color
- Premium status indicators

## Premium Integration

### Paywall Triggers
- Blur overlays on restricted content
- Subtle "Upgrade" CTAs without being intrusive
- Gold accents on premium features

### Free vs Premium UX
- **Free**: Clear but respectful limitations
- **Premium**: Full access with gold accents
- **Upgrade**: Smooth transitions to paywall

## Accessibility Standards

### Required Elements
- **Labels**: All interactive elements need accessibilityLabel
- **Roles**: Proper accessibilityRole (button, tab, etc.)
- **States**: accessibilityState for selections
- **Hints**: accessibilityHint for complex interactions

### Color Contrast
- **Minimum**: 4.5:1 for normal text
- **Large Text**: 3:1 for 18sp+ text
- **Interactive**: 3:1 for UI components

## Implementation Checklist

### New Screen Creation
- [ ] LinearGradient background
- [ ] SafeAreaProvider wrapper
- [ ] Proper typography hierarchy
- [ ] Consistent spacing tokens
- [ ] Bottom navigation clearance
- [ ] Accessibility labels

### Component Development
- [ ] Theme token usage only
- [ ] No hardcoded colors or sizes
- [ ] Proper TypeScript types
- [ ] Animation configurations
- [ ] Loading and error states

### Premium Features
- [ ] Appropriate blur overlays
- [ ] Gold accent usage
- [ ] Paywall integration
- [ ] State management

## File Structure for Styles
```
constants/
├── theme.ts          // Core tokens
├── signs.ts          // Zodiac-specific colors
└── animations.ts     // Animation configs

components/
├── common/           // Reusable UI components
├── premium/          // Premium-specific components
└── navigation/       // Navigation components
```

## Critical Rules
1. **NEVER** hardcode colors or sizes
2. **ALWAYS** use theme tokens
3. **MAINTAIN** paywall design integrity
4. **TEST** accessibility on each component
5. **PRESERVE** animation performance
6. **VALIDATE** TypeScript strict mode

This style guide is **LOCKED** and must be followed for all new development and updates to maintain design consistency across the Salamene Horoscope app.