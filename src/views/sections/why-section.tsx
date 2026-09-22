'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  TrendingUp, 
  Layers, 
  Bot, 
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { WHY_ASTRAIV_PILLARS } from '@/lib/why-astraiv-data';

interface WhySectionProps {
  variant?: 'summary' | 'detailed';
}

function getPillarIcon(iconName: string, className = "h-5 w-5") {
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Bot':
      return <Bot className={className} />;
    case 'ShieldCheck':
    default:
      return <ShieldCheck className={className} />;
  }
}

export function WhySection({ variant = 'summary' }: WhySectionProps) {
  const isDetailed = variant === 'detailed';

  return (
    <section id="why-us" className="py-20 md:py-28 px-6 bg-transparent border-y border-border/30 dark:border-slate-800/60 relative scroll-mt-24 overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge={isDetailed ? "Company Philosophy & Architecture" : "Why AstraIV"}
          title={isDetailed ? "Engineered for Mathematical & Operational Certainty" : "Why Businesses Choose AstraIV"}
          description={
            isDetailed
              ? "We engineer mission-critical digital systems around four non-negotiable architectural tenets. Here is our technical philosophy, delivery guarantees, and verification methodology."
              : "We combine cognitive design psychology with elite technical craftsmanship to engineer software that accelerates market leadership."
          }
        />

        {/* Dynamic Grid: 4-Col for summary, 2x2 or 4-Col expanded for detailed */}
        <div className={`grid grid-cols-1 ${isDetailed ? 'md:grid-cols-2 gap-8' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'} mt-14 sm:mt-16 max-w-6xl mx-auto`}>
          {WHY_ASTRAIV_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative p-6 sm:p-8 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-[24px] shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(11,61,145,0.1)] dark:hover:shadow-[0_16px_36px_-10px_rgba(37, 99, 235,0.1)] hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Number, Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black font-mono text-slate-300/80 dark:text-slate-700/80 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                      {pillar.num}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-primary/10 text-primary dark:text-blue-400 border border-primary/20">
                      {pillar.badge}
                    </span>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-border/50 dark:border-slate-700/60 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary dark:text-blue-400">
                    {getPillarIcon(pillar.iconName)}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-2.5 text-left">
                  <h3 className={`${isDetailed ? 'text-xl' : 'text-base sm:text-lg'} font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors`}>
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {isDetailed ? pillar.completeDescription : pillar.summary}
                  </p>
                </div>

                {/* Detailed Mode: Tenets Checklist */}
                {isDetailed && pillar.tenets && pillar.tenets.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-border/40 dark:border-slate-800/80">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block mb-3">
                      Architectural Tenets
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                      {pillar.tenets.map((tenet, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{tenet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Metric or Enterprise Verified Standard */}
              <div className="mt-6 pt-4 border-t border-border/30 dark:border-slate-800/50 flex items-center justify-between text-[11px] font-bold text-muted-foreground/80">
                <div className="flex items-center gap-1.5 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-blue-400 opacity-60 group-hover:opacity-100 group-hover:animate-ping" />
                  <span>{isDetailed ? pillar.metrics.label : 'Enterprise Verified Standard'}</span>
                </div>
                {isDetailed && (
                  <span className="font-mono text-foreground font-extrabold text-xs">
                    {pillar.metrics.value}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Astraiv CTA Button (Only shown on Homepage summary variant) */}
        {!isDetailed && (
          <div className="mt-12 sm:mt-14 text-center">
            <Link
              href={ROUTES.PUBLIC.COMPANY_ANCHORS.WHY_US}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-card/85 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-border/70 dark:border-slate-700 hover:border-primary/40 dark:hover:border-blue-400 text-foreground font-bold text-sm transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 group"
            >
              <span>Why Astraiv: Explore Technical Tenets &amp; Philosophy</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-primary dark:text-blue-400" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
