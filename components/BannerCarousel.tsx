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
      bullets: ['See career highlights','Navigate relationships','Make smarter moves'],
      target: 'premium',
      premium_required: true
    },
    {
      id: 'compat_leo',
      title: '💖 Who\'s your best match?',
      subtitle: 'Try compatibility with Leo',
      bullets: ['Instant chemistry score','Love, career, friendship','Actionable tips'],
      target: 'compat:leo',
      premium_required: false
    },
    {
      id: 'druid_intro',
      title: '🌳 Your Druid Sign',
      subtitle: 'Ancient wisdom, modern insight',
      bullets: ['Personality sketch','Hidden strengths','Life themes'],
      target: 'druid',
      premium_required: false
    },
    {
      id: 'chinese_new_year',
      title: '🐉 Your Chinese Zodiac',
      subtitle: 'Discover your animal spirit',
      bullets: ['12-year cycle wisdom','Personality traits','Fortune insights'],
      target: 'chinese',
      premium_required: false
    }
  ];
}

export function BannerCarousel({ banners, onBannerPress }: BannerCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - (Layout.screenPadding * 2) - 20;
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Fetch pricing for {PRICE} replacement
    fetchPricing().then(setPricing).catch(() => {
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
        {banners.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.bannerCard, { width: cardWidth }]}
            onPress={() => handleBannerPress(item)}
            accessibilityLabel={`Banner: ${item.title}`}
            accessibilityRole="button"
          >
            <View style={styles.card}>
              <View style={styles.bannerContent}>
                <View style={styles.textContent}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle}>
                    {replacePricingPlaceholders(item.subtitle)}
                  </Text>

                  {/* Bullet points */}
                  {item.bullets && (
                    <View style={styles.bulletList}>
                      {item.bullets.slice(0, 3).map((bullet, bulletIndex) => (
                        <Text key={bulletIndex} style={styles.bulletText}>
                          • {bullet}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                {item.premium_required && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentPage === index && styles.activeDot
              ]}
            />
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
    height: 120, // Fixed height as per spec
    marginRight: 16,
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  bannerContent: {
    flex: 1,
    padding: Layout.cardPadding,
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  bannerSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 2,
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.premiumChip,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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