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
  border: '#2F2B3F', // input borders
  iconInactive: '#8E8E93',
  gold: '#F5A623', // stars
  activePill: '#2A2440', // tab bg
  dotInactive: '#5C5C66',

  // Premium chip
  premiumChip: '#EADDFF',
};

export const Typography = {
  // Greeting: clamp 36-48sp, single line
  greeting: {
    fontSize: 42, // default between 36-48sp
    minFontSize: 36,
    maxFontSize: 48,
    lineHeight: 50, // fontSize + 8
    fontWeight: '700' as const,
  },
  // Display text
  displayLarge: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
  // Section titles
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  // Body text
  bodyMedium: { fontSize: 14, lineHeight: 24, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, lineHeight: 20, fontWeight: '400' as const },
  // Labels
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' as const },
};

export const Layout = {
  // Screen & cards
  screenPadding: 16, // horizontal padding
  cardRadius: 24, // corner radius
  cardPadding: 20, // inner padding
  sectionSpacing: 16, // block vertical gap
  greetingOffset: 32, // top greeting offset from status bar

  // Sign card
  signCardHeight: 88, // exact height
  avatarSize: 48, // 48dp circle
  emojiSize: 32, // emoji size

  // Premium chip
  premiumChipHeight: 24, // premium chip height
  premiumChipRadius: 12, // premium chip corner radius
  premiumChipPadding: 12, // premium chip inner padding

  // Bottom navigation
  navbarHeight: 80, // bottom nav height
  fabSize: 64, // center FAB size
  fabElevation: -16, // FAB float above nav
  activePillWidth: 56, // active pill width
  activePillHeight: 32, // active pill height

  // Pagination dots
  dotSize: 8, // pagination dots
  dotSpacing: 6, // spacing between dots
  dotHitSlop: 8, // hit area expansion

  // Horoscope pager
  pagerMinHeight: 240, // minimum card height

  // Life aspects
  starSize: 20, // star icon size (18-20dp range)
  starSizeSmall: 18, // for small screens

  // Banner carousel
  bannerHeight: 120, // banner card height

  // Common
  dividerHeight: 1, // divider height
  touchTargetMin: 48, // minimum touch target
  inputRadius: 12, // input field radius
  buttonRadius: 12, // button radius
};

export const Spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Animation = {
  // Durations
  fast: 120,
  medium: 250,
  slow: 300,
  banner: 5000,
  bannerPause: 2000,

  // Easing
  easeInOutCubic: 'easeInOutCubic' as const,

  // Scale
  fabPressScale: 0.96,
};

export const Blur = {
  intensity: 60, // for premium gating
  radius: 10,
};

// Helper function to get sign accent with alpha
export const getSignAccentWithAlpha = (accent: string, alpha: number = 0.2): string => {
  // Convert hex to rgba with alpha
  const hex = accent.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
