/**
 * @file client/src/models/types.ts
 * @description [MODEL] Domain TypeScript models and interfaces for AstraIV Technologies Client Website & Portal.
 */

export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'CLIENT' | 'USER';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

/**
 * Public Contact / Enquiry submission payload.
 */
export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  source?: string;
  role?: string;
  resumeName?: string;
  resumeUrl?: string;
  resumeData?: string;
  honeypot?: string;
}

/**
 * Canonical Project Types for the Start a Project wizard.
 */
export type StartProjectType =
  | 'AI Solution'
  | 'Custom Software'
  | 'Web Application'
  | 'Mobile Application'
  | 'Cloud / DevOps'
  | 'UI/UX'
  | 'Business Automation'
  | 'Technology Consulting'
  | 'Not Sure';

/**
 * Canonical Lead Lifecycle Status.
 */
export type LeadLifecycleStatus =
  | 'NEW'
  | 'QUALIFIED'
  | 'CONTACTED'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

/**
 * Payload collected throughout the 5-step Start a Project wizard.
 */
export interface StartProjectFormInput {
  // Step 1: Project Type
  projectType: StartProjectType;

  // Step 2: Project Scope & Context
  projectDescription: string;
  industry: string;
  productType: string; // 'Brand New Product' | 'Existing Product Modernization' | 'Scaling & Expansion' | string
  challenges: string[]; // List of key technical/business challenges

  // Step 3: Parameters
  budgetRange: string;
  timeline: string;
  projectStage: string;

  // Step 4: Contact Information
  name: string;
  email: string;
  company: string;
  phone?: string;
  preferredContact?: string;

  // Attribution & Origin Telemetry
  sourcePage?: string; // e.g. /services/ai-development
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  serviceId?: string;
  solutionId?: string;
  industryId?: string;

  // Anti-Spam & Duplicate Prevention Metadata
  honeypot?: string; // Hidden trap field - must remain empty
  clientTimestamp?: number; // Time when wizard was mounted
  idempotencyKey?: string; // Unique client token to avoid duplicate submissions
}

/**
 * Response payload returned upon successful project brief ingestion.
 */
export interface StartProjectSubmissionResponse {
  id: string;
  leadNumber?: string;
  referenceId: string;
  message: string;
  projectType: string;
  submittedAt: string;
}

/**
 * Public review submission payload.
 */
export interface PublicReviewInput {
  client_name: string;
  company?: string;
  rating: number;
  review: string;
  service?: string;
}

/**
 * Publicly visible approved client review.
 */
export interface PublicReview {
  id: string;
  client_name: string;
  company?: string | null;
  rating: number;
  review: string;
  service?: string | null;
  created_at: Date | string;
}

/**
 * Publicly visible portfolio project / case study.
 */
export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail?: string | null;
  clientName?: string | null;
  category: string;
  featured: boolean;
  technologies: string[];
  createdAt: Date | string;
}

/**
 * Publicly visible service catalog item.
 */
export interface PublicService {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
  features: string[];
  pricingStartingAt?: number | null;
  popular?: boolean;
}

/**
 * Publicly visible blog post.
 */
export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  category: string;
  tags: string[];
  createdAt: Date | string;
}

/**
 * Client Portal Ticket model.
 */
export interface ClientTicketData {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  clientId: string;
  assignedToId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Client Portal Project model.
 */
export interface ClientProjectData {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  budget?: number | null;
  clientId?: string | null;
  managerId?: string | null;
}

/**
 * Generic response wrapper for Client-facing server actions.
 */
export interface ClientActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

/**
 * Canonical Public Testimonial contract.
 * Strictly enforces single-source-of-truth across Homepage, Work, Case Studies, and Services.
 */
export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  role: string;
  avatar?: string | null;
  review_text: string;
  rating: number;
  project_id?: string | null;
  service_id?: string | null;
  industry_id?: string | null;
  status: TestimonialStatus;
  featured: boolean;
  published_at?: string | null;

  // Backward compatibility convenience aliases for existing card views
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  avatarUrl?: string;
}

/**
 * Backward compatibility alias for Testimonial
 */
