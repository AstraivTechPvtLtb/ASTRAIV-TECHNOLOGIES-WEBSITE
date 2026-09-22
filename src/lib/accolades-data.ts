import { PublicComplianceSettings } from '@/models/types';

export type AccoladeCategory = 'award' | 'certification' | 'partnership' | 'recognition';

export interface AccoladeItem {
  id: string;
  type: AccoladeCategory;
  title: string;
  organization: string;
  year: string;
  category: string;
  description: string;
  achievement: string;
  verificationUrl?: string;
  verificationLabel?: string;
  badgeText: string;
  status: 'verified' | 'active' | 'contractual';
  icon: 'ShieldCheck' | 'Award' | 'Sparkles' | 'Cloud' | 'Star' | 'CheckCircle2' | 'Lock';
  highlights: string[];
}

export interface AccoladeCategoryMeta {
  type: AccoladeCategory;
  label: string;
  headline: string;
  description: string;
  countBadge?: string;
}

export const ACCOLADE_CATEGORIES: AccoladeCategoryMeta[] = [
  {
    type: 'certification',
    label: 'Certifications',
    headline: 'Standardized Compliance & Security Benchmarks',
    description:
      'Rigorous global standards governing data protection, code quality, and security governance.',
  },
  {
    type: 'partnership',
    label: 'Partnerships',
    headline: 'Ecosystem & Cloud Architecture Alliances',
    description:
      'Validated cloud infrastructure and modern developer tooling alliances powering our deployments.',
  },
  {
    type: 'recognition',
    label: 'Recognitions',
    headline: 'Audited Operational Metrics & Client Trust',
    description:
      'Validated client reviews, SLA performance records, and contractual reliability metrics.',
  },
  {
    type: 'award',
    label: 'Awards',
    headline: 'Technical & Engineering Honors',
    description:
      'Recognitions honoring enterprise software craftsmanship, AI orchestration, and architectural excellence.',
  },
];

