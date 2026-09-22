import { describe, it, expect } from 'vitest';
import {
  createPageMetadata,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
  getBreadcrumbJsonLd,
  getArticleJsonLd,
  getServiceJsonLd,
  getJobPostingJsonLd,
  getFaqJsonLd,
} from './seo';

describe('SEO Library & Schema Generators', () => {
  describe('createPageMetadata', () => {
    it('creates canonical URL and hreflang alternates correctly', () => {
      const meta = createPageMetadata({
        title: 'Custom Software Engineering',
        description: 'Bespoke enterprise engineering services.',
        path: '/services/custom-software',
        locale: 'es',
      });

      expect(meta.title).toEqual({
        absolute: 'Custom Software Engineering | Astraiv Technologies',
      });
      expect(meta.description).toBe('Bespoke enterprise engineering services.');
      expect(meta.alternates?.canonical).toBe(
        'https://www.astraivtechnologies.com/es/services/custom-software'
      );
      expect(meta.alternates?.languages?.['en']).toBe(
        'https://www.astraivtechnologies.com/en/services/custom-software'
      );
      expect(meta.alternates?.languages?.['es']).toBe(
        'https://www.astraivtechnologies.com/es/services/custom-software'
      );
      expect(meta.alternates?.languages?.['x-default']).toBe(
        'https://www.astraivtechnologies.com/en/services/custom-software'
      );
    });

    it('prevents duplicate brand suffix when brand name is already present in title', () => {
      const meta = createPageMetadata({
        title: 'Start a Project | Astraiv Technologies',
        path: '/start-project',
        locale: 'en',
      });

      expect(meta.title).toEqual({
        absolute: 'Start a Project | Astraiv Technologies',
      });
    });

    it('sets robots to noindex and nofollow when noIndex is true', () => {
      const meta = createPageMetadata({
        title: 'Thank You | Astraiv Technologies',
        path: '/thank-you',
        noIndex: true,
      });

      expect(meta.robots).toEqual({
        index: false,
        follow: false,
      });
    });
  });

  describe('JSON-LD Schema Generators', () => {
    it('generates valid Organization JSON-LD with correct social links and address', () => {
      const org = getOrganizationJsonLd();
      expect(org['@type']).toBe('Organization');
      expect(org.name).toBe('Astraiv Technologies');
      expect(org.url).toBe('https://www.astraivtechnologies.com');
      expect(org.address.addressLocality).toBe('Kolkata');
      expect(org.contactPoint.length).toBeGreaterThan(0);
    });

    it('generates valid WebSite JSON-LD', () => {
      const web = getWebSiteJsonLd('es');
      expect(web['@type']).toBe('WebSite');
      expect(web.url).toBe('https://www.astraivtechnologies.com/es');
      expect(web.inLanguage).toBe('es');
    });

    it('generates valid BreadcrumbList JSON-LD with 1-based positions', () => {
      const crumbs = getBreadcrumbJsonLd(
        [
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: 'Case Studies', path: '/work/case-studies' },
        ],
        'en'
      );

      expect(crumbs['@type']).toBe('BreadcrumbList');
      expect(crumbs.itemListElement).toHaveLength(3);
      expect(crumbs.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.astraivtechnologies.com/en',
      });
      expect(crumbs.itemListElement[2]).toEqual({
        '@type': 'ListItem',
        position: 3,
        name: 'Case Studies',
        item: 'https://www.astraivtechnologies.com/en/work/case-studies',
      });
    });

    it('generates valid Article JSON-LD', () => {
      const article = getArticleJsonLd(
        {
          title: 'Building Real-Time AI Systems',
          excerpt: 'Architectural patterns for sub-100ms inference.',
          slug: 'building-real-time-ai',
          publishedAt: '2026-09-01T00:00:00Z',
          author: { name: 'Dr. Jane Doe', role: 'Chief AI Architect' },
        },
        'en'
      );

      expect(article['@type']).toBe('TechArticle');
      expect(article.headline).toBe('Building Real-Time AI Systems');
      expect(article.mainEntityOfPage['@id']).toBe(
        'https://www.astraivtechnologies.com/en/insights/building-real-time-ai'
      );
      expect(article.author.name).toBe('Dr. Jane Doe');
    });

    it('generates valid Service JSON-LD with path or slug support', () => {
      const srv = getServiceJsonLd(
        {
          title: 'Healthcare IT Modernization',
          description: 'HIPAA-compliant cloud migration.',
          path: '/industries/healthcare',
        },
        'en'
      );

      expect(srv['@type']).toBe('Service');
      expect(srv.name).toBe('Healthcare IT Modernization');
      expect(srv.description).toBe('HIPAA-compliant cloud migration.');
      expect(srv.url).toBe(
        'https://www.astraivtechnologies.com/en/industries/healthcare'
      );
    });

    it('generates valid JobPosting JSON-LD', () => {
      const job = getJobPostingJsonLd(
        {
          title: 'Principal Distributed Systems Engineer',
          description: 'Design multi-region systems.',
          slug: 'principal-engineer',
          department: 'Engineering',
          type: 'Full-Time',
          location: 'Remote',
          salary: '$180,000 - $220,000',
        },
        'en'
      );

      expect(job['@type']).toBe('JobPosting');
      expect(job.title).toBe('Principal Distributed Systems Engineer');
      expect(job.jobLocationType).toBe('TELECOMMUTE');
      expect(job.employmentType).toBe('FULL_TIME');
      expect(job.baseSalary?.value?.value).toBe('$180,000 - $220,000');
    });

    it('generates valid FAQPage JSON-LD', () => {
      const faq = getFaqJsonLd([
        {
          question: 'Who owns the IP?',
          answer: 'The client owns 100% of custom code upon invoice settlement.',
        },
      ]);

      expect(faq['@type']).toBe('FAQPage');
      expect(faq.mainEntity).toHaveLength(1);
      expect(faq.mainEntity[0].name).toBe('Who owns the IP?');
    });
  });
});
