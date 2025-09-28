import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  withRepeat
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function Splash() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const shimmerOpacity = useSharedValue(0.5);

  useEffect(() => {
    // Start logo entrance animations
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });

    // Start shimmer animation matching paywall design
    shimmerOpacity.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );

    const t = setTimeout(() => {
      router.replace('/onboarding/signin');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  return (
    <View style={styles.container} accessibilityLabel="Salamene Horoscope Splash">
      <StatusBar style="light" />

      <LinearGradient
        colors={[Colors.bgTop, Colors.bgBot]}
        style={styles.gradient}
      >
        {/* Hero Logo Section - Matching Paywall Design */}
        <Animated.View style={[styles.logoContainer, shimmerStyle, logoAnimatedStyle]}>
          <Image
            source={require('../../assets/app-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Text Content - Premium Typography */}
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.heroTitle}>Salamene Horoscope</Text>
          <Text style={styles.heroSubtitle}>
            Unlock the full power of your cosmic destiny
          </Text>
        </Animated.View>

        {/* Loading Hint */}
        <Animated.Text style={[styles.loadingHint, textAnimatedStyle]}>
          Preparing your celestial insights...
        </Animated.Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgTop,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 77, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  logo: {
    width: 60,
    height: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  heroTitle: {
    ...Typography.displayLarge,
    color: Colors.textPri,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  heroSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    lineHeight: 22,
  },
  loadingHint: {
    position: 'absolute',
    bottom: 60,
    ...Typography.bodySmall,
    color: Colors.textSec,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
