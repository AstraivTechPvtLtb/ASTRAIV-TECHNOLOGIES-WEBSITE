'use client';

/**
 * @file client/src/views/sections/insights-view.tsx
 * @description [VIEW] Dedicated Place-based Insights & Engineering Publications.
 * Strictly separates:
 * - Engineering Blog (dedicated place for systems architecture, TypeScript, distributed systems)
 * - AI Insights & Research (dedicated place for multi-agent systems, pgvector, production RAG)
 * - Technology Insights (dedicated place for core production stack & cloud architecture)
 * - Case Studies (dedicated place for enterprise client deliverables)
 * - Resources & Blueprints (dedicated place for CTO guides, checklists, boilerplates)
 * - FAQs (dedicated place for architecture & delivery FAQs)
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { cn } from '@/lib/utils';
import {
  Search,
  Sparkles,
  ArrowRight,
  BookOpen,
  Cpu,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileText,
  Bot,
  Database,
  Server,
  HelpCircle,
  Clock,
  ChevronRight,
  ExternalLink,
  Code2,
  BarChart3,
  Layers,
  Check,
  Loader2,
} from 'lucide-react';
import { BlogCard } from './blog-card';
import { formatDate } from '@/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/views/ui/accordion';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featuredImage: string | null;
  createdAt: Date | string;
  category: Category;
  author: {
    name: string;
    image: string | null;
  };
  tags?: string[];
  readingTime?: string | null;
}

interface InsightsViewProps {
  initialPosts: Post[];
  categories: Category[];
}

// Curated category filter pills for Engineering Blog
const ENGINEERING_FILTER_CATEGORIES = [
  { slug: 'all', name: 'All Topics' },
  { slug: 'software-engineering', name: 'Software Engineering' },
  { slug: 'systems-architecture', name: 'Systems & Architecture' },
  { slug: 'cloud-infrastructure', name: 'Cloud Infrastructure' },
  { slug: 'web-development', name: 'Web Development' },
  { slug: 'ui-ux-branding', name: 'UI/UX & Branding' },
  { slug: 'devops-reliability', name: 'DevOps & Reliability' },
];

// Curated category filter pills for AI Research
const AI_FILTER_CATEGORIES = [
  { slug: 'all', name: 'All AI Topics' },
  { slug: 'autonomous-agents', name: 'Autonomous Agents' },
  { slug: 'vector-search-rag', name: 'Vector Search & RAG' },
  { slug: 'large-language-models', name: 'Large Language Models' },
  { slug: 'machine-learning', name: 'Machine Learning' },
  { slug: 'neural-architectures', name: 'Neural Architectures' },
  { slug: 'technology-ai', name: 'Technology & AI' },
];

function isAiPost(post: Post): boolean {
  if (post.tags?.some((t) => t.toLowerCase() === 'section:ai-research' || t.toLowerCase() === 'ai-research')) {
    return true;
  }
  if (post.tags?.some((t) => t.toLowerCase() === 'section:engineering' || t.toLowerCase() === 'engineering')) {
    return false;
  }
  const cat = (post.category?.name || post.category?.slug || '').toLowerCase();
  return (
    cat.includes('ai') ||
    cat.includes('intelligence') ||
    cat.includes('autonomous') ||
    cat.includes('agent') ||
    cat.includes('vector') ||
    cat.includes('rag') ||
    cat.includes('machine learning') ||
    cat.includes('neural') ||
    cat.includes('llm')
  );
}

export function InsightsView({ initialPosts, categories: _categories }: InsightsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [copiedResource, setCopiedResource] = useState<string | null>(null);

  // Active section state synced with URL hash: 'blog' | 'ai-insights' | 'tech-insights' | 'case-studies' | 'resources' | 'faq' | 'all'
  const [activeSection, setActiveSection] = useState<string>('blog');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['blog', 'ai-insights', 'tech-insights', 'case-studies', 'resources', 'faq', 'all'].includes(hash)) {
        setActiveSection(hash);
      } else if (!hash) {
        setActiveSection('blog');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Separate posts cleanly between Engineering and AI Research
  const engineeringPosts = useMemo(
    () => initialPosts.filter((post) => !isAiPost(post)),
    [initialPosts]
  );
  const aiPosts = useMemo(
    () => initialPosts.filter((post) => isAiPost(post)),
    [initialPosts]
  );

  // Quick navigation items for place-based section switching
  const quickNavItems = [
    {
      id: 'blog',
      label: 'Engineering Blog',
      count: engineeringPosts.length,
      icon: <BookOpen className="h-3.5 w-3.5" />,
    },
    {
      id: 'ai-insights',
      label: 'AI Insights & Research',
      count: aiPosts.length > 0 ? aiPosts.length : 3,
      icon: <Bot className="h-3.5 w-3.5" />,
    },
    {
      id: 'tech-insights',
      label: 'Technology Insights',
      icon: <Cpu className="h-3.5 w-3.5" />,
    },
    {
      id: 'case-studies',
      label: 'Case Studies',
      icon: <BarChart3 className="h-3.5 w-3.5" />,
    },
    {
      id: 'resources',
      label: 'Resources & Blueprints',
      icon: <FileText className="h-3.5 w-3.5" />,
    },
    {
      id: 'faq',
      label: 'FAQs',
      icon: <HelpCircle className="h-3.5 w-3.5" />,
    },
    {
      id: 'all',
      label: 'All Publications',
      count: initialPosts.length,
      icon: <Layers className="h-3.5 w-3.5" />,
    },
  ];

  // Filtered Engineering posts
  const filteredEngineeringPosts = useMemo(() => {
    return engineeringPosts.filter((post) => {
      const catMatches =
        selectedCategory === 'all' ||
        post.category.slug.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        post.category.name.toLowerCase().includes(selectedCategory.toLowerCase());

      const searchMatches =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return catMatches && searchMatches;
    });
  }, [engineeringPosts, selectedCategory, searchQuery]);

  // Filtered AI posts
  const filteredAiPosts = useMemo(() => {
    return aiPosts.filter((post) => {
      const catMatches =
        selectedCategory === 'all' ||
        post.category.slug.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        post.category.name.toLowerCase().includes(selectedCategory.toLowerCase());

      const searchMatches =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return catMatches && searchMatches;
    });
  }, [aiPosts, selectedCategory, searchQuery]);

  // Filtered All posts
  const filteredAllPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const catMatches =
        selectedCategory === 'all' ||
        post.category.slug.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        post.category.name.toLowerCase().includes(selectedCategory.toLowerCase());

      const searchMatches =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return catMatches && searchMatches;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  // Section-specific featured spotlights
  const engineeringFeaturedPost =
    filteredEngineeringPosts.length > 0 ? filteredEngineeringPosts[0] : engineeringPosts[0] || null;

  const aiFeaturedPost =
    filteredAiPosts.length > 0 ? filteredAiPosts[0] : aiPosts[0] || null;

  const _allFeaturedPost =
    filteredAllPosts.length > 0 ? filteredAllPosts[0] : initialPosts[0] || null;

  // AI Cognitive Architecture Data
  const aiInsights = [
    {
      id: 'ai-agents',
      badge: 'Autonomous Systems',
      title: 'Multi-Agent Orchestration & Cognitive Task Trees',
      description:
        'How we design deterministic execution layers over stochastic LLMs using graph-based planners, schema validation gates, and self-healing error loops.',
      tags: ['LangGraph', 'Autonomous Agents', 'Next.js 16', 'TypeScript'],
      metric: '99.4% task completion rate',
      icon: <Bot className="h-5 w-5 text-primary dark:text-cyan-400" />,
      color: 'from-primary/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-primary/30 dark:border-cyan-500/20',
    },
    {
      id: 'pgvector',
      badge: 'Vector Infrastructure',
      title: 'Ultra-Low Latency Vector Search with pgvector & HNSW',
      description:
        'Architecting sub-20ms semantic retrieval across millions of enterprise records without the operational overhead of fragmented vector-only SaaS databases.',
      tags: ['pgvector', 'PostgreSQL', 'HNSW Indexing', 'Prisma'],
      metric: '<18ms query latency',
      icon: <Database className="h-5 w-5 text-primary dark:text-cyan-400" />,
      color: 'from-primary/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-primary/30 dark:border-cyan-500/20',
    },
    {
      id: 'prod-rag',
      badge: 'Enterprise Retrieval',
      title: 'Production RAG with Dynamic Citation & Hallucination Defense',
      description:
        'Eliminating hallucinations through two-stage reranking, cross-encoder scoring, and cryptographically verified citation attribution in compliance environments.',
      tags: ['RAG Pipeline', 'BGE Reranker', 'OWASP LLM', 'Guardrails'],
      metric: 'Zero hallucinated cites',
      icon: <ShieldCheck className="h-5 w-5 text-primary dark:text-cyan-400" />,
      color: 'from-cyan-500/10 via-primary/5 to-transparent',
      borderColor: 'border-cyan-500/30 dark:border-cyan-500/20',
    },
  ];

  // Technology Insights data
  const techInsights = [
    {
      id: 'r2-storage',
      title: 'Zero-Egress Asset Delivery: Cloudflare R2 vs AWS S3 Migration',
      category: 'Cloud Infrastructure',
      readTime: '6 min read',
      date: 'Aug 2026',
      summary:
        'Real benchmarks from migrating 14TB of SaaS assets from S3 to Cloudflare R2: 78% reduction in monthly cloud storage bills with identical S3 SDK code compatibility.',
      icon: <Server className="h-5 w-5 text-primary dark:text-cyan-400" />,
      tag: 'Cloud Economics',
    },
    {
      id: 'nextjs-ppr',
      title: 'Next.js 16 Partial Prerendering & Server Actions in High Scale SaaS',
      category: 'Frontend Architecture',
      readTime: '8 min read',
      date: 'Aug 2026',
      summary:
        'Combining static edge shell caching with dynamic streaming slots to achieve instantaneous initial paint and zero-client-bundle data mutations.',
      icon: <Zap className="h-5 w-5 text-primary dark:text-cyan-400" />,
      tag: 'Next.js 16',
    },
    {
      id: 'db-concurrency',
      title: 'High-Concurrency Database Syncing: Edge Caching & Prisma Pooling',
      category: 'Backend Architecture',
      readTime: '7 min read',
      date: 'Jul 2026',
      summary:
        'How we scaled a multi-tenant fitness and logistics SaaS to handle 50,000 requests/sec with transaction isolation and Prisma Accelerate pooling adapters.',
      icon: <Layers className="h-5 w-5 text-primary dark:text-cyan-400" />,
      tag: 'Prisma & Postgres',
    },
  ];

  // Case Study highlights
  const caseStudyHighlights = [
    {
      client: 'FinanceFlow Enterprise',
      category: 'Fintech SaaS & AI',
      metric: '99.99% Uptime, Sub-80ms Latency',
      summary:
        'Architected a distributed payment orchestration engine with zero-downtime ledger reconciliation and automated AML reporting.',
      slug: 'financeflow-enterprise',
      image:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    },
    {
      client: 'Apex Health Logistics',
      category: 'Healthtech Platform',
      metric: 'HIPAA & SOC-2 Type II Certified',
      summary:
        'Built real-time telemetry processing platform tracking cold-chain pharmaceutical shipments with hardware IoT failover circuits.',
      slug: 'apex-health-logistics',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    },
    {
      client: 'Krono Autonomous Inventory',
      category: 'Supply Chain AI',
      metric: '4.2x Faster Fulfillment Velocity',
      summary:
        'Deployed vision-AI edge models and predictive warehouse routing pipelines across 18 regional distribution hubs.',
      slug: 'krono-inventory',
      image:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    },
  ];

  // Technical Resources
  const resources = [
    {
      id: 'res-security-matrix',
      title: 'Multi-Tenant SaaS Security & Isolation Architecture Matrix',
      type: 'Whitepaper & Spec',
      pages: '18 Pages (PDF)',
      description:
        'Comprehensive reference architecture for tenant data isolation, IAM policies, database RLS, and SOC-2 compliance check matrix.',
      icon: <ShieldCheck className="h-6 w-6 text-primary dark:text-cyan-400" />,
      tags: ['Security', 'Multi-Tenancy', 'SOC-2'],
    },
    {
      id: 'res-ai-deployment',
      title: 'Autonomous AI Agent Deployment Checklist for CTOs',
      type: 'Implementation Guide',
      pages: '12 Pages (PDF)',
      description:
        'Step-by-step production readiness checklist: prompt sanitization, token budget management, fallback circuits, and latency SLAs.',
      icon: <Bot className="h-6 w-6 text-primary dark:text-cyan-400" />,
      tags: ['AI Agents', 'Architecture', 'CTO Guide'],
    },
    {
      id: 'res-nextjs-blueprint',
      title: 'Next.js 16 Production Performance & Edge Config Blueprint',
      type: 'Code Blueprint',
      pages: 'Code & Configs (ZIP)',
      description:
        'Production boilerplate with pre-configured Partial Prerendering, Cloudflare R2 upload pipes, Prisma connection pooling, and Tailwind tokens.',
      icon: <Code2 className="h-6 w-6 text-primary dark:text-cyan-400" />,
      tags: ['Next.js 16', 'Performance', 'Full-Stack'],
    },
  ];

  // FAQ Items
  const faqList = [
    {
      question: 'How fast can Astraiv assemble and deploy an engineering team?',
      answer:
        'We typically kick off architectural planning within 48 to 72 hours of contract execution. For active SaaS and custom engineering builds, sprint-1 deliverables are delivered within the first two weeks under transparent GitHub commit visibility.',
    },
    {
      question: 'Who owns the repository code, designs, and intellectual property?',
      answer:
        'You do — 100%. Once milestones are completed and invoices are settled, full ownership of the git repositories, Figma design assets, cloud infrastructure scripts, and IP is officially transferred to your entity with zero proprietary lock-in.',
    },
    {
      question: 'How do you guarantee enterprise data security and compliance?',
      answer:
        'We engineer with security from day one. All systems follow OWASP Top 10 guidelines, enforce strict database schema isolation, utilize HTTPS/TLS encryption at rest and in transit, configure least-privilege IAM policies, and support SOC-2 compliance audits.',
    },
    {
      question: 'What is your core production tech stack?',
      answer:
        'Our primary stack is built around TypeScript, Next.js 16 (App Router), PostgreSQL, Prisma ORM, Tailwind CSS, and Cloudflare/AWS cloud infrastructure. For AI workflows, we integrate pgvector, LangGraph, vLLM, and OpenAI API endpoints.',
    },
    {
      question: 'Can you augment our existing engineering team instead of building from scratch?',
      answer:
        'Yes. We regularly embed senior architects and full-stack engineers into existing enterprise teams to accelerate feature backlogs, refactor legacy bottlenecks, or integrate new AI and cloud capabilities alongside your in-house developers.',
    },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError(null);

    const emailTrimmed = subscriberEmail.trim();
    if (!emailTrimmed || !emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
      setSubscribeError('Please enter a valid business email address.');
      return;
    }

    setIsSubscribing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setEmailSubscribed(true);
      setSubscriberEmail('');
    } catch {
      setSubscribeError(
        'Subscription transmission failed. Please try again or email info@astraivtechnologies.com.'
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleResourceClick = (resourceId: string) => {
    setCopiedResource(resourceId);
    setTimeout(() => setCopiedResource(null), 2500);
  };

  return (
    <div className="w-full relative overflow-hidden bg-background text-foreground">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SEARCH WITH PLACE-BASED SECTION SWITCHER */}
      {/* ========================================================================= */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-10 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-heading tracking-[-0.025em] leading-[1.12]">
              Insights & <span className="heading-gradient">Engineering Publications</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-[1.62] mt-1">
              Technical deep dives, system architectures, and engineering case studies.
            </p>
          </div>

          {/* Search Command Bar */}
          <div className="w-full md:w-80 relative group">
            <div className="relative flex items-center bg-card dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-2xl p-1 shadow-xs focus-within:border-primary dark:focus-within:border-accent focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="h-4 w-4 text-muted-foreground ml-3 mr-2 shrink-0" />
              <input
                type="text"
                placeholder={
                  activeSection === 'ai-insights'
                    ? 'Search AI research...'
                    : activeSection === 'blog'
                    ? 'Search engineering blogs...'
                    : 'Search articles or blueprints...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground font-normal"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-2.5 py-1 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Place-Based Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-xs mt-6 w-fit">
          {quickNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                setSelectedCategory('all');
                setSearchQuery('');
                if (item.id === 'blog') {
                  window.history.replaceState(null, '', '#blog');
                } else if (item.id === 'all') {
                  window.history.replaceState(null, '', window.location.pathname);
                } else {
                  window.history.replaceState(null, '', `#${item.id}`);
                }
              }}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all select-none cursor-pointer',
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {typeof item.count === 'number' && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-md text-[10px]',
                    activeSection === item.id
                      ? 'bg-primary-foreground/20 text-primary-foreground font-bold'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PLACE: ENGINEERING BLOG (#blog) */}
      {/* ========================================================================= */}
      {(activeSection === 'blog' || activeSection === 'all') && (
        <section id="blog" className="px-6 max-w-7xl mx-auto mb-20 scroll-mt-28">
          {/* Engineering Place Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-border/60 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-accent uppercase tracking-wider mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Technical Publications & Systems Analysis</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] leading-[1.15] font-heading">
                Astraiv Engineering Blog
              </h2>
              <p className="text-sm text-muted-foreground font-normal mt-1 max-w-2xl leading-relaxed">
                Deep dives into distributed systems, TypeScript patterns, and cloud primitives written by senior practitioners.
              </p>
            </div>

            {/* Engineering Categories Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {ENGINEERING_FILTER_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all select-none cursor-pointer',
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105 font-semibold'
                        : 'bg-card border border-border/70 dark:border-slate-800 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Engineering Spotlight */}
          {engineeringFeaturedPost && !searchQuery && selectedCategory === 'all' && (
            <div className="relative overflow-hidden rounded-[28px] border border-border/80 dark:border-slate-800 bg-card dark:bg-slate-900/60 shadow-lg hover:shadow-2xl transition-all duration-500 group mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Image Side */}
                <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-slate-950">
                  {engineeringFeaturedPost.featuredImage ? (
                    <Image
                      src={engineeringFeaturedPost.featuredImage}
                      alt={engineeringFeaturedPost.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-bold">
                      Astraiv Engineering Spotlight
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-full">
                      <Sparkles className="h-3 w-3 text-blue-400" />
                      <span>Featured Engineering Deep Dive</span>
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mb-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent font-semibold uppercase text-[10.5px]">
                        {engineeringFeaturedPost.category.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{engineeringFeaturedPost.readingTime || '5 min read'}</span>
                      </span>
                      <span>•</span>
                      <span>{formatDate(engineeringFeaturedPost.createdAt)}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-4 leading-[1.18]">
                      <Link href={`/insights/${engineeringFeaturedPost.slug}`}>
                        {engineeringFeaturedPost.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-muted-foreground leading-[1.62] font-normal mb-6">
                      {engineeringFeaturedPost.summary}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-border/50 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {engineeringFeaturedPost.author.image && (
                        <Image
                          src={engineeringFeaturedPost.author.image}
                          alt={engineeringFeaturedPost.author.name}
                          width={38}
                          height={38}
                          className="rounded-full object-cover ring-2 ring-primary/20"
                        />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          {engineeringFeaturedPost.author.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-normal">
                          Astraiv Architecture Team
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/insights/${engineeringFeaturedPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 dark:text-accent dark:hover:text-accent/80 transition-colors group/cta tracking-normal"
                    >
                      <span>Read Deep Dive</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engineering Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEngineeringPosts.length > 0 ? (
                filteredEngineeringPosts.map((post) => (
                  <motion.div
                    layout
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.35 }}
                    className="h-full"
                  >
                    <BlogCard
                      title={post.title}
                      slug={post.slug}
                      summary={post.summary}
                      imageUrl={post.featuredImage || undefined}
                      category={post.category.name}
                      publishedAt={formatDate(post.createdAt)}
                      readTime={post.readingTime || '5 min read'}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-card/60 dark:bg-slate-900/60 rounded-2xl border border-border/50">
                  <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-60" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    No engineering articles found matching your filters.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. PLACE: AI INSIGHTS & RESEARCH (#ai-insights) */}
      {/* ========================================================================= */}
      {(activeSection === 'ai-insights' || activeSection === 'all') && (
        <section
          id="ai-insights"
          className="py-16 md:py-24 px-6 bg-slate-100/50 dark:bg-slate-900/40 border-y border-border/50 dark:border-slate-800/80 scroll-mt-28 relative"
        >
          <div className="max-w-7xl mx-auto">
            {/* AI Place Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border/60 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Bot className="h-3.5 w-3.5" />
                  <span>Cognitive Systems & LLM Architectures</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.12] font-heading mb-3">
                  AI Insights & Research
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-normal leading-[1.62] max-w-2xl">
                  Autonomous multi-agent orchestration, vector databases (pgvector), RAG retrieval pipelines, and neural architectures.
                </p>
              </div>

              {/* AI Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {AI_FILTER_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all select-none cursor-pointer',
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 scale-105 font-semibold'
                          : 'bg-card border border-border/70 dark:border-slate-800 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Spotlight if available from published AI articles */}
            {aiFeaturedPost && !searchQuery && selectedCategory === 'all' && (
              <div className="relative overflow-hidden rounded-[28px] border border-blue-500/30 dark:border-blue-500/20 bg-card dark:bg-slate-900/80 shadow-lg hover:shadow-2xl transition-all duration-500 group mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] overflow-hidden bg-slate-950">
                    {aiFeaturedPost.featuredImage ? (
                      <Image
                        src={aiFeaturedPost.featuredImage}
                        alt={aiFeaturedPost.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 flex items-center justify-center text-blue-300 font-bold">
                        Astraiv Cognitive AI Research
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-950/80 backdrop-blur-md border border-blue-500/30 text-blue-300 rounded-full">
                        <Sparkles className="h-3 w-3 text-blue-400" />
                        <span>Featured AI Research</span>
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mb-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase text-[10.5px]">
                          {aiFeaturedPost.category.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{aiFeaturedPost.readingTime || '7 min read'}</span>
                        </span>
                        <span>•</span>
                        <span>{formatDate(aiFeaturedPost.createdAt)}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground group-hover:text-blue-500 transition-colors mb-4 leading-[1.18]">
                        <Link href={`/insights/${aiFeaturedPost.slug}`}>
                          {aiFeaturedPost.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-muted-foreground leading-[1.62] font-normal mb-6">
                        {aiFeaturedPost.summary}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-border/50 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                          {aiFeaturedPost.author.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">
                            {aiFeaturedPost.author.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-normal">
                            Principal AI Architect
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/insights/${aiFeaturedPost.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                      >
                        <span>Read AI Research</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic AI Blog Posts from DB */}
            {filteredAiPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredAiPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    slug={post.slug}
                    summary={post.summary}
                    imageUrl={post.featuredImage || undefined}
                    category={post.category.name}
                    publishedAt={formatDate(post.createdAt)}
                    readTime={post.readingTime || '6 min read'}
                  />
                ))}
              </div>
            )}

            {/* Cognitive Architecture Deep Dives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    'relative rounded-2xl p-7 border bg-card dark:bg-slate-900/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group',
                    insight.borderColor
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground/80">
                        {insight.badge}
                      </span>
                      <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 group-hover:scale-110 transition-transform">
                        {insight.icon}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-3 leading-snug">
                      {insight.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-6">
                      {insight.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {insight.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-muted-foreground border border-border/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {insight.metric}
                    </span>
                    <Link
                      href="/technology#ai-expertise"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary dark:text-accent hover:underline"
                    >
                      <span>Inspect Stack</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. PLACE: TECHNOLOGY INSIGHTS (#tech-insights) */}
      {/* ========================================================================= */}
      {(activeSection === 'tech-insights' || activeSection === 'all') && (
        <section id="tech-insights" className="py-16 md:py-24 px-6 max-w-7xl mx-auto scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border/60 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent uppercase tracking-wider mb-2">
                <Cpu className="h-3.5 w-3.5" />
                <span>Modern Cloud Practices</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] leading-[1.15] font-heading">
                Technology & Cloud Engineering
              </h2>
              <p className="text-sm text-muted-foreground font-normal mt-1 max-w-2xl leading-relaxed">
                Core production stack architecture, partial prerendering benchmarks, and high-concurrency database optimizations.
              </p>
            </div>
            <Link
              href="/technology"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-accent hover:underline"
            >
              <span>View Full Technology Spectrum</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {techInsights.map((tech) => (
              <div
                key={tech.id}
                className="p-7 rounded-2xl bg-card border border-border/70 dark:border-slate-800/80 hover:border-primary/40 dark:hover:border-accent/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                      {tech.icon}
                    </div>
                    <span className="text-[10.5px] font-medium text-muted-foreground uppercase tracking-wider">
                      {tech.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent">
                      {tech.tag}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">{tech.date}</span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-3 leading-snug">
                    {tech.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-6">
                    {tech.summary}
                  </p>
                </div>

                <Link
                  href="/technology#technologies"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-accent hover:underline group/cta pt-4 border-t border-border/40 dark:border-slate-800 tracking-normal"
                >
                  <span>Read Cloud Brief</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. PLACE: CASE STUDIES (#case-studies) */}
      {/* ========================================================================= */}
      {(activeSection === 'case-studies' || activeSection === 'all') && (
        <section
          id="case-studies"
          className="py-16 md:py-24 px-6 bg-slate-100/60 dark:bg-slate-900/50 border-y border-border/50 dark:border-slate-800/80 scroll-mt-28"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-accent uppercase tracking-wider mb-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Verified Client Outcomes</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.12] font-heading">
                  Client Impact Case Studies
                </h2>
                <p className="text-sm text-muted-foreground font-normal mt-1 max-w-2xl leading-relaxed">
                  Real-world enterprise modernizations, uptime milestones, and quantifiable business ROI.
                </p>
              </div>
              <Link
                href={ROUTES.PUBLIC.CASE_STUDIES}
                className="inline-flex items-center gap-2 text-xs font-medium text-primary dark:text-accent hover:underline"
              >
                <span>Explore Full Case Studies Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudyHighlights.map((study) => (
                <div
                  key={study.client}
                  className="overflow-hidden rounded-2xl bg-card border border-border/70 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <Image
                      src={study.image}
                      alt={study.client}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-300 block">
                          {study.category}
                        </span>
                        <h4 className="text-lg font-semibold leading-tight">{study.client}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-normal mb-3 border border-emerald-500/20">
                        {study.metric}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                        {study.summary}
                      </p>
                    </div>

                    <Link
                      href={ROUTES.PUBLIC.CASE_STUDY_DETAIL(study.slug)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-accent hover:underline pt-4 border-t border-border/40 dark:border-slate-800"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. PLACE: TECHNICAL RESOURCES & BLUEPRINTS (#resources) */}
      {/* ========================================================================= */}
      {(activeSection === 'resources' || activeSection === 'all') && (
        <section id="resources" className="py-16 md:py-24 px-6 max-w-7xl mx-auto scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-accent uppercase tracking-wider mb-2">
              <FileText className="h-3.5 w-3.5" />
              <span>Reference Specs & Downloads</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.12] font-heading mb-4">
              Technical Resources & Architecture Guides
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-normal leading-[1.62]">
              Downloadable reference architectures, security checklists, and technical production blueprints created by Astraiv engineering consultants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-8 rounded-[24px] bg-card border border-border/80 dark:border-slate-800 hover:border-primary/40 dark:hover:border-accent/40 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 group-hover:scale-105 transition-transform">
                      {res.icon}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                      {res.pages}
                    </span>
                  </div>

                  <div className="text-[10px] font-semibold text-primary dark:text-accent uppercase tracking-wider mb-1">
                    {res.type}
                  </div>

                  <h3 className="text-xl font-semibold tracking-[-0.015em] text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-3 leading-snug">
                    {res.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-6">
                    {res.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {res.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-foreground/80 border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-border/40 dark:border-slate-800 flex items-center justify-between gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold tracking-normal transition-all active:scale-95 shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Request Whitepaper</span>
                  </Link>
                  <button
                    onClick={() => handleResourceClick(res.id)}
                    title="Copy reference info"
                    className="p-2.5 rounded-xl border border-border/70 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {copiedResource === res.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. PLACE: INTEGRATED FAQ SECTION (#faq) */}
      {/* ========================================================================= */}
{(activeSection === 'faq' || activeSection === 'all') && (
        <section
          id="faq"
          className="py-16 md:py-24 px-6 bg-slate-100/50 dark:bg-slate-900/40 border-t border-border/50 dark:border-slate-800/80 scroll-mt-28"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-accent uppercase tracking-wider mb-2">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Knowledge & Clarifications</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] leading-[1.12] font-heading mb-3">
                Frequently Asked <span className="heading-gradient">Questions</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-normal leading-[1.62]">
                Transparent answers regarding delivery velocity, SLAs, IP transfer, and data governance.
              </p>
            </div>

            <Accordion className="w-full space-y-4">
              {faqList.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border/70 dark:border-slate-800/90 rounded-2xl px-6 bg-card dark:bg-slate-900/80 backdrop-blur-md shadow-2xs"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground hover:no-underline py-5 text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 font-normal">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 p-6 rounded-2xl bg-card border border-border/70 dark:border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="text-sm font-semibold text-foreground">Have a specific architectural requirement?</h4>
                <p className="text-xs text-muted-foreground font-normal">Our principal engineers can review your stack specifications.</p>
              </div>
              <Link
                href={ROUTES.PUBLIC.CONTACT}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-normal hover:bg-primary/90 transition-all active:scale-95 shrink-0"
              >
                <span>Talk to an Expert</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. SECTION: ENGINEERING DISPATCH NEWSLETTER BAR */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-[28px] border border-border/80 dark:border-slate-800 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/5 p-8 sm:p-12">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] leading-[1.15] font-heading mb-3">
              Subscribe to the Astraiv Engineering Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-[1.62] mb-8">
              Receive curated architectural tutorials, AI benchmark studies, and cloud cost optimizations directly in your inbox once per month. Zero marketing noise.
            </p>

            {emailSubscribed ? (
              <div role="status" aria-live="polite" className="p-6 rounded-2xl bg-primary/10 border border-primary/30 text-foreground text-left space-y-3">
                <div className="flex items-center gap-2.5 text-primary dark:text-cyan-400 font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Subscribed! Welcome to the Astraiv Engineering Dispatch.</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                  You will receive our next monthly architecture deep dive. In the meantime, you can explore our production case studies or inspect our technical blueprints above.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs">
                  <Link href={ROUTES.PUBLIC.CASE_STUDIES} className="font-semibold text-primary hover:underline flex items-center gap-1">
                    <span>Explore Case Studies</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
                  <input
                    type="email"
                    required
                    disabled={isSubscribing}
                    placeholder="Enter your work email address"
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-card border border-border/80 dark:border-slate-700 text-xs sm:text-sm outline-none focus:border-primary dark:focus:border-accent text-foreground font-normal placeholder:text-muted-foreground shadow-inner disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold text-xs tracking-normal transition-all active:scale-95 shadow-xs cursor-pointer flex items-center justify-center gap-2 min-w-[120px]"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
                {subscribeError && (
                  <p role="alert" className="text-xs text-destructive font-semibold">
                    {subscribeError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
