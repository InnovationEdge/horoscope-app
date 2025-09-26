export const Strings = {
  // Greetings (dynamic)
  greetingMorning: 'Good morning',
  greetingAfternoon: 'Good afternoon',
  greetingEvening: 'Good evening',
  greetingEmoji: '✨',

  // Navigation
  navToday: 'Today',
  navTraits: 'Traits',
  navCompat: 'Compatibility',
  navDruid: 'Druid & Chinese',
  navProfile: 'Profile',

  // Today screen
  todayLifeAspects: 'Life Aspects',
  todayLove: 'Love',
  todayCareer: 'Career',
  todayHealth: 'Health',
  todayLucky: 'Lucky',
  todayNumber: 'Number',
  todayColor: 'Color',
  todayMood: 'Mood',

  // Horoscope pager
  horoscopeToday: 'Today',
  horoscopeWeekly: 'Weekly',
  horoscopeMonthly: 'Monthly',
  horoscopeYearly: 'Yearly',
  readMore: 'Read more ▾',

  // Premium
  premium: 'Premium',
  premiumStar: '⭐',
  upgrade: 'Upgrade',

  // Actions
  calculate: 'Calculate',
  open: 'Open',
  manage: 'Manage',

  // Error states
  errorTitle: 'Your stars are still aligning…',
  errorMessage: 'We couldn\'t load this reading. Try again.',
  errorRetry: 'Try again',
  offlineLabel: 'Offline',

  // Empty states
  emptyBanner: '✨ More insights coming soon',

  // Accessibility
  a11yProgressBar: 'score',
  a11yHoroscopePreview: 'horoscope preview',
  a11yOpenCompat: 'Open Compatibility',

  // Common
  percent: '%',
  match: 'Match',
} as const;

export type StringKey = keyof typeof Strings;