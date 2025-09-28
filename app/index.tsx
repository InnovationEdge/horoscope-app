import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { authService } from '../services/auth';
import { useUserStore } from '../store/user';
import { Colors, Typography, Spacing } from '../constants/theme';
import type { ZodiacSign } from '../constants/signs';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUserStore();

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const shimmerOpacity = useSharedValue(0.5);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Start splash animations
      opacity.value = withTiming(1, { duration: 800 });
      scale.value = withTiming(1, { duration: 800 });
      textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

      // Start shimmer effect
      shimmerOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 })
        ),
        -1,
        true
      );

      // Show splash for at least 2.5 seconds for branding
      const [authResult] = await Promise.all([
        authService.init(),
        new Promise(resolve => setTimeout(resolve, 2500))
      ]);

      if (authService.isAuthenticated && authService.user) {
        const authUser = authService.user;
        const userForStore = {
          ...authUser,
          sign: (authUser.sign || 'aries') as ZodiacSign,
          subscription_status: authUser.is_premium ? ('premium' as const) : ('free' as const),
        };

        setUser(userForStore);

        // Fade out animation before navigation
        opacity.value = withTiming(0, { duration: 400 });
        setTimeout(() => {
          // Check if user has completed onboarding
          if (userForStore.onboarded) {
            router.replace('/(tabs)/today');
          } else {
            router.replace('/onboarding/signin');
          }
        }, 400);
      } else {
        // Fade out animation before navigation
        opacity.value = withTiming(0, { duration: 400 });
        setTimeout(() => {
          router.replace('/onboarding/signin');
        }, 400);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Fade out animation before navigation on error
      opacity.value = withTiming(0, { duration: 400 });
      setTimeout(() => {
        router.replace('/onboarding/signin');
      }, 400);
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  }, [setUser, opacity, scale, textOpacity, shimmerOpacity]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
          <ImageBackground
            source={require('../assets/onboarding/salamene-splash.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(13, 11, 26, 0.2)', 'rgba(13, 11, 26, 0.7)']}
              style={styles.overlay}
            >
              <View style={styles.content}>
                {/* Brand Section */}
                <Animated.View style={[styles.brandContainer, textAnimatedStyle]}>
                  <Animated.View style={[styles.logoContainer, shimmerAnimatedStyle]}>
                    <Text style={styles.logoText}>✨</Text>
                  </Animated.View>
                  <Text style={styles.brandTitle}>Salamene</Text>
                  <Text style={styles.brandSubtitle}>
                    Discover your cosmic destiny
                  </Text>
                </Animated.View>

                {/* Loading indicator */}
                <Animated.View style={[styles.loadingSection, textAnimatedStyle]}>
                  <View style={styles.loadingDots}>
                    <Animated.View style={[styles.dot, shimmerAnimatedStyle]} />
                    <Animated.View style={[styles.dot, shimmerAnimatedStyle]} />
                    <Animated.View style={[styles.dot, shimmerAnimatedStyle]} />
                  </View>
                </Animated.View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>
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
