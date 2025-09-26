// Mock analytics service for now - will integrate Firebase later
interface UserProperties {
  userId?: string;
  sign?: string;
  subscription_status?: 'free' | 'premium';
  app_env: 'dev' | 'staging' | 'prod';
  platform: 'ios' | 'android';
  app_version: string;
  locale: string;
}

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

type OnboardingStep = 'welcome' | 'name' | 'birthdate' | 'location' | 'complete';
type Timeframe = 'today' | 'weekly' | 'monthly' | 'yearly';
type ZodiacSign = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';
type LifeAspect = 'love' | 'career' | 'health';
type AuthProvider = 'google' | 'apple' | 'facebook';
type PaywallTrigger = 'calculate' | 'read_more' | 'banner' | 'locked_content' | 'button';

class AnalyticsService {
  private isEnabled = true;
  private userProperties: Partial<UserProperties> = {};

  async initialize() {
    console.log('Analytics initialized');
    // Set initial user properties
    await this.setUserProperties({
      app_env: 'dev', // Would be set based on build environment
      platform: 'ios', // Would be detected from Platform.OS
      app_version: '1.0.0', // Would come from app config
      locale: 'en-US', // Would come from device locale
      subscription_status: 'free',
    });
  }

  async setUserProperties(props: Partial<UserProperties>) {
    if (!this.isEnabled) return;
    this.userProperties = { ...this.userProperties, ...props };
    console.log('Analytics setUserProperties:', props);
  }

  async logEvent(eventName: string, params: EventParams = {}) {
    if (!this.isEnabled) return;

    // Add universal envelope parameters
    const enrichedParams = {
      ...params,
      timestamp_ms: Date.now(),
      ...this.userProperties,
    };

    console.log('Analytics event:', eventName, enrichedParams);
  }

  // 6.1 Onboarding Events
  async logOnboardingStepViewed(step: OnboardingStep) {
    await this.logEvent('onboarding_step_viewed', { step });
  }

  async logOnboardingCompleted(sign: ZodiacSign, birthDate: string, birthTimeKnown: boolean) {
    await this.logEvent('onboarding_completed', {
      sign,
      birth_date: birthDate,
      birth_time_known: birthTimeKnown,
    });
  }

  // 6.2 Auth Events
  async logAuthStarted(provider: AuthProvider) {
    await this.logEvent('auth_started', { provider });
  }

  async logAuthCompleted(provider: AuthProvider, success: boolean) {
    await this.logEvent('auth_completed', { provider, success });
  }

  async logAuthFailed(provider: AuthProvider, errorCode: string) {
    await this.logEvent('auth_failed', { provider, error_code: errorCode });
  }

  // 6.3 Today Tab Events
  async logTodayScreenViewed(date: string) {
    await this.logEvent('today_screen_viewed', {
      date,
      screen: '(tabs)/today',
    });
  }

  async logHoroscopePagerSwiped(from: Timeframe, to: Timeframe) {
    await this.logEvent('horoscope_pager_swiped', { from, to });
  }

  async logReadMoreClicked(timeframe: Timeframe) {
    await this.logEvent('read_more_clicked', { timeframe });
  }

  async logLuckyRowViewed(number: number, colorName: string, mood: string) {
    await this.logEvent('lucky_row_viewed', {
      number,
      color_name: colorName,
      mood,
    });
  }

  async logLifeAspectViewed(aspect: LifeAspect, score: number) {
    await this.logEvent('life_aspect_viewed', { aspect, score });
  }

  async logBannerShown(bannerId: string) {
    await this.logEvent('banner_shown', { banner_id: bannerId });
  }

  async logBannerClicked(bannerId: string) {
    await this.logEvent('banner_clicked', { banner_id: bannerId });
  }

  // 6.4 Characteristics (Traits) Events
  async logTraitsScreenViewed(sign: ZodiacSign) {
    await this.logEvent('traits_screen_viewed', {
      sign,
      screen: '(tabs)/traits',
    });
  }

  async logTraitsSwiped(fromSign: ZodiacSign, toSign: ZodiacSign) {
    await this.logEvent('traits_swiped', {
      from_sign: fromSign,
      to_sign: toSign,
    });
  }

  // 6.5 Compatibility Events
  async logCompatibilityOpened() {
    await this.logEvent('compatibility_opened', {
      screen: '(tabs)/compat',
    });
  }

  async logCompatibilityCalculated(
    signA: ZodiacSign,
    signB: ZodiacSign,
    overallScore: number,
    love: number,
    career: number,
    friendship: number
  ) {
    await this.logEvent('compatibility_calculated', {
      sign_a: signA,
      sign_b: signB,
      overall_score: overallScore,
      love,
      career,
      friendship,
    });
  }

  async logCompatibilityPaywallShown(trigger: PaywallTrigger) {
    await this.logEvent('compatibility_paywall_shown', { trigger });
  }

  // 6.6 Druid & Chinese Events
  async logDruidScreenViewed(druidSign: string) {
    await this.logEvent('druid_screen_viewed', {
      druid_sign: druidSign,
      screen: '(tabs)/druid',
    });
  }

  async logChineseScreenViewed(animal: string) {
    await this.logEvent('chinese_screen_viewed', {
      animal,
      screen: '(tabs)/druid',
    });
  }

  // 6.7 Profile & Settings Events
  async logProfileScreenViewed() {
    await this.logEvent('profile_screen_viewed', {
      screen: '(tabs)/profile',
    });
  }

  async logSettingsChanged(setting: string, value: string | boolean) {
    await this.logEvent('settings_changed', { setting, value });
  }

  async logLogoutClicked() {
    await this.logEvent('logout_clicked');
  }

  // 6.8 Push Notification Events
  async logPushOpened(type: string, campaignId?: string) {
    await this.logEvent('push_opened', {
      type,
      campaign_id: campaignId,
    });
  }

  async logPushDismissed(type: string, campaignId?: string) {
    await this.logEvent('push_dismissed', {
      type,
      campaign_id: campaignId,
    });
  }

  // Paywall Events
  async logPaywallShown(trigger: PaywallTrigger) {
    await this.logEvent('paywall_shown', { trigger });
  }

  // A/B Testing Events
  async logABExposure(flag: string, variant: string) {
    await this.logEvent('ab_exposure', { flag, variant });
  }

  // Deep Link Events
  async logDeepLinkOpened(path: string, source: string, campaignId?: string) {
    await this.logEvent('deep_link_opened', {
      path,
      source,
      campaign_id: campaignId,
    });
  }

  // Screen Navigation Events (generic)
  async logScreenViewed(screenName: string, additionalParams?: EventParams) {
    await this.logEvent('screen_viewed', {
      screen: screenName,
      ...additionalParams,
    });
  }

  // Utility methods
  async setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    console.log('Analytics collection enabled:', enabled);
  }

  async identify(userId: string) {
    await this.setUserProperties({ userId });
  }

  async setZodiacSign(sign: ZodiacSign) {
    await this.setUserProperties({ sign });
  }

  async setSubscriptionStatus(status: 'free' | 'premium') {
    await this.setUserProperties({ subscription_status: status });
  }
}

export const analyticsService = new AnalyticsService();