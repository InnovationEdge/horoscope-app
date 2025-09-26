// services/pricing.ts
export type Pricing = {
  region: string;
  currency: 'USD'|'EUR'|'GEL'|string;
  symbol: string;
  monthly_minor: number;      // 500 = 5.00
  monthly_display: string;    // "5 USD"
};

export async function fetchPricing(): Promise<Pricing> {
  try {
    const res = await fetch('/api/v1/payments/products');
    if (!res.ok) throw new Error('pricing_fetch_failed');
    const data = await res.json();
    const p = data?.plans?.[0]?.pricing;
    if (!p) throw new Error('pricing_missing');
    return p as Pricing;
  } catch (error) {
    // Fallback pricing
    return {
      region: 'US',
      currency: 'USD',
      symbol: '$',
      monthly_minor: 500,
      monthly_display: '5 USD'
    };
  }
}