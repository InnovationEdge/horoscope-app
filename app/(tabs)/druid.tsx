import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { BottomNav } from '../../components/BottomNav';
import { router, useSegments, useLocalSearchParams } from 'expo-router';
import { useUserStore } from '../../store/user';

// Import content data
const druidData = require('../../content/druid.json');
const chineseData = require('../../content/chinese.json');

// Birth date to druid sign calculation
const calculateDruidSign = (birthDate: Date): string => {
  const month = birthDate.getMonth() + 1; // 1-12
  const day = birthDate.getDate();

  // Define date ranges for each druid sign
  if ((month === 12 && day >= 24) || (month === 1 && day <= 20)) return 'Birch';
  if ((month === 1 && day >= 21) || (month === 2 && day <= 17)) return 'Rowan';
  if ((month === 2 && day >= 18) || (month === 3 && day <= 17)) return 'Ash';
  if ((month === 3 && day >= 18) || (month === 4 && day <= 14)) return 'Alder';
  if ((month === 4 && day >= 15) || (month === 5 && day <= 12)) return 'Willow';
  if ((month === 5 && day >= 13) || (month === 6 && day <= 9)) return 'Hawthorn';
  if ((month === 6 && day >= 10) || (month === 7 && day <= 7)) return 'Oak';
  if ((month === 7 && day >= 8) || (month === 8 && day <= 4)) return 'Holly';
  if ((month === 8 && day >= 5) || (month === 9 && day <= 1)) return 'Hazel';
  if ((month === 9 && day >= 2) || (month === 9 && day <= 29)) return 'Vine';
  if ((month === 9 && day >= 30) || (month === 10 && day <= 27)) return 'Ivy';
  if ((month === 10 && day >= 28) || (month === 11 && day <= 24)) return 'Reed';
  if ((month === 11 && day >= 25) || (month === 12 && day <= 23)) return 'Elder';

  return 'Birch'; // fallback
};

// Birth year to chinese animal calculation
const calculateChineseAnimal = (birthYear: number): string => {
  const animals = [
    'Rat',
    'Ox',
    'Tiger',
    'Rabbit',
    'Dragon',
    'Snake',
    'Horse',
    'Goat',
    'Monkey',
    'Rooster',
    'Dog',
    'Pig',
  ];
  const baseYear = 1900; // Year of the Rat
  const yearIndex = (birthYear - baseYear) % 12;
  return animals[yearIndex];
};

export default function DruidScreen() {
  const segments = useSegments();
  const currentTab = segments[1] || 'druid';
  const { mode } = useLocalSearchParams();
  const { user } = useUserStore();

  // Toggle between Druid and Chinese modes
  const [activeMode, setActiveMode] = useState<'druid' | 'chinese'>((mode as 'druid' | 'chinese') || 'druid');

  // Calculate user's signs
  const userBirthDate = user?.birth_date ? new Date(user.birth_date) : new Date();
  const userBirthYear = userBirthDate.getFullYear();
  const userDruidSign = calculateDruidSign(userBirthDate);
  const userChineseAnimal = calculateChineseAnimal(userBirthYear);

  // Get content based on mode
  const currentContent =
    activeMode === 'druid'
      ? druidData.find((item: { sign: string }) => item.sign === userDruidSign)
      : chineseData.find((item: { animal: string }) => item.animal === userChineseAnimal);

  const handleTabPress = (tab: string) => {
    if (tab === 'compat') {
      router.push('/(tabs)/compat');
    } else {
      router.push(`/(tabs)/${tab}`);
    }
  };

  const handleModeChange = (newMode: 'druid' | 'chinese') => {
    setActiveMode(newMode);
  };

  if (!currentContent) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
            <View style={styles.loadingContent}>
              <Text style={styles.title}>Ancient Wisdom</Text>
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
              <Text style={styles.title}>Ancient Wisdom</Text>
              <Text style={styles.subtitle}>Discover your deeper nature</Text>
            </View>

            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <Pressable
                style={[styles.modeButton, activeMode === 'druid' && styles.activeModeButton]}
                onPress={() => handleModeChange('druid')}
              >
                <Text style={[styles.modeButtonText, activeMode === 'druid' && styles.activeModeButtonText]}>
                  🌳 Celtic Druid
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modeButton, activeMode === 'chinese' && styles.activeModeButton]}
                onPress={() => handleModeChange('chinese')}
              >
                <Text style={[styles.modeButtonText, activeMode === 'chinese' && styles.activeModeButtonText]}>
                  🐉 Chinese Zodiac
                </Text>
              </Pressable>
            </View>

            {/* Sign Display */}
            <View style={styles.signCard}>
              <View style={styles.signHeader}>
                <View style={styles.signIconContainer}>
                  <Text style={styles.signIcon}>
                    {activeMode === 'druid' ? '🌿' : getChineseEmoji(userChineseAnimal)}
                  </Text>
                </View>
                <View style={styles.signInfo}>
                  <Text style={styles.signTitle}>{activeMode === 'druid' ? userDruidSign : userChineseAnimal}</Text>
                  <Text style={styles.dateRange}>
                    {activeMode === 'druid' ? currentContent.range : `Year ${userBirthYear}`}
                  </Text>
                  {activeMode === 'chinese' && (
                    <Text style={styles.element}>Element: {getChineseElement(userBirthYear)}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Content */}
            <View style={styles.contentCard}>
              <Text style={styles.cardTitle}>
                Your {activeMode === 'druid' ? 'Celtic Tree' : 'Chinese Animal'} Reading
              </Text>
              <Text style={styles.description}>{currentContent.text}</Text>
            </View>

            {/* Additional Info for Chinese */}
            {activeMode === 'chinese' && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Compatible Years</Text>
                <Text style={styles.infoText}>
                  Other {userChineseAnimal} years: {currentContent.years?.join(', ')}
                </Text>
              </View>
            )}

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </LinearGradient>

        <BottomNav activeTab={currentTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaProvider>
  );
}

// Helper functions
const getChineseEmoji = (animal: string): string => {
  const emojis: { [key: string]: string } = {
    Rat: '🐭',
    Ox: '🐂',
    Tiger: '🐅',
    Rabbit: '🐰',
    Dragon: '🐉',
    Snake: '🐍',
    Horse: '🐎',
    Goat: '🐐',
    Monkey: '🐵',
    Rooster: '🐓',
    Dog: '🐕',
    Pig: '🐷',
  };
  return emojis[animal] || '🐭';
};

const getChineseElement = (year: number): string => {
  const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
  const elementIndex = Math.floor(((year - 1900) % 10) / 2);
  return elements[elementIndex];
};

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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: 4,
    marginBottom: Layout.sectionSpacing,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Layout.cardRadius - 4,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: Colors.primary,
  },
  modeButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeModeButtonText: {
    color: Colors.text.primary,
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
  },
  signIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '20',
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
  element: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  contentCard: {
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
  description: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
  },
  infoText: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    lineHeight: 20,
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
