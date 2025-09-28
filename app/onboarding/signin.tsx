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

export default function SignIn() {
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const vibrateScale = useSharedValue(1);

  // Classical authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    track('onboarding_step_viewed', { step: 'signin' });

    // Smooth entrance animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 300 });

    // Vibration effect for Salamene Splash - live effect
    vibrateScale.value = withRepeat(
      withTiming(1.05, { duration: 2000 }),
      -1,
      true
    );
  }, [fadeAnim, slideAnim, vibrateScale]);

  const handleGoogleAuth = async () => {
    track('auth_initiated', { provider: 'google' });
    // TODO: Implement Google authentication
    // For now, continue to next step
    track('auth_completed', { provider: 'google' });
    router.push('/onboarding/birth-date');
  };

  const handleAppleAuth = async () => {
    track('auth_initiated', { provider: 'apple' });
    // TODO: Implement Apple authentication
    // For now, continue to next step
    track('auth_completed', { provider: 'apple' });
    router.push('/onboarding/birth-date');
  };

  const handleContinueAsGuest = () => {
    track('auth_completed', { provider: 'guest' });
    router.push('/onboarding/birth-date');
  };

  const handleClassicalAuth = async () => {
    if (!email || !password) {
      return; // Simple validation
    }

    track('auth_initiated', { provider: 'email' });
    // TODO: Implement email/password authentication
    // For now, continue to next step
    track('auth_completed', { provider: 'email' });
    router.push('/onboarding/birth-date');
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: vibrateScale.value }],
  }));

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ProgressBarTop currentStep={1} totalSteps={5} />

        {/* Full Scale Salamene Splash Background with Live Vibration */}
        <Animated.View style={[styles.backgroundContainer, backgroundAnimatedStyle]}>
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
                  {/* Classical Email/Password Authentication - Primary */}
                  <View style={styles.classicalAuthContainer}>
                    <View style={styles.authToggle}>
                      <Pressable
                        style={[styles.toggleButton, isLogin && styles.activeToggle]}
                        onPress={() => setIsLogin(true)}
                      >
                        <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>Sign In</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                        onPress={() => setIsLogin(false)}
                      >
                        <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>Sign Up</Text>
                      </Pressable>
                    </View>

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
                    />

                    <Pressable
                      style={styles.primaryAuthButton}
                      onPress={handleClassicalAuth}
                      accessibilityLabel={isLogin ? "Sign In" : "Sign Up"}
                      accessibilityRole="button"
                    >
                      <Text style={styles.primaryAuthButtonText}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
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
        </Animated.View>
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
    color: Colors.text.primary,
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
    color: Colors.text.secondary,
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
    color: Colors.text.primary,
  },
  input: {
    height: 56,
    borderRadius: Layout.buttonRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.lg,
    ...Typography.bodyMedium,
    color: Colors.text.primary,
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
    color: Colors.text.primary,
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
    color: Colors.text.primary,
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
});