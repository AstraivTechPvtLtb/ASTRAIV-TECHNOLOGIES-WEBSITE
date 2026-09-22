import type { MetadataRoute } from 'next';
import { ROUTES, getLocalizedPath } from '@/routes';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { getAllActiveServiceSlugs } from '@/controllers/services.controller';
import { getAllActivePortfolioSlugs } from '@/controllers/portfolio.controller';
import { getBlogPosts } from '@/controllers/blog.controller';
import { getAllSolutions } from '@/lib/solutions-data';
import { INDUSTRIES_LIST } from '@/lib/industries-data';
import { getPublicJobOpenings } from '@/controllers/public-data.controller';

export const dynamic = 'force-dynamic';

interface SitemapPageItem {
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastModified?: Date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const locales = routing.locales as readonly string[];

  // 1. Core static marketing and institutional routes (deduplicated)
  const staticPages: SitemapPageItem[] = [
    { path: ROUTES.PUBLIC.HOME, priority: 1.0, changeFrequency: 'daily' },
    { path: ROUTES.PUBLIC.SERVICES, priority: 0.9, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.SOLUTIONS, priority: 0.9, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.WORK, priority: 0.95, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.CASE_STUDIES, priority: 0.9, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.WORK_TESTIMONIALS, priority: 0.85, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.PRICING, priority: 0.9, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.TECHNOLOGY, priority: 0.8, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.INDUSTRIES, priority: 0.8, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.COMPANY, priority: 0.8, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.REWARDS_ACCOLADES, priority: 0.85, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.CAREERS, priority: 0.8, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.FAQ, priority: 0.8, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.INSIGHTS, priority: 0.9, changeFrequency: 'daily' },
    { path: ROUTES.PUBLIC.INSIGHTS_BLOG, priority: 0.85, changeFrequency: 'weekly' },
    { path: ROUTES.PUBLIC.CONTACT, priority: 0.8, changeFrequency: 'monthly' },
    { path: ROUTES.PUBLIC.START_PROJECT, priority: 0.95, changeFrequency: 'daily' },
    { path: ROUTES.PUBLIC.PRIVACY, priority: 0.5, changeFrequency: 'yearly' },
    { path: ROUTES.PUBLIC.TERMS, priority: 0.5, changeFrequency: 'yearly' },
  ];

  // 2. Fetch dynamic slugs with fallback safety
  const [serviceSlugs, portfolioSlugs, blogPosts, jobOpenings] = await Promise.all([
    getAllActiveServiceSlugs().catch(() => []),
    getAllActivePortfolioSlugs().catch(() => []),
    getBlogPosts().catch(() => []),
    getPublicJobOpenings().catch(() => []),
  ]);

  const dynamicPages: SitemapPageItem[] = [];

  // Career details
  for (const job of jobOpenings) {
    if (job.slug) {
      dynamicPages.push({
        path: ROUTES.PUBLIC.CAREER_DETAIL(job.slug),
        priority: 0.8,
        changeFrequency: 'weekly',
      });
    }
  }

  // Service details
  for (const slug of serviceSlugs) {
    dynamicPages.push({
      path: ROUTES.PUBLIC.SERVICE_DETAIL(slug),
      priority: 0.85,
      changeFrequency: 'weekly',
    });
  }

  // Solution details
  const solutions = getAllSolutions();
  for (const solution of solutions) {
    dynamicPages.push({
      path: ROUTES.PUBLIC.SOLUTION_DETAIL(solution.slug),
      priority: 0.85,
      changeFrequency: 'weekly',
    });
  }

  // Industry details
  for (const industry of INDUSTRIES_LIST) {
    dynamicPages.push({
      path: ROUTES.PUBLIC.INDUSTRY_DETAIL(industry.slug),
      priority: 0.8,
      changeFrequency: 'weekly',
    });
  }

  // Case Studies (Work)
  for (const slug of portfolioSlugs) {
    dynamicPages.push({
      path: ROUTES.PUBLIC.CASE_STUDY_DETAIL(slug),
      priority: 0.85,
      changeFrequency: 'weekly',
    });
  }

  // Insights & Blog posts (single canonical entry per article)
  for (const post of blogPosts) {
    if (post.slug) {
      dynamicPages.push({
        path: ROUTES.PUBLIC.INSIGHTS_DETAIL(post.slug),
        priority: 0.8,
        changeFrequency: 'monthly',
        lastModified: post.createdAt ? new Date(post.createdAt) : undefined,
      });
    }
  }

  const allPages: SitemapPageItem[] = [...staticPages, ...dynamicPages];
  const entries: MetadataRoute.Sitemap = [];

  // Generate localized URLs for all supported languages
  for (const page of allPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}${getLocalizedPath(page.path, locale)}`,
        lastModified: page.lastModified || new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}
