import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout, Spacing, Sizes, Radius } from '../constants/theme';

export interface LifeAspectsScores {
  love: number;
  career: number;
  health: number;
}

export interface LifeAspectsData {
  love: {
    score: number;
    text: string;
  };
  career: {
    score: number;
    text: string;
  };
  health: {
    score: number;
    text: string;
  };
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
  // Convert score 0-100 to stars 0-5 (per DESIGN_REVIEW.md)
  const stars = Math.round(score / 20);

  return (
    <View style={styles.starsContainer}>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(starNumber => (
          <Text key={starNumber} style={[styles.star, { color: starNumber <= stars ? Colors.gold : Colors.inactive }]}>
            ★
          </Text>
        ))}
      </View>
      <Text style={styles.scoreText}>{Math.round(score/10)}/10</Text>
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
        <AspectItem icon="❤️" label="Love" score={scores.love || 0} />

        <AspectItem icon="💼" label="Career" score={scores.career || 0} />

        <AspectItem icon="🩺" label="Health" score={scores.health || 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.block,
  },
  sectionTitle: {
    fontSize: Sizes.title,
    color: Colors.textPri,
    marginBottom: 8,
    fontWeight: '700',
  },
  aspectsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.cardPad,
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
    marginBottom: 6,
  },
  icon: {
    fontSize: Layout.aspectEmojiSize,
  },
  label: {
    fontSize: Sizes.body,
    color: Colors.textPri,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  starsContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  star: {
    fontSize: Sizes.star,
    marginHorizontal: 1,
  },
  scoreText: {
    fontSize: Sizes.label,
    color: Colors.textPri,
    fontWeight: '600',
  },
});
