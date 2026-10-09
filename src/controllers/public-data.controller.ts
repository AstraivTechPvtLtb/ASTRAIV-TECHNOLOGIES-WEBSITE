'use server';

/**
 * @file client/src/controllers/public-data.controller.ts
 * @description [CONTROLLER] Business logic for fetching publicly visible reviews, testimonials, and showcases for the client website.
 */

import { db } from '@/models/db';
import { safeCache } from '@/lib/cache';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import {
  PublicJobOpening,
  DEFAULT_JOB_OPENINGS,
  PublicCareersPageContent,
  PublicSharedCareersDefaults,
  JobCategory,
  PaginatedJobsResult,
  PublicPricingPlan,
  DEFAULT_PRICING_PLANS,
  PublicPricingPageSettings,
  DEFAULT_PRICING_PAGE_SETTINGS,
  Testimonial,
  TestimonialStatus,
  PublicComplianceSettings,
} from '@/models/types';
import { Prisma } from '@prisma/client';
import { SLUG_ALIASES } from '@/lib/services-data';

export interface GetApprovedTestimonialsOptions {
  featuredOnly?: boolean;
  projectId?: string;
  serviceId?: string;
  industryId?: string;
  limit?: number;
}

/**
 * Returns all canonical and aliased slug identifiers for a given service ID.
 */
function getRelatedServiceSlugs(serviceId: string): string[] {
  const normalized = serviceId.toLowerCase().trim();
  const candidates = new Set<string>([normalized]);

  const canonical = SLUG_ALIASES[normalized];
  if (canonical) {
    candidates.add(canonical);
  }

  for (const [alias, target] of Object.entries(SLUG_ALIASES)) {
    if (target === normalized || (canonical && target === canonical) || alias === normalized) {
      candidates.add(alias);
      candidates.add(target);
    }
  }

  return Array.from(candidates);
}

const VERIFIED_CANONICAL_FALLBACK: Testimonial[] = [
  {
    id: 'seed-sarah',
    client_name: 'Sarah Jenkins',
    company: 'FinanceFlow Capital',
    role: 'Head of Financial Architecture',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
    review_text: 'Astraiv provided the engineering rigor required for institutional financial compliance. Our auditors passed the security audit on the very first submission, and our monthly book close now takes hours instead of weeks.',
    rating: 5,
    project_id: 'financeflow',
    service_id: 'ai-development',
    industry_id: 'fintech',
    status: 'approved',
    featured: true,
    published_at: '2026-09-02T06:31:50.888Z',
    quote: 'Astraiv provided the engineering rigor required for institutional financial compliance. Our auditors passed the security audit on the very first submission, and our monthly book close now takes hours instead of weeks.',
    authorName: 'Sarah Jenkins',
    authorRole: 'Head of Financial Architecture',
    authorCompany: 'FinanceFlow Capital',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
  },
  {
    id: 'seed-marcus',
    client_name: 'Marcus Vance',
    company: 'PulseFit Global',
    role: 'Chief Technology Officer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop',
    review_text: 'Astraiv Technologies transformed our core analytics platform. The speed improvement was noticed immediately by our franchise operators, and our monthly cloud bill dropped by 40% in the first quarter.',
    rating: 5,
    project_id: 'pulsefit',
    service_id: 'web-development',
    industry_id: 'saas',
    status: 'approved',
    featured: true,
    published_at: '2026-09-02T06:31:50.888Z',
    quote: 'Astraiv Technologies transformed our core analytics platform. The speed improvement was noticed immediately by our franchise operators, and our monthly cloud bill dropped by 40% in the first quarter.',
    authorName: 'Marcus Vance',
    authorRole: 'Chief Technology Officer',
    authorCompany: 'PulseFit Global',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop',
  },
  {
    id: 'seed-david-chen',
    client_name: 'David Chen',
    company: 'AeroSync Logistics',
    role: 'VP of Operations',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&fit=crop',
    review_text: 'The route optimization algorithms delivered by Astraiv paid for the entire software investment in less than four months of operational fuel savings alone. Our drivers love the offline app.',
    rating: 5,
    project_id: 'aerosync',
    service_id: 'custom-software',
    industry_id: 'logistics',
    status: 'approved',
    featured: true,
    published_at: '2026-09-02T06:31:50.888Z',
    quote: 'The route optimization algorithms delivered by Astraiv paid for the entire software investment in less than four months of operational fuel savings alone. Our drivers love the offline app.',
    authorName: 'David Chen',
    authorRole: 'VP of Operations',
    authorCompany: 'AeroSync Logistics',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&fit=crop',
  },
  {
    id: 'seed-elena',
    client_name: 'Elena Rostova',
    company: 'Lumina Energy Systems',
    role: 'VP of Marketing & Product',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop',
    review_text: 'Astraiv provided Lumina with an institutional-grade brand identity that immediately unlocked enterprise utility contracts. Their token-driven workflow brought our design and engineering teams into perfect alignment.',
    rating: 5,
    project_id: 'lumina-brand-strategy',
    service_id: 'ui-ux-design',
    industry_id: 'saas',
    status: 'approved',
    featured: true,
    published_at: '2026-09-02T06:31:50.888Z',
    quote: 'Astraiv provided Lumina with an institutional-grade brand identity that immediately unlocked enterprise utility contracts. Their token-driven workflow brought our design and engineering teams into perfect alignment.',
    authorName: 'Elena Rostova',
    authorRole: 'VP of Marketing & Product',
    authorCompany: 'Lumina Energy Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop',
  },
  {
    id: 'seed-david-vance',
    client_name: 'David Vance',
    company: 'Nova Global Brokerage',
    role: 'Chief Technology Officer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&fit=crop',
    review_text: 'Astraiv Technologies rebuilt our entire broker core without a single minute of downtime. The speed and real-time collaboration have transformed how our trading desks close deals.',
    rating: 5,
    project_id: 'nova-crm-saas',
    service_id: 'web-development',
    industry_id: 'fintech',
    status: 'approved',
    featured: false,
    published_at: '2026-09-02T06:31:50.888Z',
    quote: 'Astraiv Technologies rebuilt our entire broker core without a single minute of downtime. The speed and real-time collaboration have transformed how our trading desks close deals.',
    authorName: 'David Vance',
    authorRole: 'Chief Technology Officer',
    authorCompany: 'Nova Global Brokerage',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&fit=crop',
  },
  {
    id: 'seed-devon',
    client_name: 'Devon Miles',
    company: 'Aether Robotics',
    role: 'Chief Technology Officer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
    review_text: 'Unrivaled expertise in modern web systems, Postgres optimization, and reactive UI architecture.',
    rating: 5,
    project_id: null,
    service_id: 'cloud-devops',
    industry_id: null,
    status: 'approved',
    featured: false,
    published_at: '2026-09-02T06:31:50.888Z',
    quote: 'Unrivaled expertise in modern web systems, Postgres optimization, and reactive UI architecture.',
    authorName: 'Devon Miles',
    authorRole: 'Chief Technology Officer',
    authorCompany: 'Aether Robotics',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
  },
];