export type TestimonialItem = Testimonial;

/**
 * Public Job Opening contract.
 */
export interface PublicJobOpening {
  id: string;
  title: string;
  slug: string;
  department: string;
  type: string;
  location: string;
  experience?: string | null;
  description: string;
  skills: string[];
  salary?: string | null;
  applyUrl?: string | null;
  active: boolean;
  orderIndex: number;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  benefits?: string[];
}

export const DEFAULT_JOB_OPENINGS: PublicJobOpening[] = [
  {
    id: 'seed-job-1',
    title: 'Senior Full-Stack Architect',
    slug: 'senior-full-stack-architect',
    department: 'Engineering',
    type: 'Full-Time / Remote',
    location: 'Remote (Worldwide)',
    experience: '5+ Years',
    description:
      'Lead high-throughput web applications and SaaS portal architectures using Next.js App Router, TypeScript, and Postgres.',
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
    salary: '$120,000 - $160,000 + Equity Options',
    applyUrl: '/careers/senior-full-stack-architect#apply',
    active: true,
    orderIndex: 1,
    responsibilities: [
      'Design and build high-concurrency full-stack web applications using Next.js App Router, React Server Components, and TypeScript.',
      'Architect robust PostgreSQL database schemas with Prisma ORM and enforce strict ACID transaction boundaries.',
      'Lead architectural RFCs and system design reviews, rejecting low-quality technical debt in favor of clean modular boundaries.',
      'Partner directly with enterprise clients and technical founders to translate business workflows into deterministic software architectures.',
      'Implement automated end-to-end testing, continuous integration checks, and sub-second page performance optimizations.',
    ],
    requirements: [
      '5+ years of production experience building and deploying modern full-stack web platforms at scale.',
      'Deep mastery of TypeScript, Next.js (App Router), React, and server-side state management patterns.',
      'Proven expertise in relational database design (PostgreSQL), index optimization, and migration pipelines.',
      'Strong understanding of web security fundamentals (CSRF, XSS, OAuth 2.0, RBAC, JWT revocation).',
      'Excellent written communication and asynchronous RFC authoring skills.',
    ],
    niceToHave: [
      'Experience with Rust or Go microservices for performance-critical background tasks.',
      'Familiarity with cloud-native primitives on AWS, Cloudflare Workers, and serverless Docker runtimes.',
      'Prior experience working in high-trust, asynchronous, distributed engineering squads.',
    ],
    benefits: [
      '100% remote work autonomy with flexible hours and no micromanagement.',
      'Top-of-market base compensation plus meaningful equity participation.',
      '$3,500 home office & latest Apple hardware stipend upon joining.',
      'Annual $2,000 continuous learning & technical conference budget.',
      'Comprehensive health coverage & generous paid time off.',
    ],
  },
  {
    id: 'seed-job-2',
    title: 'AI Systems & LLM Engineer',
    slug: 'ai-systems-llm-engineer',
    department: 'AI & Automation',
    type: 'Full-Time / Remote',
    location: 'Remote (Worldwide)',
    experience: '3+ Years',
    description:
      'Design and deploy state-of-the-art cognitive agents, hybrid vector retrieval (RAG), and asynchronous task queues.',
    skills: ['Python', 'FastAPI', 'LangChain', 'Vector DBs', 'PyTorch', 'Agentic Workflows'],
    salary: '$130,000 - $175,000 + Equity Options',
    applyUrl: '/careers/ai-systems-llm-engineer#apply',
    active: true,
    orderIndex: 2,
    responsibilities: [
      'Architect and deploy multi-agent cognitive pipelines, contextual RAG systems, and autonomous task swarms.',
      'Develop high-throughput asynchronous inference APIs using Python, FastAPI, Redis, and Celery.',
      'Implement hybrid search engines combining dense vector embeddings (Pinecone, pgvector) with BM25 keyword rankings.',
      'Optimize token efficiency, latency budgets, and caching layers across open-source and proprietary foundation models.',
      'Establish automated model evaluation frameworks, regression benchmarks, and hallucination guardrails.',
    ],
    requirements: [
      '3+ years of hands-on experience building production AI, ML, or NLP applications.',
      'Strong programming proficiency in Python, modern async programming, and typed APIs.',
      'Demonstrated experience with embedding models, vector databases (Qdrant, Milvus, pgvector), and retrieval techniques.',
      'Practical understanding of LLM fine-tuning, prompt optimization, and agentic orchestration architectures.',
      'Solid foundations in system architecture, Docker containerization, and cloud deployment.',
    ],
    niceToHave: [
      'Contributions to open-source AI frameworks or published research in retrieval or agent architectures.',
      'Experience with local model deployment using vLLM, TensorRT-LLM, or Ollama.',
      'Knowledge of enterprise compliance standards (SOC-2, HIPAA) for AI data processing.',
    ],
    benefits: [
      'Dedicated cloud compute credits and high-end workstation access for experiments.',
      '100% remote-first autonomy with async-first collaboration.',
      'Competitive salary with generous equity grant.',
      'Comprehensive healthcare, dental, and wellness coverage.',
      'Generous parental leave and flexible paid vacation.',
    ],
  },
  {
    id: 'seed-job-3',
    title: 'Cloud & DevOps Infrastructure Lead',
    slug: 'cloud-devops-infrastructure-lead',
    department: 'Cloud Ops',
    type: 'Full-Time / Remote',
    location: 'Remote (Worldwide)',
    experience: '4+ Years',
    description:
      'Engineer zero-downtime CI/CD pipelines, container orchestration, edge caching on Cloudflare R2, and AWS infrastructure.',
    skills: ['AWS', 'Cloudflare Workers/R2', 'Docker', 'Terraform', 'Turborepo', 'Security Hardening'],
    salary: '$125,000 - $165,000 + Equity Options',
    applyUrl: '/careers/cloud-devops-infrastructure-lead#apply',
    active: true,
    orderIndex: 3,
    responsibilities: [
      'Design, provision, and maintain multi-region infrastructure as code using Terraform and AWS / Cloudflare.',
      'Build zero-downtime CI/CD deployment pipelines with automated rollback capabilities and canary releases.',
      'Enforce enterprise cloud security standards, IAM principle of least privilege, and ISO 27001 / SOC-2 compliance.',
      'Configure real-time distributed telemetry, Prometheus/Grafana dashboards, and automated incident response runbooks.',
      'Optimize cloud infrastructure expenditure, implementing auto-scaling policies that cut redundant resource burn.',
    ],
    requirements: [
      '4+ years managing production cloud infrastructure across AWS, GCP, or Cloudflare edge environments.',
      'Proficiency in declarative Infrastructure as Code (Terraform, OpenTofu, AWS CDK).',
      'Hands-on experience with container orchestration (Docker, ECS, EKS) and modern build tooling (Turborepo, GitHub Actions).',
      'Deep understanding of networking, DNS, TLS termination, CDN caching, and edge routing.',
      'Experience participating in on-call rotations with a focus on blameless post-mortems.',
    ],
    niceToHave: [
      'AWS Certified Solutions Architect - Professional or equivalent certification.',
      'Experience securing financial or healthcare environments requiring strict compliance audit trails.',
      'Familiarity with Kubernetes operator patterns and GitOps workflows (ArgoCD / Flux).',
    ],
    benefits: [
      'Work from anywhere in the world with full remote equipment support.',
      'Competitive global compensation with annual performance bonus.',
      'Flexible time-off policy and company-wide recharge weeks.',
      'Access to premium continuous learning platforms and certification sponsorship.',
      'Comprehensive international health insurance coverage.',
    ],
  },
];

