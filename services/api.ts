// services/api.ts
import * as Localization from 'expo-localization';

export const defaultHeaders = async () => {
  const region = Localization.region ?? '';
  return {
    'Content-Type': 'application/json',
    'X-Device-Region': region,   // e.g., 'GE', 'US', 'DE'
  };
};

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers = await defaultHeaders();

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}