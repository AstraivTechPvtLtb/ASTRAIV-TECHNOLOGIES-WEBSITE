import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { SUPPORTED_LOCALES } from '@/config/locales';

export interface PageMetadataInput {
  title: string;
  description?: string;
  path?: string;
  locale?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Generates standardized, canonical, and deduplicated Next.js metadata.
 * Prevents double-suffixing (e.g., prevents "Page | Astraiv Technologies | Astraiv Technologies").
 */
export function createPageMetadata({
  title,
  description,
  path = '',
  locale = 'en',
  image,
  type = 'website',
  keywords,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  
  // Clean path to always start with / (except empty)
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  // Suppress double brand suffix if already present in title
  const hasBrand = title.toLowerCase().includes(siteConfig.name.toLowerCase()) || title.toLowerCase().includes(siteConfig.shortName.toLowerCase());
  const finalTitle = hasBrand ? title : `${title} | ${siteConfig.name}`;

  const finalDescription = description || siteConfig.description;
  const canonicalUrl = `${baseUrl}/${locale}${normalizedPath === '/' ? '' : normalizedPath}`;
  const ogImageUrl = image || siteConfig.ogImage || `${baseUrl}/og-image.jpg`;

  // Multilingual hreflang alternate links
  const languages: Record<string, string> = {
    'x-default': `${baseUrl}/en${normalizedPath === '/' ? '' : normalizedPath}`,
  };

  for (const loc of SUPPORTED_LOCALES) {
    languages[loc] = `${baseUrl}/${loc}${normalizedPath === '/' ? '' : normalizedPath}`;
  }

  return {
    // When using an explicit branded title, absolute prevents Next.js layout template from duplicating it
    title: {
      absolute: finalTitle,
    },
    description: finalDescription,
    keywords: keywords && keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: locale === 'en' ? 'en_US' : locale,
      type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

/* =========================================================================
   JSON-LD STRUCTURED DATA SCHEMAS
   ========================================================================= */

/**
 * Returns Organization structured data.
 */
export function getOrganizationJsonLd() {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: baseUrl,
    logo: `${baseUrl}/icon-512.png`,
    image: `${baseUrl}/icon-512.png`,
    description: siteConfig.description,
    sameAs: [
      siteConfig.socials.twitter,
      siteConfig.socials.github,
      siteConfig.socials.linkedin,
    ].filter(Boolean),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.contact.phone,
        contactType: 'customer service',
        email: siteConfig.contact.email,
        availableLanguage: ['en', 'es', 'bn', 'hi', 'ar'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      addressCountry: 'India',
      streetAddress: siteConfig.contact.address,
    },
  };
}

/**
 * Returns WebSite structured data with optional SearchAction.
 */
export function getWebSiteJsonLd(locale: string = 'en') {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: `${baseUrl}/${locale}`,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
    },
  };
}

/**
 * Returns BreadcrumbList structured data.
 */
export function getBreadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: string = 'en'
) {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const cleanPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      const itemUrl = cleanPath === '/' ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${cleanPath}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: itemUrl,
      };
    }),
  };
}

/**
 * Returns Article / TechArticle structured data.
 */
export function getArticleJsonLd(
  article: {
    title: string;
    excerpt: string;
    slug: string;
    coverImage?: string;
    publishedAt: string;
    updatedAt?: string;
    author: { name: string; role?: string; image?: string };
    category?: { name: string; slug?: string };
    tags?: string[];
    readingTime?: string;
  },
  locale: string = 'en'
) {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const articleUrl = `${baseUrl}/${locale}/insights/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : [`${baseUrl}/og-image.jpg`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
      image: article.author.image,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon-512.png`,
      },
    },
    articleSection: article.category?.name || 'Technology',
    keywords: article.tags?.join(', '),
    timeRequired: article.readingTime,
    inLanguage: locale,
  };
}

/**
 * Returns Service structured data.
 */
export function getServiceJsonLd(
  service: {
    title: string;
    shortDesc?: string;
    description?: string;
    slug?: string;
    path?: string;
    category?: string;
    imageSrc?: string;
  },
  locale: string = 'en'
) {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const urlPath = service.path
    ? (service.path.startsWith('/') ? service.path : `/${service.path}`)
    : `/services/${service.slug || ''}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.category || 'Software Engineering',
    description: service.description || service.shortDesc || '',
    url: `${baseUrl}/${locale}${urlPath}`,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
    },
    areaServed: 'Worldwide',
  };
}

/**
 * Returns JobPosting structured data.
 */
export function getJobPostingJsonLd(
  job: {
    title: string;
    description: string;
    slug: string;
    department?: string;
    type?: string;
    location?: string;
    salary?: string;
    createdAt?: string | Date;
  },
  locale: string = 'en'
) {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const datePosted = job.createdAt
    ? new Date(job.createdAt).toISOString()
    : new Date().toISOString();

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted,
    employmentType: job.type?.toUpperCase().includes('FULL') ? 'FULL_TIME' : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: siteConfig.name,
      sameAs: baseUrl,
      logo: `${baseUrl}/icon-512.png`,
    },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Remote',
      },
    },
    baseSalary: job.salary
      ? {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: {
            '@type': 'QuantitativeValue',
            value: job.salary,
            unitText: 'YEAR',
          },
        }
      : undefined,
  };
}

/**
 * Returns FAQPage structured data.
 */
export function getFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * Reusable server component to output JSON-LD script tags safely.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Reusable BreadcrumbSchema component.
 */
export function BreadcrumbSchema({
  items,
  locale = 'en',
}: {
  items: { name: string; path: string }[];
  locale?: string;
}) {
  const jsonLd = getBreadcrumbJsonLd(items, locale);
  return <JsonLd data={jsonLd} />;
}
