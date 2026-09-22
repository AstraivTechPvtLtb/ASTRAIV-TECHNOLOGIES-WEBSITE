'use client';

/**
 * @file client/src/views/sections/final-cta-section.tsx
 * @description [VIEW] Section 11: Final Conversion CTA Section.
 * Headline focused on starting a project with Primary CTA: "Start a Project" and Secondary CTA: "Talk to an Expert".
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { ROUTES } from '@/routes';

interface FinalCtaSectionProps {
  headline?: string;
  subheadline?: string;
}

export function FinalCtaSection({
  headline = 'Ready to build something extraordinary? Start a project with Astraiv.',
  subheadline = 'Whether you are engineering high-velocity web platforms, deploying autonomous AI agent workflows, or modernizing mission-critical enterprise systems, our senior software architects are ready to partner.',
}: FinalCtaSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();

  return (
    <section
      id="final-conversion-cta"
      aria-label="Start a Project with Astraiv"
      className="relative z-10 w-full overflow-hidden py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-transparent"
    >
      {/* Enterprise Radiant Container */}
      <div className="max-w-6xl mx-auto relative rounded-3xl lg:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#0B3D91] via-[#122b68] to-[#0b1329] p-8 sm:p-14 lg:p-20 text-center shadow-2xl border border-blue-400/25">
        {/* Subtle Ambient Shimmer Overlays */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-blue-200 bg-white/10 border border-white/20 backdrop-blur-md mb-6 select-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-300 animate-pulse" />
            <span>START YOUR NEXT BUILD</span>
          </motion.div>

          {/* Statement Headline Focused on Starting a Project */}
          <motion.h2
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.18] mb-6"
          >
            {headline}
          </motion.h2>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-blue-100/85 max-w-2xl leading-relaxed mb-10 font-normal"
          >
            {subheadline}
          </motion.p>

          {/* Dual CTAs: Primary: Start a Project, Secondary: Talk to an Expert */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none"
          >
            {/* Primary CTA: Start a Project */}
            <Link
              href={pathname ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent(pathname)}` : ROUTES.PUBLIC.START_PROJECT}
              onClick={() => {
                if (pathname && typeof window !== 'undefined') {
                  sessionStorage.setItem('astraiv_lead_source_page', pathname);
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl text-sm font-extrabold text-slate-950 bg-white hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 select-none group"
            >
              <span>Start a Project</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Secondary CTA: Talk to an Expert */}
            <Link
              href="/contact#schedule"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 select-none group"
            >
              <MessageSquare className="h-4 w-4 text-blue-300" />
              <span>Talk to an Expert</span>
            </Link>
          </motion.div>

          {/* Credibility Micro-Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/15 text-xs text-blue-200/80 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>ISO 27001 &amp; SOC-2 Certified</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span>Direct Architect Access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span>Non-Disclosure Protected</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
