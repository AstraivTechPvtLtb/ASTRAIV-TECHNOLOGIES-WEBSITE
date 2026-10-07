import { describe, it, expect } from 'vitest';
import {
  getPublicJobOpenings,
  getPublicJobBySlug,
  getPublicPricingPlans,
  getPublicPricingPageSettings,
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
      }
    });

    it('retrieves specific job opening by slug', async () => {
      const jobs = await getPublicJobOpenings();
      const firstSlug = jobs[0].slug;

      const job = await getPublicJobBySlug(firstSlug);
      expect(job).not.toBeNull();
      expect(job?.slug).toBe(firstSlug);
    });

    it('returns null when querying non-existent job slug', async () => {
      const job = await getPublicJobBySlug('non-existent-role-xyz-999');
      expect(job).toBeNull();
    });
  });

  describe('Engagement Models', () => {
    it('returns verified public engagement models', async () => {
      const plans = await getPublicPricingPlans();
      expect(plans.length).toBeGreaterThanOrEqual(1);

      for (const plan of plans) {
        expect(plan.id).toBeDefined();
        expect(plan.name).toBeDefined();
        expect(plan.description).toBeDefined();
        expect(plan.features.length).toBeGreaterThan(0);
        expect(plan.buttonText).toBeDefined();
        expect(plan.buttonUrl).toBeDefined();
      }
    });

    it('returns public page image and layout settings', async () => {
      const settings = await getPublicPricingPageSettings();
      expect(settings).toBeDefined();
      expect(typeof settings.showHeroImage).toBe('boolean');
      if (settings.showHeroImage) {
        expect(settings.heroImageUrl).toBeTruthy();
        expect(settings.heroImageAlt).toBeTruthy();
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
        expect(t.review_text.length).toBeGreaterThan(0);
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
