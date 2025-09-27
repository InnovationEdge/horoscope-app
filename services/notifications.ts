import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from './analytics';
import { ZodiacSign } from '../types/horoscope';

const NOTIFICATION_SETTINGS_KEY = 'notification_settings_v1';
const PUSH_TOKEN_KEY = 'push_token_v1';

export interface NotificationSettings {
  daily_horoscope: boolean;
  weekly_summary: boolean;
  monthly_forecast: boolean;
  compatibility_tips: boolean;
  premium_offers: boolean;
  time: string; // HH:MM format
  timezone: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  daily_horoscope: true,
  weekly_summary: true,
  monthly_forecast: true,
  compatibility_tips: false,
  premium_offers: false,
  time: '09:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private settings: NotificationSettings = DEFAULT_SETTINGS;
  private pushToken: string | null = null;
  private initialized = false;

  // Initialize the notification service
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load saved settings
      await this.loadSettings();

      // Request permissions and get push token
      await this.requestPermissions();
      await this.registerForPushNotifications();

      // Schedule default notifications if enabled
      if (this.settings.daily_horoscope) {
        await this.scheduleDailyHoroscope();
      }

      this.initialized = true;

      track('notifications_initialized', {
        has_permission: !!this.pushToken,
        daily_enabled: this.settings.daily_horoscope,
        weekly_enabled: this.settings.weekly_summary,
      });
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      track('notifications_init_failed', { error: String(error) });
    }
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('Push notifications require a physical device');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        track('notification_permission_denied');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-horoscope', {
          name: 'Daily Horoscope',
          description: 'Your daily astrological insights',
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('weekly-summary', {
          name: 'Weekly Summary',
          description: 'Your weekly astrological forecast',
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: 'default',
        });
      }

      track('notification_permission_granted');
      return true;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      track('notification_permission_error', { error: String(error) });
      return false;
    }
  }

  // Register for push notifications and get token
  async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) return null;

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.pushToken = token;

      // Save token locally
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

      track('push_token_generated', { token_length: token.length });
      return token;
    } catch (error) {
      console.error('Failed to get push token:', error);
      track('push_token_error', { error: String(error) });
      return null;
    }
  }

  // Schedule daily horoscope notification
  async scheduleDailyHoroscope(userSign?: ZodiacSign): Promise<void> {
    try {
      // Cancel existing daily notifications
      await this.cancelNotification('daily-horoscope');

      if (!this.settings.daily_horoscope) return;

      const [hour, minute] = this.settings.time.split(':').map(Number);

      const trigger = {
        hour,
        minute,
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily-horoscope',
        content: {
          title: '🌟 Your Daily Horoscope',
          body: userSign
            ? `Discover what the stars have in store for you today, ${userSign}!`
            : 'Discover what the stars have in store for you today!',
          data: {
            type: 'daily_horoscope',
            sign: userSign,
          },
          sound: 'default',
          categoryIdentifier: 'daily-horoscope',
        },
        trigger,
      });

      track('daily_horoscope_scheduled', {
        time: this.settings.time,
        sign: userSign,
      });
    } catch (error) {
      console.error('Failed to schedule daily horoscope:', error);
      track('daily_horoscope_schedule_error', { error: String(error) });
    }
  }

  // Update notification settings
  async updateSettings(newSettings: Partial<NotificationSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await this.saveSettings();

      // Reschedule notifications based on new settings
      if (newSettings.daily_horoscope !== undefined) {
        await this.scheduleDailyHoroscope();
      }

      track('notification_settings_updated', newSettings);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      track('notification_settings_error', { error: String(error) });
    }
  }

  // Get current settings
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Get push token
  getPushToken(): string | null {
    return this.pushToken;
  }

  // Cancel a specific notification
  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      track('notification_cancelled', { identifier });
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  // Load settings from storage
  private async loadSettings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = { ...DEFAULT_SETTINGS, ...parsed };
      }

      const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (token) {
        this.pushToken = token;
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      this.settings = DEFAULT_SETTINGS;
    }
  }

  // Save settings to storage
  private async saveSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Helper functions for easy access
export const initializeNotifications = () => notificationService.initialize();
export const scheduleDailyHoroscope = (sign?: ZodiacSign) => notificationService.scheduleDailyHoroscope(sign);
export const updateNotificationSettings = (settings: Partial<NotificationSettings>) =>
  notificationService.updateSettings(settings);
export const getNotificationSettings = () => notificationService.getSettings();
