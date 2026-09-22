import { setRequestLocale } from 'next-intl/server';
import { getAllInsightArticles, getAllInsightCategories } from '@/lib/insights-data';
import { Navbar, Footer, InsightsBlogView } from '@/views';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface InsightsBlogPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: InsightsBlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Engineering Blog & Systems Analysis | Astraiv Technologies',
    description:
      'In-depth technical publications, systems design tutorials, and distributed architecture case studies by Astraiv engineering practitioners.',
    path: '/insights/blog',
    locale,
  });
}

export default async function InsightsBlogPage({ params, searchParams }: InsightsBlogPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialCategory = resolvedSearchParams?.category || 'all';

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const articles = getAllInsightArticles();
  const categories = getAllInsightCategories();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: 'Blog', path: '/insights/blog' },
        ]}
      />
      <Navbar />
      <main className="flex-grow z-10 relative">
        <InsightsBlogView
          initialArticles={articles}
          categories={categories}
          initialCategory={initialCategory}
        />
      </main>
      <Footer />
    </div>
  );
}