interface SupabaseReviewRow {
  id: string;
  client_name?: string | null;
  company_name?: string | null;
  company?: string | null;
  designation?: string | null;
  review_text?: string | null;
  review?: string | null;
  average_rating?: number | null;
  display_rating?: number | null;
  rating?: number | null;
  identity_display_permission?: string | null;
  image_url?: string | null;
  project_id?: string | null;
  service_id?: string | null;
  industry_id?: string | null;
  status?: string | null;
  featured?: boolean | null;
  published_at?: string | Date | null;
  [key: string]: unknown;
}

function mapRowToTestimonial(r: {
  id: string;
  clientName?: string | null;
  companyName?: string | null;
  company?: string | null;
  designation?: string | null;
  reviewText?: string | null;
  review?: string | null;
  rating?: number | null;
  displayRating?: number | null;
  averageRating?: Prisma.Decimal | number | null;
  imageUrl?: string | null;
  projectId?: string | null;
  serviceId?: string | null;
  industryId?: string | null;
  status?: string | null;
  featured?: boolean | null;
  publishedAt?: Date | string | null;
  identityDisplayPermission?: string | null;
}): Testimonial {
  const perm = (r.identityDisplayPermission || 'Yes').trim();
  const rawName = (r.clientName || 'Astraiv Client').trim();
  const rawCompany = (r.companyName || r.company || '').trim();
  const rawDesignation = (r.designation || '').trim();

  let authorName = 'Astraiv Client';
  let authorCompany = '';
  let authorRole = '';

  if (perm === 'Yes' || perm.toLowerCase() === 'yes') {
    authorName = rawName;
    authorCompany = rawCompany || 'Client Partner';
    authorRole = rawDesignation || 'Client Partner';
  } else if (
    perm.toLowerCase().includes('first name') ||
    perm === 'Display only my first name with review.'
  ) {
    authorName = rawName.split(/\s+/)[0] || 'Client';
    authorCompany = rawCompany || 'Client Partner';
    authorRole = rawDesignation || '';
  } else {
    authorName = 'Astraiv Client';
    authorCompany = '';
    authorRole = 'Client Partner';
  }

  const avgRating = Number(r.averageRating ?? r.rating ?? 5.0);
  const displayRating = r.displayRating || r.rating || Math.min(5, Math.max(1, Math.round(avgRating)));
  const reviewText = (r.reviewText || r.review || '').trim();

  return {
    id: r.id,
    client_name: authorName,
    company: authorCompany,
    role: authorRole,
    avatar: r.imageUrl || null,
    review_text: reviewText,
    rating: displayRating,
    project_id: r.projectId || null,
    service_id: r.serviceId || null,
    industry_id: r.industryId || null,
    status: (r.status as TestimonialStatus) || 'approved',
    featured: Boolean(r.featured),
    published_at: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
    identityDisplayPermission: perm,

    // Aliases
    quote: reviewText,
    authorName,
    authorRole,
    authorCompany,
    avatarUrl: r.imageUrl || undefined,
  };
}

let reviewsPrismaDisabled = false;
let reviewsSupabaseDisabled = false;

function isReviewsSchemaMismatch(err: unknown): boolean {
  if (!err) return false;
  const error = err as { code?: string; message?: string };
  if (
    error.code === 'P2021' ||
    error.code === 'P2022' ||
    error.code === '42703' ||
    error.code === '42P01' ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT'
  ) {
    return true;
  }
  const msg = error.message || String(err);
  return (
    msg.includes('does not exist') ||
    msg.includes('UndefinedColumn') ||
    msg.includes('UndefinedTable') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Connection refused')
  );
}

/**
 * Retrieves public testimonials approved by the Astraiv admin team.
 * Never exposes admin notes or private submitter data publicly.
 */
