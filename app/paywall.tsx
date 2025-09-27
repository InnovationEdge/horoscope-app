import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Layout, Typography } from '../constants/theme';

export default function PaywallScreen() {
  const { src } = useLocalSearchParams();

  const handleUpgrade = () => {
    // Handle subscription logic here
    console.log('Upgrade triggered from:', src);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>✨ Unlock Premium</Text>
          <Text style={styles.subtitle}>
            Get unlimited access to detailed horoscopes, compatibility reports, and exclusive insights
          </Text>

          <View style={styles.features}>
            <Text style={styles.feature}>📅 Weekly & Monthly Forecasts</Text>
            <Text style={styles.feature}>💖 Advanced Compatibility Analysis</Text>
            <Text style={styles.feature}>🔮 Personalized Birth Chart</Text>
            <Text style={styles.feature}>🌟 Premium Daily Insights</Text>
          </View>

          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeText}>Start Premium - $5/month</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Layout.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.displayLarge,
    fontSize: 32,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  feature: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: Layout.cardRadius,
    marginBottom: 16,
  },
  upgradeText: {
    ...Typography.titleMedium,
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    padding: 16,
  },
  closeText: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
  },
});
