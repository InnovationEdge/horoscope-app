import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable } from 'react-native';
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
    { id: 'compat', label: 'Compatibility' }, // Center FAB with label
    { id: 'druid', label: 'Druid' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Top hairline */}
      <View style={styles.hairline} />

      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCenter = index === 2; // Center FAB (Compatibility)

          if (isCenter) {
            return (
              <View key={tab.id} style={styles.centerContainer} pointerEvents="box-none">
                <Pressable
                  style={({ pressed }) => [
                    styles.centerFab,
                    pressed && styles.centerFabPressed
                  ]}
                  onPress={() => onTabPress(tab.id)}
                  accessibilityLabel="Compatibility"
                  accessibilityRole="button"
                >
                  <Text style={styles.centerIcon}>🫰🏼</Text>
                </Pressable>
                <Text style={styles.centerLabel}>{tab.label}</Text>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.sideTab}
              onPress={() => onTabPress(tab.id)}
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              {isActive && <View style={styles.activePill} />}
              <Text style={[
                styles.tabLabel,
                { color: isActive ? Colors.primary : Colors.iconInactive }
              ]}>
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
  hairline: {
    height: Layout.dividerHeight,
    backgroundColor: Colors.outline,
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
    minHeight: 48, // Accessibility touch target
  },
  activePill: {
    position: 'absolute',
    width: Layout.activePillWidth,
    height: Layout.activePillHeight,
    backgroundColor: Colors.activePill,
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
    justifyContent: 'flex-end',
    position: 'relative',
    height: '100%',
    paddingBottom: 8,
  },
  centerFab: {
    width: Layout.fabSize,
    height: Layout.fabSize,
    borderRadius: Layout.fabSize / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -16, // Float 16dp above the tab bar
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  centerFabPressed: {
    transform: [{ scale: 0.96 }],
  },
  centerIcon: {
    fontSize: 32, // 🫰🏼 icon size
    color: 'white',
  },
  centerLabel: {
    ...Typography.labelSmall,
    fontSize: 11,
    color: Colors.iconInactive,
    marginTop: 8,
  },
});