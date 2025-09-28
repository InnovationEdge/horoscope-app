import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, Spacing, Radius } from '../constants/theme';

interface BottomNavProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function BottomNav({ state, navigation }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const fabScale = useSharedValue(1);
  const pillOpacity = useSharedValue(1);
  const pillScale = useSharedValue(1);

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

  const activeTab = state?.routes?.[state?.index]?.name || 'today';

  // Use exact specs from DESIGN_REVIEW.md (64dp FAB, 80dp nav height)
  const responsiveFabSize = 64; // 64dp
  const responsiveNavHeight = 80; // 80dp
  const responsiveFontSize = isSmallScreen ? 10 : isLargeScreen ? 13 : 12;

  const centerFabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
    transform: [{ scale: pillScale.value }],
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
                    onPress={() => navigation?.navigate?.(tab.id)}
                    accessibilityLabel="Compatibility"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.centerIcon, { fontSize: 32 }]}>🫰🏼</Text>
                  </Pressable>
                </Animated.View>
                <Text
                  style={[
                    styles.centerLabel,
                    {
                      color: isActive ? Colors.accent : Colors.inactive,
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
              onPress={() => navigation?.navigate?.(tab.id)}
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              activeOpacity={0.7}
            >
              {/* Active pill background */}
              {isActive && (
                <Animated.View
                  style={[styles.activePill, pillAnimatedStyle]}
                />
              )}

              {/* Tab label */}
              <Text
                style={[
                  styles.tabLabel,
                  { fontSize: responsiveFontSize },
                  {
                    color: isActive ? Colors.accent : Colors.inactive,
                  },
                ]}
              >
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
    pointerEvents: 'box-none',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  hairline: {
    height: 1,
    backgroundColor: Colors.line,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.h,
    justifyContent: 'space-between',
    height: 80,
    pointerEvents: 'auto',
  },
  sideTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    minHeight: 48,
    paddingVertical: 6,
  },
  activePill: {
    position: 'absolute',
    width: 56,
    height: 32,
    backgroundColor: Colors.pill,
    borderRadius: Radius.pill,
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
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -16,
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
    bottom: 6,
  },
});
