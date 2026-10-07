import { describe, it, expect } from 'vitest';
import { DEFAULT_PRICING_PLANS } from '../models/types';

describe('Engagement Models Structure & Verification', () => {
  it('contains canonical engagement model definitions', () => {
    expect(DEFAULT_PRICING_PLANS.length).toBeGreaterThanOrEqual(3);
  });

  it('ensures all engagement models have required deliverables and quote CTAs', () => {
    for (const plan of DEFAULT_PRICING_PLANS) {
      expect(plan.id).toBeTruthy();
      expect(plan.name).toBeTruthy();
      expect(plan.description).toBeTruthy();
      expect(plan.features.length).toBeGreaterThan(0);
      expect(plan.buttonText).toBe('Request a Quote');
      expect(plan.buttonUrl).toContain('/start-project');
      expect(plan.active).toBe(true);
    }
  });

  it('has a designated flagship featured engagement model', () => {
    const popular = DEFAULT_PRICING_PLANS.find((p) => p.isPopular);
    expect(popular).toBeDefined();
    expect(popular?.badge).toBe('MOST POPULAR');
  });
});
