import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { authService } from '../services/auth';
import { useUserStore } from '../store/user';
import { Colors } from '../constants/theme';
import type { ZodiacSign } from '../constants/signs';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUserStore();

  const checkAuthStatus = useCallback(async () => {
    try {
      await authService.init();

      if (authService.isAuthenticated && authService.user) {
        const authUser = authService.user;
        const userForStore = {
          ...authUser,
          sign: (authUser.sign || 'aries') as ZodiacSign,
          subscription_status: authUser.is_premium ? ('premium' as const) : ('free' as const),
        };

        setUser(userForStore);
        router.replace('/(tabs)/today');
      } else {
        // Navigate to login
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Navigate to login on error
      router.replace('/auth/login');
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  // This should not be reached as router.replace should redirect
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