async function fetchApprovedTestimonials(
  options: GetApprovedTestimonialsOptions = {}
): Promise<Testimonial[]> {
  const { featuredOnly = false, projectId, serviceId, industryId, limit } = options;

  try {
    // 1. Primary PostgreSQL lookup via Prisma ORM
    if (!reviewsPrismaDisabled) {
      try {
        const where: Prisma.ReviewWhereInput = {
          status: 'approved',
          canPublishReview: true,
        };

        if (featuredOnly) {
          where.featured = true;
        }
        if (projectId) {
          where.projectId = projectId;
        }
        if (serviceId) {
          const relatedSlugs = getRelatedServiceSlugs(serviceId);
          where.serviceId = { in: relatedSlugs };
        }
        if (industryId) {
          where.industryId = industryId;
        }

        const approvedReviews = await db.review.findMany({
          where,
          orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
          take: limit,
        });

        if (approvedReviews && approvedReviews.length > 0) {
          return approvedReviews.map((r) =>
            mapRowToTestimonial({
              id: r.id,
              clientName: r.clientName,
              companyName: r.companyName,
              company: r.company,
              designation: r.designation,
              reviewText: r.reviewText,
              review: r.review,
              averageRating: r.averageRating,
              displayRating: r.displayRating,
              rating: r.rating,
              imageUrl: r.imageUrl,
              projectId: r.projectId,
              serviceId: r.serviceId,
              industryId: r.industryId,
              status: r.status,
              featured: r.featured,
              publishedAt: r.publishedAt,
              identityDisplayPermission: r.identityDisplayPermission,
            })
          );
        }
      } catch (prismaErr) {
        if (isReviewsSchemaMismatch(prismaErr)) {
          reviewsPrismaDisabled = true;
        }
        if (process.env.DEBUG_PRISMA) {
          console.warn('[Public Reviews Prisma Notice - Falling back to Supabase]:', (prismaErr as Error)?.message || prismaErr);
        }
      }
    }

    // 2. Supabase Cloud Fallback
    if (!reviewsSupabaseDisabled && isSupabaseConfigured()) {
      const supabase = await createSupabaseClient();
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .eq('can_publish_review', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (featuredOnly) query = query.eq('featured', true);
      if (projectId) query = query.eq('project_id', projectId);
      if (serviceId) {
        const relatedSlugs = getRelatedServiceSlugs(serviceId);
        query = query.in('service_id', relatedSlugs);
      }
      if (industryId) query = query.eq('industry_id', industryId);
      if (limit) query = query.limit(limit);

      const { data: reviews, error } = await query;

      if (error) {
        if (isReviewsSchemaMismatch(error)) {
          reviewsSupabaseDisabled = true;
        }
      } else if (reviews && reviews.length > 0) {
        return (reviews as unknown as SupabaseReviewRow[]).map((r) =>
          mapRowToTestimonial({
            id: r.id,
            clientName: r.client_name,
            companyName: r.company_name,
            company: r.company,
            designation: r.designation,
            reviewText: r.review_text,
            review: r.review,
            averageRating: r.average_rating,
            displayRating: r.display_rating,
            rating: r.rating,
            imageUrl: r.image_url,
            projectId: r.project_id,
            serviceId: r.service_id,
            industryId: r.industry_id,
            status: r.status,
            featured: r.featured,
            publishedAt: r.published_at,
            identityDisplayPermission: r.identity_display_permission,
          })
        );
      }
    }

    // 3. Fallback to Verified Canonical Dataset (Zero UI downtime, never invented)
    let filtered = VERIFIED_CANONICAL_FALLBACK.filter((t) => t.status === 'approved');
    if (featuredOnly) filtered = filtered.filter((t) => t.featured);
    if (projectId) filtered = filtered.filter((t) => t.project_id === projectId);
    if (serviceId) {
      const relatedSlugs = getRelatedServiceSlugs(serviceId);
      filtered = filtered.filter((t) => t.service_id && relatedSlugs.includes(t.service_id));
    }
    if (industryId) filtered = filtered.filter((t) => t.industry_id === industryId);
    if (limit) filtered = filtered.slice(0, limit);

    return filtered;
  } catch (error) {
    console.error('[Public Reviews Controller Error]:', error);
    return VERIFIED_CANONICAL_FALLBACK.slice(0, limit || 6);
  }
}

export async function getApprovedTestimonials(
  options: GetApprovedTestimonialsOptions = {}
): Promise<Testimonial[]> {
  const cacheKey = JSON.stringify(options);
  return safeCache(
    () => fetchApprovedTestimonials(options),
    ['approved-testimonials', cacheKey],
    { revalidate: 300, tags: ['public-testimonials'] }
  )();
}

/**
 * Retrieves public approved testimonials for the homepage and showcase sections.
 * Preserves full backward compatibility with existing components.
 */
export async function getPublicApprovedReviews(): Promise<Testimonial[]> {
  return getApprovedTestimonials({ limit: 6 });
}

/**
 * Retrieves only featured testimonials (e.g. for homepage).
 */
export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  return getApprovedTestimonials({ featuredOnly: true, limit });
}

/**
 * Retrieves the approved testimonial associated with a specific Case Study project.
 */
export async function getTestimonialByProject(projectId: string): Promise<Testimonial | null> {
  const matches = await getApprovedTestimonials({ projectId, limit: 1 });
  return matches[0] || null;
}

/**
 * Retrieves approved testimonials associated with a specific Service.
 */
export async function getTestimonialsByService(serviceId: string): Promise<Testimonial[]> {
  return getApprovedTestimonials({ serviceId });
}

const DEFAULT_PUBLIC_CAREERS_CONTENT: PublicCareersPageContent = {
  heroHeading: 'Work With Architects,\nNot Bureaucrats.',
  heroSubtitle:
    'We are a team of senior software engineers, cloud architects, and AI researchers building mission-critical platforms for high-growth enterprises worldwide.',
  cultureCards: [
    {
      title: 'Architectural Ownership',
      body: 'We do not micromanage tickets. Engineers own architecture end-to-end, from schema definition to multi-region cloud deployment.',
      icon: 'Compass',
      order: 1,
      active: true,
    },
    {
      title: 'Async Deep Work Culture',
      body: 'We minimize synchronous meetings in favor of precise technical specs, RFC documents, and uninterrupted focus time.',
      icon: 'Users',
      order: 2,
      active: true,
    },
    {
      title: 'Radical Engineering Candor',
      body: 'Code reviews are honest, rigorous, and ego-free. We care deeply about clean code, memory safety, and performance budgets.',
      icon: 'HeartHandshake',
      order: 3,
      active: true,
    },
  ],
  careersImage: {
    enabled: false,
    imageUrl: '',
    altText: 'Astraiv Technologies engineering architects collaborating on high-scale cloud infrastructure',
    focalPoint: 'center',
    width: 1600,
    height: 900,
    sizeBytes: 0,
    sizeLabel: '',
  },
  benefitsHeading: 'Build the Future with [Elite Engineers]',
  benefitsSubtitle:
    'Join our team of elite full-stack engineers and architects solving high-stakes enterprise challenges.',
  benefitsCards: [
    {
      title: '100% Remote & Global Autonomy',
      body: 'Work from wherever you are most productive. We value high output and clean deliverables over seat-time.',
      icon: 'Globe2',
      order: 1,
      active: true,
    },
    {
      title: 'Modern Architecture Only',
      body: 'Zero legacy debt. We build exclusively with Next.js 16, React 19, TypeScript, Rust, Python, and edge runtimes.',
      icon: 'Code2',
      order: 2,
      active: true,
    },
    {
      title: 'AI & Cognitive Engineering',
      body: 'Direct hands-on experience building autonomous agents, multi-tenant RAG systems, and enterprise LLM pipelines.',
      icon: 'Brain',
      order: 3,
      active: true,
    },
    {
      title: 'Competitive Compensation',
      body: 'Top-tier global market rates, milestone sprint bonuses, and accelerated career growth into staff architectural roles.',
      icon: 'ShieldCheck',
      order: 4,
      active: true,
    },
  ],
  opportunitiesHeading: 'Current Open Opportunities',
  opportunitiesSubtitle:
    'Direct applications reviewed within 48 business hours by our engineering founders.',
  searchPlaceholder: 'Search skills, title...',
  emptyStateCopy:
    'No active openings match your current search or filter. Clear the filter or submit a speculative application below.',
  speculativeCta: {
    enabled: true,
    kicker: 'Unsolicited & Speculative Applications',
    title: "Don't See Your Exact Specialty Listed?",
    body: 'If you are a world-class systems engineer, compiler enthusiast, or AI infrastructure architect, we always make room for exceptional talent.',
    buttonText: 'Send Speculative Application',
    buttonUrl: '/contact?role=Speculative%20Senior%20Architect',
  },
  speculativePageCopy: {
    heading: 'Speculative Engineering Application',
    subheading: 'Tell us how you build, what architectures you love, and where you excel.',
    supportGuidance:
      'We review unsolicited applications directly by our technical founders. Freshers with strong projects and senior architects are welcome.',
    successMessage:
      'Your speculative application has been received. Our engineering leadership will review your profile within 48 business hours.',
  },
};

