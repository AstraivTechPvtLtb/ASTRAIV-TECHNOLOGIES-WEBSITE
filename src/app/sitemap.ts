import type { MetadataRoute } from 'next';
import { ROUTES, getLocalizedPath } from '@/routes';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const publicPages = [
    { path: ROUTES.PUBLIC.HOME, priority: 1.0, changeFrequency: 'daily' as const },
    { path: ROUTES.PUBLIC.SERVICES, priority: 0.8, changeFrequency: 'weekly' as const },
    { path: ROUTES.PUBLIC.SOLUTIONS, priority: 0.8, changeFrequency: 'weekly' as const },
    { path: ROUTES.PUBLIC.TECHNOLOGY, priority: 0.8, changeFrequency: 'weekly' as const },
    { path: ROUTES.PUBLIC.INDUSTRIES, priority: 0.8, changeFrequency: 'weekly' as const },
    { path: ROUTES.PUBLIC.PORTFOLIO, priority: 0.8, changeFrequency: 'weekly' as const },
    { path: ROUTES.PUBLIC.COMPANY, priority: 0.8, changeFrequency: 'weekly' as const },
    { path: ROUTES.PUBLIC.BLOG, priority: 0.8, changeFrequency: 'weekly' as const },
    { path: ROUTES.PUBLIC.CONTACT, priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  return publicPages.map((page) => ({
    url: `${baseUrl}${getLocalizedPath(page.path, 'en')}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
