import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

interface YearlyMajorEvents {
  spring: string;
  summer: string;
  autumn: string;
  winter: string;
}

interface YearlyMajorEventsProps {
  majorEvents: YearlyMajorEvents;
}

const seasonIcons = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

const seasonLabels = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

export function YearlyMajorEvents({ majorEvents }: YearlyMajorEventsProps) {
  return (
    <View style={styles.container}>
      {Object.entries(majorEvents).map(([season, event]) => (
        <View key={season} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {seasonIcons[season as keyof typeof seasonIcons]} {seasonLabels[season as keyof typeof seasonLabels]}
          </Text>
          <Text style={styles.sectionContent}>{event}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.labelMedium,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  sectionContent: {
    ...Typography.bodySmall,
    color: Colors.text.primary,
    lineHeight: 18,
  },
});