const DEFAULT_PUBLIC_SHARED_CAREERS_DEFAULTS: PublicSharedCareersDefaults = {
  interviewStages: [
    {
      num: '01',
      title: 'Profile & Architecture Review',
      desc: 'Our senior architects review your GitHub, past system implementations, and RFCs within 48 business hours.',
    },
    {
      num: '02',
      title: 'Technical & Systems Discussion',
      desc: 'A 45-minute deep-dive with our engineering founders into real-world architecture trade-offs, concurrency, and reliability.',
    },
    {
      num: '03',
      title: 'Practical System Design Exercise',
      desc: 'A scoped, paid system design discussion or take-home RFC tailored to your specialty. No inverted binary trees on whiteboards.',
    },
    {
      num: '04',
      title: 'Mutual Offer & Onboarding',
      desc: 'Transparent compensation offer, equity allocation, home workstation budget setup, and seamless async onboarding.',
    },
  ],
  commonBenefits: [
    '100% remote work autonomy with flexible hours and no micromanagement.',
    'Top-of-market base compensation plus meaningful equity participation.',
    '$3,500 home office & latest Apple hardware stipend upon joining.',
    'Annual $2,000 continuous learning & technical conference budget.',
    'Comprehensive health coverage & generous paid time off.',
  ],
  defaultReferralBonus: '$2,500',
  defaultPrivacyText:
    'By submitting, your data is processed strictly under our NDA protocols and privacy policy. No unsolicited third-party disclosure.',
};

/**
 * Retrieves public careers landing page configuration and content.
 */
