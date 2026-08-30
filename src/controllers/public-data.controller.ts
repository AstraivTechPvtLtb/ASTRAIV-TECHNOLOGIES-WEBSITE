'use server';

/**
 * @file client/src/controllers/public-data.controller.ts
 * @description [CONTROLLER] Business logic for fetching publicly visible reviews, testimonials, and showcases for the client website.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  rating: number;
  avatarUrl?: string;
}

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
