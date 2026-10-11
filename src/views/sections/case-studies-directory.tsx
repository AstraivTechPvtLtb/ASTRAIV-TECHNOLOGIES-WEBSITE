'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Filter,
  X,
  Layers,
  Building2,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import type { PublicPortfolioProject } from '@/lib/portfolio-data';

import { ResilientImage } from '@/views/ui/resilient-image';

interface CaseStudiesDirectoryProps {
  initialProjects: PublicPortfolioProject[];
}

export function CaseStudiesDirectory({ initialProjects }: CaseStudiesDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');

  // Distinct industries from dataset
  const industries = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.industryName) set.add(p.industryName);
    });
    return ['All', ...Array.from(set)];
  }, [initialProjects]);

  // Distinct project types
  const projectTypes: { label: string; value: string; count?: number }[] = [
    { label: 'All Projects', value: 'All' },
    { label: 'Client Projects', value: 'Client Project' },
    { label: 'Internal Platforms', value: 'Internal Project' },
    { label: 'Concept Projects', value: 'Concept Project' },
    { label: 'Reference Architectures', value: 'Reference Architecture' },
  ];

  // Filtering logic
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // 1. Project Type filter
      if (selectedProjectType !== 'All' && project.projectType !== selectedProjectType) {
        return false;
      }

      // 2. Industry filter
      if (selectedIndustry !== 'All' && project.industryName !== selectedIndustry) {
        return false;
      }

      // 3. Service filter
      if (selectedService !== 'All') {
        const hasService = project.relatedServiceSlugs?.some((s) =>
          s.toLowerCase().includes(selectedService.toLowerCase())
        );
        if (!hasService) return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesClient = project.client.toLowerCase().includes(query);
        const matchesSummary = project.summary.toLowerCase().includes(query);
        const matchesChallenge = project.challenge.toLowerCase().includes(query);
        const matchesTech = project.technologies.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = project.category.toLowerCase().includes(query);

        if (!matchesTitle && !matchesClient && !matchesSummary && !matchesChallenge && !matchesTech && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [initialProjects, selectedProjectType, selectedIndustry, selectedService, searchQuery]);

  const hasActiveFilters =
    selectedProjectType !== 'All' || selectedIndustry !== 'All' || selectedService !== 'All' || searchQuery !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProjectType('All');
    setSelectedIndustry('All');
    setSelectedService('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Search & Multi-Dimensional Filters Bar */}
      <div className="bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 mb-12 shadow-card">
        {/* Top search input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search case studies by keyword, technology (Next.js, Python, PostgreSQL), or domain..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-background dark:bg-slate-950/70 border border-slate-200/80 dark:border-white/10 text-foreground text-sm font-light dark:font-normal focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="space-y-4">
          {/* 1. Project Type Filter (Credibility Standard) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              <span>Project Type:</span>
            </span>
            {projectTypes.map((type) => {
              const isActive = selectedProjectType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedProjectType(type.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'filter-btn-active font-medium scale-[1.02]'
                      : 'filter-btn-gradient text-muted-foreground hover:text-foreground shadow-xs'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* 2. Industry Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
            <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Industry:</span>
            </span>
            {industries.map((ind) => {
              const isActive = selectedIndustry === ind;
              return (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'filter-btn-active font-medium scale-[1.02]'
                      : 'filter-btn-gradient text-muted-foreground hover:text-foreground shadow-xs'
                  }`}
                >
                  {ind}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="ml-auto text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Results Status */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <p className="text-xs sm:text-sm font-light dark:font-normal text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filteredProjects.length}</span> of {initialProjects.length} case studies & blueprints
        </p>

        <div className="flex items-center gap-2 text-xs font-mono font-medium text-primary dark:text-cyan-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Strictly Classified & Verified</span>
        </div>
      </div>

      {/* Case Studies Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-card/90 dark:bg-slate-900/85 border border-slate-200/80 dark:border-white/10 shadow-card">
          <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Case Studies Found</h3>
          <p className="text-xs sm:text-sm text-muted-foreground font-light dark:font-normal max-w-md mx-auto mb-6">
            We couldn&apos;t find any case studies matching your filter criteria. Try clearing some filters or searching for different technologies.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {filteredProjects.map((project) => {
            const projectTypeColor =
              project.projectType === 'Client Project'
                ? 'bg-blue-500/10 text-primary dark:text-cyan-300 border-blue-500/30'
                : project.projectType === 'Internal Project'
                ? 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30'
                : 'bg-cyan-500/10 text-blue-600 dark:text-cyan-400 border-cyan-500/30';

            return (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="group relative bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-primary/40 dark:hover:border-blue-400/40 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between text-left"
              >
                {/* Card Hero Visual */}
                <div className="relative w-full h-55 sm:h-65 bg-slate-950 overflow-hidden border-b border-slate-200/50 dark:border-white/5">
                  <ResilientImage
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider skill-badge-gradient text-foreground shadow-xs">
                      {project.projectType}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-foreground skill-badge-gradient px-2.5 py-1 rounded-full shadow-xs">
                      {project.industryName || project.category}
                    </span>
                  </div>

                  {/* Bottom Metric Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 text-white">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-medium tracking-wider text-slate-400 block">
                        {project.metricLabel}
                      </span>
                      <span className="text-xl sm:text-2xl font-mono font-medium tracking-tight text-white">
                        {project.metric}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium text-foreground skill-badge-gradient px-2.5 py-1 rounded-full shadow-xs">
                      {project.client}
                    </span>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-6 sm:p-7 grow flex flex-col justify-between gap-5">
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 font-light dark:font-normal">
                      {project.summary}
                    </p>

                    {/* Challenge snippet */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/60 dark:border-white/5 mb-4">
                      <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                        Core Challenge
                      </span>
                      <p className="text-xs text-muted-foreground line-clamp-2 font-light dark:font-normal">
                        {project.challenge}
                      </p>
                    </div>

                    {/* Technologies Deployed */}
                    <div>
                      <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground block mb-2">
                        Technologies Deployed
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 text-xs font-mono font-normal rounded-full skill-badge-gradient text-foreground shadow-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-primary dark:text-cyan-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
                      <span>{project.credibilityBadge}</span>
                    </span>

                    <Link
                      href={ROUTES.PUBLIC.CASE_STUDY_DETAIL(project.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Final Conversion CTA */}
      <div className="p-8 sm:p-12 rounded-2xl bg-linear-to-br from-primary via-primary/95 to-blue-900 text-white text-center flex flex-col items-center justify-center gap-4 shadow-xl shadow-primary/15">
        <span className="text-xs font-mono font-medium uppercase tracking-widest bg-white/15 px-3.5 py-1 rounded-full text-white">
          Architectural Consultation
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight font-heading">
          Need Something Similar?
        </h2>
        <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed font-light">
          Our principal software architects partner directly with enterprise leaders to eliminate operational latency, automate workflows, and deploy resilient digital infrastructure.
        </p>
        <Link
          href={ROUTES.PUBLIC.START_PROJECT}
          className="mt-2 inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-sm bg-white text-slate-950 hover:bg-slate-100 transition-transform hover:scale-105 shadow-md"
        >
          <span>Start a Project</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
