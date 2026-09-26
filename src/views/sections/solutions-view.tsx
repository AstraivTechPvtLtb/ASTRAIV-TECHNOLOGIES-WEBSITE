'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { cn } from '@/lib/utils';
import {
  Bot,
  Brain,
  LineChart,
  Cloud,
  Building2,
  Workflow,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  Server,
  ChevronRight,
} from 'lucide-react';

interface SolutionItem {
  id: string;
  category: 'intelligent-systems' | 'digital-products' | 'engineering-transformation';
  categoryLabel: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  metric: {
    value: string;
    label: string;
  };
  features: string[];
  technologies: string[];
}

const SOLUTIONS_DATA: SolutionItem[] = [
  // 1. INTELLIGENT SYSTEMS
  {
    id: 'ai-business-automation',
    category: 'intelligent-systems',
    categoryLabel: 'Intelligent Systems',
    title: 'AI & Business Automation',
    tagline: 'Autonomous decision pipelines & goal-driven multi-agent swarms.',
    description:
      'We engineer self-orchestrating agent workflows that plan, execute, and verify multi-step tasks across external APIs, customer channels, and enterprise data backbones without human bottlenecks.',
    icon: <Bot className="h-6 w-6 text-blue-600" />,
    iconBg: 'from-blue-600/20 to-blue-500/10 border-blue-600/30',
    metric: {
      value: '85%',
      label: 'Reduction in manual repetitive workflows',
    },
    features: [
      'Multi-agent swarm coordination and specialized role routing',
      'Function calling with strict JSON schema verification & safety gates',
      'Human-in-the-loop audit checkpoints for mission-critical actions',
      'Self-healing execution queues with automated error recovery',
    ],
    technologies: ['LangGraph', 'Python FastAPI', 'Claude 3.5 / GPT-4o', 'Redis', 'Temporal.io'],
  },
  {
    id: 'rag-knowledge',
    category: 'intelligent-systems',
    categoryLabel: 'Intelligent Systems',
    title: 'RAG & Knowledge Systems',
    tagline: 'Enterprise search across complex multi-format document lakes.',
    description:
      'Turn vast unstructured corporate repositories into high-precision, sub-second queryable neural knowledge systems with real-time vector embeddings and zero hallucination boundaries.',
    icon: <Brain className="h-6 w-6 text-purple-500" />,
    iconBg: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
    metric: {
      value: '99.4%',
      label: 'Contextual citation & factual precision',
    },
    features: [
      'Multi-format parser for PDFs, scanned contracts, audio, and Notion/Slack',
      'Hybrid semantic vector search blended with BM25 keyword reranking',
      'Role-based Access Control (RBAC) filtering at retrieval layer',
      'Deterministic document citation and automated chunk freshness sync',
    ],
    technologies: ['pgvector', 'Pinecone', 'Cohere Rerank', 'LangChain', 'PostgreSQL'],
  },
  {
    id: 'data-analytics',
    category: 'intelligent-systems',
    categoryLabel: 'Intelligent Systems',
    title: 'Data & Analytics Platforms',
    tagline: 'Real-time metrics, telemetry & executive predictive dashboards.',
    description:
      'Consolidate high-velocity transactional and event streams into lightning-fast analytical engines. Deliver executive dashboards, operational alerting, and predictive forecasts at scale.',
    icon: <LineChart className="h-6 w-6 text-blue-500" />,
    iconBg: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    metric: {
      value: '< 50ms',
      label: 'Analytical query latency on billion-row datasets',
    },
    features: [
      'Real-time event streaming pipelines handling millions of events/day',
      'Sub-second aggregation queries on columnar analytic data stores',
      'Automated anomaly detection and trigger-based webhook alerts',
      'Interactive executive BI dashboards with role-partitioned views',
    ],
    technologies: ['ClickHouse', 'Apache Kafka', 'DuckDB', 'Next.js SSR', 'Tailwind CSS'],
  },

  // 2. DIGITAL PRODUCTS
  {
    id: 'saas-platforms',
    category: 'digital-products',
    categoryLabel: 'Digital Products',
    title: 'SaaS Platforms',
    tagline: 'Enterprise recurring revenue engines & customer portals.',
    description:
      'We build market-ready multi-tenant software-as-a-service platforms engineered for scale, global compliance, automated subscription lifecycles, and rapid tenant onboarding.',
    icon: <Cloud className="h-6 w-6 text-indigo-500" />,
    iconBg: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30',
    metric: {
      value: '99.99%',
      label: 'System availability SLA across multi-region clusters',
    },
    features: [
      'Isolated multi-tenant data partitioning and tenant scoping schemas',
      'Usage-metered and tier-based billing with Stripe and Paddle integrations',
      'Self-service tenant provisioning, team invites & granular permission matrices',
      'Custom domain support and white-label theme customization',
    ],
    technologies: ['Next.js 15', 'TypeScript', 'Prisma ORM', 'Stripe Billing', 'PostgreSQL'],
  },
  {
    id: 'business-process-automation',
    category: 'digital-products',
    categoryLabel: 'Digital Products',
    title: 'Business Process Automation',
    tagline: 'End-to-end integration workflows eliminating manual labor.',
    description:
      'Automate your core back-office functions, CRM synchronization, invoicing cycles, and partner communications with bulletproof, fault-tolerant orchestration workflows.',
    icon: <Workflow className="h-6 w-6 text-amber-500" />,
    iconBg: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    metric: {
      value: '60+ hrs',
      label: 'Saved per department per week from manual tasks',
    },
    features: [
      'Cross-platform webhook ingestion and data transformation engines',
      'Automated document extraction, reconciliation, and CRM record enrichment',
      'Dead-letter queue handling and automated exponential retry policies',
      'Real-time execution telemetry and Slack/Teams incident notifications',
    ],
    technologies: ['BullMQ', 'Node.js', 'Temporal.io', 'FastAPI', 'Redis'],
  },

  // 3. ENGINEERING TRANSFORMATION
  {
    id: 'legacy-modernization',
    category: 'engineering-transformation',
    categoryLabel: 'Engineering Transformation',
    title: 'Legacy Modernization',
    tagline: 'Zero-downtime refactoring into modern serverless stacks.',
    description:
      'Deconstruct fragile monolithic software and technical debt without operational disruption. Migrate to resilient, cloud-native microservices with strictly maintained business continuity.',
    icon: <RefreshCw className="h-6 w-6 text-rose-500" />,
    iconBg: 'from-rose-500/20 to-red-500/10 border-rose-500/30',
    metric: {
      value: '0 Downtime',
      label: 'Achieved using strangler-fig gradual migration patterns',
    },
    features: [
      'Strangler-fig migration phasing ensuring zero disruption to live customer traffic',
      'Database modernization with live dual-writing and automated parity testing',
      'Containerization and serverless migration lowering infrastructure costs up to 60%',
      'Strict TypeScript and test automation refactoring reducing regression bugs',
    ],
    technologies: ['Docker', 'AWS ECS / Fargate', 'Next.js', 'PostgreSQL', 'Terraform'],
  },
  {
    id: 'digital-transformation',
    category: 'engineering-transformation',
    categoryLabel: 'Engineering Transformation',
    title: 'Digital Transformation',
    tagline: 'Transitioning analog workflows to unified, scalable cloud platforms.',
    description:
      'Transition your enterprise away from slow, analog workflows and fragmented spreadsheets into unified, automated cloud platforms that unlock exponential operational scale.',
    icon: <Building2 className="h-6 w-6 text-emerald-500" />,
    iconBg: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    metric: {
      value: '3x Faster',
      label: 'Operational execution velocity across key departments',
    },
    features: [
      'End-to-end operational audits to identify manual bottlenecks and data traps',
      'Phased, risk-free migration blueprint safeguarding ongoing business continuity',
      'Unified executive command center with real-time operational KPI dashboards',
      'Structured team onboarding, documentation, and change management support',
    ],
    technologies: ['Next.js', 'PostgreSQL', 'TypeScript', 'Docker', 'OpenTelemetry'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Solutions' },
  { id: 'intelligent-systems', label: 'Intelligent Systems' },
  { id: 'digital-products', label: 'Digital Products' },
  { id: 'engineering-transformation', label: 'Engineering Transformation' },
] as const;

export function SolutionsView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      
      const aliasMap: Record<string, string> = {
        'ai-agents': 'ai-business-automation',
        'ai-solutions': 'ai-business-automation',
        'business-automation': 'ai-business-automation',
        'workflow-automation': 'business-process-automation',
        'enterprise-applications': 'saas-platforms',
        'system-integration': 'digital-transformation',
        'customer-experience': 'digital-transformation',
        'enterprise-transformation': 'digital-transformation',
        'cloud-migration': 'legacy-modernization',
        'security-compliance': 'legacy-modernization',
      };

      const targetId = aliasMap[hash] || hash;
      const found = SOLUTIONS_DATA.find((s) => s.id === targetId || s.id === hash);

      if (found) {
        setSelectedCategory('all');
        setTimeout(() => {
          const el = document.getElementById(hash) || document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 1. PAGE HEADER */}
      <section className="pt-28 pb-6 md:pt-36 md:pb-8 px-6 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
            Enterprise Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-2 max-w-3xl">
            Purpose-built technical architectures solving high-stakes enterprise bottlenecks.
          </p>
        </div>
      </section>

      {/* 2. FEATURED SHOWCASE BANNER ("Engineered for Impact.") */}
      <section className="px-6 mb-8 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 dark:border-blue-600/30 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-blue-50/50 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-blue-950/40 p-8 sm:p-12 shadow-md">
          {/* Subtle decoration lines */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-secondary/10 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-2xl text-left">

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Engineered for Impact.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Purpose-built technical architectures solving high-stakes enterprise bottlenecks.
                From mission-critical data pipelines to cognitive autonomous agents, every system is designed
                with architectural rigor, zero vendor lock-in, and measurable business ROI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
              >
                <span>Talk to an Expert</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#all-solutions"
                onClick={() => setSelectedCategory('all')}
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border border-border/80 dark:border-slate-700/80 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Browse All Categories</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENTERPRISE SOLUTIONS CATEGORY FILTER (SINGLE LINE UNDER ENGINEERED FOR IMPACT) */}
      <section id="solutions-filter" className="px-6 mb-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1">
          <div
            role="tablist"
            aria-label="Enterprise Solutions Categories"
            className="inline-flex items-center flex-nowrap gap-2 p-1.5 bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs whitespace-nowrap"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`filter-tab-${cat.id}`}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0 flex items-center gap-2',
                    active
                      ? 'bg-primary text-white shadow-xs dark:bg-blue-600 dark:text-white font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SOLUTIONS GRID */}
      <section id="all-solutions" className="px-6 pb-24 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="flex flex-col gap-12">
          {/* CATEGORY 01: Intelligent Systems */}
          {(selectedCategory === 'all' || selectedCategory === 'intelligent-systems') && (
            <div className="flex flex-col gap-8">
              <div id="intelligent-systems" className="flex flex-col gap-3 scroll-mt-28">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    CATEGORY 01
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                  Intelligent Systems
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                  Deploy cognitive intelligence into your existing infrastructure. Autonomous agents, enterprise knowledge lakes, and predictive data systems.
                </p>
              </div>

              {/* Solutions Cards Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {SOLUTIONS_DATA
                  .filter((s) => s.category === 'intelligent-systems')
                  .map((solution) => (
                    <SolutionCard key={solution.id} solution={solution} />
                  ))}
              </div>
            </div>
          )}

          {/* CATEGORY 02: Digital Products */}
          {(selectedCategory === 'all' || selectedCategory === 'digital-products') && (
            <div className="flex flex-col gap-8">
              <div
                id="digital-products"
                className={cn(
                  'flex flex-col gap-3 scroll-mt-28',
                  selectedCategory === 'all' && 'pt-10 border-t border-border/60 dark:border-slate-800/80'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    CATEGORY 02
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                  Digital Products
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                  High-throughput recurring revenue platforms, mission-critical command centers, and automated workflow pipelines.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SOLUTIONS_DATA
                  .filter((s) => s.category === 'digital-products')
                  .map((solution) => (
                    <SolutionCard key={solution.id} solution={solution} />
                  ))}
              </div>
            </div>
          )}

          {/* CATEGORY 03: Engineering Transformation */}
          {(selectedCategory === 'all' || selectedCategory === 'engineering-transformation') && (
            <div className="flex flex-col gap-8">
              <div
                id="engineering-transformation"
                className={cn(
                  'flex flex-col gap-3 scroll-mt-28',
                  selectedCategory === 'all' && 'pt-10 border-t border-border/60 dark:border-slate-800/80'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    CATEGORY 03
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                  Engineering Transformation
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                  Zero-downtime refactoring and high-performance system integrations bridging legacy silos to modern cloud primitives.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SOLUTIONS_DATA
                  .filter((s) => s.category === 'engineering-transformation')
                  .map((solution) => (
                    <SolutionCard key={solution.id} solution={solution} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. ARCHITECTURAL RIGOR / HOW WE DELIVER SOLUTIONS */}
      <section className="py-20 md:py-28 px-6 bg-slate-100/60 dark:bg-slate-900/50 border-y border-border/60 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              How Astraiv Delivers High-Stakes Solutions
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every system follows our battle-tested engineering blueprint designed to mitigate risk, guarantee high velocity, and maintain flawless stability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Bottleneck Audit',
                desc: 'We analyze your latency limits, legacy dependencies, throughput constraints, and data flows to map exact requirements.',
                icon: <Zap className="h-5 w-5 text-amber-500" />,
              },
              {
                step: '02',
                title: 'Architectural Blueprint',
                desc: 'We construct full system topologies, schema contracts, microservice boundaries, and strict security protocol models.',
                icon: <Layers className="h-5 w-5 text-blue-600" />,
              },
              {
                step: '03',
                title: 'Two-Week Sprints',
                desc: 'Continuous delivery pipelines, automated unit and integration tests, and live staging links for every feature build.',
                icon: <Server className="h-5 w-5 text-primary dark:text-purple-400" />,
              },
              {
                step: '04',
                title: 'Observability & SLA',
                desc: 'Telemetry logging, real-time APM monitoring, 99.99% availability SLAs, and proactive architectural maintenance.',
                icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
              },
            ].map((phase) => (
              <div
                key={phase.step}
                className="p-7 bg-card dark:bg-slate-900/90 border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col gap-4 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-border/50 group-hover:bg-primary group-hover:text-white transition-colors">
                    {phase.icon}
                  </div>
                  <span className="text-2xl font-black font-heading text-slate-300 dark:text-slate-700">
                    {phase.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{phase.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ENTERPRISE CONSULTATION CTA */}
      <section className="py-20 md:py-28 px-6 max-w-5xl mx-auto w-full text-center">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 dark:border-slate-700/80 bg-gradient-to-b from-card via-card to-primary/5 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 p-10 sm:p-16 shadow-lg">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
              Let&apos;s Solve Your Enterprise Bottlenecks
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
              Schedule an in-depth technical scoping session with our principal engineers. We will analyze your system requirements and deliver a customized architectural roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/solutions')}` : `/start-project?source_page=${encodeURIComponent('/solutions')}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact#schedule"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Talk to an Expert</span>
              </Link>
              <Link
                href={ROUTES.PUBLIC.CASE_STUDIES}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Case Studies &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SolutionCard({ solution }: { solution: SolutionItem }) {
  return (
    <div
      id={solution.id}
      className="group scroll-mt-32 p-7 sm:p-8 bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-xl hover:border-primary/40 dark:hover:border-accent/40 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden h-full min-h-[825px]"
    >
      {/* Secondary alias anchor points for legacy routes and navigation links */}
      {solution.id === 'ai-business-automation' && (
        <span id="ai-agents" className="absolute -top-32 pointer-events-none" />
      )}
      {solution.id === 'business-process-automation' && (
        <span id="workflow-automation" className="absolute -top-32 pointer-events-none" />
      )}
      {solution.id === 'saas-platforms' && (
        <span id="enterprise-applications" className="absolute -top-32 pointer-events-none" />
      )}
      {solution.id === 'legacy-modernization' && (
        <>
          <span id="cloud-migration" className="absolute -top-32 pointer-events-none" />
          <span id="security-compliance" className="absolute -top-32 pointer-events-none" />
        </>
      )}
      {solution.id === 'digital-transformation' && (
        <>
          <span id="enterprise-transformation" className="absolute -top-32 pointer-events-none" />
          <span id="system-integration" className="absolute -top-32 pointer-events-none" />
          <span id="customer-experience" className="absolute -top-32 pointer-events-none" />
        </>
      )}

      {/* Top ambient glow on hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 dark:bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex flex-col flex-1">
        {/* Category Pill & Icon */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br border shrink-0 group-hover:scale-105 transition-transform duration-300',
              solution.iconBg
            )}
          >
            {solution.icon}
          </div>

          <span className="text-[10.5px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-border/50 dark:border-slate-800">
            {solution.categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors min-h-[60px] flex items-center">
          <Link href={`/solutions/${solution.id}`}>
            {solution.title}
          </Link>
        </h3>

        {/* Tagline (original dropdown copy) */}
        <p className="text-xs sm:text-sm font-semibold text-primary dark:text-blue-400 mb-3 min-h-[42px] flex items-center">
          {solution.tagline}
        </p>

        {/* Detailed Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium min-h-[84px]">
          {solution.description}
        </p>

        {/* Metric Highlight Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border/60 dark:border-slate-800/80 mb-6 flex items-center gap-3.5 min-h-[70px]">
          <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white shrink-0">
            {solution.metric.value}
          </span>
          <span className="text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">
            {solution.metric.label}
          </span>
        </div>

        {/* Core Capabilities */}
        <div className="flex flex-col gap-2.5 mb-6 flex-1 justify-start">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Core Architecture
          </span>
          {solution.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        {/* Technologies Stack Tags */}
        <div className="pt-4 border-t border-border/50 dark:border-slate-800/80 mb-5 min-h-[64px] flex items-center">
          <div className="flex flex-wrap gap-1.5">
            {solution.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-border/40 dark:border-slate-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons: Direct Detail View + Consult */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Link
            href={`/solutions/${solution.id}`}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-2 group/btn shadow-xs"
          >
            <span>Explore Solution</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={`/contact?service=Custom%20Solutions&solution=${encodeURIComponent(solution.title)}`}
            className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center shrink-0"
          >
            <span>Talk to an Expert</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
