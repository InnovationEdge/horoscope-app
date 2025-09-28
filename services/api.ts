// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, User, SubscriptionStatus } from '../types/api';
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
  user: User;
  token: string;
  refresh_token: string;
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
  private users: User[] = [];

  constructor() {
    // Reset users on app start for development
    this.users = [];
  }

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

  findUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email?.toLowerCase() === email.toLowerCase());
  }

  async createUser(data: RegisterData): Promise<User> {
    const existingUser = this.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const zodiacSign = data.birth_date ? getZodiacSign(new Date(data.birth_date)) : 'aries';

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      email: data.email.toLowerCase(),
      name: data.name,
      birth_date: data.birth_date,
      birth_time: data.birth_time,
      birth_place: data.birth_place,
      sign: zodiacSign,
      subscription_status: 'free' as SubscriptionStatus,
      onboarded: false,
    };

    this.users.push(newUser);
    await this.saveUsers();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const currentUser = this.users[userIndex];
    if (!currentUser) {
      throw new Error('User not found');
    }
    const updatedUser: User = {
      ...currentUser,
      ...updates,
      id: currentUser.id
    };
    this.users[userIndex] = updatedUser;
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

    // User login completed

    return {
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
      refresh_token: `mock_refresh_${user.id}_${Date.now()}`,
    };
  },

  '/auth/register': async (body: RegisterData): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const user = await mockDB.createUser(body);

    return {
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
      refresh_token: `mock_refresh_${user.id}_${Date.now()}`,
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

  // Pricing endpoints
  '/payments/products/': async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      region: 'US',
      currency: 'USD',
      symbol: '$',
      weekly_display: '$2.99',
      monthly_display: '$9.99',
      yearly_display: '$59.99',
      plans: [
        {
          id: 'weekly',
          name: 'Weekly',
          price: 2.99,
          price_minor: 299,
          currency: 'USD',
          period: 'week',
          display_price: '$2.99',
          features: ['7-day access', 'All premium features'],
        },
        {
          id: 'monthly',
          name: 'Monthly',
          price: 9.99,
          price_minor: 999,
          currency: 'USD',
          period: 'month',
          display_price: '$9.99',
          popular: true,
          features: ['30-day access', 'All premium features', 'Most popular'],
        },
        {
          id: 'yearly',
          name: 'Yearly',
          price: 59.99,
          price_minor: 5999,
          currency: 'USD',
          period: 'year',
          display_price: '$59.99',
          savings: 'Save 50%',
          features: ['365-day access', 'All premium features', 'Best value'],
        },
      ],
    };
  },

  '/payments/create-session/': async (body: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      session_id: `mock_session_${Date.now()}`,
      checkout_url: 'https://mock-payment.com/checkout',
      success: true,
    };
  },

  '/payments/verify-purchase/': async (body: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      success: true,
      subscription: {
        id: 'mock_subscription',
        status: 'active',
        plan: 'monthly',
      },
    };
  },

  '/payments/restore-purchases/': async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      restored: true,
      subscriptions: [],
    };
  },

  // User endpoints
  '/users/me': async (body: any): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // For GET requests, return current user
    if (!body || Object.keys(body).length === 0) {
      // Mock returning a default user - in real app this would come from auth token
      return {
        id: 'mock_user_id',
        email: 'demo@example.com',
        name: 'Demo User',
        sign: 'leo',
        subscription_status: 'free',
        onboarded: true,
      };
    }

    // For PUT requests, update and return user
    const updatedUser: User = {
      id: body.id || 'mock_user_id',
      email: body.email || 'demo@example.com',
      name: body.name,
      birth_date: body.birth_date,
      birth_time: body.birth_time,
      birth_place: body.birth_place,
      sign: body.sign || 'leo',
      subscription_status: body.subscription_status || 'free',
      onboarded: body.onboarded !== undefined ? body.onboarded : true,
    };

    return updatedUser;
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
