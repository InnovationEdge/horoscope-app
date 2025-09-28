import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat } from 'react-native-reanimated';
import { router } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ProgressBarTop } from '../../components/ProgressBarTop';
import { track } from '../../services/analytics';
import { authService } from '../../services/auth';
import { useUserStore } from '../../store/user';
import type { ZodiacSign } from '../../constants/signs';

export default function SignIn() {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  // Authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser } = useUserStore();

  useEffect(() => {
    track('onboarding_step_viewed', { step: 'signin' });

    // Simple entrance animations
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withTiming(0, { duration: 500 });
  }, [fadeAnim, slideAnim]);

  const handleGoogleAuth = async () => {
    track('auth_initiated', { provider: 'google' });
    try {
      // Create demo user for Google auth
      const demoUser = {
        id: 'google_' + Date.now(),
        email: 'demo@google.com',
        name: 'Google User',
        sign: 'leo' as ZodiacSign,
        subscription_status: 'free' as const,
        onboarded: false,
        birth_date: '1990-08-15',
        birth_time: '12:00',
      };
      setUser(demoUser);
      track('auth_completed', { provider: 'google' });
      router.push('/onboarding/birth-date');
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleAppleAuth = async () => {
    track('auth_initiated', { provider: 'apple' });
    try {
      // Create demo user for Apple auth
      const demoUser = {
        id: 'apple_' + Date.now(),
        email: 'demo@apple.com',
        name: 'Apple User',
        sign: 'scorpio' as ZodiacSign,
        subscription_status: 'free' as const,
        onboarded: false,
        birth_date: '1985-11-10',
        birth_time: '14:30',
      };
      setUser(demoUser);
      track('auth_completed', { provider: 'apple' });
      router.push('/onboarding/birth-date');
    } catch (error) {
      console.error('Apple auth error:', error);
    }
  };

  const handleContinueAsGuest = () => {
    track('auth_completed', { provider: 'guest' });
    // Create a demo guest user with sample data
    const guestUser = {
      id: 'guest_' + Date.now(),
      email: 'guest@example.com',
      name: 'Guest User',
      sign: 'virgo' as ZodiacSign,
      subscription_status: 'free' as const,
      onboarded: false,
      birth_date: '1992-09-15',
      birth_time: '10:30',
    };
    setUser(guestUser);
    router.push('/onboarding/birth-date');
  };

  const handleClassicalAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      track('auth_initiated', { provider: 'email' });

      // Try login first, if it fails, automatically register
      try {
        const response = await authService.login({ email, password });
        setUser(response.user);

        track('auth_completed', { provider: 'email', action: 'login' });

        // Check if user has completed onboarding
        if (response.user.onboarded) {
          router.replace('/(tabs)/today');
        } else {
          router.push('/onboarding/birth-date');
        }
      } catch (loginError) {
        // If login fails, try to register
        try {
          const response = await authService.register({
            email,
            password,
            name: email.split('@')[0] || 'User',
          });
          setUser(response.user);

          track('auth_completed', { provider: 'email', action: 'register' });
          router.push('/onboarding/birth-date');
        } catch (registerError) {
          throw registerError;
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      track('auth_failed', { provider: 'email', error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));


  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ProgressBarTop currentStep={1} totalSteps={5} />

        {/* Salamene Splash Background */}
        <View style={styles.backgroundContainer}>
          <ImageBackground
            source={require('../../assets/onboarding/salamene-splash.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            {/* Dark overlay for content readability */}
            <LinearGradient
              colors={['rgba(13, 11, 26, 0.3)', 'rgba(13, 11, 26, 0.8)']}
              style={styles.overlay}
            >
              <Animated.View style={[styles.content, contentAnimatedStyle]}>
                {/* Brand Title */}
                <View style={styles.brandContainer}>
                  <Text style={styles.brandTitle}>Salamene</Text>
                  <Text style={styles.brandSubtitle}>
                    Discover your horoscope journey
                  </Text>
                </View>

                {/* Authentication Methods */}
                <View style={styles.authContainer}>
                  {/* Email/Password Authentication */}
                  <View style={styles.classicalAuthContainer}>

                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      editable={!isLoading}
                    />

                    {error ? (
                      <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    <Pressable
                      style={[styles.primaryAuthButton, isLoading && styles.primaryAuthButtonDisabled]}
                      onPress={handleClassicalAuth}
                      disabled={isLoading}
                      accessibilityLabel="Continue with Email"
                      accessibilityRole="button"
                    >
                      <Text style={styles.primaryAuthButtonText}>
                        {isLoading ? 'Please wait...' : 'Continue with Email'}
                      </Text>
                    </Pressable>
                  </View>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Social Authentication - Secondary */}
                  <View style={styles.socialAuthContainer}>
                    <Pressable
                      style={styles.socialButton}
                      onPress={handleGoogleAuth}
                      accessibilityLabel="Continue with Google"
                      accessibilityRole="button"
                    >
                      <AntDesign name="google" size={24} color="#4285F4" />
                    </Pressable>

                    <Pressable
                      style={styles.socialButton}
                      onPress={handleAppleAuth}
                      accessibilityLabel="Continue with Apple"
                      accessibilityRole="button"
                    >
                      <MaterialIcons name="apple" size={24} color="#000000" />
                    </Pressable>
                  </View>

                  {/* Guest Option */}
                  <Pressable
                    style={styles.guestButton}
                    onPress={handleContinueAsGuest}
                    accessibilityLabel="Continue as Guest"
                    accessibilityRole="button"
                  >
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                  </Pressable>
                </View>

                {/* Progress Dots */}
                <View style={styles.dotsContainer}>
                  <View style={[styles.dot, styles.activeDot]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                  By continuing, you agree to our Terms & Privacy Policy
                </Text>
              </Animated.View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 80, // Account for progress bar
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  brandTitle: {
    ...Typography.displayLarge,
    color: Colors.textPri,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
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
  authContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  classicalAuthContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  authToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Layout.buttonRadius,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.buttonRadius - 4,
  },
  activeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  toggleText: {
    ...Typography.titleMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  activeToggleText: {
    color: Colors.textPri,
  },
  input: {
    height: 56,
    borderRadius: Layout.buttonRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.lg,
    ...Typography.bodyMedium,
    color: Colors.textPri,
    fontSize: 16,
  },
  primaryAuthButton: {
    height: 56,
    borderRadius: Layout.buttonRadius,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryAuthButtonText: {
    ...Typography.titleMedium,
    color: Colors.textPri,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    ...Typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  socialAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: Layout.buttonRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  guestButton: {
    height: 56,
    borderRadius: Layout.buttonRadius,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: Spacing.sm,
  },
  guestButtonText: {
    ...Typography.titleMedium,
    color: Colors.textPri,
    fontSize: 16,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.dotSpacing,
    marginBottom: Spacing.lg,
  },
  dot: {
    width: Layout.dotSize,
    height: Layout.dotSize,
    borderRadius: Layout.dotSize / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  footerText: {
    ...Typography.labelSmall,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  primaryAuthButtonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '500',
  },
});