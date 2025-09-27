import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function Splash() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    const t = setTimeout(() => {
      router.replace('/onboarding/signin');
    }, 2500);
    return () => clearTimeout(t);
  }, [opacity]);

  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container} accessibilityLabel="Salamene Onboarding Splash">
      <StatusBar barStyle="light-content" />
      {/* Optional image if provided later */}
      <Animated.View style={[styles.hero, fade]}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>✨</Text>
        </View>
        <Text style={styles.brand}>Salamene Onboarding</Text>
        <Text style={styles.subtitle}>Astrology that actually feels premium</Text>
      </Animated.View>
      <Text style={styles.hint}>Preparing your stars&</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0B1A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  hero: { alignItems: 'center', justifyContent: 'center' },
  imagePlaceholder: {
    width: 220,
    height: 180,
    marginBottom: 24,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#7C4DFF',
  },
  brand: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.70)',
    fontSize: 14,
    textAlign: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 48,
    color: 'rgba(255,255,255,0.60)',
    fontSize: 12,
  },
});
