'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Mail, Calendar, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function ContactCTASection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="contact" className="relative z-10 w-full overflow-hidden bg-slate-950 pt-20 pb-24 sm:pt-28 sm:pb-32 px-4 sm:px-6 lg:px-8">
      {/* Container with Royal Blue / Indigo Radiant Gradient (Matching PDF Page 5) */}
      <div className="max-w-7xl mx-auto relative rounded-3xl lg:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#0B3D91] via-[#1D4ED8] to-[#5B5FEF] p-8 sm:p-14 lg:p-20 text-center shadow-2xl border border-blue-400/20">
        {/* Subtle Ambient Shimmer Overlays */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-blue-100 bg-white/10 border border-white/20 backdrop-blur-md mb-6 select-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <span>CONTACT US</span>
          </motion.div>

          {/* Statement Headline (Exact PDF Page 5 copy) */}
          <motion.h2
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold tracking-tight text-white leading-tight mb-6"
          >
            Start a conversation.
          </motion.h2>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-blue-100/90 max-w-2xl leading-relaxed mb-10 font-normal"
          >
            Whether you are exploring autonomous AI pipelines, modernizing legacy enterprise systems, or scaling high-velocity web applications, our engineering architects are ready to partner.
          </motion.p>

          {/* Action Buttons (Matching PDF Page 5 Layout: Drop Us a Line or Book a Call) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none"
          >
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 select-none cursor-pointer"
            >
              <span>Drop Us a Line</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <span className="text-xs uppercase font-mono font-bold text-blue-200/80 px-1 hidden sm:inline">
              or
            </span>

            <Link
              href="/contact#schedule"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 select-none cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Book a Consultation</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
