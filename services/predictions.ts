import { apiClient } from './api';
import { PredictionDaily, PredictionExtended, ZodiacSign, Timeframe } from '../types/api';

export const predictionsService = {
  async getDaily(sign: ZodiacSign, date?: string): Promise<PredictionDaily> {
    const params: Record<string, string> = { sign };
    if (date) params.date = date;

    return apiClient.get('/predictions/daily') as Promise<PredictionDaily>;
  },

  async getWeekly(sign: ZodiacSign): Promise<PredictionExtended> {
    return apiClient.get('/predictions/weekly') as Promise<PredictionExtended>;
  },

  async getMonthly(sign: ZodiacSign, month?: string): Promise<PredictionExtended> {
    const params: Record<string, string> = { sign };
    if (month) params.month = month;

    return apiClient.get('/predictions/monthly') as Promise<PredictionExtended>;
  },

  async getYearly(sign: ZodiacSign, year?: string): Promise<PredictionExtended> {
    const params: Record<string, string> = { sign };
    if (year) params.year = year;

    return apiClient.get('/predictions/yearly') as Promise<PredictionExtended>;
  },

  async getPrediction(timeframe: Timeframe, sign: ZodiacSign, date?: string) {
    switch (timeframe) {
      case 'daily':
        return this.getDaily(sign, date);
      case 'weekly':
        return this.getWeekly(sign);
      case 'monthly':
        return this.getMonthly(sign);
      case 'yearly':
        return this.getYearly(sign);
      default:
        throw new Error(`Invalid timeframe: ${timeframe}`);
    }
  },
};