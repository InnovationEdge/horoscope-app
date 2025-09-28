/**
 * Analytics Dashboard Component for Admin/Debug Use
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Layout, Spacing } from '../constants/theme';
import { storageService } from '../services/storage';

interface AnalyticsData {
  screenViews: Record<string, number>;
  userEngagement: {
    totalSessions: number;
    averageSessionTime: number;
    dailyActiveUsers: number;
  };
  featureUsage: {
    horoscopeReads: number;
    compatibilityChecks: number;
    premiumConversions: number;
    notificationsEnabled: number;
  };
  performance: {
    cacheHitRate: number;
    offlineQueueSize: number;
    storageUsage: number;
  };
}

interface DebugSettings {
  enableDebugMode: boolean;
  showPerformanceMetrics: boolean;
  enableAnalyticsLogging: boolean;
  mockPremiumStatus: boolean;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [debugSettings, setDebugSettings] = useState<DebugSettings>({
    enableDebugMode: false,
    showPerformanceMetrics: false,
    enableAnalyticsLogging: false,
    mockPremiumStatus: false,
  });
  const [storageStats, setStorageStats] = useState({
    cacheSize: 0,
    queueSize: 0,
    totalItems: 0,
  });

  useEffect(() => {
    loadAnalyticsData();
    loadStorageStats();
  }, []);

  const loadAnalyticsData = async () => {
    // In a real implementation, this would fetch from your analytics backend
    // For demo, we'll use mock data
    const mockData: AnalyticsData = {
      screenViews: {
        today: 1250,
        traits: 890,
        compatibility: 650,
        druid: 420,
        profile: 380,
        paywall: 150,
      },
      userEngagement: {
        totalSessions: 2840,
        averageSessionTime: 4.2, // minutes
        dailyActiveUsers: 850,
      },
      featureUsage: {
        horoscopeReads: 3200,
        compatibilityChecks: 650,
        premiumConversions: 45,
        notificationsEnabled: 720,
      },
      performance: {
        cacheHitRate: 87.5,
        offlineQueueSize: 12,
        storageUsage: 2.4, // MB
      },
    };

    setAnalyticsData(mockData);
  };

  const loadStorageStats = async () => {
    try {
      const stats = await storageService.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearCache();
            await loadStorageStats();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      const data = await storageService.exportUserData();
      if (data) {
        Alert.alert('Export Complete', 'User data exported to clipboard');
        // In a real app, you'd share this data
        console.log('Exported data:', data.substring(0, 100) + '...');
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export user data');
    }
  };

  const resetApp = async () => {
    Alert.alert(
      'Reset App',
      'This will clear ALL app data including preferences. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearUserData();
            await storageService.clearCache();
            Alert.alert('Reset Complete', 'App has been reset');
          },
        },
      ]
    );
  };

  if (!analyticsData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[Colors.bgTop, Colors.bgBot]}
        style={styles.gradient}
      >
        <Text style={styles.title}>Analytics Dashboard</Text>

        {/* Screen Views */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Screen Views (Last 7 Days)</Text>
          {Object.entries(analyticsData.screenViews).map(([screen, views]) => (
            <View key={screen} style={styles.statRow}>
              <Text style={styles.statLabel}>{screen.charAt(0).toUpperCase() + screen.slice(1)}</Text>
              <Text style={styles.statValue}>{views.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* User Engagement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Engagement</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{analyticsData.userEngagement.totalSessions.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Avg Session Time</Text>
            <Text style={styles.statValue}>{analyticsData.userEngagement.averageSessionTime}m</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Daily Active Users</Text>
            <Text style={styles.statValue}>{analyticsData.userEngagement.dailyActiveUsers.toLocaleString()}</Text>
          </View>
        </View>

        {/* Feature Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Usage</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Horoscope Reads</Text>
            <Text style={styles.statValue}>{analyticsData.featureUsage.horoscopeReads.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Compatibility Checks</Text>
            <Text style={styles.statValue}>{analyticsData.featureUsage.compatibilityChecks.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Premium Conversions</Text>
            <Text style={styles.statValue}>{analyticsData.featureUsage.premiumConversions}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Notifications Enabled</Text>
            <Text style={styles.statValue}>{analyticsData.featureUsage.notificationsEnabled}</Text>
          </View>
        </View>

        {/* Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Cache Hit Rate</Text>
            <Text style={styles.statValue}>{analyticsData.performance.cacheHitRate}%</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Offline Queue Size</Text>
            <Text style={styles.statValue}>{storageStats.queueSize}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Storage Usage</Text>
            <Text style={styles.statValue}>{(storageStats.cacheSize / 1024 / 1024).toFixed(2)} MB</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Storage Items</Text>
            <Text style={styles.statValue}>{storageStats.totalItems}</Text>
          </View>
        </View>

        {/* Debug Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Debug Mode</Text>
            <Switch
              value={debugSettings.enableDebugMode}
              onValueChange={(value) =>
                setDebugSettings(prev => ({ ...prev, enableDebugMode: value }))
              }
              trackColor={{ false: Colors.outline, true: Colors.primary }}
              thumbColor={debugSettings.enableDebugMode ? Colors.gold : Colors.iconInactive}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Show Performance Metrics</Text>
            <Switch
              value={debugSettings.showPerformanceMetrics}
              onValueChange={(value) =>
                setDebugSettings(prev => ({ ...prev, showPerformanceMetrics: value }))
              }
              trackColor={{ false: Colors.outline, true: Colors.primary }}
              thumbColor={debugSettings.showPerformanceMetrics ? Colors.gold : Colors.iconInactive}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Analytics Logging</Text>
            <Switch
              value={debugSettings.enableAnalyticsLogging}
              onValueChange={(value) =>
                setDebugSettings(prev => ({ ...prev, enableAnalyticsLogging: value }))
              }
              trackColor={{ false: Colors.outline, true: Colors.primary }}
              thumbColor={debugSettings.enableAnalyticsLogging ? Colors.gold : Colors.iconInactive}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Mock Premium Status</Text>
            <Switch
              value={debugSettings.mockPremiumStatus}
              onValueChange={(value) =>
                setDebugSettings(prev => ({ ...prev, mockPremiumStatus: value }))
              }
              trackColor={{ false: Colors.outline, true: Colors.primary }}
              thumbColor={debugSettings.mockPremiumStatus ? Colors.gold : Colors.iconInactive}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <Pressable style={styles.actionButton} onPress={clearCache}>
            <Text style={styles.actionButtonText}>Clear Cache</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={exportData}>
            <Text style={styles.actionButtonText}>Export User Data</Text>
          </Pressable>

          <Pressable style={[styles.actionButton, styles.dangerButton]} onPress={resetApp}>
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Reset App</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgTop,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgTop,
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
  },
  gradient: {
    padding: Spacing.lg,
    minHeight: '100%',
  },
  title: {
    ...Typography.displayLarge,
    color: Colors.textPri,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.textPri,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  statLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSec,
    flex: 1,
  },
  statValue: {
    ...Typography.bodyMedium,
    color: Colors.textPri,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  settingLabel: {
    ...Typography.bodyMedium,
    color: Colors.textPri,
    flex: 1,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.buttonRadius,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  actionButtonText: {
    ...Typography.titleMedium,
    color: 'white',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
  },
  dangerButtonText: {
    color: 'white',
  },
});