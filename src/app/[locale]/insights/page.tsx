import { setRequestLocale } from 'next-intl/server';
import { getBlogPosts } from '@/controllers/blog.controller';
import { getAllInsightCategories } from '@/lib/insights-data';
import { Navbar, Footer, InsightsView } from '@/views';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface InsightsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: InsightsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Astraiv Tech Insights & Engineering Publications | Astraiv Technologies',
    description:
      'Technical deep dives into software architecture, autonomous AI systems, client case studies, and modern engineering practices.',
    path: '/insights',
    locale,
  });
}

export default async function InsightsPage({ params }: InsightsPageProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  // Fetch published blog posts and the 7 canonical categories
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    Promise.resolve(getAllInsightCategories()),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ]}
      />
      <Navbar />
      <main className="flex-grow z-10 relative">
        <InsightsView initialPosts={posts} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
