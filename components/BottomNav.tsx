import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'traits', label: 'Traits' },
    { id: 'compat', label: '' }, // Center FAB
    { id: 'druid', label: 'Druid' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCenter = index === 2; // Center FAB

          if (isCenter) {
            return (
              <View key={tab.id} style={styles.centerContainer} pointerEvents="box-none">
                <TouchableOpacity
                  style={styles.centerFab}
                  onPress={() => onTabPress(tab.id)}
                >
                  <Text style={styles.centerIcon}>🔮</Text>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.sideTab}
              onPress={() => onTabPress(tab.id)}
            >
              {isActive && <View style={styles.activePill} />}
              <Text style={[styles.tabLabel, { color: isActive ? Colors.primary : Colors.text.secondary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
  },
  tabBar: {
    flexDirection: 'row',
    height: Layout.navbarHeight,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  sideTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  activePill: {
    position: 'absolute',
    width: 56,
    height: 32,
    backgroundColor: Colors.primary + '20',
    borderRadius: 16,
    top: '50%',
    marginTop: -16,
  },
  tabLabel: {
    ...Typography.labelSmall,
    fontSize: 11,
    zIndex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  centerFab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -16, // Positioned 16dp above the tab bar
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  centerIcon: {
    fontSize: 24,
  },
});