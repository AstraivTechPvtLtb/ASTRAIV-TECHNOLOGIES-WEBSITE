'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  Bot,
  Terminal,
  Cpu,
  Cloud,
  Globe,
  Smartphone,
  Layers,
  GitBranch,
  Settings,
  Database,
  Shuffle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Server,
  Code2,
  ChevronRight,
  Search,
  Activity,
  Lock,
  Workflow,
  Laptop,
  Check,
  Compass,
  FileCode2,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               DATA DEFINITION                              */
/* -------------------------------------------------------------------------- */

interface CoreServiceItem {
  id: string;
  category: 'ai-software' | 'web-mobile' | 'cloud-devops' | 'enterprise-strategy';
  categoryLabel: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  deliverables: string[];
  techStack: string[];
  slaHighlight: string;
}

const ALL_SERVICES_CARDS: CoreServiceItem[] = [
  // 1. AI Solutions
  {
    id: 'ai-solutions',
    category: 'ai-software',
    categoryLabel: 'AI & Machine Learning',
    title: 'AI Solutions & Autonomous Agents',
    description:
      'Integration of Large Language Models, autonomous agent swarms, vector retrieval (RAG), and predictive analytics pipelines into your core business operations.',
    icon: <Bot className="h-6 w-6 text-cyan-500" />,
    iconBg: 'from-cyan-500/15 to-blue-500/10 border-cyan-500/30 text-cyan-500',
    deliverables: [
      'Multi-agent decision orchestrations',
      'High-precision RAG knowledge systems',
      'Prompt safety & hallucination guards',
    ],
    techStack: ['LangChain', 'Python FastAPI', 'pgvector', 'Claude 3.5', 'OpenAI'],
    slaHighlight: '< 150ms Vector Retrieval',
  },
  // 2. Web Applications
  {
    id: 'web-applications',
    category: 'web-mobile',
    categoryLabel: 'Applications',
    title: 'Web Applications & SaaS Platforms',
    description:
      'Custom, scalable SaaS applications, real-time command dashboards, and client self-service portals engineered for enterprise velocity and high concurrency.',
    icon: <Terminal className="h-6 w-6 text-indigo-500" />,
    iconBg: 'from-indigo-500/15 to-purple-500/10 border-indigo-500/30 text-indigo-500',
    deliverables: [
      'Multi-tenant architecture & RBAC',
      'Automated recurring Stripe/Paddle billing',
      'Real-time WebSocket event feeds',
    ],
    techStack: ['Next.js 15', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'],
    slaHighlight: '99.99% Cluster Availability',
  },
  // 3. Custom Software
  {
    id: 'custom-software',
    category: 'ai-software',
    categoryLabel: 'Core Engineering',
    title: 'Custom Software Development',
    description:
      'Bespoke, high-performance software engineered specifically around your core business models to replace fragmented third-party SaaS with proprietary IP.',
    icon: <Cpu className="h-6 w-6 text-purple-500" />,
    iconBg: 'from-purple-500/15 to-pink-500/10 border-purple-500/30 text-purple-500',
    deliverables: [
      'Domain-Driven Design (DDD) logic',
      'High-throughput internal worker queues',
      'Custom admin telemetry consoles',
    ],
    techStack: ['Go', 'Node.js', 'Python', 'TypeScript', 'Redis'],
    slaHighlight: '100% Client IP Ownership',
  },
  // 4. Cloud Solutions
  {
    id: 'cloud-solutions',
    category: 'cloud-devops',
    categoryLabel: 'Infrastructure',
    title: 'Cloud Solutions & Architecture',
    description:
      'Resilient, highly available AWS and Cloudflare Edge infrastructure designed with automated autoscaling, multi-region redundancy, and near-zero downtime.',
    icon: <Cloud className="h-6 w-6 text-sky-500" />,
    iconBg: 'from-sky-500/15 to-blue-500/10 border-sky-500/30 text-sky-500',
    deliverables: [
      'Multi-region Terraform Infrastructure as Code',
      'Cloudflare R2 edge assets & CDN',
      'Disaster recovery & hot failover',
    ],
    techStack: ['AWS', 'Cloudflare Edge', 'Docker', 'Terraform', 'PostgreSQL'],
    slaHighlight: '99.99% Availability SLA',
  },
  // 5. Website Development
  {
    id: 'web-development',
    category: 'web-mobile',
    categoryLabel: 'Web Systems',
    title: 'Corporate Website Development',
    description:
      'Premium, pixel-perfect, and SEO-optimized corporate web properties utilizing modern Next.js App Router for sub-second page loads and global brand presence.',
    icon: <Globe className="h-6 w-6 text-teal-500" />,
    iconBg: 'from-teal-500/15 to-emerald-500/10 border-teal-500/30 text-teal-500',
    deliverables: [
      'Sub-second First Contentful Paint (FCP)',
      'Internationalization (i18n) routing',
      'Headless CMS & CRM lead capture',
    ],
    techStack: ['Next.js SSR', 'Tailwind CSS', 'Framer Motion', 'next-intl'],
    slaHighlight: '100 Lighthouse Performance',
  },
  // 6. Mobile Apps
  {
    id: 'mobile-apps',
    category: 'web-mobile',
    categoryLabel: 'Mobile Engineering',
    title: 'Mobile Applications (iOS & Android)',
    description:
      'Premium cross-platform mobile experiences engineered with native responsiveness, offline-first sync, biometric security, and push notification pipelines.',
    icon: <Smartphone className="h-6 w-6 text-emerald-500" />,
    iconBg: 'from-emerald-500/15 to-teal-500/10 border-emerald-500/30 text-emerald-500',
    deliverables: [
      'Single codebase iOS & Android apps',
      'Offline caching & optimistic updates',
      'App Store & Google Play deployment',
    ],
    techStack: ['React Native', 'Flutter', 'TypeScript', 'Expo', 'SQLite'],
    slaHighlight: '60 FPS Native Performance',
  },
  // 7. UI/UX Design
  {
    id: 'ui-ux-design',
    category: 'web-mobile',
    categoryLabel: 'Product Design',
    title: 'UI/UX Design & Design Systems',
    description:
      'Modern, Stripe-grade user interfaces designed with strict layout hierarchies, bespoke design tokens, fluid micro-interactions, and conversion-first user flows.',
    icon: <Layers className="h-6 w-6 text-pink-500" />,
    iconBg: 'from-pink-500/15 to-rose-500/10 border-pink-500/30 text-pink-500',
    deliverables: [
      'Figma design system & reusable tokens',
      'Interactive clickable prototypes',
      'WCAG 2.1 AAA Accessibility audits',
    ],
    techStack: ['Figma', 'Design Tokens', 'Tailwind CSS', 'Storybook', 'Framer Motion'],
    slaHighlight: '100% Component Library Spec',
  },
  // 8. DevOps & CI/CD
  {
    id: 'devops-cicd',
    category: 'cloud-devops',
    categoryLabel: 'Infrastructure',
    title: 'DevOps, CI/CD & Kubernetes',
    description:
      'Zero-downtime deployment pipelines, automated linting & test suites, Kubernetes cluster management, and continuous container preview environments.',
    icon: <GitBranch className="h-6 w-6 text-amber-500" />,
    iconBg: 'from-amber-500/15 to-orange-500/10 border-amber-500/30 text-amber-500',
    deliverables: [
      'GitHub Actions automated deployment pipelines',
      'Kubernetes Helm chart management',
      'Automated rollbacks & health probes',
    ],
    techStack: ['GitHub Actions', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD'],
    slaHighlight: 'Zero-Downtime Deployments',
  },
  // 9. Business Automation
  {
    id: 'business-automation',
    category: 'enterprise-strategy',
    categoryLabel: 'Automation',
    title: 'Business Process Automation',
    description:
      'Automate internal multi-step databases, billing pipelines, CRM synchronization, customer support escalations, and cross-platform event dispatchers.',
    icon: <Settings className="h-6 w-6 text-orange-500" />,
    iconBg: 'from-orange-500/15 to-amber-500/10 border-orange-500/30 text-orange-500',
    deliverables: [
      'Bi-directional CRM & database synchronization',
      'Automated email & webhook dispatchers',
      'Exception alerting & fallback queues',
    ],
    techStack: ['Temporal', 'n8n', 'Zapier Enterprise', 'Python', 'Redis Queues'],
    slaHighlight: '90%+ Manual Hours Saved',
  },
  // 10. Enterprise Software
  {
    id: 'enterprise-software',
    category: 'enterprise-strategy',
    categoryLabel: 'Enterprise IT',
    title: 'Enterprise Software & Microservices',
    description:
      'High-concurrency database architectures, distributed microservices linked via asynchronous event brokers, SAML 2.0 enterprise SSO, and regulatory audits.',
    icon: <Database className="h-6 w-6 text-blue-600" />,
    iconBg: 'from-blue-600/15 to-indigo-500/10 border-blue-600/30 text-blue-600',
    deliverables: [
      'Distributed event streaming architectures',
      'Enterprise SSO (SAML 2.0 / Okta / Azure AD)',
      'Immutable audit logs & HIPAA/SOC2 readiness',
    ],
    techStack: ['Next.js', 'Go', 'Apache Kafka', 'PostgreSQL', 'Docker'],
    slaHighlight: '50k+ Concurrent Users',
  },
  // 11. Digital Transformation
  {
    id: 'digital-transformation',
    category: 'enterprise-strategy',
    categoryLabel: 'Transformation',
    title: 'Digital Transformation & Modernization',
    description:
      'Modernize legacy monoliths into scalable micro-frontends and cloud-native backends with zero data loss, continuous migration gates, and staff training.',
    icon: <Shuffle className="h-6 w-6 text-violet-500" />,
    iconBg: 'from-violet-500/15 to-purple-500/10 border-violet-500/30 text-violet-500',
    deliverables: [
      'Legacy monolith strangulation & refactoring',
      'Zero-downtime database migration scripts',
      'Standardized modern developer toolchains',
    ],
    techStack: ['TypeScript', 'GraphQL', 'Next.js', 'PostgreSQL', 'Docker'],
    slaHighlight: 'Zero Business Disruption',
  },
  // 12. IT Consulting
  {
    id: 'it-consulting',
    category: 'enterprise-strategy',
    categoryLabel: 'Advisory',
    title: 'IT Consulting & Architectural Audits',
    description:
      'Senior architectural reviews, tech due diligence, security posture evaluations, and tailored engineering roadmaps delivered by principal engineers.',
    icon: <HelpCircle className="h-6 w-6 text-rose-500" />,
    iconBg: 'from-rose-500/15 to-pink-500/10 border-rose-500/30 text-rose-500',
    deliverables: [
      'Deep architectural bottleneck diagnosis',
      'Security vulnerability & compliance reports',
      '12-month technology scaling roadmap',
    ],
    techStack: ['System Modeling', 'C4 Architecture', 'OpenTelemetry', 'AWS Well-Architected'],
    slaHighlight: 'Actionable Executive Blueprint',
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Services (12)' },
  { id: 'ai-software', label: 'AI & Core Software' },
  { id: 'web-mobile', label: 'Web & Mobile' },
  { id: 'cloud-devops', label: 'Cloud & DevOps' },
  { id: 'enterprise-strategy', label: 'Enterprise & Strategy' },
] as const;

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export function ServicesView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'pipeline' | 'telemetry' | 'standards'>('pipeline');

  // Filter services by category and search keyword
  const filteredServices = useMemo(() => {
    return ALL_SERVICES_CARDS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col w-full selection:bg-primary/20">
      {/* ==================================================================== */}
      {/* 1. INNOVATIVE ASYMMETRICAL HERO SECTION                              */}
      {/* ==================================================================== */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-slate-950 dark:via-background dark:to-background border-b border-border/50 dark:border-slate-800/60">
        {/* Futuristic Ambient Glow Spheres */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/15 dark:bg-primary/20 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-secondary/10 dark:bg-secondary/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Mission, Value Prop, Action Buttons */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge with live pulse */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-cyan-300 dark:border-cyan-500/30 mb-6 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span>Full-Cycle Software Engineering</span>
              </div>

              {/* Commanding Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-heading text-slate-900 dark:text-white leading-[1.08] mb-6">
                Architectural Precision.{' '}
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-cyan-500 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  High-Velocity
                </span>{' '}
                Delivery.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8 max-w-2xl">
                We engineer mission-critical digital products, autonomous AI pipelines, high-throughput web applications, and resilient cloud architectures with zero technical debt and 100% proprietary code ownership.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
                <Link
                  href="/contact"
                  className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                >
                  <span>Schedule Technical Scope</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#services-catalog"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore 12 Core Services</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>

              {/* Assurances Bar */}
              <div className="pt-6 border-t border-border/60 dark:border-slate-800/80 w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100% Client IP Ownership</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Strict Type-Safe Code</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1">
                  <Activity className="h-4 w-4 text-cyan-500 shrink-0" />
                  <span>99.99% Cloud SLA</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Engineering Command Console */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl p-1 bg-gradient-to-br from-primary/30 via-indigo-500/20 to-cyan-500/30 shadow-xl shadow-primary/10">
                <div className="rounded-[14px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col gap-5 text-left">
                  {/* Window Bar */}
                  <div className="flex items-center justify-between border-b border-border/60 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        astraiv-engine // live-telemetry
                      </span>
                    </div>
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      LIVE • CLUSTER READY
                    </span>
                  </div>

                  {/* Console Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    {[
                      { id: 'pipeline', label: 'Delivery Pipeline' },
                      { id: 'telemetry', label: 'SLAs & Telemetry' },
                      { id: 'standards', label: 'Code Standards' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveConsoleTab(tab.id as any)}
                        className={cn(
                          'flex-1 py-1.5 px-2 rounded-md text-[11px] font-bold transition-all',
                          activeConsoleTab === tab.id
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Delivery Pipeline */}
                  {activeConsoleTab === 'pipeline' && (
                    <div className="flex flex-col gap-3 py-1">
                      {[
                        {
                          phase: 'Stage 01',
                          title: 'System Modeling & Spec',
                          status: 'Validated',
                          badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40',
                        },
                        {
                          phase: 'Stage 02',
                          title: 'Type-Safe Core Engineering',
                          status: 'Active Sprint',
                          badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
                        },
                        {
                          phase: 'Stage 03',
                          title: 'Automated Security & QA',
                          status: 'Passing (100%)',
                          badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
                        },
                        {
                          phase: 'Stage 04',
                          title: 'Cloudflare / AWS Deployment',
                          status: 'Zero-Downtime',
                          badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 font-mono">
                                {item.phase}
                              </span>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {item.title}
                              </span>
                            </div>
                          </div>
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', item.badgeColor)}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 2: SLAs & Telemetry */}
                  {activeConsoleTab === 'telemetry' && (
                    <div className="grid grid-cols-2 gap-3 py-1">
                      {[
                        { label: 'Cluster Uptime SLA', val: '99.99%', sub: 'Zero unplanned outages' },
                        { label: 'Global P99 Latency', val: '< 65ms', sub: 'Edge CDN routing' },
                        { label: 'Test Coverage', val: '98.5%', sub: 'Unit & integration suites' },
                        { label: 'Type Safety', val: '100%', sub: 'Strict schema validation' },
                      ].map((stat, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 flex flex-col"
                        >
                          <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                            {stat.label}
                          </span>
                          <span className="text-xl font-black font-heading text-slate-900 dark:text-white mt-1">
                            {stat.val}
                          </span>
                          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {stat.sub}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Code Standards */}
                  {activeConsoleTab === 'standards' && (
                    <div className="flex flex-col gap-2.5 py-1 text-xs">
                      <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                        <span><strong>Domain-Driven Design:</strong> Decoupled logic with clean boundaries.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                        <span><strong>Zero Hallucination AI:</strong> Strict JSON validation gates on all LLMs.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                        <span><strong>OWASP & SOC2:</strong> Sanitized inputs, RBAC, and payload encryption.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                        <span><strong>Immutable Handover:</strong> 100% code repositories pushed to your Git.</span>
                      </div>
                    </div>
                  )}

                  {/* Terminal Footer Info */}
                  <div className="pt-2 border-t border-border/50 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>12 Active Disciplines</span>
                    <span className="text-primary dark:text-cyan-400 font-bold">READY TO SCALE →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. THE 12 CORE SERVICES CATALOG (PREVIOUS CARDS + RICH CAPABILITIES) */}
      {/* ==================================================================== */}
      <section id="services-catalog" className="py-20 px-6 max-w-7xl mx-auto w-full scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2.5 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase bg-primary/10 text-primary dark:bg-cyan-500/20 dark:text-cyan-300 border border-primary/20 dark:border-cyan-500/30 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CORE ENGINEERING CATALOG</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Our Services
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Premium software engineering and cloud automation engineered for hyper-growth. Explore our 12 specialized disciplines built for enterprise velocity.
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
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* The 12 Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <p className="text-base text-muted-foreground font-semibold">
              No services found matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-primary dark:text-cyan-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="h-full flex flex-col"
              >
                <div className="group relative overflow-hidden bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/70 dark:border-slate-800/90 hover:border-primary/50 dark:hover:border-cyan-500/50 rounded-[22px] shadow-xs hover:shadow-xl transition-all duration-300 select-none h-full flex flex-col justify-between p-6 text-left">
                  {/* Decorative background glow */}
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 dark:bg-cyan-500/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

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
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
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
                        href="/contact"
                        className="inline-flex items-center text-xs font-black text-primary dark:text-cyan-400 hover:text-primary/80 dark:hover:text-cyan-300 transition-colors group/link"
                      >
                        <span>Scope Service</span>
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
      {/* 3. INNOVATIVE FULL-CYCLE ENGINEERING LIFECYCLE                       */}
      {/* ==================================================================== */}
      <section className="py-20 md:py-28 px-6 bg-slate-50/80 dark:bg-slate-950/60 border-y border-border/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex self-center px-3.5 py-1 text-xs font-black tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30 uppercase w-fit">
              EXECUTION METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
              How We Deliver Engineering Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              A systematic 4-phase agile engineering lifecycle designed to eliminate technical debt, guarantee architectural clarity, and maximize launch velocity.
            </p>
          </div>

          {/* 4-Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Architectural Blueprinting',
                desc: 'Deep-dive discovery, entity relation diagrams, API contracts, and infrastructure topology modeling prior to coding.',
                deliverable: 'System Architecture Document',
                icon: <Compass className="h-6 w-6 text-cyan-500" />,
              },
              {
                step: '02',
                title: 'High-Velocity Sprints',
                desc: 'Two-week sprint cycles with type-safe implementations, live staging preview branches, and weekly video walkthroughs.',
                deliverable: 'Live Staging Previews & PRs',
                icon: <FileCode2 className="h-6 w-6 text-indigo-500" />,
              },
              {
                step: '03',
                title: 'Hardening & Security Audits',
                desc: 'Rigorous penetration testing, automated OWASP security scans, load simulations, and WCAG accessibility verifications.',
                deliverable: 'Security & QA Sign-Off',
                icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
              },
              {
                step: '04',
                title: 'Zero-Downtime Deployment & SLA',
                desc: 'Cloudflare Edge CDN, automated AWS failover clusters, continuous telemetry logging, and proactive 24/7 SLA monitoring.',
                deliverable: 'Production Rollout & 24/7 SLA',
                icon: <Activity className="h-6 w-6 text-purple-500" />,
              },
            ].map((phase, idx) => (
              <div
                key={idx}
                className="p-7 bg-card dark:bg-slate-900/90 border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-lg transition-all flex flex-col justify-between text-left group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 dark:bg-cyan-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 group-hover:bg-primary group-hover:text-white transition-colors">
                      {phase.icon}
                    </div>
                    <span className="text-3xl font-black font-heading text-slate-300 dark:text-slate-700">
                      {phase.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                    {phase.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 dark:border-slate-800 flex items-center gap-2 text-[11px] font-semibold text-primary dark:text-cyan-400">
                  <Check className="h-3.5 w-3.5" />
                  <span>{phase.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. ENGINEERING STANDARDS & SLA BENCHMARKS                            */}
      {/* ==================================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-card dark:bg-slate-900/90 border border-border/80 dark:border-slate-800/80 shadow-md">
          <div className="max-w-3xl mb-12 text-left">
            <span className="inline-flex px-3 py-1 text-xs font-black tracking-wider uppercase text-primary bg-primary/10 dark:bg-cyan-500/20 dark:text-cyan-300 rounded-md border border-primary/20 dark:border-cyan-500/30 mb-3">
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
              <div className="flex items-center gap-2 text-primary dark:text-cyan-400 font-bold text-sm">
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
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 dark:border-cyan-500/30 bg-gradient-to-br from-primary/10 via-card to-cyan-500/10 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-10 sm:p-16 shadow-xl">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <span className="inline-flex px-3.5 py-1 text-xs font-black tracking-wider uppercase text-primary dark:text-cyan-300 bg-primary/10 dark:bg-cyan-500/20 rounded-full border border-primary/20 dark:border-cyan-500/30">
              LET'S BUILD TOGETHER
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
              Ready to Accelerate Your Software Engineering?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Schedule a direct consultation with our senior systems architects to discuss project requirements, timelines, and technical architecture.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95 group"
              >
                <span>Book Engineering Scoping Call</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/company#pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-xs"
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
