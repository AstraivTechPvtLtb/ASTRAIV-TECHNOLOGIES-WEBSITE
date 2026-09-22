import React from 'react';
import { BusinessProblem } from '@/lib/solutions-data';
import { AlertCircle, XCircle } from 'lucide-react';

interface BusinessProblemSectionProps {
  problem: BusinessProblem;
  solutionTitle: string;
}

export function BusinessProblemSection({ problem, solutionTitle }: BusinessProblemSectionProps) {
  if (!problem || !problem.title) return null;
  const painPoints = Array.isArray(problem.painPoints) ? problem.painPoints : [];

  return (
    <section className="my-16 sm:my-20">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-red-500/20 p-8 sm:p-12 shadow-xl backdrop-blur-md">
        {/* Subtle red/amber glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>THE BUSINESS PROBLEM</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            {problem.title}
          </h2>

          {problem.summary && (
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
              {problem.summary}
            </p>
          )}

          {painPoints.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-4">
                Critical Friction Points Solved by {solutionTitle}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {painPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-sm text-slate-200"
                  >
                    <XCircle className="h-5 w-5 text-red-400/90 shrink-0 mt-0.5" />
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
