export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export const ZODIAC_SIGNS: Record<
  ZodiacSign,
  {
    emoji: string;
    symbol: string;
    name: string;
    dateRange: string;
    element: string;
    rulingPlanet: string;
    accent: string;
    description: string;
  }
> = {
  aries: {
    emoji: '🐏',
    symbol: '♈',
    name: 'Aries',
    dateRange: 'Mar 21 – Apr 19',
    element: 'Fire',
    rulingPlanet: 'Mars',
    accent: '#E91E63',
    description: 'The Ram - Bold, ambitious, and energetic pioneer',
  },
  taurus: {
    emoji: '🐂',
    symbol: '♉',
    name: 'Taurus',
    dateRange: 'Apr 20 – May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    accent: '#4CAF50',
    description: 'The Bull - Reliable, patient, and practical builder',
  },
  gemini: {
    emoji: '👯‍♂️',
    symbol: '♊',
    name: 'Gemini',
    dateRange: 'May 21 – Jun 20',
    element: 'Air',
    rulingPlanet: 'Mercury',
    accent: '#00BCD4',
    description: 'The Twins - Curious, adaptable, and communicative',
  },
  cancer: {
    emoji: '🦀',
    symbol: '♋',
    name: 'Cancer',
    dateRange: 'Jun 21 – Jul 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    accent: '#2196F3',
    description: 'The Crab - Intuitive, protective, and nurturing',
  },
  leo: {
    emoji: '🦁',
    symbol: '♌',
    name: 'Leo',
    dateRange: 'Jul 23 – Aug 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    accent: '#FF9800',
    description: 'The Lion - Confident, generous, and natural-born leader',
  },
  virgo: {
    emoji: '👑',
    symbol: '♍',
    name: 'Virgo',
    dateRange: 'Aug 23 – Sep 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    accent: '#8BC34A',
    description: 'The Maiden - Analytical, helpful, and detail-oriented',
  },
  libra: {
    emoji: '⚖️',
    symbol: '♎',
    name: 'Libra',
    dateRange: 'Sep 23 – Oct 22',
    element: 'Air',
    rulingPlanet: 'Venus',
    accent: '#9C27B0',
    description: 'The Scales - Diplomatic, fair-minded, and social',
  },
  scorpio: {
    emoji: '🦂',
    symbol: '♏',
    name: 'Scorpio',
    dateRange: 'Oct 23 – Nov 21',
    element: 'Water',
    rulingPlanet: 'Mars',
    accent: '#673AB7',
    description: 'The Scorpion - Passionate, brave, and mysterious',
  },
  sagittarius: {
    emoji: '🏹',
    symbol: '♐',
    name: 'Sagittarius',
    dateRange: 'Nov 22 – Dec 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    accent: '#FF5722',
    description: 'The Archer - Adventurous, philosophical, and optimistic',
  },
  capricorn: {
    emoji: '🐐',
    symbol: '♑',
    name: 'Capricorn',
    dateRange: 'Dec 22 – Jan 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    accent: '#607D8B',
    description: 'The Goat - Responsible, disciplined, and self-controlled',
  },
  aquarius: {
    emoji: '🏺',
    symbol: '♒',
    name: 'Aquarius',
    dateRange: 'Jan 20 – Feb 18',
    element: 'Air',
    rulingPlanet: 'Uranus',
    accent: '#03A9F4',
    description: 'The Water Bearer - Progressive, original, and independent',
  },
  pisces: {
    emoji: '🐟',
    symbol: '♓',
    name: 'Pisces',
    dateRange: 'Feb 19 – Mar 20',
    element: 'Water',
    rulingPlanet: 'Neptune',
    accent: '#3F51B5',
    description: 'The Fish - Artistic, intuitive, and gentle',
  },
} as const;

export const SIGN_ORDER: ZodiacSign[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

// Helper function to get sign by name
export const getSignByName = (name: string): ZodiacSign | null => {
  const sign = SIGN_ORDER.find(s => ZODIAC_SIGNS[s].name.toLowerCase() === name.toLowerCase());
  return sign || null;
};

// Helper function to get sign by date
export const getSignByDate = (month: number, day: number): ZodiacSign => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces'; // Feb 19 - Mar 20
};
