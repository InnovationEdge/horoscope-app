import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

interface MonthlyThemes {
  primary: string;
  secondary: string;
  energy: string;
  focus: string[];
}

interface MonthlyThemesProps {
  themes: MonthlyThemes;
}

export function MonthlyThemes({ themes }: MonthlyThemesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Primary Theme</Text>
        <Text style={styles.sectionContent}>{themes.primary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Energy Level</Text>
        <Text style={styles.sectionContent}>{themes.energy}</Text>
      </View>

      {themes.focus.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Focus Areas</Text>
          <Text style={styles.sectionContent}>{themes.focus.join(' • ')}</Text>
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