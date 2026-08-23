'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './section-header';
import { ArrowRight, CheckCircle2, Cpu, ExternalLink, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function CaseStudiesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Web Application',
    'SaaS & HealthTech',
    'Logistics AI',
    'FinTech & AI',
    'Backend System',
  ];

  const projects = [
    {
      id: 'pulsefit',
      title: 'PulseFit Multi-Tenant Fitness Analytics Platform',
      category: 'SaaS & HealthTech',
      categoryType: ['All', 'Web Application', 'SaaS & HealthTech'],
      client: 'PulseFit Global',
      challenge: 'High latency in database synchronization and slow dashboard rendering times were causing user drop-offs across multi-tenant fitness centers.',
      solution: 'Engineered a next-generation multi-tenant analytics dashboard built on Next.js 16 and Prisma, with edge caching and automated real-time database sync pipelines.',
      description: 'A multi-tenant fitness analytics dashboard built with Next.js 16 and Prisma. We automated database synchronization and reduced page load times by 65%.',
      technologies: ['Next.js 16', 'Prisma ORM', 'PostgreSQL', 'Tailwind CSS', 'Cloudflare R2'],
      metric: '65% faster page loads',
      metricLabel: 'Performance Increase',
      color: 'from-blue-600 via-indigo-600 to-cyan-500',
      glowColor: 'rgba(59, 130, 246, 0.15)',
      badgeIcon: <Zap className="h-3.5 w-3.5 text-blue-500" />,
    },
    {
      id: 'aerosync',
      title: 'AeroSync Real-Time Logistics & Parcel Coordination',
      category: 'Logistics AI & Cloud Infrastructure',
      categoryType: ['All', 'Logistics AI', 'Backend System'],
      client: 'AeroSync Logistics Inc.',
      challenge: 'Excessive route overhead, delayed dispatch updates, and manual parcel sorting across high-volume distribution fleets.',
      solution: 'Developed custom scheduling software coordinating parcel distribution in real-time leveraging WebSockets for instant tracking updates and AI-optimized routes.',
      description: 'Custom scheduling software that coordinates parcel distribution in real-time. Leverages WebSockets for instant tracking updates and optimized routes.',
      technologies: ['WebSockets', 'AI Route Engine', 'TypeScript', 'AWS Cloud', 'Docker'],
      metric: '-18% route fuel overhead',
      metricLabel: 'Fleet Optimization',
      color: 'from-purple-600 via-pink-600 to-indigo-600',
      glowColor: 'rgba(168, 85, 247, 0.15)',
      badgeIcon: <Cpu className="h-3.5 w-3.5 text-purple-500" />,
    },
    {
      id: 'financeflow',
      title: 'FinanceFlow AI-Driven Budget & Ledger Engine',
      category: 'FinTech & Cognitive AI Agents',
      categoryType: ['All', 'FinTech & AI', 'Backend System'],
      client: 'FinanceFlow Capital',
      challenge: 'Manual financial reconciliation bottlenecks and complex bank ledger integration compliance requiring strict data isolation.',
      solution: 'An AI-driven budget analyzer integrating LLMs with bank ledger APIs, featuring secure credentials management and automated reconciliation loops.',
      description: 'An AI-driven budget analyzer integrating LLMs with bank ledger APIs. Includes secure credentials management and automated reconciliation loops.',
      technologies: ['LLM Agents', 'Bank Ledger APIs', 'pgvector', 'TypeScript', 'SOC-2 Vault'],
      metric: 'SOC-2 compliant storage',
      metricLabel: 'Security Standard',
      color: 'from-cyan-600 via-blue-600 to-emerald-500',
      glowColor: 'rgba(6, 182, 212, 0.15)',
      badgeIcon: <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />,
    },
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.categoryType.includes(selectedCategory));

  return (
    <section id="case-studies" className="py-20 md:py-28 px-6 bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Portfolio"
          title="Premium Case Studies"
          description="A selection of high-performance software engineered for industry category leaders."
        />

        {/* Category filter tabs matching design review mockup */}
        <div className="flex flex-wrap justify-center items-center gap-2.5 mt-10 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 select-none cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                    : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Distinct separated case study visual sections */}
        <div className="mt-14 md:mt-20 space-y-12 md:space-y-16 max-w-6xl mx-auto">
          {filteredProjects.map((project, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
                className="group relative bg-card border border-border/60 hover:border-primary/30 rounded-[28px] shadow-sm hover:shadow-[0_25px_60px_-15px_rgba(11,61,145,0.08)] overflow-hidden transition-all duration-500"
              >
                {/* Subtle internal gradient accent */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at ${isReversed ? '80% 20%' : '20% 20%'}, ${project.glowColor}, transparent 60%)`,
                  }}
                />

                <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 p-6 sm:p-8 md:p-10 items-center ${
                  isReversed ? 'lg:grid-flow-dense' : ''
                }`}>
                  {/* Visual Preview / Metric Visual Hero Block */}
                  <div className={`lg:col-span-5 flex flex-col justify-between rounded-2xl overflow-hidden bg-gradient-to-br ${project.color} p-6 md:p-8 text-white min-h-[280px] sm:min-h-[340px] relative shadow-inner ${
                    isReversed ? 'lg:col-start-8' : ''
                  }`}>
                    {/* Abstract technical pattern overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000_100%)] opacity-35" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:16px_16px]" />

                    {/* Top tags */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-extrabold tracking-wider bg-black/30 backdrop-blur-md border border-white/20 text-white rounded-full uppercase">
                        {project.badgeIcon}
                        <span>{project.category}</span>
                      </span>
                      <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Center project identifier badge */}
                    <div className="relative z-10 my-auto py-6">
                      <span className="text-xs uppercase tracking-widest font-semibold text-white/75 block mb-1">
                        Client Partner
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading drop-shadow-sm">
                        {project.client}
                      </h4>
                    </div>

                    {/* Bottom prominent impact metric highlight */}
                    <div className="relative z-10 pt-4 border-t border-white/20 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">
                          {project.metricLabel}
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {project.metric}
                        </span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Case Study Content Block */}
                  <div className={`lg:col-span-7 flex flex-col justify-between text-left space-y-6 ${
                    isReversed ? 'lg:col-start-1' : ''
                  }`}>
                    {/* Header: Title and Category */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20">
                          Case Study
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>

                    {/* Problem vs Solution Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Challenge */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/40 flex flex-col gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Challenge
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                          {project.challenge}
                        </p>
                      </div>

                      {/* Solution */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/40 flex flex-col gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-accent">
                          Engineered Solution
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                          {project.solution}
                        </p>
                      </div>
                    </div>

                    {/* Technologies Used */}
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 block mb-2">
                        Technologies Deployed
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-card border border-border/60 text-foreground/80 shadow-2xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA / Action */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border/30">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Production verified architecture</span>
                      </div>

                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-xs font-extrabold text-primary hover:text-primary/80 dark:text-accent dark:hover:text-accent/80 transition-colors group/link"
                      >
                        <span>Request Architecture Brief</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
