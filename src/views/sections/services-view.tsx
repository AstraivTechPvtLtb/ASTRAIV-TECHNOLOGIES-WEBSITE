'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { DEFAULT_SERVICES, type PublicServiceItem } from '@/lib/services-data';
import { CANONICAL_PROCESS_STAGES } from '@/lib/process-data';
import { ROUTES } from '@/routes';
import {
  Bot,
  Terminal,
  Cpu,
  Cloud,
  Globe,
  Smartphone,
  Layers,
  GitBranch,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Search,
  Lock,
  Workflow,
  Check,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               DATA DEFINITION                              */
/* -------------------------------------------------------------------------- */

interface CoreServiceItem {
  id: string;
  category: 'ai-software' | 'web-mobile' | 'cloud-devops' | 'design-advisory';
  categoryLabel: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  deliverables: string[];
  techStack: string[];
  slaHighlight: string;
}

function mapCategoryToTab(
  cat?: string,
  slug?: string
): 'ai-software' | 'web-mobile' | 'cloud-devops' | 'design-advisory' {
  const c = (cat || '').toLowerCase().trim();
  const s = (slug || '').toLowerCase().trim();

  if (
    c === 'ai-software' ||
    c === 'web-mobile' ||
    c === 'cloud-devops' ||
    c === 'design-advisory'
  ) {
    return c;
  }
  if (
    c.includes('ai') ||
    c.includes('artificial') ||
    c.includes('machine') ||
    c.includes('intelligence') ||
    c.includes('core') ||
    s.includes('ai-') ||
    s.includes('custom-software')
  ) {
    return 'ai-software';
  }
  if (
    c.includes('web') ||
    c.includes('mobile') ||
    c.includes('app') ||
    s.includes('web') ||
    s.includes('mobile')
  ) {
    return 'web-mobile';
  }
  if (
    c.includes('cloud') ||
    c.includes('devops') ||
    c.includes('infrastructure') ||
    c.includes('ci/cd') ||
    s.includes('cloud') ||
    s.includes('devops')
  ) {
    return 'cloud-devops';
  }
  return 'design-advisory';
}

function getDynamicIcon(iconName?: string): { icon: React.ReactNode; iconBg: string } {
  const norm = (iconName || '').toLowerCase().trim();
  switch (norm) {
    case 'bot':
      return {
        icon: <Bot className="h-6 w-6 text-blue-600" />,
        iconBg: 'from-blue-600/15 to-blue-500/10 border-blue-600/30 text-blue-600',
      };
    case 'terminal':
      return {
        icon: <Terminal className="h-6 w-6 text-indigo-500" />,
        iconBg: 'from-indigo-500/15 to-purple-500/10 border-indigo-500/30 text-indigo-500',
      };
    case 'cpu':
      return {
        icon: <Cpu className="h-6 w-6 text-purple-500" />,
        iconBg: 'from-purple-500/15 to-pink-500/10 border-purple-500/30 text-purple-500',
      };
    case 'cloud':
      return {
        icon: <Cloud className="h-6 w-6 text-sky-500" />,
        iconBg: 'from-sky-500/15 to-blue-500/10 border-sky-500/30 text-sky-500',
      };
    case 'globe':
      return {
        icon: <Globe className="h-6 w-6 text-teal-500" />,
        iconBg: 'from-teal-500/15 to-emerald-500/10 border-teal-500/30 text-teal-500',
      };
    case 'smartphone':
    case 'mobile':
      return {
        icon: <Smartphone className="h-6 w-6 text-emerald-500" />,
        iconBg: 'from-emerald-500/15 to-teal-500/10 border-emerald-500/30 text-emerald-500',
      };
    case 'layers':
      return {
        icon: <Layers className="h-6 w-6 text-pink-500" />,
        iconBg: 'from-pink-500/15 to-rose-500/10 border-pink-500/30 text-pink-500',
      };
    case 'gitbranch':
    case 'git-branch':
      return {
        icon: <GitBranch className="h-6 w-6 text-amber-500" />,
        iconBg: 'from-amber-500/15 to-orange-500/10 border-amber-500/30 text-amber-500',
      };
    case 'helpcircle':
    case 'help-circle':
      return {
        icon: <HelpCircle className="h-6 w-6 text-rose-500" />,
        iconBg: 'from-rose-500/15 to-pink-500/10 border-rose-500/30 text-rose-500',
      };
    default:
      return {
        icon: <Cpu className="h-6 w-6 text-blue-500" />,
        iconBg: 'from-blue-500/15 to-indigo-500/10 border-blue-500/30 text-blue-500',
      };
  }
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Services' },
  { id: 'ai-software', label: 'AI & Core Software' },
  { id: 'web-mobile', label: 'Web & Mobile' },
  { id: 'cloud-devops', label: 'Cloud & DevOps' },
  { id: 'design-advisory', label: 'Design & Advisory' },
] as const;

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export interface ServicesViewProps {
  activeServices?: PublicServiceItem[];
}

export function ServicesView({ activeServices }: ServicesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically map activeServices or canonical DEFAULT_SERVICES, preserving rich styling
  const availableCards = useMemo<CoreServiceItem[]>(() => {
    const sourceServices = activeServices && activeServices.length > 0 ? activeServices : DEFAULT_SERVICES;
    const seen = new Set<string>();
    const unique = sourceServices.filter((s) => {
      if (seen.has(s.slug)) return false;
      seen.add(s.slug);
      return true;
    });

    return unique.map((service) => {
      const dynamicIcon = getDynamicIcon(service.icon || service.slug);
      const category = mapCategoryToTab(service.category, service.slug);

      return {
        id: service.slug,
        category,
        categoryLabel: service.badge || service.category || 'Engineering',
        title: service.title,
        description: service.shortDesc || service.fullDesc,
        icon: dynamicIcon.icon,
        iconBg: dynamicIcon.iconBg,
        deliverables:
          service.deliverables && service.deliverables.length > 0
            ? service.deliverables
            : service.features && service.features.length > 0
            ? service.features.slice(0, 3)
            : [
                'Enterprise-grade architecture',
                'Production-ready implementation',
                'Full automated test suite',
              ],
        techStack:
          service.techStack && service.techStack.length > 0
            ? service.techStack
            : [service.category || 'Engineering', 'Next.js', 'TypeScript', 'PostgreSQL', 'Cloud Edge'],
        slaHighlight: service.slaHighlight || (service.badge ? `${service.badge} Standard` : 'Production Ready SLA'),
      };
    });
  }, [activeServices]);

  // Filter services by category and search keyword
  const filteredServices = useMemo(() => {
    return availableCards.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [availableCards, selectedCategory, searchQuery]);


  return (
    <div className="flex flex-col w-full selection:bg-primary/20">
      {/* ==================================================================== */}
      {/* 1. THE 12 CORE SERVICES CATALOG                                      */}
      {/* ==================================================================== */}
      <section id="services-catalog" className="pt-28 pb-20 md:pt-36 md:pb-24 px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2 max-w-2xl text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary dark:text-blue-400">
              SERVICES = WHAT ASTRAIV DOES
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Our Engineering Services
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
              Explore our 8 specialized technical disciplines engineered for enterprise velocity.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-card dark:bg-slate-900 border border-border/70 dark:border-slate-800 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-xs mb-10 w-fit">
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.id;
            const tabLabel = tab.id === 'all' ? `All Services (${availableCards.length})` : tab.label;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none',
                  active
                    ? 'bg-primary text-white shadow-sm dark:bg-blue-600 dark:text-white font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                )}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>

        <h2 className="sr-only">Engineering Disciplines Catalog</h2>

        {/* The 12 Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-base text-muted-foreground font-semibold">
              No services found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-primary dark:text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="h-full flex flex-col scroll-mt-28 relative"
              >
                {service.id === 'ai-development' && <span id="ai-intelligent-systems" className="absolute -top-28 pointer-events-none" />}
                {service.id === 'ai-solutions' && <span id="ai-intelligent-systems" className="absolute -top-28 pointer-events-none" />}
                {(service.id === 'web-development' || service.id === 'web-applications') && (
                  <>
                    <span id="web-applications" className="absolute -top-28 pointer-events-none" />
                    <span id="web-development" className="absolute -top-28 pointer-events-none" />
                    <span id="saas-development" className="absolute -top-28 pointer-events-none" />
                    <span id="website-development" className="absolute -top-28 pointer-events-none" />
                  </>
                )}
                {service.id === 'custom-software' && <span id="enterprise-software" className="absolute -top-28 pointer-events-none" />}
                {service.id === 'cloud-infrastructure' && <span id="cloud-solutions" className="absolute -top-28 pointer-events-none" />}
                {service.id === 'cloud-engineering' && <span id="cloud-infrastructure" className="absolute -top-28 pointer-events-none" />}
                {service.id === 'ui-ux-design' && <span id="uiux-design" className="absolute -top-28 pointer-events-none" />}
                {service.id === 'mobile-apps' && <span id="mobile-development" className="absolute -top-28 pointer-events-none" />}
                {service.id === 'mobile-development' && <span id="mobile-apps" className="absolute -top-28 pointer-events-none" />}
                <div className="group relative overflow-hidden bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/70 dark:border-slate-800/90 hover:border-primary/50 dark:hover:border-blue-600/50 rounded-[22px] shadow-xs hover:shadow-xl transition-all duration-300 select-none h-full flex flex-col justify-between p-6 text-left">
                  {/* Decorative background glow */}
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 dark:bg-blue-600/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                  <div>
                    {/* Header: Icon & Category Label */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br border transition-transform duration-300 group-hover:scale-110',
                          service.iconBg
                        )}
                      >
                        {service.icon}
                      </div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/60">
                        {service.categoryLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                      {service.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="flex flex-col gap-1.5 mb-5 pt-3 border-t border-border/50 dark:border-slate-800/80">
                      {service.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1 mb-4 pt-3 border-t border-border/50 dark:border-slate-800/80">
                      {service.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Footer Action */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {service.slaHighlight}
                      </span>
                      <Link
                        href={`/services/${service.id}`}
                        className="inline-flex items-center text-xs font-black text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors group/link"
                      >
                        <span>Explore Service</span>
                        <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 3. CANONICAL 6-STAGE SERVICE DELIVERY LIFECYCLE                      */}
      {/* ==================================================================== */}
      <section className="py-20 md:py-28 px-6 bg-slate-50/80 dark:bg-slate-950/60 border-y border-border/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              Our 6-Stage Engineering Delivery Process
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              From architectural blueprinting to continuous production scaling, our engineering squads follow a deterministic, gated 6-stage roadmap.
            </p>
          </div>

          {/* 6-Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_PROCESS_STAGES.map((phase) => (
              <div
                key={phase.num}
                className="p-7 bg-card dark:bg-slate-900/90 border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-lg transition-all flex flex-col justify-between text-left group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 dark:bg-blue-600/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 rounded-full border border-primary/20">
                      Stage {phase.num} • {phase.tag}
                    </span>
                    <span className="text-2xl font-black font-heading text-slate-300 dark:text-slate-700">
                      {phase.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                    {phase.detailedDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-primary dark:text-blue-400">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>{phase.keyDeliverables[0]}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">
                    Phase {phase.stageNumber}/6
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={ROUTES.PUBLIC.COMPANY_ANCHORS.PROCESS}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-foreground hover:text-primary dark:hover:text-blue-400 bg-card/80 hover:bg-card border border-border/60 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all shadow-xs hover:shadow-md group"
            >
              <span>Explore Complete 6-Stage Process, Deliverables &amp; Quality Gates</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. ENGINEERING STANDARDS & SLA BENCHMARKS                            */}
      {/* ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-card dark:bg-slate-900/90 border border-border/80 dark:border-slate-800/80 shadow-md">
          <div className="max-w-3xl mb-12 text-left">
            <span className="inline-flex px-3 py-1 text-xs font-black tracking-wider uppercase text-primary bg-primary/10 dark:bg-blue-600/20 dark:text-blue-300 rounded-md border border-primary/20 dark:border-blue-600/30 mb-3">
              CONTRACTUAL GUARANTEES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Engineering Built on Trust and Rigor
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-2">
              Every project contracted with Astraiv Technologies adheres to ironclad technical standards designed to safeguard your capital and brand reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-bold text-sm">
                <Lock className="h-4 w-4" />
                <span>100% IP Handover</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                All source code, schemas, documentation, and infrastructure keys are transferred directly to your organization.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <Code2 className="h-4 w-4" />
                <span>Type-Safe Delivery</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                End-to-end type safety eliminates runtime failures and provides automated self-documenting API structures.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Workflow className="h-4 w-4" />
                <span>Zero Vendor Lock-In</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Built strictly on industry-standard open-source ecosystems (Next.js, Node, Go, Docker) with no proprietary traps.
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>SOC2 & HIPAA Compliant</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Architectures pre-configured with granular RBAC, encryption at rest and in transit, and immutable audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. CONSULTATION & PROJECT SCOPING CTA                                */}
      {/* ==================================================================== */}
      <section className="py-20 md:py-28 px-6 max-w-5xl mx-auto w-full text-center">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 dark:border-blue-600/30 bg-gradient-to-br from-primary/10 via-card to-blue-600/10 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-10 sm:p-16 shadow-xl">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
              Ready to Accelerate Your Software Engineering?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Schedule a direct consultation with our senior systems architects to discuss project requirements, timelines, and technical architecture.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/services')}` : `/start-project?source_page=${encodeURIComponent('/services')}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95 group"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact#schedule"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Talk to an Expert</span>
              </Link>
              <Link
                href={ROUTES.PUBLIC.CASE_STUDIES}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore Case Studies &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
