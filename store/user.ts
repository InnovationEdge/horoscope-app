import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UpdateUserRequest, ZodiacSign } from '../types/api';
import { apiClient } from '../services/api';
import { calculateZodiacSign } from '../utils/zodiac';

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: UpdateUserRequest) => Promise<void>;
  logout: () => void;

  // Computed
  getUserSign: () => ZodiacSign | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => {
        set({
          user,
          isAuthenticated: user !== null,
        });

        // Update API client auth token
        apiClient.setAuthToken(user ? 'jwt_token_here' : null);
      },

      updateUser: async (updates) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });

        try {
          const updatedUser = await apiClient.put<User>('/users/me', updates);
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        apiClient.setAuthToken(null);
      },

      // Computed
      getUserSign: () => {
        const { user } = get();
        if (!user) return null;

        // If sign is already set, return it
        if (user.sign) return user.sign;

        // If birth date is available, calculate sign
        if (user.birth_date) {
          return calculateZodiacSign(new Date(user.birth_date));
        }

        return null;
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);