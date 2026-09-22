import React from 'react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { ArrowRight, MessageSquareCode } from 'lucide-react';

interface SolutionCTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
  solutionName?: string;
}

export function SolutionCTASection({
  title = 'Ready to solve enterprise bottlenecks with this solution?',
  subtitle = 'Connect directly with our principal solutions architect to evaluate feasibility, data boundaries, and timelines.',
  buttonText = 'Talk to an Expert',
  href,
  solutionName,
}: SolutionCTASectionProps) {
  const targetHref =
    href || (solutionName ? `/contact?solution=${encodeURIComponent(solutionName)}` : ROUTES.PUBLIC.CONTACT);

  return (
    <section className="my-16 sm:my-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 sm:p-14 text-center shadow-2xl">
        {/* Glow accents */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <MessageSquareCode className="h-3.5 w-3.5" />
            <span>ARCHITECTURAL CONSULTATION</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={targetHref}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all duration-300 group active:scale-95"
            >
              <span>{buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={ROUTES.PUBLIC.SOLUTIONS}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-colors"
            >
              <span>Explore All Solutions</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
