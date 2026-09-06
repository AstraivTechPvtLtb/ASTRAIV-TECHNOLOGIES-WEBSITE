'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
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
  Send,
  Check,
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
}

interface InsightsViewProps {
  initialPosts: Post[];
  categories: Category[];
}

export function InsightsView({ initialPosts, categories }: InsightsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [copiedResource, setCopiedResource] = useState<string | null>(null);

  // Quick navigation anchors matching dropdown items
  const quickNavItems = [
    { label: 'Engineering Blog', href: '#blog', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { label: 'AI Insights', href: '#ai-insights', icon: <Bot className="h-3.5 w-3.5" /> },
    { label: 'Technology Insights', href: '#tech-insights', icon: <Cpu className="h-3.5 w-3.5" /> },
    { label: 'Case Studies', href: '#case-studies', icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { label: 'Resources & Blueprints', href: '#resources', icon: <FileText className="h-3.5 w-3.5" /> },
    { label: 'FAQs', href: '#faq', icon: <HelpCircle className="h-3.5 w-3.5" /> },
  ];

  // Filter posts based on category and search query
  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category.slug === selectedCategory;

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredPost = initialPosts[0];

  // AI Insights data
  const aiInsights = [
    {
      id: 'ai-agents',
      badge: 'Autonomous Systems',
      title: 'Multi-Agent Orchestration & Cognitive Task Trees',
      description:
        'How we design deterministic execution layers over stochastic LLMs using graph-based planners, schema validation gates, and self-healing error loops.',
      tags: ['LangGraph', 'Autonomous Agents', 'Next.js 16', 'TypeScript'],
      metric: '99.4% task completion rate',
      icon: <Bot className="h-5 w-5 text-cyan-500" />,
      color: 'from-cyan-500/10 via-blue-500/5 to-transparent',
      borderColor: 'border-cyan-500/30 dark:border-cyan-500/20',
    },
    {
      id: 'pgvector',
      badge: 'Vector Infrastructure',
      title: 'Ultra-Low Latency Vector Search with pgvector & HNSW',
      description:
        'Architecting sub-20ms semantic retrieval across millions of enterprise records without the operational overhead of fragmented vector-only SaaS databases.',
      tags: ['pgvector', 'PostgreSQL', 'HNSW Indexing', 'Prisma'],
      metric: '<18ms query latency',
      icon: <Database className="h-5 w-5 text-indigo-500" />,
      color: 'from-indigo-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-indigo-500/30 dark:border-indigo-500/20',
    },
    {
      id: 'prod-rag',
      badge: 'Enterprise Retrieval',
      title: 'Production RAG with Dynamic Citation & Hallucination Defense',
      description:
        'Eliminating hallucinations through two-stage reranking, cross-encoder scoring, and cryptographically verified citation attribution in compliance environments.',
      tags: ['RAG Pipeline', 'BGE Reranker', 'OWASP LLM', 'Guardrails'],
      metric: 'Zero hallucinated cites',
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      color: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 dark:border-emerald-500/20',
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
      icon: <Server className="h-5 w-5 text-amber-500" />,
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
      icon: <Zap className="h-5 w-5 text-blue-500" />,
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
      icon: <Layers className="h-5 w-5 text-purple-500" />,
      tag: 'Prisma & Postgres',
    },
  ];

  // Case Studies summaries
  const caseStudyHighlights = [
    {
      client: 'PulseFit Global',
      metric: '65% Faster Page Loads',
      category: 'SaaS & HealthTech',
      summary:
        'Engineered a multi-tenant fitness analytics dashboard built on Next.js 16, Prisma, and Cloudflare R2, cutting user drop-offs and synchronizing data in real time.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    },
    {
      client: 'AeroSync Logistics',
      metric: '-18% Route Fuel Overhead',
      category: 'Logistics AI & Fleet Sync',
      summary:
        'Custom scheduling and dispatch engine coordinating distribution fleets via WebSockets for real-time tracking updates and AI-optimized delivery routes.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    },
    {
      client: 'FinanceFlow Capital',
      metric: 'SOC-2 Compliant Vault',
      category: 'FinTech & Cognitive AI',
      summary:
        'AI-driven reconciliation engine integrating LLMs with bank ledger APIs, automated credential isolation, and SOC-2 standard pgvector indexing.',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
    },
  ];

  // Downloadable Resources & Blueprints
  const resources = [
    {
      id: 'res-saas-security',
      title: 'Enterprise SaaS Security & Multi-Tenancy Blueprint',
      type: 'Technical Specification',
      pages: '18 Pages (PDF)',
      description:
        'Comprehensive reference architecture for tenant data isolation, IAM policies, database RLS, and SOC-2 compliance check matrix.',
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      tags: ['Security', 'Multi-Tenancy', 'SOC-2'],
    },
    {
      id: 'res-ai-deployment',
      title: 'Autonomous AI Agent Deployment Checklist for CTOs',
      type: 'Implementation Guide',
      pages: '12 Pages (PDF)',
      description:
        'Step-by-step production readiness checklist: prompt sanitization, token budget management, fallback circuits, and latency SLAs.',
      icon: <Bot className="h-6 w-6 text-cyan-500" />,
      tags: ['AI Agents', 'Architecture', 'CTO Guide'],
    },
    {
      id: 'res-nextjs-blueprint',
      title: 'Next.js 16 Production Performance & Edge Config Blueprint',
      type: 'Code Blueprint',
      pages: 'Code & Configs (ZIP)',
      description:
        'Production boilerplate with pre-configured Partial Prerendering, Cloudflare R2 upload pipes, Prisma connection pooling, and Tailwind tokens.',
      icon: <Code2 className="h-6 w-6 text-blue-500" />,
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail || !subscriberEmail.includes('@')) return;
    setEmailSubscribed(true);
    setTimeout(() => {
      setSubscriberEmail('');
    }, 4000);
  };

  const handleResourceClick = (resourceId: string) => {
    setCopiedResource(resourceId);
    setTimeout(() => setCopiedResource(null), 2500);
  };

  return (
    <div className="w-full relative overflow-hidden bg-background text-foreground">
      {/* Editorial Tech Background Grid & Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[1200px] right-0 w-[600px] h-[600px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* ========================================================================= */}
      {/* 1. EDITORIAL PUBLICATION HERO */}
      {/* ========================================================================= */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        {/* Publication Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-extrabold tracking-wider text-primary bg-primary/10 dark:bg-accent/10 dark:text-accent rounded-full border border-primary/20 dark:border-accent/20 uppercase mb-6 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Astraiv Research & Knowledge Publication</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Engineering Intelligence,{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Architectural Rigor
          </span>{' '}
          & Industry Insights
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium mb-12">
          Technical deep dives, autonomous AI breakthroughs, verified case studies, and engineering
          blueprints written by the senior engineers and architects at Astraiv Technologies.
        </p>

        {/* Quick Jump Navigation Pill (Matching Dropdown Elements) */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto p-2 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl shadow-sm mb-12">
          {quickNavItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all select-none"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Search Command Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 rounded-2xl blur-xl opacity-40 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative flex items-center bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/80 dark:border-slate-700/80 rounded-2xl p-1.5 shadow-md transition-all duration-300 focus-within:border-primary dark:focus-within:border-accent focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="h-5 w-5 text-muted-foreground ml-4 mr-2.5 transition-colors group-focus-within:text-primary dark:group-focus-within:text-accent shrink-0" />
            <input
              type="text"
              placeholder="Search technical articles, blueprints, case studies, or architectural topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-2.5 text-sm md:text-base text-foreground placeholder:text-muted-foreground font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs px-2.5 py-1 text-muted-foreground hover:text-foreground font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SPOTLIGHT EDITORIAL FEATURED ARTICLE */}
      {/* ========================================================================= */}
      {featuredPost && !searchQuery && selectedCategory === 'all' && (
        <section className="px-6 max-w-7xl mx-auto mb-20">
          <div className="relative overflow-hidden rounded-[28px] border border-border/80 dark:border-slate-800 bg-card dark:bg-slate-900/60 shadow-lg hover:shadow-2xl transition-all duration-500 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Image Side */}
              <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] overflow-hidden bg-slate-950">
                {featuredPost.featuredImage ? (
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-bold">
                    Astraiv Featured Research
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-full">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    <span>Featured Deep Dive</span>
                  </span>
                </div>
              </div>

              {/* Text Side */}
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold mb-4">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent font-extrabold uppercase text-[10.5px]">
                      {featuredPost.category.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>7 min read</span>
                    </span>
                    <span>•</span>
                    <span>{formatDate(featuredPost.createdAt)}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-4 leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium mb-6">
                    {featuredPost.summary}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {featuredPost.author.image && (
                      <Image
                        src={featuredPost.author.image}
                        alt={featuredPost.author.name}
                        width={38}
                        height={38}
                        className="rounded-full object-cover ring-2 ring-primary/20"
                      />
                    )}
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-semibold">
                        Astraiv Architecture Team
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:text-primary/80 dark:text-accent dark:hover:text-accent/80 transition-colors group/cta"
                  >
                    <span>Read Deep Dive</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. SECTION: ENGINEERING BLOG & DEEP DIVES (#blog) */}
      {/* ========================================================================= */}
      <section id="blog" className="py-16 md:py-20 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border/60 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent uppercase tracking-wider mb-2">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Articles & Tutorials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
              Latest Engineering Articles
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all select-none cursor-pointer',
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105'
                  : 'bg-card border border-border/70 dark:border-slate-800 text-muted-foreground hover:text-foreground'
              )}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all select-none cursor-pointer',
                  selectedCategory === cat.slug
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105'
                    : 'bg-card border border-border/70 dark:border-slate-800 text-muted-foreground hover:text-foreground'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
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
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-card/60 dark:bg-slate-900/60 rounded-2xl border border-border/50">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-60" />
                <p className="text-sm font-semibold text-muted-foreground">
                  No articles found matching &quot;{searchQuery}&quot;. Try another search term.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION: AI INSIGHTS & COGNITIVE SYSTEMS (#ai-insights) */}
      {/* ========================================================================= */}
      <section
        id="ai-insights"
        className="py-16 md:py-24 px-6 bg-slate-100/50 dark:bg-slate-900/40 border-y border-border/50 dark:border-slate-800/80 scroll-mt-24 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Bot className="h-3.5 w-3.5" />
              <span>AI Research & Breakthroughs</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading mb-4">
              Autonomous Systems & Cognitive AI
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
              How we construct resilient production intelligence: multi-agent task execution,
              vector database architectures, and deterministic verification layers.
            </p>
          </div>

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
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground/80">
                      {insight.badge}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 group-hover:scale-110 transition-transform">
                      {insight.icon}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-3 leading-snug">
                    {insight.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                    {insight.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {insight.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-muted-foreground border border-border/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {insight.metric}
                  </span>
                  <Link
                    href="/technology#ai-expertise"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-accent hover:underline"
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

      {/* ========================================================================= */}
      {/* 5. SECTION: TECHNOLOGY INSIGHTS (#tech-insights) */}
      {/* ========================================================================= */}
      <section id="tech-insights" className="py-16 md:py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-border/60 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent uppercase tracking-wider mb-2">
              <Cpu className="h-3.5 w-3.5" />
              <span>Modern Cloud Practices</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
              Technology & Cloud Engineering
            </h2>
          </div>
          <Link
            href="/technology"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary dark:text-accent hover:underline"
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
                  <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-widest">
                    {tech.readTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent">
                    {tech.tag}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">{tech.date}</span>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-3 leading-snug">
                  {tech.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                  {tech.summary}
                </p>
              </div>

              <Link
                href="/technology#technologies"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary dark:text-accent hover:underline group/cta pt-4 border-t border-border/40 dark:border-slate-800"
              >
                <span>Read Cloud Brief</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION: CASE STUDIES HIGHLIGHTS (#case-studies) */}
      {/* ========================================================================= */}
      <section
        id="case-studies"
        className="py-16 md:py-24 px-6 bg-slate-100/60 dark:bg-slate-900/50 border-y border-border/50 dark:border-slate-800/80 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent uppercase tracking-wider mb-2">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Verified Client Outcomes</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
                Client Impact Case Studies
              </h2>
            </div>
            <Link
              href="/portfolio#case-studies"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-primary dark:text-accent hover:underline"
            >
              <span>Explore All Portfolio Case Studies</span>
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
                      <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300 block">
                        {study.category}
                      </span>
                      <h4 className="text-lg font-bold leading-tight">{study.client}</h4>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-tight mb-3 border border-emerald-500/20">
                      {study.metric}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {study.summary}
                    </p>
                  </div>

                  <Link
                    href="/portfolio#case-studies"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary dark:text-accent hover:underline pt-4 border-t border-border/40 dark:border-slate-800"
                  >
                    <span>Read Architecture Brief</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION: TECHNICAL RESOURCES & BLUEPRINTS (#resources) */}
      {/* ========================================================================= */}
      <section id="resources" className="py-16 md:py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <FileText className="h-3.5 w-3.5" />
            <span>Blueprints & Documentation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading mb-4">
            Technical Resources & Architecture Guides
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            Downloadable reference architectures, security checklists, and technical production
            blueprints created by Astraiv engineering consultants.
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
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                    {res.pages}
                  </span>
                </div>

                <div className="text-[10px] font-extrabold text-primary dark:text-accent uppercase tracking-wider mb-1">
                  {res.type}
                </div>

                <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-3 leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-6">
                  {res.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {res.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-foreground/80 border border-border/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-border/40 dark:border-slate-800 flex items-center justify-between gap-3">
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-extrabold transition-all active:scale-95 shadow-xs"
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

      {/* ========================================================================= */}
      {/* 8. SECTION: INTEGRATED FAQ SECTION (#faq) */}
      {/* ========================================================================= */}
      <section
        id="faq"
        className="py-16 md:py-24 px-6 bg-slate-100/50 dark:bg-slate-900/40 border-t border-border/50 dark:border-slate-800/80 scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Frequently Answered Inquiries</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-medium">
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
                <AccordionTrigger className="text-sm sm:text-base font-bold text-foreground hover:no-underline py-5 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 font-medium">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 rounded-2xl bg-card border border-border/70 dark:border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="text-sm font-bold text-foreground">Have a specific architectural requirement?</h4>
              <p className="text-xs text-muted-foreground">Our principal engineers can review your stack specifications.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold hover:bg-primary/90 transition-all active:scale-95 shrink-0"
            >
              <span>Schedule Architecture Consultation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION: ENGINEERING DISPATCH NEWSLETTER BAR */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-[28px] border border-border/80 dark:border-slate-800 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/5 p-8 sm:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-4">
              <Send className="h-3 w-3" />
              <span>Monthly Technical Dispatch</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading mb-3">
              Subscribe to the Astraiv Engineering Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-8">
              Receive curated architectural tutorials, AI benchmark studies, and cloud cost
              optimizations directly in your inbox once per month. Zero marketing noise.
            </p>

            {emailSubscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Thank you! You are now subscribed to the Astraiv Engineering Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your work email address"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-card border border-border/80 dark:border-slate-700 text-xs sm:text-sm outline-none focus:border-primary dark:focus:border-accent text-foreground font-medium placeholder:text-muted-foreground shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs tracking-wide transition-all active:scale-95 shadow-xs cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
