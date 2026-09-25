'use client';

/**
 * @file client/src/views/sections/solutions-section.tsx
 * @description [VIEW] Homepage Solutions Section.
 * Directly answers: "What business problems can Astraiv solve?"
 * Displays canonical enterprise problem-to-solution mappings with metrics and CTA to /solutions.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, AlertCircle, CheckCircle2, TrendingUp, ShieldCheck, Cpu, Cloud, Sparkles, Layers } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SOLUTIONS_LIST, type SolutionDetail } from '@/lib/solutions-data';
import { ROUTES } from '@/routes';
import { EASE_OUT_EXPO, MOTION_DURATIONS, MOTION_VIEWPORT } from '@/lib/motion';

interface SolutionsSectionProps {
  initialSolutions?: SolutionDetail[];
}

export function SolutionsSection({ initialSolutions = SOLUTIONS_LIST }: SolutionsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  // Display the top 4 canonical solutions for concise high-impact scanning on homepage
  const featuredSolutions = initialSolutions.slice(0, 4);

  const getSolutionIcon = (slug: string) => {
    switch (slug) {
      case 'ai-business-automation':
        return <Cpu className="h-5 w-5 text-primary dark:text-blue-400" />;
      case 'cloud-migration-modernization':
        return <Cloud className="h-5 w-5 text-primary dark:text-blue-400" />;
      case 'enterprise-saas-engineering':
        return <Layers className="h-5 w-5 text-primary dark:text-blue-400" />;
      case 'security-compliance-architecture':
        return <ShieldCheck className="h-5 w-5 text-primary dark:text-blue-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary dark:text-blue-400" />;
    }
  };

  return (
    <section
      id="solutions"
      aria-label="What Business Problems Can Astraiv Solve"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative scroll-mt-24 overflow-hidden"
    >
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 dark:bg-blue-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-16 text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-primary dark:text-blue-300 bg-primary/10 dark:bg-blue-500/10 border border-primary/20 dark:border-blue-400/25 mb-4 select-none">
              <Sparkles className="h-3.5 w-3.5 text-primary dark:text-blue-400" />
              <span>SOLUTIONS ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-foreground leading-[1.2]">
              What business problems{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card/85 dark:bg-slate-900/80 border border-slate-300 dark:border-white/15 text-foreground font-bold text-xs sm:text-sm hover:border-primary/40 dark:hover:border-blue-400/40 hover:text-primary dark:hover:text-blue-400 transition-all shadow-xs group"
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
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={MOTION_VIEWPORT.once}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.07, duration: MOTION_DURATIONS.reveal, ease: EASE_OUT_EXPO }}
              whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: MOTION_DURATIONS.fast, ease: EASE_OUT_EXPO } }}
              className="group relative p-5 sm:p-8 bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-card hover:shadow-card-hover hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-300 flex flex-col justify-between transform-gpu"
            >
              <div>
                {/* Top Bar: Icon, Category & Metric */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-105 transition-all duration-300 shrink-0">
                      {getSolutionIcon(solution.slug)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-300 block">
                        {solution.categoryLabel}
                      </span>
                      <h3 className="text-base sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                        {solution.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0 pl-13 sm:pl-0">
                    <span className="text-base sm:text-lg font-black text-primary dark:text-blue-400 font-mono block">
                      {solution.metric.value}
                    </span>
                    <span className="text-[9.5px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Verified Impact
                    </span>
                  </div>
                </div>

                {/* Problem Statement Box */}
                <div className="mb-4 p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-left">
                  <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>The Business Problem</span>
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium">
                    {solution.businessProblem?.summary || solution.tagline}
                  </p>
                </div>

                {/* Astraiv Solution Box */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-left">
                  <div className="flex items-center gap-2 mb-1 text-primary dark:text-blue-400 font-bold text-[11px] uppercase tracking-wider">
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
                  <TrendingUp className="h-3.5 w-3.5 text-primary dark:text-blue-400" />
                  <span>{solution.metric.label}</span>
                </span>

                <Link
                  href={ROUTES.PUBLIC.SOLUTION_DETAIL(solution.slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors group/link min-h-[28px] py-1"
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
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary hover:bg-[#082d6c] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow-md border border-blue-900/20 dark:border-blue-400/30"
          >
            <span>Explore All Solutions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
