import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function SignIn() {
  const handleContinueWithoutAccount = () => {
    // Emit analytics event for tab selection
    console.log('Analytics: tab_selected', { tab: 'today' });
    router.replace('/(tabs)/today');
  };

  const handleContinue = () => {
    // Emit analytics event for tab selection
    console.log('Analytics: tab_selected', { tab: 'today' });
    router.replace('/(tabs)/today');
  };

  return (
    <View style={styles.container} accessibilityLabel="Salamene Sign In Screen">
      <StatusBar barStyle="light-content" />

      {/* Top illustration */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>✨</Text>
        </View>
      </View>

      {/* Brand and subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.brand}>Salamene Onboarding</Text>
        <Text style={styles.subtitle}>Sign in to personalize your stars</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.outlineButton}
          onPress={handleContinueWithoutAccount}
          accessibilityLabel="Continue without account"
          accessibilityRole="button"
        >
          <Text style={styles.outlineButtonText}>Continue without account</Text>
        </Pressable>

        <Pressable
          style={styles.filledButton}
          onPress={handleContinue}
          accessibilityLabel="Continue with account"
          accessibilityRole="button"
        >
          <Text style={styles.filledButtonText}>Continue</Text>
        </Pressable>
      </View>

      {/* Footer hint */}
      <Text style={styles.footerHint}>You can add Google/Apple later</Text>
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
  imageContainer: {
    marginBottom: 32,
  },
  imagePlaceholder: {
    width: 220,
    height: 200,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#7C4DFF',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brand: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.70)',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  outlineButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    color: 'rgba(255,255,255,0.87)',
    fontSize: 16,
    fontWeight: '600',
  },
  filledButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledButtonText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    fontWeight: '600',
  },
  footerHint: {
    position: 'absolute',
    bottom: 48,
    color: 'rgba(255,255,255,0.60)',
    fontSize: 12,
    textAlign: 'center',
  },
});
