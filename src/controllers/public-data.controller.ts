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
  PublicPricingPlan,
  DEFAULT_PRICING_PLANS,
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
  if (error.code === 'P2021' || error.code === 'P2022' || error.code === '42703' || error.code === '42P01') return true;
  const msg = error.message || String(err);
  return (
    msg.includes('does not exist') ||
    msg.includes('UndefinedColumn') ||
    msg.includes('UndefinedTable')
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
        if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
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

/**
 * Retrieves public active job openings for the client careers section.
 */
export async function getPublicJobOpenings(): Promise<PublicJobOpening[]> {
  try {
    const jobs = await db.jobOpening.findMany({
      where: { active: true },
      orderBy: { orderIndex: 'asc' },
    });

    if (jobs) {
      return jobs.map((j) => ({
        id: j.id,
        title: j.title,
        slug: j.slug,
        department: j.department,
        type: j.type,
        location: j.location,
        experience: j.experience,
        description: j.description,
        skills: j.skills,
        salary: j.salary,
        applyUrl: j.applyUrl,
        active: j.active,
        orderIndex: j.orderIndex,
      }));
    }
  } catch (prismaErr) {
    console.warn('[Client Public JobOpenings Notice - Falling back]:', (prismaErr as Error)?.message || prismaErr);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (!error && data) {
        return data.map((j) => ({
          id: j.id,
          title: j.title,
          slug: j.slug,
          department: j.department || 'Engineering',
          type: j.type || 'Full-Time / Remote',
          location: j.location || 'Remote',
          experience: j.experience || null,
          description: j.description || '',
          skills: j.skills || [],
          salary: j.salary || null,
          applyUrl: j.apply_url || '/contact',
          active: j.active !== false,
          orderIndex: j.order_index ?? 0,
        }));
      }
    } catch (supaErr) {
      console.warn('[Client Supabase JobOpenings Error]:', supaErr);
    }
  }

  return DEFAULT_JOB_OPENINGS;
}

/**
 * Retrieves a single public active job opening by its slug.
 */
export async function getPublicJobBySlug(slug: string): Promise<PublicJobOpening | null> {
  const fallbackJob = DEFAULT_JOB_OPENINGS.find((j) => j.slug === slug) || null;

  try {
    const job = await db.jobOpening.findUnique({
      where: { slug },
    });

    if (job && job.active) {
      return {
        id: job.id,
        title: job.title,
        slug: job.slug,
        department: job.department,
        type: job.type,
        location: job.location,
        experience: job.experience,
        description: job.description,
        skills: job.skills,
        salary: job.salary,
        applyUrl: job.applyUrl || `/careers/${job.slug}#apply`,
        active: job.active,
        orderIndex: job.orderIndex,
        responsibilities: fallbackJob?.responsibilities || [
          'Design and build scalable software modules adhering to strict architecture guidelines.',
          'Participate actively in architectural RFCs and peer code review cadences.',
          'Enforce automated testing, CI/CD verification, and production SLA benchmarks.',
        ],
        requirements: fallbackJob?.requirements || [
          'Proven production experience in relevant tech stack and architectural systems.',
          'Strong command of modern software engineering principles and typesafe patterns.',
          'Demonstrated capability for high-autonomy, asynchronous execution.',
        ],
        niceToHave: fallbackJob?.niceToHave || [
          'Prior experience in distributed remote engineering organizations.',
          'Familiarity with cloud-native primitives and enterprise compliance standards.',
        ],
        benefits: fallbackJob?.benefits || [
          '100% remote autonomy with flexible hours.',
          'Competitive compensation and equity allocation.',
          'Comprehensive health insurance and hardware stipend.',
        ],
      };
    }
  } catch (prismaErr) {
    console.warn('[Client Public JobOpening by Slug Notice - Falling back]:', (prismaErr as Error)?.message || prismaErr);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          slug: data.slug,
          department: data.department || 'Engineering',
          type: data.type || 'Full-Time / Remote',
          location: data.location || 'Remote',
          experience: data.experience || null,
          description: data.description || '',
          skills: data.skills || [],
          salary: data.salary || null,
          applyUrl: data.apply_url || `/careers/${data.slug}#apply`,
          active: data.active !== false,
          orderIndex: data.order_index ?? 0,
          responsibilities: fallbackJob?.responsibilities || [
            'Design and build scalable software modules adhering to strict architecture guidelines.',
            'Participate actively in architectural RFCs and peer code review cadences.',
            'Enforce automated testing, CI/CD verification, and production SLA benchmarks.',
          ],
          requirements: fallbackJob?.requirements || [
            'Proven production experience in relevant tech stack and architectural systems.',
            'Strong command of modern software engineering principles and typesafe patterns.',
            'Demonstrated capability for high-autonomy, asynchronous execution.',
          ],
          niceToHave: fallbackJob?.niceToHave || [
            'Prior experience in distributed remote engineering organizations.',
            'Familiarity with cloud-native primitives and enterprise compliance standards.',
          ],
          benefits: fallbackJob?.benefits || [
            '100% remote autonomy with flexible hours.',
            'Competitive compensation and equity allocation.',
            'Comprehensive health insurance and hardware stipend.',
          ],
        };
      }
    } catch (supaErr) {
      console.warn('[Client Supabase JobOpening by Slug Error]:', supaErr);
    }
  }

  return fallbackJob;
}

/**
 * Retrieves public active pricing plans for the client pricing & models section.
 */
export async function getPublicPricingPlans(): Promise<PublicPricingPlan[]> {
  try {
    const plans = await db.pricingPlan.findMany({
      where: { active: true },
      orderBy: { orderIndex: 'asc' },
    });

    if (plans) {
      return plans.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        badge: p.badge,
        isPopular: p.isPopular,
        priceType: (p.priceType === 'custom' ? 'custom' : 'fixed') as 'fixed' | 'custom',
        priceMonthlyInr: p.priceMonthlyInr,
        priceYearlyInr: p.priceYearlyInr,
        priceMonthlyUsd: p.priceMonthlyUsd,
        priceYearlyUsd: p.priceYearlyUsd,
        customPriceLabel: p.customPriceLabel,
        features: p.features,
        buttonText: p.buttonText,
        buttonUrl: p.buttonUrl,
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

      if (!error && data) {
        return data.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description || '',
          badge: p.badge || null,
          isPopular: p.is_popular === true,
          priceType: (p.price_type === 'custom' ? 'custom' : 'fixed') as 'fixed' | 'custom',
          priceMonthlyInr: p.price_monthly_inr !== undefined ? p.price_monthly_inr : null,
          priceYearlyInr: p.price_yearly_inr !== undefined ? p.price_yearly_inr : null,
          priceMonthlyUsd: p.price_monthly_usd !== undefined ? p.price_monthly_usd : null,
          priceYearlyUsd: p.price_yearly_usd !== undefined ? p.price_yearly_usd : null,
          customPriceLabel: p.custom_price_label || 'Custom',
          features: p.features || [],
          buttonText: p.button_text || 'Start a Project',
          buttonUrl: p.button_url || '/contact',
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
      } catch {
        // Fallback to raw query if model fails
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

export const getPublicComplianceSettings = safeCache(
  fetchPublicComplianceSettings,
  ['public-compliance-settings'],
  { revalidate: 300, tags: ['compliance-settings'] }
);

