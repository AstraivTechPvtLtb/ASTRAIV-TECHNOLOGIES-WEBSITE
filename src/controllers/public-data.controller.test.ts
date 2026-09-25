import { describe, it, expect } from 'vitest';
import {
  getPublicJobOpenings,
  getPublicJobBySlug,
  getPublicPricingPlans,
  getApprovedTestimonials,
  getFeaturedTestimonials,
  getTestimonialsByService,
  getPublicComplianceSettings,
} from './public-data.controller';

describe('Public Data Controller & Business Logic', () => {
  describe('Careers & Job Openings', () => {
    it('returns approved active job openings', async () => {
      const jobs = await getPublicJobOpenings();
      expect(jobs.length).toBeGreaterThan(0);

      for (const job of jobs) {
        expect(job.slug).toBeDefined();
        expect(job.title).toBeDefined();
        expect(job.department).toBeDefined();
        expect(job.location).toBeDefined();
        expect(job.experience).toBeDefined();
      }
    });

    it('retrieves specific job opening by slug', async () => {
      const jobs = await getPublicJobOpenings();
      const firstSlug = jobs[0].slug;

      const job = await getPublicJobBySlug(firstSlug);
      expect(job).not.toBeNull();
      expect(job?.slug).toBe(firstSlug);
      expect(job?.requirements?.length).toBeGreaterThan(0);
      expect(job?.responsibilities?.length).toBeGreaterThan(0);
    });

    it('returns null when querying non-existent job slug', async () => {
      const job = await getPublicJobBySlug('non-existent-role-xyz-999');
      expect(job).toBeNull();
    });
  });

  describe('Pricing & Engagement Plans', () => {
    it('returns verified public pricing tiers', async () => {
      const plans = await getPublicPricingPlans();
      expect(plans.length).toBeGreaterThanOrEqual(3);

      for (const plan of plans) {
        expect(plan.id).toBeDefined();
        expect(plan.name).toBeDefined();
        expect(plan.priceType).toBeDefined();
        expect(plan.features.length).toBeGreaterThan(0);
        expect(plan.buttonText).toBeDefined();
      }
    });
  });

  describe('Testimonials & Social Proof', () => {
    it('returns approved testimonials with client attribution', async () => {
      const testimonials = await getApprovedTestimonials();
      expect(testimonials.length).toBeGreaterThan(0);

      for (const t of testimonials) {
        expect(t.client_name).toBeDefined();
        expect(t.company).toBeDefined();
        expect(t.review_text.length).toBeGreaterThan(20);
      }
    });

    it('respects limit parameter for featured testimonials', async () => {
      const featured = await getFeaturedTestimonials(2);
      expect(featured.length).toBeLessThanOrEqual(2);
    });

    it('filters testimonials by service identifier', async () => {
      const serviceTestimonials = await getTestimonialsByService('ai-development');
      expect(Array.isArray(serviceTestimonials)).toBe(true);
    });
  });

  describe('Enterprise Compliance Settings', () => {
    it('provides compliance and security declarations', async () => {
      const compliance = await getPublicComplianceSettings();
      expect(compliance).toBeDefined();
      expect(compliance.isoNumber).toBeDefined();
      expect(compliance.uptimeValue).toBeDefined();
      expect(compliance.slaValue).toBeDefined();
    });
  });
});
