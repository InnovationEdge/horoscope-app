import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ProgressBarTop } from '../../components/ProgressBarTop';
import { track } from '../../services/analytics';
import { useUserStore } from '../../store/user';
import { getZodiacSign, getDruidSign, getChineseAnimal } from '../../utils/zodiac';

export default function Confirm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    track('onboarding_step_viewed', { step: 'confirm' });
  }, []);

  const computeZodiacData = () => {
    if (!user?.birth_date) return null;

    const birthDate = new Date(user.birth_date);
    const zodiacSign = getZodiacSign(birthDate);
    const druidSign = getDruidSign(birthDate);
    const chineseAnimal = getChineseAnimal(birthDate.getFullYear());

    return {
      sign: zodiacSign,
      druidSign,
      chineseAnimal,
    };
  };

  const handleConfirm = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const zodiacData = computeZodiacData();

      if (zodiacData) {
        // Update user with computed zodiac data and mark onboarding as complete
        const updatedUser = {
          ...user,
          sign: zodiacData.sign,
          druidSign: zodiacData.druidSign,
          chineseAnimal: zodiacData.chineseAnimal,
          onboarded: true,
        };

        setUser(updatedUser);

        track('onboarding_completed', {
          sign: zodiacData.sign,
          has_birth_time: !!user.birth_time,
          has_birth_place: !!user.birth_place,
        });

        // Navigate to main app
        router.replace('/(tabs)/today');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const zodiacData = computeZodiacData();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ProgressBarTop currentStep={5} totalSteps={5} />

        <LinearGradient colors={[Colors.bgTop, Colors.bgBot]} style={styles.gradient}>
          <View style={styles.content}>
            {/* Hero Image */}
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/onboarding/insights.png')}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>

            {/* Progress Dots */}
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
            </View>

            {/* Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Perfect! You're all set</Text>
              <Text style={styles.subtitle}>
                {zodiacData ? `Your zodiac sign is ${zodiacData.sign}` : 'Ready to explore your horoscope'}
              </Text>
            </View>

            {/* Summary Card */}
            {zodiacData && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Zodiac Sign</Text>
                  <Text style={styles.summaryValue}>{zodiacData.sign}</Text>
                </View>
                {user?.birth_time && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Birth Time</Text>
                    <Text style={styles.summaryValue}>{user.birth_time}</Text>
                  </View>
                )}
                {user?.birth_place && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Birth Place</Text>
                    <Text style={styles.summaryValue}>{user.birth_place}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleConfirm}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>{isLoading ? 'Setting up...' : 'Start My Journey'}</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleBack} disabled={isLoading}>
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
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginBottom: Spacing.xxxl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    fontSize: 14,
  },
  summaryValue: {
    ...Typography.titleMedium,
    color: Colors.textPri,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  buttonDisabled: {
    opacity: 0.6,
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
