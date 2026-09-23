'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';

export function CareersConfirmationView() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');
  const [fallbackRef, setFallbackRef] = useState('AST-APP-PENDING');

  useEffect(() => {
    if (!refParam) {
      setFallbackRef('AST-APP-' + Math.random().toString(36).substring(2, 7).toUpperCase());
    }
  }, [refParam]);

  const refId = refParam || fallbackRef;
  const roleName = searchParams.get('role') || 'Engineering Position';

  const nextSteps = [
    {
      step: '01',
      title: 'Senior Architecture Review',
      desc: 'Our founding engineers review your submitted profile, GitHub repositories, and past systems within 48 business hours.',
      time: 'Within 48h',
    },
    {
      step: '02',
      title: 'Technical Deep-Dive Call',
      desc: 'If aligned, we will send an invite for a 45-minute technical conversation focusing on system design and trade-offs.',
      time: 'Day 3 - 5',
    },
    {
      step: '03',
      title: 'Paid Design Exercise & Offer',
      desc: 'A practical, paid system RFC exercise followed directly by mutual compensation, equity, and remote contract alignment.',
      time: 'Day 6 - 8',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-6">
      {/* Hero Confirmation Card */}
      <div className="relative rounded-3xl border border-border/80 dark:border-slate-800 bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-8 sm:p-14 text-center overflow-hidden mb-12">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-xl shadow-emerald-500/25 mb-6 flex items-center justify-center text-white"
          >
            <div className="w-full h-full rounded-[22px] bg-slate-950/20 flex items-center justify-center backdrop-blur-sm">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Reference ID Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-4 select-none"
          >
            <span>APPLICATION REF:</span>
            <span className="text-foreground underline decoration-emerald-500/50">{refId}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading mb-4"
          >
            Application Transmitted.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium mb-4"
          >
            Thank you for applying for the{' '}
            <strong className="text-foreground font-bold">{roleName}</strong> position at Astraiv Technologies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-border/50"
          >
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Review SLA: 48 business hours direct from senior engineering leads</span>
          </motion.div>
        </div>
      </div>

      {/* Next Steps Timeline */}
      <div className="mb-12 text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span>What Happens Next</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {nextSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-card/85 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-primary">
                    Step {step.step}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {step.time}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Exploration While You Wait */}
      <div className="p-8 rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-border/70 dark:border-slate-800 text-left">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Explore While You Wait</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={ROUTES.PUBLIC.CAREERS}
            className="p-4 rounded-xl bg-card border border-border/70 dark:border-slate-800 hover:border-primary/50 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                Other Open Positions
              </span>
              <span className="block text-[11px] text-muted-foreground">View all open engineering roles</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link
            href={ROUTES.PUBLIC.INSIGHTS}
            className="p-4 rounded-xl bg-card border border-border/70 dark:border-slate-800 hover:border-primary/50 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                Tech Radar & Insights
              </span>
              <span className="block text-[11px] text-muted-foreground">Inspect our architectural blueprints</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link
            href={ROUTES.PUBLIC.HOME}
            className="p-4 rounded-xl bg-card border border-border/70 dark:border-slate-800 hover:border-primary/50 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                Return to Homepage
              </span>
              <span className="block text-[11px] text-muted-foreground">Explore our client platforms</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
