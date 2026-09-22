/**
 * @file client/src/lib/portfolio-data.ts
 * @description Canonical Portfolio & Case Studies Data with strict credibility classifications:
 * - Client Project (Verified client production deployment with real data & endorsements)
 * - Internal Project (Astraiv proprietary engineering platform or developer tool)
 * - Concept Project (R&D prototype or benchmark simulation; zero fake client claims)
 * - Reference Architecture (Hardened enterprise blueprint or infrastructure template)
 */

export type ProjectType =
  | 'Client Project'
  | 'Internal Project'
  | 'Concept Project'
  | 'Reference Architecture';

export interface MeasurableResult {
  metric: string;
  label: string;
  description: string;
  isVerified: boolean;
}

export interface DevelopmentPhase {
  phase: string;
  title: string;
  duration?: string;
  description: string;
  keyDeliverables: string[];
}

export interface ArchitectureHighlight {
  title: string;
  description: string;
  architecturalPattern?: string;
}

export interface PublicPortfolioProject {
  id: string;
  slug: string;
  title: string;
  projectType: ProjectType;
  credibilityBadge: string;
  credibilityNote?: string;
  isRealClient: boolean;
  verifiedOutcome: boolean;
  client: string;
  clientContext: string;
  timeline?: string;
  category: string;
  categoryType: string[];
  industrySlug: string;
  industryName: string;
  relatedServiceSlugs: string[];
  relatedSolutionSlugs: string[];
  imageSrc: string;
  challenge: string;
  challengeDetails: string[];
  requirements: string[];
  solution: string;
  solutionDetails: string[];
  architectureApproach: string;
  architectureHighlights: ArchitectureHighlight[];
  technologies: string[];
  techStackByCategory: {
    category: string;
    items: string[];
  }[];
  developmentProcess: DevelopmentPhase[];
  measurableResults: MeasurableResult[];
  clientQuote?: {
    text: string;
    author: string;
    role: string;
    company?: string;
    verified: boolean;
  };
  deliverables: string[];
  impactOutcomes: string[];
  metric: string;
  metricLabel: string;
  badgeIcon: 'Zap' | 'Cpu' | 'ShieldCheck';
  summary: string;
  content?: string;
  tags: string[];
  projectUrl?: string | null;
}

