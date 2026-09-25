import { setRequestLocale } from 'next-intl/server';
import {
  getRelatedInsightArticles,
  getArticleFunnelRelationships,
  type ArticleFunnelRelationships,
} from '@/lib/insights-data';
import { Navbar, Footer, ArticleFunnelSection, ArticleSchema } from '@/views';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ResilientImage } from '@/views/ui/resilient-image';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Layers,
  Cpu,
  Building2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '@/utils';
import type { Metadata } from 'next';
import {
  getPublishedArticleBySlug,
  getArticleRelationalContext,
  generateCmsMetadata,
} from '@/controllers/cms.controller';

import { createPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface InsightDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: InsightDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return createPageMetadata({
      title: 'Article Not Found | Astraiv Technologies',
      noIndex: true,
      locale,
    });
  }

  return generateCmsMetadata({
    title: `${article.title} | Astraiv Tech Insights`,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    image: article.coverImage,
    locale,
    type: 'article',
  });
}

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { locale, slug } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  // Retrieve published article & live resolved relational context
  const context = await getArticleRelationalContext(slug);

  if (!context || !context.article) {
    notFound();
  }

  const { article, relatedServices, relatedSolutions, relatedIndustries, relatedCaseStudies } = context;

  // Fetch companion articles & resolve structured funnel relationships with live published data
  const relatedArticles = getRelatedInsightArticles(article, 3);
  const baseFunnel = getArticleFunnelRelationships(article);
  const funnel: ArticleFunnelRelationships = {
    ...baseFunnel,
    relatedSolutions: relatedSolutions && relatedSolutions.length > 0 ? relatedSolutions : baseFunnel.relatedSolutions,
    relatedServices: relatedServices && relatedServices.length > 0 ? relatedServices : baseFunnel.relatedServices,
    relatedIndustries: relatedIndustries && relatedIndustries.length > 0 ? relatedIndustries : baseFunnel.relatedIndustries,
    relatedCaseStudies: relatedCaseStudies && relatedCaseStudies.length > 0 ? relatedCaseStudies : baseFunnel.relatedCaseStudies,
    primarySolution: (relatedSolutions && relatedSolutions[0]) || baseFunnel.primarySolution,
    primaryService: (relatedServices && relatedServices[0]) || baseFunnel.primaryService,
    primaryIndustry: (relatedIndustries && relatedIndustries[0]) || baseFunnel.primaryIndustry,
    primaryCaseStudy: (relatedCaseStudies && relatedCaseStudies[0]) || baseFunnel.primaryCaseStudy,
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Schema.org Article & Breadcrumbs Structured Data */}
      <ArticleSchema article={article} locale={locale} />

      <Navbar />

      <main className="pt-28 flex-grow z-10 relative">
        <article className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          {/* Breadcrumb Navigation & Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/insights/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary transition-all duration-300 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Engineering Blog</span>
            </Link>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Link href="/insights" className="hover:text-primary transition-colors">
                Insights
              </Link>
              <span>/</span>
              <Link
                href={`/insights/blog?category=${encodeURIComponent(article.category.slug)}`}
                className="hover:text-primary transition-colors"
              >
                {article.category.name}
              </Link>
              <span>/</span>
              <span className="text-foreground/80 font-bold truncate max-w-[200px]">
                {article.title}
              </span>
            </div>
          </div>

          {/* Category Badge & Reading Time */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Link
              href={`/insights/blog?category=${encodeURIComponent(article.category.slug)}`}
              className="px-3.5 py-1.5 text-xs font-black bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent rounded-full border border-primary/20 dark:border-accent/20 uppercase tracking-wider hover:scale-105 transition-transform"
            >
              {article.category.name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-card border border-border/50 px-2.5 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{article.readingTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 mt-2 mb-6 leading-[1.15] font-heading">
            {article.title}
          </h1>

          {/* Excerpt / Lead */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-medium mb-8 pb-8 border-b border-border/60 dark:border-slate-800">
            {article.excerpt}
          </p>

          {/* Author & Timestamp Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-border/60 dark:border-slate-800 mb-10 text-xs sm:text-sm font-semibold text-muted-foreground">
            {/* Author */}
            <div className="flex items-center gap-3">
              {article.author.image && (
                <Image
                  src={article.author.image}
                  alt={article.author.name}
                  width={42}
                  height={42}
                  className="rounded-full ring-2 ring-primary/20 object-cover"
                />
              )}
              <div>
                <div className="font-extrabold text-foreground">{article.author.name}</div>
                <div className="text-[11px] text-muted-foreground">{article.author.role}</div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5" title="Published date">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Published {formatDate(article.publishedAt)}</span>
              </div>

              {article.updatedAt && (
                <div className="flex items-center gap-1.5 text-muted-foreground/80" title="Last updated date">
                  <RefreshCw className="h-3 w-3 text-emerald-500" />
                  <span>Updated {formatDate(article.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Hero Cover Image */}
          {article.coverImage && (
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/60 dark:border-slate-800 bg-slate-950">
              <ResilientImage
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          )}

          {/* Key Architectural Takeaways Box */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-border/80 dark:border-slate-800 mb-12">
            <div className="text-xs font-black uppercase tracking-wider text-primary dark:text-blue-400 flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4" />
              <span>Publication Abstract & Technical Primitives</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-card border border-border/60 text-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
              This publication is engineered as a foundational reference for engineering leaders and systems architects evaluating {article.category.name} capabilities in high-concurrency production environments.
            </p>
          </div>

          {/* Main Article Content */}
          <div
            className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base md:text-lg font-medium
              [&>p]:mb-6 [&>p]:leading-relaxed
              [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:text-slate-900 [&>h2]:dark:text-slate-50 [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-border/40
              [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-bold [&>h3]:tracking-tight [&>h3]:text-slate-900 [&>h3]:dark:text-slate-50 [&>h3]:mt-8 [&>h3]:mb-3
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
              [&>li]:leading-relaxed
              [&>strong]:font-extrabold [&>strong]:text-slate-900 [&>strong]:dark:text-slate-50
              [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:bg-slate-100 [&>code]:dark:bg-slate-800 [&>code]:text-primary [&>code]:dark:text-accent [&>code]:text-sm [&>code]:font-mono
              [&>a]:text-primary [&>a]:dark:text-accent [&>a]:underline [&>a]:hover:opacity-85"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Cross-Taxonomy Relationship Badges */}
          <div className="mt-14 pt-8 border-t border-border/60 dark:border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4">
              Related Enterprise Domains & Vertical Primitives
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {funnel.relatedSolutions.map((sol) => (
                <Link
                  key={sol.slug}
                  href={`/solutions/${sol.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-primary/40 text-xs font-bold text-foreground transition-colors group"
                >
                  <Layers className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                  <span>Solution: {sol.title}</span>
                </Link>
              ))}

              {funnel.relatedServices.map((srv) => (
                <Link
                  key={srv.slug}
                  href={`/services/${srv.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-primary/40 text-xs font-bold text-foreground transition-colors group"
                >
                  <Cpu className="h-3.5 w-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span>Service: {srv.title}</span>
                </Link>
              ))}

              {funnel.relatedIndustries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-primary/40 text-xs font-bold text-foreground transition-colors group"
                >
                  <Building2 className="h-3.5 w-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>Industry: {ind.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* THE 4-STEP CONVERSION FUNNEL */}
          {/* Solution -> Service -> Case Study -> "Discuss Your Project" */}
          {/* ===================================================================== */}
          <ArticleFunnelSection funnel={funnel} articleTitle={article.title} />
        </article>

        {/* ===================================================================== */}
        {/* RELATED ARTICLES SECTION: NEVER A DEAD END */}
        {/* ===================================================================== */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-border/60 dark:border-slate-800 py-16 mt-8 max-w-7xl mx-auto px-6 z-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent uppercase tracking-wider mb-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Continue Exploring</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
                  Related Architecture Publications
                </h2>
              </div>
              <Link
                href="/insights/blog"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary dark:text-accent hover:underline"
              >
                <span>View Full Engineering Blog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((rel) => (
                <article
                  key={rel.id}
                  className="overflow-hidden rounded-2xl bg-card border border-border/70 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-primary/40"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-slate-950">
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-xs text-white border border-white/20">
                          {rel.category.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-2">
                        <Clock className="h-3 w-3" />
                        <span>{rel.readingTime}</span>
                        <span>•</span>
                        <span>{formatDate(rel.publishedAt)}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors leading-snug mb-2 line-clamp-2">
                        <Link href={`/insights/${rel.slug}`}>{rel.title}</Link>
                      </h3>

                      <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-3 mb-4">
                        {rel.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border/50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-foreground/80">
                      {rel.author.name}
                    </span>
                    <Link
                      href={`/insights/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-primary dark:text-accent hover:underline group/cta"
                    >
                      <span>Read Deep Dive</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover/cta:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
