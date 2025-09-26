import { ZodiacSign } from '../constants/signs';

interface ZodiacDateRange {
  sign: ZodiacSign;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

const ZODIAC_RANGES: ZodiacDateRange[] = [
  { sign: 'aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: 'taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: 'gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: 'cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: 'leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: 'virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: 'libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { sign: 'aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: 'pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

export function calculateZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1; // getMonth() returns 0-11
  const day = birthDate.getDate();

  for (const range of ZODIAC_RANGES) {
    const { sign, startMonth, startDay, endMonth, endDay } = range;

    if (startMonth === endMonth) {
      // Same month range
      if (month === startMonth && day >= startDay && day <= endDay) {
        return sign;
      }
    } else if (startMonth < endMonth) {
      // Normal range (e.g., March 21 - April 19)
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return sign;
      }
    } else {
      // Year-crossing range (e.g., December 22 - January 19)
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return sign;
      }
    }
  }

  // Fallback (should never reach here with valid date)
  return 'aries';
}

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}