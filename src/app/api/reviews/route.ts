import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export interface SanitizedPublicReview {
  id: string;
  displayName: string;
  displayCompany: string | null;
  displayDesignation: string | null;
  rating: number;
  displayRating: number;
  review: string;
  imageUrl?: string | null;
  projectId?: string | null;
  serviceId?: string | null;
  industryId?: string | null;
  publishedAt: string | null;
}

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
  published_at?: string | Date | null;
  [key: string]: unknown;
}

/**
 * Server-side privacy transformer.
 * Strictly strips all private feedback, emails, and restricts names/companies based on customer permission.
 * Never exposes admin notes publicly.
 */
export function sanitizeReviewForPublic(r: {
  id: string;
  clientName: string;
  companyName?: string | null;
  company?: string | null;
  designation?: string | null;
  reviewText?: string | null;
  review?: string | null;
  imageUrl?: string | null;
  projectId?: string | null;
  serviceId?: string | null;
  industryId?: string | null;
  averageRating?: Prisma.Decimal | number;
  displayRating?: number | null;
  rating?: number | null;
  identityDisplayPermission?: string | null;
  publishedAt?: Date | string | null;
}): SanitizedPublicReview {
  const perm = (r.identityDisplayPermission || 'Yes').trim();
  const rawName = (r.clientName || 'Astraiv Client').trim();
  const rawCompany = (r.companyName || r.company || '').trim();
  const rawDesignation = (r.designation || '').trim();

  let displayName = 'Astraiv Client';
  let displayCompany: string | null = null;
  let displayDesignation: string | null = null;

  if (perm === 'Yes' || perm.toLowerCase() === 'yes') {
    displayName = rawName;
    displayCompany = rawCompany || null;
    displayDesignation = rawDesignation || null;
  } else if (
    perm.toLowerCase().includes('first name') ||
    perm === 'Display only my first name with review.'
  ) {
    displayName = rawName.split(/\s+/)[0] || 'Client';
    displayCompany = rawCompany || null;
    displayDesignation = rawDesignation || null;
  } else {
    // Perm is 'No' or private identity
    displayName = 'Astraiv Client';
    displayCompany = null;
    displayDesignation = null;
  }

  const avgRatingNum = Number(r.averageRating ?? r.rating ?? 5.0);
  const displayRatingNum = r.displayRating || r.rating || Math.min(5, Math.max(1, Math.round(avgRatingNum)));

  return {
    id: r.id,
    displayName,
    displayCompany,
    displayDesignation,
    rating: Number(avgRatingNum.toFixed(2)),
    displayRating: displayRatingNum,
    review: r.reviewText || r.review || '',
    imageUrl: r.imageUrl || null,
    projectId: r.projectId || null,
    serviceId: r.serviceId || null,
    industryId: r.industryId || null,
    publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === 'true';
    const projectId = searchParams.get('projectId');
    const serviceId = searchParams.get('serviceId');
    const industryId = searchParams.get('industryId');
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    // 1. Primary PostgreSQL via Prisma ORM
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
        where.serviceId = serviceId;
      }
      if (industryId) {
        where.industryId = industryId;
      }

      const reviews = await db.review.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: limit,
      });

      const sanitized = reviews.map((r) =>
        sanitizeReviewForPublic({
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
          identityDisplayPermission: r.identityDisplayPermission,
          imageUrl: r.imageUrl,
          projectId: r.projectId,
          serviceId: r.serviceId,
          industryId: r.industryId,
          publishedAt: r.publishedAt,
        })
      );

      return NextResponse.json({
        success: true,
        data: sanitized,
        count: sanitized.length,
      });
    } catch (prismaErr) {
      console.warn('[Public Reviews API Prisma Notice - Falling back]:', (prismaErr as Error)?.message || prismaErr);
    }

    // 2. Supabase Cloud Fallback
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseClient();
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .eq('can_publish_review', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (featuredOnly) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (!error && data) {
        const sanitized = (data as unknown as SupabaseReviewRow[]).map((r) =>
          sanitizeReviewForPublic({
            id: r.id,
            clientName: r.client_name || 'Astraiv Client',
            companyName: r.company_name,
            company: r.company,
            designation: r.designation,
            reviewText: r.review_text,
            review: r.review,
            averageRating: r.average_rating ?? undefined,
            displayRating: r.display_rating,
            rating: r.rating,
            identityDisplayPermission: r.identity_display_permission,
            imageUrl: r.image_url,
            publishedAt: r.published_at,
          })
        );

        return NextResponse.json({
          success: true,
          data: sanitized,
          count: sanitized.length,
        });
      }
    }

    return NextResponse.json({ success: true, data: [], count: 0 });
  } catch (error) {
    console.error('[Public Reviews API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reviews' },
      { status: 500 }
    );
  }
}
