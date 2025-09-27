import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';

interface BottomNavProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const fabScale = useSharedValue(1);

  // Get screen dimensions for responsive design
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375; // iPhone SE and similar
  const isLargeScreen = screenWidth > 414; // iPhone Pro Max and similar

  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'traits', label: 'Traits' },
    { id: 'compat', label: isSmallScreen ? 'Match' : 'Compatibility' },
    { id: 'druid', label: 'Druid' },
    { id: 'profile', label: 'Profile' },
  ];

  // Use exact specs from DESIGN_REVIEW.md (64dp FAB, 80dp nav height)
  const responsiveFabSize = Layout.fabSize; // 64dp
  const responsiveNavHeight = Layout.navbarHeight; // 80dp
  const responsiveFontSize = isSmallScreen ? 10 : isLargeScreen ? 13 : 12;
  const responsiveIconSize = isSmallScreen ? 28 : isLargeScreen ? 36 : 32;

  const centerFabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Top hairline */}
      <View style={styles.hairline} />

      <View style={[styles.tabBar, { height: responsiveNavHeight }]}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCenter = index === 2; // Center FAB (Compatibility)

          if (isCenter) {
            return (
              <View key={tab.id} style={styles.centerContainer}>
                <Animated.View style={centerFabAnimatedStyle}>
                  <Pressable
                    style={[
                      styles.centerFab,
                      {
                        width: responsiveFabSize,
                        height: responsiveFabSize,
                        borderRadius: responsiveFabSize / 2,
                      },
                    ]}
                    onPressIn={() => {
                      fabScale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
                    }}
                    onPressOut={() => {
                      fabScale.value = withSpring(1, { damping: 15, stiffness: 400 });
                    }}
                    onPress={() => onTabPress(tab.id)}
                    accessibilityLabel="Compatibility"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.centerIcon, { fontSize: responsiveIconSize }]}>🫰🏼</Text>
                  </Pressable>
                </Animated.View>
                <Text
                  style={[
                    styles.centerLabel,
                    {
                      color: isActive ? Colors.primary : Colors.iconInactive,
                      fontSize: responsiveFontSize,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            );
          }

          // Side tabs with proper animations
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.sideTab}
              onPress={() => onTabPress(tab.id)}
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              activeOpacity={0.7}
            >
              {/* Active pill background */}
              <Animated.View
                style={[
                  styles.activePill,
                  useAnimatedStyle(() => ({
                    opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
                    transform: [{ scale: withSpring(isActive ? 1 : 0.8, { damping: 15, stiffness: 200 }) }],
                  })),
                ]}
              />

              {/* Tab label */}
              <Animated.Text
                style={[
                  styles.tabLabel,
                  { fontSize: responsiveFontSize },
                  {
                    color: isActive ? Colors.primary : Colors.iconInactive,
                    transform: [{ scale: withSpring(isActive ? 1.05 : 1, { damping: 15, stiffness: 300 }) }],
                  },
                ]}
              >
                {tab.label}
              </Animated.Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  hairline: {
    height: Layout.dividerHeight,
    backgroundColor: Colors.outline,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
  },
  sideTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    minHeight: 48,
    paddingVertical: Spacing.sm,
  },
  activePill: {
    position: 'absolute',
    width: Layout.activePillWidth, // 56dp
    height: Layout.activePillHeight, // 32dp
    backgroundColor: Colors.activePill,
    borderRadius: Layout.activePillHeight / 2, // 16dp
  },
  tabLabel: {
    ...Typography.labelSmall,
    fontWeight: '600',
    zIndex: 1,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
  },
  centerFab: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: Layout.fabElevation, // -16dp from theme
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  centerIcon: {
    color: 'white',
  },
  centerLabel: {
    ...Typography.labelSmall,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    position: 'absolute',
    bottom: Spacing.sm,
  },
});
