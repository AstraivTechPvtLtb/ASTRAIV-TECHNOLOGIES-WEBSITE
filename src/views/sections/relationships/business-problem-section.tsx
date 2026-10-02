import React from 'react';
import { BusinessProblem } from '@/lib/solutions-data';
import { AlertCircle } from 'lucide-react';

interface BusinessProblemSectionProps {
  problem: BusinessProblem;
  solutionTitle: string;
}

export function BusinessProblemSection({ problem, solutionTitle }: BusinessProblemSectionProps) {
  if (!problem || !problem.title) return null;
  const painPoints = Array.isArray(problem.painPoints) ? problem.painPoints : [];

  return (
    <section className="my-16 sm:my-20">
      <div className="relative overflow-hidden rounded-3xl bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xl backdrop-blur-md">
        {/* Subtle Astraiv blue atmospheric glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/20">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>The Business Problem</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-[-0.025em] leading-[1.15] mb-4">
            {problem.title}
          </h2>

          {problem.summary && (
            <p className="text-base sm:text-lg text-muted-foreground font-normal leading-[1.62] mb-8 max-w-3xl">
              {problem.summary}
            </p>
          )}

          {painPoints.length > 0 && (
            <div className="pt-6 border-t border-border/50 dark:border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-4">
                Critical Friction Points Solved by {solutionTitle}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {painPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-card dark:bg-slate-950/70 border border-border/70 dark:border-slate-800/90 text-sm text-foreground/90 dark:text-slate-200 shadow-xs"
                  >
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
