export interface ZodiacSign {
  id: number;
  name: string;
  symbol: string;
  emoji: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dates: string;
  ruling_planet: string;
  lucky_numbers: number[];
  lucky_colors: string[];
}

export interface DailyHoroscope {
  date: string;
  zodiac_sign: string;
  prediction: string;
  lucky_number: number;
  lucky_color: string;
  love_score: number;
  career_score: number;
  health_score: number;
  mood: string;
  compatibility_sign?: string;
}

export interface User {
  id: string;
  name?: string;
  zodiac_sign: string;
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
  premium_status: boolean;
  subscription_type?: 'weekly' | 'monthly' | 'yearly';
  notification_preferences: NotificationPreferences;
}

export interface NotificationPreferences {
  daily_horoscope: boolean;
  compatibility_updates: boolean;
  premium_content: boolean;
  time: string; // HH:MM format
}

export interface CompatibilityResult {
  sign1: string;
  sign2: string;
  overall_score: number;
  love_compatibility: number;
  friendship_compatibility: number;
  work_compatibility: number;
  description: string;
  tips: string[];
}

export interface PremiumContent {
  id: string;
  type: 'detailed_horoscope' | 'weekly_forecast' | 'monthly_forecast' | 'birth_chart' | 'compatibility_report';
  title: string;
  description: string;
  content: string;
  price?: number;
  subscription_required: boolean;
}