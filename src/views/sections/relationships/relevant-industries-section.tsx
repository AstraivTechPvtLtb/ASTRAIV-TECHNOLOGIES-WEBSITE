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
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 block mb-2">
            VERTICAL EXPERTISE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>
        <Link
          href={ROUTES.PUBLIC.INDUSTRIES}
          className="text-xs sm:text-sm font-bold text-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>All Industries</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {industries.map((ind) => (
          <div
            key={ind.slug}
            className="group relative bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                  {ind.code}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Compliant</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-primary dark:group-hover:text-blue-400 transition-colors mb-1.5">
                {ind.label}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {ind.tagline}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-blue-400">
              <span className="text-[11px] font-mono text-slate-400 line-clamp-1">
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
