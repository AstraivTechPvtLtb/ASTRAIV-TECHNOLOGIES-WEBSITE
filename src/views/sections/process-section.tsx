'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  Compass, 
  Target, 
  Palette, 
  Code2, 
  Rocket, 
  LineChart,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { CANONICAL_PROCESS_STAGES } from '@/lib/process-data';

interface ProcessSectionProps {
  variant?: 'summary' | 'detailed';
}

function getStageIcon(iconName: string, className = "h-5 w-5") {
  switch (iconName) {
    case 'Compass':
      return <Compass className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    case 'LineChart':
    default:
      return <LineChart className={className} />;
  }
}

export function ProcessSection({ variant = 'summary' }: ProcessSectionProps) {
  const isDetailed = variant === 'detailed';

  return (
    <section id="process" className="py-20 md:py-28 px-6 bg-transparent border-y border-border/30 dark:border-slate-800/60 relative scroll-mt-24 overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge={isDetailed ? "Canonical Engineering Lifecycle" : "How We Work"}
          title={isDetailed ? "The AstraIV 6-Stage Engineering Roadmap" : "From Idea to Impact"}
          description={
            isDetailed
              ? "Every engagement strictly adheres to our deterministic 6-stage lifecycle. Each stage is gated by automated verification benchmarks, peer architecture reviews, and immutable deliverables."
              : "A disciplined, transparent 6-stage engineering roadmap ensuring your product is delivered on time, within scope, and architected to scale."
          }
        />

        {/* 6-step Grid */}
        <div className={`grid grid-cols-1 ${isDetailed ? 'md:grid-cols-2 lg:grid-cols-3 gap-8' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'} mt-14 sm:mt-16 max-w-6xl mx-auto`}>
          {CANONICAL_PROCESS_STAGES.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative p-7 sm:p-8 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-[24px] shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(11,61,145,0.1)] dark:hover:shadow-[0_16px_36px_-10px_rgba(37, 99, 235,0.1)] hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Stage & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 rounded-full border border-primary/20 dark:border-blue-400/20">
                    Stage {step.num} • {step.tag}
                  </span>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-primary dark:text-blue-400 border border-border/50 dark:border-slate-700/60 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {getStageIcon(step.iconName)}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-2 text-left">
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {isDetailed ? step.detailedDesc : step.summary}
                  </p>
                </div>

                {/* Detailed Mode: Deliverables & Quality Gates */}
                {isDetailed && (
                  <div className="mt-6 pt-5 border-t border-border/40 dark:border-slate-800/80 space-y-4">
                    <div>
                      <span className="text-[10.5px] font-mono uppercase font-bold text-slate-400 block mb-2">
                        Key Deliverables
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {step.keyDeliverables.map((deliv, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-border/20 dark:border-slate-800/40">
                      <span className="text-[10.5px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1.5 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Quality Gate</span>
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {step.qualityGates[0]}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Line */}
              <div className="mt-6 pt-4 border-t border-border/30 dark:border-slate-800/50 flex items-center justify-between text-[11px] font-semibold text-muted-foreground/75">
                <span>Phase {index + 1} of 6</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4, 5].map((dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIdx <= index
                          ? 'w-4 bg-primary dark:bg-blue-400'
                          : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Page Full Explanation Link (Only shown on Homepage summary variant) */}
        {!isDetailed && (
          <div className="mt-12 sm:mt-14 text-center">
            <Link
              href={ROUTES.PUBLIC.COMPANY_ANCHORS.PROCESS}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-foreground hover:text-primary dark:hover:text-blue-400 bg-card/80 hover:bg-card border border-border/60 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all shadow-xs hover:shadow-md group"
            >
              <span>Explore Full 6-Stage Process &amp; Quality Gates</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