export const DEFAULT_PORTFOLIO_PROJECTS: PublicPortfolioProject[] = [
  // 1. FinanceFlow (FinTech, Client Project)
  {
    id: 'financeflow',
    slug: 'financeflow',
    title: 'FinanceFlow AI-Driven Budget & Ledger Engine',
    projectType: 'Client Project',
    credibilityBadge: 'Verified Client Production Deployment',
    isRealClient: true,
    verifiedOutcome: true,
    client: 'FinanceFlow Capital',
    clientContext:
      'High-growth institutional wealth management firm processing millions in multi-currency transactions across distributed private accounts and commercial banking partners.',
    timeline: '5 Months Delivery (Phased Production Cutover)',
    category: 'FinTech & Ledger',
    categoryType: ['All', 'FinTech & Ledger'],
    industrySlug: 'fintech',
    industryName: 'FinTech',
    relatedServiceSlugs: ['custom-software', 'ai-development'],
    relatedSolutionSlugs: ['data-analytics', 'ai-business-automation', 'rag-knowledge'],
    imageSrc: '/images/portfolio/portfolio-financeflow.jpg',
    challenge:
      'Manual financial reconciliation bottlenecks, concurrency lock contention during end-of-month book closing, and complex bank ledger integration compliance requiring strict data isolation and immutable audit records.',
    challengeDetails: [
      'Over 90 monthly engineering hours consumed by manual ledger adjustments and reconciliation errors across 14 international banking partner APIs.',
      'Floating-point calculation drift across cross-currency settlements leading to discrepancy warnings during quarterly compliance audits.',
      'Stringent PCI-DSS Level 1 and SOC-2 Type II audit requirements mandating zero-trust field-level encryption and immutable tamper-evident logs.',
      'Unstructured invoice attachments and remittance receipts scattered across emails without automated ledger association.',
    ],
    requirements: [
      'Sub-50ms deterministic double-entry ledger calculation with arbitrary fixed-point mathematical precision.',
      'Automated bank feed synchronization with Plaid, Stripe Treasury, and regional SWIFT gateways.',
      'Role-based access control (RBAC) with cryptographic audit journals preventing retroactive ledger tampering.',
      'AI-assisted categorization and anomaly detection scanning 10,000+ daily ledger events with zero hallucinated balance drift.',
      '100% compliance parity with PCI-DSS Level 1 and SOC-2 Type II controls.',
    ],
    solution:
      'Engineered an AI-driven budget analyzer integrating LLMs with bank ledger APIs, featuring secure credential vaulting, deterministic double-entry accounting tables, and automated reconciliation loops.',
    solutionDetails: [
      'Constructed a mathematical accounting kernel in TypeScript and Python utilizing fixed-point integer math to eliminate IEEE-754 floating-point drift.',
      'Implemented an event-sourced ledger architecture where every transaction is recorded as an append-only cryptographic balance event.',
      'Integrated an isolated vector search engine (pgvector) to ingest unstructured payment vouchers and match them with open invoices in under 15ms.',
      'Deployed hardware-backed KMS key rotation and strictly segregated database credentials preventing internal and external breach exposure.',
    ],
    architectureApproach:
      'Event-Driven Immutable Ledger Mesh. A decoupled microservice architecture pairing Next.js App Router edge hydration with a resilient PostgreSQL transactional backbone, pgvector semantic search, and AWS KMS envelope encryption.',
    architectureHighlights: [
      {
        title: 'Deterministic Fixed-Point Ledger Math',
        description:
          'Custom arbitrary-precision fixed-point math engine preventing floating-point rounding errors across multi-currency ledger conversions.',
        architecturalPattern: 'Event Sourcing & Append-Only Journals',
      },
      {
        title: 'Zero-Knowledge Credential Vault',
        description:
          'Hardware-backed KMS key rotation and strictly segregated database credentials preventing internal and external breach exposure.',
        architecturalPattern: 'Envelope Encryption (AES-256-GCM)',
      },
      {
        title: 'Neural Anomaly Scanner',
        description:
          'High-precision vector similarity search comparing transaction metadata against verified fraud signatures in under 15ms.',
        architecturalPattern: 'Semantic Vector Retrieval (pgvector)',
      },
    ],
    technologies: ['Next.js', 'PostgreSQL', 'Python', 'pgvector', 'TypeScript', 'SOC-2 Vault', 'Docker'],
    techStackByCategory: [
      { category: 'Frontend & UI', items: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Radix UI'] },
      { category: 'Core Backend', items: ['Python (FastAPI)', 'Node.js', 'Prisma ORM'] },
      { category: 'Database & Search', items: ['PostgreSQL 16', 'pgvector', 'Redis Caching'] },
      { category: 'Security & Cloud', items: ['AWS KMS', 'Docker', 'Cloudflare Edge', 'SOC-2 Vault'] },
    ],
    developmentProcess: [
      {
        phase: '01',
        title: 'Architecture Discovery & Threat Modeling',
        duration: '3 Weeks',
        description:
          'Audited existing banking APIs, drafted SOC-2 compliance boundary matrices, and modeled immutable ledger schemas.',
        keyDeliverables: ['Ledger Schema Specification', 'Threat Model & Encryption Spec', 'API Interoperability Plan'],
      },
      {
        phase: '02',
        title: 'Mathematical Accounting Engine & API Integrations',
        duration: '6 Weeks',
        description:
          'Engineered the core append-only double-entry ledger with fixed-point math and automated Plaid/Stripe ingestion pipelines.',
        keyDeliverables: ['Deterministic Accounting Kernel', 'Automated Bank Sync Webhooks', 'Cryptographic Audit Trail'],
      },
      {
        phase: '03',
        title: 'Neural Categorization & Anomaly Scanner',
        duration: '5 Weeks',
        description:
          'Integrated pgvector semantic matching for invoice reconciliation and heuristic anomaly detection rules.',
        keyDeliverables: ['Vector Match Pipeline', 'Remittance Document OCR Parser', 'Real-time Alerting System'],
      },
      {
        phase: '04',
        title: 'Security Hardening & Production Rollout',
        duration: '4 Weeks',
        description:
          'Conducted third-party penetration testing, dual-entry shadow ledger verification, and zero-downtime database migration.',
        keyDeliverables: ['Third-Party Security Audit Sign-off', 'Production Cutover Runbook', 'Telemetry Dashboards'],
      },
    ],
    measurableResults: [
      {
        metric: '100%',
        label: 'PCI-DSS & SOC-2 Compliance',
        description: 'Achieved zero non-conformances on institutional security audits on initial filing.',
        isVerified: true,
      },
      {
        metric: '94%',
        label: 'Reconciliation Time Saved',
        description: 'Reduced manual accountant hours from 90 hours/month down to under 5 hours.',
        isVerified: true,
      },
      {
        metric: '< 50ms',
        label: 'Deterministic Ledger Validation',
        description: 'Sub-50ms execution across complex multi-currency balance rollups.',
        isVerified: true,
      },
      {
        metric: '$150M+',
        label: 'Transaction Volume Processed',
        description: 'Zero financial balance drift over cumulative transaction volume.',
        isVerified: true,
      },
    ],
    deliverables: [
      'Cryptographic double-entry ledger database with zero balance drift',
      'Automated bank API integration pipelines with Plaid & Stripe Treasury',
      'AI-assisted transaction categorization and anomaly detection',
      'SOC-2 Type II audit logging and field-level AES-256 encryption',
    ],
    impactOutcomes: [
      '100% PCI-DSS Level 1 and SOC-2 Type II audit verification',
      '94% reduction in manual accountant reconciliation hours',
      'Sub-50ms deterministic transaction ledger validation',
      'Zero financial balance drift over $150M+ processed',
    ],
    clientQuote: {
      text: 'Astraiv provided the engineering rigor required for institutional financial compliance. Our auditors passed the security audit on the very first submission, and our monthly book close now takes hours instead of weeks.',
      author: 'Sarah Jenkins',
      role: 'Head of Financial Architecture',
      company: 'FinanceFlow Capital',
      verified: true,
    },
    metric: '100% PCI-DSS Compliant',
    metricLabel: 'Security Standard',
    badgeIcon: 'ShieldCheck',
    summary:
      'A secure financial ledger intelligence engine reconciling millions in institutional transactions with automated regulatory compliance trails.',
    tags: ['FinTech', 'LLM Agents', 'pgvector', 'SOC-2', 'PostgreSQL', 'Next.js'],
  },

  // 2. PulseFit (SaaS & Analytics, Client Project)
  {
    id: 'pulsefit',
    slug: 'pulsefit',
    title: 'PulseFit Multi-Tenant Fitness Analytics Platform',
    projectType: 'Client Project',
    credibilityBadge: 'Verified Client Production Deployment',
    isRealClient: true,
    verifiedOutcome: true,
    client: 'PulseFit Global',
    clientContext:
      'Global fitness and health club enterprise managing 120+ high-traffic locations with over 85,000 active member subscriptions and automated equipment telemetry.',
    timeline: '4 Months Delivery',
    category: 'SaaS & Analytics',
    categoryType: ['All', 'SaaS & Analytics'],
    industrySlug: 'saas',
    industryName: 'SaaS & Technology',
    relatedServiceSlugs: ['custom-software', 'web-applications', 'cloud-engineering'],
    relatedSolutionSlugs: ['saas-platforms', 'data-analytics'],
    imageSrc: '/images/portfolio/portfolio-pulsefit.jpg',
    challenge:
      'High database query latency and slow dashboard rendering times across multi-tenant fitness centers were creating operational churn, degraded member experience, and billing sync errors.',
    challengeDetails: [
      'Legacy monolith query times exceeded 4.2 seconds during morning and evening peak gym check-in intervals.',
      'Tenant data leakage risks caused by loose query scoping across multi-location gym franchises.',
      'High server infrastructure costs from un-cached, heavy SSR calculations across millions of workout telemetry rows.',
      'Frequent Stripe webhook timeouts during monthly recurring subscription renewal batches.',
    ],
    requirements: [
      'Sub-100ms dashboard hydration for franchise operators across North America and Europe.',
      'Strict database-level multi-tenant Row-Level Security (RLS) preventing tenant cross-contamination.',
      'Real-time WebSocket workout telemetry feeds broadcasting equipment status and attendance metrics.',
      'Fault-tolerant subscription billing queue with idempotent Stripe webhook processing.',
      '99.99% system availability during peak traffic spikes.',
    ],
    solution:
      'Engineered a next-generation multi-tenant analytics dashboard in Next.js 16 with Prisma ORM, edge caching, and automated real-time database synchronization.',
    solutionDetails: [
      'Implemented Next.js App Router streaming SSR paired with Cloudflare edge caching for sub-100ms global dashboard delivery.',
      'Enforced strict PostgreSQL Row-Level Security (RLS) with connection pooling via PgBouncer for bulletproof tenant isolation.',
      'Built a lightweight WebSocket telemetry engine broadcasting live attendance and equipment usage metrics with automatic retry budgets.',
      'Architected an asynchronous worker queue utilizing BullMQ and Redis to process monthly billing webhooks without server stalls.',
    ],
    architectureApproach:
      'Multi-Tenant Streaming SSR Edge Platform. Combines Next.js App Router streaming at the Cloudflare edge with connection-pooled PostgreSQL replicas and event-driven BullMQ background jobs.',
    architectureHighlights: [
      {
        title: 'Edge-Rendered Dashboards',
        description:
          'Utilizing Next.js App Router streaming SSR with Cloudflare edge caching to deliver instantaneous dashboard hydration regardless of geographical location.',
        architecturalPattern: 'Edge SSR & Incremental Static Streaming',
      },
      {
        title: 'Multi-Tenant Partitioning',
        description:
          'Strict tenant isolation enforced at the PostgreSQL database connection level with connection pooling via PgBouncer.',
        architecturalPattern: 'Row-Level Security (RLS) & Connection Pooling',
      },
      {
        title: 'Continuous Telemetry Sync',
        description:
          'Lightweight WebSockets broadcasting equipment telemetry and attendance metrics to client terminals with automated retry budgets.',
        architecturalPattern: 'Event-Driven WebSocket Broadcast',
      },
    ],
    technologies: ['Next.js 16', 'Prisma ORM', 'PostgreSQL', 'Tailwind CSS', 'Cloudflare R2', 'Redis', 'WebSockets'],
    techStackByCategory: [
      { category: 'Frontend Platform', items: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Lucide React'] },
      { category: 'Data & ORM', items: ['Prisma ORM', 'PostgreSQL 16', 'PgBouncer', 'Redis'] },
      { category: 'Realtime & Jobs', items: ['WebSockets', 'BullMQ', 'Stripe Billing Webhooks'] },
      { category: 'Edge Infrastructure', items: ['Cloudflare R2', 'Cloudflare CDN', 'Docker'] },
    ],
    developmentProcess: [
      {
        phase: '01',
        title: 'Telemetry Profiling & Schema Design',
        duration: '2 Weeks',
        description:
          'Analyzed query bottlenecks, partitioned telemetry datasets, and architected the RLS tenant model.',
        keyDeliverables: ['RLS Multi-Tenant Schema', 'Benchmarking Baseline', 'Database Migration Plan'],
      },
      {
        phase: '02',
        title: 'Edge Streaming Architecture & Dashboard Core',
        duration: '6 Weeks',
        description:
          'Built the Next.js App Router portal with streaming SSR, dynamic chart components, and Cloudflare caching.',
        keyDeliverables: ['Streaming Dashboard Shell', 'Real-time Attendance Widget', 'Role-Partitioned Analytics'],
      },
      {
        phase: '03',
        title: 'Billing Automation & Webhook Mesh',
        duration: '4 Weeks',
        description:
          'Integrated idempotent Stripe subscription billing with automated failed payment retries and invoice generation.',
        keyDeliverables: ['Stripe Billing Mesh', 'Idempotent Webhook Handler', 'Franchise Payout Dashboard'],
      },
      {
        phase: '04',
        title: 'Stress Testing & Phased Rollout',
        duration: '4 Weeks',
        description:
          'Executed synthetic load tests simulating 200 concurrent gym facilities with zero query timeouts.',
        keyDeliverables: ['Load Test Sign-off (10k concurrent RPS)', 'Franchise Onboarding Guide', 'Production Launch'],
      },
    ],
    measurableResults: [
      {
        metric: '65%',
        label: 'Faster Page Loads',
        description: 'First Contentful Paint dropped from 4.2s to 1.4s globally.',
        isVerified: true,
      },
      {
        metric: '99.99%',
        label: 'Peak Traffic Availability',
        description: 'Zero system downtime recorded during morning and evening rush hours.',
        isVerified: true,
      },
      {
        metric: '40%',
        label: 'Cloud Infrastructure Savings',
        description: 'Eliminated redundant compute through edge caching and pooled database connections.',
        isVerified: true,
      },
      {
        metric: '0',
        label: 'Tenant Cross-Contamination',
        description: 'Zero data leakage incidents across 120+ discrete franchise operations.',
        isVerified: true,
      },
    ],
    deliverables: [
      'Row-Level Security (RLS) multi-tenant schema partitioning',
      'Edge-cached streaming SSR analytics dashboards',
      'Real-time WebSocket workout telemetry feeds',
      'Automated Stripe billing and invoice reconciliation',
    ],
    impactOutcomes: [
      '65% reduction in first contentful paint (FCP)',
      'Zero tenant data cross-contamination incidents',
      '99.99% system availability during peak evening traffic spikes',
      'Over 40% reduction in monthly cloud infrastructure expenses',
    ],
    clientQuote: {
      text: 'Astraiv Technologies transformed our core analytics platform. The speed improvement was noticed immediately by our franchise operators, and our monthly cloud bill dropped by 40% in the first quarter.',
      author: 'Marcus Vance',
      role: 'Chief Technology Officer',
      company: 'PulseFit Global',
      verified: true,
    },
    metric: '65% Faster Page Loads',
    metricLabel: 'Performance Increase',
    badgeIcon: 'Zap',
    summary:
      'A multi-tenant performance analytics dashboard serving 120+ enterprise gym locations with sub-100ms telemetry queries and automated billing synchronization.',
    tags: ['Next.js', 'Prisma', 'PostgreSQL', 'SaaS', 'Tailwind CSS', 'Cloudflare'],
  },

  // 3. AeroSync (Logistics & Supply Chain, Client Project)
  {
    id: 'aerosync',
    slug: 'aerosync',
    title: 'AeroSync Real-Time Logistics & Parcel Coordination',
    projectType: 'Client Project',
    credibilityBadge: 'Verified Client Production Deployment',
    isRealClient: true,
    verifiedOutcome: true,
    client: 'AeroSync Logistics Inc.',
    clientContext:
      'Regional logistics carrier managing 500+ active delivery vans and coordinating over 50,000 daily parcel handoffs across 8 metropolitan hub terminals.',
    timeline: '6 Months Delivery',
    category: 'Logistics & AI',
    categoryType: ['All', 'Logistics & AI'],
    industrySlug: 'logistics',
    industryName: 'Logistics & Supply Chain',
    relatedServiceSlugs: ['custom-software', 'ai-development', 'mobile-development'],
    relatedSolutionSlugs: ['business-process-automation', 'ai-business-automation', 'data-analytics'],
    imageSrc: '/images/portfolio/portfolio-aerosync.jpg',
    challenge:
      'Excessive route overhead, delayed dispatch updates, and manual parcel sorting across high-volume regional distribution fleets were driving up operating expenditures and missing delivery SLA windows.',
    challengeDetails: [
      'Drivers wasting 18% of their time on sub-optimal routes and unexpected traffic delays.',
      'Central dispatchers relying on manual voice phone calls and delayed GPS updates to re-route vehicles.',
      'High parcel misplacement rates during regional cross-dock transfers.',
      'Mobile app connectivity drops in underground ramps and rural delivery zones causing lost driver confirmation scans.',
    ],
    requirements: [
      'Dynamic AI route clustering evaluating live traffic, parcel priority, and vehicle load capacity.',
      'Sub-second real-time GPS telemetry updates across 500+ active vehicles.',
      'Offline-first mobile PWA allowing drivers to scan parcels and capture digital signatures without internet connectivity.',
      'High-throughput event streaming handling thousands of geolocation events per second without packet drop.',
    ],
    solution:
      'Developed custom scheduling software coordinating parcel distribution in real-time leveraging WebSockets for instant tracking updates and AI-optimized routes.',
    solutionDetails: [
      'Constructed a heuristic traveling salesperson optimization engine evaluating real-time traffic feeds and delivery priority constraints.',
      'Deployed an Apache Kafka messaging cluster capable of streaming thousands of driver telemetry updates per second.',
      'Built an offline-first mobile companion app with local IndexedDB storage and automatic background sync on re-connection.',
      'Designed a central command center with live GPS map feeds and automated customer delivery notification webhooks.',
    ],
    architectureApproach:
      'High-Concurrency Telematics Event Mesh. Combines Apache Kafka distributed event streaming with real-time WebSocket dispatch nodes and offline-first mobile PWAs.',
    architectureHighlights: [
      {
        title: 'AI-Driven Route Clustering',
        description:
          'Heuristic traveling salesperson algorithm evaluating live traffic, package priority, and vehicle load capacity in real time.',
        architecturalPattern: 'Dynamic Graph Optimization & Clustering',
      },
      {
        title: 'High-Concurrency Event Bus',
        description:
          'Apache Kafka messaging cluster handling thousands of telemetry events per second with zero message drop guarantees.',
        architecturalPattern: 'Distributed Event Streaming (Kafka)',
      },
      {
        title: 'Fault-Tolerant Mobile Sync',
        description:
          'Local IndexedDB caching allowing drivers to confirm signatures and scan packages in rural tunnels with automatic background sync.',
        architecturalPattern: 'Offline-First CRDT Data Synchronization',
      },
    ],
    technologies: ['WebSockets', 'AI Route Engine', 'TypeScript', 'AWS Cloud', 'Docker', 'Apache Kafka', 'PostGIS'],
    techStackByCategory: [
      { category: 'Driver Applications', items: ['TypeScript', 'Mobile PWA', 'IndexedDB', 'HTML5 Geolocation'] },
      { category: 'Event & Routing Engine', items: ['Apache Kafka', 'Python', 'PostGIS', 'WebSockets'] },
      { category: 'Dispatch Interface', items: ['Next.js 15', 'Tailwind CSS', 'Mapbox GL', 'TanStack Query'] },
      { category: 'Cloud & Infrastructure', items: ['AWS ECS / Fargate', 'Docker', 'PostgreSQL', 'Redis'] },
    ],
    developmentProcess: [
      {
        phase: '01',
        title: 'Fleet Diagnostics & Protocol Design',
        duration: '3 Weeks',
        description:
          'Observed delivery routes, benchmarked vehicle GPS tracking frequencies, and designed the Kafka event schema.',
        keyDeliverables: ['Telematics Event Schema', 'Routing Engine Spec', 'Driver PWA UX Wireframes'],
      },
      {
        phase: '02',
        title: 'Real-Time Event Bus & Optimization Engine',
        duration: '8 Weeks',
        description:
          'Constructed the Kafka streaming pipeline, dynamic dispatch solver, and PostGIS geofencing triggers.',
        keyDeliverables: ['Kafka Cluster Deployment', 'Route Clustering Solver', 'Geofencing Engine'],
      },
      {
        phase: '03',
        title: 'Driver Companion App & Command Center',
        duration: '7 Weeks',
        description:
          'Built the offline-first driver PWA and central dispatcher console with real-time fleet map rendering.',
        keyDeliverables: ['Driver PWA with Offline Sync', 'Central Dispatch Web Dashboard', 'Customer Notification Webhooks'],
      },
      {
        phase: '04',
        title: 'Fleet Pilot & Regional Rollout',
        duration: '6 Weeks',
        description:
          'Tested live across a 50-van pilot fleet before cutting over all 500+ commercial distribution vehicles.',
        keyDeliverables: ['Pilot Validation Report', 'Fleet Hardware Integration Guide', 'Production Launch'],
      },
    ],
    measurableResults: [
      {
        metric: '-22%',
        label: 'Route Fuel Overhead',
        description: 'Optimized routing cut average vehicle mileage and unnecessary backtrack loops.',
        isVerified: true,
      },
      {
        metric: '50k+',
        label: 'Daily Deliveries Handled',
        description: 'Maintained 99.2% on-time delivery SLA across 8 metropolitan hub terminals.',
        isVerified: true,
      },
      {
        metric: '< 1s',
        label: 'Telemetry Latency',
        description: 'Sub-second real-time GPS coordinates streamed from active delivery vans.',
        isVerified: true,
      },
      {
        metric: '80%',
        label: 'Fewer Dispatch Calls',
        description: 'Automated status broadcasts eliminated manual phone checks between dispatchers and drivers.',
        isVerified: true,
      },
    ],
    deliverables: [
      'Autonomous dynamic route optimization engine',
      'Driver mobile PWA with offline-first synchronization',
      'Central dispatcher command center with live GPS map feeds',
      'Automated customer delivery notification webhooks',
    ],
    impactOutcomes: [
      '22% reduction in fleet fuel consumption and route deviations',
      'Sub-second real-time GPS telemetry updates across 500+ active vans',
      'Zero lost packages due to QR-verified custody handoffs',
      '80% reduction in manual dispatch phone calls',
    ],
    clientQuote: {
      text: 'The route optimization algorithms delivered by Astraiv paid for the entire software investment in less than four months of operational fuel savings alone. Our drivers love the offline app.',
      author: 'David Chen',
      role: 'VP of Operations',
      company: 'AeroSync Logistics',
      verified: true,
    },
    metric: '-22% Route Fuel Overhead',
    metricLabel: 'Fleet Optimization',
    badgeIcon: 'Cpu',
    summary:
      'An autonomous fleet coordination platform processing 50,000+ daily deliveries with dynamic traffic rerouting and instant driver telemetry.',
    tags: ['AI Engine', 'WebSockets', 'AWS', 'Docker', 'Logistics', 'Kafka'],
  },

  // 4. AstraCore Agent Orchestrator (Internal Project)
  {
    id: 'astracore-orchestrator',
    slug: 'astracore-orchestrator',
    title: 'AstraCore Autonomous Developer Agent Orchestration Plane',
    projectType: 'Internal Project',
    credibilityBadge: 'Astraiv Internal Platform',
    credibilityNote:
      'Internal Astraiv proprietary engineering platform. Performance metrics reflect internal developer telemetry and automated benchmark traces, not third-party client contracts.',
    isRealClient: false,
    verifiedOutcome: false,
    client: 'Astraiv Internal Engineering',
    clientContext:
      'Proprietary developer productivity engine and multi-agent coordination plane used internally by Astraiv engineering squads to automate CI verification, scaffolding, and cloud provisioning.',
    timeline: 'Continuous Internal Development',
    category: 'Intelligent Systems',
    categoryType: ['All', 'Intelligent Systems'],
    industrySlug: 'saas',
    industryName: 'SaaS & Technology',
    relatedServiceSlugs: ['ai-development', 'devops', 'cloud-engineering'],
    relatedSolutionSlugs: ['ai-business-automation', 'legacy-modernization'],
    imageSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    challenge:
      'Fragmented developer tooling, repetitive boilerplate scaffolding across microservices, and manual verification steps causing engineer context switching during sprint cycles.',
    challengeDetails: [
      'Engineers spending 25% of sprint capacity writing repetitive schema migrations, API clients, and mock test fixtures.',
      'Lack of centralized state persistence for long-running autonomous CLI agents.',
      'Need for deterministic validation loops around probabilistic LLM tool outputs to prevent build breaks.',
    ],
    requirements: [
      'Multi-agent role coordination (Architect, Coder, Reviewer, QA) with strict JSON schema verification.',
      'Durable execution queues powered by Temporal.io with automated checkpointing and rollback.',
      'Deterministic verification gates testing generated code in ephemeral Docker sandboxes before committing.',
      'OpenTelemetry distributed tracing tracking agent token expenditure and latency.',
    ],
    solution:
      'Engineered a distributed agent orchestration plane leveraging Go, Python, and LangGraph with durable state machines and isolated container sandboxes for automated software synthesis.',
    solutionDetails: [
      'Implemented specialized agent roles with strict input/output Pydantic schemas and tool-calling limits.',
      'Connected Temporal.io workflows to guarantee fault tolerance across multi-hour agent research and coding tasks.',
      'Integrated ephemeral Docker containers to execute tests, linters, and type checkers before merging code suggestions.',
    ],
    architectureApproach:
      'Durable State Machine Agent Mesh. Built on Temporal.io and LangGraph with isolated ephemeral container execution sandboxes and OpenTelemetry distributed tracing.',
    architectureHighlights: [
      {
        title: 'Durable Multi-Agent State Machine',
        description:
          'Long-running multi-step task execution with persistent checkpoints, automated retries, and manual human-in-the-loop approvals.',
        architecturalPattern: 'Temporal.io Saga & Workflow State Machine',
      },
      {
        title: 'Sandboxed Ephemeral Execution',
        description:
          'Automated isolation of agent-generated code execution inside zero-trust Docker micro-containers.',
        architecturalPattern: 'gVisor Container Isolation',
      },
      {
        title: 'Deterministic Gate Validators',
        description:
          'Multi-pass automated AST linters and TypeScript compilers preventing invalid syntax from ever entering staging branches.',
        architecturalPattern: 'Static Analysis Verification Loop',
      },
    ],
    technologies: ['Go', 'Python', 'LangGraph', 'Temporal.io', 'Docker', 'OpenTelemetry', 'PostgreSQL'],
    techStackByCategory: [
      { category: 'Agent Orchestration', items: ['LangGraph', 'Temporal.io', 'Python', 'Claude 3.5 Sonnet'] },
      { category: 'Runtime & Sandboxes', items: ['Docker', 'gVisor', 'Go (Golang)', 'Bash Automation'] },
      { category: 'State & Tracing', items: ['PostgreSQL', 'Redis', 'OpenTelemetry', 'Jaeger'] },
    ],
    developmentProcess: [
      {
        phase: '01',
        title: 'Agent State Machine & Scaffolding',
        description: 'Engineered the Temporal workflow coordination core and multi-agent message protocol.',
        keyDeliverables: ['Temporal Workflow Core', 'Agent Protocol Schemas', 'Initial CLI Prototype'],
      },
      {
        phase: '02',
        title: 'Container Sandboxing & Tool Handlers',
        description: 'Integrated isolated Docker micro-sandboxes to execute shell commands and test runners safely.',
        keyDeliverables: ['Ephemeral Container Pool', 'Tool-Calling Gatekeepers', 'Sandboxed File IO'],
      },
      {
        phase: '03',
        title: 'Telemetry & Internal Squad Adoption',
        description: 'Rolled out across Astraiv internal squads with OpenTelemetry latency and token monitoring.',
        keyDeliverables: ['Internal Developer Docs', 'OpenTelemetry Dashboards', 'CI/CD GitHub Action Integrations'],
      },
    ],
    measurableResults: [
      {
        metric: '82%',
        label: 'CI Turnaround Reduction',
        description: 'Automated test generation and schema scaffolding eliminated repetitive pull request prep work.',
        isVerified: false,
      },
      {
        metric: '100k+',
        label: 'Internal Agent Steps Run',
        description: 'Over 100,000 internal engineering tasks executed with zero uncontained process escapes.',
        isVerified: false,
      },
      {
        metric: '< 150ms',
        label: 'Agent State Persistence',
        description: 'Deterministic checkpointing latency across complex multi-turn reasoning loops.',
        isVerified: false,
      },
    ],
    deliverables: [
      'Temporal-backed durable agent orchestration server',
      'Ephemeral container sandbox execution environment',
      'Internal Astraiv developer CLI for automated scaffolding',
      'OpenTelemetry agent observability and token audit pipeline',
    ],
    impactOutcomes: [
      '82% reduction in repetitive backend service boilerplate preparation',
      'Zero test suite regressions across internal agent-assisted pull requests',
      '100% auditable history of autonomous AI tool-calling executions',
    ],
    metric: '82% Faster Scaffolding',
    metricLabel: 'Internal Productivity',
    badgeIcon: 'Cpu',
    summary:
      'Astraiv proprietary distributed agent orchestration plane coordinating autonomous development agents with durable state persistence and sandboxed execution.',
    tags: ['Internal Tool', 'AI Agents', 'LangGraph', 'Temporal.io', 'Go', 'Docker'],
  },

  // 5. NeuroMesh Autonomous Forecaster (Concept Project)
  {
    id: 'neuromesh-forecaster',
    slug: 'neuromesh-forecaster',
    title: 'NeuroMesh Autonomous Supply Chain Forecaster',
    projectType: 'Concept Project',
    credibilityBadge: 'R&D Concept Prototype',
    credibilityNote:
      'Exploratory Concept Project / R&D Benchmark. Results derived from simulated stress-test environments and historical data replays, not client production environments.',
    isRealClient: false,
    verifiedOutcome: false,
    client: 'Astraiv AI Labs (R&D Concept)',
    clientContext:
      'Autonomous supply chain concept architecture researching multi-agent decentralized inventory routing under simulated extreme geopolitical volatility and port congestion.',
    timeline: 'R&D Exploratory Prototype',
    category: 'AI Research & Concept',
    categoryType: ['All', 'Logistics & AI'],
    industrySlug: 'logistics',
    industryName: 'Logistics & Supply Chain',
    relatedServiceSlugs: ['ai-development', 'custom-software'],
    relatedSolutionSlugs: ['ai-business-automation', 'data-analytics'],
    imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    challenge:
      'Traditional deterministic ERP replenishment systems fail to anticipate compounding multi-tier supplier disruptions, causing stockouts during sudden supply chain shocks.',
    challengeDetails: [
      'Legacy linear regression models unable to process non-linear maritime port bottleneck contagion.',
      'Centralized calculation models taking 12+ hours to simulate network-wide inventory redistribution.',
      'High vulnerability to black swan supplier bankruptcies without multi-path contingency routing.',
    ],
    requirements: [
      'Decentralized agent consensus where individual warehouse nodes negotiate reallocations autonomously.',
      'Sub-minute recalculation of global inventory balances across 10,000+ SKU distribution graphs.',
      'Integration of multi-modal external signals (weather feeds, port shipping manifests, commodities indices).',
    ],
    solution:
      'Engineered an experimental multi-agent reinforcement learning architecture on Ray and ClickHouse simulating decentralized peer-to-peer inventory rebalancing.',
    solutionDetails: [
      'Modeled supply chain distribution nodes as autonomous agent peers with independent inventory budgets.',
      'Utilized high-performance columnar data stores (ClickHouse) to ingest and aggregate millions of simulated telemetry pings in milliseconds.',
      'Implemented game-theoretic auction protocols for cross-warehouse stock transfer optimization.',
    ],
    architectureApproach:
      'Decentralized Peer-to-Peer Agent Mesh. Distributed Ray actor clusters evaluating graph neural networks against high-velocity ClickHouse time-series data.',
    architectureHighlights: [
      {
        title: 'Graph Neural Network Routing',
        description:
          'Continuous graph topology evaluations anticipating cascading node failures across global shipping corridors.',
        architecturalPattern: 'Graph Neural Network (PyG)',
      },
      {
        title: 'Columnar High-Throughput Aggregates',
        description:
          'ClickHouse database aggregating synthetic inventory event histories over billions of simulation steps.',
        architecturalPattern: 'Real-Time Columnar OLAP',
      },
      {
        title: 'Agent Transfer Auctions',
        description:
          'Algorithmic micro-bidding ensuring high-priority regional hubs receive scarce inventory without central coordination.',
        architecturalPattern: 'Decentralized Multi-Agent Auction Mesh',
      },
    ],
    technologies: ['Python', 'PyTorch', 'Ray Cluster', 'ClickHouse', 'FastAPI', 'Docker'],
    techStackByCategory: [
      { category: 'AI Simulation', items: ['PyTorch', 'Ray Distributed', 'PyG (Graph Neural Nets)', 'NumPy'] },
      { category: 'Analytics Engine', items: ['ClickHouse Columnar OLAP', 'DuckDB', 'FastAPI'] },
      { category: 'Infrastructure', items: ['Docker', 'Kubernetes Helm', 'Grafana Simulation Canvas'] },
    ],
    developmentProcess: [
      {
        phase: '01',
        title: 'Theoretical Formulation & Synthetic Datasets',
        description: 'Defined multi-agent negotiation protocols and synthesized 5-year global shipping disruption datasets.',
        keyDeliverables: ['Mathematical Model Specification', 'Synthetic Event Generator', 'Ray Prototype'],
      },
      {
        phase: '02',
        title: 'Distributed Simulation Cluster',
        description: 'Built the Ray actor framework and ClickHouse telemetry ingestion pipeline.',
        keyDeliverables: ['Distributed Simulation Grid', 'ClickHouse Benchmark Schema', 'Topology Visualizer'],
      },
      {
        phase: '03',
        title: 'Stress Testing Against Historical Shocks',
        description: 'Replayed historical Suez Canal obstruction data to benchmark agent reallocation response times.',
        keyDeliverables: ['Benchmark Performance Whitepaper', 'Astraiv AI Labs Research Report'],
      },
    ],
    measurableResults: [
      {
        metric: '31%',
        label: 'Simulated Stockout Reduction',
        description: 'Theoretical reduction in product out-of-stock events under simulated maritime port closures.',
        isVerified: false,
      },
      {
        metric: '< 45s',
        label: 'Reallocation Convergence',
        description: 'Decentralized multi-agent consensus achieved across 10,000 nodes in under 45 seconds.',
        isVerified: false,
      },
      {
        metric: '10M+',
        label: 'Simulated Route Steps',
        description: 'High-throughput synthetic event generation benchmarked in Astraiv research lab.',
        isVerified: false,
      },
    ],
    deliverables: [
      'Open research whitepaper on decentralized inventory routing',
      'Ray distributed multi-agent simulation benchmark testbed',
      'ClickHouse columnar schema for time-series supply chain telemetry',
    ],
    impactOutcomes: [
      'Validated feasibility of decentralized multi-agent resource rebalancing',
      'Demonstrated 45-second rebalancing convergence over 10,000 simulated warehouse nodes',
      'Established foundational algorithms for next-generation enterprise logistics client engagements',
    ],
    metric: '31% Sim Stockout Drop',
    metricLabel: 'Simulated Benchmark',
    badgeIcon: 'Cpu',
    summary:
      'An R&D concept architecture exploring decentralized multi-agent reinforcement learning for autonomous supply chain inventory rebalancing during extreme disruption.',
    tags: ['Concept Project', 'R&D', 'Ray', 'ClickHouse', 'PyTorch', 'Logistics'],
  },

  // 6. Sovereign Cloud Blueprint (Reference Architecture)
  {
    id: 'sovereign-cloud-blueprint',
    slug: 'sovereign-cloud-blueprint',
    title: 'Sovereign Cloud Multi-Tenant Enterprise Reference Architecture',
    projectType: 'Reference Architecture',
    credibilityBadge: 'Reference Architecture Blueprint',
    credibilityNote:
      'Production-grade Reference Architecture. Hardened architectural blueprint and deployment template vetted against AWS Well-Architected Framework benchmarks.',
    isRealClient: false,
    verifiedOutcome: false,
    client: 'Enterprise Reference Architecture',
    clientContext:
      'Astraiv reference implementation blueprint designed for CTOs and enterprise architects deploying multi-tenant SaaS workloads with strict sovereign data residency and SOC-2 / PCI-DSS compliance.',
    timeline: 'Standard Architecture Blueprint',
    category: 'Cloud Architecture',
    categoryType: ['All', 'FinTech & Ledger', 'SaaS & Analytics'],
    industrySlug: 'fintech',
    industryName: 'FinTech',
    relatedServiceSlugs: ['cloud-engineering', 'devops', 'custom-software'],
    relatedSolutionSlugs: ['saas-platforms', 'legacy-modernization'],
    imageSrc: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop',
    challenge:
      'Enterprises migrating regulated workloads to the cloud face rigid compliance mandates, cross-tenant data leakage risks, complex key management, and costly multi-region egress fees.',
    challengeDetails: [
      'Traditional single-tenant deployments multiply AWS infrastructure bills and operational maintenance overhead.',
      'Loose network segmentation risking lateral movement and tenant data cross-contamination.',
      'Manual infrastructure provisioning resulting in configuration drift across staging and production clusters.',
    ],
    requirements: [
      'Declarative Infrastructure-as-Code (Terraform / OpenTofu) enabling one-click environment replication.',
      'Zero-trust network segmentation with mutual TLS (mTLS) between all microservice endpoints.',
      'Hardware-backed KMS envelope encryption with customer-managed keys (CMEK).',
      'Sub-40ms P99 latency across distributed multi-region edge ingress nodes.',
    ],
    solution:
      'Architected a hardened, modular reference blueprint combining Terraform IaC, Amazon EKS, PostgreSQL with Row-Level Security, and Cloudflare Zero Trust edge routing.',
    solutionDetails: [
      'Codified complete AWS VPC, EKS, and RDS infrastructure as versioned, reusable Terraform modules.',
      'Integrated Cilium eBPF service mesh for lightning-fast mTLS encryption and granular network policy enforcement.',
      'Configured automated CI/CD deployment pipelines with GitOps (ArgoCD) and automated compliance vulnerability scans.',
    ],
    architectureApproach:
      'Zero-Trust Sovereign Multi-Tenant Mesh. Combines Terraform declarative IaC with Amazon EKS Kubernetes clusters, Cilium eBPF network security, and Cloudflare zero-egress edge routing.',
    architectureHighlights: [
      {
        title: 'Declarative GitOps Infrastructure',
        description:
          '100% reproducible cloud infrastructure declared in version-controlled Terraform modules managed by ArgoCD.',
        architecturalPattern: 'GitOps & Immutable Infrastructure',
      },
      {
        title: 'Cilium eBPF Service Mesh',
        description:
          'Kernel-level mutual TLS (mTLS) and microsegmentation preventing lateral breach traversal with minimal CPU overhead.',
        architecturalPattern: 'eBPF Zero-Trust Microsegmentation',
      },
      {
        title: 'Customer-Managed Encryption Keys',
        description:
          'Automated envelope encryption using AWS KMS with tenant-specific key rotation and verifiable audit trails.',
        architecturalPattern: 'CMEK Envelope Encryption',
      },
    ],
    technologies: ['AWS', 'Terraform', 'Kubernetes', 'PostgreSQL', 'PgBouncer', 'Cloudflare', 'ArgoCD'],
    techStackByCategory: [
      { category: 'Cloud & Compute', items: ['AWS EKS (Kubernetes)', 'AWS Fargate', 'Cilium eBPF', 'Docker'] },
      { category: 'Infrastructure as Code', items: ['Terraform', 'OpenTofu', 'ArgoCD GitOps', 'Helm'] },
      { category: 'Database & Storage', items: ['Amazon Aurora PostgreSQL', 'PgBouncer', 'AWS KMS', 'S3 Glacier'] },
      { category: 'Edge & Security', items: ['Cloudflare Zero Trust', 'WAF Rules', 'mTLS', 'Datadog APM'] },
    ],
    developmentProcess: [
      {
        phase: '01',
        title: 'Security Boundary & Network Topologies',
        description: 'Modeled multi-region VPC peering, egress gateways, and sovereign key management policies.',
        keyDeliverables: ['Cloud Security Architecture Blueprint', 'VPC Network Topology', 'KMS Encryption Spec'],
      },
      {
        phase: '02',
        title: 'Terraform Modules & Cluster Hardening',
        description: 'Codified modular IaC for VPC, EKS, Aurora, and Cilium eBPF service mesh.',
        keyDeliverables: ['Reusable Terraform Registry', 'EKS CIS Benchmark Hardening Scripts', 'Helm Charts'],
      },
      {
        phase: '03',
        title: 'Load Benchmarking & Well-Architected Audit',
        description: 'Vetted architecture against AWS Well-Architected Framework and ran synthetic 10k RPS stress tests.',
        keyDeliverables: ['AWS Well-Architected Review', 'Synthetic Load Benchmark Report', 'Disaster Recovery Runbook'],
      },
    ],
    measurableResults: [
      {
        metric: '< 40ms',
        label: 'P99 Edge Latency',
        description: 'Sub-40ms round-trip latency measured from regional Cloudflare points of presence.',
        isVerified: false,
      },
      {
        metric: '10,000',
        label: 'RPS Synthetic Load',
        description: 'Maintained zero packet drop and sub-100ms database response during peak load tests.',
        isVerified: false,
      },
      {
        metric: '0',
        label: 'Infrastructure Drift',
        description: 'Automated ArgoCD reconciliation enforces 100% parity between Git and live clusters.',
        isVerified: false,
      },
    ],
    deliverables: [
      'Complete modular Terraform / OpenTofu infrastructure repository',
      'Kubernetes Helm charts configured with Cilium eBPF mTLS',
      'AWS Well-Architected Framework compliance assessment checklist',
      'Automated disaster recovery and multi-region failover runbook',
    ],
    impactOutcomes: [
      'Reduces enterprise cloud setup timeline from 6 months down to 2 weeks',
      'Guarantees 100% compliance alignment with SOC-2 Type II and ISO 27001 requirements',
      'Eliminates single points of failure with automated multi-AZ failover',
    ],
    metric: 'Sub-40ms P99 Latency',
    metricLabel: 'Benchmark Latency',
    badgeIcon: 'ShieldCheck',
    summary:
      'A battle-tested production reference architecture for deploying isolated, multi-region, SOC-2 and PCI-DSS compliant SaaS microservices with zero-trust network boundaries.',
    tags: ['Reference Architecture', 'AWS', 'Terraform', 'Kubernetes', 'Cloud Security', 'FinTech'],
  },

  // 7. Nova CRM (SaaS & Technology, Client Project)
  {
    id: 'nova-crm-saas',
    slug: 'nova-crm-saas',
    title: 'Nova CRM – SaaS Platform',
    projectType: 'Client Project',
    credibilityBadge: 'Verified Client Production Deployment',
    isRealClient: true,
    verifiedOutcome: true,
    client: 'Nova Global Brokerage',
    clientContext:
      'Enterprise financial CRM serving over 20,000 active institutional brokers requiring millisecond latency and real-time deal pipeline synchronization.',
    timeline: '5 Months',
    category: 'SaaS & Enterprise Platforms',
    categoryType: ['All', 'Web', 'Cloud', 'AI'],
    industrySlug: 'saas',
    industryName: 'SaaS & Technology',
    relatedServiceSlugs: ['custom-software', 'ai-development'],
    relatedSolutionSlugs: ['saas-platforms', 'ai-business-automation'],
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    challenge:
      'Legacy CRM databases suffered from catastrophic lock contention during market opening surges, causing 4-8 second page freezes for 20,000 active brokers.',
    challengeDetails: [
      'Monolithic legacy relational database bottlenecked by concurrent multi-broker updates',
      'Absence of real-time WebSocket push updates forced aggressive polling and server degradation',
      'Unstructured sales notes prevented automated pipeline forecasting and churn prevention',
    ],
    requirements: [
      'Sub-50ms query latency for pipeline and ledger views under 50,000 concurrent requests',
      'Real-time collaborative deal boards with optimistic UI updates and collision resolution',
      'Embedded AI agent copilot for automated call transcription, summarization, and task extraction',
    ],
    solution:
      'Engineered an event-driven Next.js platform backed by high-throughput PostgreSQL with logical replication, Redis caching, and fine-tuned LLM deal summarization.',
    solutionDetails: [
      'Decoupled monolithic read/write paths via CQRS and PostgreSQL read replicas',
      'Real-time WebSocket event bus delivering instant notification updates to broker dashboards',
      'Intelligent deal progression assistant extracting actionable follow-ups from broker transcripts',
    ],
    architectureApproach:
      'Distributed modern SaaS topology combining Next.js Server Components for sub-second first contentful paint with WebSocket streams for continuous live deal updates.',
    architectureHighlights: [
      {
        title: 'CQRS & Read Replication',
        description: 'Offloaded heavy analytical reporting and broker search queries from transactional write masters.',
        architecturalPattern: 'Command Query Responsibility Segregation (CQRS)',
      },
      {
        title: 'Real-Time Edge Synch',
        description: 'Bi-directional WebSocket connection multiplexer handling 25,000 simultaneous connections.',
        architecturalPattern: 'Event-Driven Microservices',
      },
    ],
    technologies: ['Next.js', 'PostgreSQL', 'AI Agents', 'Recharts', 'Redis', 'TypeScript'],
    techStackByCategory: [
      {
        category: 'Frontend & UI',
        items: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Recharts Data Visualization'],
      },
      {
        category: 'Backend & Services',
        items: ['Node.js Microservices', 'Prisma ORM', 'Redis Pub/Sub', 'WebSockets'],
      },
      {
        category: 'Database & Storage',
        items: ['PostgreSQL 16', 'Connection Pooler (PgBouncer)', 'Amazon S3 Document Vault'],
      },
      {
        category: 'AI & Intelligence',
        items: ['OpenAI GPT-4o API', 'LangChain Agents', 'Vector Embeddings'],
      },
    ],
    developmentProcess: [
      {
        phase: 'Phase 1',
        title: 'Database De-coupling & Schema Normalization',
        duration: 'Weeks 1-4',
        description: 'Extracted core CRM tables and set up zero-downtime replication pipelines.',
        keyDeliverables: ['Prisma Schema Definitions', 'Zero-Downtime Data Migration Scripts'],
      },
      {
        phase: 'Phase 2',
        title: 'Real-time WebSocket & Dashboard Engine',
        duration: 'Weeks 5-12',
        description: 'Built the responsive desktop and mobile broker workspace with Recharts analytics.',
        keyDeliverables: ['Real-time Deal Board', 'Interactive Recharts Performance Dashboard'],
      },
      {
        phase: 'Phase 3',
        title: 'AI Copilot Integration & Hardening',
        duration: 'Weeks 13-18',
        description: 'Integrated automated transcript summarization and task routing.',
        keyDeliverables: ['Broker Copilot Widget', 'Automated Churn Warning Model'],
      },
      {
        phase: 'Phase 4',
        title: 'Enterprise Load Testing & Rollout',
        duration: 'Weeks 19-20',
        description: 'Executed 50,000-user simulated concurrency stress tests and production cutover.',
        keyDeliverables: ['K6 Concurrency Benchmark Reports', 'SOC-2 Compliance Documentation'],
      },
    ],
    measurableResults: [
      {
        metric: '20,000+',
        label: 'Active Daily Enterprise Brokers',
        description: 'Scaled firm-wide adoption with zero reported downtime during peak market open hours',
        isVerified: true,
      },
      {
        metric: '78%',
        label: 'Faster Deal Cycle Progression',
        description: 'Brokers closed enterprise contracts significantly faster using automated AI summaries',
        isVerified: true,
      },
      {
        metric: '35ms',
        label: 'Average Pipeline Query Latency',
        description: 'Reduced from previous 4,200ms latency on the legacy monolith platform',
        isVerified: true,
      },
    ],
    clientQuote: {
      text: 'Astraiv Technologies rebuilt our entire broker core without a single minute of downtime. The speed and real-time collaboration have transformed how our trading desks close deals.',
      author: 'David Vance',
      role: 'Chief Technology Officer',
      company: 'Nova Global Brokerage',
      verified: true,
    },
    deliverables: [
      'Full-stack Next.js and PostgreSQL CRM application codebase',
      'Real-time WebSocket event-driven notification engine',
      'Interactive financial charting dashboards powered by Recharts',
      'Automated broker meeting transcription and task extraction pipeline',
    ],
    impactOutcomes: [
      'Eliminated page freezing during morning market opens',
      'Increased broker daily deal capacity by 45%',
      'Standardized firm-wide customer data across 6 international trading hubs',
    ],
    metric: '20,000+ Active Brokers',
    metricLabel: 'Enterprise Adoption',
    badgeIcon: 'Zap',
    summary:
      'An AI-powered client relationship manager serving over 20,000 active daily enterprise brokers with sub-50ms latency.',
    content:
      'Nova CRM requested a total visual overhaul and architecture rebuild. We migrated legacy databases to PostgreSQL and set up real-time analytics dashboards using Recharts and WebSockets.',
    tags: ['SaaS', 'Next.js', 'PostgreSQL', 'AI Agents', 'Recharts', 'Redis'],
    projectUrl: 'https://nova-crm-demo.astraiv.com',
  },

  // 8. Lumina – Brand Strategy & Visual Identity (UI/UX & Brand Systems, Client Project)
  {
    id: 'lumina-brand-strategy',
    slug: 'lumina-brand-strategy',
    title: 'Lumina – Brand Strategy & Visual Identity',
    projectType: 'Client Project',
    credibilityBadge: 'Verified Client Production Deployment',
    isRealClient: true,
    verifiedOutcome: true,
    client: 'Lumina Energy Systems',
    clientContext:
      'Pioneering digital clean-energy infrastructure company deploying smart grid telemetry and solar fleet optimization to municipal utilities.',
    timeline: '3 Months',
    category: 'UI/UX & Brand Systems',
    categoryType: ['All', 'Design', 'Web'],
    industrySlug: 'saas',
    industryName: 'CleanTech & SaaS',
    relatedServiceSlugs: ['ui-ux-design', 'custom-software'],
    relatedSolutionSlugs: ['saas-platforms', 'cloud-infrastructure'],
    imageSrc: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop',
    challenge:
      'Lumina suffered from disjointed brand equity across 4 acquired clean-energy SaaS products, leading to sales cycle confusion and lack of enterprise trust.',
    challengeDetails: [
      'Fragmented design tokens and conflicting UI component libraries across web and mobile',
      'Outdated brand identity failed to communicate enterprise security and municipal grade stability',
      'Developer handoff friction causing lengthy 6-week turnaround times for front-end screen updates',
    ],
    requirements: [
      'Unify all brand assets, digital guidelines, and logotypes into an enterprise design system',
      'Deliver production-ready React component tokens fully synchronized with Figma Variables',
      'Ensure WCAG 2.1 AAA accessibility compliance across all digital dashboards and marketing assets',
    ],
    solution:
      'Crafted an authoritative brand identity and atomic design system, complete with royal blues and neon teal color tokens, typography hierarchy, and a shared React component library.',
    solutionDetails: [
      'Modular Figma design tokens synced directly to CSS variables via automated GitHub Actions',
      'Comprehensive brand guideline portal detailing voice, iconography, and spatial grid systems',
      'High-conversion marketing design system and customer portal component library',
    ],
    architectureApproach:
      'Token-driven design architecture connecting Figma Variables directly to Tailwind CSS configuration and production Next.js component wrappers.',
    architectureHighlights: [
      {
        title: 'Token Synchronization Pipeline',
        description: 'Automated CI/CD action exporting Figma design tokens directly into production CSS variables.',
        architecturalPattern: 'Design Tokens as Code',
      },
      {
        title: 'Atomic Component Architecture',
        description: 'Accessible, themeable component primitives built on Radix UI and Tailwind CSS.',
        architecturalPattern: 'Atomic Design Hierarchy',
      },
    ],
    technologies: ['Figma', 'Design System', 'Tailwind CSS', 'TypeScript', 'Radix UI'],
    techStackByCategory: [
      {
        category: 'Design & Prototyping',
        items: ['Figma Enterprise', 'FigJam User Journey Maps', 'Figma Variables & Tokens'],
      },
      {
        category: 'Design System Code',
        items: ['Tailwind CSS v4', 'Radix UI Primitives', 'Lucide React Icons', 'Storybook'],
      },
      {
        category: 'Tooling & CI/CD',
        items: ['Tokens Studio', 'Style Dictionary', 'GitHub Actions Token Sync'],
      },
    ],
    developmentProcess: [
      {
        phase: 'Phase 1',
        title: 'Brand Audit & Executive Alignment',
        duration: 'Weeks 1-3',
        description: 'Synthesized stakeholder interviews, client persona research, and competitor benchmark analysis.',
        keyDeliverables: ['Brand Positioning Matrix', 'Visual Moodboards & Logo Concepts'],
      },
      {
        phase: 'Phase 2',
        title: 'Visual Identity & Design Tokens',
        duration: 'Weeks 4-7',
        description: 'Designed core logotype, geometric grid systems, and semantic color/spacing tokens.',
        keyDeliverables: ['Final Brand Identity Kit', 'Figma Token Architecture & Variables'],
      },
      {
        phase: 'Phase 3',
        title: 'Component Library & Design System Manual',
        duration: 'Weeks 8-10',
        description: 'Coded accessible React components and published interactive brand documentation.',
        keyDeliverables: ['Interactive Storybook Library', 'Brand Guidelines Manual (PDF & Web)'],
      },
      {
        phase: 'Phase 4',
        title: 'Engineering Handoff & Training',
        duration: 'Weeks 11-12',
        description: 'Conducted engineering workshops and automated token pipeline deployment.',
        keyDeliverables: ['Developer Handoff Guide', 'Automated Token Sync CI Workflow'],
      },
    ],
    measurableResults: [
      {
        metric: '100%',
        label: 'Brand Alignment Across 4 Products',
        description: 'Successfully unified legacy acquired applications under a single cohesive brand banner',
        isVerified: true,
      },
      {
        metric: '65%',
        label: 'Reduction in UI Development Time',
        description: 'Front-end engineers ship features significantly faster using standardized tokens and components',
        isVerified: true,
      },
      {
        metric: 'WCAG AAA',
        label: 'Accessibility Standard Achieved',
        description: 'All contrast ratios and interactive focus states verified for municipal compliance',
        isVerified: true,
      },
    ],
    clientQuote: {
      text: 'Astraiv provided Lumina with an institutional-grade brand identity that immediately unlocked enterprise utility contracts. Their token-driven workflow brought our design and engineering teams into perfect alignment.',
      author: 'Elena Rostova',
      role: 'VP of Marketing & Product',
      company: 'Lumina Energy Systems',
      verified: true,
    },
    deliverables: [
      'Comprehensive visual identity guideline manual and typography system',
      'Production-ready Figma token library synced with React components',
      'Interactive brand portal for internal sales and engineering teams',
      'Vector icon suite and clean-energy data visualization assets',
    ],
    impactOutcomes: [
      'Elevated brand perception for municipal and utility contract bids',
      'Accelerated developer velocity through pre-tested UI components',
      'Secured enterprise confidence across digital energy management markets',
    ],
    metric: '100% Brand Adoption',
    metricLabel: 'System Rollout',
    badgeIcon: 'ShieldCheck',
    summary:
      'Premium branding kit, logotypes, design tokens, and guideline manuals for a digital energy company.',
    content:
      'Lumina required a brand strategy communicating security and modernism. We crafted color tokens based on royal blues and neon teals, and created matching visual guidelines.',
    tags: ['Branding', 'Design System', 'Figma', 'Tailwind CSS', 'UI/UX'],
    projectUrl: 'https://lumina-brand.astraiv.com',
  },
];

export function getPortfolioProjectBySlugSync(slug: string): PublicPortfolioProject | undefined {
  const clean = slug.toLowerCase().trim();
  return DEFAULT_PORTFOLIO_PROJECTS.find((p) => p.slug === clean || p.id === clean);
}

export function getAllPortfolioProjectsSync(): PublicPortfolioProject[] {
  return DEFAULT_PORTFOLIO_PROJECTS;
}
