import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  premium_required: boolean;
  cta: {
    label: string;
    action: string;
    target?: string;
  };
  target?: string;
  gradient?: string[];
}

interface BannerCarouselProps {
  banners: Banner[];
  onBannerPress: (item: Banner) => void;
}

export function getDefaultBanners(isPremium: boolean): Banner[] {
  if (isPremium) {
    return [
      {
        id: 'premium-compatibility',
        title: 'Premium Match Analysis',
        subtitle: 'Deep dive into your cosmic connections',
        premium_required: false,
        cta: { label: 'Explore', action: 'navigate', target: '/(tabs)/compat' },
        target: '/(tabs)/compat',
        gradient: ['#667eea', '#764ba2']
      },
      {
        id: 'premium-yearly',
        title: 'Full Year Ahead',
        subtitle: 'Your complete 2024 astrological forecast',
        premium_required: false,
        cta: { label: 'View Forecast', action: 'navigate', target: '/(tabs)/today' },
        target: '/(tabs)/today',
        gradient: ['#f093fb', '#f5576c']
      }
    ];
  }

  return [
    {
      id: 'upgrade-premium',
      title: 'Unlock Premium',
      subtitle: 'Get full horoscope readings and compatibility reports',
      premium_required: true,
      cta: { label: 'Upgrade Now', action: 'paywall' },
      gradient: ['#667eea', '#764ba2']
    },
    {
      id: 'compatibility-teaser',
      title: 'Find Your Perfect Match',
      subtitle: 'Discover cosmic compatibility with someone special',
      premium_required: false,
      cta: { label: 'Check Compatibility', action: 'navigate', target: '/(tabs)/compat' },
      target: '/(tabs)/compat',
      gradient: ['#f093fb', '#f5576c']
    },
    {
      id: 'yearly-preview',
      title: 'Your Year Ahead',
      subtitle: 'Preview your 2024 astrological forecast',
      premium_required: true,
      cta: { label: 'See Preview', action: 'paywall' },
      gradient: ['#4facfe', '#00f2fe']
    }
  ];
}

export function BannerCarousel({ banners, onBannerPress }: BannerCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - (Layout.screenPadding * 2) - 20;

  useEffect(() => {
    // Auto-scroll every 5 seconds
    const interval = setInterval(() => {
      if (scrollViewRef.current && banners.length > 1) {
        // Simple auto-scroll implementation
        scrollViewRef.current.scrollTo({
          x: Math.random() * (cardWidth + 16) * banners.length,
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, cardWidth]);

  const handleBannerPress = (item: Banner) => {
    onBannerPress(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Explore More</Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={cardWidth + 16}
        snapToAlignment="start"
      >
        {banners.map((item, index) => (
          <Pressable
            key={item.id}
            style={[styles.bannerCard, { width: cardWidth }]}
            onPress={() => handleBannerPress(item)}
          >
            <LinearGradient
              colors={item.gradient || ['#667eea', '#764ba2']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.bannerContent}>
                <View style={styles.textContent}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                </View>

                <View style={styles.ctaButton}>
                  <Text style={styles.ctaText}>{item.cta.label}</Text>
                  {item.premium_required && (
                    <Text style={styles.premiumStar}>✨</Text>
                  )}
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View key={index} style={styles.paginationDot} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.sectionSpacing,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    paddingHorizontal: 4, // Align with cards
  },
  scrollContainer: {
    paddingHorizontal: 4,
  },
  bannerCard: {
    height: 120,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gradient: {
    flex: 1,
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '600',
  },
  bannerSubtitle: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ctaText: {
    ...Typography.labelSmall,
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  premiumStar: {
    fontSize: 16,
    marginLeft: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outline,
    marginHorizontal: 3,
  },
});