/**
 * Public Pricing Plan contract.
 */
export interface PublicPricingPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge?: string | null;
  isPopular: boolean;
  priceType: 'fixed' | 'custom';
  priceMonthlyInr?: number | null;
  priceYearlyInr?: number | null;
  priceMonthlyUsd?: number | null;
  priceYearlyUsd?: number | null;
  customPriceLabel?: string | null;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  active: boolean;
  orderIndex: number;
}

export const DEFAULT_PRICING_PLANS: PublicPricingPlan[] = [
  {
    id: 'seed-plan-1',
    name: 'Starter Plan',
    slug: 'starter-plan',
    description: 'Ideal for early-stage startups needing a premium marketing website and brand system.',
    badge: null,
    isPopular: false,
    priceType: 'fixed',
    priceMonthlyInr: 399999,
    priceYearlyInr: 319999,
    priceMonthlyUsd: 4999,
    priceYearlyUsd: 3999,
    customPriceLabel: null,
    features: [
      'Custom Web Design (Framer/Next.js)',
      'SEO & Performance Tuning',
      'Standard Contact Integrations',
      '2 rounds of layout revisions',
      'Production Deployment & CI/CD',
      'Dedicated Email Support',
    ],
    buttonText: 'Start a Project',
    buttonUrl: '/contact',
    active: true,
    orderIndex: 1,
  },
  {
    id: 'seed-plan-2',
    name: 'Professional Plan',
    slug: 'professional-plan',
    description: 'Our most popular plan, covering custom web applications, SaaS dashboards, and database setup.',
    badge: 'MOST POPULAR',
    isPopular: true,
    priceType: 'fixed',
    priceMonthlyInr: 799999,
    priceYearlyInr: 639999,
    priceMonthlyUsd: 9999,
    priceYearlyUsd: 7999,
    customPriceLabel: null,
    features: [
      'Everything in Starter',
      'SaaS Dashboard & User Login',
      'Prisma & Postgres integrations',
      'Stripe payment stub setup',
      '2 weeks post-launch SLA support',
      'Dedicated Slack support channel',
    ],
    buttonText: 'Start a Project',
    buttonUrl: '/contact',
    active: true,
    orderIndex: 2,
  },
  {
    id: 'seed-plan-3',
    name: 'Enterprise Plan',
    slug: 'enterprise-plan',
    description: 'For companies requiring dedicated cloud infrastructure, AI integrations, and full SLA support.',
    badge: null,
    isPopular: false,
    priceType: 'custom',
    priceMonthlyInr: null,
    priceYearlyInr: null,
    priceMonthlyUsd: null,
    priceYearlyUsd: null,
    customPriceLabel: 'Custom',
    features: [
      'Custom AI & Agent workflow stubs',
      'Cloudflare R2 CDNs config',
      'AWS load-balanced hosting setup',
      'Role-Based admin dashboards',
      'Priority SLA 24/7 Response time',
      'Unlimited revision approvals',
    ],
    buttonText: 'Talk to an Expert',
    buttonUrl: '/contact',
    active: true,
    orderIndex: 3,
  },
];

