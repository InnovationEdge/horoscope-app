import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionStatus } from '../types/api';

interface SubscriptionState {
  // State
  status: SubscriptionStatus;
  expiresAt: string | null;
  isLoading: boolean;

  // Actions
  setSubscription: (status: SubscriptionStatus, expiresAt?: string) => void;
  clearSubscription: () => void;

  // Computed
  isPremium: () => boolean;
  isExpired: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      status: 'free',
      expiresAt: null,
      isLoading: false,

      // Actions
      setSubscription: (status, expiresAt) => {
        set({
          status,
          expiresAt: expiresAt || null,
        });
      },

      clearSubscription: () => {
        set({
          status: 'free',
          expiresAt: null,
        });
      },

      // Computed
      isPremium: () => {
        const { status } = get();
        return status === 'premium';
      },

      isExpired: () => {
        const { status, expiresAt } = get();
        if (status === 'free' || !expiresAt) return false;

        return new Date(expiresAt) < new Date();
      },
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);