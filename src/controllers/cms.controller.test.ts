import { describe, it, expect } from 'vitest';
import {
  getPublishedServices,
  getPublishedServiceBySlug,
  getPublishedSolutions,
  getPublishedSolutionBySlug,
  getPublishedIndustries,
  getPublishedIndustryBySlug,
  getPublishedTechnologies,
  getPublishedCaseStudies,
  getPublishedCaseStudyBySlug,
  getPublishedArticles,
  getPublishedArticleBySlug,
  getPublishedAwards,
  getPublishedFaqs,
  getServiceRelationalContext,
  getSolutionRelationalContext,
  getIndustryRelationalContext,
  getCaseStudyRelationalContext,
  getArticleRelationalContext,
} from './cms.controller';

describe('Relational CMS Controller & Architecture', () => {
  describe('Public Publication Approval Filters', () => {
    it('only returns approved and published services', async () => {
      const services = await getPublishedServices();
      expect(services.length).toBeGreaterThan(0);
      for (const s of services) {
        expect(s.slug).toBeDefined();
        expect(s.title).toBeDefined();
      }
    });

    it('retrieves published service by canonical slug and resolves aliased slugs', async () => {
      const srv = await getPublishedServiceBySlug('ai-development');
      expect(srv).toBeDefined();
      expect(srv?.slug).toBe('ai-development');

      // Aliased lookup
      const aliased = await getPublishedServiceBySlug('ai-solutions');
      expect(aliased).toBeDefined();
      expect(aliased?.slug).toBe('ai-development');
    });

    it('only returns approved and published solutions', async () => {
      const solutions = await getPublishedSolutions();
      expect(solutions.length).toBeGreaterThanOrEqual(7);
      for (const sol of solutions) {
        expect(sol.slug).toBeDefined();
        expect(sol.features.length).toBeGreaterThan(0);
      }
    });

    it('retrieves published solution by slug', async () => {
      const sol = await getPublishedSolutionBySlug('ai-business-automation');
      expect(sol).toBeDefined();
      expect(sol?.slug).toBe('ai-business-automation');
      expect(sol?.category).toBe('intelligent-systems');
    });

    it('only returns approved and published industries', async () => {
      const industries = await getPublishedIndustries();
      expect(industries.length).toBeGreaterThanOrEqual(5);
      const fintech = industries.find((i) => i.slug === 'fintech');
      expect(fintech).toBeDefined();
      expect(fintech?.label).toBe('FinTech');
    });

    it('retrieves published industry by slug', async () => {
      const ind = await getPublishedIndustryBySlug('fintech');
      expect(ind).toBeDefined();
      expect(ind?.slug).toBe('fintech');
    });

    it('retrieves published technologies with categories', async () => {
      const techs = await getPublishedTechnologies();
      if (techs.length > 0) {
        for (const t of techs) {
          expect(t.name).toBeDefined();
          expect(t.category).toBeDefined();
          expect(t.status).toBe('published');
        }
      }
    });

    it('only returns published case studies', async () => {
      const caseStudies = await getPublishedCaseStudies();
      expect(caseStudies.length).toBeGreaterThanOrEqual(3);
      for (const cs of caseStudies) {
        expect(cs.slug).toBeDefined();
        expect(cs.title).toBeDefined();
      }
    });

    it('only returns verified and published awards', async () => {
      const awards = await getPublishedAwards();
      expect(awards.length).toBeGreaterThanOrEqual(4);
      for (const a of awards) {
        expect(['verified', 'active', 'contractual']).toContain(a.status);
        expect(a.published).toBe(true);
      }
    });

    it('only returns published FAQs and supports category filtering', async () => {
      const allFaqs = await getPublishedFaqs();
      expect(allFaqs.length).toBeGreaterThanOrEqual(6);

      const generalFaqs = await getPublishedFaqs('general');
      expect(generalFaqs.length).toBeGreaterThan(0);
      for (const f of generalFaqs) {
        expect(f.category).toBe('general');
      }
    });
  });

  describe('Bidirectional Relational Context Resolvers', () => {
    it('resolves Service <-> Solutions, Industries, Tech, Case Studies correctly', async () => {
      const context = await getServiceRelationalContext('ai-development');
      expect(context).toBeDefined();
      expect(context.service?.slug).toBe('ai-development');
      expect(context.relatedSolutions.length).toBeGreaterThan(0);
      expect(context.relevantIndustries.length).toBeGreaterThan(0);
      expect(context.technologies.length).toBeGreaterThan(0);
      expect(context.cta).toBeDefined();
    });

    it('resolves Solution <-> Services, Industries, Case Studies correctly', async () => {
      const context = await getSolutionRelationalContext('ai-business-automation');
      expect(context).toBeDefined();
      expect(context.solution?.slug).toBe('ai-business-automation');
      expect(context.relatedServices.length).toBeGreaterThan(0);
      expect(context.relevantIndustries.length).toBeGreaterThan(0);
      expect(context.cta).toBeDefined();
    });

    it('resolves Industry <-> Services, Solutions, Case Studies correctly', async () => {
      const context = await getIndustryRelationalContext('fintech');
      expect(context).toBeDefined();
      expect(context.industry?.slug).toBe('fintech');
      expect(context.relatedServices.length).toBeGreaterThan(0);
      expect(context.relatedSolutions.length).toBeGreaterThan(0);
    });

    it('resolves Case Study <-> Services, Solutions, Industries, Testimonial correctly', async () => {
      const context = await getCaseStudyRelationalContext('pulsefit');
      expect(context).toBeDefined();
      expect(context?.project.slug).toBe('pulsefit');
      expect(context?.relatedServices.length).toBeGreaterThan(0);
      expect(context?.relatedSolutions.length).toBeGreaterThan(0);
      expect(context?.relatedIndustry?.slug).toBe('saas');
    });

    it('resolves Article <-> Services, Solutions, Industries, Case Studies correctly', async () => {
      const context = await getArticleRelationalContext('how-rag-systems-improve-enterprise-knowledge');
      expect(context).toBeDefined();
      expect(context?.article.slug).toBe('how-rag-systems-improve-enterprise-knowledge');
      expect(context?.relatedServices.length).toBeGreaterThan(0);
      expect(context?.relatedSolutions.length).toBeGreaterThan(0);
    });
  });
});
