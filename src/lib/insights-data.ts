/**
 * @file client/src/lib/insights-data.ts
 * @description Centralized, scalable data repository and taxonomy for Astraiv Tech Insights.
 * 
 * Implements:
 * 1. 7 Canonical Categories:
 *    - AI
 *    - Software Engineering
 *    - Cloud
 *    - Web Development
 *    - Business Automation
 *    - Technology
 *    - Digital Transformation
 * 
 * 2. Full Article Structure:
 *    - title, excerpt, coverImage, author, publication date, updated date, category, reading time, article content
 *    - related services, related solutions, related industries, related case studies, related articles
 * 
 * 3. 4-Step Conversion & Lead-Generation Funnel:
 *    - Article -> Related Solution -> Related Service -> Related Case Study -> "Discuss Your [Topic] Project"
 */

import { getSolutionBySlug, getAllSolutions, SolutionDetail } from '@/lib/solutions-data';
import { getIndustryBySlug, getAllIndustries, IndustryDetail } from '@/lib/industries-data';
import { DEFAULT_PORTFOLIO_PROJECTS, PublicPortfolioProject } from '@/lib/portfolio-data';
import { DEFAULT_SERVICES, PublicServiceItem } from '@/lib/services-data';
import { normalizeServiceSlug, normalizeSolutionSlug, normalizeIndustrySlug } from '@/lib/relationships';

/* -------------------------------------------------------------------------- */
/*                                CATEGORIES                                  */
/* -------------------------------------------------------------------------- */

export interface InsightCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  badgeColor?: string;
}

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  {
    id: 'cat-ai',
    name: 'AI',
    slug: 'ai',
    description: 'Autonomous decision pipelines, multi-agent swarms, RAG architectures, and model fine-tuning.',
    badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:text-blue-400',
  },
  {
    id: 'cat-software-eng',
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'Distributed backend design, domain-driven architectures, event streaming, and clean code practices.',
    badgeColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400',
  },
  {
    id: 'cat-cloud',
    name: 'Cloud',
    slug: 'cloud',
    description: 'Zero-egress storage, serverless edge networks, Terraform automation, and multi-region resilience.',
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:text-amber-400',
  },
  {
    id: 'cat-web-dev',
    name: 'Web Development',
    slug: 'web-development',
    description: 'High-velocity Next.js 16 frameworks, sub-second TTFB, React Server Actions, and edge hydration.',
    badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20 dark:text-cyan-400',
  },
  {
    id: 'cat-automation',
    name: 'Business Automation',
    slug: 'business-automation',
    description: 'Mission-critical workflow orchestration, ETL pipelines, and elimination of administrative manual overhead.',
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400',
  },
  {
    id: 'cat-technology',
    name: 'Technology',
    slug: 'technology',
    description: 'Deep dives into modern database engines, vector indexing, runtime benchmarks, and tech evaluation.',
    badgeColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:text-purple-400',
  },
  {
    id: 'cat-digital-transformation',
    name: 'Digital Transformation',
    slug: 'digital-transformation',
    description: 'Strangler-fig refactoring, legacy migration roadmaps, cloud modernization, and operational change.',
    badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:text-rose-400',
  },
];

/* -------------------------------------------------------------------------- */
/*                                AUTHORS                                     */
/* -------------------------------------------------------------------------- */

export interface InsightAuthor {
  name: string;
  role: string;
  image: string | null;
  bio?: string;
}

export const INSIGHT_AUTHORS: Record<string, InsightAuthor> = {
  alex: {
    name: 'Alex Rivera',
    role: 'Principal AI & Systems Architect',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop',
    bio: 'Specializes in distributed agent orchestration, vector indexing, and low-latency inference pipelines.',
  },
  sarah: {
    name: 'Sarah Mitchell',
    role: 'Head of Cloud & Distributed Systems',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
    bio: 'Oversees multi-cloud infrastructure, zero-egress asset architectures, and high-concurrency database pooling.',
  },
  vikram: {
    name: 'Vikram Sengupta',
    role: 'Staff Full-Stack & Performance Engineer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
    bio: 'Expert in Next.js App Router performance, TypeScript design systems, and transactional enterprise SaaS.',
  },
  elena: {
    name: 'Elena Rostova',
    role: 'Director of Enterprise Modernization',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop',
    bio: 'Leads digital transformation initiatives, strangler-fig refactoring, and SOC-2 / PCI-DSS compliance audits.',
  },
};

