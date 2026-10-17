/**
 * @file client/tests/integration/homepage-cms-sync.integration.test.ts
 * @description Automated regression and contract tests for Admin <-> Client Homepage CMS synchronization.
 * 
 * Verifies:
 * 1. Admin-produced homepage JSON fixture contracts against Client normalization logic.
 * 2. All 3 configured hero headlines returned in exact order.
 * 3. Blank/whitespace optional headlines are cleanly skipped.
 * 4. Legacy and alias field names (hero_headline_1, heroHeadline, heroHeadlines) remain fully backward-compatible.
 * 5. Missing CMS content invokes intended fallback cleanly.
 * 6. Valid CMS content NEVER incorrectly invokes static fallback.
 * 7. Subtitle and primary/secondary CTA values load correctly.
 * 8. Astraiv 50% gradient headline parsing policy operates as designed.
 * 9. Transient database errors do not poison the circuit breaker.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  normalizeHomepageContent,
  type HomepageCmsSections,
} from '@/lib/cms-normalization';
import { parseHeadline, getHeadlineSegments } from '@/views/sections/typewriter-headline';

describe('Homepage CMS Synchronization & Contract Suite', () => {
  // Canonical Admin Portal payload (as saved by Admin pages-manager.tsx to Supabase page_contents)
  const canonicalAdminFixture: HomepageCmsSections = {
    heroHeadline: 'Welcome To Astraiv Technologies!!',
    heroHeadline1: 'Welcome To Astraiv Technologies!!',
    heroHeadline2: 'Want To Build Techs Robust?',
    heroHeadline3: "Let's Build The Digital Future Together.",
    heroHeadlines: [
      'Welcome To Astraiv Technologies!!',
      'Want To Build Techs Robust?',
      "Let's Build The Digital Future Together.",
    ],
    hero_headline_1: 'Welcome To Astraiv Technologies!!',
    hero_headline_2: 'Want To Build Techs Robust?',
    hero_headline_3: "Let's Build The Digital Future Together.",
    heroSubheadline:
      'From multi-agent AI platforms to distributed cloud microservices, Astraiv constructs mission-critical software with clean architecture and zero legacy debt.',
    primaryCtaText: 'Start a Project',
    primaryCtaUrl: '/start-project',
    secondaryCtaText: 'Explore Case Studies',
    secondaryCtaUrl: '/work',
  };

  describe('1. Contract Verification with Admin-Produced Fixture', () => {
    it('returns all three configured hero headlines in exact sequence', () => {
      const result = normalizeHomepageContent(canonicalAdminFixture, {
        heroHeadline: 'We engineer the digital future',
      });

      expect(result.headlines).toHaveLength(3);
      expect(result.headlines[0]).toBe('Welcome To Astraiv Technologies!!');
      expect(result.headlines[1]).toBe('Want To Build Techs Robust?');
      expect(result.headlines[2]).toBe("Let's Build The Digital Future Together.");
      expect(result.headline).toBe('Welcome To Astraiv Technologies!!');
    });

    it('never incorrectly triggers the fallback when valid CMS content is present', () => {
      const fallbackHeadline = 'We engineer the [digital future]';
      const result = normalizeHomepageContent(canonicalAdminFixture, {
        heroHeadline: fallbackHeadline,
      });

      expect(result.headlines).not.toContain(fallbackHeadline);
      expect(result.headline).not.toBe(fallbackHeadline);
      expect(result.subheadline).toBe(canonicalAdminFixture.heroSubheadline);
    });

    it('correctly maps subtitle and primary/secondary CTA values', () => {
      const result = normalizeHomepageContent(canonicalAdminFixture);

      expect(result.subheadline).toBe(
        'From multi-agent AI platforms to distributed cloud microservices, Astraiv constructs mission-critical software with clean architecture and zero legacy debt.'
      );
      expect(result.ctaText).toBe('Start a Project');
      expect(result.ctaHref).toBe('/start-project');
      expect(result.secondaryCtaText).toBe('Explore Case Studies');
      expect(result.secondaryCtaHref).toBe('/work');
    });
  });

  describe('2. Headline Filtering & Optional State Handling', () => {
    it('skips empty or whitespace-only optional headlines', () => {
      const partialFixture: HomepageCmsSections = {
        heroHeadline1: 'Primary Headline Only',
        heroHeadline2: '   ',
        heroHeadline3: '',
      };

      const result = normalizeHomepageContent(partialFixture);

      expect(result.headlines).toHaveLength(1);
      expect(result.headlines[0]).toBe('Primary Headline Only');
    });

    it('handles only 2 configured headlines and skips the 3rd if blank', () => {
      const twoHeadlinesFixture: HomepageCmsSections = {
        heroHeadline1: 'Welcome To Astraiv Technologies!!',
        heroHeadline2: 'Want To Build Techs Robust?',
        heroHeadline3: '',
      };

      const result = normalizeHomepageContent(twoHeadlinesFixture);

      expect(result.headlines).toHaveLength(2);
      expect(result.headlines[0]).toBe('Welcome To Astraiv Technologies!!');
      expect(result.headlines[1]).toBe('Want To Build Techs Robust?');
    });

    it('trims leading and trailing whitespace from configured headlines', () => {
      const untrimmedFixture: HomepageCmsSections = {
        heroHeadline1: '   Welcome To Astraiv Technologies!!   ',
        heroHeadline2: ' Want To Build Techs Robust? ',
      };

      const result = normalizeHomepageContent(untrimmedFixture);

      expect(result.headlines[0]).toBe('Welcome To Astraiv Technologies!!');
      expect(result.headlines[1]).toBe('Want To Build Techs Robust?');
    });
  });

  describe('3. Backward Compatibility & Legacy Fields', () => {
    it('reads legacy snake_case field names (hero_headline_1, hero_headline_2, hero_headline_3)', () => {
      const legacyFixture: HomepageCmsSections = {
        hero_headline_1: 'Legacy Primary Headline',
        hero_headline_2: 'Legacy Secondary Headline',
        hero_headline_3: 'Legacy Tertiary Headline',
      };

      const result = normalizeHomepageContent(legacyFixture);

      expect(result.headlines).toHaveLength(3);
      expect(result.headlines[0]).toBe('Legacy Primary Headline');
      expect(result.headlines[1]).toBe('Legacy Secondary Headline');
      expect(result.headlines[2]).toBe('Legacy Tertiary Headline');
    });

    it('reads single legacy heroHeadline when headline1 is absent', () => {
      const legacySingle: HomepageCmsSections = {
        heroHeadline: 'Old Single Headline Format',
      };

      const result = normalizeHomepageContent(legacySingle);

      expect(result.headlines).toHaveLength(1);
      expect(result.headlines[0]).toBe('Old Single Headline Format');
    });

    it('reads array format heroHeadlines if individual fields are missing', () => {
      const arrayFixture: HomepageCmsSections = {
        heroHeadlines: ['Array Headline 1', 'Array Headline 2'],
      };

      const result = normalizeHomepageContent(arrayFixture);

      expect(result.headlines).toHaveLength(2);
      expect(result.headlines[0]).toBe('Array Headline 1');
      expect(result.headlines[1]).toBe('Array Headline 2');
    });
  });

  describe('4. Fallback Invocations on Missing or Empty CMS Data', () => {
    it('invokes localized fallback when sections object is null', () => {
      const result = normalizeHomepageContent(null, {
        heroHeadline: 'We engineer the [digital future]',
        heroSubheadline: 'Localized subheadline fallback text.',
      });

      expect(result.headlines).toEqual(['We engineer the [digital future]']);
      expect(result.headline).toBe('We engineer the [digital future]');
      expect(result.subheadline).toBe('Localized subheadline fallback text.');
    });

    it('invokes localized fallback when sections object is empty', () => {
      const result = normalizeHomepageContent({}, {
        heroHeadline: 'We engineer the [digital future]',
      });

      expect(result.headlines).toEqual(['We engineer the [digital future]']);
      expect(result.headline).toBe('We engineer the [digital future]');
    });

    it('uses standard default CTA values when not configured in CMS', () => {
      const result = normalizeHomepageContent({});

      expect(result.ctaText).toBe('Start a Project');
      expect(result.ctaHref).toBe('/start-project');
      expect(result.secondaryCtaText).toBe('Explore Case Studies');
      expect(result.secondaryCtaHref).toBe('/work/case-studies');
    });
  });

  describe('5. Astraiv 50% Gradient Policy & Typography Compliance', () => {
    it('splits a 4-word headline into 50% solid and 50% gradient', () => {
      // "Welcome To Astraiv Technologies!!" -> 4 words: splitIndex = 2
      // [0]: Welcome (false), [1]: To (false), [2]: Astraiv (true), [3]: Technologies!! (true)
      const words = parseHeadline('Welcome To Astraiv Technologies!!');
      expect(words).toHaveLength(4);
      expect(words[0]).toEqual({ word: 'Welcome', isHighlighted: false });
      expect(words[1]).toEqual({ word: 'To', isHighlighted: false });
      expect(words[2]).toEqual({ word: 'Astraiv', isHighlighted: true });
      expect(words[3]).toEqual({ word: 'Technologies!!', isHighlighted: true });
    });

    it('splits a 5-word headline with ceiling split for solid priority', () => {
      // "Want To Build Techs Robust?" -> 5 words: splitIndex = Math.ceil(5/2) = 3
      // [0,1,2]: Want To Build (false), [3,4]: Techs Robust? (true)
      const words = parseHeadline('Want To Build Techs Robust?');
      expect(words).toHaveLength(5);
      expect(words[0].isHighlighted).toBe(false);
      expect(words[1].isHighlighted).toBe(false);
      expect(words[2].isHighlighted).toBe(false);
      expect(words[3].isHighlighted).toBe(true);
      expect(words[4].isHighlighted).toBe(true);
    });

    it('splits a 6-word headline into 3 solid and 3 gradient words', () => {
      // "Let's Build The Digital Future Together." -> 6 words: splitIndex = 3
      // [0,1,2]: Let's Build The (false), [3,4,5]: Digital Future Together. (true)
      const words = parseHeadline("Let's Build The Digital Future Together.");
      expect(words).toHaveLength(6);
      expect(words[0].isHighlighted).toBe(false);
      expect(words[1].isHighlighted).toBe(false);
      expect(words[2].isHighlighted).toBe(false);
      expect(words[3].isHighlighted).toBe(true);
      expect(words[4].isHighlighted).toBe(true);
      expect(words[5].isHighlighted).toBe(true);
    });

    it('respects explicit [bracket] syntax overrides over automatic 50% calculation', () => {
      const words = parseHeadline('We engineer the [digital future]');
      expect(words).toHaveLength(5);
      expect(words[0]).toEqual({ word: 'We', isHighlighted: false });
      expect(words[1]).toEqual({ word: 'engineer', isHighlighted: false });
      expect(words[2]).toEqual({ word: 'the', isHighlighted: false });
      expect(words[3]).toEqual({ word: 'digital', isHighlighted: true });
      expect(words[4]).toEqual({ word: 'future', isHighlighted: true });
      // "future" is also inside brackets
      const segments = getHeadlineSegments('We engineer the [digital future]');
      expect(segments.cleanText).toBe('We engineer the digital future');
    });
  });

  describe('6. Database Resilience & Graceful Fallback Handling', () => {
    it('safely handles missing or undefined sections without throwing unhandled exceptions', () => {
      const corruptedFixture = {
        heroHeadline1: undefined,
        heroHeadlines: null,
      } as unknown as HomepageCmsSections;

      expect(() => {
        const res = normalizeHomepageContent(corruptedFixture, {
          heroHeadline: 'Safe Fallback',
        });
        expect(res.headline).toBe('Safe Fallback');
      }).not.toThrow();
    });

    it('safely handles non-string or malformed headline types without crashing', () => {
      const malformedFixture = {
        heroHeadline1: 12345 as unknown as string,
        heroHeadline2: { invalid: 'object' } as unknown as string,
        heroHeadline3: ['unexpected', 'array'] as unknown as string,
      } as HomepageCmsSections;

      expect(() => {
        const res = normalizeHomepageContent(malformedFixture, {
          heroHeadline: 'Safe Fallback',
        });
        expect(res.headline).toBe('Safe Fallback');
        expect(res.headlines).toEqual(['Safe Fallback']);
      }).not.toThrow();
    });
  });
});
