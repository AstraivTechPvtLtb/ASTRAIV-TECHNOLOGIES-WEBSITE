'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function ClientsSection() {
  const shouldReduceMotion = useReducedMotion();

  const clients = [
    { name: 'Acme Corp' },
    { name: 'Globex' },
    { name: 'Initech' },
    { name: 'Umbrella' },
    { name: 'Hooli' },
    { name: 'Stark Industries' },
  ];

  // Container variants with silky cascading stagger on scroll
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const badgeVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -14, 
      scale: shouldReduceMotion ? 1 : 0.94,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const headingVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, delay: 0.04, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 22, 
      scale: shouldReduceMotion ? 1 : 0.94,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="py-12 md:py-16 bg-transparent border-b border-border/20 relative overflow-hidden">
      {/* Subtle backdrop glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,95,239,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,194,255,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Prominent Header Badge & Noticeable Text with visible scroll animation */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 border border-primary/30 dark:border-accent/30 mb-3.5 shadow-[0_0_18px_rgba(91,95,239,0.15)] dark:shadow-[0_0_18px_rgba(0,194,255,0.2)] backdrop-blur-md cursor-default select-none transition-[border-color,background-color,box-shadow] duration-300 will-change-transform"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-accent shadow-[0_0_6px_currentColor]" />
            </span>
            <span>Trusted Enterprise Network</span>
          </motion.div>
          <motion.h2
            variants={headingVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground font-heading"
          >
            Powering Performance for High-Velocity Engineering Teams
          </motion.h2>
        </div>
        
        {/* Prominent Client Badges Grid with highly visible scroll cascade */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-stretch"
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="group relative flex items-center justify-center h-14 sm:h-16 px-3 sm:px-4 rounded-xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 hover:border-primary/50 dark:hover:border-accent/60 shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(11,61,145,0.15)] dark:hover:shadow-[0_12px_28px_-6px_rgba(0,194,255,0.22)] transition-[border-color,background-color,box-shadow] duration-300 cursor-pointer select-none w-full overflow-hidden will-change-transform"
            >
              {/* Shimmer light sweep on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 dark:via-cyan-400/15 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />

              {/* Glowing Corner Accent on hover */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary/0 group-hover:bg-primary/15 dark:group-hover:bg-accent/20 rounded-bl-xl transition-[background-color] duration-300 pointer-events-none" />

              <span className="text-[11px] sm:text-xs md:text-xs lg:text-[11px] xl:text-xs font-black tracking-wider text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300 uppercase text-center whitespace-nowrap relative z-10">
                {client.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

