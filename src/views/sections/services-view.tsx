'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  Bot,
  Cloud,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Layers,
  GitBranch,
  Settings,
  Shuffle,
  HelpCircle,
  Terminal,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Server,
  Code2,
  ChevronRight,
  Radio,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  category: 'ai-software' | 'applications' | 'cloud-engineering' | 'strategy-transformation';
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

const SERVICES_DATA: ServiceItem[] = [
  // 1. AI & SOFTWARE
  {
    id: 'ai-intelligent-systems',
    category: 'ai-software',
    categoryLabel: 'AI & Software',
    title: 'AI & Intelligent Systems',
    tagline: 'Autonomous agents, cognitive workflows & predictive engines.',
    description:
      'We design and deploy custom autonomous agents, LLM pipelines, and cognitive workflows that integrate directly into your database and operational tools to execute multi-step business decisions.',
    icon: <Bot className="h-6 w-6 text-cyan-500" />,
    iconBg: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
    metric: {
      value: '10x',
      label: 'Faster cognitive workflow execution',
    },
    features: [
      'Autonomous multi-agent orchestration and task decomposition',
      'Enterprise RAG pipelines with dense and sparse hybrid vector search',
      'Custom LLM fine-tuning and strict prompt safety evaluation',
      'Real-time streaming agent telemetry and hallucination guardrails',
    ],
    technologies: ['LangChain', 'Python FastAPI', 'pgvector', 'OpenAI', 'Claude 3.5'],
  },
  {
    id: 'saas-development',
    category: 'ai-software',
    categoryLabel: 'AI & Software',
    title: 'SaaS Development',
    tagline: 'Scalable multi-tenant platforms built for high user growth.',
    description:
      'Full-lifecycle SaaS architecture and product engineering. We build resilient multi-tenant foundations, automated billing systems, user permission structures, and client self-service portals.',
    icon: <Cloud className="h-6 w-6 text-indigo-500" />,
    iconBg: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30',
    metric: {
      value: '99.99%',
      label: 'Multi-region cluster availability SLA',
    },
    features: [
      'Isolated multi-tenant database partitioning and tenancy middleware',
      'Recurring Stripe & Paddle billing with automated tier metering',
      'Granular role-based access control (RBAC) and team management',
      'White-label branded tenant subdomains and custom styling',
    ],
    technologies: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe'],
  },
  {
    id: 'custom-software',
    category: 'ai-software',
    categoryLabel: 'AI & Software',
    title: 'Custom Software Development',
    tagline: 'Tailored enterprise architectures engineered for your workflows.',
    description:
      'Bespoke, high-performance software engineered specifically around your core business requirements. We replace fragmented third-party tools with unified, proprietary enterprise systems.',
    icon: <Cpu className="h-6 w-6 text-purple-500" />,
    iconBg: 'from-purple-500/20 to-pink-500/10 border-purple-500/30',
    metric: {
      value: '100%',
      label: 'Proprietary IP tailored to your exact workflows',
    },
    features: [
      'Tailored business logic engines built with zero extraneous dependencies',
      'Strict type contracts, DDD (Domain-Driven Design), and clean architecture',
      'High-throughput internal processing pipelines and worker queues',
      'Custom admin dashboards, telemetry metrics, and reporting tools',
    ],
    technologies: ['Node.js', 'Go', 'Python', 'TypeScript', 'Redis', 'PostgreSQL'],
  },
  {
    id: 'enterprise-software',
    category: 'ai-software',
    categoryLabel: 'AI & Software',
    title: 'Enterprise Software',
    tagline: 'Mission-critical portals, microservices & legacy migrations.',
    description:
      'Robust enterprise backbones capable of supporting millions of transactions, complex permission hierarchies, distributed microservices, and strict regulatory compliance requirements.',
    icon: <Database className="h-6 w-6 text-blue-500" />,
    iconBg: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30',
    metric: {
      value: '50k+',
      label: 'Concurrent user operations supported without degradation',
    },
    features: [
      'Distributed microservices linked via asynchronous event buses',
      'Enterprise SSO (SAML 2.0 / Okta / Azure Active Directory)',
      'Immutable audit logging, encryption at rest, and HIPAA/SOC2 readiness',
      'High-availability relational clusters with automated failover',
    ],
    technologies: ['Next.js', 'Docker', 'Kubernetes', 'PostgreSQL', 'Kafka'],
  },

  // 2. APPLICATIONS
  {
    id: 'web-development',
    category: 'applications',
    categoryLabel: 'Applications',
    title: 'Web Application Development',
    tagline: 'Modern Next.js & React apps with sub-second performance.',
    description:
      'We craft blistering fast, pixel-perfect web applications utilizing the latest Next.js App Router, React Server Components, streaming SSR, and edge-first caching patterns.',
    icon: <Globe className="h-6 w-6 text-emerald-500" />,
    iconBg: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    metric: {
      value: '< 0.8s',
      label: 'First Contentful Paint on mobile and desktop',
    },
    features: [
      'Server-side rendering, streaming hydration, and edge middleware',
      'Lighthouse 95+ performance, SEO, accessibility, and best practices',
      'Optimistic mutations with seamless instant client state transitions',
      'Responsive design systems matching high-end Stripe-like polish',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'mobile-apps',
    category: 'applications',
    categoryLabel: 'Applications',
    title: 'Mobile App Development',
    tagline: 'Native-feel iOS & Android apps with seamless UX.',
    description:
      'Cross-platform iOS and Android applications engineered for fluid native performance, real-time push notifications, offline storage, and intuitive micro-interactions.',
    icon: <Smartphone className="h-6 w-6 text-sky-500" />,
    iconBg: 'from-sky-500/20 to-blue-500/10 border-sky-500/30',
    metric: {
      value: '60 FPS',
      label: 'Fluid native gesture and animation frame rate',
    },
    features: [
      'Cross-platform code sharing with native platform compilation',
      'Offline-first synchronization with local SQLite/WatermelonDB',
      'Push notifications, biometric authentication, and in-app purchases',
      'App Store and Google Play automated submission pipelines',
    ],
    technologies: ['React Native', 'Expo', 'TypeScript', 'Tailwind', 'REST/GraphQL'],
  },
  {
    id: 'uiux-design',
    category: 'applications',
    categoryLabel: 'Applications',
    title: 'UI/UX Design',
    tagline: 'High-conversion design systems & micro-interactions.',
    description:
      'Modern, conversion-focused user experiences engineered with strict layout hierarchies, harmonious color palettes, accessible typography, and delightful micro-animations.',
    icon: <Layers className="h-6 w-6 text-amber-500" />,
    iconBg: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    metric: {
      value: '2.4x',
      label: 'Average conversion lift on redesign rollouts',
    },
    features: [
      'Complete Figma design systems with reusable atomic tokens',
      'User journey mapping, cognitive wireframing, and interactive prototypes',
      'WCAG 2.1 AA accessibility compliance and contrast validation',
      'Developer handoff blueprints with precision layout specifications',
    ],
    technologies: ['Figma', 'Design Systems', 'Prototyping', 'Tailwind Tokens'],
  },

  // 3. CLOUD & ENGINEERING
  {
    id: 'cloud-infrastructure',
    category: 'cloud-engineering',
    categoryLabel: 'Cloud & Engineering',
    title: 'Cloud & Infrastructure',
    tagline: 'Reliable AWS & Cloudflare setups with 99.99% availability.',
    description:
      'Sleek, highly available cloud topologies utilizing AWS serverless primitives, Cloudflare edge caching, object storage, and automated zero-downtime deployment pipelines.',
    icon: <Server className="h-6 w-6 text-cyan-500" />,
    iconBg: 'from-cyan-500/20 to-indigo-500/10 border-cyan-500/30',
    metric: {
      value: '99.99%',
      label: 'Infrastructure uptime across global edge nodes',
    },
    features: [
      'Terraform & Infrastructure as Code (IaC) automated provisioning',
      'AWS Lambda, ECS, Cloudflare Workers, and R2 storage architecture',
      'Global DDoS mitigation, SSL certificates, and WAF protection',
      'Automated database backups, point-in-time recovery, and replicas',
    ],
    technologies: ['AWS', 'Cloudflare', 'Terraform', 'Docker', 'PostgreSQL'],
  },
  {
    id: 'devops-cicd',
    category: 'cloud-engineering',
    categoryLabel: 'Cloud & Engineering',
    title: 'DevOps & CI/CD',
    tagline: 'Automated test-and-deploy pipelines & container orchestration.',
    description:
      'Modernize developer velocity with automated continuous integration and continuous deployment pipelines, automated linting, test suites, and preview environments.',
    icon: <GitBranch className="h-6 w-6 text-purple-500" />,
    iconBg: 'from-purple-500/20 to-pink-500/10 border-purple-500/30',
    metric: {
      value: '< 5 min',
      label: 'From git commit to global production deployment',
    },
    features: [
      'Automated GitHub Actions workflows with lint, type, and test gates',
      'Isolated ephemeral pull request preview staging environments',
      'Zero-downtime rolling and blue-green deployment strategies',
      'Centralized secrets management and environment isolation',
    ],
    technologies: ['GitHub Actions', 'Docker', 'Kubernetes', 'AWS', 'Vercel'],
  },
  {
    id: 'business-automation',
    category: 'cloud-engineering',
    categoryLabel: 'Cloud & Engineering',
    title: 'Business Automation',
    tagline: 'Automated CRM, billing pipelines & operational bots.',
    description:
      'Eliminate manual friction and administrative overhead by automating internal databases, partner billing syncs, CRM lead routing, and customer notification workflows.',
    icon: <Settings className="h-6 w-6 text-blue-500" />,
    iconBg: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
    metric: {
      value: '80%',
      label: 'Decrease in administrative data entry cycles',
    },
    features: [
      'Multi-platform webhook routing and data transformation engines',
      'Automated billing reconciliation and invoice generation bots',
      'CRM synchronization (HubSpot, Salesforce, custom DBs)',
      'Automated Slack, email, and SMS customer alert triggers',
    ],
    technologies: ['Node.js', 'BullMQ', 'Temporal', 'Webhooks', 'Redis'],
  },

  // 4. STRATEGY & TRANSFORMATION (Shifted from Home Page Services)
  {
    id: 'digital-transformation',
    category: 'strategy-transformation',
    categoryLabel: 'Strategy & Transformation',
    title: 'Digital Transformation',
    tagline: 'Transitioning analog workflows to scalable cloud platforms.',
    description:
      'Modernize outdated legacy business processes with bespoke cloud platforms, structured relational databases, automated reporting, and real-time operational transparency.',
    icon: <Shuffle className="h-6 w-6 text-rose-500" />,
    iconBg: 'from-rose-500/20 to-red-500/10 border-rose-500/30',
    metric: {
      value: '65%',
      label: 'Reduction in operational overhead post-migration',
    },
    features: [
      'Comprehensive workflow digitalization and paperwork elimination',
      'Centralized cloud-native data warehousing and automated exports',
      'Custom operations portals with role-based team management',
      'Change management, documentation, and staff training protocols',
    ],
    technologies: ['Next.js', 'PostgreSQL', 'Cloud Infrastructure', 'API Integrations'],
  },
  {
    id: 'it-consulting',
    category: 'strategy-transformation',
    categoryLabel: 'Strategy & Transformation',
    title: 'IT Consulting & Architecture',
    tagline: 'Senior architectural audits, risk assessment & optimization.',
    description:
      'Direct guidance from seasoned principal software architects. We evaluate your existing codebase, identify security bottlenecks, and construct scalable technical roadmaps.',
    icon: <HelpCircle className="h-6 w-6 text-amber-500" />,
    iconBg: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30',
    metric: {
      value: '100%',
      label: 'Direct principal engineer consultation and audit reports',
    },
    features: [
      'Deep architectural and database query performance audits',
      'Security posture, SOC2 readiness, and vulnerability scanning',
      'Tech stack evaluation, licensing cost reduction, and vendor audits',
      'Sprint velocity reviews and engineering team augmentation scoping',
    ],
    technologies: ['Architecture Audits', 'Cloud Cost Optimization', 'Security Review', 'Codebase QA'],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'ai-software', label: 'AI & Software' },
  { id: 'applications', label: 'Applications' },
  { id: 'cloud-engineering', label: 'Cloud & Engineering' },
  { id: 'strategy-transformation', label: 'Strategy & Transformation' },
] as const;

export function ServicesView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices =
    selectedCategory === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-primary/15 via-secondary/10 to-accent/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground uppercase mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-primary dark:text-accent" />
            <span>FULL-CYCLE ENGINEERING SERVICES</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-slate-900 dark:text-white max-w-5xl leading-[1.1] mb-6">
            Engineered for Scale.{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Built for Velocity.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl font-medium mb-10">
            From cognitive autonomous agents and multi-tenant SaaS platforms to resilient cloud infrastructure,
            we engineer high-velocity technology around your core business models.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl p-6 bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl shadow-sm mb-12 text-left">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold font-heading text-primary dark:text-accent">
                99.99%
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
                Cloud Availability SLA
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold font-heading text-secondary dark:text-purple-400">
                12 Disciplines
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
                Full-Stack Technical Domains
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold font-heading text-accent dark:text-cyan-400">
                100%
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
                Strict Type-Safe Delivery
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-500">
                24/7
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-semibold">
                Active Telemetry & SLA
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none',
                    active
                      ? 'bg-primary text-white shadow-sm dark:bg-accent dark:text-slate-950 font-extrabold'
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

      {/* 2. FEATURED SHOWCASE BANNER (From services dropdown featured card) */}
      <section className="px-6 mb-16 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 dark:border-cyan-500/30 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-cyan-50/50 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-blue-950/40 p-8 sm:p-12 shadow-md">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-secondary/10 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase bg-primary/10 text-primary dark:bg-cyan-500/20 dark:text-cyan-300 border border-primary/20 dark:border-cyan-500/40 w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ENTERPRISE IT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Build something exceptional.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                From AI systems to scalable enterprise applications, we engineer technology around your business.
                Partner with senior architects and elite engineers dedicated to your technical velocity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
              >
                <span>Schedule Engineering Scoping</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#all-services"
                className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border border-border/80 dark:border-slate-700/80 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Explore All Services</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES CATEGORIES & CARDS (All dropdown items + shifted home page services) */}
      <section id="all-services" className="px-6 pb-24 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="flex flex-col gap-12">
          {/* CATEGORY 01: AI & SOFTWARE */}
          {(selectedCategory === 'all' || selectedCategory === 'ai-software') && (
            <div id="ai-software" className="flex flex-col gap-3 scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  CATEGORY 01
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                AI &amp; Software
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                Autonomous agent pipelines, multi-tenant software platforms, and mission-critical custom architectures.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredServices
              .filter((s) => selectedCategory !== 'all' || s.category === 'ai-software')
              .map((service) => (
                <ServiceDetailCard key={service.id} service={service} />
              ))}
          </div>

          {/* CATEGORY 02: APPLICATIONS */}
          {(selectedCategory === 'all' || selectedCategory === 'applications') && (
            <div id="applications" className="flex flex-col gap-3 pt-10 scroll-mt-28 border-t border-border/60 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  CATEGORY 02
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                Applications
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                Modern Next.js web platforms, native-feel iOS &amp; Android applications, and high-conversion design systems.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices
              .filter((s) => selectedCategory !== 'all' || s.category === 'applications')
              .map((service) => (
                <ServiceDetailCard key={service.id} service={service} />
              ))}
          </div>

          {/* CATEGORY 03: CLOUD & ENGINEERING */}
          {(selectedCategory === 'all' || selectedCategory === 'cloud-engineering') && (
            <div id="cloud-engineering" className="flex flex-col gap-3 pt-10 scroll-mt-28 border-t border-border/60 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  CATEGORY 03
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                Cloud &amp; Engineering
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                High-availability AWS and Cloudflare environments, automated CI/CD deployment pipelines, and business process automations.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices
              .filter((s) => selectedCategory !== 'all' || s.category === 'cloud-engineering')
              .map((service) => (
                <ServiceDetailCard key={service.id} service={service} />
              ))}
          </div>

          {/* CATEGORY 04: STRATEGY & TRANSFORMATION (Shifted from Home Page) */}
          {(selectedCategory === 'all' || selectedCategory === 'strategy-transformation') && (
            <div id="strategy-transformation" className="flex flex-col gap-3 pt-10 scroll-mt-28 border-t border-border/60 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  CATEGORY 04
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                Strategy &amp; Transformation
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                Comprehensive digital transformation programs, legacy workflow modernizations, and principal software architecture audits.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredServices
              .filter((s) => selectedCategory !== 'all' || s.category === 'strategy-transformation')
              .map((service) => (
                <ServiceDetailCard key={service.id} service={service} />
              ))}
          </div>
        </div>
      </section>

      {/* 4. ENGINEERING STANDARDS FRAMEWORK */}
      <section className="py-20 md:py-28 px-6 bg-slate-100/60 dark:bg-slate-900/50 border-y border-border/60 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex self-center px-3.5 py-1 text-xs font-bold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground uppercase w-fit">
              DELIVERY STANDARDS
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              Our Core Engineering Principles
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every software service we deliver complies with rigorous technical benchmarks designed to eliminate debt and ensure lifelong reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Type-Safe Architecture',
                desc: 'Strict end-to-end TypeScript and schema contracts eliminate runtime regressions across API boundaries.',
                icon: <Code2 className="h-5 w-5 text-cyan-500" />,
              },
              {
                step: '02',
                title: 'Automated CI/CD & QA',
                desc: 'Rigorous unit tests, integration suites, and automated container preview builds with every commit.',
                icon: <GitBranch className="h-5 w-5 text-purple-500" />,
              },
              {
                step: '03',
                title: 'Security & Compliance',
                desc: 'Role-based access, end-to-end payload encryption, and SOC2/HIPAA readiness embedded into system design.',
                icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
              },
              {
                step: '04',
                title: 'Continuous Telemetry',
                desc: 'Distributed OpenTelemetry APM, real-time error alerts, and 99.99% cloud availability standards.',
                icon: <Radio className="h-5 w-5 text-amber-500" />,
              },
            ].map((pillar) => (
              <div
                key={pillar.step}
                className="p-7 bg-card dark:bg-slate-900/90 border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col gap-4 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-border/50 group-hover:bg-primary group-hover:text-white transition-colors">
                    {pillar.icon}
                  </div>
                  <span className="text-2xl font-black font-heading text-slate-300 dark:text-slate-700">
                    {pillar.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONSULTATION CTA */}
      <section className="py-20 md:py-28 px-6 max-w-5xl mx-auto w-full text-center">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 dark:border-slate-700/80 bg-gradient-to-b from-card via-card to-primary/5 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 p-10 sm:p-16 shadow-lg">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <span className="inline-flex px-3.5 py-1 text-xs font-black tracking-wider uppercase text-primary bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20">
              START YOUR PROJECT
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
              Ready to Build Your Next Engineering Milestone?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
              Connect directly with our engineering team to discuss your project scope, technical requirements, and delivery milestones.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Book Engineering Consultation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/company#pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>View Engagement Models</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceDetailCard({ service }: { service: ServiceItem }) {
  return (
    <div
      id={service.id}
      className="group scroll-mt-32 p-7 sm:p-8 bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-xl hover:border-primary/40 dark:hover:border-accent/40 transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 dark:bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div>
        {/* Category Pill & Icon */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br border shrink-0 group-hover:scale-105 transition-transform duration-300',
              service.iconBg
            )}
          >
            {service.icon}
          </div>

          <span className="text-[10.5px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md border border-border/50 dark:border-slate-800">
            {service.categoryLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
          {service.title}
        </h3>

        {/* Tagline */}
        <p className="text-xs sm:text-sm font-semibold text-primary dark:text-cyan-400 mb-3">
          {service.tagline}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          {service.description}
        </p>

        {/* Metric Highlight */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border/60 dark:border-slate-800/80 mb-6 flex items-center gap-3.5">
          <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white shrink-0">
            {service.metric.value}
          </span>
          <span className="text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold leading-tight">
            {service.metric.label}
          </span>
        </div>

        {/* Core Capabilities */}
        <div className="flex flex-col gap-2.5 mb-6">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Key Capabilities
          </span>
          {service.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* Technologies Tags */}
        <div className="pt-4 border-t border-border/50 dark:border-slate-800/80 mb-5">
          <div className="flex flex-wrap gap-1.5">
            {service.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-border/40 dark:border-slate-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/contact"
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-800 dark:hover:bg-accent dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-2 group/btn"
        >
          <span>Consult on this Service</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
