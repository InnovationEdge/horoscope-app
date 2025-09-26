export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export const ZODIAC_SIGNS: Record<ZodiacSign, {
  emoji: string;
  symbol: string;
  name: string;
  dateRange: string;
  element: string;
  rulingPlanet: string;
  accent: string;
}> = {
  aries: {
    emoji: '🐏',
    symbol: '♈',
    name: 'Aries',
    dateRange: 'Mar 21 - Apr 19',
    element: 'Fire',
    rulingPlanet: 'Mars',
    accent: '#FF6B6B',
  },
  taurus: {
    emoji: '🐂',
    symbol: '♉',
    name: 'Taurus',
    dateRange: 'Apr 20 - May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    accent: '#2ECC71',
  },
  gemini: {
    emoji: '👯',
    symbol: '♊',
    name: 'Gemini',
    dateRange: 'May 21 - Jun 20',
    element: 'Air',
    rulingPlanet: 'Mercury',
    accent: '#F1C40F',
  },
  cancer: {
    emoji: '🦀',
    symbol: '♋',
    name: 'Cancer',
    dateRange: 'Jun 21 - Jul 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    accent: '#3498DB',
  },
  leo: {
    emoji: '🦁',
    symbol: '♌',
    name: 'Leo',
    dateRange: 'Jul 23 - Aug 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    accent: '#F39C12',
  },
  virgo: {
    emoji: '🌾',
    symbol: '♍',
    name: 'Virgo',
    dateRange: 'Aug 23 - Sep 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    accent: '#27AE60',
  },
  libra: {
    emoji: '⚖️',
    symbol: '♎',
    name: 'Libra',
    dateRange: 'Sep 23 - Oct 22',
    element: 'Air',
    rulingPlanet: 'Venus',
    accent: '#9B59B6',
  },
  scorpio: {
    emoji: '🦂',
    symbol: '♏',
    name: 'Scorpio',
    dateRange: 'Oct 23 - Nov 21',
    element: 'Water',
    rulingPlanet: 'Mars',
    accent: '#E74C3C',
  },
  sagittarius: {
    emoji: '🏹',
    symbol: '♐',
    name: 'Sagittarius',
    dateRange: 'Nov 22 - Dec 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    accent: '#E67E22',
  },
  capricorn: {
    emoji: '🐐',
    symbol: '♑',
    name: 'Capricorn',
    dateRange: 'Dec 22 - Jan 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    accent: '#34495E',
  },
  aquarius: {
    emoji: '🌊',
    symbol: '♒',
    name: 'Aquarius',
    dateRange: 'Jan 20 - Feb 18',
    element: 'Air',
    rulingPlanet: 'Uranus',
    accent: '#1ABC9C',
  },
  pisces: {
    emoji: '🐟',
    symbol: '♓',
    name: 'Pisces',
    dateRange: 'Feb 19 - Mar 20',
    element: 'Water',
    rulingPlanet: 'Neptune',
    accent: '#8E44AD',
  },
} as const;

export const SIGN_ORDER: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];