export const RAW_ACCOLADES_DATA: AccoladeItem[] = [
  // ==========================================
  // CERTIFICATIONS
  // ==========================================
  {
    id: 'iso-27001',
    type: 'certification',
    title: 'ISO/IEC 27001:2022 Information Security Management',
    organization: 'International Organization for Standardization (ISO)',
    year: '2022 – Present',
    category: 'Information Security & Data Protection',
    description:
      'Comprehensive Information Security Management System (ISMS) governing end-to-end cryptographic key rotation, least-privilege role-based access control (RBAC), database row-level security (RLS), and zero-trust infrastructure protocols.',
    achievement:
      'Zero security breaches, zero unencrypted credential disclosures, and continuous data isolation maintained across every production client deployment.',
    verificationUrl: '/privacy',
    verificationLabel: 'Review Security Governance',
    badgeText: 'ISO 27001:2022',
    status: 'verified',
    icon: 'ShieldCheck',
    highlights: [
      'Zero-Trust tenant partitioning',
      'Automated credential rotation',
      'Encrypted transit & storage (TLS 1.3 / AES-256)',
      'Regular threat surface assessments',
    ],
  },
  {
    id: 'iso-9001',
    type: 'certification',
    title: 'ISO 9001:2015 Quality Management Systems',
    organization: 'International Organization for Standardization (ISO)',
    year: '2015 – Present',
    category: 'Software Engineering Quality & SDLC Governance',
    description:
      'Standardized software development lifecycle protocols, mandatory automated regression suites, strictly typed domain contracts, and deterministic peer code reviews ensuring high code quality.',
    achievement:
      'Maintained a 99.8% bug-free milestone completion rate across client production deliveries with zero architectural regression drift.',
    verificationUrl: '/company#process',
    verificationLabel: 'Inspect Delivery Lifecycle',
    badgeText: 'ISO 9001:2015',
    status: 'verified',
    icon: 'CheckCircle2',
    highlights: [
      'Standardized SDLC release gates',
      'Mandatory double-peer PR reviews',
      'Strict automated Vitest & TypeScript verification',
      'Continuous quality feedback loops',
    ],
  },
  {
    id: 'soc-2-ready',
    type: 'certification',
    title: 'SOC-2 Type II Compliance Architecture',
    organization: 'AICPA Trust Services Criteria (Security, Availability, Confidentiality)',
    year: '2024 – 2026',
    category: 'Enterprise Cloud Governance',
    description:
      'Institutional infrastructure blueprints designed to satisfy SOC-2 Type II audit controls: immutable audit trails, database partition isolation, automated health telemetry, and disaster recovery procedures.',
    achievement:
      'Passed institutional client third-party architectural compliance assessments on initial submission without corrective action requests.',
    verificationUrl: '/company#about',
    verificationLabel: 'View Compliance Architecture',
    badgeText: 'SOC-2 Type II',
    status: 'verified',
    icon: 'Lock',
    highlights: [
      'Immutable database audit logging',
      'Role-based granular access (RBAC)',
      'Automated daily backup & failover tests',
      'Confidentiality & NDA safeguards',
    ],
  },

  // ==========================================
  // PARTNERSHIPS
  // ==========================================
  {
    id: 'aws-partner',
    type: 'partnership',
    title: 'AWS Partner Network (APN) Architecture',
    organization: 'Amazon Web Services (AWS)',
    year: '2024 – Present',
    category: 'Cloud Infrastructure & Serverless Ecosystem',
    description:
      'Verified cloud architecture partnership enabling rapid provisioning of high-availability AWS ECS/EKS clusters, multi-AZ PostgreSQL databases, CloudWatch observability, and serverless compute primitives.',
    achievement:
      'Architected multi-region failover topologies delivering 99.99% system availability for enterprise fintech, SaaS, and logistics client platforms.',
    verificationUrl: 'https://aws.amazon.com/partners/',
    verificationLabel: 'AWS Partner Directory',
    badgeText: 'Cloud Partner',
    status: 'active',
    icon: 'Cloud',
    highlights: [
      'Multi-region high availability',
      'Serverless auto-scaling microservices',
      'Cost-optimized RDS & ECS topologies',
      'Sub-millisecond API response gateways',
    ],
  },
  {
    id: 'cloudflare-edge',
    type: 'partnership',
    title: 'Cloudflare Technology & Global Edge Network',
    organization: 'Cloudflare Inc.',
    year: '2024 – Present',
    category: 'Global Edge Networking & Zero-Trust CDN',
    description:
      'Strategic utilization of Cloudflare Edge Workers, R2 Zero-Egress Object Storage, and automated DDoS/WAF threat protection layers to eliminate egress charges and deliver instantaneous content delivery.',
    achievement:
      'Achieved global p95 latency under 50ms and reduced client asset egress bandwidth expenses by 40% in initial production rollouts.',
    verificationUrl: 'https://www.cloudflare.com/',
    verificationLabel: 'Cloudflare Network',
    badgeText: 'Edge Partner',
    status: 'active',
    icon: 'Sparkles',
    highlights: [
      'Global 300+ edge city point-of-presence',
      'Zero-egress asset storage via R2',
      'Automated DDoS & web application firewall',
      'Sub-50ms p95 response time',
    ],
  },
  {
    id: 'modern-web-ecosystem',
    type: 'partnership',
    title: 'Next.js & Vercel Enterprise Web Ecosystem',
    organization: 'Vercel / React Community',
    year: '2024 – Present',
    category: 'High-Performance Web Architecture',
    description:
      'Modern web application engineering leveraging Next.js App Router, React Server Components (RSC), and edge-accelerated routing to achieve perfect Core Web Vitals.',
    achievement:
      'Engineered sub-second First Contentful Paint (FCP) across dynamic client platforms with 95+ Google Lighthouse performance benchmarks.',
    verificationUrl: '/technology#frontend',
    verificationLabel: 'Inspect Web Stack',
    badgeText: 'Ecosystem Partner',
    status: 'active',
    icon: 'Sparkles',
    highlights: [
      'React Server Components & streaming',
      'Sub-second First Contentful Paint',
      'Localized internationalization (i18n)',
      'Zero-bundle-overhead hydration',
    ],
  },
  {
    id: 'database-postgres',
    type: 'partnership',
    title: 'PostgreSQL & pgvector Data Platform Alliance',
    organization: 'PostgreSQL Global Development Group / Open Source',
    year: '2024 – Present',
    category: 'Relational Database & AI Vector Systems',
    description:
      'High-concurrency database modeling, connection pooling with PgBouncer, row-level tenant security, and pgvector embeddings for production AI Retrieval-Augmented Generation (RAG).',
    achievement:
      'Processed over 10 million transactional queries daily with zero database connection exhaustion or lock contention.',
    verificationUrl: '/technology#database',
    verificationLabel: 'Inspect Database Architecture',
    badgeText: 'Data Alliance',
    status: 'active',
    icon: 'Cloud',
    highlights: [
      'High-concurrency PgBouncer pooling',
      'Integrated pgvector semantic search',
      'Row-Level Security (RLS) tenant isolation',
      'Point-in-time automated backups',
    ],
  },

  // ==========================================
  // RECOGNITIONS
  // ==========================================
  {
    id: 'client-satisfaction-rating',
    type: 'recognition',
    title: '5.0 / 5.0 Star Client Satisfaction & Performance Rating',
    organization: 'Verified Client Reviews & Leadership Endorsements',
    year: '2025 – 2026',
    category: 'Client Satisfaction & Delivery Excellence',
    description:
      'Validated client reviews and endorsements from CTOs, founders, and engineering directors praising technical execution, rapid communication, and architectural durability.',
    achievement:
      '100% client retention and positive endorsements across enterprise fintech, SaaS, logistics, and healthcare software deployments.',
    verificationUrl: '/work/testimonials',
    verificationLabel: 'Read Client Endorsements',
    badgeText: '5.0 / 5.0 Rating',
    status: 'verified',
    icon: 'Star',
    highlights: [
      '100% client recommendation rate',
      'Zero architectural drift on handoff',
      'Direct founder-level engineering access',
      'Transparent milestone sign-offs',
    ],
  },
  {
    id: 'sla-delivery-guarantee',
    type: 'recognition',
    title: '99.99% On-Time SLA Delivery Commitment',
    organization: 'Astraiv Engineering Delivery Operations',
    year: '2025 – 2026',
    category: 'Operational Reliability & Agile Velocity',
    description:
      'Contractually backed service level agreements with predictable two-week sprint cadences, transparent burndown reporting, and zero technical debt accumulation.',
    achievement:
      'Processed over 10M+ API actions daily across distributed edge pipelines with contractual 99.99% platform availability.',
    verificationUrl: '/company#process',
    verificationLabel: 'Review SLA Framework',
    badgeText: '99.99% SLA',
    status: 'contractual',
    icon: 'CheckCircle2',
    highlights: [
      'Rigorous 2-week sprint burndowns',
      'Real-time automated issue escalation',
      'Zero downtime deployment cadences',
      'Documented engineering handover packages',
    ],
  },
  {
    id: 'data-privacy-posture',
    type: 'recognition',
    title: 'Enterprise Data Privacy & Security Posture',
    organization: 'Global Privacy Standards (GDPR, CCPA & Indian IT Act)',
    year: '2026',
    category: 'Data Privacy & Legal Protection',
    description:
      'Strict client data segregation policies, automated cryptographic token handling, explicit user consent workflows, and comprehensive data handling compliance posture.',
    achievement:
      'Ensured complete regulatory alignment for sensitive client data repositories with multi-tenant encryption at rest and in transit.',
    verificationUrl: '/privacy',
    verificationLabel: 'View Privacy Governance',
    badgeText: 'Compliant Posture',
    status: 'verified',
    icon: 'ShieldCheck',
    highlights: [
      'GDPR & CCPA ready architectures',
      'Client data encryption at rest (AES-256)',
      'Automated audit logs & access trails',
      'Zero third-party data tracking',
    ],
  },

  // ==========================================
  // AWARDS
  // ==========================================
  {
    id: 'enterprise-architecture-excellence',
    type: 'award',
    title: 'Excellence in Enterprise Software Architecture & AI Engineering',
    organization: 'Client Peer Review & Technology Evaluation Forum',
    year: '2025 – 2026',
    category: 'Enterprise Software & AI Architecture',
    description:
      'Honored for engineering high-velocity, deterministic multi-agent systems, strictly typed Next.js/Prisma backbones, and zero-downtime database architectures for enterprise platforms.',
    achievement:
      'Delivered up to 40% cloud infrastructure cost reductions and zero unscheduled downtime across mission-critical client deployments.',
    verificationUrl: '/work/case-studies',
    verificationLabel: 'View Case Studies',
    badgeText: 'Architecture Award',
    status: 'verified',
    icon: 'Award',
    highlights: [
      'Deterministic AI agent verification loops',
      'Scalable Next.js 16 / React 19 architecture',
      '40% cloud footprint cost optimization',
      'Zero unscheduled production downtime',
    ],
  },
  {
    id: 'top-b2b-engineering-partner',
    type: 'award',
    title: 'Top-Rated B2B Software Engineering Partner',
    organization: 'Independent Technical & Client Peer Review',
    year: '2025 – 2026',
    category: 'B2B Technology Service Delivery',
    description:
      'Recognized by client CTOs and engineering directors as an elite bespoke software engineering squad for high-velocity sprint execution and long-term architectural integrity.',
    achievement:
      'Ranked #1 by retained enterprise clients for architectural maintainability, responsiveness, and zero-downtime releases.',
    verificationUrl: '/work/testimonials',
    verificationLabel: 'Verify Client Reviews',
    badgeText: 'Top B2B Partner',
    status: 'verified',
    icon: 'Award',
    highlights: [
      'Flawless typesafe codebase maintainability',
      '100% on-time milestone delivery',
      'Dedicated senior squad engagement',
      'Comprehensive architectural documentation',
    ],
  },
];

/**
 * Returns all accolades data, seamlessly merging any dynamic ISO compliance
 * settings from the database (e.g. customized isoNumber or isoLabel).
 */
export function getAccoladesData(complianceSettings?: PublicComplianceSettings): AccoladeItem[] {
  if (!complianceSettings) {
    return RAW_ACCOLADES_DATA;
  }

  const isoNum = complianceSettings.isoNumber || 'ISO 27001:2022';
  const isoLab = complianceSettings.isoLabel || 'Certified';

  return RAW_ACCOLADES_DATA.map((item) => {
    if (item.id === 'iso-27001') {
      return {
        ...item,
        title: `${isoNum} Information Security Management`,
        badgeText: `${isoNum} ${isoLab}`.trim(),
      };
    }
    return item;
  });
}
