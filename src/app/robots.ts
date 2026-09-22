import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/client/*',
          '/*/client/*',
          '/dashboard/*',
          '/*/dashboard/*',
          '/admin/*',
          '/*/admin/*',
          '/profile/*',
          '/*/profile/*',
          '/settings/*',
          '/*/settings/*',
          '/auth/*',
          '/*/auth/*',
          '/api/*',
          '/*/api/*',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: 'https://www.astraivtechnologies.com/sitemap.xml',
  };
}
