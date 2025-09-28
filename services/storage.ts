/**
 * Comprehensive storage service for offline caching and data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ZodiacSign } from '../constants/signs';

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expires: number;
  key: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  notifications_enabled: boolean;
  daily_reminder_time: string;
  favorite_signs: ZodiacSign[];
  last_read_horoscope: string;
  premium_trial_used: boolean;
}

export interface OfflineQueue {
  id: string;
  type: 'analytics' | 'api_call' | 'user_action';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  timestamp: number;
  retries: number;
}

class StorageService {
  private readonly CACHE_PREFIX = 'salamene_cache_';
  private readonly USER_PREFS_KEY = 'salamene_user_prefs';
  private readonly OFFLINE_QUEUE_KEY = 'salamene_offline_queue';
  private readonly HOROSCOPE_CACHE_KEY = 'salamene_horoscope_cache';

  // Default cache expiration times (in milliseconds)
  private readonly CACHE_DURATIONS = {
    horoscope_daily: 24 * 60 * 60 * 1000, // 24 hours
    horoscope_weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
    horoscope_monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
    compatibility: 7 * 24 * 60 * 60 * 1000, // 7 days
    traits: 30 * 24 * 60 * 60 * 1000, // 30 days
    user_profile: 60 * 60 * 1000, // 1 hour
    pricing: 60 * 60 * 1000, // 1 hour
    analytics: 5 * 60 * 1000, // 5 minutes
  };

  /**
   * Store data in cache with automatic expiration
   */
  async setCache<T>(key: string, data: T, customDuration?: number): Promise<void> {
    try {
      const duration = customDuration || this.CACHE_DURATIONS[key as keyof typeof this.CACHE_DURATIONS] || 60 * 60 * 1000;
      const timestamp = Date.now();
      const expires = timestamp + duration;

      const cacheItem: CacheItem<T> = {
        data,
        timestamp,
        expires,
        key,
      };

      await AsyncStorage.setItem(
        this.CACHE_PREFIX + key,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error('Failed to set cache:', error);
    }
  }

  /**
   * Retrieve data from cache if not expired
   */
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_PREFIX + key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() > cacheItem.expires) {
        await this.removeCache(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Failed to get cache:', error);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  async removeCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_PREFIX + key);
    } catch (error) {
      console.error('Failed to remove cache:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  async clearCache(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache size in bytes
   */
  async getCacheSize(): Promise<number> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));

      let totalSize = 0;
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return 0;
    }
  }

  /**
   * Store user preferences
   */
  async setUserPreferences(prefs: Partial<UserPreferences>): Promise<void> {
    try {
      const currentPrefs = await this.getUserPreferences();
      const updatedPrefs = { ...currentPrefs, ...prefs };

      await AsyncStorage.setItem(
        this.USER_PREFS_KEY,
        JSON.stringify(updatedPrefs)
      );
    } catch (error) {
      console.error('Failed to set user preferences:', error);
    }
  }

  /**
   * Get user preferences with defaults
   */
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const prefs = await AsyncStorage.getItem(this.USER_PREFS_KEY);

      const defaultPrefs: UserPreferences = {
        theme: 'dark',
        notifications_enabled: true,
        daily_reminder_time: '09:00',
        favorite_signs: [],
        last_read_horoscope: '',
        premium_trial_used: false,
      };

      if (!prefs) {
        await this.setUserPreferences(defaultPrefs);
        return defaultPrefs;
      }

      return { ...defaultPrefs, ...JSON.parse(prefs) };
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return {
        theme: 'dark',
        notifications_enabled: true,
        daily_reminder_time: '09:00',
        favorite_signs: [],
        last_read_horoscope: '',
        premium_trial_used: false,
      };
    }
  }

  /**
   * Store horoscope data with intelligent caching
   */
  async storeHoroscope(sign: ZodiacSign, timeframe: 'daily' | 'weekly' | 'monthly', data: any): Promise<void> {
    const key = `horoscope_${timeframe}_${sign}`;
    const duration = this.CACHE_DURATIONS[`horoscope_${timeframe}` as keyof typeof this.CACHE_DURATIONS];
    await this.setCache(key, data, duration);
  }

  /**
   * Get cached horoscope data
   */
  async getHoroscope(sign: ZodiacSign, timeframe: 'daily' | 'weekly' | 'monthly'): Promise<any> {
    const key = `horoscope_${timeframe}_${sign}`;
    return await this.getCache(key);
  }

  /**
   * Add item to offline queue for later sync
   */
  async addToOfflineQueue(item: Omit<OfflineQueue, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    try {
      const queue = await this.getOfflineQueue();

      const queueItem: OfflineQueue = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        retries: 0,
      };

      queue.push(queueItem);
      await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to add to offline queue:', error);
    }
  }

  /**
   * Get offline queue items
   */
  async getOfflineQueue(): Promise<OfflineQueue[]> {
    try {
      const queue = await AsyncStorage.getItem(this.OFFLINE_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Failed to get offline queue:', error);
      return [];
    }
  }

  /**
   * Remove item from offline queue
   */
  async removeFromOfflineQueue(itemId: string): Promise<void> {
    try {
      const queue = await this.getOfflineQueue();
      const filteredQueue = queue.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('Failed to remove from offline queue:', error);
    }
  }

  /**
   * Process offline queue when online
   */
  async processOfflineQueue(): Promise<void> {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) return;

      const queue = await this.getOfflineQueue();
      if (queue.length === 0) return;

      console.log(`Processing ${queue.length} offline queue items`);

      for (const item of queue) {
        try {
          // Here you would implement the actual API calls
          // For now, we'll just simulate processing
          await new Promise(resolve => setTimeout(resolve, 100));

          await this.removeFromOfflineQueue(item.id);
          console.log(`Processed offline item: ${item.type}`);
        } catch (error) {
          // Increment retry count
          item.retries += 1;

          // Remove item if too many retries
          if (item.retries >= 3) {
            await this.removeFromOfflineQueue(item.id);
            console.warn(`Removed offline item after max retries: ${item.type}`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to process offline queue:', error);
    }
  }

  /**
   * Clear all user data (for logout)
   */
  async clearUserData(): Promise<void> {
    try {
      const keysToKeep = [this.USER_PREFS_KEY]; // Keep preferences
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToRemove = allKeys.filter(key =>
        key.startsWith('salamene_') && !keysToKeep.includes(key)
      );

      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    cacheSize: number;
    queueSize: number;
    totalItems: number;
  }> {
    try {
      const cacheSize = await this.getCacheSize();
      const queue = await this.getOfflineQueue();
      const allKeys = await AsyncStorage.getAllKeys();
      const salameneKeys = allKeys.filter(key => key.startsWith('salamene_'));

      return {
        cacheSize,
        queueSize: queue.length,
        totalItems: salameneKeys.length,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        cacheSize: 0,
        queueSize: 0,
        totalItems: 0,
      };
    }
  }

  /**
   * Export user data (for backup/transfer)
   */
  async exportUserData(): Promise<string> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const salameneKeys = allKeys.filter(key => key.startsWith('salamene_'));

      const userData: Record<string, any> = {};
      for (const key of salameneKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          userData[key] = value;
        }
      }

      return JSON.stringify({
        version: '1.0',
        timestamp: Date.now(),
        data: userData,
      });
    } catch (error) {
      console.error('Failed to export user data:', error);
      return '';
    }
  }

  /**
   * Import user data (from backup)
   */
  async importUserData(dataString: string): Promise<boolean> {
    try {
      const importData = JSON.parse(dataString);

      if (!importData.data || typeof importData.data !== 'object') {
        throw new Error('Invalid data format');
      }

      // Clear existing data first
      await this.clearUserData();

      // Import new data
      for (const [key, value] of Object.entries(importData.data)) {
        if (typeof value === 'string') {
          await AsyncStorage.setItem(key, value);
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to import user data:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();