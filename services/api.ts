// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '../types/api';
import { getZodiacSign } from '../utils/zodiac';

// Auth related types for the mock API
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const defaultHeaders = async () => {
  const region = 'US'; // Default to US for now, TODO: implement region detection
  return {
    'Content-Type': 'application/json',
    'X-Device-Region': region, // e.g., 'GE', 'US', 'DE'
  };
};

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Toggle between mock and real API
const USE_MOCK_API = !process.env.EXPO_PUBLIC_API_URL;

// Mock user database for development
const MOCK_USERS_KEY = 'mock_users_db';

class MockUserDatabase {
  private users: AuthUser[] = [];

  async init() {
    try {
      const stored = await AsyncStorage.getItem(MOCK_USERS_KEY);
      if (stored) {
        this.users = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load mock users:', error);
    }
  }

  async saveUsers() {
    try {
      await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(this.users));
    } catch (error) {
      console.error('Failed to save mock users:', error);
    }
  }

  findUserByEmail(email: string): AuthUser | undefined {
    return this.users.find(user => user.email?.toLowerCase() === email.toLowerCase());
  }

  async createUser(data: RegisterData): Promise<AuthUser> {
    const existingUser = this.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const zodiacSign = data.birth_date ? getZodiacSign(new Date(data.birth_date)) : undefined;

    const newUser: AuthUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email: data.email.toLowerCase(),
      name: data.name,
      birth_date: data.birth_date,
      birth_time: data.birth_time,
      birth_place: data.birth_place,
      sign: zodiacSign,
      is_premium: false,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };

    this.users.push(newUser);
    await this.saveUsers();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<AuthUser>): Promise<AuthUser> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    await this.saveUsers();
    return this.users[userIndex];
  }
}

const mockDB = new MockUserDatabase();
mockDB.init();

// Mock API endpoints
const mockEndpoints = {
  '/auth/login': async (body: LoginCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    // For debugging - create a demo user if none exists
    let user = mockDB.findUserByEmail(body.email);
    if (!user) {
      // Create a demo user for testing
      user = await mockDB.createUser({
        email: body.email,
        password: body.password,
        confirmPassword: body.password,
        name: 'Demo User',
        birth_date: '1990-01-15',
      });
    }

    // Simplified password check for mock
    if (body.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Update last login
    await mockDB.updateUser(user.id, { last_login: new Date().toISOString() });

    return {
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
    };
  },

  '/auth/register': async (body: RegisterData): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const user = await mockDB.createUser(body);

    return {
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
    };
  },

  '/auth/validate': async (): Promise<{ valid: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { valid: true };
  },

  '/auth/refresh': async (body: { refresh_token: string }): Promise<{ token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userId = body.refresh_token.split('_')[2];
    return {
      token: `mock_token_${userId}_${Date.now()}`,
    };
  },

  '/auth/forgot-password': async (body: { email: string }): Promise<{ message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = mockDB.findUserByEmail(body.email);
    if (!user) {
      throw new Error('No account found with this email address');
    }
    return { message: 'Password reset email sent' };
  },

  '/auth/logout': async (): Promise<{ message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { message: 'Logged out successfully' };
  },
};

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Use mock API if enabled
  if (USE_MOCK_API && mockEndpoints[endpoint as keyof typeof mockEndpoints]) {
    try {
      const mockHandler = mockEndpoints[endpoint as keyof typeof mockEndpoints];
      const body = options.body ? JSON.parse(options.body as string) : {};
      return await mockHandler(body);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Mock API error');
    }
  }

  // For real API endpoints
  const headers = await defaultHeaders();

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// Export apiClient for compatibility with predictions.ts
export const apiClient = {
  get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint: string, data?: any) => apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  }),
  put: (endpoint: string, data?: any) => apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' }),
};
