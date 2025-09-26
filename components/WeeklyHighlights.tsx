import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

interface WeeklyHighlights {
  bestDays: string[];
  challenges: string[];
  opportunities: string[];
  advice: string;
}

interface WeeklyHighlightsProps {
  highlights: WeeklyHighlights;
}

export function WeeklyHighlights({ highlights }: WeeklyHighlightsProps) {
  return (
    <View style={styles.container}>
      {highlights.bestDays.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Best Days</Text>
          <Text style={styles.sectionContent}>{highlights.bestDays.join(', ')}</Text>
        </View>
      )}

      {highlights.opportunities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Opportunities</Text>
          <Text style={styles.sectionContent}>{highlights.opportunities.join(' • ')}</Text>
        </View>
      )}

      {highlights.advice && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Key Advice</Text>
          <Text style={styles.sectionContent}>{highlights.advice}</Text>
        </View>
      )}
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