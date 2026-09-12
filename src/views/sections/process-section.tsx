'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  Compass, 
  Target, 
  Palette, 
  Code2, 
  Rocket, 
  LineChart 
} from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      tag: 'Alignment',
      icon: <Compass className="h-5 w-5" />,
      description: 'We audit your current tech, understand core business challenges, analyze end-user personas, and define measurable outcomes.',
    },
    {
      num: '02',
      title: 'Strategize',
      tag: 'Architecture',
      icon: <Target className="h-5 w-5" />,
      description: 'We design the technology blueprint, data schemas, API contracts, cloud architecture, and sprint delivery milestones.',
    },
    {
      num: '03',
      title: 'Design',
      tag: 'Experience',
      icon: <Palette className="h-5 w-5" />,
      description: 'We construct modern, accessible, high-conversion UI/UX interfaces backed by cohesive design tokens and psychology-driven layouts.',
    },
    {
      num: '04',
      title: 'Build',
      tag: 'Engineering',
      icon: <Code2 className="h-5 w-5" />,
      description: 'Our senior architects code with strict typesafety in Next.js, TypeScript, and modern databases with zero architectural debt.',
    },
    {
      num: '05',
      title: 'Launch',
      tag: 'Verification',
      icon: <Rocket className="h-5 w-5" />,
      description: 'We run end-to-end security audits, load-testing, and SEO optimization before deploying to zero-downtime multi-region edge servers.',
    },
    {
      num: '06',
      title: 'Scale',
      tag: 'Evolution',
      icon: <LineChart className="h-5 w-5" />,
      description: 'We continuously monitor live telemetry, optimize conversion funnels, automate internal pipelines, and scale features alongside growth.',
    },
  ];

  return (
    <section id="process" className="py-20 md:py-28 px-6 bg-transparent border-y border-border/30 dark:border-slate-800/60 relative scroll-mt-24 overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="How We Work"
          title="From Idea to Impact"
          description="A disciplined, transparent 6-stage engineering roadmap ensuring your product is delivered on time, within scope, and architected to scale."
        />

        {/* 6-step Grid with progressive connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 sm:mt-16 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative p-7 sm:p-8 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-[22px] shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(11,61,145,0.1)] dark:hover:shadow-[0_16px_36px_-10px_rgba(37, 99, 235,0.1)] hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Top Row: Stage & Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 rounded-full border border-primary/20 dark:border-blue-400/20">
                  Stage {step.num} • {step.tag}
                </span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-primary dark:text-blue-400 border border-border/50 dark:border-slate-700/60 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2 text-left">
                <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              {/* Progress Line */}
              <div className="mt-6 pt-4 border-t border-border/30 dark:border-slate-800/50 flex items-center justify-between text-[11px] font-semibold text-muted-foreground/75">
                <span>Phase {index + 1} of 6</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4, 5].map((dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        dotIdx <= index
                          ? 'w-4 bg-primary dark:bg-blue-400'
                          : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
