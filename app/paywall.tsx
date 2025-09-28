import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Typography, Layout, Spacing } from '../constants/theme';
import { track } from '../services/analytics';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
  features: string[];
}

export default function PaywallScreen() {
  const { src } = useLocalSearchParams<{ src?: string }>();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [purchasing, setPurchasing] = useState(false);

  const shimmerOpacity = useSharedValue(0.5);
  const checkmarkScale = useSharedValue(0);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
  }));

  useEffect(() => {
    // Start shimmer animation
    shimmerOpacity.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );

    // Track paywall view
    track('paywall_shown', { trigger: src || 'unknown' });
  }, []);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    checkmarkScale.value = withSpring(1.2, { damping: 15, stiffness: 300 });
    checkmarkScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    track('paywall_plan_selected', { plan: planId });
  };

  const handlePurchase = async () => {
    if (!selectedPlan || purchasing) return;

    setPurchasing(true);
    track('purchase_initiated', { plan: selectedPlan, source: src });

    try {
      // In a real app, you'd integrate with Apple/Google/Stripe
      // For demo, we'll simulate a purchase
      await new Promise(resolve => setTimeout(resolve, 2000));

      track('purchase_success', { plan: selectedPlan, source: src });

      Alert.alert(
        'Welcome to Premium!',
        'Your subscription is now active. Enjoy unlimited access to all features.',
        [
          {
            text: 'Start Exploring',
            onPress: () => router.replace('/(tabs)/today'),
          },
        ]
      );
    } catch (error) {
      track('purchase_failed', { plan: selectedPlan, reason: 'unknown' });
      Alert.alert('Purchase Failed', 'Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    track('restore_initiated');
    Alert.alert('Restore', 'No previous purchases found.');
  };

  const handleClose = () => {
    track('paywall_dismissed', { source: src });
    router.back();
  };

  const features = [
    {
      icon: '🔮',
      title: 'Unlimited Horoscopes',
      description: 'Daily, weekly, monthly & yearly predictions',
    },
    {
      icon: '💕',
      title: 'Advanced Compatibility',
      description: 'Deep relationship insights & compatibility reports',
    },
    {
      icon: '🌟',
      title: 'Premium Content',
      description: 'Exclusive horoscopes & astrological insights',
    },
    {
      icon: '📱',
      title: 'No Ads',
      description: 'Enjoy an uninterrupted, premium experience',
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Personalized daily reminders & cosmic alerts',
    },
    {
      icon: '🌙',
      title: 'Birth Chart Analysis',
      description: 'Complete natal chart & planetary positions',
    },
  ];

  const plans: PricingPlan[] = [
    {
      id: 'weekly',
      name: 'Weekly',
      price: '$2.99',
      period: 'week',
      features: ['7-day access', 'All premium features'],
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: 'month',
      popular: true,
      features: ['30-day access', 'All premium features', 'Most popular'],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$59.99',
      period: 'year',
      savings: 'Save 50%',
      features: ['365-day access', 'All premium features', 'Best value'],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[Colors.bg.top, Colors.bg.bottom]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Unlock Premium</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <Animated.View style={[styles.logoContainer, shimmerStyle]}>
              <Image
                source={require('../assets/app-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
            <Text style={styles.heroTitle}>Salamene Premium</Text>
            <Text style={styles.heroSubtitle}>
              Unlock the full power of your cosmic destiny
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing Plans */}
          <View style={styles.plansContainer}>
            <Text style={styles.plansTitle}>Choose Your Plan</Text>
            {plans.map((plan: PricingPlan) => (
              <Pressable
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                  plan.popular && styles.planCardPopular,
                ]}
                onPress={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>per {plan.period}</Text>
                    {plan.savings && (
                      <Text style={styles.planSavings}>{plan.savings}</Text>
                    )}
                  </View>
                  <Animated.View style={[styles.checkmark, checkmarkStyle]}>
                    {selectedPlan === plan.id && (
                      <Text style={styles.checkmarkIcon}>✓</Text>
                    )}
                  </Animated.View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Purchase Button */}
          <Pressable
            style={[styles.purchaseButton, purchasing && styles.buttonDisabled]}
            onPress={handlePurchase}
            disabled={purchasing}
          >
            <LinearGradient
              colors={[Colors.primary, '#9C6AFF']}
              style={styles.purchaseGradient}
            >
              {purchasing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.purchaseText}>
                  Start Premium - {plans.find((p: PricingPlan) => p.id === selectedPlan)?.price}
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable onPress={handleRestore}>
              <Text style={styles.footerText}>Restore Purchases</Text>
            </Pressable>
            <Text style={styles.footerText}>
              Terms of Service • Privacy Policy
            </Text>
            <Text style={styles.footerSmall}>
              Cancel anytime. Auto-renewal can be turned off in Account Settings.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.top,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    left: Spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 77, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 60,
    height: 60,
  },
  heroTitle: {
    ...Typography.displayLarge,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  featuresContainer: {
    marginBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  featureDescription: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  plansContainer: {
    marginBottom: Spacing.xl,
  },
  plansTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.primary,
  },
  planCardPopular: {
    borderColor: Colors.gold,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -40,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    ...Typography.labelSmall,
    color: Colors.bg.top,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  planPrice: {
    ...Typography.displayLarge,
    color: Colors.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  planPeriod: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  planSavings: {
    ...Typography.labelSmall,
    color: Colors.gold,
    fontWeight: '600',
    marginTop: 4,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  purchaseButton: {
    borderRadius: Layout.buttonRadius,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  purchaseGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseText: {
    ...Typography.titleMedium,
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  footerSmall: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 16,
  },
});
