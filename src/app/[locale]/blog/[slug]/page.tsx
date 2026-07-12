import { getTranslations, setRequestLocale } from 'next-intl/server';
import { db } from '@/db/prisma';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CircuitBackground } from '@/components/sections/circuit-background';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { formatDate } from '@/utils';
import { BlogCard } from '@/components/sections/blog-card';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findFirst({
    where: { slug, published: true },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  // Fetch the blog post
  const post = await db.blogPost.findFirst({
    where: { slug, published: true },
    include: {
      category: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Fetch related posts (same category, different id)
  const relatedPosts = await db.blogPost.findMany({
    where: {
      published: true,
      categoryId: post.categoryId,
      NOT: { id: post.id },
    },
    take: 3,
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

  const t = await getTranslations('Blog');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white flex flex-col justify-between relative overflow-hidden">
      <CircuitBackground />
      <Navbar />

      <main className="pt-28 flex-grow z-10 relative">
        <article className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{t('backToBlog')}</span>
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="px-3.5 py-1.5 text-xs font-extrabold bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent rounded-full border border-primary/20 dark:border-accent/20 uppercase tracking-wider">
              {post.category.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-4 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 mb-10 text-xs md:text-sm font-semibold text-muted-foreground">
            <div className="flex items-center gap-2.5">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-primary/20 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-850 flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <span className="font-bold text-slate-700 dark:text-slate-350">
                {t('publishedBy', { author: post.author.name })}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200/50 dark:border-slate-850/50">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          )}

          {/* Main article content text */}
          <div 
            className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base md:text-lg font-medium
              [&>p]:mb-6 [&>p]:leading-relaxed
              [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:tracking-tight [&>h2]:text-slate-900 [&>h2]:dark:text-slate-50 [&>h2]:mt-10 [&>h2]:mb-4
              [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-bold [&>h3]:tracking-tight [&>h3]:text-slate-900 [&>h3]:dark:text-slate-50 [&>h3]:mt-8 [&>h3]:mb-3
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
              [&>li]:mb-2
              [&>strong]:font-extrabold [&>strong]:text-slate-900 [&>strong]:dark:text-slate-50
              [&>a]:text-primary [&>a]:dark:text-accent [&>a]:underline [&>a]:hover:opacity-85"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related articles section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 py-16 mt-16 max-w-7xl mx-auto px-6 z-10 relative">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-10 text-center">
              {t('relatedPosts')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  summary={post.summary}
                  imageUrl={post.featuredImage || undefined}
                  category={post.category.name}
                  publishedAt={formatDate(post.createdAt)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
