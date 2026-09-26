/**
 * @file client/src/lib/why-astraiv-data.ts
 * @description Canonical Data Source for Why Astraiv.
 * Powers both Homepage (concise summary) and Company Page (complete technical explanation).
 */

export interface WhyAstraivPillar {
  num: string;
  id: string;
  title: string;
  badge: string;
  iconName: 'TrendingUp' | 'Layers' | 'Bot' | 'ShieldCheck';
  summary: string;
  completeDescription: string;
  tenets: string[];
  metrics: {
    label: string;
    value: string;
  };
}

export const WHY_ASTRAIV_PILLARS: WhyAstraivPillar[] = [
  {
    num: '01',
    id: 'business-first',
    title: 'Business-First Engineering',
    badge: 'ROI & Velocity',
    iconName: 'TrendingUp',
    summary: "We don't just write code. We build technology around measurable business outcomes, ROI, and customer conversion velocity.",
    completeDescription:
      'Every technical milestone is benchmarked against commercial outcomes—customer acquisition velocity, transaction latency, and operational expense reduction. We eliminate speculative engineering by aligning software architecture directly to bottom-line profitability and rapid market validation.',
    tenets: [
      'Commercial outcome-driven sprint milestones',
      'Continuous conversion funnel & latency telemetry',
      'Zero speculative over-engineering',
      'Comprehensive total cost of ownership (TCO) optimization',
    ],
    metrics: {
      label: 'Average Client Opex Reduction',
      value: '38%',
    },
  },
  {
    num: '02',
    id: 'scalable-architecture',
    title: 'Scalable Distributed Architecture',
    badge: 'Zero-Lock-In',
    iconName: 'Layers',
    summary: 'Zero-lock-in modular architectures designed to effortlessly scale with expanding datasets and peak traffic.',
    completeDescription:
      'We architect vendor-neutral, cloud-agnostic systems engineered on modern open standards: Next.js edge runtimes, PostgreSQL ACID data persistence, Redis caching layers, and containerized Docker/Kubernetes clusters capable of scaling from day one to tens of millions of requests.',
    tenets: [
      'Open-standard TypeScript & Next.js Server Actions',
      'Zero vendor lock-in; deployable to AWS, GCP, or bare metal',
      'Edge CDN caching with sub-15ms Time to First Byte (TTFB)',
      'Automated Horizontal Pod Autoscaling (HPA)',
    ],
    metrics: {
      label: 'Sub-Millisecond p99 Latency',
      value: '< 15ms',
    },
  },
  {
    num: '03',
    id: 'ai-intelligence',
    title: 'AI-Ready Intelligence',
    badge: 'Deterministic AI',
    iconName: 'Bot',
    summary: 'We integrate practical AI capabilities—autonomous agents, RAG pipelines, and deterministic verification loops.',
    completeDescription:
      'We avoid superficial chatbot wrappers. We architect deterministic verification gates, private pgvector semantic search indexes, and autonomous multi-agent task swarms that process real-world domain workflows with strict zero-hallucination compliance.',
    tenets: [
      'Autonomous multi-agent orchestration (LangGraph / Swarms)',
      'Hybrid semantic vector retrieval with pgvector',
      'Private air-gapped LLMs with zero third-party data retention',
      'Deterministic JSON schema output validation',
    ],
    metrics: {
      label: 'Factual Citation Accuracy',
      value: '99.4%',
    },
  },
  {
    num: '04',
    id: 'institutional-security',
    title: 'Institutional Security & Reliability',
    badge: 'SOC-2 & ISO 27001',
    iconName: 'ShieldCheck',
    summary: 'Strict ISO 27001 and SOC-2 standard engineering practices, zero-trust database RLS, and proactive 99.9% uptime SLAs.',
    completeDescription:
      'Our security lifecycle implements defense-in-depth from the first line of code. We enforce row-level security (RLS), automated OWASP vulnerability scanning, immutable audit trails, and strict dual-custody access controls verified under global ISO 27001 and SOC-2 guidelines.',
    tenets: [
      'Row-Level Security (RLS) & Role-Based Access Control (RBAC)',
      'Automated CI/CD OWASP security gates & SAST scanning',
      'Immutable cryptographic audit logging',
      'Contractual 99.9% uptime SLAs with 24/7 telemetry monitoring',
    ],
    metrics: {
      label: 'Audit First-Pass Sign-off Rate',
      value: '100%',
    },
  },
];
