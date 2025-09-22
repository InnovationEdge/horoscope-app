import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { ZODIAC_SIGNS } from '../../constants/zodiac';
import { DailyHoroscope } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentSign] = useState('Aries'); // This would come from user preferences
  const [dailyHoroscope, setDailyHoroscope] = useState<DailyHoroscope | null>(null);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    setDailyHoroscope({
      date: new Date().toISOString().split('T')[0],
      zodiac_sign: currentSign,
      prediction: "Today brings exciting opportunities for growth and new beginnings. Your natural leadership qualities will shine, and others will look to you for guidance. Trust your instincts and take bold actions.",
      lucky_number: 7,
      lucky_color: "Red",
      love_score: 8,
      career_score: 9,
      health_score: 7,
      mood: "Confident",
      compatibility_sign: "Leo"
    });
  }, [currentSign]);

  const currentZodiac = ZODIAC_SIGNS.find(sign => sign.name === currentSign);

  const renderScoreCard = (title: string, score: number, icon: string) => (
    <View style={styles.scoreCard}>
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
      <Text style={styles.scoreTitle}>{title}</Text>
      <View style={styles.scoreBar}>
        <View style={[styles.scoreBarFill, { width: `${score * 10}%` }]} />
      </View>
      <Text style={styles.scoreText}>{score}/10</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Gradient */}
      <LinearGradient
        colors={Colors.gradientCosmic}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! ✨</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</Text>
        </View>
      </LinearGradient>

      {/* Zodiac Sign Card */}
      <View style={styles.zodiacCard}>
        <View style={styles.zodiacHeader}>
          <Text style={styles.zodiacEmoji}>{currentZodiac?.emoji}</Text>
          <View>
            <Text style={styles.zodiacName}>{currentZodiac?.name}</Text>
            <Text style={styles.zodiacDates}>{currentZodiac?.dates}</Text>
          </View>
          <TouchableOpacity style={styles.premiumBadge}>
            <Ionicons name="star" size={16} color={Colors.premium} />
            <Text style={styles.premiumText}>Premium</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Horoscope */}
      {dailyHoroscope && (
        <View style={styles.horoscopeCard}>
          <Text style={styles.cardTitle}>Today's Horoscope</Text>
          <Text style={styles.horoscopeText}>{dailyHoroscope.prediction}</Text>

          <View style={styles.luckyInfo}>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>Lucky Number</Text>
              <Text style={styles.luckyValue}>{dailyHoroscope.lucky_number}</Text>
            </View>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>Lucky Color</Text>
              <Text style={styles.luckyValue}>{dailyHoroscope.lucky_color}</Text>
            </View>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>Mood</Text>
              <Text style={styles.luckyValue}>{dailyHoroscope.mood}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Life Scores */}
      <View style={styles.scoresCard}>
        <Text style={styles.cardTitle}>Life Aspects</Text>
        <View style={styles.scoresGrid}>
          {renderScoreCard('Love', dailyHoroscope?.love_score || 0, 'heart')}
          {renderScoreCard('Career', dailyHoroscope?.career_score || 0, 'briefcase')}
          {renderScoreCard('Health', dailyHoroscope?.health_score || 0, 'fitness')}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Explore More</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Compatibility</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="globe" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Birth Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="star" size={24} color={Colors.premium} />
            <Text style={styles.actionText}>Premium</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  zodiacCard: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zodiacHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zodiacEmoji: {
    fontSize: 40,
  },
  zodiacName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  zodiacDates: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.premium,
  },
  premiumText: {
    color: Colors.premium,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  horoscopeCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  luckyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  luckyItem: {
    alignItems: 'center',
  },
  luckyLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 5,
  },
  luckyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scoresCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreCard: {
    alignItems: 'center',
    flex: 1,
  },
  scoreTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 5,
    marginBottom: 10,
  },
  scoreBar: {
    width: 60,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 5,
  },
  actionsCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 15,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
});