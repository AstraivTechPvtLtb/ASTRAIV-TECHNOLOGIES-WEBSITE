import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getApprovedTestimonials } from '@/controllers/public-data.controller';

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

    // Fetch approved testimonials through resilient 3-tier architecture:
    // Tier 1: Primary PostgreSQL via Prisma ORM
    // Tier 2: Supabase Cloud Data Store
    // Tier 3: Zero-downtime Verified Canonical Dataset
    const testimonials = await getApprovedTestimonials({
      featuredOnly,
      projectId: projectId || undefined,
      serviceId: serviceId || undefined,
      industryId: industryId || undefined,
      limit,
    });

    const sanitized = testimonials.map((r) =>
      sanitizeReviewForPublic({
        id: r.id,
        clientName: r.client_name || r.authorName || 'Astraiv Client',
        companyName: r.company || r.authorCompany,
        designation: r.role || r.authorRole,
        reviewText: r.review_text || r.quote,
        rating: r.rating,
        displayRating: r.rating,
        identityDisplayPermission: r.identityDisplayPermission || 'Yes',
        imageUrl: r.avatar || r.avatarUrl,
        projectId: r.project_id,
        serviceId: r.service_id,
        industryId: r.industry_id,
        publishedAt: r.published_at,
      })
    );

    return NextResponse.json({
      success: true,
      data: sanitized,
      count: sanitized.length,
    });
  } catch (error) {
    console.error('[Public Reviews API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reviews' },
      { status: 500 }
    );
  }
}
