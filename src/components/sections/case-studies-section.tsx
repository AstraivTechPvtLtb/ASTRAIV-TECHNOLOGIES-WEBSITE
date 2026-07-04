'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { ArrowUpRight } from 'lucide-react';

export function CaseStudiesSection() {
  const projects = [
    {
      title: 'PulseFit SaaS Platform',
      category: 'SaaS / HealthTech',
      description: 'A multi-tenant fitness analytics dashboard built with Next.js 16 and Prisma. We automated database synchronization and reduced page load times by 65%.',
      metric: '65% faster page loads',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'AeroSync Logistics Routing',
      category: 'Logistics AI / Cloud',
      description: 'Custom scheduling software that coordinates parcel distribution in real-time. Leverages WebSockets for instant tracking updates and optimized routes.',
      metric: '-18% route fuel overhead',
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: 'FinanceFlow Ledger Engine',
      category: 'FinTech / AI Agents',
      description: 'An AI-driven budget analyzer integrating LLMs with bank ledger APIs. Includes secure credentials management and automated reconciliation loops.',
      metric: 'SOC-2 compliant storage',
      color: 'from-cyan-600 to-blue-600',
    },
  ];

  return (
    <section id="case-studies" className="py-20 md:py-28 px-6 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Portfolio"
          title="Premium Case Studies"
          description="A selection of high-performance software engineered for industry category leaders."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              whileHover={{ y: -6 }}
              className="group bg-card border border-border/40 hover:border-primary/20 rounded-[20px] shadow-sm hover:shadow-[0_20px_50px_-20px_rgba(11,61,145,0.06)] overflow-hidden flex flex-col justify-between h-[420px] text-left relative"
            >
              {/* Graphic background gradient preview */}
              <div className={`h-40 w-full bg-gradient-to-br ${project.color} opacity-85 group-hover:opacity-100 transition-opacity duration-300 relative flex items-end p-6 overflow-hidden`}>
                {/* Abstract graphic grid overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#000_100%)] opacity-30" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
                
                <span className="relative z-10 px-3 py-1 text-[10px] font-bold tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full uppercase">
                  {project.category}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/20 mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Impact Metric</span>
                  <span className="text-sm font-extrabold text-foreground tracking-tight bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md border border-border/40">
                    {project.metric}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
