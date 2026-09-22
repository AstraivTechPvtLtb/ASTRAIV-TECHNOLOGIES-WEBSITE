'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { ArrowRight, CheckCircle2, Cpu, Zap, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { DEFAULT_PORTFOLIO_PROJECTS, type PublicPortfolioProject } from '@/lib/portfolio-data';
import { ROUTES } from '@/routes';

function ResilientSectionImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      onError={() => {
        setImgSrc('/images/portfolio/portfolio-pulsefit.jpg');
      }}
    />
  );
}

interface CaseStudiesSectionProps {
  initialProjects?: PublicPortfolioProject[];
  title?: string;
  badge?: string;
  description?: string;
  showAllCta?: boolean;
}

export function CaseStudiesSection({
  initialProjects = DEFAULT_PORTFOLIO_PROJECTS,
  title = 'Built to Solve Real Problems',
  badge = 'Featured Work',
  description = 'High-performance software engineered by Astraiv Technologies across client production environments, internal platforms, and hardened reference architectures.',
  showAllCta = true,
}: CaseStudiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'FinTech & Ledger',
    'SaaS & Analytics',
    'Logistics & AI',
  ];

  const verifiedProjects = initialProjects.filter(
    (p) => p.projectType === 'Client Project' && p.isRealClient
  );

  const filteredProjects = selectedCategory === 'All'
    ? (verifiedProjects.length >= 3 ? verifiedProjects.slice(0, 3) : initialProjects.slice(0, 3))
    : initialProjects.filter((p) => p.categoryType?.includes(selectedCategory)).slice(0, 3);

  return (
    <section id="case-studies" className="py-20 md:py-28 px-6 bg-transparent relative overflow-hidden scroll-mt-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-primary/5 dark:bg-blue-600/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge={badge}
          title={title}
          description={description}
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

            const badgeIconNode =
              project.badgeIcon === 'Zap' ? (
                <Zap className="h-3.5 w-3.5 text-blue-400" />
              ) : project.badgeIcon === 'Cpu' ? (
                <Cpu className="h-3.5 w-3.5 text-purple-400" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              );

            const projectTypeColor =
              project.projectType === 'Client Project'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : project.projectType === 'Internal Project'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                : project.projectType === 'Concept Project'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30';

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
                    <ResilientSectionImage
                      src={project.imageSrc}
                      alt={project.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

                    {/* Category overlay badge */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold tracking-wider bg-slate-950/80 backdrop-blur-md border border-blue-400/30 text-blue-300 rounded-full uppercase">
                        {badgeIconNode}
                        <span>{project.category}</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-[9.5px] font-bold tracking-wider rounded-full border backdrop-blur-md ${projectTypeColor}`}>
                        {project.projectType}
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
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${projectTypeColor}`}>
                          {project.projectType}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {project.industryName || project.category}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    {/* Challenge vs Solution vs Outcome */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-border/60 dark:border-slate-700/60 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Challenge
                        </span>
                        <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
                          {project.challenge}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-border/60 dark:border-slate-700/60 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-blue-400">
                          Solution
                        </span>
                        <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
                          {project.solution}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Outcome
                        </span>
                        <p className="text-xs text-muted-foreground dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
                          <strong className="text-foreground dark:text-white font-mono">{project.metric}</strong> {project.metricLabel}. {project.impactOutcomes?.[0] || 'Verified production impact.'}
                        </p>
                      </div>
                    </div>

                    {/* Technologies Deployed */}
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-2">
                        Technologies Deployed
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 5).map((tech, tIdx) => (
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
                        <span>{project.credibilityBadge}</span>
                      </div>

                      <Link
                        href={ROUTES.PUBLIC.CASE_STUDY_DETAIL(project.slug)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors"
                      >
                        <span>View Case Study</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Explore All Case Studies CTA */}
        {showAllCta && (
          <div className="mt-14 sm:mt-16 text-center">
            <Link
              href={ROUTES.PUBLIC.CASE_STUDIES}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all hover:scale-105"
            >
              <Layers className="h-4 w-4" />
              <span>Explore All Case Studies</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
