import { describe, it, expect } from 'vitest';
import {
  getPublishedServices,
  getPublishedSolutions,
  getPublishedIndustries,
  getPublishedCaseStudies,
  getServiceRelationalContext,
  getSolutionRelationalContext,
  getIndustryRelationalContext,
  getCaseStudyRelationalContext,
  getArticleRelationalContext,
} from '@/controllers/cms.controller';

describe('Integration: Content Relationships & Bidirectional Graph Integrity', () => {
  it('validates that ALL published services link to valid solutions, industries, and technologies', async () => {
    const services = await getPublishedServices();
    expect(services.length).toBeGreaterThan(0);

    for (const service of services) {
      const context = await getServiceRelationalContext(service.slug);
      expect(context.service).toBeDefined();
      expect(context.service?.slug).toBeDefined();
      expect(context.service?.title).toBeDefined();

      // Verify related solutions exist and are resolvable
      expect(context.relatedSolutions.length).toBeGreaterThan(0);
      for (const sol of context.relatedSolutions) {
        expect(sol.slug).toBeDefined();
        expect(sol.title).toBeDefined();
      }

      // Verify relevant industries exist
      expect(context.relevantIndustries.length).toBeGreaterThan(0);
      for (const ind of context.relevantIndustries) {
        expect(ind.slug).toBeDefined();
        expect(ind.label).toBeDefined();
      }

      // Verify technologies exist
      expect(context.technologies.length).toBeGreaterThan(0);

      // Verify CTA is defined and points to valid route
      expect(context.cta).toBeDefined();
      expect(context.cta.href).toMatch(/\/(start-project|contact)/);
    }
  });

  it('validates that ALL published solutions link to valid services and industries', async () => {
    const solutions = await getPublishedSolutions();
    expect(solutions.length).toBeGreaterThan(0);

    for (const solution of solutions) {
      const context = await getSolutionRelationalContext(solution.slug);
      expect(context.solution).toBeDefined();
      expect(context.solution?.slug).toBe(solution.slug);

      // Must link to what Astraiv DOES (Services)
      expect(context.relatedServices.length).toBeGreaterThan(0);
      for (const srv of context.relatedServices) {
        expect(srv.slug).toBeDefined();
        expect(srv.title).toBeDefined();
      }

      // Must link to vertical domains
      expect(context.relevantIndustries.length).toBeGreaterThan(0);

      // CTA must exist
      expect(context.cta).toBeDefined();
    }
  });

  it('validates that ALL published industries link to valid services and solutions', async () => {
    const industries = await getPublishedIndustries();
    expect(industries.length).toBeGreaterThan(0);

    for (const ind of industries) {
      const context = await getIndustryRelationalContext(ind.slug);
      expect(context.industry).toBeDefined();
      expect(context.industry?.slug).toBe(ind.slug);

      expect(context.relatedServices.length).toBeGreaterThan(0);
      expect(context.relatedSolutions.length).toBeGreaterThan(0);
    }
  });

  it('validates that published case studies resolve to valid services, solutions, and industries', async () => {
    const caseStudies = await getPublishedCaseStudies();
    expect(caseStudies.length).toBeGreaterThan(0);

    for (const cs of caseStudies) {
      const context = await getCaseStudyRelationalContext(cs.slug);
      expect(context).not.toBeNull();
      if (context) {
        expect(context.project.slug).toBe(cs.slug);
        expect(context.relatedServices.length).toBeGreaterThan(0);
        expect(context.relatedSolutions.length).toBeGreaterThan(0);
        expect(context.relatedIndustry).toBeDefined();
      }
    }
  });

  it('validates that blog articles resolve to valid related services and solutions', async () => {
    // Canonical article test
    const context = await getArticleRelationalContext('how-rag-systems-improve-enterprise-knowledge');
    expect(context).not.toBeNull();
    if (context) {
      expect(context.article.slug).toBe('how-rag-systems-improve-enterprise-knowledge');
      expect(context.relatedServices.length).toBeGreaterThan(0);
      expect(context.relatedSolutions.length).toBeGreaterThan(0);

      // Verify related service has valid slug
      for (const srv of context.relatedServices) {
        expect(srv.slug).toBeDefined();
      }
    }
  });
});
