import { describe, it, expect } from 'vitest';
import { CANONICAL_PROCESS_STAGES } from './process-data';
import { WHY_ASTRAIV_PILLARS } from './why-astraiv-data';
import { CANONICAL_FAQS, getFaqsByCategory, getFeaturedFaqs } from './faq-data';
import { DEFAULT_SERVICES } from './services-data';

describe('Canonical Process Stages', () => {
  it('should have exactly 6 canonical stages', () => {
    expect(CANONICAL_PROCESS_STAGES).toHaveLength(6);
  });

  it('should follow the canonical sequence: Discover -> Strategize -> Design -> Build -> Launch -> Scale', () => {
    const expectedStages = ['Discover', 'Strategize', 'Design', 'Build', 'Launch', 'Scale'];
    const actualStages = CANONICAL_PROCESS_STAGES.map((s) => s.title);
    expect(actualStages).toEqual(expectedStages);
  });

  it('each stage should have summary, detailedDesc, qualityGates, and keyDeliverables', () => {
    for (const stage of CANONICAL_PROCESS_STAGES) {
      expect(stage.summary).toBeTruthy();
      expect(stage.detailedDesc).toBeTruthy();
      expect(stage.qualityGates.length).toBeGreaterThan(0);
      expect(stage.keyDeliverables.length).toBeGreaterThan(0);
    }
  });
});

describe('Canonical Why Astraiv Pillars', () => {
  it('should have 4 pillars with both summary and complete descriptions', () => {
    expect(WHY_ASTRAIV_PILLARS).toHaveLength(4);
    for (const pillar of WHY_ASTRAIV_PILLARS) {
      expect(pillar.summary).toBeTruthy();
      expect(pillar.completeDescription).toBeTruthy();
      expect(pillar.tenets.length).toBeGreaterThan(0);
      expect(pillar.metrics.label).toBeTruthy();
      expect(pillar.metrics.value).toBeTruthy();
    }
  });
});

describe('Canonical FAQs', () => {
  it('should return all FAQs when no category or "all" is specified', () => {
    expect(getFaqsByCategory()).toEqual(CANONICAL_FAQS);
    expect(getFaqsByCategory('all')).toEqual(CANONICAL_FAQS);
  });

  it('should filter correctly by category', () => {
    const pricingFaqs = getFaqsByCategory('pricing');
    expect(pricingFaqs.length).toBeGreaterThan(0);
    for (const faq of pricingFaqs) {
      expect(faq.category).toBe('pricing');
    }
  });

  it('should return featured FAQs', () => {
    const featured = getFeaturedFaqs();
    expect(featured.length).toBeGreaterThan(0);
    for (const faq of featured) {
      expect(faq.isFeatured).toBe(true);
    }
  });
});

describe('Canonical Services Data', () => {
  it('should have 8 core services defined with unique slugs', () => {
    expect(DEFAULT_SERVICES).toHaveLength(8);
    const slugs = DEFAULT_SERVICES.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);

    for (const service of DEFAULT_SERVICES) {
      expect(service.slug).toBeTruthy();
      expect(service.title).toBeTruthy();
      expect(service.deliverables?.length).toBeGreaterThan(0);
      expect(service.techStack?.length).toBeGreaterThan(0);
    }
  });
});
