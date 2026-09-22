'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { Search, Clock, Calendar, ArrowRight, Sparkles, BookOpen, Layers, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils';
import type { InsightArticle, InsightCategory } from '@/lib/insights-data';

interface InsightsBlogViewProps {
  initialArticles: InsightArticle[];
  categories: InsightCategory[];
  initialCategory?: string;
}

export function InsightsBlogView({
  initialArticles,
  categories,
  initialCategory = 'all',
}: InsightsBlogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        article.category.slug === selectedCategory ||
        article.category.id === selectedCategory;

      const matchesSearch =
        searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  return (
    <div className="w-full relative overflow-hidden bg-background text-foreground">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 px-6 max-w-7xl mx-auto text-left relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-4">
          <Link href="/insights" className="hover:text-primary transition-colors">
            Insights
          </Link>
          <span>/</span>
          <span className="text-primary font-extrabold">Engineering Blog</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-border/60 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Technical Publications & Systems Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-foreground">
              Astraiv Engineering Blog
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium mt-2 max-w-2xl leading-relaxed">
              In-depth architectural breakdowns, production engineering tutorials, and distributed systems case studies written by senior practitioners.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <div className="relative flex items-center bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-1 shadow-xs focus-within:border-primary dark:focus-within:border-accent focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="h-4 w-4 text-muted-foreground ml-3 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search by topic, keyword, or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-2.5 py-1 text-muted-foreground hover:text-foreground font-bold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 7 Canonical Categories Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all select-none cursor-pointer',
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                : 'bg-card border border-border/70 dark:border-slate-800 text-muted-foreground hover:text-foreground'
            )}
          >
            All Disciplines ({initialArticles.length})
          </button>
          {categories.map((cat) => {
            const count = initialArticles.filter((a) => a.category.slug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all select-none cursor-pointer flex items-center gap-1.5',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                    : 'bg-card border border-border/70 dark:border-slate-800 text-muted-foreground hover:text-foreground'
                )}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Count Telemetry */}
        <div className="text-xs font-bold text-muted-foreground mb-8">
          Showing {filteredArticles.length} of {initialArticles.length} published publications
        </div>

        {/* Articles Stream Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-2xl bg-card border border-border/70 dark:border-slate-800/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-primary/40 dark:hover:border-accent/40"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Category pill on image */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[10.5px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                        {article.category.name}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 text-white text-[11px] font-bold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span>{article.readingTime}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    <h2 className="text-xl font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors leading-snug mb-3">
                      <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Author Bar */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50 dark:border-slate-800">
                      {article.author.image && (
                        <Image
                          src={article.author.image}
                          alt={article.author.name}
                          width={32}
                          height={32}
                          className="rounded-full ring-2 ring-primary/20 object-cover"
                        />
                      )}
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {article.author.name}
                        </div>
                        <div className="text-[10.5px] text-muted-foreground font-medium">
                          {article.author.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Cross-linking bar */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-border/50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {article.relatedSolutionSlugs?.[0] && (
                      <span className="text-[10px] font-extrabold text-primary dark:text-blue-400 flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        <span>Solution</span>
                      </span>
                    )}
                    {article.relatedServiceSlugs?.[0] && (
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 ml-2">
                        <Cpu className="h-3 w-3" />
                        <span>Service</span>
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-primary dark:text-accent hover:underline group/btn"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-card/60 rounded-2xl border border-border/60">
              <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-foreground mb-1">No articles found</h3>
              <p className="text-xs text-muted-foreground font-medium">
                Try selecting &ldquo;All Disciplines&rdquo; or adjusting your search query.
              </p>
            </div>
          )}
        </div>

        {/* Lead Generation CTA Banner */}
        <div className="p-8 sm:p-12 rounded-[28px] bg-gradient-to-br from-primary/10 via-card to-card dark:from-blue-600/15 dark:via-slate-900 dark:to-slate-900 border border-primary/20 dark:border-blue-500/25 text-left shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 block mb-2">
              Astraiv Engineering Lab
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mb-2 font-heading">
              Have an architectural question or scaling challenge?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
              Our principal software architects and AI systems engineers consult directly with engineering squads to evaluate tech stacks, eliminate bottlenecks, and deploy production software.
            </p>
          </div>

          <Link
            href={ROUTES.PUBLIC.CONTACT}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95 shrink-0"
          >
            <span>Talk to an Expert</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
