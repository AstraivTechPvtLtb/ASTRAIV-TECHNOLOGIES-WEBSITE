'use client';

/**
 * @file client/src/views/sections/solutions-section.tsx
 * @description [VIEW] Homepage Solutions Section.
 * Directly answers: "What business problems can Astraiv solve?"
 * Displays canonical enterprise problem-to-solution mappings with metrics and CTA to /solutions.
 */

import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, ShieldCheck, Cpu, Cloud, Sparkles, Layers } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SOLUTIONS_LIST, type SolutionDetail } from '@/lib/solutions-data';
import { ROUTES } from '@/routes';

interface SolutionsSectionProps {
  initialSolutions?: SolutionDetail[];
}

export function SolutionsSection({ initialSolutions = SOLUTIONS_LIST }: SolutionsSectionProps) {
  // Display the top 4 canonical solutions for concise high-impact scanning on homepage
  const featuredSolutions = initialSolutions.slice(0, 4);

  const getSolutionIcon = (slug: string) => {
    switch (slug) {
      case 'ai-business-automation':
        return <Cpu className="h-5 w-5 text-cyan-400" />;
      case 'cloud-migration-modernization':
        return <Cloud className="h-5 w-5 text-sky-400" />;
      case 'enterprise-saas-engineering':
        return <Layers className="h-5 w-5 text-blue-400" />;
      case 'security-compliance-architecture':
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-indigo-400" />;
    }
  };

  return (
    <section
      id="solutions"
      aria-label="What Business Problems Can Astraiv Solve"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative scroll-mt-24 overflow-hidden"
    >
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 dark:bg-blue-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-16 text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-4 select-none">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>SOLUTIONS ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
              What business problems{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                can Astraiv solve?
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-medium">
              We don&apos;t just deliver software features—we solve high-stakes operational bottlenecks, eliminate crippling infrastructure spend, and engineer scalable engines for growth.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href={ROUTES.PUBLIC.SOLUTIONS}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/85 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 text-foreground font-bold text-xs sm:text-sm hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:text-cyan-400 transition-all shadow-xs group"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 2x2 Problem-to-Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {featuredSolutions.map((solution, index) => (
            <motion.article
              key={solution.slug}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative p-7 sm:p-8 bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-[24px] shadow-xs hover:shadow-[0_20px_50px_-15px_rgba(0,242,254,0.12)] hover:border-cyan-500/40 dark:hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Bar: Icon, Category & Metric */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
                      {getSolutionIcon(solution.slug)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                        {solution.categoryLabel}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-cyan-300 transition-colors">
                        {solution.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-lg font-black text-cyan-400 font-mono block">
                      {solution.metric.value}
                    </span>
                    <span className="text-[9.5px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Verified Impact
                    </span>
                  </div>
                </div>

                {/* Problem Statement Box */}
                <div className="mb-4 p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-left">
                  <div className="flex items-center gap-2 mb-1 text-amber-500 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>The Business Problem</span>
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium">
                    {solution.businessProblem?.summary || solution.tagline}
                  </p>
                </div>

                {/* Astraiv Solution Box */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-border/60 dark:border-slate-700/60 text-left">
                  <div className="flex items-center gap-2 mb-1 text-cyan-500 dark:text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Astraiv Solution</span>
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
                    {solution.shortDesc}
                  </p>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="mt-6 pt-4 border-t border-border/40 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{solution.metric.label}</span>
                </span>

                <Link
                  href={ROUTES.PUBLIC.SOLUTION_DETAIL(solution.slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                >
                  <span>Explore Solution</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Section Primary CTA Button */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            href={ROUTES.PUBLIC.SOLUTIONS}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:via-sky-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(0,242,254,0.35)] hover:shadow-[0_0_45px_rgba(0,242,254,0.55)] hover:scale-105 active:scale-95"
          >
            <span>Explore Solutions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
