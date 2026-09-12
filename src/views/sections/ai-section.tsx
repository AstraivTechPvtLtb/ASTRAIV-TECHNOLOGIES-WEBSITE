'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  Bot, 
  Brain, 
  DatabaseZap, 
  Sparkles, 
  Cpu, 
  Workflow, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from '@/i18n/routing';

export function AiSection() {
  const capabilities = [
    {
      icon: <Bot className="h-4 w-4 text-blue-400" />,
      title: 'Autonomous Multi-Agent Systems',
      description: 'Self-orchestrating agents that execute multi-step business logic, query APIs, and resolve complex workflows autonomously.',
    },
    {
      icon: <DatabaseZap className="h-4 w-4 text-primary dark:text-blue-400" />,
      title: 'Enterprise RAG & Document Intelligence',
      description: 'Connecting private data stores and PDF knowledge vaults to LLMs via pgvector semantic search with zero hallucination.',
    },
    {
      icon: <Brain className="h-4 w-4 text-secondary dark:text-indigo-400" />,
      title: 'Custom Model Fine-Tuning',
      description: 'Domain-specific adaptation of open-source models (Llama, Mistral) preserving enterprise privacy while reducing cloud inferencing costs.',
    },
    {
      icon: <Workflow className="h-4 w-4 text-emerald-400" />,
      title: 'Intelligent Process Automation',
      description: 'Automating customer support routing, invoice extraction, KYC verification, and transaction classification loops.',
    },
  ];

  return (
    <section id="ai-expertise" className="py-20 md:py-28 px-6 bg-transparent relative overflow-hidden scroll-mt-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="AI & Innovation"
          title="Intelligence Built Into Your Business"
          description="We do not just wrap basic chat APIs. We architect production-grade vector pipelines, cognitive multi-agent meshes, and custom enterprise automations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-14 sm:mt-16 items-center max-w-6xl mx-auto">
          {/* Left Column: Visual AI Neural Network Picture Feature */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-6 relative w-full h-[320px] sm:h-[400px] md:h-[460px] rounded-[26px] overflow-hidden shadow-sm group border border-border/70 dark:border-slate-800/80 bg-slate-950"
          >
            <Image
              src="/images/ai-showcase.jpg"
              alt="AstraIV Artificial Intelligence Neural Mesh"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

            {/* Floating Top AI Engine Badge */}
            <div className="absolute top-5 left-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-blue-400/40 text-blue-300 font-extrabold text-xs uppercase tracking-wider shadow-lg">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-300" />
                <span>Neural Reasoning Engine v2.6</span>
              </span>
            </div>

            {/* Bottom Overlay Telemetry Pill */}
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-blue-400/20 text-white flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-blue-300">
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Sub-12ms Vector Inference</span>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                High-dimensional embedding pipeline synchronized across global edge clusters.
              </p>
            </div>
          </motion.div>

          {/* Right Column: AI Capability Cards */}
          <div className="lg:col-span-6 flex flex-col gap-4 text-left">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="group p-5 sm:p-6 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 hover:border-primary/40 dark:hover:border-blue-400/40 rounded-[20px] shadow-xs hover:shadow-[0_12px_30px_-10px_rgba(11,61,145,0.08)] dark:hover:shadow-[0_12px_30px_-10px_rgba(37, 99, 235,0.1)] transition-all duration-300 transform-gpu hover:-translate-y-1 flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 flex items-center justify-center shrink-0 border border-border/50 dark:border-slate-700/60 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {cap.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {cap.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <div className="pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Zero-retention private data models</span>
              </div>

              <Link
                href="/technology#ai-expertise"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors group"
              >
                <span>Explore AI Architecture</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
