import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/db/prisma';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BlogList } from '@/components/sections/blog-list';
import { CircuitBackground } from '@/components/sections/circuit-background';
import { SectionHeader } from '@/components/sections/section-header';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

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

  // Fetch published blog posts from the database
  const posts = await db.blogPost.findMany({
    where: { published: true },
    include: {
      category: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch all categories
  const categories = await db.blogCategory.findMany({
    orderBy: { name: 'asc' },
  });

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
