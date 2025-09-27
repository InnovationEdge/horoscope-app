import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

interface ProgressBarTopProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBarTop({ currentStep, totalSteps }: ProgressBarTopProps) {
  const insets = useSafeAreaInsets();
  const progress = Math.min(Math.max(currentStep / totalSteps, 0), 1);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: 300 }),
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.outline,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
