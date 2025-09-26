export const Colors = {
  // Background gradient (dark-first)
  bg: {
    top: '#0D0B1A',
    bottom: '#161325',
  },
  surface: '#1E1B2E', // elevation 2 cards, nav

  // Text
  text: {
    primary: 'rgba(255,255,255,0.87)',
    secondary: 'rgba(255,255,255,0.60)',
  },

  // UI Elements
  primary: '#7C4DFF', // CTA/dots/active
  secondaryBlue: '#4F7BFF', // W/M/Y headers
  outline: '#2F2B3F', // divider/outline
  iconInactive: '#8E8E93',
  gold: '#F5A623', // stars
  activePill: '#2A2440', // tab bg
  dotInactive: '#5C5C66',

  // Premium chip
  premiumChip: '#EADDFF',

  // Zodiac Accents (per sign)
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
  screenPadding: 16, // horizontal padding
  cardRadius: 24, // corner radius
  cardPadding: 20, // inner padding
  sectionSpacing: 16, // block vertical gap
  greetingOffset: 32, // top greeting offset from status bar
  signCardHeight: 88, // exact height
  avatarSize: 48, // 48dp circle
  premiumChipHeight: 24, // premium chip height
  fabSize: 64, // center FAB size
  activePillWidth: 56, // active pill width
  activePillHeight: 32, // active pill height
  navbarHeight: 80, // bottom nav height
  dotSize: 8, // pagination dots
  dotSpacing: 6, // spacing between dots
  dividerHeight: 1, // divider height
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};