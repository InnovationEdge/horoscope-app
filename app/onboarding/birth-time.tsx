import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ProgressBarTop } from '../../components/ProgressBarTop';
import { track } from '../../services/analytics';
import { useUserStore } from '../../store/user';

export default function BirthTime() {
  const [selectedTime, setSelectedTime] = useState(new Date(2000, 0, 1, 12, 0));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dontRemember, setDontRemember] = useState(false);
  const { updateUser } = useUserStore();

  useEffect(() => {
    track('onboarding_step_viewed', { step: 'birth_time' });
  }, []);

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time && !dontRemember) {
      setSelectedTime(time);
    }
  };

  const handleDontRememberToggle = (value: boolean) => {
    setDontRemember(value);
    if (value) {
      // Default to 12:00 PM when they don't remember
      setSelectedTime(new Date(2000, 0, 1, 12, 0));
    }
  };

  const handleContinue = () => {
    // Store birth time in user store
    const timeString = dontRemember ? '12:00' : selectedTime.toTimeString().slice(0, 5);

    updateUser({
      birth_time: timeString,
    });

    router.push('/onboarding/birth-place');
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ProgressBarTop currentStep={3} totalSteps={5} />

        <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
          <View style={styles.content}>
            {/* Hero Section */}
            <View style={styles.imageContainer}>
              <View style={styles.heroIconContainer}>
                <Text style={styles.heroIcon}>🌙</Text>
                <Text style={styles.heroIconSmall}>⏰</Text>
              </View>
              <Text style={styles.heroTitle}>Birth Time</Text>
              <Text style={styles.heroSubtitle}>What time were you born?</Text>
            </View>

            {/* Progress Dots */}
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
            </View>

            {/* Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>What time were you born?</Text>
              <Text style={styles.subtitle}>This helps create a more accurate birth chart</Text>
            </View>

            {/* Don't Remember Toggle */}
            <View style={styles.toggleContainer}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>I don't remember</Text>
                <Switch
                  value={dontRemember}
                  onValueChange={handleDontRememberToggle}
                  trackColor={{ false: Colors.outline, true: Colors.primary }}
                  thumbColor={dontRemember ? Colors.surface : Colors.text.secondary}
                />
              </View>
              {dontRemember && <Text style={styles.toggleSubtext}>We'll use 12:00 PM as default</Text>}
            </View>

            {/* Time Selection */}
            <View style={styles.timeContainer}>
              <Pressable
                style={[styles.timeButton, dontRemember && styles.timeButtonDisabled]}
                onPress={() => !dontRemember && setShowTimePicker(true)}
                disabled={dontRemember}
              >
                <Text style={[styles.timeText, dontRemember && styles.timeTextDisabled]}>
                  {formatTime(selectedTime)}
                </Text>
                <Text style={styles.timeIcon}>🕐</Text>
              </Pressable>

              {showTimePicker && !dontRemember && (
                <DateTimePicker value={selectedTime} mode="time" display="default" onChange={handleTimeChange} />
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
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
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
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.greeting,
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  toggleContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  toggleText: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  toggleSubtext: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    fontSize: 12,
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timeContainer: {
    width: '100%',
    marginBottom: Spacing.xxxl,
  },
  timeButton: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  timeButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.outline,
  },
  timeText: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  timeTextDisabled: {
    color: Colors.text.secondary,
  },
  timeIcon: {
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
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
