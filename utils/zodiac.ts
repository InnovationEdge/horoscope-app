import { ZodiacSign, getSignByDate } from '@/constants/signs';

export function getZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  return getSignByDate(month, day);
}

// Alias for compatibility
export const calculateZodiacSign = getZodiacSign;

// Druid tree sign calculation
export function getDruidSign(birthDate: Date): string {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // Simplified Druid calendar (21 trees based on Celtic calendar)
  if ((month === 12 && day >= 24) || (month === 1 && day <= 20)) return 'birch';
  if ((month === 1 && day >= 21) || (month === 2 && day <= 17)) return 'rowan';
  if ((month === 2 && day >= 18) || (month === 3 && day <= 17)) return 'ash';
  if ((month === 3 && day >= 18) || (month === 4 && day <= 14)) return 'alder';
  if ((month === 4 && day >= 15) || (month === 5 && day <= 12)) return 'willow';
  if ((month === 5 && day >= 13) || (month === 6 && day <= 9)) return 'hawthorn';
  if ((month === 6 && day >= 10) || (month === 7 && day <= 7)) return 'oak';
  if ((month === 7 && day >= 8) || (month === 8 && day <= 4)) return 'holly';
  if ((month === 8 && day >= 5) || (month === 9 && day <= 1)) return 'hazel';
  if ((month === 9 && day >= 2) || (month === 9 && day <= 29)) return 'vine';
  if ((month === 9 && day >= 30) || (month === 10 && day <= 27)) return 'ivy';
  if ((month === 10 && day >= 28) || (month === 11 && day <= 24)) return 'reed';
  return 'elder'; // Nov 25 - Dec 23
}

// Chinese zodiac animal calculation
export function getChineseAnimal(birthYear: number): string {
  const animals = [
    'rat',
    'ox',
    'tiger',
    'rabbit',
    'dragon',
    'snake',
    'horse',
    'goat',
    'monkey',
    'rooster',
    'dog',
    'pig',
  ];
  // Chinese zodiac starts from 1900 = Rat (index 0)
  const index = (birthYear - 1900) % 12;
  const adjustedIndex = index < 0 ? index + 12 : index;
  return animals[adjustedIndex] || 'rat';
}

// Convert score (0-100) to stars (0-5)
export function scoreToStars(score: number): number {
  return Math.round(Math.max(0, Math.min(100, score)) / 20);
}
