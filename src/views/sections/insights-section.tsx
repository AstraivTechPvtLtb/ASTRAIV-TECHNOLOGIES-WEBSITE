'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { INSIGHT_ARTICLES, type InsightArticle } from '@/lib/insights-data';
import { ROUTES } from '@/routes';
import { EASE_OUT_EXPO, MOTION_DURATIONS, MOTION_VIEWPORT } from '@/lib/motion';

interface InsightsSectionProps {
  initialArticles?: InsightArticle[];
}

export function InsightsSection({ initialArticles }: InsightsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Strictly display the latest 3 canonical articles
  const articles: InsightArticle[] = (
    initialArticles && initialArticles.length >= 3
      ? initialArticles.slice(0, 3)
      : INSIGHT_ARTICLES.slice(0, 3)
  );

  return (
    <section id="insights" aria-label="Latest Tech Insights and Blueprints" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6 text-left">
          <div className="max-w-3xl">

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Software Architecture, AI &amp; Cloud Insights
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Deep dives, benchmark post-mortems, and architectural blueprints written by our principal engineers and system architects.
            </p>
          </div>

          <Link
            href={ROUTES.PUBLIC.INSIGHTS}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-card/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-border/80 dark:border-slate-800 transition-all select-none"
          >
            <span>Explore Insights</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Latest 3 Articles Grid (Category, Title, Excerpt, Reading time) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article, idx) => (
            <motion.article
              key={article.id || article.slug}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={MOTION_VIEWPORT.once}
              transition={{ delay: shouldReduceMotion ? 0 : idx * 0.08, duration: MOTION_DURATIONS.reveal, ease: EASE_OUT_EXPO }}
              whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: MOTION_DURATIONS.fast, ease: EASE_OUT_EXPO } }}
              className="group flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-card/85 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800/80 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-300 shadow-xs hover:shadow-card-hover overflow-hidden transform-gpu"
            >
              <div>
                {/* Article Cover Image */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-border/50 dark:border-slate-800/70 mb-5 shadow-inner">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Top Row: Category & Reading Time */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-wider bg-primary/10 dark:bg-blue-600/15 text-primary dark:text-blue-400 border border-primary/20 dark:border-blue-500/30">
                    {article.category.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Clock className="h-3.5 w-3.5 text-secondary dark:text-blue-400" />
                    <span>{article.readingTime}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors line-clamp-2 mb-2.5">
                  <Link href={ROUTES.PUBLIC.INSIGHTS_DETAIL(article.slug)}>
                    {article.title}
                  </Link>
                </h3>

                {/* Article Excerpt */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="pt-4 border-t border-border/40 dark:border-slate-800/70 flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground/80">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>

                <Link
                  href={ROUTES.PUBLIC.INSIGHTS_DETAIL(article.slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors group/link min-h-[28px] py-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Section Primary CTA */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            href={ROUTES.PUBLIC.INSIGHTS}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-card/85 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-border/70 dark:border-slate-700 hover:border-primary/40 dark:hover:border-blue-400 text-foreground font-bold text-sm transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span>Explore Insights</span>
            <ArrowRight className="h-4 w-4 text-primary dark:text-blue-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