/**
 * Enterprise client partner logo item for the proof ticker
 */
export interface ClientLogoItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  iconKey?: string;
}

/**
 * ISO Compliance & Performance Metrics Configuration
 */
export interface PublicComplianceSettings {
  id?: string;
  isoNumber: string;
  isoLabel: string;
  showIsoBadge: boolean;
  showIsoSection: boolean;
  uptimeValue: string;
  uptimeLabel: string;
  savingsValue: string;
  savingsLabel: string;
  actionsValue: string;
  actionsLabel: string;
  slaValue: string;
  slaLabel: string;
  clientLogos?: ClientLogoItem[];
}

/**
 * Relational CMS Publication & Governance Types
 */
export type CmsPublicationStatus = 'published' | 'draft' | 'archived';

export interface CmsSeoMetadata {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonical?: string | null;
  ogImage?: string | null;
  keywords?: string[];
}

export interface CmsTechnology {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  description?: string | null;
  status: CmsPublicationStatus;
  featured: boolean;
  orderIndex: number;
}

export interface CmsAward {
  id: string;
  type: string;
  title: string;
  organization: string;
  year: string;
  category: string;
  description: string;
  achievement: string;
  verificationUrl?: string | null;
  verificationLabel?: string | null;
  badgeText: string;
  status: string;
  published: boolean;
  featured: boolean;
  orderIndex: number;
  icon: string;
  highlights: string[];
}

export interface CmsFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
  isFeatured: boolean;
  status: string;
  orderIndex: number;
}
