import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { PublicPortfolioProject } from '@/lib/portfolio-data';
import { ROUTES } from '@/routes';
import { ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>MEASURABLE BUSINESS IMPACT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>
        <Link
          href={ROUTES.PUBLIC.CASE_STUDIES}
          className="text-xs sm:text-sm font-bold text-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>All Case Studies</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((cs) => (
          <div
            key={cs.slug}
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-950/70 border border-blue-800/60 px-2.5 py-1 rounded-md">
                    {cs.category}
                  </span>
                  {cs.projectType && (
                    <span className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      {cs.projectType}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {cs.client}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold text-white group-hover:text-blue-400 transition-colors mb-3">
                {cs.title}
              </h3>

              {/* Metric Callout Card */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between gap-4 mb-5">
                <div>
                  <span className="text-2xl font-black font-heading text-white block">
                    {cs.metric}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {cs.metricLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verified ROI</span>
                </div>
              </div>

              {/* Challenge vs Solution */}
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
                    Problem
                  </span>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cs.challenge}
                  </p>
                </div>
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                    Delivered Architecture
                  </span>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {cs.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
              <span>View Case Study</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
