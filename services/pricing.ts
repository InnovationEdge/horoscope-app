/**
 * Pricing service for handling subscription plans and regional pricing
 */

import { apiClient } from './api';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  price_minor: number; // Price in cents
  currency: string;
  period: string;
  display_price: string;
  savings?: string;
  popular?: boolean;
  features: string[];
}

export interface RegionalPricing {
  region: string;
  currency: string;
  symbol: string;
  weekly_display: string;
  monthly_display: string;
  yearly_display: string;
  plans: PricingPlan[];
}

class PricingService {
  private cachedPricing: RegionalPricing | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  /**
   * Get regional pricing based on user's location
   */
  async getPricing(): Promise<RegionalPricing> {
    // Return cached pricing if valid
    if (this.cachedPricing && Date.now() < this.cacheExpiry) {
      return this.cachedPricing;
    }

    try {
      const response = await apiClient.get('/payments/products/');

      if (response.data) {
        this.cachedPricing = response.data;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        return response.data;
      }
    } catch (error) {
      console.warn('Failed to fetch pricing from API, using defaults:', error);
    }

    // Fallback to default pricing
    return this.getDefaultPricing();
  }

  /**
   * Get default pricing when API is unavailable
   */
  private getDefaultPricing(): RegionalPricing {
    return {
      region: 'US',
      currency: 'USD',
      symbol: '$',
      weekly_display: '$2.99',
      monthly_display: '$9.99',
      yearly_display: '$59.99',
      plans: [
        {
          id: 'weekly',
          name: 'Weekly',
          price: 2.99,
          price_minor: 299,
          currency: 'USD',
          period: 'week',
          display_price: '$2.99',
          features: ['7-day access', 'All premium features'],
        },
        {
          id: 'monthly',
          name: 'Monthly',
          price: 9.99,
          price_minor: 999,
          currency: 'USD',
          period: 'month',
          display_price: '$9.99',
          popular: true,
          features: ['30-day access', 'All premium features', 'Most popular'],
        },
        {
          id: 'yearly',
          name: 'Yearly',
          price: 59.99,
          price_minor: 5999,
          currency: 'USD',
          period: 'year',
          display_price: '$59.99',
          savings: 'Save 50%',
          features: ['365-day access', 'All premium features', 'Best value'],
        },
      ],
    };
  }

  /**
   * Initiate subscription purchase
   */
  async initiatePurchase(planId: string, provider: string = 'app_store'): Promise<{
    session_id: string;
    checkout_url?: string;
    success: boolean;
  }> {
    try {
      const pricing = await this.getPricing();
      const plan = pricing.plans.find(p => p.id === planId);

      if (!plan) {
        throw new Error(`Plan ${planId} not found`);
      }

      const response = await apiClient.post('/payments/create-session/', {
        plan: planId,
        provider,
        currency: plan.currency,
        return_url: 'salamene://purchase-success',
      });

      return {
        session_id: response.data.session_id,
        checkout_url: response.data.checkout_url,
        success: true,
      };
    } catch (error) {
      console.error('Failed to initiate purchase:', error);
      return {
        session_id: '',
        success: false,
      };
    }
  }

  /**
   * Verify purchase completion
   */
  async verifyPurchase(sessionId: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/payments/verify-purchase/', {
        session_id: sessionId,
      });

      return response.data.success === true;
    } catch (error) {
      console.error('Failed to verify purchase:', error);
      return false;
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<{
    restored: boolean;
    subscriptions: any[];
  }> {
    try {
      const response = await apiClient.post('/payments/restore-purchases/');

      return {
        restored: response.data.restored || false,
        subscriptions: response.data.subscriptions || [],
      };
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return {
        restored: false,
        subscriptions: [],
      };
    }
  }
}

export const pricingService = new PricingService();

// Aliases for backward compatibility
export const fetchPricing = () => pricingService.getPricing();
export type Pricing = RegionalPricing;