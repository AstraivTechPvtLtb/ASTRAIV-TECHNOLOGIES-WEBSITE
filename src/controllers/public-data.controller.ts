'use server';

/**
 * @file client/src/controllers/public-data.controller.ts
 * @description [CONTROLLER] Business logic for fetching publicly visible reviews, testimonials, and showcases for the client website.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import {
  PublicJobOpening,
  DEFAULT_JOB_OPENINGS,
  PublicPricingPlan,
  DEFAULT_PRICING_PLANS,
  TestimonialItem,
} from '@/models/types';

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'seed-1',
    quote:
      "Astraiv's team is exceptional. They restructured our entire cloud architecture on AWS using Next.js and reduced our server overhead by 42%. The UI aesthetics are Stripe-level premium.",
    authorName: 'Sarah Jenkins',
    authorRole: 'VP of Engineering',
    authorCompany: 'Vercel Staging Partner',
    rating: 5,
  },
  {
    id: 'seed-2',
    quote:
      'Working with Astraiv Technologies has automated our entire CRM sync pipeline and customer portal. The project was delivered ahead of schedule and the codebase is flawlessly typed.',
    authorName: 'Marcus Vance',
    authorRole: 'Founder',
    authorCompany: 'Linear Integrations',
    rating: 5,
  },
  {
    id: 'seed-3',
    quote:
      'Their attention to design details, micro-animations, and WCAG accessibility is unmatched. Our clients have commented on the dashboard speed. It feels incredibly premium.',
    authorName: 'Elena Rostova',
    authorRole: 'CTO',
    authorCompany: 'Framer Modules',
    rating: 5,
  },
];

/**
 * Retrieves public testimonials approved by the Astraiv admin team.
 */
export async function getPublicApprovedReviews(): Promise<TestimonialItem[]> {
  try {
    if (!isSupabaseConfigured()) {
      const approvedReviews = await db.review.findMany({
        where: { status: 'approved' },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: 6,
      });

      if (approvedReviews.length === 0) {
        return DEFAULT_TESTIMONIALS;
      }

      return approvedReviews.map((r) => ({
        id: r.id,
        quote: r.review,
        authorName: r.clientName,
        authorRole: r.designation || 'Client Partner',
        authorCompany: r.company || 'Direct Client',
        rating: r.rating,
        avatarUrl: r.imageUrl || undefined,
      }));
    }

    const supabase = await createSupabaseClient();
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !reviews || reviews.length === 0) {
      return DEFAULT_TESTIMONIALS;
    }

    return reviews.map((r) => ({
      id: r.id,
      quote: r.review,
      authorName: r.client_name,
      authorRole: r.designation || 'Client Partner',
      authorCompany: r.company || 'Direct Client',
      rating: r.rating,
      avatarUrl: r.image_url || undefined,
    }));
  } catch (error) {
    console.error('[Public Reviews Controller Error]:', error);
    return DEFAULT_TESTIMONIALS;
  }
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

    if (jobs && jobs.length > 0) {
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
      const { data, error } = await (supabase as any)
        .from('job_openings')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        interface SupabaseJobRow {
          id: string;
          title: string;
          slug: string;
          department?: string;
          type?: string;
          location?: string;
          experience?: string | null;
          description: string;
          skills?: string[];
          salary?: string | null;
          apply_url?: string | null;
          active?: boolean;
          order_index?: number;
        }

        return (data as unknown as SupabaseJobRow[]).map((j) => ({
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
 * Retrieves public active pricing plans for the client pricing & models section.
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
      const { data, error } = await (supabase as any)
        .from('pricing_plans')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        interface SupabasePlanRow {
          id: string;
          name: string;
          slug: string;
          description: string;
          badge?: string | null;
          is_popular?: boolean;
          price_type?: string;
          price_monthly_inr?: number | null;
          price_yearly_inr?: number | null;
          price_monthly_usd?: number | null;
          price_yearly_usd?: number | null;
          custom_price_label?: string | null;
          features?: string[];
          button_text?: string;
          button_url?: string;
          active?: boolean;
          order_index?: number;
        }

        return (data as unknown as SupabasePlanRow[]).map((p) => ({
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
          buttonText: p.button_text || 'Start Building',
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
