'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

function AnimatedStatValue({
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
    damping: 28,
    stiffness: 75,
  });
  const isInView = useInView(ref, { once: true, margin: '-20px' });

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

export function StatsSection() {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    {
      num: '99.99%',
      targetValue: 99.99,
      decimals: 2,
      suffix: '%',
      label: 'Server Uptime',
    },
    {
      num: '40%+',
      targetValue: 40,
      decimals: 0,
      suffix: '%+',
      label: 'Infrastructure Saving',
    },
    {
      num: '10M+',
      targetValue: 10,
      decimals: 0,
      suffix: 'M+',
      label: 'API Actions',
    },
    {
      num: '100%',
      targetValue: 100,
      decimals: 0,
      suffix: '%',
      label: 'On-Time SLA Delivery',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: shouldReduceMotion ? 0 : 15 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.12 + index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section className="py-8 md:py-12 px-6 bg-transparent relative overflow-hidden border-y border-border/20">
      {/* Decorative accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[180px] bg-primary/10 dark:bg-accent/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Highlighted prominent metrics container with translucent glass */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="p-6 md:p-8 rounded-[24px] bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl border border-slate-200/90 dark:border-cyan-500/25 shadow-[0_15px_40px_-15px_rgba(11,61,145,0.12)] dark:shadow-[0_20px_50px_-15px_rgba(0,194,255,0.18)] relative overflow-hidden will-change-transform"
        >
          {/* Cyber scanning top border beam (GPU Accelerated) */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 dark:via-accent/40 to-transparent pointer-events-none" />
          {!shouldReduceMotion && (
            <div
              className="absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary dark:via-accent to-transparent blur-[0.5px] pointer-events-none animate-scan-beam"
            />
          )}

          {/* Subtle glowing corner accents */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-accent/20 dark:bg-cyan-400/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-primary/20 dark:bg-primary/25 rounded-full blur-2xl pointer-events-none animate-pulse" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center divide-y sm:divide-y-0 sm:divide-x divide-border/40 dark:divide-slate-800/80">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center justify-center text-center p-3 md:p-4 group select-none rounded-2xl transition-[background-color] duration-300 hover:bg-primary/[0.04] dark:hover:bg-accent/[0.04] will-change-transform cursor-default"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight bg-gradient-to-br from-primary via-secondary to-accent dark:from-accent dark:via-cyan-300 dark:to-white bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_12px_rgba(91,95,239,0.15)] dark:drop-shadow-[0_2px_15px_rgba(0,194,255,0.25)]">
                  <AnimatedStatValue
                    value={stat.targetValue}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    displayRaw={stat.num}
                  />
                </span>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-200 mt-2.5 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

