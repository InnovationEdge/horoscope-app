import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UpdateUserRequest } from '../types/api';
import { ZodiacSign } from '../constants/signs';
import { apiRequest } from '../services/api';
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
      setUser: user => {
        set({
          user,
          isAuthenticated: user !== null,
        });

        // Update API client auth token (would integrate with API service)
      },

      updateUser: async updates => {
        const { user } = get();
        if (!user) {
          console.log('updateUser: No user found in store');
          return;
        }

        console.log('updateUser: Current user:', user);
        console.log('updateUser: Updates to apply:', updates);

        set({ isLoading: true });

        try {
          const updatedUser = (await apiRequest('/users/me', {
            method: 'PUT',
            body: JSON.stringify({ ...user, ...updates }),
          })) as User;

          console.log('updateUser: Updated user from API:', updatedUser);

          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          console.error('updateUser: Error updating user:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        // Clear auth token (would integrate with API service)
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
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
