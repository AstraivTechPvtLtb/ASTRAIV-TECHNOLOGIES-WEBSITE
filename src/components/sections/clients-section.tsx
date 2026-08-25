'use client';

import { motion } from 'framer-motion';

export function ClientsSection() {
  const clients = [
    { name: 'Acme Corp' },
    { name: 'Globex' },
    { name: 'Initech' },
    { name: 'Umbrella' },
    { name: 'Hooli' },
    { name: 'Stark Industries' },
  ];

  return (
    <section className="py-10 md:py-14 bg-transparent border-b border-border/20 relative overflow-hidden">
      {/* Subtle backdrop glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,95,239,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Prominent Header Badge & Noticeable Text */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-accent animate-pulse" />
            <span>Trusted Enterprise Network</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-foreground"
          >
            Powering Performance for High-Velocity Engineering Teams
          </motion.h2>
        </div>
        
        {/* Prominent Client Badges Grid with translucent glass */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-stretch">
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="flex items-center justify-center py-4 px-4 rounded-xl bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/50 hover:border-primary/40 dark:hover:border-accent/40 shadow-xs hover:shadow-md hover:shadow-primary/5 transition-all duration-300 cursor-pointer group select-none w-full"
            >
              <span className="text-sm sm:text-base font-black tracking-widest text-foreground/80 dark:text-foreground/75 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300 uppercase text-center">
                {client.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

