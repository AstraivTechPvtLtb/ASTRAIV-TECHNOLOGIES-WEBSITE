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
      <div className="relative overflow-hidden rounded-3xl bg-card/90 dark:bg-slate-900/85 border border-slate-200/80 dark:border-white/10 p-8 sm:p-12 shadow-card backdrop-blur-md">
        {/* Subtle Astraiv blue atmospheric glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground tracking-tight leading-[1.15] mb-4">
            {problem.title}
          </h2>

          {problem.summary && (
            <p className="text-base sm:text-lg text-muted-foreground font-light dark:font-normal leading-relaxed mb-8 max-w-3xl">
              {problem.summary}
            </p>
          )}

          {painPoints.length > 0 && (
            <div className="pt-6 border-t border-border/50 dark:border-slate-800">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground block mb-4">
                Critical Friction Points Solved by {solutionTitle}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {painPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-card dark:bg-slate-950/70 border border-slate-200/80 dark:border-white/10 text-sm text-foreground/90 dark:text-slate-200 shadow-card font-light dark:font-normal leading-relaxed"
                  >
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
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
