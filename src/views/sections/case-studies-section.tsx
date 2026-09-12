'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { ArrowRight, CheckCircle2, Cpu, Zap, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function CaseStudiesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'SaaS & Analytics',
    'Logistics & AI',
    'FinTech & Ledger',
  ];

  const projects = [
    {
      id: 'pulsefit',
      title: 'PulseFit Multi-Tenant Fitness Analytics Platform',
      category: 'SaaS & Analytics',
      categoryType: ['All', 'SaaS & Analytics'],
      client: 'PulseFit Global',
      imageSrc: '/images/portfolio/portfolio-pulsefit.jpg',
      challenge: 'High database latency and slow dashboard rendering times across multi-tenant fitness centers were causing user churn.',
      solution: 'Engineered a next-generation multi-tenant analytics dashboard in Next.js 16 with Prisma ORM, edge caching, and automated real-time database sync.',
      technologies: ['Next.js 16', 'Prisma ORM', 'PostgreSQL', 'Tailwind CSS', 'Cloudflare R2'],
      metric: '65% Faster Page Loads',
      metricLabel: 'Performance Increase',
      badgeIcon: <Zap className="h-3.5 w-3.5 text-blue-400" />,
    },
    {
      id: 'aerosync',
      title: 'AeroSync Real-Time Logistics & Parcel Coordination',
      category: 'Logistics & AI',
      categoryType: ['All', 'Logistics & AI'],
      client: 'AeroSync Logistics Inc.',
      imageSrc: '/images/portfolio/portfolio-aerosync.jpg',
      challenge: 'Excessive route overhead, delayed dispatch updates, and manual parcel sorting across high-volume regional distribution fleets.',
      solution: 'Developed custom scheduling software coordinating parcel distribution in real-time leveraging WebSockets for instant tracking updates and AI-optimized routes.',
      technologies: ['WebSockets', 'AI Route Engine', 'TypeScript', 'AWS Cloud', 'Docker'],
      metric: '-22% Route Fuel Overhead',
      metricLabel: 'Fleet Optimization',
      badgeIcon: <Cpu className="h-3.5 w-3.5 text-purple-400" />,
    },
    {
      id: 'financeflow',
      title: 'FinanceFlow AI-Driven Budget & Ledger Engine',
      category: 'FinTech & Ledger',
      categoryType: ['All', 'FinTech & Ledger'],
      client: 'FinanceFlow Capital',
      imageSrc: '/images/portfolio/portfolio-financeflow.jpg',
      challenge: 'Manual financial reconciliation bottlenecks and complex bank ledger integration compliance requiring strict data isolation.',
      solution: 'Engineered an AI-driven budget analyzer integrating LLMs with bank ledger APIs, featuring secure credential vaulting and automated reconciliation loops.',
      technologies: ['LLM Agents', 'Bank Ledger APIs', 'pgvector', 'TypeScript', 'SOC-2 Vault'],
      metric: '100% PCI-DSS Compliant',
      metricLabel: 'Security Standard',
      badgeIcon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />,
    },
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.categoryType.includes(selectedCategory));

  return (
    <section id="case-studies" className="py-20 md:py-28 px-6 bg-transparent relative overflow-hidden scroll-mt-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-primary/5 dark:bg-blue-600/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Featured Work"
          title="Built to Solve Real Problems"
          description="A selection of high-performance software engineered by AstraIV Technologies for industry category leaders."
        />

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-10 max-w-3xl mx-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 select-none cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-105'
                    : 'bg-card/90 dark:bg-slate-900/70 border border-border/70 dark:border-slate-800/80 text-muted-foreground hover:text-foreground hover:border-primary/40 dark:hover:border-blue-400/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Large Visual Case Study Cards */}
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-12 max-w-6xl mx-auto">
          {filteredProjects.map((project, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="group relative bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 hover:border-primary/40 dark:hover:border-blue-400/40 rounded-[24px] sm:rounded-[28px] shadow-xs hover:shadow-[0_20px_50px_-15px_rgba(11,61,145,0.12)] dark:hover:shadow-[0_20px_50px_-15px_rgba(37, 99, 235,0.12)] overflow-hidden transition-all duration-500 transform-gpu hover:-translate-y-1"
              >
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 p-6 sm:p-8 md:p-10 items-center">
                  {/* Left Column: Visual Image Showcase */}
                  <div className={`lg:col-span-6 relative w-full h-[240px] sm:h-[300px] md:h-[340px] rounded-2xl overflow-hidden shadow-inner group/preview border border-border/50 dark:border-slate-800/80 bg-slate-950 ${
                    isReversed ? 'lg:order-2' : ''
                  }`}>
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                    {/* Category overlay badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold tracking-wider bg-slate-950/80 backdrop-blur-md border border-blue-400/30 text-blue-300 rounded-full uppercase">
                        {project.badgeIcon}
                        <span>{project.category}</span>
                      </span>
                    </div>

                    {/* Metric pill */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-300 block">
                          {project.metricLabel}
                        </span>
                        <span className="text-base sm:text-lg font-black tracking-tight text-white font-mono">
                          {project.metric}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-300 bg-slate-900/70 px-2.5 py-1 rounded-md border border-slate-700">
                        {project.client}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Case Study Architecture Details */}
                  <div className={`lg:col-span-6 flex flex-col justify-between text-left space-y-5 ${
                    isReversed ? 'lg:order-1' : ''
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 border border-primary/20 dark:border-blue-400/20">
                          Production Case Study
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    {/* Problem vs Solution Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-border/60 dark:border-slate-700/60 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Challenge
                        </span>
                        <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium">
                          {project.challenge}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-border/60 dark:border-slate-700/60 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-blue-400">
                          Engineered Solution
                        </span>
                        <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium">
                          {project.solution}
                        </p>
                      </div>
                    </div>

                    {/* Technologies Deployed */}
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-2">
                        Technologies Deployed
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 border border-border/60 dark:border-slate-700 text-foreground/90 dark:text-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Link */}
                    <div className="pt-2 flex items-center justify-between border-t border-border/40 dark:border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Production verified</span>
                      </div>

                      <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors"
                      >
                        <span>View Project Architecture</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