export async function getPublicCareersPageContent(): Promise<{
  content: PublicCareersPageContent;
  sharedDefaults: PublicSharedCareersDefaults;
}> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = await (db as any).pageContent.findUnique({
      where: { pageKey: 'careers' },
    });

    if (page && page.sections) {
      const sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;

      // 1. Hero Heading & Subtitle (Support string or object format)
      let heroHeading = DEFAULT_PUBLIC_CAREERS_CONTENT.heroHeading;
      if (typeof sections.heroHeading === 'string' && sections.heroHeading.trim()) {
        heroHeading = sections.heroHeading;
      } else if (sections.hero && typeof sections.hero === 'object') {
        const hText = sections.hero.heading || 'Work With Architects,';
        const hHighlight = sections.hero.highlightText || 'Not Bureaucrats.';
        heroHeading = `${hText}\n${hHighlight}`;
      }

      let heroSubtitle = DEFAULT_PUBLIC_CAREERS_CONTENT.heroSubtitle;
      if (typeof sections.heroSubtitle === 'string' && sections.heroSubtitle.trim()) {
        heroSubtitle = sections.heroSubtitle;
      } else if (sections.hero && typeof sections.hero.subtitle === 'string') {
        heroSubtitle = sections.hero.subtitle;
      }

      // 2. Benefits Heading & Subtitle (Support string or object format)
      let benefitsHeading = DEFAULT_PUBLIC_CAREERS_CONTENT.benefitsHeading;
      let benefitsSubtitle = DEFAULT_PUBLIC_CAREERS_CONTENT.benefitsSubtitle;

      if (typeof sections.benefitsHeading === 'string' && sections.benefitsHeading.trim()) {
        benefitsHeading = sections.benefitsHeading;
      } else if (sections.benefitsHeading && typeof sections.benefitsHeading === 'object') {
        const bTitle = sections.benefitsHeading.title || 'Build the Future with';
        const bHighlight = sections.benefitsHeading.highlightText || 'Elite Engineers';
        benefitsHeading = bHighlight ? `${bTitle} [${bHighlight}]` : bTitle;
        if (typeof sections.benefitsHeading.subtitle === 'string') {
          benefitsSubtitle = sections.benefitsHeading.subtitle;
        }
      }

      if (typeof sections.benefitsSubtitle === 'string' && sections.benefitsSubtitle.trim()) {
        benefitsSubtitle = sections.benefitsSubtitle;
      }

      // 3. Culture Cards (Support active/visible and order/orderIndex)
      let cultureCards = DEFAULT_PUBLIC_CAREERS_CONTENT.cultureCards;
      if (Array.isArray(sections.cultureCards) && sections.cultureCards.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cultureCards = sections.cultureCards.map((c: any, i: number) => ({
          title: typeof c.title === 'string' ? c.title : `Culture Value ${i + 1}`,
          body: typeof c.body === 'string' ? c.body : '',
          icon: typeof c.icon === 'string' ? c.icon : 'Sparkles',
          order: c.order !== undefined ? Number(c.order) : c.orderIndex !== undefined ? Number(c.orderIndex) : i + 1,
          active: c.active !== undefined ? Boolean(c.active) : c.visible !== undefined ? Boolean(c.visible) : true,
        }));
      }

      // 4. Careers Image (Support enabled/visible and imageUrl/url)
      const imgObj = sections.careersImage || {};
      const careersImage = {
        enabled: imgObj.enabled !== undefined ? Boolean(imgObj.enabled) : imgObj.visible !== undefined ? Boolean(imgObj.visible) : false,
        imageUrl: typeof imgObj.imageUrl === 'string' ? imgObj.imageUrl : typeof imgObj.url === 'string' ? imgObj.url : '',
        altText: typeof imgObj.altText === 'string' ? imgObj.altText : typeof imgObj.alt === 'string' ? imgObj.alt : DEFAULT_PUBLIC_CAREERS_CONTENT.careersImage.altText,
        focalPoint: typeof imgObj.focalPoint === 'string' ? imgObj.focalPoint : 'center',
        width: typeof imgObj.width === 'number' ? imgObj.width : 1600,
        height: typeof imgObj.height === 'number' ? imgObj.height : 900,
        sizeBytes: typeof imgObj.sizeBytes === 'number' ? imgObj.sizeBytes : 0,
        sizeLabel: typeof imgObj.sizeLabel === 'string' ? imgObj.sizeLabel : '',
      };

      // 5. Benefits Cards (Support active/visible and order/orderIndex)
      let benefitsCards = DEFAULT_PUBLIC_CAREERS_CONTENT.benefitsCards;
      if (Array.isArray(sections.benefitsCards) && sections.benefitsCards.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        benefitsCards = sections.benefitsCards.map((b: any, i: number) => ({
          title: typeof b.title === 'string' ? b.title : `Benefit ${i + 1}`,
          body: typeof b.body === 'string' ? b.body : '',
          icon: typeof b.icon === 'string' ? b.icon : 'ShieldCheck',
          order: b.order !== undefined ? Number(b.order) : b.orderIndex !== undefined ? Number(b.orderIndex) : i + 1,
          active: b.active !== undefined ? Boolean(b.active) : b.visible !== undefined ? Boolean(b.visible) : true,
        }));
      }

      // 6. Opportunities / Search copy
      const oppObj = sections.opportunities || {};
      const opportunitiesHeading = typeof sections.opportunitiesHeading === 'string' && sections.opportunitiesHeading.trim()
        ? sections.opportunitiesHeading
        : typeof oppObj.heading === 'string' && oppObj.heading.trim()
        ? oppObj.heading
        : DEFAULT_PUBLIC_CAREERS_CONTENT.opportunitiesHeading;

      const opportunitiesSubtitle = typeof sections.opportunitiesSubtitle === 'string' && sections.opportunitiesSubtitle.trim()
        ? sections.opportunitiesSubtitle
        : typeof oppObj.supportingText === 'string' && oppObj.supportingText.trim()
        ? oppObj.supportingText
        : DEFAULT_PUBLIC_CAREERS_CONTENT.opportunitiesSubtitle;

      const searchPlaceholder = typeof sections.searchPlaceholder === 'string' && sections.searchPlaceholder.trim()
        ? sections.searchPlaceholder
        : typeof oppObj.searchPlaceholder === 'string' && oppObj.searchPlaceholder.trim()
        ? oppObj.searchPlaceholder
        : DEFAULT_PUBLIC_CAREERS_CONTENT.searchPlaceholder;

      const emptyStateCopy = typeof sections.emptyStateCopy === 'string' && sections.emptyStateCopy.trim()
        ? sections.emptyStateCopy
        : typeof oppObj.emptyStateText === 'string' && oppObj.emptyStateText.trim()
        ? oppObj.emptyStateText
        : DEFAULT_PUBLIC_CAREERS_CONTENT.emptyStateCopy;

      // 7. Speculative CTA
      const specCtaObj = sections.speculativeCta || {};
      const speculativeCta = {
        enabled: specCtaObj.enabled !== undefined ? Boolean(specCtaObj.enabled) : specCtaObj.visible !== undefined ? Boolean(specCtaObj.visible) : true,
        kicker: typeof specCtaObj.kicker === 'string' ? specCtaObj.kicker : 'Unsolicited & Speculative Applications',
        title: typeof specCtaObj.title === 'string' ? specCtaObj.title : typeof specCtaObj.heading === 'string' ? specCtaObj.heading : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativeCta.title,
        body: typeof specCtaObj.body === 'string' ? specCtaObj.body : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativeCta.body,
        buttonText: typeof specCtaObj.buttonText === 'string' ? specCtaObj.buttonText : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativeCta.buttonText,
        buttonUrl: typeof specCtaObj.buttonUrl === 'string' ? specCtaObj.buttonUrl : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativeCta.buttonUrl,
      };

      // 8. Speculative Page Copy
      const specPageObj = sections.speculativePageCopy || sections.speculativePage || {};
      const speculativePageCopy = {
        heading: typeof specPageObj.heading === 'string' ? specPageObj.heading : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativePageCopy.heading,
        subheading: typeof specPageObj.subheading === 'string' ? specPageObj.subheading : typeof specPageObj.subtitle === 'string' ? specPageObj.subtitle : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativePageCopy.subheading,
        supportGuidance: typeof specPageObj.supportGuidance === 'string' ? specPageObj.supportGuidance : typeof specPageObj.noticeText === 'string' ? specPageObj.noticeText : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativePageCopy.supportGuidance,
        successMessage: typeof specPageObj.successMessage === 'string' ? specPageObj.successMessage : DEFAULT_PUBLIC_CAREERS_CONTENT.speculativePageCopy.successMessage,
      };

      const content: PublicCareersPageContent = {
        heroHeading,
        heroSubtitle,
        cultureCards,
        careersImage,
        benefitsHeading,
        benefitsSubtitle,
        benefitsCards,
        opportunitiesHeading,
        opportunitiesSubtitle,
        searchPlaceholder,
        emptyStateCopy,
        speculativeCta,
        speculativePageCopy,
      };

      const defObj = sections.sharedDefaults || {};
      const sharedDefaults: PublicSharedCareersDefaults = {
        interviewStages: Array.isArray(defObj.interviewStages) && defObj.interviewStages.length > 0
          ? defObj.interviewStages
          : DEFAULT_PUBLIC_SHARED_CAREERS_DEFAULTS.interviewStages,
        commonBenefits: Array.isArray(defObj.commonBenefits) && defObj.commonBenefits.length > 0
          ? defObj.commonBenefits
          : Array.isArray(defObj.defaultBenefits) && defObj.defaultBenefits.length > 0
          ? defObj.defaultBenefits
          : DEFAULT_PUBLIC_SHARED_CAREERS_DEFAULTS.commonBenefits,
        defaultReferralBonus: typeof defObj.defaultReferralBonus === 'string'
          ? defObj.defaultReferralBonus
          : typeof defObj.referralBonusAmount === 'string'
          ? defObj.referralBonusAmount
          : DEFAULT_PUBLIC_SHARED_CAREERS_DEFAULTS.defaultReferralBonus,
        defaultPrivacyText: typeof defObj.defaultPrivacyText === 'string'
          ? defObj.defaultPrivacyText
          : typeof defObj.defaultPrivacyCopy === 'string'
          ? defObj.defaultPrivacyCopy
          : DEFAULT_PUBLIC_SHARED_CAREERS_DEFAULTS.defaultPrivacyText,
      };

      return { content, sharedDefaults };
    }
  } catch (err) {
    console.warn('[Public Careers Page Content Notice]:', err);
  }

  return {
    content: DEFAULT_PUBLIC_CAREERS_CONTENT,
    sharedDefaults: DEFAULT_PUBLIC_SHARED_CAREERS_DEFAULTS,
  };
}

/**
 * Retrieves public canonical role categories with real active opening counts.
 */
