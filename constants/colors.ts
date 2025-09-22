export const Colors = {
  // Primary Brand Colors
  primary: '#6A5ACD',        // Slate Blue
  primaryDark: '#483D8B',    // Dark Slate Blue
  primaryLight: '#9370DB',   // Medium Purple

  // Secondary Colors
  secondary: '#FFD700',      // Gold
  secondaryDark: '#FFA500',  // Orange
  secondaryLight: '#FFFFE0', // Light Yellow

  // Background Colors
  background: '#0F0F23',     // Very Dark Blue
  backgroundLight: '#1A1A2E', // Dark Blue
  surface: '#16213E',        // Dark Blue Grey
  surfaceLight: '#2C3E50',   // Blue Grey

  // Text Colors
  text: '#FFFFFF',           // White
  textSecondary: '#B0B0B0',  // Light Grey
  textMuted: '#808080',      // Grey
  textOnPrimary: '#FFFFFF',  // White

  // Accent Colors
  accent: '#FF6B6B',         // Coral Red
  accentGreen: '#4ECDC4',    // Teal
  accentPurple: '#A86BD1',   // Purple
  accentOrange: '#FFB347',   // Peach

  // Element Colors
  fire: '#FF4757',           // Red
  earth: '#2F8B2F',          // Forest Green
  air: '#3742FA',            // Blue
  water: '#1E90FF',          // Dodger Blue

  // Status Colors
  success: '#00C851',        // Green
  warning: '#FFB300',        // Amber
  error: '#FF4444',          // Red
  info: '#33B5E5',           // Light Blue

  // Border and Divider
  border: '#2C2C2E',         // Dark Grey
  borderLight: '#3A3A3C',    // Light Dark Grey
  divider: '#484848',        // Medium Grey

  // Overlay and Shadow
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.3)',

  // Gradient Colors
  gradientStart: '#6A5ACD',
  gradientEnd: '#483D8B',
  gradientGold: ['#FFD700', '#FFA500'],
  gradientPurple: ['#9370DB', '#6A5ACD', '#483D8B'],
  gradientCosmic: ['#0F0F23', '#1A1A2E', '#16213E'],

  // Premium/Subscription Colors
  premium: '#FFD700',        // Gold
  premiumDark: '#B8860B',    // Dark Golden Rod
  subscription: '#FF6B6B',   // Coral

  // Light theme variants (for automatic theme switching)
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
  }
};

export const ElementColors = {
  Fire: Colors.fire,
  Earth: Colors.earth,
  Air: Colors.air,
  Water: Colors.water,
};

export const ZodiacColors = {
  Aries: Colors.fire,
  Taurus: Colors.earth,
  Gemini: Colors.air,
  Cancer: Colors.water,
  Leo: Colors.fire,
  Virgo: Colors.earth,
  Libra: Colors.air,
  Scorpio: Colors.water,
  Sagittarius: Colors.fire,
  Capricorn: Colors.earth,
  Aquarius: Colors.air,
  Pisces: Colors.water,
};