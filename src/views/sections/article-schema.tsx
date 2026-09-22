import type { InsightArticle } from '@/lib/insights-data';
import { siteConfig } from '@/config/site';

interface ArticleSchemaProps {
  article: InsightArticle;
  locale: string;
}

export function ArticleSchema({ article, locale }: ArticleSchemaProps) {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const articleUrl = `${baseUrl}/${locale}/insights/${article.slug}`;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : undefined,
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
      image: article.author.image || undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`,
      },
    },
    articleSection: article.category.name,
    keywords: article.tags.join(', '),
    timeRequired: article.readingTime,
    inLanguage: locale,
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: `${baseUrl}/${locale}/insights`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category.name,
        item: `${baseUrl}/${locale}/insights/blog?category=${encodeURIComponent(article.category.slug)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
    </>
  );
}