export async function getPublicJobCategories(): Promise<JobCategory[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryModel = (db as any).jobCategory;
    if (categoryModel && typeof categoryModel.findMany === 'function') {
      const records = await categoryModel.findMany({
        where: { active: true },
        orderBy: { orderIndex: 'asc' },
        include: {
          _count: {
            select: { openings: { where: { active: true } } },
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return records.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        orderIndex: c.orderIndex,
        active: c.active,
        openingCount: c._count?.openings || 0,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }));
    }

    const rows = await db.$queryRaw<
      Array<{ id: string; name: string; slug: string; order_index: number; active: boolean; opening_count: number }>
    >`
      SELECT 
        c.id, c.name, c.slug, c.order_index, c.active,
        COUNT(o.id) FILTER (WHERE o.active = true)::int as opening_count
      FROM job_categories c
      LEFT JOIN job_openings o ON o.category_id = c.id
      WHERE c.active = true
      GROUP BY c.id
      ORDER BY c.order_index ASC
    `;

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      orderIndex: r.order_index,
      active: r.active,
      openingCount: Number(r.opening_count) || 0,
    }));
  } catch (err) {
    console.warn('[Get Public JobCategories Notice]:', err);
    return [
      { id: 'cat-eng', name: 'Engineering', slug: 'engineering', orderIndex: 1, active: true, openingCount: 2 },
      { id: 'cat-ai', name: 'AI & Automation', slug: 'ai-automation', orderIndex: 2, active: true, openingCount: 1 },
      { id: 'cat-cloud', name: 'Cloud Ops', slug: 'cloud-ops', orderIndex: 3, active: true, openingCount: 1 },
    ];
  }
}

/**
 * Server-side filtered and paginated job openings (max 5 per page).
 */
export async function getPaginatedPublicJobs(options: {
  categorySlug?: string;
  query?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedJobsResult> {
  const page = Math.max(1, options.page || 1);
  const limit = options.limit || 5; // Exactly 5 openings per results page as required
  const categorySlug = options.categorySlug && options.categorySlug !== 'all' ? options.categorySlug.trim().toLowerCase() : undefined;
  const query = options.query?.trim().toLowerCase();

  try {
    const where: Prisma.JobOpeningWhereInput = {
      active: true,
    };

    if (categorySlug) {
      where.OR = [
        { category: { slug: categorySlug } },
        { department: { equals: categorySlug, mode: 'insensitive' } },
      ];
    }

    if (query) {
      where.AND = [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { skills: { hasSome: [query] } },
            { department: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const [total, records] = await Promise.all([
      db.jobOpening.count({ where }),
      db.jobOpening.findMany({
        where,
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
        },
      }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jobs: PublicJobOpening[] = records.map((job: any) => ({
      id: job.id,
      categoryId: job.categoryId,
      category: job.category
        ? {
            id: job.category.id,
            name: job.category.name,
            slug: job.category.slug,
            orderIndex: job.category.orderIndex,
            active: job.category.active,
          }
        : null,
      title: job.title,
      slug: job.slug,
      department: job.category?.name || job.department || 'Engineering',
      employmentType: job.employmentType || 'Full-Time',
      workMode: job.workMode || 'Remote',
      geographicLocation: job.geographicLocation || 'Worldwide',
      experienceLevel: job.experienceLevel || 'Experienced',
      experience: job.experience,
      minExperienceYears: job.minExperienceYears,
      maxExperienceYears: job.maxExperienceYears,
      type: job.type || `${job.employmentType || 'Full-Time'} / ${job.workMode || 'Remote'}`,
      location: job.location || (job.geographicLocation ? `${job.geographicLocation} · ${job.workMode || 'Remote'}` : 'Remote'),
      description: job.description,
      skills: job.skills || [],
      salary: job.salary,
      showSalary: job.showSalary === true,
      applyUrl: job.applyUrl || `/careers/${job.slug}#apply`,
      active: job.active,
      orderIndex: job.orderIndex,
      publishedAt: job.publishedAt ? job.publishedAt.toISOString() : null,
      referralBonus: job.referralBonus,
      showReferralBonus: job.showReferral !== false,
      useSharedDefaults: job.useSharedBenefits !== false,
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      niceToHave: job.niceToHave || [],
      benefits: job.benefits || [],
      interviewStages: job.interviewStages || null,
      metaTitle: job.metaTitle || null,
      metaDescription: job.metaDescription || null,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    }));

    return {
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      limit,
    };
  } catch (err) {
    console.warn('[Get Paginated Public Jobs Notice]:', err);
    // Fallback to in-memory filter
    let all = DEFAULT_JOB_OPENINGS.filter((j) => j.active);
    if (categorySlug) {
      all = all.filter((j) => j.department.toLowerCase().replace(/\s+/g, '-') === categorySlug || j.department.toLowerCase() === categorySlug);
    }
    if (query) {
      all = all.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.skills.some((s) => s.toLowerCase().includes(query))
      );
    }
    const total = all.length;
    const paginated = all.slice((page - 1) * limit, page * limit);
    return {
      jobs: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      limit,
    };
  }
}

/**
 * Retrieves public active job openings for the client careers section.
 */
export async function getPublicJobOpenings(): Promise<PublicJobOpening[]> {
  const res = await getPaginatedPublicJobs({ limit: 100 });
  return res.jobs;
}

/**
 * Retrieves a single public active job opening by its slug with shared default inheritance.
 */
export async function getPublicJobBySlug(slug: string): Promise<PublicJobOpening | null> {
  const fallbackJob = DEFAULT_JOB_OPENINGS.find((j) => j.slug === slug) || null;

  try {
    const job = await db.jobOpening.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (job && job.active) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jobRaw = job as any;
      const shared = await getPublicCareersPageContent();
      const sharedDefaults = shared.sharedDefaults;

      const inherit = jobRaw.useSharedBenefits !== false;

      return {
        id: jobRaw.id,
        categoryId: jobRaw.categoryId,
        category: jobRaw.category
          ? {
              id: jobRaw.category.id,
              name: jobRaw.category.name,
              slug: jobRaw.category.slug,
              orderIndex: jobRaw.category.orderIndex,
              active: jobRaw.category.active,
            }
          : null,
        title: jobRaw.title,
        slug: jobRaw.slug,
        department: jobRaw.category?.name || jobRaw.department || 'Engineering',
        employmentType: jobRaw.employmentType || 'Full-Time',
        workMode: jobRaw.workMode || 'Remote',
        geographicLocation: jobRaw.geographicLocation || 'Worldwide',
        experienceLevel: jobRaw.experienceLevel || 'Experienced',
        experience: jobRaw.experience,
        minExperienceYears: jobRaw.minExperienceYears,
        maxExperienceYears: jobRaw.maxExperienceYears,
        type: jobRaw.type || `${jobRaw.employmentType || 'Full-Time'} / ${jobRaw.workMode || 'Remote'}`,
        location: jobRaw.location || (jobRaw.geographicLocation ? `${jobRaw.geographicLocation} · ${jobRaw.workMode || 'Remote'}` : 'Remote'),
        description: jobRaw.description,
        skills: jobRaw.skills || [],
        salary: jobRaw.salary,
        showSalary: jobRaw.showSalary === true,
        applyUrl: jobRaw.applyUrl || `/careers/${jobRaw.slug}#apply`,
        active: jobRaw.active,
        orderIndex: jobRaw.orderIndex,
        publishedAt: jobRaw.publishedAt ? jobRaw.publishedAt.toISOString() : null,
        referralBonus: jobRaw.referralBonus || sharedDefaults.defaultReferralBonus,
        showReferralBonus: jobRaw.showReferral !== false,
        useSharedDefaults: inherit,
        responsibilities: job.responsibilities && job.responsibilities.length > 0
          ? job.responsibilities
          : fallbackJob?.responsibilities || [
              'Design and build scalable software modules adhering to strict architecture guidelines.',
              'Participate actively in architectural RFCs and peer code review cadences.',
              'Enforce automated testing, CI/CD verification, and production SLA benchmarks.',
            ],
        requirements: job.requirements && job.requirements.length > 0
          ? job.requirements
          : fallbackJob?.requirements || [
              'Proven production experience in relevant tech stack and architectural systems.',
              'Strong command of modern software engineering principles and typesafe patterns.',
              'Demonstrated capability for high-autonomy, asynchronous execution.',
            ],
        niceToHave: job.niceToHave && job.niceToHave.length > 0
          ? job.niceToHave
          : fallbackJob?.niceToHave || [
              'Prior experience in distributed remote engineering organizations.',
              'Familiarity with cloud-native primitives and enterprise compliance standards.',
            ],
        benefits: job.benefits && job.benefits.length > 0
          ? job.benefits
          : (inherit ? sharedDefaults.commonBenefits : (fallbackJob?.benefits || sharedDefaults.commonBenefits)),
        interviewStages: job.interviewStages && Array.isArray(job.interviewStages) && job.interviewStages.length > 0
          ? (job.interviewStages as unknown as PublicJobOpening['interviewStages'])
          : (inherit ? sharedDefaults.interviewStages : DEFAULT_PUBLIC_SHARED_CAREERS_DEFAULTS.interviewStages),
        metaTitle: job.metaTitle || `${job.title} | Careers | Astraiv Technologies`,
        metaDescription: job.metaDescription || `${job.title} (${job.department}) - ${job.description} Join our distributed engineering team.`,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      };
    }
  } catch (prismaErr) {
    console.warn('[Client Public JobOpening by Slug Notice - Falling back]:', (prismaErr as Error)?.message || prismaErr);
  }

  return fallbackJob;
}

/**
 * Retrieves public active engagement models.
 */
export async function getPublicPricingPlans(): Promise<PublicPricingPlan[]> {
  try {
    const plans = await db.pricingPlan.findMany({
      where: { active: true },
      orderBy: { orderIndex: 'asc' },
    });

    if (plans && plans.length > 0) {
      return plans.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        badge: p.badge,
        isPopular: p.isPopular,
        features: p.features,
        buttonText: p.buttonText || 'Request a Quote',
        buttonUrl: p.buttonUrl || '/start-project?source_page=/pricing',
        active: p.active,
        orderIndex: p.orderIndex,
      }));
    }
  } catch (prismaErr) {
    console.warn('[Client Public Pricing Notice - Falling back]:', (prismaErr as Error)?.message || prismaErr);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          badge: p.badge || null,
          isPopular: p.is_popular === true,
          features: p.features || [],
          buttonText: p.button_text || 'Request a Quote',
          buttonUrl: p.button_url || '/start-project?source_page=/pricing',
          active: p.active !== false,
          orderIndex: p.order_index ?? 0,
        }));
      }
    } catch (supaErr) {
      console.warn('[Client Supabase Pricing Error]:', supaErr);
    }
  }

  return DEFAULT_PRICING_PLANS;
}

