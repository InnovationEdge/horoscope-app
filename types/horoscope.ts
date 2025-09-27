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

export interface HoroscopeReading {
  preview: string;
  full: string;
  lucky: {
    number: number;
    color: string;
    mood: string;
  };
  scores: {
    love: number;
    career: number;
    health: number;
  };
}

export interface CompatibilityReading {
  overall_score: number;
  love: number;
  friendship: number;
  work: number;
  description: string;
  tips?: string[];
}

export interface HoroscopeData {
  daily: Record<ZodiacSign, HoroscopeReading>;
  weekly: Record<ZodiacSign, Partial<HoroscopeReading>>;
  monthly: Record<ZodiacSign, Partial<HoroscopeReading>>;
}

export interface CompatibilityData {
  [sign1: string]: {
    [sign2: string]: CompatibilityReading;
  };
}
