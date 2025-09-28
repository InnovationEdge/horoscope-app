# Paywall Design Reference - LOCKED DESIGN

## Overview
This document captures the exact design specifications for the paywall screen that should be maintained throughout the app. This is the reference implementation for premium upgrade flows.

## Core Design Elements

### Header Section
- **Close Button**: 32x32dp, positioned top-left with 16dp margin
  - Background: `rgba(255,255,255,0.1)`
  - Icon: "✕" in white, 16sp font size, 600 weight
  - Border radius: 16dp
- **Title**: "Unlock Premium" centered, using `Typography.titleMedium`

### Hero Section
- **Logo Container**: 80x80dp circle with purple background `rgba(124, 77, 255, 0.2)`
  - Logo: 60x60dp app logo centered
  - Shimmer animation effect on container
- **Main Title**: "Salamene Premium" using `Typography.displayLarge`
- **Subtitle**: "Unlock the full power of your cosmic destiny" in secondary text color
- **Vertical spacing**: `Spacing.xl` (24dp) for hero section

### Features List
Each feature item follows this exact structure:
- **Container**: Row layout with `Spacing.md` vertical padding
- **Icon**: 24sp emoji, 32dp width, centered alignment, `Spacing.md` right margin
- **Content**:
  - **Title**: `Typography.titleMedium` in primary text color
  - **Description**: `Typography.bodySmall` in secondary text color, 2dp bottom margin

**Exact Feature List**:
1. 🔮 "Unlimited Horoscopes" - "Daily, weekly, monthly & yearly predictions"
2. 💕 "Advanced Compatibility" - "Deep relationship insights & compatibility reports"
3. 🌟 "Premium Content" - "Exclusive horoscopes & astrological insights"
4. 📱 "No Ads" - "Enjoy an uninterrupted, premium experience"
5. 🔔 "Smart Notifications" - "Personalized daily reminders & cosmic alerts"
6. 🌙 "Birth Chart Analysis" - "Complete natal chart & planetary positions"

### Pricing Plans
**Plan Card Specifications**:
- **Container**: `Colors.surface` background, `Layout.cardRadius` rounded corners
- **Padding**: `Spacing.lg` all around
- **Border**: 2dp, transparent default, `Colors.primary` when selected
- **Popular Badge**: Gold background (`Colors.gold`), positioned -8dp from top, centered
- **Spacing**: `Spacing.md` bottom margin between cards

**Plan Structure**:
- **Header**: Row layout with space-between justification
- **Plan Info**: Flex 1 container with:
  - Name: `Typography.titleMedium`
  - Price: `Typography.displayLarge`, 28sp, 700 weight, purple color
  - Period: `Typography.bodySmall` in secondary text
  - Savings: `Typography.labelSmall` in gold color (if applicable)
- **Checkmark**: 24x24dp circle, purple background when selected

**Exact Pricing Structure**:
1. **Weekly**: $2.99/week, no special styling
2. **Monthly**: $9.99/month, marked as "Most Popular" with gold badge
3. **Yearly**: $59.99/year, "Save 50%" in gold text

### Purchase Button
- **Container**: Full width with `Layout.buttonRadius` corners
- **Gradient**: Primary to `#9C6AFF` linear gradient
- **Padding**: `Spacing.lg` vertical
- **Text**: "Start Premium - [PRICE]" in white, `Typography.titleMedium`, 600 weight
- **Loading State**: White activity indicator when purchasing

### Footer Section
- **Restore Link**: "Restore Purchases" in `Typography.bodySmall`, secondary color
- **Legal Text**: "Terms of Service • Privacy Policy" in secondary color
- **Disclaimer**: Small text about auto-renewal, `Typography.labelSmall`
- **Spacing**: `Spacing.xl` bottom padding

## Animation Specifications

### Shimmer Effect
- **Target**: Logo container opacity
- **Pattern**: 0.5 to 1.0 opacity with 1500ms duration
- **Repeat**: Infinite with reverse direction

### Checkmark Animation
- **Trigger**: Plan selection
- **Pattern**: Scale from 0 to 1.2, then to 1.0
- **Config**: Spring animation with damping 15, stiffness 300

## Color Specifications
- **Background**: Linear gradient from `Colors.bg.top` to `Colors.bg.bottom`
- **Surface**: `Colors.surface` for cards
- **Primary**: `Colors.primary` for selections and CTAs
- **Gold**: `Colors.gold` for popular badges and savings
- **Text Primary**: `Colors.text.primary`
- **Text Secondary**: `Colors.text.secondary`

## Typography Scale
- **Display Large**: Hero titles
- **Title Medium**: Section headers and button text
- **Body Medium**: Standard content
- **Body Small**: Descriptions and secondary info
- **Label Small**: Fine print and badges

## Layout Specifications
- **Screen Padding**: `Spacing.lg` horizontal margins
- **Section Spacing**: `Spacing.xl` between major sections
- **Card Spacing**: `Spacing.md` between cards
- **Element Spacing**: `Spacing.md` for related elements

## Responsive Behavior
- **Scroll View**: Vertical scroll with hidden indicators
- **Safe Area**: Proper top edge handling
- **Content Container**: Padded for comfortable reading

## Implementation Notes
- Uses Expo LinearGradient for backgrounds and buttons
- React Native Reanimated for smooth animations
- Proper accessibility labels and roles
- Loading states for purchase flow
- Error handling for failed purchases

## Critical Requirements
1. **Never modify** the exact feature list or descriptions
2. **Always use** the specified color tokens from theme
3. **Maintain** the three-plan structure with exact pricing display format
4. **Preserve** all animation timings and configurations
5. **Keep** the shimmer effect on logo container
6. **Use** proper TypeScript typing throughout

This design is **LOCKED** and should be used as the reference for all premium upgrade flows throughout the app.