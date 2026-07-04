'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';

export function StatsSection() {
  const stats = [
    {
      num: '99.99%',
      label: 'Server Uptime',
      description: 'Active SLA uptime monitoring backed by AWS and Cloudflare Edge caching infrastructure.',
    },
    {
      num: '40%+',
      label: 'Infrastructure Saving',
      description: 'Average server overhead reduction achieved by optimizing Next.js queries and databases.',
    },
    {
      num: '10M+',
      label: 'API Actions Processed',
      description: 'Scaling transactions smoothly for high-velocity FinTech and SaaS integrations.',
    },
    {
      num: '100%',
      label: 'On-Time SLA Delivery',
      description: 'Transparent client boards, weekly iterations, and zero project delays.',
    },
  ];

  return (
    <section className="py-20 md:py-28 px-6 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Abstract Grid Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 text-xs font-semibold tracking-wider text-accent bg-accent/10 rounded-full border border-accent/20 uppercase">
            Astraiv Metrics
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-4 font-heading">
            Validated by Operational Excellence
          </h2>
          <p className="text-base text-slate-400 leading-relaxed font-semibold mt-4">
            We hold ourselves to rigorous metrics, ensuring your software is not just visually stunning but highly performant and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col gap-3 p-8 bg-slate-800/40 border border-slate-800 rounded-[20px] backdrop-blur-xs text-left"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-accent tracking-tight font-heading">
                {stat.num}
              </span>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  {stat.label}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-1">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
