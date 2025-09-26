export const Colors = {
  // Background gradient
  bg: {
    top: '#0D0B1A',
    bottom: '#161325',
  },
  surface: '#1E1B2E',

  // Text
  text: {
    primary: 'rgba(255,255,255,0.87)',
    secondary: 'rgba(255,255,255,0.60)',
  },

  // UI Elements
  outline: '#2F2B3F',
  primary: '#7C4DFF',
  gold: '#F5A623',
  iconInactive: '#8E8E93',

  // Zodiac Accents
  zodiacAccents: {
    aries: '#FF6B6B',
    taurus: '#2ECC71',
    gemini: '#F1C40F',
    cancer: '#3498DB',
    leo: '#F39C12',
    virgo: '#27AE60',
    libra: '#9B59B6',
    scorpio: '#E74C3C',
    sagittarius: '#E67E22',
    capricorn: '#34495E',
    aquarius: '#1ABC9C',
    pisces: '#8E44AD'
  }
};

export const Typography = {
  displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '400' as const },
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' as const },
};

export const Layout = {
  screenPadding: 16,
  cardRadius: 24,
  cardPadding: 20,
  sectionSpacing: 24,
  aspectIconSize: 48,
  aspectEmojiSize: 24,
  navbarHeight: 80,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};