import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Layout, Animation } from '../constants/theme';
import { Strings } from '../constants/strings';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  trackColor?: string;
}

export function ProgressBar({
  progress,
  color = Colors.primary,
  trackColor = Colors.outline
}: ProgressBarProps) {
  const animatedWidth = useSharedValue(0);

  React.useEffect(() => {
    animatedWidth.value = withTiming(progress, {
      duration: Animation.slow,
      easing: Easing.out(Easing.quad),
    });
  }, [progress, animatedWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View
      style={[styles.track, { backgroundColor: trackColor }]}
      accessibilityLabel={`${Math.round(progress)}${Strings.percent}`}
      accessibilityRole="progressbar"
    >
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: Layout.progressHeight,
    borderRadius: Layout.progressRadius,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Layout.progressRadius,
  },
});