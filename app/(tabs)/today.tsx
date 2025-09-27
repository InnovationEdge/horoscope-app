import { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Layout, Typography, Spacing } from '../../constants/theme';
import { ZODIAC_SIGNS } from '../../constants/signs';
import { HoroscopePager, HoroscopeData } from '../../components/HoroscopePager';
import { LifeAspects, LifeAspectsData } from '../../components/LifeAspects';
import { BannerCarousel, getDefaultBanners } from '../../components/BannerCarousel';
import { BottomNav } from '../../components/BottomNav';
import { useSubscriptionStore } from '../../store/subscription';
import { useUserStore } from '../../store/user';
import { router, useSegments } from 'expo-router';
import { track } from '../../services/analytics';

// Font clamping utility as provided by user
export const clampFont = (w: number, max = 48, min = 36) => Math.max(min, Math.min(max, Math.round(w / 10)));

// Mock data for horoscope with all required structures
const mockHoroscopeData: HoroscopeData[] = [
  {
    timeframe: 'today' as const,
    preview:
      'Today brings powerful energy for new beginnings, Aries. Your natural leadership shines as opportunities emerge in unexpected places. Trust your instincts when making important decisions, especially around midday. A conversation with someone from your past could open doors you thought were closed.',
    full: "The stars align magnificently for you today, Aries, as Mars energizes your sector of personal transformation. This is a day of powerful beginnings, where your natural pioneering spirit can truly flourish. The morning hours bring clarity to a situation that has been clouding your judgment for weeks. Trust the fire within you – it's guiding you toward exactly where you need to be. Professional matters take an exciting turn as your innovative ideas catch the attention of influential people. Don't be surprised if you're offered a leadership role or asked to spearhead a new project. Your enthusiasm is contagious today, inspiring others to follow your lead. In matters of the heart, Venus whispers secrets of deep attraction. If you're single, pay attention to subtle signs from someone in your social circle. For those in relationships, this is an ideal time to plan something adventurous together. Your partner craves the same excitement you do. Financially, be bold but wise. A calculated risk could pay off handsomely, but make sure you've done your research first. Lucky encounters happen near water or in places associated with learning. Trust your gut feelings today – they're more accurate than usual.",
    lucky: {
      number: 7,
      color: 'Crimson Red',
      mood: 'Confident',
    },
  },
  {
    timeframe: 'weekly' as const,
    preview:
      'This week focuses on building lasting foundations while embracing necessary changes. Monday and Tuesday highlight career advancement opportunities, while the weekend brings romantic possibilities. Your ruling planet Mars energizes your ambition sector.',
    full: "This is a transformative week for Aries, marked by significant shifts in your personal and professional landscape. Monday kicks off with Mercury in your communication sector, bringing clarity to conversations you've been avoiding. Tuesday's energy is perfect for making bold career moves - don't hesitate to pitch that innovative idea or apply for that dream position. Mid-week brings a gentle reminder to balance ambition with self-care. Wednesday and Thursday favor introspection and strategic planning. The weekend promises romantic developments, whether you're single or partnered. Venus dances through your relationship sector, highlighting the importance of authentic connection over superficial attractions. This is also an excellent time for creative projects and artistic endeavors. Pay attention to your dreams this week - they contain valuable guidance. Financial opportunities may arise through networking or collaborative ventures. Trust your instincts about new partnerships, both business and personal.",
    highlights: {
      bestDays: ['Monday', 'Tuesday', 'Saturday'],
      challenges: ['Wednesday - avoid rushed decisions'],
      opportunities: ['Career advancement', 'Romantic connections', 'Creative breakthroughs'],
      advice: 'Lead with authenticity and trust your innovative ideas',
    },
  },
  {
    timeframe: 'monthly' as const,
    preview:
      'March opens with transformative energy that will reshape your perspective on personal goals. The new moon on the 13th brings fresh opportunities in your career sector, while Venus retrograde from the 22nd asks you to revisit past relationships.',
    full: "March 2024 is a pivotal month for Aries, beginning with the powerful Spring Equinox that marks your birthday season and new astrological year. The first week brings a surge of creative energy and entrepreneurial spirit. The New Moon on March 13th falls in your career sector, opening doors you thought were permanently closed. This is your moment to step into leadership roles and showcase your unique vision. The middle of the month brings relationship revelations as Venus begins her retrograde journey on March 22nd. Past lovers or unresolved romantic situations may resurface, not necessarily for reunion, but for healing and closure. Mercury's influence in your financial sector suggests important money decisions around March 18-20th. Trust your instincts about investments and spending. The final week of March sets the stage for April's dynamic energy. Health and fitness routines established now will serve you well through the spring season. Your natural Aries magnetism is at an all-time high this month - use it wisely to attract the opportunities and people who align with your authentic self.",
    themes: {
      primary: 'New Beginnings & Leadership',
      secondary: 'Relationship Healing & Closure',
      energy: 'High momentum with periods of reflection',
      focus: ['Career advancement', 'Personal growth', 'Financial planning', 'Health optimization'],
    },
  },
  {
    timeframe: 'yearly' as const,
    preview:
      "2024 is your year of authentic self-expression and bold leadership. Jupiter's presence in your expansion sector until May supports major life upgrades, while Saturn teaches valuable lessons about long-term commitment and responsibility.",
    full: "2024 represents a landmark year for Aries, characterized by unprecedented growth and self-discovery. Jupiter's beneficial influence in your expansion sector through May brings opportunities for higher education, international ventures, and spiritual awakening. This is the year to think bigger and bolder than ever before. Saturn's lessons in your commitment sector teach you the value of consistency and long-term planning. The challenges you face in the first quarter will become your greatest strengths by year's end. Summer brings a powerful eclipse series that reshapes your approach to relationships and partnerships. August's planetary alignments suggest a significant career breakthrough or public recognition for your efforts. The autumn season favors financial growth and investment opportunities. Your natural leadership abilities are highlighted throughout the year, with multiple chances to guide others and make a lasting impact. Health and vitality are strong, but pay attention to stress management during peak activity periods. By December, you'll look back on 2024 as the year you truly came into your power and established yourself as a force to be reckoned with in your chosen field.",
    majorEvents: {
      spring: 'Career breakthrough and new opportunities',
      summer: 'Relationship transformations and partnerships',
      autumn: 'Financial growth and investment success',
      winter: 'Recognition and establishment of authority',
    },
  },
];

