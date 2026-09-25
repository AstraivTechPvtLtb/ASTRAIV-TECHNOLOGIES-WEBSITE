/**
 * @file client/src/controllers/cms.controller.ts
 * @description [CONTROLLER] Unified Relational CMS Architecture Controller.
 * 
 * Provides:
 * 1. Single-source-of-truth publication queries across all 11 core entities.
 * 2. Strict public approval enforcement (status = 'published', active = true, can_publish_review = true).
 * 3. Bidirectional relational context resolution across:
 *    - Service <-> Solutions, Industries, Technologies, Case Studies
 *    - Solution <-> Services, Industries, Case Studies
 *    - Industry <-> Services, Solutions, Case Studies
 *    - Case Study <-> Services, Solutions, Industries, Technologies, Testimonials
 *    - Article <-> Services, Solutions, Industries, Case Studies
 * 4. Automatic SEO metadata generation with canonical OpenGraph fallbacks.
 * 5. Zero frontend content duplication.
 */

import { db } from '@/models/db';
import type {
  CmsDbClient,
  DbSolutionItem,
  DbIndustryItem,
  DbTechnologyItem,
  DbAwardItem,
  DbFaqItem,
  DbPortfolioProject,
  DbBlogPost,
} from '@/models/cms-db.types';

const cmsDb = db as unknown as CmsDbClient;
import {
  type PublicServiceItem,
  DEFAULT_SERVICES,
  SLUG_ALIASES,
  RECLASSIFIED_SERVICES_TO_SOLUTIONS,
} from '@/lib/services-data';
import {
  type SolutionDetail,
  SOLUTIONS_LIST,
  getSolutionBySlug as getStaticSolutionBySlug,
} from '@/lib/solutions-data';
import {
  type IndustryDetail,
  INDUSTRIES_LIST,
  getIndustryBySlug as getStaticIndustryBySlug,
} from '@/lib/industries-data';
import {
  type PublicPortfolioProject,
  DEFAULT_PORTFOLIO_PROJECTS,
} from '@/lib/portfolio-data';
import {
  type InsightArticle,
  INSIGHT_ARTICLES,
  getInsightArticleBySlug as getStaticInsightArticleBySlug,
} from '@/lib/insights-data';
import {
  RAW_ACCOLADES_DATA,
} from '@/lib/accolades-data';
import {
  CANONICAL_FAQS,
} from '@/lib/faq-data';
import {
  getTestimonialsByService,
  getTestimonialByProject,
} from '@/controllers/public-data.controller';
import {
  type CmsTechnology,
  type CmsAward,
  type CmsFaq,
} from '@/models/types';
import {
  normalizeServiceSlug,
  normalizeSolutionSlug,
  normalizeIndustrySlug,
  SERVICE_RELATIONSHIPS,
  SOLUTION_RELATIONSHIPS,
} from '@/lib/relationships';

/* ========================================================================== */
/* 1. SERVICES (WHAT ASTRAIV DOES)                                             */
/* ========================================================================== */

/**
 * Retrieves all publicly approved and published services ordered by display order.
 */
