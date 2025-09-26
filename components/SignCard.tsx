import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout, Typography, Shadows } from '../constants/theme';
import { Strings } from '../constants/strings';
import { ZODIAC_SIGNS, ZodiacSign } from '../constants/signs';

interface SignCardProps {
  sign: ZodiacSign;
  isPremium: boolean;
}

export function SignCard({ sign, isPremium }: SignCardProps) {
  const signData = ZODIAC_SIGNS[sign];
  const accentColor = signData.accent;

  return (
    <View style={[styles.container, Shadows.card]}>
      <View style={styles.content}>
        {/* Left: Avatar */}
        <View style={[styles.avatar, { backgroundColor: `${accentColor}33` }]}>
          <Text style={styles.emoji}>{signData.emoji}</Text>
        </View>

        {/* Right: Sign info */}
        <View style={styles.signInfo}>
          <Text style={styles.signName}>{signData.name}</Text>
          <Text style={styles.dateRange}>{signData.dateRange}</Text>
        </View>

        {/* Premium chip (top-right) */}
        {isPremium && (
          <View style={styles.premiumChip}>
            <Text style={styles.premiumText}>
              {Strings.premium} {Strings.premiumStar}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Layout.zodiacCardHeight,
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    marginTop: Layout.sectionSpacing,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.sectionSpacing,
    position: 'relative',
  },
  avatar: {
    width: Layout.zodiacAvatar,
    height: Layout.zodiacAvatar,
    borderRadius: Layout.zodiacAvatar / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: Layout.emojiSize,
  },
  signInfo: {
    flex: 1,
    marginLeft: Layout.sectionSpacing,
    justifyContent: 'center',
  },
  signName: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
  },
  dateRange: {
    ...Typography.labelSmall,
    color: Colors.text.secondary,
    opacity: 0.7,
    marginTop: 2,
  },
  premiumChip: {
    position: 'absolute',
    top: Layout.sectionSpacing,
    right: Layout.sectionSpacing,
    height: Layout.premiumChipHeight,
    borderRadius: Layout.premiumChipRadius,
    paddingHorizontal: Layout.premiumChipPadding,
    backgroundColor: '#EADDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: {
    ...Typography.labelSmall,
    color: '#21005D',
  },
});