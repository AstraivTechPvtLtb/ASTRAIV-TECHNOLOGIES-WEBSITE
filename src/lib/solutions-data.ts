export interface BusinessProblem {
  title: string;
  summary: string;
  painPoints: string[];
}

export interface AstraivApproach {
  title: string;
  summary: string;
  methodologySteps: {
    step: string;
    title: string;
    description: string;
  }[];
}

export interface SolutionDetail {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  tagline: string;
  shortDesc: string;
  fullDesc: string;
  metric: {
    value: string;
    label: string;
  };
  features: string[];
  technologies: string[];
  capabilities: {
    title: string;
    description: string;
  }[];
  businessProblem: BusinessProblem;
  astraivApproach: AstraivApproach;
}

export const SOLUTIONS_LIST: SolutionDetail[] = [
  // 1. AI & Business Automation
  {
    slug: 'ai-business-automation',
    category: 'intelligent-systems',
    categoryLabel: 'Intelligent Systems',
    title: 'AI & Business Automation',
    tagline: 'Autonomous decision pipelines & goal-driven multi-agent swarms.',
    shortDesc:
      'We engineer self-orchestrating agent workflows that plan, execute, and verify multi-step tasks across external APIs, customer channels, and enterprise data backbones without human bottlenecks.',
    fullDesc:
      'Our autonomous agent architectures deploy deterministic verification loops around probabilistic LLMs. We build multi-agent swarms equipped with tool-calling capabilities, state persistence, and audit logging to safely automate high-stakes enterprise operations.',
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
    capabilities: [
      {
        title: 'Cognitive Task Routing',
        description: 'Dynamically routes enterprise tickets and queries to specialized domain agent models.',
      },
      {
        title: 'Deterministic Verification',
        description: 'Multi-pass validation gates ensure outputs adhere to business rules before execution.',
      },
      {
        title: 'Enterprise Tool Use',
        description: 'Direct integration with ERPs, CRMs, databases, and banking settlement rails.',
      },
    ],
    businessProblem: {
      title: 'Manual Bottlenecks & Operational Latency',
      summary:
        'Growing organizations lose thousands of high-value hours each month to manual document processing, repetitive cross-system triage, and slow human response cycles that throttle scale.',
      painPoints: [
        'Excessive staffing overhead dedicated to data transcription and routine support triage.',
        'High error rates from manual data entry across disconnected enterprise systems.',
        'Customer churn driven by multi-hour response delays on routine operational requests.',
        'Inability to scale transaction volumes without linearly hiring operational staff.',
      ],
    },
    astraivApproach: {
      title: 'Deterministic Multi-Agent Orchestration',
      summary:
        'We replace fragile human handoffs with robust, deterministic multi-agent architectures that reason, plan, and verify execution against strict business rules.',
      methodologySteps: [
        {
          step: '01',
          title: 'Workflow Telemetry Audit',
          description: 'Map existing human decision paths, data inputs, API boundaries, and safety edge-cases.',
        },
        {
          step: '02',
          title: 'Agent Role & Schema Design',
          description: 'Construct specialized agent roles with strict input/output Pydantic schemas and tool-calling limits.',
        },
        {
          step: '03',
          title: 'Deterministic Verification Gates',
          description: 'Implement multi-pass automated validators and human-in-the-loop escalation rules for high-risk actions.',
        },
        {
          step: '04',
          title: 'Production Telemetry & Self-Healing',
          description: 'Continuous OpenTelemetry tracing, automated retry queues, and hallucination monitoring.',
        },
      ],
    },
  },

  // 2. RAG / Enterprise Knowledge Systems
  {
    slug: 'rag-knowledge',
    category: 'intelligent-systems',
    categoryLabel: 'Intelligent Systems',
    title: 'RAG / Enterprise Knowledge Systems',
    tagline: 'Enterprise search across complex multi-format document lakes.',
    shortDesc:
      'Turn vast unstructured corporate repositories into high-precision, sub-second queryable neural knowledge systems with real-time vector embeddings and zero hallucination boundaries.',
    fullDesc:
      'Enterprise documents live across disparate formats, silos, and access permissions. Our Retrieval-Augmented Generation architectures index multi-gigabyte document corpora into high-dimensional vector spaces with hybrid BM25 and neural reranking for zero-hallucination accuracy.',
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
    capabilities: [
      {
        title: 'Hybrid Keyword & Vector Search',
        description: 'Blends BM25 exact matching with dense vector semantics for comprehensive retrieval.',
      },
      {
        title: 'Chunk Freshness Pipelines',
        description: 'Continuous webhooks automatically re-embed documents when updated in cloud stores.',
      },
      {
        title: 'Access Control Boundary',
        description: 'Enforces strict tenant and department access tokens during retrieval execution.',
      },
    ],
    businessProblem: {
      title: 'Trapped Knowledge & Costly Information Silos',
      summary:
        'Critical institutional knowledge is fragmented across millions of PDFs, contracts, emails, and database rows, forcing knowledge workers to spend 20%+ of their day hunting information.',
      painPoints: [
        'Decision paralysis and slow deal execution due to inaccessible contractual terms.',
        'High compliance risks from relying on outdated policies or conflicting documentation.',
        'Generic public AI models hallucinating false information and exposing private corporate IP.',
        'Lack of role-based document access controls in off-the-shelf semantic search tools.',
      ],
    },
    astraivApproach: {
      title: 'High-Precision Zero-Hallucination RAG Architecture',
      summary:
        'We construct enterprise neural knowledge lakes that combine dense vector embeddings with deterministic keyword rerankers, guaranteeing exact source citations and strict access control.',
      methodologySteps: [
        {
          step: '01',
          title: 'Document Lake Ingestion',
          description: 'Extract, clean, and chunk multi-format files with layout-aware OCR parsers.',
        },
        {
          step: '02',
          title: 'Hybrid Indexing & Metadata Tagging',
          description: 'Generate high-dimensional vector embeddings paired with BM25 inverted keyword indices.',
        },
        {
          step: '03',
          title: 'Reranking & Citation Guardrails',
          description: 'Deploy Cohere rerankers and strict prompt grounding to eliminate hallucinations.',
        },
        {
          step: '04',
          title: 'Real-Time Webhook Freshness Sync',
          description: 'Automated delta pipelines that re-embed documents upon update in enterprise storage.',
        },
      ],
    },
  },

  // 3. SaaS Platforms
  {
    slug: 'saas-platforms',
    category: 'digital-products',
    categoryLabel: 'Digital Products',
    title: 'SaaS Platforms',
    tagline: 'Enterprise recurring revenue engines & customer portals.',
    shortDesc:
      'We build market-ready multi-tenant software-as-a-service platforms engineered for scale, global compliance, automated subscription lifecycles, and rapid tenant onboarding.',
    fullDesc:
      'Launch recurring revenue products on rock-solid architectural foundations. From schema-isolated multi-tenancy and automated Stripe billing to compliance logging, our platforms are engineered for extreme scalability.',
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
    capabilities: [
      {
        title: 'Tenant Isolation Architecture',
        description: 'Schema or database-level isolation guaranteeing zero cross-tenant data leakage.',
      },
      {
        title: 'Subscription Lifecycle Automation',
        description: 'Proration, tier upgrades, credit balances, and automated invoice reconciliation.',
      },
      {
        title: 'Custom Domain Provisioning',
        description: 'Automated SSL termination and edge routing for enterprise white-labeling.',
      },
    ],
    businessProblem: {
      title: 'Architecture Debt & Scaling Friction in Multi-Tenancy',
      summary:
        'Building a commercial B2B SaaS platform requires solving complex non-functional requirements—multi-tenant data isolation, proration billing, RBAC, and global performance—that delay product launch.',
      painPoints: [
        'Security vulnerabilities from poor tenant isolation risking enterprise data leakage.',
        'Revenue leakage caused by complex billing edge-cases, failed webhooks, and manual invoicing.',
        'High churn rates due to slow dashboard hydration times across distributed international users.',
        'Engineering bandwidth consumed by custom domain provisioning and client administration.',
      ],
    },
    astraivApproach: {
      title: 'Production-Grade Multi-Tenant SaaS Blueprint',
      summary:
        'We deliver scalable, turn-key SaaS foundations powered by PostgreSQL Row-Level Security, automated billing pipelines, and edge-rendered Next.js performance.',
      methodologySteps: [
        {
          step: '01',
          title: 'Tenant Isolation & RBAC Modeling',
          description: 'Design robust multi-tenant data boundaries with PostgreSQL Row-Level Security.',
        },
        {
          step: '02',
          title: 'Subscription & Monetization Rails',
          description: 'Implement automated billing webhooks, seat-based tiers, and usage-based metering.',
        },
        {
          step: '03',
          title: 'Edge-Hydrated Experience',
          description: 'Leverage Next.js App Router streaming SSR for sub-second dashboard rendering globally.',
        },
        {
          step: '04',
          title: 'Enterprise Compliance & SSO',
          description: 'Integrate SAML 2.0 / Okta authentication, audit logging, and automated backup routines.',
        },
      ],
    },
  },

  // 4. Data & Analytics Platforms
  {
    slug: 'data-analytics',
    category: 'intelligent-systems',
    categoryLabel: 'Intelligent Systems',
    title: 'Data & Analytics Platforms',
    tagline: 'Real-time metrics, telemetry & executive predictive dashboards.',
    shortDesc:
      'Consolidate high-velocity transactional and event streams into lightning-fast analytical engines. Deliver executive dashboards, operational alerting, and predictive forecasts at scale.',
    fullDesc:
      'Modern businesses produce billions of event data points. We construct real-time streaming pipelines, columnar analytical warehouses, and sub-50ms query interfaces that turn operational telemetry into executive foresight.',
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
    capabilities: [
      {
        title: 'Sub-second Columnar Aggregation',
        description: 'Processes analytical grouping and time-series rollups over petabytes of telemetry.',
      },
      {
        title: 'Predictive Forecaster Engines',
        description: 'Statistical and machine-learning models predicting inventory and customer churn.',
      },
      {
        title: 'Multi-Tenant Partitioning',
        description: 'Guarantees enterprise tenant data isolation with encrypted columnar storage.',
      },
    ],
    businessProblem: {
      title: 'Analytical Query Timeouts & Delayed Decision Telemetry',
      summary:
        'Standard relational databases fail under heavy analytical workloads. Leaders are forced to make multimillion-dollar decisions on 48-hour-old reports because real-time queries crash production databases.',
      painPoints: [
        'Production databases slowing to a crawl when executives run heavy analytical reporting queries.',
        'Delayed visibility into customer behavior, inventory burn rates, and financial margins.',
        'Inability to ingest high-frequency IoT or event streams without dropping data packets.',
        'High third-party BI SaaS costs that scale aggressively with row counts and user seats.',
      ],
    },
    astraivApproach: {
      title: 'Decoupled Columnar Ingestion & Sub-50ms Analytics',
      summary:
        'We decouple transactional operations from analytical telemetry by deploying columnar engines (ClickHouse/DuckDB) fed by real-time Kafka event streams.',
      methodologySteps: [
        {
          step: '01',
          title: 'Event Streaming Architecture',
          description: 'Establish high-throughput Kafka / EventBridge messaging pipelines with zero message loss.',
        },
        {
          step: '02',
          title: 'Columnar Warehouse Provisioning',
          description: 'Architect ClickHouse / DuckDB schemas optimized for high-speed time-series rollups.',
        },
        {
          step: '03',
          title: 'Sub-second Dashboard API Gateways',
          description: 'Deploy cached analytical query endpoints that deliver sub-50ms responses to executive UIs.',
        },
        {
          step: '04',
          title: 'Automated Anomaly Detection',
          description: 'Implement real-time statistical monitors that trigger alerts when metrics deviate from thresholds.',
        },
      ],
    },
  },

  // 5. Business Process Automation
  {
    slug: 'business-process-automation',
    category: 'digital-products',
    categoryLabel: 'Digital Products',
    title: 'Business Process Automation',
    tagline: 'End-to-end integration workflows eliminating manual labor.',
    shortDesc:
      'Automate your core back-office functions, CRM synchronization, invoicing cycles, and partner communications with bulletproof, fault-tolerant orchestration workflows.',
    fullDesc:
      'Manual data transfer between systems wastes thousands of engineering and operational hours. Our orchestration engines automate complex asynchronous business pipelines with exponential backoff and zero dropped states.',
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
    capabilities: [
      {
        title: 'Fault-Tolerant Queueing',
        description: 'Persistent background job processing with guaranteed at-least-once execution.',
      },
      {
        title: 'Webhook Fan-out & Normalization',
        description: 'Transform disparate third-party event structures into typed enterprise models.',
      },
      {
        title: 'Automated Recovery & Alerting',
        description: 'Intelligent error classification with automatic exponential retry schedules.',
      },
    ],
    businessProblem: {
      title: 'Fragmented Silos & Operational Friction',
      summary:
        'Back-office teams waste countless hours copying data between CRM, ERP, accounting, and communication tools. A single missing sync creates customer discrepancies and delayed revenue.',
      painPoints: [
        'Disjointed data across Salesforce, HubSpot, Stripe, and internal PostgreSQL databases.',
        'Delayed invoice reconciliation and error-prone manual financial data entry.',
        'Manual order fulfillment and support escalation causing SLA breaches.',
        'Brittle no-code tools breaking silently on payload changes without error monitoring.',
      ],
    },
    astraivApproach: {
      title: 'Resilient Event-Driven Workflow Orchestration',
      summary:
        'We build durable, code-driven integration backbones using Temporal and Redis queues with guaranteed at-least-once delivery, exponential retries, and comprehensive audit logs.',
      methodologySteps: [
        {
          step: '01',
          title: 'System Boundary Audit',
          description: 'Document all third-party webhook payloads, API rate limits, and state transitions.',
        },
        {
          step: '02',
          title: 'Durable Queue Infrastructure',
          description: 'Configure BullMQ / Temporal clusters with persistent storage and dead-letter queues.',
        },
        {
          step: '03',
          title: 'Typed Data Normalization',
          description: 'Construct TypeScript / Zod validation pipelines that ensure data integrity before persistence.',
        },
        {
          step: '04',
          title: 'Continuous Alerting & Retries',
          description: 'Implement real-time Slack/PagerDuty webhooks and automated exponential backoff loops.',
        },
      ],
    },
  },

  // 6. Legacy Modernization
  {
    slug: 'legacy-modernization',
    category: 'engineering-transformation',
    categoryLabel: 'Engineering Transformation',
    title: 'Legacy Modernization',
    tagline: 'Zero-downtime refactoring into modern serverless cloud stacks.',
    shortDesc:
      'Deconstruct fragile monolithic software and technical debt without operational disruption. Migrate to resilient, cloud-native microservices with strictly maintained business continuity.',
    fullDesc:
      'Legacy software paralyzes feature development and drains maintenance budgets. Using proven strangler-fig migration patterns, we transition monolithic codebases into modular, strictly typed cloud architectures with 100% data parity.',
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
    capabilities: [
      {
        title: 'Dual-Write Parity Testing',
        description: 'Simultaneously streams data to legacy and modern stores to verify byte-level parity.',
      },
      {
        title: 'Infrastructure as Code',
        description: 'Reproducible Terraform templates deploying isolated dev, staging, and prod clusters.',
      },
      {
        title: 'Automated CI/CD Verification',
        description: 'Strict linting, integration testing, and automatic rollback guardrails.',
      },
    ],
    businessProblem: {
      title: 'Monolithic Paralysis & Mounting Maintenance Debt',
      summary:
        'Legacy codebases and outdated database engines slow development to a crawl. Engineering teams spend 80% of their time patching regressions instead of shipping competitive features.',
      painPoints: [
        'Fear of updating monolithic code due to lack of automated tests and brittle dependencies.',
        'Exorbitant hosting bills on deprecated on-premise hardware or oversized virtual machines.',
        'Difficulty hiring senior developers willing to work on obsolete programming languages.',
        'Downtime during deployments eroding customer confidence and enterprise reputation.',
      ],
    },
    astraivApproach: {
      title: 'Risk-Free Strangler-Fig Cloud Migration',
      summary:
        'We decouple legacy monoliths piece by piece using the strangler-fig pattern, dual-writing data and verifying parity before routing live traffic with zero business disruption.',
      methodologySteps: [
        {
          step: '01',
          title: 'Monolith Dependency Mapping',
          description: 'Profile database access patterns, API endpoints, and critical domain boundaries.',
        },
        {
          step: '02',
          title: 'Dual-Write & Shadow Traffic',
          description: 'Deploy proxy gateways that mirror live requests to verify exact behavioral parity.',
        },
        {
          step: '03',
          title: 'Cloud-Native Microservice Extraction',
          description: 'Extract domains into containerized microservices managed via Terraform and Docker.',
        },
        {
          step: '04',
          title: 'Zero-Downtime Traffic Cutover',
          description: 'Gradually transition traffic percentages with automated canary health monitors.',
        },
      ],
    },
  },

  // 7. Digital Transformation
  {
    slug: 'digital-transformation',
    category: 'engineering-transformation',
    categoryLabel: 'Engineering Transformation',
    title: 'Digital Transformation',
    tagline: 'Transitioning analog workflows to unified, scalable cloud platforms.',
    shortDesc:
      'Transition your enterprise away from slow, analog workflows and fragmented spreadsheets into unified, automated cloud platforms that unlock exponential operational scale.',
    fullDesc:
      'Analog and spreadsheet-based operations paralyze growing enterprises. Astraiv guides businesses through phased, risk-free digital transformation roadmaps—replacing manual friction with unified web portals, automated logging, and executive telemetry.',
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
    capabilities: [
      {
        title: 'Operational Audit & Blueprinting',
        description: 'Comprehensive analysis of existing paper, email, and spreadsheet bottlenecks.',
      },
      {
        title: 'Unified Operational Portals',
        description: 'Bespoke internal tools consolidating disparate departmental workflows.',
      },
      {
        title: 'Executive Telemetry & Visibility',
        description: 'Real-time visibility into operational velocity, SLA compliance, and margins.',
      },
    ],
    businessProblem: {
      title: 'Analog Drag & Organizational Inefficiency',
      summary:
        'Enterprises relying on disjointed spreadsheets, paper forms, and email approvals face crippling operational lag, compliance vulnerabilities, and an inability to scale throughput.',
      painPoints: [
        'Lack of real-time visibility for leadership into operational status and field bottlenecks.',
        'High vulnerability to human error, document misplacement, and regulatory audit non-compliance.',
        'Frustrated employees bogged down in repetitive manual administrative tasks.',
        'Inability to offer modern digital self-service experiences to clients and partners.',
      ],
    },
    astraivApproach: {
      title: 'Holistic Operational Modernization & Change Management',
      summary:
        'We engineer unified, intuitive digital command centers that streamline operations, automate routine data flows, and provide leadership with live operational clarity.',
      methodologySteps: [
        {
          step: '01',
          title: 'Comprehensive Workflow Audit',
          description: 'Analyze departmental workflows, document handover friction, and map digital requirements.',
        },
        {
          step: '02',
          title: 'Platform Architecture & UX Design',
          description: 'Design intuitive, frictionless web portals that employees enthusiastically adopt.',
        },
        {
          step: '03',
          title: 'Phased Cloud Deployment',
          description: 'Roll out modern cloud modules in staged phases to protect day-to-day operations.',
        },
        {
          step: '04',
          title: 'Team Onboarding & Executive Telemetry',
          description: 'Deliver comprehensive video documentation, user training, and live KPI dashboards.',
        },
      ],
    },
  },
];

const SOLUTION_ALIASES: Record<string, string> = {
  'ai-agents': 'ai-business-automation',
  'ai-solutions': 'ai-business-automation',
  'business-automation': 'ai-business-automation',
  'workflow-automation': 'business-process-automation',
  'enterprise-applications': 'saas-platforms',
  'saas-development': 'saas-platforms',
  'data-analytics-platforms': 'data-analytics',
  'cloud-migration': 'legacy-modernization',
  'system-integration': 'legacy-modernization',
  'customer-experience': 'legacy-modernization',
  'security-compliance': 'legacy-modernization',
  'enterprise-transformation': 'digital-transformation',
};

export function getSolutionBySlug(slug: string): SolutionDetail | undefined {
  const normalized = slug.toLowerCase().trim();
  const canonicalSlug = SOLUTION_ALIASES[normalized] || normalized;
  return SOLUTIONS_LIST.find((s) => s.slug === canonicalSlug);
}

export function getAllSolutions(): SolutionDetail[] {
  return SOLUTIONS_LIST;
}
