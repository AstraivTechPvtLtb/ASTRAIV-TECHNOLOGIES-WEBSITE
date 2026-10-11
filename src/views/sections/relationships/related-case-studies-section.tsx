import React from 'react';
import { Link } from '@/i18n/routing';
import type { PublicPortfolioProject } from '@/lib/portfolio-data';
import { ROUTES } from '@/routes';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface RelatedCaseStudiesSectionProps {
  caseStudies: PublicPortfolioProject[];
  title?: string;
  subtitle?: string;
}

export function RelatedCaseStudiesSection({
  caseStudies,
  title = 'Related Case Studies & Production Proof',
  subtitle = 'Verified client deployments demonstrating measurable business velocity and system reliability.',
}: RelatedCaseStudiesSectionProps) {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section className="my-16 sm:my-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground tracking-tight leading-[1.15]">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-light dark:font-normal leading-[1.62] mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>
        <Link
          href={ROUTES.PUBLIC.CASE_STUDIES}
          className="text-xs sm:text-sm font-medium text-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>All Case Studies</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {caseStudies.map((cs) => (
          <div
            key={cs.slug}
            className="group relative bg-card/90 hover:bg-card dark:bg-slate-900/60 dark:hover:bg-slate-900/90 border border-border/80 dark:border-slate-800 hover:border-primary/40 dark:hover:border-slate-700 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card hover:shadow-card-hover h-full"
          >
            {/* Top / Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* 1. Header tags */}
              <div className="flex items-center justify-between gap-3 mb-4 min-h-7">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium uppercase tracking-wider skill-badge-gradient text-foreground shadow-xs">
                    {cs.category}
                  </span>
                  {cs.projectType && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider skill-badge-gradient text-foreground shadow-xs">
                      {cs.projectType}
                    </span>
                  )}
                </div>
                <span className="text-xs font-normal text-muted-foreground shrink-0 text-right">
                  {cs.client}
                </span>
              </div>

              {/* 2. Title */}
              <h3 className="text-xl font-medium tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2 min-h-13 sm:min-h-14 mb-4 flex items-start">
                {cs.title}
              </h3>

              {/* 3. Metric Callout Card */}
              <div className="min-h-22 sm:min-h-23 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-xl sm:text-2xl font-medium tracking-[-0.02em] text-foreground block leading-tight line-clamp-2">
                    {cs.metric}
                  </span>
                  <span className="text-xs text-muted-foreground font-light mt-0.5 truncate block">
                    {cs.metricLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary dark:text-cyan-400 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verified ROI</span>
                </div>
              </div>

              {/* 4. Challenge vs Solution (Problem vs Delivered Architecture) */}
              <div className="flex-1 flex flex-col justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground block mb-1">
                    Problem
                  </span>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-10 font-light dark:font-normal">
                    {cs.challenge}
                  </p>
                </div>
                <div>
                  <span className="text-[10.5px] font-medium uppercase tracking-wider text-primary dark:text-blue-400 block mb-1">
                    Delivered Architecture
                  </span>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed min-h-15 font-light dark:font-normal">
                    {cs.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Bottom action / CTA Footer */}
            <div className="mt-auto pt-4 border-t border-border/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-primary dark:text-blue-400 group-hover:text-primary/80 dark:group-hover:text-blue-300">
              <span>View Case Study</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>

            <Link
              href={ROUTES.PUBLIC.CASE_STUDY_DETAIL(cs.slug)}
              className="absolute inset-0 z-10"
              aria-label={`View Case Study ${cs.title}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
