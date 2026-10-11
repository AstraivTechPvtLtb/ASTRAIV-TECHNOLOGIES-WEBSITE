import React from 'react';
import { Link } from '@/i18n/routing';
import { IndustryDetail } from '@/lib/industries-data';
import { ROUTES } from '@/routes';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface RelevantIndustriesSectionProps {
  industries: IndustryDetail[];
  title?: string;
  subtitle?: string;
}

export function RelevantIndustriesSection({
  industries,
  title = 'Relevant Industries',
  subtitle = 'Vertical domains where these systems solve high-stakes compliance and operational bottlenecks.',
}: RelevantIndustriesSectionProps) {
  if (!industries || industries.length === 0) return null;

  return (
    <section className="my-16 sm:my-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground block mb-2">
            VERTICAL EXPERTISE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground tracking-tight leading-[1.15]">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-light dark:font-normal leading-[1.62] mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>
        <Link
          href={ROUTES.PUBLIC.INDUSTRIES}
          className="text-xs sm:text-sm font-medium text-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>All Industries</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {industries.map((ind) => (
          <div
            key={ind.slug}
            className="group relative bg-card/90 hover:bg-card dark:bg-slate-900/50 dark:hover:bg-slate-900/90 border border-border/80 dark:border-slate-800 hover:border-primary/40 dark:hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card hover:shadow-card-hover"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider skill-badge-gradient text-foreground shadow-xs">
                  {ind.code}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium skill-badge-gradient text-foreground shadow-xs">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span>Compliant</span>
                </span>
              </div>

              <h3 className="text-base font-medium tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-blue-400 transition-colors mb-1.5">
                {ind.label}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light dark:font-normal mb-4">
                {ind.tagline}
              </p>
            </div>

            <div className="pt-3 border-t border-border/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary dark:group-hover:text-blue-400">
              <span className="text-[11px] font-mono text-muted-foreground line-clamp-1">
                {ind.kpis?.[0]?.value ? `${ind.kpis[0].value} ${ind.kpis[0].label}` : 'Domain Verified'}
              </span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>

            <Link
              href={ROUTES.PUBLIC.INDUSTRY_DETAIL(ind.slug)}
              className="absolute inset-0 z-10"
              aria-label={`View ${ind.label} Industry`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
