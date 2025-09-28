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
      // Simple fade in animation
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withTiming(1, { duration: 500 });
      textOpacity.value = withTiming(1, { duration: 300 });
      shimmerOpacity.value = withTiming(1, { duration: 300 });

      // Show splash briefly while checking auth
      const [authResult] = await Promise.all([
        authService.init(),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      if (authService.isAuthenticated && authService.user) {
        console.log('Found authenticated user:', authService.user);
        setUser(authService.user);

        // Quick fade and navigate
        opacity.value = withTiming(0, { duration: 200 });
        setTimeout(() => {
          if (authService.user?.onboarded) {
            router.replace('/(tabs)/today');
          } else {
            router.replace('/onboarding/signin');
          }
        }, 200);
      } else {
        // Quick fade and navigate
        opacity.value = withTiming(0, { duration: 200 });
        setTimeout(() => {
          router.replace('/onboarding/signin');
        }, 200);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Quick navigate on error
      router.replace('/onboarding/signin');
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
    backgroundColor: Colors.bgTop,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 300,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 77, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    textAlign: 'center',
  },
  brandTitle: {
    ...Typography.displayLarge,
    color: Colors.textPri,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingSection: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
