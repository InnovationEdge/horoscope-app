import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout, Typography, Spacing } from '../constants/theme';

export interface LifeAspect {
  score: number;
  text: string;
}

export interface LifeAspectsData {
  love: LifeAspect;
  career: LifeAspect;
  health: LifeAspect;
}

interface LifeAspectsProps {
  data: LifeAspectsData;
}

interface AspectItemProps {
  icon: string;
  label: string;
  aspect: LifeAspect;
}

function StarRating({ score }: { score: number }) {
  // Convert score 0-100 to stars 0-5 (rounded)
  const stars = Math.round((score / 100) * 5);

  return (
    <View style={styles.starsContainer}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <Text
            key={starNumber}
            style={[
              styles.star,
              { color: starNumber <= stars ? Colors.gold : Colors.iconInactive }
            ]}
          >
            ★
          </Text>
        ))}
      </View>
      <Text style={styles.scoreText}>{stars}/5</Text>
    </View>
  );
}

function AspectItem({ icon, label, aspect }: AspectItemProps) {
  return (
    <View style={styles.aspectColumn}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.label}>{label}</Text>

      <StarRating score={aspect.score} />
    </View>
  );
}

export function LifeAspects({ data }: LifeAspectsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Life Aspects</Text>

      <View style={styles.aspectsGrid}>
        <AspectItem
          icon="💖"
          label="Love"
          aspect={data.love}
        />

        <AspectItem
          icon="💼"
          label="Career"
          aspect={data.career}
        />

        <AspectItem
          icon="💪"
          label="Health"
          aspect={data.health}
        />
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
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
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
    fontSize: 16,
    marginHorizontal: 1,
  },
  scoreText: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    fontSize: 12,
  },
});