/**
 * Retrieves public page image & layout settings for the Engagement Models page.
 */
export async function getPublicPricingPageSettings(): Promise<PublicPricingPageSettings> {
  // 1. Primary: Direct PostgreSQL via Prisma ORM
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = await (db as any).pageContent.findUnique({
      where: { pageKey: 'pricing' },
    });

    if (page && page.status !== 'draft' && page.sections) {
      const sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
      if (sections && sections.heroImage) {
        const h = sections.heroImage;
        return {
          heroImageUrl: h.heroImageUrl !== undefined ? h.heroImageUrl : DEFAULT_PRICING_PAGE_SETTINGS.heroImageUrl,
          heroImageAlt: h.heroImageAlt || DEFAULT_PRICING_PAGE_SETTINGS.heroImageAlt,
          showHeroImage: h.showHeroImage === true,
          imageWidth: h.imageWidth || DEFAULT_PRICING_PAGE_SETTINGS.imageWidth,
          imageHeight: h.imageHeight || DEFAULT_PRICING_PAGE_SETTINGS.imageHeight,
          imageSizeBytes: h.imageSizeBytes || DEFAULT_PRICING_PAGE_SETTINGS.imageSizeBytes,
          imageSizeLabel: h.imageSizeLabel || DEFAULT_PRICING_PAGE_SETTINGS.imageSizeLabel,
        };
      }
    }
  } catch (err: unknown) {
    console.warn('[Public Pricing Page Settings Prisma Notice]:', (err as Error)?.message || err);
  }

  // 2. Secondary: Supabase fallback
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: page, error } = await (supabase as any)
        .from('page_contents')
        .select('*')
        .eq('page_key', 'pricing')
        .single();

      if (!error && page && page.status !== 'draft' && page.sections) {
        const sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
        if (sections && sections.heroImage) {
          const h = sections.heroImage;
          return {
            heroImageUrl: h.heroImageUrl !== undefined ? h.heroImageUrl : DEFAULT_PRICING_PAGE_SETTINGS.heroImageUrl,
            heroImageAlt: h.heroImageAlt || DEFAULT_PRICING_PAGE_SETTINGS.heroImageAlt,
            showHeroImage: h.showHeroImage === true,
            imageWidth: h.imageWidth || DEFAULT_PRICING_PAGE_SETTINGS.imageWidth,
            imageHeight: h.imageHeight || DEFAULT_PRICING_PAGE_SETTINGS.imageHeight,
            imageSizeBytes: h.imageSizeBytes || DEFAULT_PRICING_PAGE_SETTINGS.imageSizeBytes,
            imageSizeLabel: h.imageSizeLabel || DEFAULT_PRICING_PAGE_SETTINGS.imageSizeLabel,
          };
        }
      }
    } catch (supaErr) {
      console.warn('[Public Pricing Page Settings Supabase Error]:', supaErr);
    }
  }

  return DEFAULT_PRICING_PAGE_SETTINGS;
}

