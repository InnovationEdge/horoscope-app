import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ZODIAC_SIGNS } from '../../constants/signs';
import { BottomNav } from '../../components/BottomNav';
import { router, useSegments, useLocalSearchParams } from 'expo-router';
import { useUserStore } from '../../store/user';

// Import characteristics data
const characteristicsData = require('../../content/characteristics.json');

export default function TraitsScreen() {
  const segments = useSegments();
  const currentTab = segments[1] || 'traits';
  const { sign: paramSign } = useLocalSearchParams();
  const { user } = useUserStore();

  // Default to user sign or parameter sign, fallback to aries
  const [selectedSign, setSelectedSign] = useState((paramSign as string) || user?.sign || 'aries');

  const signData = ZODIAC_SIGNS[selectedSign];
  const characteristics = characteristicsData[selectedSign];

  const handleTabPress = (tab: string) => {
    if (tab === 'compat') {
      router.push('/(tabs)/compat');
    } else {
      router.push(`/(tabs)/${tab}`);
    }
  };

  const handleSignChange = (sign: string) => {
    setSelectedSign(sign);
  };

  if (!signData || !characteristics) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
            <View style={styles.loadingContent}>
              <Text style={styles.title}>Traits</Text>
              <Text style={styles.loadingSubtitle}>Loading...</Text>
            </View>
          </LinearGradient>
          <BottomNav activeTab={currentTab} onTabPress={handleTabPress} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Zodiac Traits</Text>

              {/* Sign Selector */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.signSelector}>
                {Object.keys(ZODIAC_SIGNS).map(sign => (
                  <Pressable
                    key={sign}
                    style={[styles.signButton, selectedSign === sign && styles.selectedSignButton]}
                    onPress={() => handleSignChange(sign)}
                  >
                    <Text style={styles.signEmoji}>{ZODIAC_SIGNS[sign].emoji}</Text>
                    <Text style={[styles.signName, selectedSign === sign && styles.selectedSignName]}>
                      {ZODIAC_SIGNS[sign].name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Sign Details */}
            <View style={styles.signCard}>
              <View style={styles.signHeader}>
                <View style={[styles.signIconContainer, { backgroundColor: signData.accent + '20' }]}>
                  <Text style={styles.signIcon}>{signData.emoji}</Text>
                </View>
                <View style={styles.signInfo}>
                  <Text style={styles.signTitle}>{signData.name}</Text>
                  <Text style={styles.dateRange}>{characteristics.dateRange}</Text>
                  <View style={styles.signMeta}>
                    <Text style={styles.metaText}>Element: {characteristics.element}</Text>
                    <Text style={styles.metaText}>Ruler: {characteristics.ruler}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.description}>{characteristics.description}</Text>
            </View>

            {/* Traits Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Traits</Text>
              <View style={styles.traitsContainer}>
                {characteristics.traits.map((trait, index) => (
                  <View key={index} style={styles.traitChip}>
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Strengths Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Strengths</Text>
              <View style={styles.listContainer}>
                {characteristics.strengths.map((strength, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>+</Text>
                    <Text style={styles.listText}>{strength}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Weaknesses Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Growth Areas</Text>
              <View style={styles.listContainer}>
                {characteristics.weaknesses.map((weakness, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.listText}>{weakness}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Lucky Elements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lucky Elements</Text>
              <View style={styles.luckyContainer}>
                <View style={styles.luckyItem}>
                  <Text style={styles.luckyLabel}>Numbers</Text>
                  <Text style={styles.luckyValue}>{characteristics.luckyNumbers.join(', ')}</Text>
                </View>
                <View style={styles.luckyItem}>
                  <Text style={styles.luckyLabel}>Colors</Text>
                  <Text style={styles.luckyValue}>{characteristics.luckyColors.join(', ')}</Text>
                </View>
              </View>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </LinearGradient>

        <BottomNav activeTab={currentTab} onTabPress={handleTabPress} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60,
  },
  header: {
    marginBottom: Layout.sectionSpacing,
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  signSelector: {
    paddingHorizontal: 4,
    gap: Spacing.sm,
  },
  signButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    minWidth: 70,
  },
  selectedSignButton: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  signEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  signName: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    fontSize: 11,
  },
  selectedSignName: {
    color: Colors.primary,
    fontWeight: '600',
  },
  signCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
  },
  signHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  signIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  signIcon: {
    fontSize: 32,
  },
  signInfo: {
    flex: 1,
  },
  signTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateRange: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  signMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  description: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  section: {
    marginBottom: Layout.sectionSpacing,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  traitChip: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  traitText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  listContainer: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  bulletPoint: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    width: 20,
    textAlign: 'center',
  },
  listText: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
    marginLeft: Spacing.sm,
  },
  luckyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    gap: Spacing.md,
  },
  luckyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  luckyLabel: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  luckyValue: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  bottomSpacing: {
    height: Layout.navbarHeight + 40,
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.screenPadding,
  },
  loadingSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    marginTop: 16,
  },
});
