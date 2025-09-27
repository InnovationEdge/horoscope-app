import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ProgressBarTop } from '../../components/ProgressBarTop';
import { track } from '../../services/analytics';

export default function SignIn() {
  useEffect(() => {
    track('onboarding_step_viewed', { step: 'signin' });
  }, []);

  const handleContinueWithoutAccount = () => {
    track('auth_completed', { provider: 'guest' });
    router.push('/onboarding/birth-date');
  };

  const handleContinue = () => {
    // For now, same as guest flow - would implement actual auth here
    track('auth_completed', { provider: 'guest' });
    router.push('/onboarding/birth-date');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ProgressBarTop currentStep={1} totalSteps={5} />

        <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
          <View style={styles.content}>
            {/* Hero Image */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/onboarding/welcome.png')}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>

            {/* Progress Dots */}
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            {/* Brand and subtitle */}
            <View style={styles.textContainer}>
              <Text style={styles.brand}>Salamene Horoscope</Text>
              <Text style={styles.subtitle}>Discover your zodiac journey</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.primaryButton}
                onPress={handleContinue}
                accessibilityLabel="Continue with account"
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={handleContinueWithoutAccount}
                accessibilityLabel="Continue without account"
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
              </Pressable>
            </View>

            {/* Footer hint */}
            <Text style={styles.footerHint}>You can add Google/Apple later</Text>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60, // Account for progress bar
  },
  imageContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  heroImage: {
    width: 220,
    height: 180,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
    gap: Layout.dotSpacing,
  },
  dot: {
    width: Layout.dotSize,
    height: Layout.dotSize,
    borderRadius: Layout.dotSize / 2,
    backgroundColor: Colors.dotInactive,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl * 2,
  },
  brand: {
    ...Typography.greeting,
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    height: 48,
    borderRadius: Layout.buttonRadius,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...Typography.labelMedium,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 48,
    borderRadius: Layout.buttonRadius,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    ...Typography.labelMedium,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footerHint: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
    position: 'absolute',
    bottom: 48,
  },
});