/* -------------------------------------------------------------------------- */
/*                            ARTICLE INTERFACE                               */
/* -------------------------------------------------------------------------- */

export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: InsightAuthor;
  publishedAt: string; // ISO 8601 Date
  updatedAt: string;   // ISO 8601 Date
  category: InsightCategory;
  readingTime: string;
  content: string;     // Rich semantic HTML
  tags: string[];

  // Interconnected Taxonomies
  relatedServiceSlugs: string[];
  relatedSolutionSlugs: string[];
  relatedIndustrySlugs: string[];
  relatedCaseStudySlugs: string[];
  relatedArticleSlugs: string[];

  // Conversion Funnel CTA
  cta: {
    topic: string;
    title: string;
    subtitle: string;
    buttonText: string;
    href: string;
  };
}

/* -------------------------------------------------------------------------- */
/*                           CANONICAL ARTICLES                               */
/* -------------------------------------------------------------------------- */

export const INSIGHT_ARTICLES: InsightArticle[] = [
  // 1. AI (Exact user scenario)
  {
    id: 'art-rag-knowledge',
    slug: 'how-rag-systems-improve-enterprise-knowledge',
    title: 'How RAG Systems Improve Enterprise Knowledge',
    excerpt:
      'Explore how production Retrieval-Augmented Generation eliminates LLM hallucinations, unifies fragmented document silos, and empowers enterprise teams with deterministic semantic search.',
    coverImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    author: INSIGHT_AUTHORS.alex,
    publishedAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-24T14:30:00Z',
    category: INSIGHT_CATEGORIES[0], // AI
    readingTime: '7 min read',
    tags: ['RAG', 'pgvector', 'Enterprise Search', 'LLMs', 'Hybrid Search', 'LangGraph'],
    relatedServiceSlugs: ['ai-development'],
    relatedSolutionSlugs: ['rag-knowledge'],
    relatedIndustrySlugs: ['fintech', 'healthtech'],
    relatedCaseStudySlugs: ['financeflow'],
    relatedArticleSlugs: [
      'evaluating-pgvector-vs-dedicated-vector-databases',
      'automating-mission-critical-workflows-multi-agent-swarms',
    ],
    cta: {
      topic: 'AI',
      title: 'Discuss Your AI Project',
      subtitle:
        'Connect directly with our principal AI architects to evaluate private vector indexing, RBAC security gates, and zero-hallucination guardrails for your enterprise data.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=AI%20Development&solution=RAG%20%2F%20Enterprise%20Knowledge%20Systems&article=how-rag-systems-improve-enterprise-knowledge',
    },
    content: `
      <p>Modern enterprises accumulate vast quantities of unstructured institutional knowledge: PDF policy manuals, financial audit histories, internal technical documentation, and compliance archives. Yet, traditional keyword search often fails to capture operational context, while raw generative LLMs are prone to dangerous hallucinations.</p>
      
      <h2>The Operational Bottleneck: Unstructured Data Silos</h2>
      <p>When engineering and operations squads spend 20% to 30% of their billable hours manually digging through legacy network drives and disconnected documentation portals, company-wide execution slows down dramatically. Generic consumer AI chatbots cannot safely solve this bottleneck because they lack access to real-time internal databases and cannot cite verifiable source documents.</p>

      <h2>The Production RAG Architecture</h2>
      <p>Retrieval-Augmented Generation (RAG) bridges this chasm by decoupling semantic information retrieval from linguistic synthesis. Rather than asking an LLM to "memorize" company facts in its model weights, a production RAG system performs a deterministic two-stage pipeline:</p>
      <ul>
        <li><strong>Document Chunking & Vectorization:</strong> Ingestion workers chunk raw multi-format records into contextual semantic segments and generate high-dimensional embeddings using models like BGE-Large or OpenAI text-embedding-3.</li>
        <li><strong>Hybrid Vector & Keyword Indexing:</strong> Queries run simultaneously against HNSW vector indexes (via PostgreSQL with pgvector) and BM25 sparse keyword indices to ensure acronyms and exact serial numbers are never omitted.</li>
        <li><strong>Cross-Encoder Reranking:</strong> Top candidates pass through a secondary cross-encoder reranking model to eliminate irrelevant semantic noise before reaching the LLM context window.</li>
        <li><strong>Cryptographic Citation & Verification:</strong> Every generated sentence is mapped back to exact page and paragraph references, allowing staff to verify statements with a single click.</li>
      </ul>

      <h2>Security, RBAC, and Zero Data Leakage</h2>
      <p>A mission-critical consideration for enterprise RAG is Role-Based Access Control (RBAC). An engineering intern querying internal systems must not surface executive compensation or confidential M&A documents. By enforcing database-level Row-Level Security (RLS) filters during the vector similarity search stage, unauthorized vectors are culled before semantic distance is ever computed.</p>

      <h2>Measurable ROI & Business Impact</h2>
      <p>In verified client deployments—such as our work with FinanceFlow Capital—transitioning to automated RAG knowledge systems cut manual research latency by over 80% while achieving 100% citation accuracy across regulated regulatory audits.</p>
    `,
  },

  // 2. Software Engineering
  {
    id: 'art-software-eng',
    slug: 'building-high-throughput-event-driven-microservices',
    title: 'Building High-Throughput Event-Driven Microservices in Go & TypeScript',
    excerpt:
      'How to design deterministic event-driven distributed systems using Apache Kafka, idempotent consumer groups, and outbox patterns to guarantee zero message loss.',
    coverImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    author: INSIGHT_AUTHORS.vikram,
    publishedAt: '2026-08-14T09:00:00Z',
    updatedAt: '2026-08-20T11:15:00Z',
    category: INSIGHT_CATEGORIES[1], // Software Engineering
    readingTime: '8 min read',
    tags: ['Go', 'TypeScript', 'Apache Kafka', 'Event-Driven', 'Outbox Pattern', 'PostgreSQL'],
    relatedServiceSlugs: ['custom-software'],
    relatedSolutionSlugs: ['saas-platforms'],
    relatedIndustrySlugs: ['fintech', 'saas'],
    relatedCaseStudySlugs: ['pulsefit', 'financeflow'],
    relatedArticleSlugs: [
      'how-rag-systems-improve-enterprise-knowledge',
      'nextjs-16-partial-prerendering-server-actions',
    ],
    cta: {
      topic: 'Software Engineering',
      title: 'Discuss Your Engineering Project',
      subtitle:
        'Looking to build high-concurrency microservices, event streaming backbones, or resilient transactional systems? Consult with our senior software architects.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Custom%20Software%20Development&solution=SaaS%20Platforms&article=building-high-throughput-event-driven-microservices',
    },
    content: `
      <p>As transactional systems scale past tens of thousands of requests per second, synchronous HTTP/REST communication between services introduces cascading latency failures and tight temporal coupling. Event-driven architectures restore operational isolation by treating state transitions as immutable events.</p>

      <h2>The Dual-Write Dilemma & The Transactional Outbox</h2>
      <p>A pervasive anti-pattern in distributed software is updating a relational database and immediately publishing to an external message broker within the same application handler. If the network drops between the DB commit and the message broker call, the database reflects state that the rest of the cluster never learns about.</p>
      <p>We solve this universally using the <strong>Transactional Outbox Pattern</strong>: state changes and outgoing event envelopes are written to the same ACID database transaction. A lightweight background CDC (Change Data Capture) tailer like Debezium or a polling Go daemon reads the outbox table and dispatches events to Kafka with at-least-once delivery guarantees.</p>

      <h2>Idempotency Keys & Deduplication Gates</h2>
      <p>Because distributed brokers guarantee at-least-once delivery rather than strictly-once delivery, every event consumer must be strictly idempotent. We leverage distributed Redis locks paired with Postgres unique transaction constraints to ensure replay storms never duplicate financial debits or customer records.</p>
    `,
  },

  // 3. Cloud
  {
    id: 'art-cloud-storage',
    slug: 'zero-egress-asset-delivery-cloudflare-r2-aws-migration',
    title: 'Zero-Egress Multi-Region Cloud Architecture: Cloudflare R2 & AWS Migration',
    excerpt:
      'Real-world benchmarks and migration mechanics: how moving 14TB of media and compliance archives from AWS S3 to Cloudflare R2 reduced monthly cloud costs by 78%.',
    coverImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    author: INSIGHT_AUTHORS.sarah,
    publishedAt: '2026-08-05T12:00:00Z',
    updatedAt: '2026-08-11T16:00:00Z',
    category: INSIGHT_CATEGORIES[2], // Cloud
    readingTime: '6 min read',
    tags: ['Cloudflare R2', 'AWS S3', 'Cloud FinOps', 'Object Storage', 'DevOps', 'Zero Egress'],
    relatedServiceSlugs: ['cloud-engineering'],
    relatedSolutionSlugs: ['legacy-modernization'],
    relatedIndustrySlugs: ['saas', 'ecommerce'],
    relatedCaseStudySlugs: ['pulsefit'],
    relatedArticleSlugs: [
      'building-high-throughput-event-driven-microservices',
      'nextjs-16-partial-prerendering-server-actions',
    ],
    cta: {
      topic: 'Cloud',
      title: 'Discuss Your Cloud Project',
      subtitle:
        'Slash redundant egress bills, optimize multi-region edge caches, and modernize storage infrastructure with our certified cloud engineering architects.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Cloud%20Engineering&solution=Legacy%20Modernization&article=zero-egress-asset-delivery-cloudflare-r2-aws-migration',
    },
    content: `
      <p>Data egress fees have long represented an extortionate tax on growing software companies. In high-traffic SaaS applications serving user-generated video, high-resolution imagery, or large analytical logs, monthly egress charges on legacy cloud platforms frequently dwarf compute and storage fees combined.</p>

      <h2>S3 API Compatibility Without Vendor Lock-In</h2>
      <p>Cloudflare R2 provides full S3 API compatibility, meaning existing backend code written with the AWS SDK (Node.js, Go, or Python) requires only a localized endpoint URL and credential rebind. No data access patterns or signing logic need to be rewritten.</p>

      <h2>Dual-Read Migration Strategy</h2>
      <p>Migrating live production storage without customer-facing downtime requires a non-blocking dual-read pipeline:</p>
      <ul>
        <li><strong>On Asset Request:</strong> The edge worker first queries the destination R2 bucket.</li>
        <li><strong>Cache Miss Fallback:</strong> If the asset has not yet been copied, the worker fetches it from S3, streams it to the user immediately, and asynchronously pipes a copy into R2.</li>
        <li><strong>Incremental Sync:</strong> A background batch job concurrently sweeps cold historical records. Once 100% of keys are confirmed in R2, the legacy bucket is safely decommissioned.</li>
      </ul>
    `,
  },

  // 4. Web Development
  {
    id: 'art-web-nextjs',
    slug: 'nextjs-16-partial-prerendering-server-actions',
    title: 'Next.js 16 Partial Prerendering and Server Actions in Enterprise SaaS',
    excerpt:
      'Combining static edge shell delivery with dynamic streaming slots to achieve instantaneous initial paint and zero-client-bundle data mutations in mission-critical applications.',
    coverImage:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    author: INSIGHT_AUTHORS.vikram,
    publishedAt: '2026-07-28T14:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    category: INSIGHT_CATEGORIES[3], // Web Development
    readingTime: '8 min read',
    tags: ['Next.js 16', 'React 19', 'PPR', 'Server Actions', 'Web Performance', 'Tailwind CSS'],
    relatedServiceSlugs: ['web-applications'],
    relatedSolutionSlugs: ['saas-platforms'],
    relatedIndustrySlugs: ['saas', 'edtech'],
    relatedCaseStudySlugs: ['pulsefit'],
    relatedArticleSlugs: [
      'building-high-throughput-event-driven-microservices',
      'zero-egress-asset-delivery-cloudflare-r2-aws-migration',
    ],
    cta: {
      topic: 'Web Development',
      title: 'Discuss Your Web Project',
      subtitle:
        'Ready to engineer a sub-second, enterprise-grade Next.js web application or complex dashboard? Connect with our senior web engineering team.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Web%20Application%20Development&solution=SaaS%20Platforms&article=nextjs-16-partial-prerendering-server-actions',
    },
    content: `
      <p>Historically, full-stack web engineering forced an undesirable tradeoff: either statically generate pages for blazing CDN edge delivery (sacrificing real-time personalization), or dynamically render on every request (introducing Time To First Byte overhead).</p>

      <h2>Partial Prerendering (PPR) Explained</h2>
      <p>Next.js 16 Partial Prerendering bridges this divide seamlessly. The page shell—navbars, typography hierarchies, layout grids, and static marketing blocks—is generated once and distributed globally to edge CDN nodes. Within this static shell, dynamic slots wrapped in React <code>&lt;Suspense&gt;</code> stream in real-time personalized data without stalling page loads.</p>

      <h2>Type-Safe Server Actions & Zero Client Bundle Bloat</h2>
      <p>By replacing heavy client-side REST state handlers with React Server Actions, enterprise applications can mutate database models with full end-to-end TypeScript validation (via Zod) without sending megabytes of client-side JavaScript to mobile devices.</p>
    `,
  },

  // 5. Business Automation
  {
    id: 'art-business-automation',
    slug: 'automating-mission-critical-workflows-multi-agent-swarms',
    title: 'Automating Mission-Critical Enterprise Workflows with Multi-Agent Swarms',
    excerpt:
      'How to build deterministic, stateful multi-agent systems using LangGraph, strict JSON schema gates, and human-in-the-loop audit checkpoints to replace manual operational bottlenecks.',
    coverImage:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
    author: INSIGHT_AUTHORS.alex,
    publishedAt: '2026-07-15T08:30:00Z',
    updatedAt: '2026-07-22T13:00:00Z',
    category: INSIGHT_CATEGORIES[4], // Business Automation
    readingTime: '9 min read',
    tags: ['Autonomous Agents', 'LangGraph', 'Business Automation', 'Temporal', 'AI Orchestration'],
    relatedServiceSlugs: ['custom-software'],
    relatedSolutionSlugs: ['business-process-automation'],
    relatedIndustrySlugs: ['logistics', 'professional-services'],
    relatedCaseStudySlugs: ['aerosync'],
    relatedArticleSlugs: [
      'how-rag-systems-improve-enterprise-knowledge',
      'modernizing-legacy-monoliths-strangler-fig-pattern',
    ],
    cta: {
      topic: 'Business Automation',
      title: 'Discuss Your Automation Project',
      subtitle:
        'Eliminate repetitive back-office overhead, coordinate distributed agent swarms, and build self-healing operational pipelines with our architects.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Custom%20Software%20Development&solution=Business%20Process%20Automation&article=automating-mission-critical-workflows-multi-agent-swarms',
    },
    content: `
      <p>Single-prompt LLM scripts are insufficient for enterprise operations. When an automated system touches financial ledgers, freight dispatches, or customer account states, non-deterministic errors can cause catastrophic failures. Multi-agent swarms introduce separation of concerns, peer verification, and durable state machines.</p>

      <h2>Graph-Based Agent Coordination with LangGraph</h2>
      <p>Rather than a single prompt attempting to plan, research, calculate, and execute simultaneously, we structure workflows as directed acyclic graphs (DAGs). Each node represents a dedicated agent role:</p>
      <ul>
        <li><strong>The Planner Agent:</strong> Decomposes complex incoming requests into atomic sub-tasks.</li>
        <li><strong>The Specialist Worker:</strong> Executes specific tool calls (e.g., querying Postgres or dispatching an ERP webhook).</li>
        <li><strong>The Validator Agent:</strong> Rigorously tests output structures against strict JSON schema boundaries.</li>
        <li><strong>The Auditor Gate:</strong> Prompts human managers for approval when transaction values exceed pre-configured risk limits.</li>
      </ul>
    `,
  },

  // 6. Technology
  {
    id: 'art-technology-pgvector',
    slug: 'evaluating-pgvector-vs-dedicated-vector-databases',
    title: 'Evaluating pgvector vs Dedicated Vector Databases for Production AI',
    excerpt:
      'A hard architectural comparison between PostgreSQL pgvector (HNSW) and standalone vector-only stores like Pinecone or Qdrant across latency, operational complexity, and ACID consistency.',
    coverImage:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop',
    author: INSIGHT_AUTHORS.sarah,
    publishedAt: '2026-07-02T11:00:00Z',
    updatedAt: '2026-07-09T17:20:00Z',
    category: INSIGHT_CATEGORIES[5], // Technology
    readingTime: '7 min read',
    tags: ['pgvector', 'PostgreSQL', 'Vector Search', 'HNSW', 'Pinecone', 'AI Benchmarks'],
    relatedServiceSlugs: ['technology-consulting'],
    relatedSolutionSlugs: ['data-analytics'],
    relatedIndustrySlugs: ['fintech', 'healthtech'],
    relatedCaseStudySlugs: ['financeflow'],
    relatedArticleSlugs: [
      'how-rag-systems-improve-enterprise-knowledge',
      'building-high-throughput-event-driven-microservices',
    ],
    cta: {
      topic: 'Technology',
      title: 'Discuss Your Architecture Project',
      subtitle:
        'Need an objective architectural audit of your database, AI stack, or infrastructure? Partner with our principal consultants for vendor-neutral technical evaluation.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Technology%20Consulting&solution=Data%20%26%20Analytics%20Platforms&article=evaluating-pgvector-vs-dedicated-vector-databases',
    },
    content: `
      <p>The explosion of generative AI sparked a race toward specialized vector databases. However, in enterprise software architectures, introducing a new database engine incurs ongoing maintenance costs, cross-network latency, and difficult synchronization hurdles.</p>

      <h2>The Relational Advantage of pgvector</h2>
      <p>With the release of HNSW (Hierarchical Navigable Small World) indexing in pgvector, PostgreSQL delivers sub-20ms cosine similarity queries over millions of vectors. More importantly, pgvector allows embeddings to live side-by-side with relational enterprise tables. This eliminates dual-write race conditions and enables compound SQL queries combining spatial coordinates, user permissions, and semantic similarity in a single atomic transaction.</p>

      <h2>When Does a Dedicated Vector DB Make Sense?</h2>
      <p>Dedicated vector engines only become mandatory when vector datasets exceed tens of millions of records or require specialized cluster-wide sharding. For 95% of enterprise applications, consolidating on PostgreSQL with pgvector yields superior latency, simpler backups, and significant infrastructure savings.</p>
    `,
  },

  // 7. Digital Transformation
  {
    id: 'art-digital-transformation',
    slug: 'modernizing-legacy-monoliths-strangler-fig-pattern',
    title: 'Modernizing Legacy Enterprise Monoliths with the Strangler-Fig Pattern',
    excerpt:
      'How to safely decompose brittle legacy monoliths into cloud-native microservices with zero downtime, continuous integration, and dual-write data validation.',
    coverImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    author: INSIGHT_AUTHORS.elena,
    publishedAt: '2026-06-18T10:00:00Z',
    updatedAt: '2026-06-25T15:30:00Z',
    category: INSIGHT_CATEGORIES[6], // Digital Transformation
    readingTime: '8 min read',
    tags: ['Strangler Fig', 'Legacy Modernization', 'Cloud Migration', 'Microservices', 'Enterprise Architecture'],
    relatedServiceSlugs: ['technology-consulting'],
    relatedSolutionSlugs: ['digital-transformation'],
    relatedIndustrySlugs: ['logistics', 'professional-services'],
    relatedCaseStudySlugs: ['aerosync'],
    relatedArticleSlugs: [
      'automating-mission-critical-workflows-multi-agent-swarms',
      'zero-egress-asset-delivery-cloudflare-r2-aws-migration',
    ],
    cta: {
      topic: 'Digital Transformation',
      title: 'Discuss Your Transformation Project',
      subtitle:
        'De-risk your legacy migration with zero downtime. Consult directly with our enterprise transformation directors to craft a staged modernization roadmap.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Technology%20Consulting&solution=Digital%20Transformation&article=modernizing-legacy-monoliths-strangler-fig-pattern',
    },
    content: `
      <p>"Big Bang" architectural rewrites are notorious for exceeding budgets, missing deadlines, and introducing subtle regression bugs into production systems. The Strangler-Fig Pattern provides a reliable, incremental alternative.</p>

      <h2>The Three Phases of Strangler-Fig Modernization</h2>
      <p>Rather than rebuilding the entire enterprise stack in secret, new microservices are deployed alongside the legacy system, gradually intercepting traffic until the legacy core can be decommissioned without fanfare:</p>
      <ul>
        <li><strong>1. Intercept:</strong> An intelligent API Gateway or Cloudflare Worker sits in front of all inbound traffic. Legacy routes pass through directly, while target endpoints are routed to the new services.</li>
        <li><strong>2. Shadow Dual-Write & Verification:</strong> Before redirecting user traffic, the modern service runs in shadow mode, consuming parallel event streams and validating output parity against the legacy monolith.</li>
        <li><strong>3. Cutover & Decommission:</strong> Once parity is mathematically proven across millions of transactions, live client traffic is flipped with automated rollback triggers configured.</li>
      </ul>
    `,
  },
];

