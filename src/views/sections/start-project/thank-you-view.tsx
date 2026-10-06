'use client';

/**
 * @file client/src/views/sections/start-project/thank-you-view.tsx
 * @description [VIEW] Post-submission confirmation experience with next steps and recommended explorations.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  BookOpen,
  Mail,
  Phone,
  Layers,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';

export function ThankYouView() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');
  const [fallbackRef, setFallbackRef] = useState('AST-PRJ-PENDING');

  useEffect(() => {
    if (!refParam) {
      setFallbackRef('AST-PRJ-' + Math.random().toString(36).substring(2, 7).toUpperCase());
    }
  }, [refParam]);

  const refId = refParam || fallbackRef;
  const projectType = searchParams.get('type') || 'Custom Project';

  return (
    <div className="w-full max-w-5xl mx-auto py-10 sm:py-16 px-4 sm:px-6">
      {/* 1. Hero Confirmation Card */}
      <div className="relative rounded-3xl border border-border/80 dark:border-slate-800 bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-8 sm:p-14 text-center overflow-hidden">
        {/* Ambient Radiant Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* Animated Celebration Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-3xl bg-linear-to-br from-primary to-cyan-500 p-0.5 shadow-xl shadow-primary/25 mb-6 flex items-center justify-center text-white"
          >
            <div className="w-full h-full rounded-[22px] bg-slate-950/20 flex items-center justify-center backdrop-blur-sm">
              <CheckCircle2 className="w-10 h-10 text-white animate-pulse" />
            </div>
          </motion.div>

          {/* Reference ID Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-primary dark:text-cyan-400 bg-primary/10 border border-primary/20 mb-4 select-none"
          >
            <span>REFERENCE ID:</span>
            <span className="text-foreground underline decoration-primary/50 dark:decoration-cyan-400/50">{refId}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.12] text-foreground font-heading"
          >
            Project Brief Received!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-muted-foreground mt-4 leading-[1.62] font-normal"
          >
            Thank you for trusting Astraiv Technologies with your <strong className="text-foreground">{projectType}</strong>. Your technical specifications and parameters have been securely stored and assigned to our Senior Solutions Architecture team.
          </motion.p>

          {/* Guaranteed SLA Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 dark:bg-blue-400/10 border border-primary/20 dark:border-blue-400/20 text-xs font-medium text-primary dark:text-blue-300"
          >
            <Clock className="w-4 h-4 text-primary dark:text-blue-400 shrink-0" />
            <span>Guaranteed Response Time: Within 24 business hours</span>
          </motion.div>
        </div>
      </div>

      {/* 2. What Happens Next: 3-Stage Visual Pipeline */}
      <div className="mt-12 sm:mt-16">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400">
            TRANSPARENT WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] leading-[1.15] text-foreground font-heading mt-1">
            What Happens Next?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-normal">
            Here is our disciplined 3-step qualification process from transmission to sprint kickoff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl border border-border/70 dark:border-slate-800 bg-card/60 dark:bg-slate-900/60 backdrop-blur-md relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-mono font-semibold text-sm mb-4">
                01
              </div>
              <h3 className="font-semibold text-base tracking-[-0.01em] text-foreground">Architectural Feasibility</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-[1.62] font-normal">
                Our Principal Architects analyze your tech stack feasibility, infrastructure dependencies, and project scope to formulate an initial engineering dossier.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-mono text-primary dark:text-blue-400 font-medium">
              Hours 0 — 12
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl border border-border/70 dark:border-slate-800 bg-card/60 dark:bg-slate-900/60 backdrop-blur-md relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-400 border border-primary/20 flex items-center justify-center font-mono font-semibold text-sm mb-4">
                02
              </div>
              <h3 className="font-semibold text-base tracking-[-0.01em] text-foreground">Mutual NDA & Roadmap</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-[1.62] font-normal">
                We provide a countersigned mutual Non-Disclosure Agreement (protecting all your IP) alongside an initial milestone timeline and squad allocation proposal.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-mono text-primary dark:text-blue-400 font-medium">
              Hours 12 — 24
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl border border-border/70 dark:border-slate-800 bg-card/60 dark:bg-slate-900/60 backdrop-blur-md relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-mono font-semibold text-sm mb-4">
                03
              </div>
              <h3 className="font-semibold text-base tracking-[-0.01em] text-foreground">Discovery Strategy Session</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-[1.62] font-normal">
                A 30-minute high-bandwidth video conference with our Lead Systems Architect to finalize architecture choices, review mockups, and schedule sprint kickoff.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-medium">
              Within 48 Hours
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recommended Next Steps: Case Studies & Insights */}
      <div className="mt-14 sm:mt-20">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400">
            WHILE YOU WAIT
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] leading-[1.15] text-foreground font-heading mt-1">
            Explore How We Deliver
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-normal">
            Review our verified production case studies or read our latest technical whitepapers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Explore Case Studies */}
          <Link
            href={ROUTES.PUBLIC.CASE_STUDIES}
            className="group p-8 rounded-3xl border border-border/70 dark:border-slate-800 bg-linear-to-br from-card/80 to-card/40 dark:from-slate-900/80 dark:to-slate-900/40 hover:border-primary/50 dark:hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 block relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>Explore Case Studies</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-[1.62] font-normal">
              Examine our real-world deliverables, including AI-driven platforms, high-velocity SaaS apps, and scalable cloud systems engineered for high-growth enterprises.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-primary dark:text-blue-400">
              <span>Browse Client Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Read Insights */}
          <Link
            href={ROUTES.PUBLIC.INSIGHTS}
            className="group p-8 rounded-3xl border border-border/70 dark:border-slate-800 bg-linear-to-br from-card/80 to-card/40 dark:from-slate-900/80 dark:to-slate-900/40 hover:border-primary/50 dark:hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 block relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-cyan-400/10 text-primary dark:text-cyan-400 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              <span>Read Engineering Insights</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-[1.62] font-normal">
              Discover technical articles on autonomous LLM agent design, Next.js App Router performance, zero-trust cloud security, and institutional engineering standards.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-primary dark:text-cyan-400">
              <span>Read Technical Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Urgent Direct Escalation Bar */}
      <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-border/60 dark:border-slate-800/80 bg-muted/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h4 className="font-semibold text-sm text-foreground">Need immediate architectural assistance?</h4>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Reach our senior solutions desk directly via email or telephone.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:info@astraivtechnologies.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-border/70 hover:border-primary/40 bg-card hover:bg-card/80 text-foreground transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>Email Solutions Desk</span>
          </a>
          <a
            href="tel:+918167409664"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-border/70 hover:border-primary/40 bg-card hover:bg-card/80 text-foreground transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-primary dark:text-cyan-400" />
            <span>+91 8167409664</span>
          </a>
        </div>
      </div>
    </div>
  );
}