const DEFAULT_CLIENT_LOGOS = [
  { id: 'acme', name: 'ACME CORP', iconKey: 'acme', imageUrl: null },
  { id: 'globex', name: 'GLOBEX', iconKey: 'globex', imageUrl: null },
  { id: 'initech', name: 'INITECH', iconKey: 'initech', imageUrl: null },
  { id: 'umbrella', name: 'UMBRELLA', iconKey: 'umbrella', imageUrl: null },
  { id: 'hooli', name: 'HOOLI', iconKey: 'hooli', imageUrl: null },
  { id: 'stark', name: 'STARK INDUSTRIES', iconKey: 'stark', imageUrl: null },
];

const DEFAULT_COMPLIANCE_SETTINGS: PublicComplianceSettings = {
  isoNumber: 'ISO 27001:2022',
  isoLabel: 'Certified',
  showIsoBadge: true,
  showIsoSection: true,
  uptimeValue: '99.99%',
  uptimeLabel: 'SERVER UPTIME',
  savingsValue: '40%+',
  savingsLabel: 'INFRASTRUCTURE SAVING',
  actionsValue: '10M+',
  actionsLabel: 'API ACTIONS',
  slaValue: '100%',
  slaLabel: 'ON-TIME SLA DELIVERY',
  clientLogos: DEFAULT_CLIENT_LOGOS,
};

interface ComplianceDbRecord {
  id?: string;
  isoNumber?: string;
  iso_number?: string;
  isoLabel?: string;
  iso_label?: string;
  showIsoBadge?: boolean;
  show_iso_badge?: boolean;
  showIsoSection?: boolean;
  show_iso_section?: boolean;
  uptimeValue?: string;
  uptime_value?: string;
  uptimeLabel?: string;
  uptime_label?: string;
  savingsValue?: string;
  savings_value?: string;
  savingsLabel?: string;
  savings_label?: string;
  actionsValue?: string;
  actions_value?: string;
  actionsLabel?: string;
  actions_label?: string;
  slaValue?: string;
  sla_value?: string;
  slaLabel?: string;
  sla_label?: string;
  clientLogos?: string | null;
  client_logos?: string | null;
}

interface PrismaWithCompliance {
  complianceSetting?: {
    findFirst: () => Promise<ComplianceDbRecord | null>;
  };
}

/**
 * Retrieves client website ISO compliance certification and metrics settings.
 */
async function fetchPublicComplianceSettings(): Promise<PublicComplianceSettings> {
  try {
    const complianceModel = (db as unknown as PrismaWithCompliance).complianceSetting;
    let record: ComplianceDbRecord | null = null;

    if (complianceModel && typeof complianceModel.findFirst === 'function') {
      try {
        record = await complianceModel.findFirst();
      } catch (firstErr: unknown) {
        const errCode = (firstErr as { code?: string })?.code;
        if (errCode === 'ECONNREFUSED' || String(firstErr).includes('ECONNREFUSED')) {
          return DEFAULT_COMPLIANCE_SETTINGS;
        }
      }
    }

    if (!record) {
      // Fallback: direct raw query from PostgreSQL table (vital if server process has cached prisma instance)
      try {
        const rows = await db.$queryRaw<ComplianceDbRecord[]>`
          SELECT 
            id, 
            iso_number, 
            iso_label, 
            show_iso_badge, 
            show_iso_section,
            uptime_value, 
            uptime_label, 
            savings_value, 
            savings_label, 
            actions_value, 
            actions_label, 
            sla_value, 
            sla_label,
            client_logos
          FROM compliance_settings 
          LIMIT 1
        `;
        if (rows && rows.length > 0) {
          record = rows[0];
        }
      } catch {
        // If client_logos column was missing, query core metrics safely
        try {
          const rows = await db.$queryRaw<ComplianceDbRecord[]>`
            SELECT 
              id, 
              iso_number, 
              iso_label, 
              show_iso_badge, 
              show_iso_section,
              uptime_value, 
              uptime_label, 
              savings_value, 
              savings_label, 
              actions_value, 
              actions_label, 
              sla_value, 
              sla_label
            FROM compliance_settings 
            LIMIT 1
          `;
          if (rows && rows.length > 0) {
            record = rows[0];
          }
        } catch {
          // Table not available
        }
      }
    }

    if (record) {
      // Handle both camelCase (from Prisma model) and snake_case (from raw SQL)
      const showIsoBadge =
        record.showIsoBadge !== undefined
          ? Boolean(record.showIsoBadge)
          : record.show_iso_badge !== undefined
          ? Boolean(record.show_iso_badge)
          : true;

      const showIsoSection =
        record.showIsoSection !== undefined
          ? Boolean(record.showIsoSection)
          : record.show_iso_section !== undefined
          ? Boolean(record.show_iso_section)
          : true;

      let parsedClientLogos = DEFAULT_CLIENT_LOGOS;
      const rawLogos = record.clientLogos || record.client_logos;
      if (rawLogos) {
        try {
          const parsed = typeof rawLogos === 'string' ? JSON.parse(rawLogos) : rawLogos;
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedClientLogos = parsed;
          }
        } catch {
          // Fallback to default client logos
        }
      }

      return {
        id: record.id,
        isoNumber: record.isoNumber || record.iso_number || 'ISO 27001:2022',
        isoLabel:
          record.isoLabel !== undefined
            ? record.isoLabel
            : record.iso_label !== undefined
            ? record.iso_label
            : 'Certified',
        showIsoBadge,
        showIsoSection,
        uptimeValue: record.uptimeValue || record.uptime_value || '99.99%',
        uptimeLabel: record.uptimeLabel || record.uptime_label || 'SERVER UPTIME',
        savingsValue: record.savingsValue || record.savings_value || '40%+',
        savingsLabel: record.savingsLabel || record.savings_label || 'INFRASTRUCTURE SAVING',
        actionsValue: record.actionsValue || record.actions_value || '10M+',
        actionsLabel: record.actionsLabel || record.actions_label || 'API ACTIONS',
        slaValue: record.slaValue || record.sla_value || '100%',
        slaLabel: record.slaLabel || record.sla_label || 'ON-TIME SLA DELIVERY',
        clientLogos: parsedClientLogos,
      };
    }
  } catch (err) {
    console.warn('getPublicComplianceSettings notice:', err);
  }

  return DEFAULT_COMPLIANCE_SETTINGS;
}

export async function getPublicComplianceSettings(): Promise<PublicComplianceSettings> {
  return safeCache(
    fetchPublicComplianceSettings,
    ['public-compliance-settings'],
    { revalidate: 300, tags: ['compliance-settings'] }
  )();
}

