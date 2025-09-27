import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';
import { fetchPricing, Pricing } from '../services/pricing';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bullets?: string[];
  target: string;
  premium_required: boolean;
  gradient?: string[];
  accentColor?: string;
  theme?: 'premium' | 'love' | 'wisdom' | 'mystic' | 'energy' | 'nature';
}

interface BannerCarouselProps {
  banners: Banner[];
  onBannerPress: (item: Banner) => void;
}

export function getDefaultBanners(): Banner[] {
  // This would be loaded from content/banners.json
  return [
    {
      id: 'premium_weekly',
      title: '✨ Unlock your Weekly Horoscope',
      subtitle: 'Deeper guidance awaits for {PRICE}',
      bullets: ['See career highlights', 'Navigate relationships', 'Make smarter moves'],
      target: 'premium',
      premium_required: true,
      theme: 'premium',
      gradient: ['#1a1a2e', '#16213e'],
      accentColor: '#FFD700',
    },
    {
      id: 'compat_leo',
      title: "💖 Who's your best match?",
      subtitle: 'Try compatibility with Leo',
      bullets: ['Instant chemistry score', 'Love, career, friendship', 'Actionable tips'],
      target: 'compat:leo',
      premium_required: false,
      theme: 'love',
      gradient: ['#2c1810', '#3d2914'],
      accentColor: '#FF6B6B',
    },
    {
      id: 'druid_intro',
      title: '🌳 Your Druid Sign',
      subtitle: 'Ancient wisdom, modern insight',
      bullets: ['Personality sketch', 'Hidden strengths', 'Life themes'],
      target: 'druid',
      premium_required: false,
      theme: 'nature',
      gradient: ['#0d2818', '#1a3d2e'],
      accentColor: '#27AE60',
    },
    {
      id: 'chinese_new_year',
      title: '🐉 Your Chinese Zodiac',
      subtitle: 'Discover your animal spirit',
      bullets: ['12-year cycle wisdom', 'Personality traits', 'Fortune insights'],
      target: 'chinese',
      premium_required: false,
      theme: 'mystic',
      gradient: ['#2d1b2e', '#3d2741'],
      accentColor: '#E74C3C',
    },
    {
      id: 'energy_boost',
      title: "⚡ Today's Energy Boost",
      subtitle: 'Harness cosmic power for success',
      bullets: ['Peak energy hours', 'Lucky directions', 'Power colors'],
      target: 'today',
      premium_required: false,
      theme: 'energy',
      gradient: ['#2e1a0d', '#3d2914'],
      accentColor: '#F39C12',
    },
    {
      id: 'wisdom_ancient',
      title: '🔮 Ancient Wisdom Oracle',
      subtitle: 'Unlock secrets of the stars',
      bullets: ['Sacred knowledge', 'Hidden meanings', 'Mystical insights'],
      target: 'traits',
      premium_required: false,
      theme: 'wisdom',
      gradient: ['#1a0d2e', '#2d1a3d'],
      accentColor: '#9B59B6',
    },
  ];
}

export function BannerCarousel({ banners, onBannerPress }: BannerCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - Layout.screenPadding * 2 - 20;
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Fetch pricing for {PRICE} replacement
    fetchPricing()
      .then(setPricing)
      .catch(() => {
        // Fallback pricing already set in fetchPricing
      });
  }, []);

  useEffect(() => {
    // Auto-scroll every 5 seconds
    const interval = setInterval(() => {
      if (scrollViewRef.current && banners.length > 1) {
        const nextPage = (currentPage + 1) % banners.length;
        scrollViewRef.current.scrollTo({
          x: nextPage * (cardWidth + 16),
          animated: true,
        });
        setCurrentPage(nextPage);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, cardWidth, currentPage]);

  const handleBannerPress = (item: Banner) => {
    onBannerPress(item);
  };

  const replacePricingPlaceholders = (text: string): string => {
    if (!pricing) return text.replace('{PRICE}', '5 USD');
    return text.replace('{PRICE}', pricing.monthly_display);
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
        {banners.map(item => (
          <Pressable
            key={item.id}
            style={[styles.bannerCard, { width: cardWidth }]}
            onPress={() => handleBannerPress(item)}
            accessibilityLabel={`Banner: ${item.title}`}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={item.gradient || ['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.bannerContent}>
                <View style={styles.textContent}>
                  <Text style={[styles.bannerTitle, styles.whiteText]}>{item.title}</Text>
                  <Text style={[styles.bannerSubtitle, styles.whiteSubtitle]}>
                    {replacePricingPlaceholders(item.subtitle)}
                  </Text>

                  {/* Bullet points */}
                  {item.bullets && (
                    <View style={styles.bulletList}>
                      {item.bullets.slice(0, 3).map((bullet, bulletIndex) => (
                        <Text key={bulletIndex} style={[styles.bulletText, styles.whiteBullet]}>
                          • {bullet}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                {item.premium_required && (
                  <View style={[styles.premiumBadge, { backgroundColor: item.accentColor || '#FFD700' }]}>
                    <Text style={[styles.premiumText, { color: '#000' }]}>Premium</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View key={index} style={[styles.paginationDot, currentPage === index && styles.activeDot]} />
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
    paddingHorizontal: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: 4,
  },
  bannerCard: {
    height: 120, // Fixed height as per spec
    marginRight: 16,
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 60, // Space for premium badge
  },
  bannerTitle: {
    ...Typography.titleMedium,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '700',
  },
  whiteText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '800',
  },
  bannerSubtitle: {
    ...Typography.bodyMedium,
    lineHeight: 20,
    marginBottom: 8,
    fontSize: 14,
  },
  whiteSubtitle: {
    color: 'rgba(255, 255, 255, 0.98)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    fontWeight: '600',
  },
  bulletList: {
    marginTop: 8,
    paddingLeft: 4,
  },
  bulletText: {
    ...Typography.bodySmall,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 3,
    paddingLeft: 8,
  },
  whiteBullet: {
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontWeight: '500',
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.premiumChip,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  paginationDot: {
    width: Layout.dotSize,
    height: Layout.dotSize,
    borderRadius: Layout.dotSize / 2,
    backgroundColor: Colors.dotInactive,
    marginHorizontal: Layout.dotSpacing / 2,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
});
