'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { Check } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Psychology & Discovery',
      subtitle: 'Mapping target user personas and cognitive triggers.',
      details: 'We begin by studying your primary client profile. Using cognitive psychology, we establish a structured visual hierarchy and interaction models designed to foster trust and accelerate conversions.',
    },
    {
      num: '02',
      title: 'Architectural Prototyping',
      subtitle: 'Building the visual system and data architecture.',
      details: 'We outline the database schemas (Prisma/PostgreSQL), API endpoints, and structural layouts. We create clean, modern UI designs utilizing our unified system to ensure absolute consistency.',
    },
    {
      num: '03',
      title: 'Typesafe Agile Development',
      subtitle: 'Coding with strict compiler rules and zero tech debt.',
      details: 'Our senior engineers write clean, typesafe code in Next.js and TypeScript. We build components using modular patterns, hook up form schemas with Zod, and ensure codebases are fast and documented.',
    },
    {
      num: '04',
      title: 'Automated Testing & Vitals',
      subtitle: 'E2E test suites, security checks, and load optimization.',
      details: 'We audit the system for performance. We optimize core web vitals, execute automated tests, verify security headers, and ensure high Lighthouse scores for maximum SEO visibility.',
    },
    {
      num: '05',
      title: 'Deployment & SLA Support',
      subtitle: 'Launching on serverless edge with active monitoring.',
      details: 'We deploy to Vercel/AWS load-balancers, cache assets with Cloudflare R2 CDNs, and set up automatic backups. We establish monthly SLA active monitoring for near-zero downtime.',
    },
  ];

  return (
    <section id="process" className="py-20 md:py-28 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-y border-border/20 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Development Process"
          title="Our Execution Roadmap"
          description="How we transform ideas into premium, high-performance software. Transparent, structured, and bulletproof."
        />

        <div className="relative mt-20 max-w-4xl mx-auto flex flex-col gap-12">
          {/* Vertical central tracking line on desktop */}
          <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-slate-800 -translate-x-1/2 pointer-events-none" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-start relative ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Column spacer for desktop alignment */}
                <div className="hidden md:block w-1/2" />

                {/* Timeline central circle indicator */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-[39px] md:left-1/2 top-2 h-10 w-10 rounded-full bg-card border-2 border-primary flex items-center justify-center -translate-x-1/2 z-10 shadow-xs"
                >
                  <span className="text-xs font-extrabold text-primary">{step.num}</span>
                </motion.div>

                {/* Content card */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                  whileHover={{ scale: 1.01 }}
                  className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8 text-left"
                >
                  <div className="p-8 bg-card border border-border/40 rounded-[20px] shadow-sm hover:shadow-[0_15px_40px_-15px_rgba(11,61,145,0.05)] hover:border-primary/10 transition-all duration-300">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary">
                      Stage {step.num}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-foreground mt-1.5">{step.title}</h3>
                    <h4 className="text-xs font-semibold text-muted-foreground italic mt-0.5 leading-relaxed">
                      {step.subtitle}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-semibold mt-4">
                      {step.details}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
