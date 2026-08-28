import { describe, it, expect } from 'vitest';
import { getPlanPrice, SUPPORTED_CURRENCIES } from './pricing';

describe('Pricing Currency Calculation', () => {
  it('calculates USD prices correctly', () => {
    expect(getPlanPrice('USD', 'starter', 'monthly')).toBe('$4,999');
    expect(getPlanPrice('USD', 'starter', 'yearly')).toBe('$3,999');
    expect(getPlanPrice('USD', 'pro', 'monthly')).toBe('$9,999');
    expect(getPlanPrice('USD', 'pro', 'yearly')).toBe('$7,999');
  });

  it('calculates INR prices correctly for India', () => {
    const starterMonthly = getPlanPrice('INR', 'starter', 'monthly');
    const proMonthly = getPlanPrice('INR', 'pro', 'monthly');
    expect(starterMonthly).toContain('₹');
    expect(starterMonthly).toContain('3,99,999');
    expect(proMonthly).toContain('₹');
    expect(proMonthly).toContain('7,99,999');
  });

  it('calculates GBP prices correctly for UK', () => {
    const starterMonthly = getPlanPrice('GBP', 'starter', 'monthly');
    const proMonthly = getPlanPrice('GBP', 'pro', 'monthly');
    expect(starterMonthly).toContain('£');
    expect(starterMonthly).toContain('3,999');
    expect(proMonthly).toContain('£');
    expect(proMonthly).toContain('7,999');
  });

  it('calculates EUR prices correctly for European Union', () => {
    const starterMonthly = getPlanPrice('EUR', 'starter', 'monthly');
    const proMonthly = getPlanPrice('EUR', 'pro', 'monthly');
    expect(starterMonthly).toContain('4,599');
    expect(proMonthly).toContain('9,199');
  });

  it('has comprehensive currency support', () => {
    expect(SUPPORTED_CURRENCIES.INR).toBeDefined();
    expect(SUPPORTED_CURRENCIES.USD).toBeDefined();
    expect(SUPPORTED_CURRENCIES.GBP).toBeDefined();
    expect(SUPPORTED_CURRENCIES.EUR).toBeDefined();
    expect(SUPPORTED_CURRENCIES.CAD).toBeDefined();
    expect(SUPPORTED_CURRENCIES.AUD).toBeDefined();
    expect(SUPPORTED_CURRENCIES.AED).toBeDefined();
    expect(SUPPORTED_CURRENCIES.JPY).toBeDefined();
  });
});
