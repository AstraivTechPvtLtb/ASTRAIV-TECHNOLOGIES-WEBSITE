'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, Globe2 } from 'lucide-react';

function AnimatedCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  displayRaw,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  displayRaw: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
  });
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springValue, decimals, prefix, suffix, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span>{displayRaw}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

export function TrustStrip() {
  const shouldReduceMotion = useReducedMotion();

  const metrics = [
    {
      target: 99.99,
      decimals: 2,
      suffix: '%',
      displayRaw: '99.99%',
      label: 'Server Uptime SLA',
      description: 'Zero-downtime edge network',
      icon: <Globe2 className="h-4 w-4 text-primary dark:text-cyan-400" />,
    },
    {
      target: 40,
      decimals: 0,
      suffix: '%+',
      displayRaw: '40%+',
      label: 'Infrastructure Savings',
      description: 'Optimized cloud footprint',
      icon: <Zap className="h-4 w-4 text-secondary dark:text-indigo-400" />,
    },
    {
      target: 10,
      decimals: 0,
      suffix: 'M+',
      displayRaw: '10M+',
      label: 'API Actions Executed',
      description: 'Mission-critical pipelines',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />,
    },
    {
      target: 100,
      decimals: 0,
      suffix: '%',
      displayRaw: '100%',
      label: 'On-Time SLA Delivery',
      description: 'Guaranteed sprint velocity',
      icon: <ShieldCheck className="h-4 w-4 text-blue-500 dark:text-blue-400" />,
    },
  ];

  return (
    <section className="relative z-10 py-10 md:py-12 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-card/40 dark:bg-slate-950/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          {metrics.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col text-left ${index > 0 ? 'pt-5 sm:pt-0 sm:pl-6 lg:pl-8' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-900 border border-border/50 dark:border-slate-800 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  Verified Metric
                </span>
              </div>

              <div className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-foreground font-mono mb-1">
                <AnimatedCounter
                  value={item.target}
                  decimals={item.decimals}
                  suffix={item.suffix}
                  displayRaw={item.displayRaw}
                />
              </div>

              <span className="text-sm font-bold text-foreground mb-0.5">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
