import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ZODIAC_SIGNS } from '../../constants/signs';
import { BottomNav } from '../../components/BottomNav';
import { router, useSegments } from 'expo-router';
import { useUserStore } from '../../store/user';
import { authService } from '../../services/auth';

export default function ProfileScreen() {
  const segments = useSegments();
  const currentTab = segments[1] || 'profile';
  const { user } = useUserStore();

  const handleTabPress = (tab: string) => {
    if (tab === 'compat') {
      router.push('/(tabs)/compat');
    } else {
      router.push(`/(tabs)/${tab}` as never);
    }
  };

  const handleEditProfile = () => {
    // Navigate to profile editing
    console.log('Edit profile');
  };

  const handleSubscription = () => {
    router.push('/paywall?src=profile');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userSign = user?.sign || 'aries';
  const signData = ZODIAC_SIGNS[userSign];

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
              <Text style={styles.title}>Profile</Text>
              <Text style={styles.subtitle}>Your cosmic identity</Text>
            </View>

            {/* User Card */}
            <View style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={[styles.signIconContainer, { backgroundColor: signData.accent + '20' }]}>
                  <Text style={styles.signIcon}>{signData.emoji}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user?.name || 'Astrology Enthusiast'}</Text>
                  <Text style={styles.userSign}>{signData.name}</Text>
                  <Text style={styles.userDate}>
                    {user?.birth_date ? new Date(user.birth_date).toLocaleDateString() : 'Birthday not set'}
                  </Text>
                </View>
                <Pressable style={styles.editButton} onPress={handleEditProfile}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsCard}>
              <Text style={styles.cardTitle}>Your Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>7</Text>
                  <Text style={styles.statLabel}>Days Active</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>23</Text>
                  <Text style={styles.statLabel}>Horoscopes Read</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Compatibility Checks</Text>
                </View>
              </View>
            </View>

            {/* Subscription Status */}
            <View style={styles.subscriptionCard}>
              <Text style={styles.cardTitle}>Premium Status</Text>
              <View style={styles.subscriptionInfo}>
                <Text style={styles.subscriptionStatus}>Free Plan</Text>
                <Text style={styles.subscriptionDescription}>
                  Upgrade to Premium for unlimited access to detailed horoscopes and compatibility reports
                </Text>
                <Pressable style={styles.upgradeButton} onPress={handleSubscription}>
                  <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                </Pressable>
              </View>
            </View>

            {/* Settings */}
            <View style={styles.settingsCard}>
              <Text style={styles.cardTitle}>Settings</Text>
              <View style={styles.settingsList}>
                <Pressable style={styles.settingItem}>
                  <Text style={styles.settingText}>🔔 Notifications</Text>
                  <Text style={styles.settingValue}>On</Text>
                </Pressable>
                <Pressable style={styles.settingItem}>
                  <Text style={styles.settingText}>🌙 Theme</Text>
                  <Text style={styles.settingValue}>Dark</Text>
                </Pressable>
                <Pressable style={styles.settingItem}>
                  <Text style={styles.settingText}>📧 Email Updates</Text>
                  <Text style={styles.settingValue}>Weekly</Text>
                </Pressable>
                <Pressable style={styles.settingItem}>
                  <Text style={styles.settingText}>🔒 Privacy</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </Pressable>
                <Pressable style={styles.settingItem} onPress={handleLogout}>
                  <Text style={[styles.settingText, { color: '#E74C3C' }]}>🚪 Sign Out</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </Pressable>
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
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  signIcon: {
    fontSize: 36,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  userSign: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    fontSize: 16,
    marginBottom: 2,
  },
  userDate: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + '20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  editButtonText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
  },
  subscriptionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
  },
  subscriptionInfo: {
    alignItems: 'center',
  },
  subscriptionStatus: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  subscriptionDescription: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Layout.cardRadius,
  },
  upgradeButtonText: {
    ...Typography.titleMedium,
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    marginBottom: Layout.sectionSpacing,
  },
  settingsList: {
    gap: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
  },
  settingText: {
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    fontSize: 16,
  },
  settingValue: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    fontSize: 14,
  },
  settingArrow: {
    ...Typography.titleMedium,
    color: Colors.text.secondary,
    fontSize: 18,
  },
  bottomSpacing: {
    height: Layout.navbarHeight + 40,
  },
});
