import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';
import { router } from 'expo-router';

export default function PaywallScreen() {
  const handleUpgrade = () => {
    // Handle premium upgrade
    console.log('Premium upgrade');
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={[Colors.bg.top, Colors.bg.bottom]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Unlock Premium ✨</Text>
            <Text style={styles.subtitle}>
              Get full horoscope readings, detailed compatibility reports, and exclusive insights.
            </Text>

            <View style={styles.features}>
              <Text style={styles.feature}>• Full horoscope readings</Text>
              <Text style={styles.feature}>• Weekly & monthly forecasts</Text>
              <Text style={styles.feature}>• Detailed compatibility reports</Text>
              <Text style={styles.feature}>• Exclusive premium insights</Text>
            </View>

            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Maybe Later</Text>
            </TouchableOpacity>
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
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.text.primary,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: Spacing.xl,
  },
  feature: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.md,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    marginBottom: Spacing.lg,
  },
  upgradeButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: Spacing.sm,
  },
  closeButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
  },
});