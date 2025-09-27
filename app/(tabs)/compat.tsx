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

// Import compatibility data
const compatibilityData = require('../../content/compatibility.json');

export default function CompatibilityScreen() {
  const segments = useSegments();
  const currentTab = segments[1] || 'compat';
  const { with: paramWith } = useLocalSearchParams();
  const { user } = useUserStore();

  // Left sign is always user's sign, right sign can be changed
  const [leftSign] = useState(user?.sign || 'aries');
  const [rightSign, setRightSign] = useState((paramWith as string) || 'taurus');
  const [showDetails, setShowDetails] = useState(false);

  const handleTabPress = (tab: string) => {
    if (tab === 'compat') {
      router.push('/(tabs)/compat');
    } else {
      router.push(`/(tabs)/${tab}`);
    }
  };

  const handleSignChange = (sign: string) => {
    setRightSign(sign);
    setShowDetails(false); // Reset to preview when changing signs
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Get compatibility data
  const compatibility = compatibilityData[leftSign]?.[rightSign];
  const leftSignData = ZODIAC_SIGNS[leftSign];
  const rightSignData = ZODIAC_SIGNS[rightSign];

  if (!compatibility || !leftSignData || !rightSignData) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
            <View style={styles.loadingContent}>
              <Text style={styles.title}>Compatibility</Text>
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
              <Text style={styles.title}>Compatibility</Text>
              <Text style={styles.subtitle}>Discover your cosmic connection</Text>
            </View>

            {/* Sign Comparison */}
            <View style={styles.comparisonCard}>
              {/* Left Sign (User) */}
              <View style={styles.signContainer}>
                <View style={[styles.signIconContainer, { backgroundColor: leftSignData.accent + '20' }]}>
                  <Text style={styles.signIcon}>{leftSignData.emoji}</Text>
                </View>
                <Text style={styles.signName}>{leftSignData.name}</Text>
                <Text style={styles.signLabel}>You</Text>
              </View>

              {/* VS Divider */}
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.overallScore}>{compatibility.overall}%</Text>
              </View>

              {/* Right Sign (Selectable) */}
              <View style={styles.signContainer}>
                <View style={[styles.signIconContainer, { backgroundColor: rightSignData.accent + '20' }]}>
                  <Text style={styles.signIcon}>{rightSignData.emoji}</Text>
                </View>
                <Text style={styles.signName}>{rightSignData.name}</Text>
                <Text style={styles.signLabel}>Partner</Text>
              </View>
            </View>

            {/* Sign Selector for Right Sign */}
            <View style={styles.selectorSection}>
              <Text style={styles.sectionTitle}>Choose Partner Sign</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.signSelector}>
                {Object.keys(ZODIAC_SIGNS)
                  .filter(sign => sign !== leftSign)
                  .map(sign => (
                    <Pressable
                      key={sign}
                      style={[styles.signButton, rightSign === sign && styles.selectedSignButton]}
                      onPress={() => handleSignChange(sign)}
                    >
                      <Text style={styles.signEmoji}>{ZODIAC_SIGNS[sign].emoji}</Text>
                      <Text style={[styles.signButtonName, rightSign === sign && styles.selectedSignButtonName]}>
                        {ZODIAC_SIGNS[sign].name}
                      </Text>
                    </Pressable>
                  ))}
              </ScrollView>
            </View>

            {/* Compatibility Scores */}
            <View style={styles.scoresCard}>
              <Text style={styles.cardTitle}>Compatibility Breakdown</Text>
              <View style={styles.scoresContainer}>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>💕 Love</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreProgress, { width: `${compatibility.love}%` }]} />
                  </View>
                  <Text style={styles.scoreValue}>{compatibility.love}%</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>👥 Friendship</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreProgress, { width: `${compatibility.friendship}%` }]} />
                  </View>
                  <Text style={styles.scoreValue}>{compatibility.friendship}%</Text>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>💬 Communication</Text>
                  <View style={styles.scoreBar}>
                    <View style={[styles.scoreProgress, { width: `${compatibility.communication}%` }]} />
                  </View>
                  <Text style={styles.scoreValue}>{compatibility.communication}%</Text>
                </View>
              </View>
            </View>

            {/* Analysis */}
            <View style={styles.analysisCard}>
              <Text style={styles.cardTitle}>Relationship Analysis</Text>
              <Text style={styles.preview}>{compatibility.preview}</Text>

              {!showDetails ? (
                <Pressable style={styles.readMoreButton} onPress={toggleDetails}>
                  <Text style={styles.readMoreText}>Read Full Analysis</Text>
                </Pressable>
              ) : (
                <View>
                  <Text style={styles.detailed}>{compatibility.detailed}</Text>

                  {/* Tips Section */}
                  <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>💡 Relationship Tips</Text>
                    <View style={styles.tipsList}>
                      {compatibility.tips.map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                          <Text style={styles.tipBullet}>•</Text>
                          <Text style={styles.tipText}>{tip}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <Pressable style={styles.readMoreButton} onPress={toggleDetails}>
                    <Text style={styles.readMoreText}>Show Less</Text>
                  </Pressable>
                </View>
              )}
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
    alignItems: 'center',
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  comparisonCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signContainer: {
    alignItems: 'center',
    flex: 1,
  },
  signIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  signIcon: {
    fontSize: 32,
  },
  signName: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  signLabel: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontSize: 11,
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  vsText: {
    ...Typography.titleMedium,
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  overallScore: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  selectorSection: {
    marginBottom: Layout.sectionSpacing,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
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
  signButtonName: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    fontSize: 11,
  },
  selectedSignButtonName: {
    color: Colors.primary,
    fontWeight: '600',
  },
  scoresCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
  },
  cardTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  scoresContainer: {
    gap: Spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scoreLabel: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
    width: 100,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.outline,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  scoreValue: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  analysisCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
  },
  preview: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  detailed: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  readMoreText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  tipsSection: {
    marginBottom: Spacing.lg,
  },
  tipsTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  tipsList: {
    gap: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  tipBullet: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    width: 20,
    textAlign: 'center',
  },
  tipText: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
    marginLeft: Spacing.sm,
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
