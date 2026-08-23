'use client';

import { motion } from 'framer-motion';

export function StatsSection() {
  const stats = [
    {
      num: '99.99%',
      label: 'Server Uptime',
    },
    {
      num: '40%+',
      label: 'Infrastructure Saving',
    },
    {
      num: '10M+',
      label: 'API Actions',
    },
    {
      num: '100%',
      label: 'On-Time SLA Delivery',
    },
  ];

  return (
    <section className="py-8 md:py-12 px-6 bg-gradient-to-b from-background via-slate-100/80 to-background dark:from-background dark:via-slate-900/50 dark:to-background relative overflow-hidden border-y border-border/30">
      {/* Decorative accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[160px] bg-primary/10 dark:bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Highlighted prominent metrics container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="p-6 md:p-8 rounded-[24px] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-primary/20 dark:border-accent/25 shadow-[0_15px_40px_-15px_rgba(91,95,239,0.12)] relative overflow-hidden"
        >
          {/* Subtle glowing corner accent */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/15 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-center divide-y sm:divide-y-0 sm:divide-x divide-border/30">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center p-3 md:p-4 group select-none"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary dark:text-accent tracking-tight font-heading group-hover:scale-105 transition-transform duration-300">
                  {stat.num}
                </span>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-foreground/80 dark:text-foreground/90 mt-2">
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

