import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ProgressBarTop } from '../../components/ProgressBarTop';
import { track } from '../../services/analytics';
import { useUserStore } from '../../store/user';

export default function BirthDate() {
  // Set default date to 25 years ago for better UX
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 25);

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [showDatePicker, setShowDatePicker] = useState(true); // Show by default for better UX
  const { updateUser } = useUserStore();

  useEffect(() => {
    track('onboarding_step_viewed', { step: 'birth_date' });
  }, []);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleContinue = () => {
    if (!selectedDate) {
      Alert.alert('Required', 'Please select your birth date to continue.');
      return;
    }

    // Store birth date in user store
    updateUser({
      birth_date: selectedDate.toISOString().split('T')[0],
    });

    router.push('/onboarding/birth-time');
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ProgressBarTop currentStep={2} totalSteps={5} />

        <LinearGradient colors={[Colors.bgTop, Colors.bgBot]} style={styles.gradient}>
          <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.imageContainer}>
              <View style={styles.heroIconContainer}>
                <Text style={styles.heroIcon}>🌟</Text>
                <Text style={styles.heroIconSmall}>📅</Text>
              </View>
              <Text style={styles.heroTitle}>Birth Date</Text>
              <Text style={styles.heroSubtitle}>When were you born?</Text>
            </View>

            {/* Progress Dots */}
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
            </View>

            {/* Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>When were you born?</Text>
              <Text style={styles.subtitle}>This helps us calculate your zodiac sign accurately</Text>
            </View>

            {/* Date Selection */}
            <View style={styles.dateContainer}>
              <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                <Text style={styles.dateIcon}>📅</Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleBack}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>
            </View>
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
    paddingTop: 60,
  },
  imageContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  heroIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  heroIcon: {
    fontSize: 64,
    textAlign: 'center',
  },
  heroIconSmall: {
    fontSize: 32,
    position: 'absolute',
    bottom: 0,
    right: -10,
  },
  heroTitle: {
    ...Typography.displayLarge,
    color: Colors.textPri,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.xxxl,
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
  dateContainer: {
    width: '100%',
    marginBottom: Spacing.xxxl,
  },
  dateButton: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  dateText: {
    ...Typography.titleMedium,
    color: Colors.textPri,
    fontSize: 18,
    fontWeight: '600',
  },
  dateIcon: {
    fontSize: 24,
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
});
