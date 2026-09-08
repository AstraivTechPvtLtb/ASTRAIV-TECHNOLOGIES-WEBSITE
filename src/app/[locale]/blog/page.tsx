import { setRequestLocale } from 'next-intl/server';
import { getBlogPosts, getBlogCategories } from '@/controllers/blog.controller';
import { Navbar, Footer, InsightsView } from '@/views';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  await params;
  return {
    title: 'Astraiv Tech Insights & Engineering Publications | Astraiv Technologies',
    description:
      'Technical deep dives into software architecture, autonomous AI systems, client case studies, and modern engineering practices.',
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />
      <main className="flex-grow z-10 relative">
        <InsightsView initialPosts={posts} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
