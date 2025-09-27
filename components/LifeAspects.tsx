import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';

export interface LifeAspectsScores {
  love: number;
  career: number;
  health: number;
}

interface LifeAspectsProps {
  scores: LifeAspectsScores;
}

interface AspectItemProps {
  icon: string;
  label: string;
  score: number;
}

function StarRating({ score }: { score: number }) {
  // Convert score 1-10 to stars 0-5 (rounded)
  const stars = Math.round((score / 10) * 5);

  return (
    <View style={styles.starsContainer}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(starNumber => (
          <Text key={starNumber} style={[styles.star, { color: starNumber <= stars ? '#FFD700' : '#5C5C66' }]}>
            ★
          </Text>
        ))}
      </View>
      <Text style={styles.scoreText}>{score}/10</Text>
    </View>
  );
}

function AspectItem({ icon, label, score }: AspectItemProps) {
  return (
    <View style={styles.aspectColumn}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.label}>{label}</Text>

      <StarRating score={score} />
    </View>
  );
}

export function LifeAspects({ scores }: LifeAspectsProps) {
  // Defensive check to prevent crashes
  if (!scores || typeof scores !== 'object') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Life Aspects</Text>

      <View style={styles.aspectsGrid}>
        <AspectItem icon="💖" label="Love" score={scores.love || 0} />

        <AspectItem icon="💼" label="Career" score={scores.career || 0} />

        <AspectItem icon="💪" label="Health" score={scores.health || 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.sectionSpacing,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    fontSize: 18,
    fontWeight: '700',
  },
  aspectsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
  },
  aspectColumn: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: Layout.aspectIconSize,
    height: Layout.aspectIconSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: Layout.aspectEmojiSize,
  },
  label: {
    ...Typography.labelSmall,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  starsContainer: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  star: {
    fontSize: 18,
    marginHorizontal: 1,
  },
  scoreText: {
    ...Typography.labelSmall,
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
