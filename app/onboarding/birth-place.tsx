import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ProgressBarTop } from '../../components/ProgressBarTop';
import { track } from '../../services/analytics';
import { useUserStore } from '../../store/user';

export default function BirthPlace() {
  const [birthPlace, setBirthPlace] = useState('');
  const { updateUser } = useUserStore();

  useEffect(() => {
    track('onboarding_step_viewed', { step: 'birth_place' });
  }, []);

  const handleContinue = () => {
    // Store birth place in user store (optional field)
    if (birthPlace.trim()) {
      updateUser({
        birth_place: birthPlace.trim(),
      });
    }

    router.push('/onboarding/confirm');
  };

  const handleSkip = () => {
    router.push('/onboarding/confirm');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar style="light" />
        <ProgressBarTop currentStep={4} totalSteps={5} />

        <LinearGradient colors={[Colors.bgTop, Colors.bgBot]} style={styles.gradient}>
          <View style={styles.content}>
            {/* Hero Image */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/onboarding/birth.png')}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>

            {/* Progress Dots */}
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
            </View>

            {/* Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Where were you born?</Text>
              <Text style={styles.subtitle}>This helps create a more accurate birth chart (optional)</Text>
            </View>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={birthPlace}
                onChangeText={setBirthPlace}
                placeholder="City, Country"
                placeholderTextColor={Colors.textSec}
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleSkip}>
                <Text style={styles.secondaryButtonText}>Skip</Text>
              </Pressable>

              <Pressable style={styles.tertiaryButton} onPress={handleBack}>
                <Text style={styles.tertiaryButtonText}>Back</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
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
    paddingTop: 60,
  },
  imageContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  heroImage: {
    width: 200,
    height: 160,
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
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.greeting,
    color: Colors.textPri,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Spacing.xxxl,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.inputRadius,
    padding: Layout.cardPadding,
    borderWidth: 1,
    borderColor: Colors.outline,
    color: Colors.textPri,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
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
    color: Colors.textPri,
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tertiaryButtonText: {
    ...Typography.labelMedium,
    color: Colors.textSec,
    fontSize: 16,
    fontWeight: '500',
  },
});
