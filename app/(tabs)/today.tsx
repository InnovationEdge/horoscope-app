import { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Spacing, Sizes, Radius } from '../../constants/theme';
import { ZODIAC_SIGNS } from '../../constants/signs';
import { HoroscopePager, HoroscopeData } from '../../components/HoroscopePager';
import { LifeAspects, LifeAspectsData } from '../../components/LifeAspects';
import { BannerCarousel, getDefaultBanners } from '../../components/BannerCarousel';
import { useSubscriptionStore } from '../../store/subscription';
import { useUserStore } from '../../store/user';
import { router } from 'expo-router';
import { track } from '../../services/analytics';

// Font clamping utility as provided by user
export const clampFont = (w: number, max = 48, min = 36) => Math.max(min, Math.min(max, Math.round(w / 10)));

// Import real horoscope data
const horoscopeData = require('../../content/horoscopes.json');

// Function to generate real horoscope data for a user's sign
const generateHoroscopeData = (userSign: string): HoroscopeData[] => {
  const dailyData = horoscopeData.daily[userSign];

  if (!dailyData) {
    // Fallback to aries if sign not found
    const fallbackData = horoscopeData.daily.aries;
    return [
      {
        timeframe: 'today' as const,
        preview: fallbackData.preview,
        full: fallbackData.full,
        lucky: {
          number: fallbackData.lucky.number,
          color: fallbackData.lucky.color,
          mood: fallbackData.lucky.mood,
        },
      },
      {
        timeframe: 'weekly' as const,
        preview: 'This week brings new opportunities and challenges. Focus on your goals and trust your instincts.',
        full: 'This week offers a blend of opportunities and growth experiences. Your natural traits will guide you through any challenges that arise.',
      },
      {
        timeframe: 'monthly' as const,
        preview: 'This month focuses on personal development and relationship growth.',
        full: 'This month brings significant opportunities for personal and professional development. Trust the process.',
      },
      {
        timeframe: 'yearly' as const,
        preview: 'This year marks a period of transformation and authentic self-expression.',
        full: 'This year brings profound transformation and the opportunity to express your authentic self.',
      },
    ];
  }

  return [
    {
      timeframe: 'today' as const,
      preview: dailyData.preview,
      full: dailyData.full,
      lucky: {
        number: dailyData.lucky.number,
        color: dailyData.lucky.color,
        mood: dailyData.lucky.mood,
      },
    },
    {
      timeframe: 'weekly' as const,
      preview: 'This week brings new opportunities aligned with your sign\'s energy. Focus on your natural strengths.',
      full: 'This week the cosmos highlights your unique qualities and presents opportunities that align with your natural energy patterns.',
    },
    {
      timeframe: 'monthly' as const,
      preview: 'This month focuses on growth and development in areas most important to your sign.',
      full: 'This month brings significant developments in the life areas that matter most to your zodiac sign.',
    },
    {
      timeframe: 'yearly' as const,
      preview: 'This year marks a significant period of growth and achievement for your sign.',
      full: 'This year the planetary alignments create powerful opportunities for growth and achievement in your life.',
    },
  ];
};

// Function to generate real life aspects based on user's sign
const generateLifeAspects = (userSign: string): LifeAspectsData => {
  const dailyData = horoscopeData.daily[userSign];

  if (!dailyData || !dailyData.scores) {
    // Fallback scores
    return {
      love: { score: 75, text: 'Your relationships are highlighted today with positive energy.' },
      career: { score: 80, text: 'Professional opportunities align with your goals.' },
      health: { score: 85, text: 'Energy levels are high and vitality is strong.' },
    };
  }

  return {
    love: {
      score: dailyData.scores.love * 10, // Convert to percentage
      text: 'Your relationships are highlighted today with positive energy.'
    },
    career: {
      score: dailyData.scores.career * 10,
      text: 'Professional opportunities align with your goals.'
    },
    health: {
      score: dailyData.scores.health * 10,
      text: 'Energy levels are high and vitality is strong.'
    },
  };
};


