import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBlogPosts, getBlogCategories } from '@/controllers/blog.controller';
import { Navbar, Footer, BlogList } from '@/views';
import { CircuitBackground } from '@/views/sections/circuit-background';
import { SectionHeader } from '@/views/sections/section-header';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  // Fetch published blog posts and categories safely
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
  ]);

  const t = await getTranslations('Blog');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white flex flex-col justify-between relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      <main className="pt-32 flex-grow z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            badge={t('title')}
            title={t('title')}
            description={t('subtitle')}
            align="center"
            className="mb-8 md:mb-10"
          />
        </div>
        <BlogList initialPosts={posts} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