const mockLifeAspects: LifeAspectsData = {
  love: {
    score: 87,
    text: 'Your heart is open to deep, meaningful connections today. Single? Look for someone who matches your intellectual curiosity.',
  },
  career: {
    score: 74,
    text: 'Professional opportunities align perfectly with your ambitions. A leadership role may be offered soon.',
  },
  health: {
    score: 91,
    text: 'Your energy flows freely, supporting both body and mind. Perfect day for starting a new fitness routine.',
  },
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
  const segments = useSegments();
  const currentTab = segments[1] || 'today';

  const { isPremium } = useSubscriptionStore();
  const { getUserSign } = useUserStore();

  const userSign = getUserSign() || 'aries';
  const signData = ZODIAC_SIGNS[userSign];
  const accentColor = signData.accent;

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

  const handleTabPress = (tab: string) => {
    track('tab_selected', { tab });

    if (tab === 'compat') {
      router.push('/(tabs)/compat' as any);
    } else {
      router.push(`/(tabs)/${tab}` as any);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={[Colors.bg.top, Colors.bg.bottom]} style={styles.gradient}>
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
              data={mockHoroscopeData}
              onReadMore={handleReadMore}
              onPaywallNeeded={handlePaywallNeeded}
              onPagerSwiped={handlePagerSwiped}
            />

            {/* Life Aspects */}
            <LifeAspects
              scores={{
                love: mockLifeAspects.love.score,
                career: mockLifeAspects.career.score,
                health: mockLifeAspects.health.score,
              }}
            />

            {/* Banner Carousel */}
            <BannerCarousel banners={banners} onBannerPress={handleBannerPress} />

            {/* Bottom spacing for navbar */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </LinearGradient>

        {/* Bottom Navigation */}
        <BottomNav activeTab={currentTab} onTabPress={handleTabPress} />
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
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60, // Account for status bar
  },
  greetingSection: {
    marginBottom: Layout.sectionSpacing,
  },
  greeting: {
    ...Typography.displayLarge,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    fontWeight: '300',
  },
  date: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
  },
  signCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.sectionSpacing,
    height: Layout.signCardHeight,
    borderWidth: 1,
  },
  avatarContainer: {
    width: Layout.avatarSize,
    height: Layout.avatarSize,
    borderRadius: Layout.avatarSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  signInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  signName: {
    ...Typography.titleMedium,
    color: Colors.text.primary,
    fontSize: 16,
  },
  signDateRange: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  premiumChip: {
    backgroundColor: Colors.premiumChip,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    height: Layout.premiumChipHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumChipText: {
    ...Typography.labelSmall,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: Layout.navbarHeight + 40, // Extra spacing for comfortable scrolling
  },
});
