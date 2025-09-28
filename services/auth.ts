// Authentication service
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';
import { User, SubscriptionStatus } from '../types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
  marketing_consent?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private currentUser: User | null = null;

  // Initialize auth state from storage
  async init() {
    try {
      const [token, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

      this.token = token;
      this.refreshToken = refreshToken;
      this.currentUser = userData ? JSON.parse(userData) : null;

      // Validate token if it exists
      if (this.token && this.currentUser) {
        try {
          await this.validateToken();
        } catch (error) {
          // Token invalid, clear auth state
          await this.logout();
        }
      }
    } catch (error) {
      console.error('Auth init error:', error);
      await this.logout();
    }
  }

  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      await this.setAuthData(response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      await this.setAuthData(response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Social login (Google, Apple)
  async socialLogin(provider: 'google' | 'apple', token: string): Promise<AuthResponse> {
    try {
      const response = await apiRequest('/auth/social', {
        method: 'POST',
        body: JSON.stringify({ provider, token }),
      });

      await this.setAuthData(response);
      return response;
    } catch (error) {
      console.error('Social login error:', error);
      throw new Error(`${provider} login failed. Please try again.`);
    }
  }

  // Send password reset email
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Failed to send reset email. Please try again.');
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password: newPassword }),
      });
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Failed to reset password. Please try again.');
    }
  }

  // Change password (authenticated user)
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error('Failed to change password. Please try again.');
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiRequest('/auth/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.user) {
        this.currentUser = response.user;
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
        return response.user;
      } else {
        throw new Error('No user data in response');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token exists
      if (this.token) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }).catch(() => {
          // Ignore logout endpoint errors
        });
      }
    } finally {
      // Clear local auth state
      this.token = null;
      this.refreshToken = null;
      this.currentUser = null;

      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (response.token) {
        this.token = response.token;
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
        return response.token;
      } else {
        throw new Error('No token in refresh response');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  // Validate current token
  async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      await apiRequest('/auth/validate', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    try {
      await apiRequest('/auth/delete-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ password }),
      });

      await this.logout();
    } catch (error) {
      console.error('Account deletion error:', error);
      throw new Error('Failed to delete account. Please try again.');
    }
  }

  // Helper methods
  private async setAuthData(response: AuthResponse): Promise<void> {
    this.token = response.token;
    this.refreshToken = response.refresh_token;
    this.currentUser = response.user;

    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, this.token),
      this.refreshToken ? AsyncStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken) : AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(this.currentUser)),
    ]);
  }

  // Getters
  get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  get user(): User | null {
    return this.currentUser;
  }

  get authToken(): string | null {
    return this.token;
  }

  // Get authenticated headers for API requests
  getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();

// Initialize auth service
authService.init();

export default authService;