function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning ✨`;
  if (hour < 17) return `Good afternoon ☀️`;
  return `Good evening 🌙`;
}

function getCurrentDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  return now.toLocaleDateString('en-US', options);
}

export default function TodayScreen() {
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const { width } = useWindowDimensions();

  const { isPremium } = useSubscriptionStore();
  const { getUserSign } = useUserStore();

  const userSign = getUserSign() || 'aries';
  const signData = ZODIAC_SIGNS[userSign];
  const accentColor = signData.accent;

  // Generate real data based on user's sign
  const realHoroscopeData = generateHoroscopeData(userSign);
  const realLifeAspects = generateLifeAspects(userSign);

  const banners = getDefaultBanners();

  useEffect(() => {
    const updateContent = () => {
      setGreeting(getTimeBasedGreeting());
      setCurrentDate(getCurrentDate());
    };

    updateContent();
    const interval = setInterval(updateContent, 60000); // Update every minute

    // Track screen view
    track('screen_view', { name: 'today' });

    return () => clearInterval(interval);
  }, [track]);

  const handleReadMore = (timeframe: string) => {
    track('read_more_clicked', { timeframe });
  };

  const handlePaywallNeeded = (timeframe: string) => {
    track('paywall_shown', { trigger: timeframe });
    router.push(`/paywall?src=${timeframe}`);
  };

  const handlePagerSwiped = (to: string) => {
    track('today_pager_swiped', { to });
  };

  const handleBannerPress = (item: { id: string; target: string; premium_required?: boolean }) => {
    track('banner_clicked', { id: item.id, target: item.target });

    if (item.premium_required && !isPremium()) {
      track('paywall_shown', { trigger: `banner_${item.id}` });
      router.push(`/paywall?src=banner_${item.id}`);
    } else {
      // Handle deep link navigation based on target
      if (item.target.startsWith('traits:')) {
        const sign = item.target.split(':')[1];
        router.push(`/(tabs)/traits?sign=${sign}`);
      } else if (item.target.startsWith('compat:')) {
        const sign = item.target.split(':')[1];
        router.push(`/(tabs)/compat?with=${sign}`);
      } else if (item.target === 'druid') {
        router.push('/(tabs)/druid');
      } else if (item.target === 'chinese') {
        router.push('/(tabs)/druid?mode=chinese');
      } else {
        // Use type assertion for dynamic routes
        router.push((item.target as any) || ('/(tabs)/compat' as any));
      }
    }
  };


  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={[Colors.bgTop, Colors.bgBot]} style={styles.gradient}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Greeting Section with Font Clamping */}
            <View style={styles.greetingSection}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[
                  styles.greeting,
                  {
                    fontSize: clampFont(width),
                    lineHeight: clampFont(width) + 8,
                  },
                ]}
              >
                {greeting}
              </Text>
              <Text style={styles.date}>{currentDate}</Text>
            </View>

            {/* Zodiac Sign Card */}
            <View style={[styles.signCard, { borderColor: accentColor + '40' }]}>
              <View style={[styles.avatarContainer, { backgroundColor: accentColor + '20' }]}>
                <Text style={styles.avatarEmoji}>{signData.emoji}</Text>
              </View>
              <View style={styles.signInfo}>
                <Text style={styles.signName}>{signData.name}</Text>
                <Text style={styles.signDateRange}>{signData.dateRange}</Text>
              </View>
              {isPremium() && (
                <View style={styles.premiumChip}>
                  <Text style={styles.premiumChipText}>✨ Premium</Text>
                </View>
              )}
            </View>

            {/* Horoscope Pager */}
            <HoroscopePager
              data={realHoroscopeData}
              onReadMore={handleReadMore}
              onPaywallNeeded={handlePaywallNeeded}
              onPagerSwiped={handlePagerSwiped}
            />

            {/* Life Aspects */}
            <LifeAspects
              scores={{
                love: realLifeAspects.love.score,
                career: realLifeAspects.career.score,
                health: realLifeAspects.health.score,
              }}
            />

            {/* Banner Carousel */}
            <BannerCarousel banners={banners} onBannerPress={handleBannerPress} />

            {/* Bottom spacing for navbar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </LinearGradient>

      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.h,
    paddingTop: 60, // Account for status bar
  },
  greetingSection: {
    marginBottom: Spacing.block,
  },
  greeting: {
    color: Colors.textPri,
    marginBottom: 4,
    fontWeight: '300',
  },
  date: {
    fontSize: Sizes.body,
    color: Colors.textSec,
  },
  signCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.cardPad,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.block,
    height: 88,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  signInfo: {
    marginLeft: 8,
    flex: 1,
  },
  signName: {
    fontSize: Sizes.title,
    color: Colors.textPri,
  },
  signDateRange: {
    fontSize: 12,
    color: Colors.textSec,
    marginTop: 2,
  },
  premiumChip: {
    backgroundColor: Colors.premiumChip,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.chip,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumChipText: {
    fontSize: Sizes.label,
    color: Colors.accent,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 120, // Extra spacing for comfortable scrolling
  },
});
