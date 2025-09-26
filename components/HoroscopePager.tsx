import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  onPaywallNeeded?: () => void;
}

export function HoroscopePager({ data, onReadMore, onPaywallNeeded }: HoroscopePagerProps) {
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
      onPaywallNeeded?.();
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

  const renderPage = (item: HoroscopeData, index: number) => {
    const isExpanded = expandedPages.has(index);
    const content = isExpanded ? item.full : item.preview;
    const isPremiumContent = item.timeframe !== 'today';
    const canAccess = !isPremiumContent || isPremium();

    return (
      <View key={item.timeframe} style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.timeframeTitle}>
            {timeframeLabels[item.timeframe]}
            {isPremiumContent && !isPremium() && (
              <Text style={styles.premiumBadge}> ✨ Premium</Text>
            )}
          </Text>

          <Text style={styles.contentText} numberOfLines={isExpanded ? undefined : 4}>
            {content}
          </Text>

          {canAccess && (
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore(index, item.timeframe)}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Read Less' : 'Read More'}
              </Text>
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
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
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
  contentText: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 24,
    flex: 1,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.outline,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
});