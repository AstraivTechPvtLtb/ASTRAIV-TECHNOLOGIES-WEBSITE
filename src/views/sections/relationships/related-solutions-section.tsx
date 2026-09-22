import React from 'react';
import { Link } from '@/i18n/routing';
import { SolutionDetail } from '@/lib/solutions-data';
import { ROUTES } from '@/routes';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface RelatedSolutionsSectionProps {
  solutions: SolutionDetail[];
  serviceTitle?: string;
  title?: string;
  subtitle?: string;
}

export function RelatedSolutionsSection({
  solutions,
  serviceTitle,
  title = 'Related Business Solutions',
  subtitle,
}: RelatedSolutionsSectionProps) {
  if (!solutions || solutions.length === 0) return null;

  const displaySubtitle =
    subtitle || (serviceTitle ? `Explore the high-stakes business outcomes powered by our ${serviceTitle} squads.` : 'Explore high-impact enterprise solutions architected to eliminate bottlenecks.');

  return (
    <section className="my-16 sm:my-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SOLUTIONS = PROBLEMS WE SOLVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
            {displaySubtitle}
          </p>
        </div>
        <Link
          href={ROUTES.PUBLIC.SOLUTIONS}
          className="text-xs sm:text-sm font-bold text-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>All Enterprise Solutions</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => (
          <div
            key={solution.slug}
            className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg backdrop-blur-sm"
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2.5 py-0.5 rounded-md">
                  {solution.categoryLabel}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {solution.metric.value}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {solution.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {solution.shortDesc}
              </p>

              {solution.features && solution.features.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-slate-800/70 mb-4">
                  {solution.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
              <span>Inspect Solution Architecture</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>

            <Link
              href={ROUTES.PUBLIC.SOLUTION_DETAIL(solution.slug)}
              className="absolute inset-0 z-10"
              aria-label={`View ${solution.title}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
