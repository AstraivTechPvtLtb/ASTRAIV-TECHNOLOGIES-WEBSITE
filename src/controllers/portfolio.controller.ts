/**
 * @file client/src/controllers/portfolio.controller.ts
 * @description [CONTROLLER] Business logic for retrieving public database-backed portfolio projects and case studies.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';

import {
  type PublicPortfolioProject,
  DEFAULT_PORTFOLIO_PROJECTS,
} from '@/lib/portfolio-data';

export type { PublicPortfolioProject };

/**
 * Retrieves all publicly visible portfolio projects.
 */
export async function getPublicPortfolioProjects(): Promise<PublicPortfolioProject[]> {
  // 1. Primary PostgreSQL lookup via Prisma ORM
  try {
    const records = await db.portfolioProject.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    if (records && records.length > 0) {
      const dbProjects: PublicPortfolioProject[] = records.map((r) => {
        const defaultMatch = DEFAULT_PORTFOLIO_PROJECTS.find(
          (d) => d.slug === r.slug || d.id === r.id
        );

        const safeImageUrl =
          r.imageUrl && !r.imageUrl.includes('photo-1561070791-26c113006238') ? r.imageUrl : undefined;

        return {
          id: r.id,
          slug: r.slug,
          title: r.title,
          projectType: defaultMatch?.projectType || 'Client Project',
          credibilityBadge: defaultMatch?.credibilityBadge || 'Production Verified',
          credibilityNote: defaultMatch?.credibilityNote,
          isRealClient: defaultMatch?.isRealClient ?? true,
          verifiedOutcome: defaultMatch?.verifiedOutcome ?? true,
          client: defaultMatch?.client || 'Enterprise Client',
          clientContext: defaultMatch?.clientContext || '',
          timeline: defaultMatch?.timeline,
          category: defaultMatch?.category || 'Software Engineering',
          categoryType: defaultMatch?.categoryType || ['All'],
          industrySlug: defaultMatch?.industrySlug || 'saas',
          industryName: defaultMatch?.industryName || 'SaaS & Technology',
          relatedServiceSlugs: defaultMatch?.relatedServiceSlugs || ['custom-software'],
          relatedSolutionSlugs: defaultMatch?.relatedSolutionSlugs || ['saas-platforms'],
          imageSrc: safeImageUrl || defaultMatch?.imageSrc || '/images/portfolio/portfolio-pulsefit.jpg',
          challenge: defaultMatch?.challenge || r.description || '',
          challengeDetails: defaultMatch?.challengeDetails || [],
          requirements: defaultMatch?.requirements || [],
          solution: defaultMatch?.solution || r.content || '',
          solutionDetails: defaultMatch?.solutionDetails || [],
          architectureApproach: defaultMatch?.architectureApproach || '',
          architectureHighlights: defaultMatch?.architectureHighlights || [
            {
              title: 'Clean Architectural Foundation',
              description: 'Strictly typed TypeScript with modular microservices and edge runtime caching.',
            },
          ],
          technologies: r.tags && r.tags.length > 0 ? r.tags : defaultMatch?.technologies || ['Next.js', 'TypeScript'],
          techStackByCategory: defaultMatch?.techStackByCategory || [],
          developmentProcess: defaultMatch?.developmentProcess || [],
          measurableResults: defaultMatch?.measurableResults || [],
          metric: defaultMatch?.metric || 'Production Verified',
          metricLabel: defaultMatch?.metricLabel || 'Outcome',
          badgeIcon: defaultMatch?.badgeIcon || 'Zap',
          summary: r.description || defaultMatch?.summary || '',
          content: r.content || defaultMatch?.content || '',
          deliverables: defaultMatch?.deliverables || [
            'End-to-end full-stack software engineering',
            'Automated CI/CD testing and cloud staging',
            'High-availability database architecture',
          ],
          impactOutcomes: defaultMatch?.impactOutcomes || [
            'Production SLA guaranteed',
            'Extreme performance and sub-second latency',
          ],
          clientQuote: defaultMatch?.clientQuote,
          tags: r.tags || [],
          projectUrl: r.projectUrl || defaultMatch?.projectUrl || null,
        };
      });

      const dbSlugs = new Set(dbProjects.map((p) => p.slug.toLowerCase()));
      const remainingDefaults = DEFAULT_PORTFOLIO_PROJECTS.filter(
        (d) => !dbSlugs.has(d.slug.toLowerCase()) && !dbSlugs.has(d.id.toLowerCase())
      );
      return [...dbProjects, ...remainingDefaults];
    }
  } catch (err) {
    console.warn('[Prisma Portfolio Notice - Falling back to defaults]:', (err as Error)?.message || err);
  }

  // 2. Secondary Supabase lookup if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      const { data: records, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && records && records.length > 0) {
        const supaProjects: PublicPortfolioProject[] = records.map((r) => {
          const defaultMatch = DEFAULT_PORTFOLIO_PROJECTS.find(
            (d) => d.slug === r.slug || d.id === r.id
          );

          const safeImageUrl =
            r.image_url && !r.image_url.includes('photo-1561070791-26c113006238') ? r.image_url : undefined;

          return {
            id: r.id,
            slug: r.slug,
            title: r.title,
            projectType: defaultMatch?.projectType || 'Client Project',
            credibilityBadge: defaultMatch?.credibilityBadge || 'Production Verified',
            credibilityNote: defaultMatch?.credibilityNote,
            isRealClient: defaultMatch?.isRealClient ?? true,
            verifiedOutcome: defaultMatch?.verifiedOutcome ?? true,
            client: r.client || defaultMatch?.client || 'Enterprise Client',
            clientContext: defaultMatch?.clientContext || '',
            timeline: defaultMatch?.timeline,
            category: r.industry || defaultMatch?.category || 'Software Engineering',
            categoryType: defaultMatch?.categoryType || ['All'],
            industrySlug: defaultMatch?.industrySlug || 'saas',
            industryName: defaultMatch?.industryName || 'SaaS & Technology',
            relatedServiceSlugs: defaultMatch?.relatedServiceSlugs || ['custom-software'],
            relatedSolutionSlugs: defaultMatch?.relatedSolutionSlugs || ['saas-platforms'],
            imageSrc: safeImageUrl || defaultMatch?.imageSrc || '/images/portfolio/portfolio-pulsefit.jpg',
            challenge: defaultMatch?.challenge || r.short_description || '',
            challengeDetails: defaultMatch?.challengeDetails || [],
            requirements: defaultMatch?.requirements || [],
            solution: defaultMatch?.solution || r.description || '',
            solutionDetails: defaultMatch?.solutionDetails || [],
            architectureApproach: defaultMatch?.architectureApproach || '',
            architectureHighlights: defaultMatch?.architectureHighlights || [],
            technologies: r.technologies && r.technologies.length > 0 ? r.technologies : defaultMatch?.technologies || ['Next.js', 'TypeScript'],
            techStackByCategory: defaultMatch?.techStackByCategory || [],
            developmentProcess: defaultMatch?.developmentProcess || [],
            measurableResults: defaultMatch?.measurableResults || [],
            metric: r.metric || defaultMatch?.metric || 'Production Verified',
            metricLabel: r.metric_label || defaultMatch?.metricLabel || 'Outcome',
            badgeIcon: defaultMatch?.badgeIcon || 'Zap',
            summary: r.short_description || defaultMatch?.summary || '',
            content: r.description || defaultMatch?.content || '',
            deliverables: defaultMatch?.deliverables || [],
            impactOutcomes: defaultMatch?.impactOutcomes || [],
            clientQuote: defaultMatch?.clientQuote,
            tags: r.technologies || [],
            projectUrl: r.project_url || null,
          };
        });

        const supaSlugs = new Set(supaProjects.map((p) => p.slug.toLowerCase()));
        const remainingDefaults = DEFAULT_PORTFOLIO_PROJECTS.filter(
          (d) => !supaSlugs.has(d.slug.toLowerCase()) && !supaSlugs.has(d.id.toLowerCase())
        );
        return [...supaProjects, ...remainingDefaults];
      }
    } catch (supaErr) {
      console.warn('[Supabase Portfolio Notice]:', (supaErr as Error)?.message || supaErr);
    }
  }

  // 3. Fallback: Full production verified case studies
  return DEFAULT_PORTFOLIO_PROJECTS;
}

/**
 * Retrieves a single portfolio project / case study by slug.
 */
export async function getPublicPortfolioProjectBySlug(slug: string): Promise<PublicPortfolioProject | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const allProjects = await getPublicPortfolioProjects();
  const match = allProjects.find((p) => p.slug === cleanSlug || p.id === cleanSlug);
  if (match) return match;
  return DEFAULT_PORTFOLIO_PROJECTS.find((p) => p.slug === cleanSlug || p.id === cleanSlug) || null;
}

/**
 * Returns all active portfolio / case study slugs for sitemaps and static generation.
 */
export async function getAllActivePortfolioSlugs(): Promise<string[]> {
  const projects = await getPublicPortfolioProjects();
  return projects.map((p) => p.slug);
}

/**
 * Returns default fallback portfolio projects.
 */
export async function getDefaultPortfolioProjects(): Promise<PublicPortfolioProject[]> {
  return DEFAULT_PORTFOLIO_PROJECTS;
}

// Convenient Case Study Semantics Aliases
export const getPublicCaseStudies = getPublicPortfolioProjects;
export const getPublicCaseStudyBySlug = getPublicPortfolioProjectBySlug;
export const getAllActiveCaseStudySlugs = getAllActivePortfolioSlugs;


