'use client';

import { motion } from 'framer-motion';

export function ClientsSection() {
  const clients = [
    { name: 'Acme Corp', industry: 'Enterprise SaaS' },
    { name: 'Globex', industry: 'Logistics AI' },
    { name: 'Initech', industry: 'Automation System' },
    { name: 'Umbrella', industry: 'BioTech Platforms' },
    { name: 'Hooli', industry: 'Cloud Engineering' },
    { name: 'Stark Industries', industry: 'Defense Tech' },
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/30 border-b border-border/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center mb-8"
        >
          Powering performance for high-velocity engineering teams
        </motion.p>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.05, opacity: 1 }}
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <span className="text-base font-extrabold tracking-widest text-foreground/75 dark:text-foreground/60 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-300 uppercase">
                {client.name}
              </span>
              <span className="text-[9px] font-semibold tracking-wide text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                {client.industry}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
