'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { Brain, Cpu, MessageSquareCode, DatabaseZap } from 'lucide-react';

export function AiSection() {
  const capabilities = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: 'Autonomous AI Agents',
      description: 'We develop self-orchestrating agent workflows that execute complex multi-step processes, connect to external APIs, write to databases, and handle customer support flows autonomously.',
    },
    {
      icon: <DatabaseZap className="h-6 w-6 text-secondary" />,
      title: 'Enterprise RAG Pipelines',
      description: 'Retrieval-Augmented Generation enables your LLM to access proprietary enterprise documentation in real-time, matching queries with semantic accuracy using vector databases like pgvector.',
    },
    {
      icon: <MessageSquareCode className="h-6 w-6 text-accent" />,
      title: 'LLM Fine-Tuning & Prompting',
      description: 'We customize open-weight models (Llama, Mistral) for specific domain vocabularies, reducing API costs and latency while keeping your corporate data completely private.',
    },
    {
      icon: <Cpu className="h-6 w-6 text-indigo-400" />,
      title: 'Vector Embedding Systems',
      description: 'We set up semantic search engines that understand user intent rather than simple keywords, improving database search relevancy by up to 80%.',
    },
  ];

  return (
    <section id="ai-expertise" className="py-20 md:py-28 px-6 bg-background relative overflow-hidden">
      {/* Background blobs simulating intelligence glow */}
      <div className="absolute top-1/3 right-10 w-[600px] h-[300px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="AI Capabilities"
          title="Cognitive AI & Enterprise Automations"
          description="We do not just wrap basic API endpoints. We build production-ready vector databases, autonomous workflows, and custom-tuned language models that optimize business margins."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              whileHover={{ scale: 1.01 }}
              className="p-8 bg-card border border-border/40 hover:border-secondary/30 rounded-[20px] shadow-sm hover:shadow-[0_20px_50px_-20px_rgba(91,95,239,0.06)] transition-all duration-300 flex flex-col gap-4 text-left group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-border/40 shrink-0 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                {cap.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold tracking-tight text-foreground">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
