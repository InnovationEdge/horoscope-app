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
- Design compelling upgrade prompts