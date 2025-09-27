import { ZodiacSign } from '../types/horoscope';
import horoscopeData from '../content/horoscopes.json';

export interface HoroscopeReading {
  preview: string;
  full: string;
  lucky: {
    number: number;
    color: string;
    mood: string;
  };
  scores: {
    love: number;
    career: number;
    health: number;
  };
}

export interface DailyHoroscope extends HoroscopeReading {}
export interface WeeklyHoroscope extends HoroscopeReading {}
export interface MonthlyHoroscope extends HoroscopeReading {}

export type HoroscopeTimeframe = 'daily' | 'weekly' | 'monthly';

class HoroscopeService {
  private horoscopeCache: typeof horoscopeData = horoscopeData;

  // Get daily horoscope for a zodiac sign
  async getDailyHoroscope(sign: ZodiacSign): Promise<DailyHoroscope> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const dailyData = this.horoscopeCache.daily[sign];
      if (!dailyData) {
        throw new Error(`Daily horoscope not found for sign: ${sign}`);
      }

      return dailyData;
    } catch (error) {
      console.error('Error fetching daily horoscope:', error);
      throw new Error('Failed to fetch daily horoscope');
    }
  }

  // Get weekly horoscope for a zodiac sign
  async getWeeklyHoroscope(sign: ZodiacSign): Promise<WeeklyHoroscope> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      const weeklyData = this.horoscopeCache.weekly[sign];
      if (!weeklyData) {
        // Fallback to daily data with modified content for weekly
        const dailyData = this.horoscopeCache.daily[sign];
        return {
          preview: `This week brings extended opportunities for ${sign}. ${dailyData.preview}`,
          full: `Week ahead for ${sign}: ${dailyData.full} This influence extends throughout the week, offering multiple opportunities to embrace these energies.`,
          lucky: dailyData.lucky,
          scores: dailyData.scores,
        };
      }

      return weeklyData;
    } catch (error) {
      console.error('Error fetching weekly horoscope:', error);
      throw new Error('Failed to fetch weekly horoscope');
    }
  }

  // Get monthly horoscope for a zodiac sign
  async getMonthlyHoroscope(sign: ZodiacSign): Promise<MonthlyHoroscope> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const monthlyData = this.horoscopeCache.monthly[sign];
      if (!monthlyData) {
        // Fallback to daily data with modified content for monthly
        const dailyData = this.horoscopeCache.daily[sign];
        return {
          preview: `This month holds significant potential for ${sign}. ${dailyData.preview}`,
          full: `Month ahead for ${sign}: The cosmic energies this month amplify your natural traits. ${dailyData.full} These themes will persist throughout the month, creating lasting positive changes in your life.`,
          lucky: dailyData.lucky,
          scores: dailyData.scores,
        };
      }

      return monthlyData;
    } catch (error) {
      console.error('Error fetching monthly horoscope:', error);
      throw new Error('Failed to fetch monthly horoscope');
    }
  }

  // Get horoscope by timeframe
  async getHoroscope(sign: ZodiacSign, timeframe: HoroscopeTimeframe): Promise<HoroscopeReading> {
    switch (timeframe) {
      case 'daily':
        return this.getDailyHoroscope(sign);
      case 'weekly':
        return this.getWeeklyHoroscope(sign);
      case 'monthly':
        return this.getMonthlyHoroscope(sign);
      default:
        throw new Error(`Invalid timeframe: ${timeframe}`);
    }
  }

  // Get all horoscopes for a sign
  async getAllHoroscopes(sign: ZodiacSign): Promise<{
    daily: DailyHoroscope;
    weekly: WeeklyHoroscope;
    monthly: MonthlyHoroscope;
  }> {
    try {
      const [daily, weekly, monthly] = await Promise.all([
        this.getDailyHoroscope(sign),
        this.getWeeklyHoroscope(sign),
        this.getMonthlyHoroscope(sign),
      ]);

      return { daily, weekly, monthly };
    } catch (error) {
      console.error('Error fetching all horoscopes:', error);
      throw new Error('Failed to fetch horoscopes');
    }
  }

  // Get lucky numbers for a sign (from daily horoscope)
  async getLuckyData(sign: ZodiacSign): Promise<{
    number: number;
    color: string;
    mood: string;
  }> {
    try {
      const daily = await this.getDailyHoroscope(sign);
      return daily.lucky;
    } catch (error) {
      console.error('Error fetching lucky data:', error);
      throw new Error('Failed to fetch lucky data');
    }
  }

  // Get life aspect scores for a sign (from daily horoscope)
  async getLifeAspectScores(sign: ZodiacSign): Promise<{
    love: number;
    career: number;
    health: number;
  }> {
    try {
      const daily = await this.getDailyHoroscope(sign);
      return daily.scores;
    } catch (error) {
      console.error('Error fetching life aspect scores:', error);
      throw new Error('Failed to fetch life aspect scores');
    }
  }

  // Check if cached data exists for a sign
  hasDataForSign(sign: ZodiacSign): boolean {
    return !!this.horoscopeCache.daily[sign];
  }

  // Get available signs
  getAvailableSigns(): ZodiacSign[] {
    return Object.keys(this.horoscopeCache.daily) as ZodiacSign[];
  }
}

// Export singleton instance
export const horoscopeService = new HoroscopeService();
