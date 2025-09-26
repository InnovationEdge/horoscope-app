import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';
import { useSubscriptionStore } from '../store/subscription';

export interface HoroscopeData {
  timeframe: 'today' | 'weekly' | 'monthly' | 'yearly';
  preview: string;
  full: string;
  lucky?: {
    number: number;
    color: string;
    mood: string;
  };
  highlights?: {
    bestDays: string[];
    challenges: string[];
    opportunities: string[];
    advice: string;
  };
  themes?: {
    primary: string;
    secondary: string;
    energy: string;
    focus: string[];
  };
  majorEvents?: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
}

interface HoroscopePagerProps {
  data: HoroscopeData[];
  onReadMore?: (timeframe: string) => void;
  onPaywallNeeded?: (timeframe: string) => void;
  onPagerSwiped?: (to: string) => void;
}

export function HoroscopePager({ data, onReadMore, onPaywallNeeded, onPagerSwiped }: HoroscopePagerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());
  const pagerRef = useRef<PagerView>(null);
  const { isPremium } = useSubscriptionStore();

  const timeframeLabels = {
    today: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    yearly: 'This Year'
  };

  const handleReadMore = (pageIndex: number, timeframe: string) => {
    const isPremiumContent = timeframe !== 'today';

    if (isPremiumContent && !isPremium()) {
      onPaywallNeeded?.(timeframe);
      return;
    }

    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageIndex)) {
      newExpanded.delete(pageIndex);
    } else {
      newExpanded.add(pageIndex);
    }
    setExpandedPages(newExpanded);
    onReadMore?.(timeframe);
  };

  const handlePagePress = (timeframe: string) => {
    const isPremiumContent = timeframe !== 'today';
    if (isPremiumContent && !isPremium()) {
      onPaywallNeeded?.(timeframe);
    }
  };

  const handlePageSelected = (e: any) => {
    const position = e.nativeEvent.position;
    setCurrentPage(position);

    if (position > 0) { // Not Today tab
      const timeframe = data[position]?.timeframe;
      onPagerSwiped?.(timeframe);
    }
  };

  const renderPage = (item: HoroscopeData, index: number) => {
    const isExpanded = expandedPages.has(index);
    const content = isExpanded ? item.full : item.preview;
    const isPremiumContent = item.timeframe !== 'today';
    const canAccess = !isPremiumContent || isPremium();
    const isToday = item.timeframe === 'today';

    return (
      <View key={item.timeframe} style={styles.page}>
        <Pressable
          style={styles.card}
          onPress={() => handlePagePress(item.timeframe)}
          disabled={isToday}
        >
          {/* Header */}
          <Text style={[
            styles.timeframeTitle,
            isPremiumContent && !canAccess && { color: Colors.secondaryBlue }
          ]}>
            {timeframeLabels[item.timeframe]}
            {isPremiumContent && !isPremium() && (
              <Text style={styles.premiumBadge}> Premium</Text>
            )}
          </Text>

          {/* Content Container */}
          <View style={styles.contentContainer}>
            <Text
              style={[
                styles.contentText,
                !isToday && !canAccess && styles.premiumText
              ]}
              numberOfLines={isExpanded ? undefined : 4}
            >
              {content}
            </Text>

            {/* Blur overlay for premium content */}
            {isPremiumContent && !canAccess && (
              <View style={styles.blurOverlay}>
                <View style={styles.blurMask} />
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {canAccess && (
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore(index, item.timeframe)}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Read Less ▴' : 'Read More ▾'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Premium CTA for gated content */}
          {isPremiumContent && !canAccess && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => onPaywallNeeded?.(item.timeframe)}
            >
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}

          {/* Show Lucky Row only for Today */}
          {item.timeframe === 'today' && item.lucky && (
            <View style={styles.luckyRow}>
              <View style={styles.luckyItem}>
                <Text style={styles.luckyLabel}>Lucky Number</Text>
                <Text style={styles.luckyValue}>{item.lucky.number}</Text>
              </View>
              <View style={styles.luckyItem}>
                <Text style={styles.luckyLabel}>Lucky Color</Text>
                <Text style={styles.luckyValue}>{item.lucky.color}</Text>
              </View>
              <View style={styles.luckyItem}>
                <Text style={styles.luckyLabel}>Mood</Text>
                <Text style={styles.luckyValue}>{item.lucky.mood}</Text>
              </View>
            </View>
          )}

          {/* Show Weekly Highlights */}
          {item.timeframe === 'weekly' && item.highlights && isExpanded && (
            <View style={styles.highlights}>
              <Text style={styles.highlightTitle}>✨ Best Days</Text>
              <Text style={styles.highlightText}>{item.highlights.bestDays.join(', ')}</Text>
              <Text style={styles.highlightTitle}>🎯 Opportunities</Text>
              <Text style={styles.highlightText}>{item.highlights.opportunities.join(', ')}</Text>
            </View>
          )}

          {/* Show Monthly Themes */}
          {item.timeframe === 'monthly' && item.themes && isExpanded && (
            <View style={styles.themes}>
              <Text style={styles.themeTitle}>🌟 Primary Theme</Text>
              <Text style={styles.themeText}>{item.themes.primary}</Text>
              <Text style={styles.themeTitle}>⚡ Energy</Text>
              <Text style={styles.themeText}>{item.themes.energy}</Text>
            </View>
          )}

          {/* Show Yearly Major Events */}
          {item.timeframe === 'yearly' && item.majorEvents && isExpanded && (
            <View style={styles.majorEvents}>
              <Text style={styles.eventTitle}>🌸 Spring</Text>
              <Text style={styles.eventText}>{item.majorEvents.spring}</Text>
              <Text style={styles.eventTitle}>☀️ Summer</Text>
              <Text style={styles.eventText}>{item.majorEvents.summer}</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {data.map((item, index) => renderPage(item, index))}
      </PagerView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentPage === index && styles.activeDot
            ]}
            onPress={() => pagerRef.current?.setPage(index)}
            accessibilityLabel={`Page ${index + 1} of ${data.length}`}
            accessibilityRole="button"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.sectionSpacing,
  },
  pager: {
    height: 320,
  },
  page: {
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    height: 300,
  },
  timeframeTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  premiumBadge: {
    color: Colors.primary,
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  contentText: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 24,
    flex: 1,
  },
  premiumText: {
    opacity: 0.8,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  blurMask: {
    flex: 1,
    backgroundColor: 'rgba(13, 11, 26, 0.8)',
    backdropFilter: 'blur(8px)',
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  readMoreText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  upgradeButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  upgradeText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  luckyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  luckyItem: {
    flex: 1,
    alignItems: 'center',
  },
  luckyLabel: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  luckyValue: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  highlights: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  highlightTitle: {
    ...Typography.labelSmall,
    color: Colors.primary,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  highlightText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  themes: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  themeTitle: {
    ...Typography.labelSmall,
    color: Colors.primary,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  themeText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  majorEvents: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  eventTitle: {
    ...Typography.labelSmall,
    color: Colors.primary,
    marginBottom: 4,
    marginTop: Spacing.sm,
  },
  eventText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  dot: {
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