/* -------------------------------------------------------------------------- */
/*                               QUERY HELPERS                                */
/* -------------------------------------------------------------------------- */

export function getAllInsightCategories(): InsightCategory[] {
  return INSIGHT_CATEGORIES;
}

export function getInsightCategoryBySlug(slug: string): InsightCategory | undefined {
  const norm = slug.toLowerCase().trim();
  return INSIGHT_CATEGORIES.find((c) => c.slug === norm || c.id === norm);
}

export function getAllInsightArticles(): InsightArticle[] {
  return [...INSIGHT_ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getInsightArticleBySlug(slug: string): InsightArticle | undefined {
  const norm = slug.toLowerCase().trim();
  return INSIGHT_ARTICLES.find((a) => a.slug === norm || a.id === norm);
}

export function getInsightArticlesByCategory(categorySlug: string): InsightArticle[] {
  const norm = categorySlug.toLowerCase().trim();
  if (norm === 'all') return getAllInsightArticles();
  return INSIGHT_ARTICLES.filter(
    (a) => a.category.slug === norm || a.category.id === norm
  );
}

export function getFeaturedInsightArticle(): InsightArticle {
  return INSIGHT_ARTICLES[0];
}

export function getRelatedInsightArticles(
  article: InsightArticle,
  limit: number = 3
): InsightArticle[] {
  // 1. Explicit companions
  const explicit = (article.relatedArticleSlugs || [])
    .map((slug) => getInsightArticleBySlug(slug))
    .filter((a): a is InsightArticle => Boolean(a && a.slug !== article.slug));

  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  // 2. Same category fallback
  const sameCategory = INSIGHT_ARTICLES.filter(
    (a) => a.category.slug === article.category.slug && a.slug !== article.slug && !explicit.includes(a)
  );

  const combined = [...explicit, ...sameCategory];
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // 3. Any other article
  const others = INSIGHT_ARTICLES.filter(
    (a) => a.slug !== article.slug && !combined.includes(a)
  );

  return [...combined, ...others].slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/*                 ARTICLE 4-STEP CONVERSION FUNNEL RESOLVER                   */
/* -------------------------------------------------------------------------- */

export interface ArticleFunnelRelationships {
  relatedSolutions: SolutionDetail[];
  relatedServices: PublicServiceItem[];
  relatedIndustries: IndustryDetail[];
  relatedCaseStudies: PublicPortfolioProject[];
  primarySolution?: SolutionDetail;
  primaryService?: PublicServiceItem;
  primaryCaseStudy?: PublicPortfolioProject;
  primaryIndustry?: IndustryDetail;
  conversionCta: {
    topic: string;
    title: string;
    subtitle: string;
    buttonText: string;
    href: string;
  };
}

export function getArticleFunnelRelationships(
  article: InsightArticle
): ArticleFunnelRelationships {
  // 1. Resolve Related Solutions (WHAT BUSINESS PROBLEMS ASTRAIV SOLVES)
  const relatedSolutions: SolutionDetail[] = (article.relatedSolutionSlugs || [])
    .map((slug) => getSolutionBySlug(normalizeSolutionSlug(slug)))
    .filter((s): s is SolutionDetail => Boolean(s));

  const fallbackSolution = getAllSolutions()[0];
  const primarySolution = relatedSolutions[0] || fallbackSolution;

  // 2. Resolve Related Services (WHAT ASTRAIV DOES / ENGINEERING SQUAD)
  const relatedServices: PublicServiceItem[] = (article.relatedServiceSlugs || [])
    .map((slug) => {
      const canonical = normalizeServiceSlug(slug);
      return DEFAULT_SERVICES.find((s) => s.slug === canonical);
    })
    .filter((s): s is PublicServiceItem => Boolean(s));

  const primaryService = relatedServices[0] || DEFAULT_SERVICES[0];

  // 3. Resolve Related Industries
  const relatedIndustries: IndustryDetail[] = (article.relatedIndustrySlugs || [])
    .map((slug) => getIndustryBySlug(normalizeIndustrySlug(slug)))
    .filter((i): i is IndustryDetail => Boolean(i));

  const primaryIndustry = relatedIndustries[0] || getAllIndustries()[0];

  // 4. Resolve Related Case Studies (PROVEN CLIENT OUTCOMES)
  const relatedCaseStudies: PublicPortfolioProject[] = (article.relatedCaseStudySlugs || [])
    .map((slug) =>
      DEFAULT_PORTFOLIO_PROJECTS.find(
        (p) => p.slug === slug || p.id === slug
      )
    )
    .filter((cs): cs is PublicPortfolioProject => Boolean(cs));

  const primaryCaseStudy = relatedCaseStudies[0] || DEFAULT_PORTFOLIO_PROJECTS[0];

  // 5. Conversion CTA Construction
  const conversionCta = article.cta || {
    topic: article.category.name,
    title: `Discuss Your ${article.category.name} Project`,
    subtitle: `Consult directly with our principal architects to evaluate system design, performance benchmarks, and implementation timelines.`,
    buttonText: `Start a Project`,
    href: `/start-project?source_page=${encodeURIComponent(`/insights/${article.slug}`)}&service=${encodeURIComponent(primaryService.slug)}&solution=${encodeURIComponent(primarySolution.slug)}`,
  };

  return {
    relatedSolutions,
    relatedServices,
    relatedIndustries,
    relatedCaseStudies,
    primarySolution,
    primaryService,
    primaryCaseStudy,
    primaryIndustry,
    conversionCta,
  };
}
