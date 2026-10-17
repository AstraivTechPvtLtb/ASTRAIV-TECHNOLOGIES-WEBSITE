/**
 * @file client/src/lib/cms-normalization.ts
 * @description Normalization and extraction utilities for CMS page sections.
 * Ensures consistent backward-compatibility between Admin-configured JSON payloads
 * and Client view models.
 */

import { ROUTES } from '@/routes';

export interface HomepageCmsSections {
  heroHeadline?: string;
  heroHeadline1?: string;
  heroHeadline2?: string;
  heroHeadline3?: string;
  heroHeadlines?: string[];
  hero_headline_1?: string;
  hero_headline_2?: string;
  hero_headline_3?: string;
  heroSubheadline?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  [key: string]: unknown;
}

export interface NormalizedHomepageContent {
  headlines: string[];
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

export interface HomepageFallbacks {
  heroHeadline?: string;
  heroSubheadline?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export function normalizeHomepageContent(
  sections: HomepageCmsSections | null | undefined,
  fallbacks: HomepageFallbacks = {}
): NormalizedHomepageContent {
  const sec = sections || {};

  // Extract and normalize hero headlines with comprehensive backward compatibility
  const rawHeadlines: string[] = [];

  const h1 = (sec.heroHeadline1 || sec.hero_headline_1 || sec.heroHeadline) as string | undefined;
  if (h1 && typeof h1 === 'string' && h1.trim()) rawHeadlines.push(h1.trim());

  const h2 = (sec.heroHeadline2 || sec.hero_headline_2) as string | undefined;
  if (h2 && typeof h2 === 'string' && h2.trim()) rawHeadlines.push(h2.trim());

  const h3 = (sec.heroHeadline3 || sec.hero_headline_3) as string | undefined;
  if (h3 && typeof h3 === 'string' && h3.trim()) rawHeadlines.push(h3.trim());

  // Fallback to array format if individual fields were not provided
  if (rawHeadlines.length === 0 && Array.isArray(sec.heroHeadlines)) {
    for (const item of sec.heroHeadlines) {
      if (typeof item === 'string' && item.trim()) rawHeadlines.push(item.trim());
    }
  }

  const defaultHeadline = fallbacks.heroHeadline || 'We Engineer High-Performance Enterprise Software & AI Systems';
  const headlines = rawHeadlines.length > 0 ? rawHeadlines : [defaultHeadline];
  const headline = headlines[0];

  const subheadline =
    ((sec.heroSubheadline as string)?.trim()) ||
    fallbacks.heroSubheadline ||
    'From multi-agent AI platforms to distributed cloud microservices, Astraiv constructs mission-critical software with clean architecture and zero legacy debt.';

  const ctaText =
    ((sec.primaryCtaText as string)?.trim()) ||
    fallbacks.primaryCtaText ||
    'Start a Project';

  const ctaHref =
    ((sec.primaryCtaUrl as string)?.trim()) ||
    fallbacks.primaryCtaUrl ||
    ROUTES.PUBLIC.START_PROJECT;

  const secondaryCtaText =
    ((sec.secondaryCtaText as string)?.trim()) ||
    fallbacks.secondaryCtaText ||
    'Explore Case Studies';

  const secondaryCtaHref =
    ((sec.secondaryCtaUrl as string)?.trim()) ||
    fallbacks.secondaryCtaUrl ||
    ROUTES.PUBLIC.CASE_STUDIES;

  return {
    headlines,
    headline,
    subheadline,
    ctaText,
    ctaHref,
    secondaryCtaText,
    secondaryCtaHref,
  };
}
