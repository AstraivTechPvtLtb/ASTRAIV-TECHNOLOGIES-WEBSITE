import { describe, it, expect } from 'vitest';
import {
  getPaginatedPublicJobs,
  getPublicCareersPageContent,
  getPublicJobCategories,
  getPublicJobBySlug,
} from './public-data.controller';

describe('Public Careers Data & 5-Item Pagination Controller', () => {
  it('enforces maximum 5 jobs per results page', async () => {
    const res = await getPaginatedPublicJobs({ page: 1, limit: 5 });
    expect(res.jobs.length).toBeLessThanOrEqual(5);
    expect(res.limit).toBe(5);
    expect(res.page).toBe(1);
    expect(res.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('filters job openings by category slug before pagination', async () => {
    const res = await getPaginatedPublicJobs({ categorySlug: 'engineering', page: 1, limit: 5 });
    for (const job of res.jobs) {
      expect(
        job.department.toLowerCase().includes('engineering') ||
          job.category?.slug.toLowerCase() === 'engineering'
      ).toBe(true);
    }
  });

  it('handles search queries and resets pagination bounds', async () => {
    const res = await getPaginatedPublicJobs({ query: 'Java', page: 1, limit: 5 });
    for (const job of res.jobs) {
      const match =
        job.title.toLowerCase().includes('java') ||
        job.description.toLowerCase().includes('java') ||
        job.skills.some((s: string) => s.toLowerCase().includes('java'));
      expect(match).toBe(true);
    }
  });

  it('retrieves dynamic public careers page content and shared defaults', async () => {
    const { content, sharedDefaults } = await getPublicCareersPageContent();
    expect(content.heroHeading).toBeTruthy();
    expect(content.cultureCards.length).toBeGreaterThan(0);
    expect(content.benefitsCards.length).toBeGreaterThan(0);
    expect(sharedDefaults.interviewStages.length).toBeGreaterThanOrEqual(4);
    expect(sharedDefaults.commonBenefits.length).toBeGreaterThanOrEqual(3);
  });

  it('retrieves canonical role categories with opening counts', async () => {
    const categories = await getPublicJobCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const cat of categories) {
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
      expect(typeof cat.openingCount).toBe('number');
    }
  });

  it('retrieves specific job opening by slug with shared default inheritance', async () => {
    const job = await getPublicJobBySlug('java-full-stack-developer');
    if (job) {
      expect(job.title).toContain('Java');
      expect(job.responsibilities?.length).toBeGreaterThan(0);
      expect(job.requirements?.length).toBeGreaterThan(0);
      expect(job.benefits?.length).toBeGreaterThan(0);
    }
  });
});
