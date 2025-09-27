import { ZodiacSign } from '../constants/signs';

// Re-export ZodiacSign for easier imports
export { ZodiacSign };

// Base types from API_CONTRACT.md
export type SubscriptionStatus = 'free' | 'premium';
export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type Provider = 'google' | 'apple' | 'facebook';

// User DTOs
export interface User {
  id: string;
  email?: string;
  name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  sign: ZodiacSign;
  subscription_status: SubscriptionStatus;
  subscription_expires_at?: string;
  druidSign?: string;
  chineseAnimal?: string;
  onboarded?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
}

// Auth DTOs
export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  sign?: string;
  is_premium?: boolean;
  created_at?: string;
  last_login?: string;
  onboarded?: boolean;
}

export interface SocialAuthRequest {
  provider: Provider;
  access_token: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

// Prediction DTOs
export interface PredictionDaily {
  sign: ZodiacSign;
  type: 'daily';
  period: {
    start: string;
    end: string;
  };
  preview: string;
  full: string | null;
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
  stars: {
    personal: number;
    love: number;
    career: number;
    health: number;
    fortune: number;
  };
}

export interface PredictionExtended {
  sign: ZodiacSign;
  type: Timeframe;
  period: {
    start: string;
    end: string;
  };
  preview: string;
  full: string | null;
  scores: {
    love: number;
    career: number;
    health: number;
  };
}

// Characteristics DTOs
export interface Characteristics {
  sign: ZodiacSign;
  traits: string[];
  strengths: string;
  weaknesses: string;
  lucky_color: string;
  lucky_number: string;
  element: string;
  ruling_planet: string;
}

// Compatibility DTOs
export interface Compatibility {
  signA: ZodiacSign;
  signB: ZodiacSign;
  overall: number;
  love: number;
  career: number;
  friendship: number;
  preview: string;
  full: string | null;
}

// Druid & Chinese DTOs
export interface DruidResult {
  date: string;
  druid_sign: string;
  preview: string;
  full: string | null;
}

export interface ChineseResult {
  year: number;
  animal: string;
  preview: string;
  full: string | null;
}

// Banner DTOs
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  premium_required: boolean;
  cta: {
    label: string;
    action: string;
    target?: string;
  };
}

// Payment DTOs
export interface PaymentSessionRequest {
  plan: 'weekly' | 'monthly' | 'yearly';
  provider: 'flitt' | 'app_store' | 'play_store';
  currency: string;
  return_url: string;
}

export interface PaymentSessionResponse {
  session_id: string;
  checkout_url: string;
}

// Error DTOs
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string | number | boolean>;
  };
}
