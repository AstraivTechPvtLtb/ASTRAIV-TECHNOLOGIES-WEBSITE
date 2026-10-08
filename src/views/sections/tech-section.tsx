'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  Globe2, 
  Server, 
  Smartphone, 
  Bot, 
  Cloud, 
  Database, 
  GitBranch, 
  Network,
  ArrowRight
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { EASE_OUT_EXPO, MOTION_DURATIONS } from '@/lib/motion';

interface TechItem {
  name: string;
  category: string;
  role: string;
  description: string;
  badge: string;
}

export function TechSection() {
  const shouldReduceMotion = useReducedMotion();
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
          title="Powered by [Modern Technology]"
          description="We engineer exclusively with battle-tested frameworks, cloud infrastructure, and modern databases for unrivaled speed, security, and uptime."
        />

        {/* Category Selector Pills */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-2 sm:gap-2.5 mt-10 max-w-full lg:max-w-6xl mx-auto px-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 lg:px-3 xl:px-3.5 rounded-full text-xs font-bold tracking-normal sm:tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/20 ring-2 ring-primary/20'
                    : 'bg-card/90 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-foreground hover:border-primary/40 dark:hover:border-blue-400/40 active:scale-[0.98]'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Technology Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 mt-10 sm:mt-12 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredTechs.map((tech) => (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
                transition={{ duration: MOTION_DURATIONS.normal, ease: EASE_OUT_EXPO }}
                whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: MOTION_DURATIONS.fast, ease: EASE_OUT_EXPO } }}
                className="group relative p-6 bg-card/95 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-card hover:shadow-card-hover hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200 transform-gpu flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 border border-primary/20 dark:border-blue-400/20">
                      {tech.category}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                      {tech.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                    {tech.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-primary dark:text-blue-400 block mt-0.5">
                    {tech.role}
                  </span>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3 font-normal">
                    {tech.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-muted-foreground/80">
                  <span>Architecture Certified</span>
                  <span className="w-2 h-2 rounded-full bg-primary/80 dark:bg-cyan-400/80 group-hover:animate-ping" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Link to Dedicated Technology Architecture Page */}
        <div className="mt-14 text-center">
          <Link
            href={ROUTES.PUBLIC.TECHNOLOGY}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-card/85 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-border/70 dark:border-slate-700 hover:border-primary/40 dark:hover:border-blue-400 text-foreground font-bold text-sm transition-all shadow-xs hover:shadow-md hover:scale-105 active:scale-95 group"
          >
            <span>Explore Technology Architecture</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-primary dark:text-blue-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
