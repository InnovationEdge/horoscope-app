import { ZodiacSign } from '../types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 1,
    name: 'Aries',
    symbol: '♈',
    emoji: '🐏',
    element: 'Fire',
    dates: 'March 21 - April 19',
    ruling_planet: 'Mars',
    lucky_numbers: [1, 8, 17],
    lucky_colors: ['Red', 'Orange', 'Yellow']
  },
  {
    id: 2,
    name: 'Taurus',
    symbol: '♉',
    emoji: '🐂',
    element: 'Earth',
    dates: 'April 20 - May 20',
    ruling_planet: 'Venus',
    lucky_numbers: [2, 6, 9, 12, 24],
    lucky_colors: ['Green', 'Pink', 'White']
  },
  {
    id: 3,
    name: 'Gemini',
    symbol: '♊',
    emoji: '👯',
    element: 'Air',
    dates: 'May 21 - June 20',
    ruling_planet: 'Mercury',
    lucky_numbers: [5, 7, 14, 23],
    lucky_colors: ['Yellow', 'Blue', 'Green']
  },
  {
    id: 4,
    name: 'Cancer',
    symbol: '♋',
    emoji: '🦀',
    element: 'Water',
    dates: 'June 21 - July 22',
    ruling_planet: 'Moon',
    lucky_numbers: [2, 7, 11, 16, 20, 25],
    lucky_colors: ['White', 'Silver', 'Blue']
  },
  {
    id: 5,
    name: 'Leo',
    symbol: '♌',
    emoji: '🦁',
    element: 'Fire',
    dates: 'July 23 - August 22',
    ruling_planet: 'Sun',
    lucky_numbers: [1, 3, 10, 19],
    lucky_colors: ['Gold', 'Orange', 'Red']
  },
  {
    id: 6,
    name: 'Virgo',
    symbol: '♍',
    emoji: '👩',
    element: 'Earth',
    dates: 'August 23 - September 22',
    ruling_planet: 'Mercury',
    lucky_numbers: [3, 6, 7, 12, 20, 21, 34, 55],
    lucky_colors: ['Green', 'Brown', 'Navy Blue']
  },
  {
    id: 7,
    name: 'Libra',
    symbol: '♎',
    emoji: '⚖️',
    element: 'Air',
    dates: 'September 23 - October 22',
    ruling_planet: 'Venus',
    lucky_numbers: [4, 6, 13, 15, 24],
    lucky_colors: ['Blue', 'Green', 'Pink']
  },
  {
    id: 8,
    name: 'Scorpio',
    symbol: '♏',
    emoji: '🦂',
    element: 'Water',
    dates: 'October 23 - November 21',
    ruling_planet: 'Mars & Pluto',
    lucky_numbers: [8, 11, 18, 22],
    lucky_colors: ['Red', 'Black', 'Maroon']
  },
  {
    id: 9,
    name: 'Sagittarius',
    symbol: '♐',
    emoji: '🏹',
    element: 'Fire',
    dates: 'November 22 - December 21',
    ruling_planet: 'Jupiter',
    lucky_numbers: [3, 9, 22, 21],
    lucky_colors: ['Purple', 'Turquoise', 'Orange']
  },
  {
    id: 10,
    name: 'Capricorn',
    symbol: '♑',
    emoji: '🐐',
    element: 'Earth',
    dates: 'December 22 - January 19',
    ruling_planet: 'Saturn',
    lucky_numbers: [6, 9, 8, 26],
    lucky_colors: ['Brown', 'Black', 'Dark Green']
  },
  {
    id: 11,
    name: 'Aquarius',
    symbol: '♒',
    emoji: '🏺',
    element: 'Air',
    dates: 'January 20 - February 18',
    ruling_planet: 'Uranus & Saturn',
    lucky_numbers: [4, 7, 11, 22, 29],
    lucky_colors: ['Blue', 'Silver', 'Aqua']
  },
  {
    id: 12,
    name: 'Pisces',
    symbol: '♓',
    emoji: '🐟',
    element: 'Water',
    dates: 'February 19 - March 20',
    ruling_planet: 'Neptune & Jupiter',
    lucky_numbers: [3, 9, 12, 15, 18, 24],
    lucky_colors: ['Sea Green', 'Purple', 'Violet']
  }
];

export const ELEMENTS = {
  Fire: ['Aries', 'Leo', 'Sagittarius'],
  Earth: ['Taurus', 'Virgo', 'Capricorn'],
  Air: ['Gemini', 'Libra', 'Aquarius'],
  Water: ['Cancer', 'Scorpio', 'Pisces']
};

export const getZodiacByName = (name: string): ZodiacSign | undefined => {
  return ZODIAC_SIGNS.find(sign => sign.name.toLowerCase() === name.toLowerCase());
};

export const getZodiacByDate = (month: number, day: number): ZodiacSign | undefined => {
  const dateRanges = [
    { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
  ];

  for (const range of dateRanges) {
    const [startMonth, startDay] = range.start;
    const [endMonth, endDay] = range.end;

    if (startMonth === endMonth) {
      if (month === startMonth && startDay !== undefined && endDay !== undefined && day >= startDay && day <= endDay) {
        return getZodiacByName(range.sign);
      }
    } else {
      if (startDay !== undefined && endDay !== undefined &&
          ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay))) {
        return getZodiacByName(range.sign);
      }
    }
  }

  return undefined;
};