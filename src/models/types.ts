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
  service: string;
  budget?: string;
  message: string;
  source?: string;
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

/**
 * Public Testimonial contract.
 */
export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  rating: number;
  avatarUrl?: string;
}

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
}

export const DEFAULT_JOB_OPENINGS: PublicJobOpening[] = [
  {
    id: 'seed-job-1',
    title: 'Senior Full-Stack Architect',
    slug: 'senior-full-stack-architect',
    department: 'Engineering',
    type: 'Full-Time / Remote',
    location: 'Remote',
    experience: '5+ Years',
    description:
      'Lead high-throughput web applications and SaaS portal architectures using Next.js App Router, TypeScript, and Postgres.',
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
    salary: 'Top Market / Competitive',
    applyUrl: '/contact',
    active: true,
    orderIndex: 1,
  },
  {
    id: 'seed-job-2',
    title: 'AI Systems & LLM Engineer',
    slug: 'ai-systems-llm-engineer',
    department: 'AI & Automation',
    type: 'Full-Time / Remote',
    location: 'Remote',
    experience: '3+ Years',
    description:
      'Design and deploy state-of-the-art cognitive agents, hybrid vector retrieval (RAG), and asynchronous task queues.',
    skills: ['Python', 'FastAPI', 'LangChain', 'Vector DBs', 'PyTorch', 'Agentic Workflows'],
    salary: 'Top Market / Competitive',
    applyUrl: '/contact',
    active: true,
    orderIndex: 2,
  },
  {
    id: 'seed-job-3',
    title: 'Cloud & DevOps Infrastructure Lead',
    slug: 'cloud-devops-infrastructure-lead',
    department: 'Cloud Ops',
    type: 'Full-Time / Remote',
    location: 'Remote',
    experience: '4+ Years',
    description:
      'Engineer zero-downtime CI/CD pipelines, container orchestration, edge caching on Cloudflare R2, and AWS infrastructure.',
    skills: ['AWS', 'Cloudflare Workers/R2', 'Docker', 'Terraform', 'Turborepo', 'Security Hardening'],
    salary: 'Top Market / Competitive',
    applyUrl: '/contact',
    active: true,
    orderIndex: 3,
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
    buttonText: 'Start Building',
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
    buttonText: 'Hire Our Architects',
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
    buttonText: 'Book a Consultation',
    buttonUrl: '/contact',
    active: true,
    orderIndex: 3,
  },
];