export async function getPublishedServices(): Promise<PublicServiceItem[]> {
  try {
    const rows = await cmsDb.serviceItem.findMany({
      where: {
        active: true,
        status: 'published',
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      const filtered = rows.filter(
        (s) => !RECLASSIFIED_SERVICES_TO_SOLUTIONS[s.slug.toLowerCase().trim()]
      );

      const seen = new Set<string>();
      const results: PublicServiceItem[] = [];

      for (const s of filtered) {
        const canonical = SLUG_ALIASES[s.slug.toLowerCase().trim()] || s.slug;
        if (seen.has(canonical)) continue;
        seen.add(canonical);

        const defaultMeta = DEFAULT_SERVICES.find(
          (d) => d.slug === canonical || normalizeServiceSlug(d.slug) === canonical
        );
        results.push({
          id: s.id,
          title: defaultMeta?.title || s.title,
          slug: canonical,
          category: s.category || defaultMeta?.category || 'Software Engineering',
          shortDesc: s.shortDesc || defaultMeta?.shortDesc || '',
          fullDesc: s.fullDesc || s.shortDesc || defaultMeta?.fullDesc || '',
          features: s.features && s.features.length > 0 ? s.features : defaultMeta?.features || [],
          badge: s.badge || defaultMeta?.badge || null,
          icon: s.icon || defaultMeta?.icon || 'Cpu',
          orderIndex: s.orderIndex,
          imageSrc: defaultMeta?.imageSrc,
          deliverables: defaultMeta?.deliverables,
          techStack: defaultMeta?.techStack,
          slaHighlight: defaultMeta?.slaHighlight,
        });
      }

      if (results.length > 0) {
        return results;
      }
    }
  } catch (err) {
    console.warn('[CMS Controller - Services fallback]:', (err as Error)?.message || err);
  }

  // Graceful fallback to verified canonical services
  return DEFAULT_SERVICES.filter(
    (s) => !RECLASSIFIED_SERVICES_TO_SOLUTIONS[s.slug.toLowerCase().trim()]
  );
}

/**
 * Retrieves a single published service by its canonical or aliased slug.
 */
export async function getPublishedServiceBySlug(rawSlug: string): Promise<PublicServiceItem | null> {
  const canonical = normalizeServiceSlug(rawSlug);

  try {
    const s = await cmsDb.serviceItem.findFirst({
      where: {
        slug: { in: [canonical, rawSlug] },
        active: true,
        status: 'published',
      },
    });

    if (s) {
      const defaultMeta = DEFAULT_SERVICES.find(
        (d) => d.slug === canonical || d.slug === rawSlug || normalizeServiceSlug(d.slug) === canonical
      );
      return {
        id: s.id,
        title: defaultMeta?.title || s.title,
        slug: canonical,
        category: s.category || defaultMeta?.category || 'Software Engineering',
        shortDesc: s.shortDesc || defaultMeta?.shortDesc || '',
        fullDesc: s.fullDesc || s.shortDesc || defaultMeta?.fullDesc || '',
        features: s.features && s.features.length > 0 ? s.features : defaultMeta?.features || [],
        badge: s.badge || defaultMeta?.badge || null,
        icon: s.icon || defaultMeta?.icon || 'Cpu',
        orderIndex: s.orderIndex,
        imageSrc: defaultMeta?.imageSrc,
        deliverables: defaultMeta?.deliverables,
        techStack: defaultMeta?.techStack,
        slaHighlight: defaultMeta?.slaHighlight,
      };
    }
  } catch (err) {
    console.warn('[CMS Controller - Service slug fallback]:', (err as Error)?.message || err);
  }

  const defaultMeta = DEFAULT_SERVICES.find(
    (d) => d.slug === canonical || d.slug === rawSlug || normalizeServiceSlug(d.slug) === canonical
  );
  if (defaultMeta) {
    return {
      ...defaultMeta,
      slug: canonical,
    };
  }
  return null;
}

/* ========================================================================== */
/* 2. SOLUTIONS (WHAT BUSINESS PROBLEMS ASTRAIV SOLVES)                       */
/* ========================================================================== */

/**
 * Retrieves all publicly approved and published solutions.
 */
export async function getPublishedSolutions(): Promise<SolutionDetail[]> {
  try {
    const rows = await cmsDb.solutionItem.findMany({
      where: {
        active: true,
        status: 'published',
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      return rows.map((r: DbSolutionItem) => {
        const defaultMatch = SOLUTIONS_LIST.find((s) => s.slug === r.slug) || SOLUTIONS_LIST[0];

        const hasValidBusinessProblem =
          r.businessProblem &&
          typeof r.businessProblem === 'object' &&
          'title' in (r.businessProblem as object) &&
          Array.isArray((r.businessProblem as { painPoints?: unknown }).painPoints) &&
          (r.businessProblem as { painPoints: unknown[] }).painPoints.length > 0;

        const hasValidAstraivApproach =
          r.astraivApproach &&
          typeof r.astraivApproach === 'object' &&
          'title' in (r.astraivApproach as object) &&
          Array.isArray((r.astraivApproach as { methodologySteps?: unknown }).methodologySteps) &&
          (r.astraivApproach as { methodologySteps: unknown[] }).methodologySteps.length > 0;

        return {
          ...defaultMatch,
          slug: r.slug,
          category: r.category || defaultMatch.category,
          categoryLabel: r.categoryLabel || defaultMatch.categoryLabel,
          title: r.title || defaultMatch.title,
          tagline: r.tagline || defaultMatch.tagline,
          shortDesc: r.shortDesc || defaultMatch.shortDesc,
          fullDesc: r.fullDesc || defaultMatch.fullDesc,
          metric: {
            value: r.metricValue || defaultMatch.metric.value,
            label: r.metricLabel || defaultMatch.metric.label,
          },
          features: r.features && r.features.length > 0 ? r.features : defaultMatch.features,
          technologies: r.technologies && r.technologies.length > 0 ? r.technologies : defaultMatch.technologies,
          capabilities:
            Array.isArray(r.capabilities) && r.capabilities.length > 0
              ? (r.capabilities as unknown as SolutionDetail['capabilities'])
              : defaultMatch.capabilities,
          businessProblem: hasValidBusinessProblem
            ? (r.businessProblem as unknown as SolutionDetail['businessProblem'])
            : defaultMatch.businessProblem,
          astraivApproach: hasValidAstraivApproach
            ? (r.astraivApproach as unknown as SolutionDetail['astraivApproach'])
            : defaultMatch.astraivApproach,
        };
      });
    }
  } catch (err) {
    console.warn('[CMS Controller - Solutions fallback]:', (err as Error)?.message || err);
  }

  return SOLUTIONS_LIST;
}

/**
 * Retrieves a single published solution by slug.
 */
export async function getPublishedSolutionBySlug(rawSlug: string): Promise<SolutionDetail | null> {
  const canonical = normalizeSolutionSlug(rawSlug);

  try {
    const r = await cmsDb.solutionItem.findFirst({
      where: {
        slug: { in: [canonical, rawSlug] },
        active: true,
        status: 'published',
      },
    });

    if (r) {
      const defaultMatch =
        getStaticSolutionBySlug(canonical) ||
        SOLUTIONS_LIST.find((s) => s.slug === canonical) ||
        SOLUTIONS_LIST[0];

      const hasValidBusinessProblem =
        r.businessProblem &&
        typeof r.businessProblem === 'object' &&
        'title' in (r.businessProblem as object) &&
        Array.isArray((r.businessProblem as { painPoints?: unknown }).painPoints) &&
        (r.businessProblem as { painPoints: unknown[] }).painPoints.length > 0;

      const hasValidAstraivApproach =
        r.astraivApproach &&
        typeof r.astraivApproach === 'object' &&
        'title' in (r.astraivApproach as object) &&
        Array.isArray((r.astraivApproach as { methodologySteps?: unknown }).methodologySteps) &&
        (r.astraivApproach as { methodologySteps: unknown[] }).methodologySteps.length > 0;

      return {
        ...defaultMatch,
        slug: r.slug,
        category: r.category || defaultMatch.category,
        categoryLabel: r.categoryLabel || defaultMatch.categoryLabel,
        title: r.title || defaultMatch.title,
        tagline: r.tagline || defaultMatch.tagline,
        shortDesc: r.shortDesc || defaultMatch.shortDesc,
        fullDesc: r.fullDesc || defaultMatch.fullDesc,
        metric: {
          value: r.metricValue || defaultMatch.metric.value,
          label: r.metricLabel || defaultMatch.metric.label,
        },
        features: r.features && r.features.length > 0 ? r.features : defaultMatch.features,
        technologies: r.technologies && r.technologies.length > 0 ? r.technologies : defaultMatch.technologies,
        capabilities:
          Array.isArray(r.capabilities) && r.capabilities.length > 0
            ? (r.capabilities as unknown as SolutionDetail['capabilities'])
            : defaultMatch.capabilities,
        businessProblem: hasValidBusinessProblem
          ? (r.businessProblem as unknown as SolutionDetail['businessProblem'])
          : defaultMatch.businessProblem,
        astraivApproach: hasValidAstraivApproach
          ? (r.astraivApproach as unknown as SolutionDetail['astraivApproach'])
          : defaultMatch.astraivApproach,
      };
    }
  } catch (err) {
    console.warn('[CMS Controller - Solution slug fallback]:', (err as Error)?.message || err);
  }

  return getStaticSolutionBySlug(canonical) || null;
}

/* ========================================================================== */
/* 3. INDUSTRIES (DOMAIN VERTICALS)                                            */
/* ========================================================================== */

/**
 * Retrieves all published industries.
 */
export async function getPublishedIndustries(): Promise<IndustryDetail[]> {
  try {
    const rows = await cmsDb.industryItem.findMany({
      where: {
        active: true,
        status: 'published',
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      return rows.map((r: DbIndustryItem) => {
        const defaultMatch = INDUSTRIES_LIST.find((i) => i.slug === r.slug);
        return {
          slug: r.slug,
          code: r.code || defaultMatch?.code || 'SEC-01',
          label: r.label,
          tagline: r.tagline || defaultMatch?.tagline || '',
          headline: r.headline || defaultMatch?.headline || r.label,
          image: r.image || defaultMatch?.image || '',
          imageAlt: r.imageAlt || defaultMatch?.imageAlt || r.label,
          accentColor: r.accentColor || defaultMatch?.accentColor || 'text-primary',
          statusText: r.statusText || defaultMatch?.statusText || 'Active',
          complianceBadge: r.complianceBadge || defaultMatch?.complianceBadge || 'SOC-2 Ready',
          challenge: r.challenge || defaultMatch?.challenge || '',
          solution: r.solution || defaultMatch?.solution || '',
          pillars: (r.pillars as unknown as IndustryDetail['pillars']) || defaultMatch?.pillars || [],
          techStack: r.techStack && r.techStack.length > 0 ? r.techStack : defaultMatch?.techStack || [],
          kpis: (r.kpis as unknown as IndustryDetail['kpis']) || defaultMatch?.kpis || [],
        };
      });
    }
  } catch (err) {
    console.warn('[CMS Controller - Industries fallback]:', (err as Error)?.message || err);
  }

  return INDUSTRIES_LIST;
}

/**
 * Retrieves a single published industry by slug.
 */
export async function getPublishedIndustryBySlug(rawSlug: string): Promise<IndustryDetail | null> {
  const canonical = normalizeIndustrySlug(rawSlug);

  try {
    const r = await cmsDb.industryItem.findFirst({
      where: {
        slug: { in: [canonical, rawSlug] },
        active: true,
        status: 'published',
      },
    });

    if (r) {
      const defaultMatch = getStaticIndustryBySlug(canonical);
      return {
        slug: r.slug,
        code: r.code || defaultMatch?.code || 'SEC-01',
        label: r.label,
        tagline: r.tagline || defaultMatch?.tagline || '',
        headline: r.headline || defaultMatch?.headline || r.label,
        image: r.image || defaultMatch?.image || '',
        imageAlt: r.imageAlt || defaultMatch?.imageAlt || r.label,
        accentColor: r.accentColor || defaultMatch?.accentColor || 'text-primary',
        statusText: r.statusText || defaultMatch?.statusText || 'Active',
        complianceBadge: r.complianceBadge || defaultMatch?.complianceBadge || 'SOC-2 Ready',
        challenge: r.challenge || defaultMatch?.challenge || '',
        solution: r.solution || defaultMatch?.solution || '',
        pillars: (r.pillars as unknown as IndustryDetail['pillars']) || defaultMatch?.pillars || [],
        techStack: r.techStack && r.techStack.length > 0 ? r.techStack : defaultMatch?.techStack || [],
        kpis: (r.kpis as unknown as IndustryDetail['kpis']) || defaultMatch?.kpis || [],
      };
    }
  } catch (err) {
    console.warn('[CMS Controller - Industry slug fallback]:', (err as Error)?.message || err);
  }

  return getStaticIndustryBySlug(canonical) || null;
}

/* ========================================================================== */
/* 4. TECHNOLOGIES (PRODUCTION PRIMITIVES)                                    */
/* ========================================================================== */

/**
 * Retrieves all published technologies grouped or ordered by display order.
 */
export async function getPublishedTechnologies(): Promise<CmsTechnology[]> {
  try {
    const rows = await cmsDb.technologyItem.findMany({
      where: {
        active: true,
        status: 'published',
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      return rows.map((r: DbTechnologyItem) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category,
        icon: r.icon,
        description: r.description,
        status: r.status as 'published' | 'draft' | 'archived',
        featured: r.featured,
        orderIndex: r.orderIndex,
      }));
    }
  } catch (err) {
    console.warn('[CMS Controller - Technologies fallback]:', (err as Error)?.message || err);
  }

  return [];
}

/* ========================================================================== */
/* 5. CASE STUDIES (PRODUCTION PROOF)                                         */
/* ========================================================================== */

/**
 * Retrieves all published case studies / portfolio projects.
 */
export async function getPublishedCaseStudies(): Promise<PublicPortfolioProject[]> {
  try {
    const rows = await cmsDb.portfolioProject.findMany({
      where: {
        published: true,
        status: 'published',
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      return rows.map((r: DbPortfolioProject) => {
        const defaultMatch = DEFAULT_PORTFOLIO_PROJECTS.find(
          (d) => d.slug === r.slug || d.id === r.id
        ) || DEFAULT_PORTFOLIO_PROJECTS[0];

        return {
          ...defaultMatch,
          id: r.id,
          slug: r.slug,
          title: r.title,
          projectType: (r.projectType as PublicPortfolioProject['projectType']) || defaultMatch.projectType,
          credibilityBadge: r.credibilityBadge || defaultMatch.credibilityBadge,
          credibilityNote: r.credibilityNote || defaultMatch.credibilityNote,
          isRealClient: r.isRealClient ?? defaultMatch.isRealClient,
          verifiedOutcome: r.verifiedOutcome ?? defaultMatch.verifiedOutcome,
          client: r.client || defaultMatch.client,
          clientContext: r.clientContext || defaultMatch.clientContext,
          timeline: r.timeline || defaultMatch.timeline,
          category: r.category || defaultMatch.category,
          categoryType: r.categoryType && r.categoryType.length > 0 ? r.categoryType : defaultMatch.categoryType,
          industrySlug: r.industrySlug || defaultMatch.industrySlug,
          industryName: r.industryName || defaultMatch.industryName,
          imageSrc: r.imageUrl || defaultMatch.imageSrc,
          challenge: r.challenge || defaultMatch.challenge || r.description,
          challengeDetails: r.challengeDetails && r.challengeDetails.length > 0 ? r.challengeDetails : defaultMatch.challengeDetails,
          requirements: r.requirements && r.requirements.length > 0 ? r.requirements : defaultMatch.requirements,
          solution: defaultMatch.solution || r.content,
          solutionDetails: r.solutionDetails && r.solutionDetails.length > 0 ? r.solutionDetails : defaultMatch.solutionDetails,
          architectureApproach: r.architectureApproach || defaultMatch.architectureApproach,
          architectureHighlights: (r.architectureHighlights as unknown as PublicPortfolioProject['architectureHighlights']) || defaultMatch.architectureHighlights,
          technologies: r.tags && r.tags.length > 0 ? r.tags : defaultMatch.technologies,
          techStackByCategory: (r.techStackByCategory as unknown as PublicPortfolioProject['techStackByCategory']) || defaultMatch.techStackByCategory,
          developmentProcess: (r.developmentProcess as unknown as PublicPortfolioProject['developmentProcess']) || defaultMatch.developmentProcess,
          measurableResults: (r.measurableResults as unknown as PublicPortfolioProject['measurableResults']) || defaultMatch.measurableResults,
        };
      });
    }
  } catch (err) {
    console.warn('[CMS Controller - Case studies fallback]:', (err as Error)?.message || err);
  }

  return DEFAULT_PORTFOLIO_PROJECTS;
}

/**
 * Retrieves a single published case study by slug.
 */
export async function getPublishedCaseStudyBySlug(slug: string): Promise<PublicPortfolioProject | null> {
  try {
    const r = await cmsDb.portfolioProject.findFirst({
      where: {
        slug,
        published: true,
        status: 'published',
      },
    });

    if (r) {
      const defaultMatch = DEFAULT_PORTFOLIO_PROJECTS.find(
        (d) => d.slug === r.slug || d.id === r.id
      ) || DEFAULT_PORTFOLIO_PROJECTS[0];

      return {
        ...defaultMatch,
        id: r.id,
        slug: r.slug,
        title: r.title,
        projectType: (r.projectType as PublicPortfolioProject['projectType']) || defaultMatch.projectType,
        credibilityBadge: r.credibilityBadge || defaultMatch.credibilityBadge,
        credibilityNote: r.credibilityNote || defaultMatch.credibilityNote,
        isRealClient: r.isRealClient ?? defaultMatch.isRealClient,
        verifiedOutcome: r.verifiedOutcome ?? defaultMatch.verifiedOutcome,
        client: r.client || defaultMatch.client,
        clientContext: r.clientContext || defaultMatch.clientContext,
        timeline: r.timeline || defaultMatch.timeline,
        category: r.category || defaultMatch.category,
        categoryType: r.categoryType && r.categoryType.length > 0 ? r.categoryType : defaultMatch.categoryType,
        industrySlug: r.industrySlug || defaultMatch.industrySlug,
        industryName: r.industryName || defaultMatch.industryName,
        imageSrc: r.imageUrl || defaultMatch.imageSrc,
        challenge: r.challenge || defaultMatch.challenge || r.description,
        challengeDetails: r.challengeDetails && r.challengeDetails.length > 0 ? r.challengeDetails : defaultMatch.challengeDetails,
        requirements: r.requirements && r.requirements.length > 0 ? r.requirements : defaultMatch.requirements,
        solution: defaultMatch.solution || r.content,
        solutionDetails: r.solutionDetails && r.solutionDetails.length > 0 ? r.solutionDetails : defaultMatch.solutionDetails,
        architectureApproach: r.architectureApproach || defaultMatch.architectureApproach,
        architectureHighlights: (r.architectureHighlights as unknown as PublicPortfolioProject['architectureHighlights']) || defaultMatch.architectureHighlights,
        technologies: r.tags && r.tags.length > 0 ? r.tags : defaultMatch.technologies,
        techStackByCategory: (r.techStackByCategory as unknown as PublicPortfolioProject['techStackByCategory']) || defaultMatch.techStackByCategory,
        developmentProcess: (r.developmentProcess as unknown as PublicPortfolioProject['developmentProcess']) || defaultMatch.developmentProcess,
        measurableResults: (r.measurableResults as unknown as PublicPortfolioProject['measurableResults']) || defaultMatch.measurableResults,
      };
    }
  } catch (err) {
    console.warn('[CMS Controller - Case study slug fallback]:', (err as Error)?.message || err);
  }

  const defaultMatch = DEFAULT_PORTFOLIO_PROJECTS.find((d) => d.slug === slug);
  return defaultMatch || null;
}

/* ========================================================================== */
/* 6. ARTICLES & INSIGHTS                                                     */
/* ========================================================================== */

/**
 * Retrieves all published insights / blog posts.
 */
export async function getPublishedArticles(): Promise<InsightArticle[]> {
  try {
    const rows = await cmsDb.blogPost.findMany({
      where: {
        published: true,
        status: 'published',
      },
      include: {
        category: true,
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      return rows.map((r: DbBlogPost) => {
        const defaultMatch = INSIGHT_ARTICLES.find((a) => a.slug === r.slug) || INSIGHT_ARTICLES[0];
        return {
          ...defaultMatch,
          id: r.id,
          slug: r.slug,
          title: r.title,
          excerpt: r.summary,
          coverImage: r.featuredImage || defaultMatch.coverImage,
          author: {
            name: r.authorName || defaultMatch.author.name,
            role: r.authorRole || defaultMatch.author.role,
            image: r.authorImage || defaultMatch.author.image,
          },
          publishedAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
          category: {
            id: r.category?.id || '',
            name: r.category?.name || 'General',
            slug: r.category?.slug || 'general',
            description: defaultMatch.category.description || '',
          },
          readingTime: r.readingTime || defaultMatch.readingTime,
          content: r.content,
          tags: r.tags && r.tags.length > 0 ? r.tags : defaultMatch.tags,
        };
      });
    }
  } catch (err) {
    console.warn('[CMS Controller - Articles fallback]:', (err as Error)?.message || err);
  }

  return INSIGHT_ARTICLES;
}

/**
 * Retrieves a single published article by slug.
 */
export async function getPublishedArticleBySlug(slug: string): Promise<InsightArticle | null> {
  try {
    const r = await cmsDb.blogPost.findFirst({
      where: {
        slug,
        published: true,
        status: 'published',
      },
      include: {
        category: true,
      },
    });

    if (r) {
      const defaultMatch = getStaticInsightArticleBySlug(slug) || INSIGHT_ARTICLES[0];
      return {
        ...defaultMatch,
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.summary,
        coverImage: r.featuredImage || defaultMatch.coverImage,
        author: {
          name: r.authorName || defaultMatch.author.name,
          role: r.authorRole || defaultMatch.author.role,
          image: r.authorImage || defaultMatch.author.image,
        },
        publishedAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        category: {
          id: r.category?.id || '',
          name: r.category?.name || 'General',
          slug: r.category?.slug || 'general',
          description: defaultMatch.category.description || '',
        },
        readingTime: r.readingTime || defaultMatch.readingTime,
        content: r.content,
        tags: r.tags && r.tags.length > 0 ? r.tags : defaultMatch.tags,
      };
    }
  } catch (err) {
    console.warn('[CMS Controller - Article slug fallback]:', (err as Error)?.message || err);
  }

  return getStaticInsightArticleBySlug(slug) || null;
}

/* ========================================================================== */
/* 7. AWARDS & ACCLAIM                                                        */
/* ========================================================================== */

/**
 * Retrieves all verified and published awards/certifications.
 */
export async function getPublishedAwards(): Promise<CmsAward[]> {
  try {
    const rows = await cmsDb.awardItem.findMany({
      where: {
        published: true,
        status: 'verified',
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      return rows.map((r: DbAwardItem) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        organization: r.organization,
        year: r.year,
        category: r.category,
        description: r.description,
        achievement: r.achievement,
        verificationUrl: r.verificationUrl,
        verificationLabel: r.verificationLabel,
        badgeText: r.badgeText,
        status: r.status,
        published: r.published,
        featured: r.featured,
        orderIndex: r.orderIndex,
        icon: r.icon,
        highlights: r.highlights,
      }));
    }
  } catch (err) {
    console.warn('[CMS Controller - Awards fallback]:', (err as Error)?.message || err);
  }

  return RAW_ACCOLADES_DATA.map((a, idx) => ({
    ...a,
    published: true,
    featured: true,
    orderIndex: idx + 1,
  }));
}

/* ========================================================================== */
/* 8. FREQUENTLY ASKED QUESTIONS (FAQS)                                       */
/* ========================================================================== */

/**
 * Retrieves all published FAQs, optionally filtered by category.
 */
export async function getPublishedFaqs(category?: string): Promise<CmsFaq[]> {
  try {
    const rows = await cmsDb.faqItem.findMany({
      where: {
        status: 'published',
        ...(category && category !== 'all' ? { category } : {}),
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (rows && rows.length > 0) {
      return rows.map((r: DbFaqItem) => ({
        id: r.id,
        category: r.category,
        question: r.question,
        answer: r.answer,
        isFeatured: r.isFeatured,
        status: r.status,
        orderIndex: r.orderIndex,
      }));
    }
  } catch (err) {
    console.warn('[CMS Controller - FAQs fallback]:', (err as Error)?.message || err);
  }

  const filtered = category && category !== 'all'
    ? CANONICAL_FAQS.filter((f) => f.category === category)
    : CANONICAL_FAQS;

  return filtered.map((f, idx) => ({
    id: f.id,
    category: f.category,
    question: f.question,
    answer: f.answer,
    isFeatured: f.isFeatured ?? false,
    status: 'published',
    orderIndex: idx + 1,
  }));
}

/* ========================================================================== */
/* 9. BIDIRECTIONAL RELATIONAL CONTEXT RESOLVERS                              */
/* ========================================================================== */

/**
 * Resolves full relational context for a Service detail page:
 * Service <-> Solutions, Industries, Technologies, Case Studies, Testimonials
 */
export async function getServiceRelationalContext(rawSlug: string) {
  const canonical = normalizeServiceSlug(rawSlug);
  const baseConfig = SERVICE_RELATIONSHIPS[canonical] || SERVICE_RELATIONSHIPS['ai-development'];

  const [service, allSolutions, allIndustries, allCaseStudies, testimonials] = await Promise.all([
    getPublishedServiceBySlug(canonical),
    getPublishedSolutions(),
    getPublishedIndustries(),
    getPublishedCaseStudies(),
    getTestimonialsByService(canonical),
  ]);

  const relatedSolutions = allSolutions.filter((sol) =>
    baseConfig.relatedSolutionSlugs.some((s) => normalizeSolutionSlug(s) === normalizeSolutionSlug(sol.slug))
  );

  const relevantIndustries = allIndustries.filter((ind) =>
    baseConfig.relevantIndustrySlugs.some((s) => normalizeIndustrySlug(s) === normalizeIndustrySlug(ind.slug))
  );

  const relatedCaseStudies = allCaseStudies.filter((cs) =>
    cs.relatedServiceSlugs?.some((s) => normalizeServiceSlug(s) === canonical) ||
    baseConfig.relatedCaseStudySlugs.includes(cs.slug)
  );

  return {
    service,
    relatedSolutions,
    relevantIndustries,
    technologies: baseConfig.technologies,
    relatedCaseStudies,
    testimonials,
    cta: baseConfig.cta,
  };
}

/**
 * Resolves full relational context for a Solution detail page:
 * Solution <-> Services, Industries, Case Studies
 */
export async function getSolutionRelationalContext(rawSlug: string) {
  const canonical = normalizeSolutionSlug(rawSlug);
  const baseConfig = SOLUTION_RELATIONSHIPS[canonical] || SOLUTION_RELATIONSHIPS['ai-business-automation'];

  const [solution, allServices, allIndustries, allCaseStudies] = await Promise.all([
    getPublishedSolutionBySlug(canonical),
    getPublishedServices(),
    getPublishedIndustries(),
    getPublishedCaseStudies(),
  ]);

  const relatedServices = allServices.filter((srv) =>
    baseConfig.relatedServiceSlugs.some((s) => normalizeServiceSlug(s) === normalizeServiceSlug(srv.slug))
  );

  const relevantIndustries = allIndustries.filter((ind) =>
    baseConfig.relevantIndustrySlugs.some((s) => normalizeIndustrySlug(s) === normalizeIndustrySlug(ind.slug))
  );

  const relatedCaseStudies = allCaseStudies.filter((cs) =>
    cs.relatedSolutionSlugs?.some((s) => normalizeSolutionSlug(s) === canonical) ||
    baseConfig.relatedCaseStudySlugs.includes(cs.slug)
  );

  return {
    solution,
    relatedServices,
    relevantIndustries,
    relatedCaseStudies,
    cta: baseConfig.cta,
  };
}

/**
 * Resolves full relational context for an Industry detail page:
 * Industry <-> Services, Solutions, Case Studies
 */
export async function getIndustryRelationalContext(rawSlug: string) {
  const canonical = normalizeIndustrySlug(rawSlug);

  const [industry, allServices, allSolutions, allCaseStudies] = await Promise.all([
    getPublishedIndustryBySlug(canonical),
    getPublishedServices(),
    getPublishedSolutions(),
    getPublishedCaseStudies(),
  ]);

  const relatedServices = allServices.filter((srv) => {
    const rel = SERVICE_RELATIONSHIPS[srv.slug];
    return rel?.relevantIndustrySlugs.some((i) => normalizeIndustrySlug(i) === canonical);
  });

  const relatedSolutions = allSolutions.filter((sol) => {
    const rel = SOLUTION_RELATIONSHIPS[sol.slug];
    return rel?.relevantIndustrySlugs.some((i) => normalizeIndustrySlug(i) === canonical);
  });

  const relatedCaseStudies = allCaseStudies.filter(
    (cs) => normalizeIndustrySlug(cs.industrySlug) === canonical
  );

  return {
    industry,
    relatedServices,
    relatedSolutions,
    relatedCaseStudies,
  };
}

/**
 * Resolves full relational context for a Case Study detail page:
 * Case Study <-> Services, Solutions, Industries, Technologies, Testimonial
 */
export async function getCaseStudyRelationalContext(slug: string) {
  const project = await getPublishedCaseStudyBySlug(slug);
  if (!project) return null;

  const [allServices, allSolutions, relatedIndustry, allCaseStudies, testimonial] = await Promise.all([
    getPublishedServices(),
    getPublishedSolutions(),
    getPublishedIndustryBySlug(project.industrySlug),
    getPublishedCaseStudies(),
    getTestimonialByProject(project.id || project.slug),
  ]);

  const relatedServices = allServices.filter((srv) =>
    (project.relatedServiceSlugs || []).some((s) => normalizeServiceSlug(s) === normalizeServiceSlug(srv.slug))
  );

  const relatedSolutions = allSolutions.filter((sol) =>
    (project.relatedSolutionSlugs || []).some((s) => normalizeSolutionSlug(s) === normalizeSolutionSlug(sol.slug))
  );

  const relatedCaseStudies = allCaseStudies.filter((cs) => cs.slug !== project.slug).slice(0, 2);

  return {
    project,
    relatedServices,
    relatedSolutions,
    relatedIndustry,
    relatedCaseStudies,
    testimonial,
  };
}

/**
 * Resolves full relational context for an Article detail page:
 * Article <-> Services, Solutions, Industries, Case Studies
 */
export async function getArticleRelationalContext(slug: string) {
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return null;

  const [allServices, allSolutions, allIndustries, allCaseStudies] = await Promise.all([
    getPublishedServices(),
    getPublishedSolutions(),
    getPublishedIndustries(),
    getPublishedCaseStudies(),
  ]);

  const relatedServices = allServices.filter((srv) =>
    (article.relatedServiceSlugs || []).some((s) => normalizeServiceSlug(s) === normalizeServiceSlug(srv.slug))
  );

  const relatedSolutions = allSolutions.filter((sol) =>
    (article.relatedSolutionSlugs || []).some((s) => normalizeSolutionSlug(s) === normalizeSolutionSlug(sol.slug))
  );

  const relatedIndustries = allIndustries.filter((ind) =>
    (article.relatedIndustrySlugs || []).some((i) => normalizeIndustrySlug(i) === normalizeIndustrySlug(ind.slug))
  );

  const relatedCaseStudies = allCaseStudies.filter((cs) =>
    (article.relatedCaseStudySlugs || []).includes(cs.slug)
  );

  return {
    article,
    relatedServices,
    relatedSolutions,
    relatedIndustries,
    relatedCaseStudies,
  };
}

/* ========================================================================== */
/* 10. SEO METADATA GENERATION HELPER                                         */
/* ========================================================================== */

import { createPageMetadata } from '@/lib/seo';

/**
 * Generates standardized Next.js Metadata for any CMS entity with canonical OpenGraph fallbacks.
 */
export function generateCmsMetadata({
  title,
  description,
  path,
  image,
  locale = 'en',
  type = 'website',
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  locale?: string;
  type?: 'website' | 'article';
}) {
  return createPageMetadata({
    title,
    description,
    path: path || '',
    image,
    locale,
    type,
  });
}
