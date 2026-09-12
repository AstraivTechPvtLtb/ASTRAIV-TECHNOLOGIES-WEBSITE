'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  TrendingUp, 
  Layers, 
  Bot, 
  ShieldCheck, 
  Eye, 
  HeartHandshake 
} from 'lucide-react';

export function WhySection() {
  const points = [
    {
      num: '01',
      icon: <TrendingUp className="h-5 w-5 text-primary dark:text-blue-400" />,
      title: 'Business-First Engineering',
      description: "We don't just write code. We build technology around measurable business outcomes, ROI, and customer conversion.",
    },
    {
      num: '02',
      icon: <Layers className="h-5 w-5 text-secondary dark:text-indigo-400" />,
      title: 'Scalable Distributed Architecture',
      description: 'Zero-lock-in solutions designed to effortlessly grow with your users, peak traffic, and expanding enterprise datasets.',
    },
    {
      num: '03',
      icon: <Bot className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
      title: 'AI-Ready Thinking',
      description: 'We integrate practical AI capabilities—agents, RAG, and automated reasoning—where they unlock tangible business value.',
    },
    {
      num: '04',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
      title: 'Security & Reliability',
      description: 'Rigorous engineering practices focused on secure, SOC-2 compliant, fault-tolerant, and maintainable systems.',
    },
    {
      num: '05',
      icon: <Eye className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: 'Transparent Collaboration',
      description: 'Real-time client portal visibility, clear sprint communication, and measurable deliverables with zero tech debt.',
    },
    {
      num: '06',
      icon: <HeartHandshake className="h-5 w-5 text-amber-500 dark:text-amber-400" />,
      title: 'Long-Term Technology Partner',
      description: 'We build relationships far beyond delivery—providing proactive SLAs, architectural audits, and continuous optimization.',
    },
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 px-6 bg-transparent border-y border-border/30 dark:border-slate-800/60 relative scroll-mt-24 overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Why AstraIV"
          title="Why Businesses Choose AstraIV"
          description="We combine cognitive design psychology with elite technical craftsmanship to engineer software that accelerates market leadership."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 sm:mt-16 max-w-6xl mx-auto">
          {points.map((point, index) => (
            <motion.div
              key={point.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative p-7 sm:p-8 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-[22px] shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(11,61,145,0.1)] dark:hover:shadow-[0_16px_36px_-10px_rgba(37, 99, 235,0.1)] hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Top Row: Number & Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-300/80 dark:text-slate-700/80 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                  {point.num}
                </span>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-border/50 dark:border-slate-700/60 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {point.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-2.5 text-left">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                  {point.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {point.description}
                </p>
              </div>

              {/* Subtle bottom line accent on hover */}
              <div className="mt-6 pt-4 border-t border-border/30 dark:border-slate-800/50 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/80 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-blue-400 opacity-60 group-hover:opacity-100 group-hover:animate-ping" />
                <span>Enterprise Verified Standard</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
