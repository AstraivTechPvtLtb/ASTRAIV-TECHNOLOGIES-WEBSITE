'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  Globe2, 
  Server, 
  Smartphone, 
  Bot, 
  Cloud, 
  Database, 
  GitBranch, 
  Network 
} from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  role: string;
  description: string;
  badge: string;
}

export function TechSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { label: 'All', icon: null },
    { label: 'Frontend', icon: <Globe2 className="h-3.5 w-3.5" /> },
    { label: 'Backend', icon: <Server className="h-3.5 w-3.5" /> },
    { label: 'Mobile', icon: <Smartphone className="h-3.5 w-3.5" /> },
    { label: 'AI & ML', icon: <Bot className="h-3.5 w-3.5" /> },
    { label: 'Cloud', icon: <Cloud className="h-3.5 w-3.5" /> },
    { label: 'Database', icon: <Database className="h-3.5 w-3.5" /> },
    { label: 'DevOps', icon: <GitBranch className="h-3.5 w-3.5" /> },
    { label: 'Integration', icon: <Network className="h-3.5 w-3.5" /> },
  ];

  const technologies: TechItem[] = [
    {
      name: 'Next.js 16 & React 19',
      category: 'Frontend',
      role: 'Server Components & Edge Caching',
      description: 'Used for zero-bundle client footprint, ultra-low TTFB, Server Actions, and incremental static generation.',
      badge: 'React 19',
    },
    {
      name: 'TypeScript',
      category: 'Frontend',
      role: 'Strict Typesafety & Contracts',
      description: 'Guarantees absolute compile-time validation, preventing runtime production bugs across fullstack surfaces.',
      badge: 'Typesafe',
    },
    {
      name: 'Node.js & Python',
      category: 'Backend',
      role: 'High-Concurrency Runtime',
      description: 'Asynchronous event-driven microservices, Python FastAPI for machine learning inference, and async workers.',
      badge: 'FastAPI',
    },
    {
      name: 'Tailwind CSS v4',
      category: 'Frontend',
      role: 'Utility Styling & HSL Tokens',
      description: 'High-speed CSS engine with GPU-accelerated micro-animations, design tokens, and zero runtime overhead.',
      badge: 'CSS v4',
    },
    {
      name: 'React Native & Flutter',
      category: 'Mobile',
      role: 'Cross-Platform Native Apps',
      description: 'Smooth 60fps mobile execution, shared business logic, hardware-level camera/biometrics, and offline caching.',
      badge: 'iOS / Android',
    },
    {
      name: 'PyTorch & pgvector',
      category: 'AI & ML',
      role: 'Neural Embeddings & RAG',
      description: 'High-dimensional semantic vector indexing, cosine similarity querying, and proprietary domain RAG systems.',
      badge: 'AI Core',
    },
    {
      name: 'AWS & Cloudflare R2',
      category: 'Cloud',
      role: 'Global Edge Network & Storage',
      description: 'Multi-region AWS ECS and Cloudflare global CDN providing sub-15ms edge asset delivery and DDoS protection.',
      badge: 'Global CDN',
    },
    {
      name: 'PostgreSQL & Prisma ORM',
      category: 'Database',
      role: 'Relational ACID Data Layer',
      description: 'Strict schema migrations, automated connection pooling, encrypted columns, and zero-downtime backups.',
      badge: 'ACID Compliant',
    },
    {
      name: 'Docker & Kubernetes',
      category: 'DevOps',
      role: 'Container Orchestration',
      description: 'Self-healing cluster pods, zero-downtime rolling updates, automated Horizontal Pod Autoscaling (HPA).',
      badge: 'CI/CD Auto',
    },
    {
      name: 'REST, gRPC & WebSockets',
      category: 'Integration',
      role: 'Real-Time Telemetry & Buses',
      description: 'Bidirectional binary streaming for telemetry, distributed event queues (Kafka/RabbitMQ), and low-latency APIs.',
      badge: 'Real-Time',
    },
  ];

  const filteredTechs = activeCategory === 'All'
    ? technologies
    : technologies.filter(t => t.category === activeCategory);

  return (
    <section id="technologies" className="py-20 md:py-28 px-6 bg-transparent border-b border-border/30 dark:border-slate-800/60 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Technology Stack"
          title="Powered by Modern Technology"
          description="We engineer exclusively with battle-tested frameworks, cloud infrastructure, and modern databases for unrivaled speed, security, and uptime."
        />

        {/* Category Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-105'
                    : 'bg-card/90 dark:bg-slate-900/70 border border-border/70 dark:border-slate-800/80 text-muted-foreground hover:text-foreground hover:border-primary/40 dark:hover:border-blue-400/40'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Technology Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mt-12 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredTechs.map((tech) => (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                className="group relative p-6 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-[20px] shadow-xs hover:shadow-[0_16px_36px_-10px_rgba(11,61,145,0.1)] dark:hover:shadow-[0_16px_36px_-10px_rgba(37, 99, 235,0.1)] hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 border border-primary/20 dark:border-blue-400/20">
                      {tech.category}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-muted-foreground/80 dark:text-slate-400">
                      {tech.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                    {tech.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-secondary dark:text-indigo-400 block mt-0.5">
                    {tech.role}
                  </span>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-3 font-medium">
                    {tech.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-muted-foreground/80">
                  <span>Architecture Certified</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80 group-hover:animate-ping" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
