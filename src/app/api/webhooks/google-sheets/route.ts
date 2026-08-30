import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

const googleSheetReviewSchema = z.object({
  review_id: z.string().optional(),
  client_name: z.string().trim().min(2, { message: 'Client name must be at least 2 characters.' }),
  company: z.string().trim().optional().or(z.literal('')),
  designation: z.string().trim().optional().or(z.literal('')),
  review: z.string().trim().min(5, { message: 'Review must be at least 5 characters.' }),
  rating: z.coerce.number().int().min(1).max(5),
  image_url: z.string().url().optional().or(z.literal('')),
});

/**
 * Webhook handler for synchronizing incoming client reviews from Google Sheet / Google Forms.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate incoming webhook request
    const configuredSecret = process.env.GOOGLE_SHEET_WEBHOOK_SECRET;
    const headerSecret = request.headers.get('x-webhook-secret');
    const querySecret = request.nextUrl.searchParams.get('secret');

    if (
      configuredSecret &&
      headerSecret !== configuredSecret &&
      querySecret !== configuredSecret
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid webhook secret token.' },
        { status: 401 }
      );
    }

    // 2. Parse and validate JSON payload
    const body = await request.json();
    const validation = googleSheetReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      client_name,
      company,
      designation,
      review,
      rating,
      image_url,
    } = validation.data;

    // Generate deterministic or random unique review_id if not provided
    const review_id =
      validation.data.review_id ||
      `GS-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 3. Supabase admin client (elevated service role)
    const supabase = createAdminClient();

    // 4. Duplicate prevention check
    const { data: existing } = await supabase
      .from('reviews')
      .select('id, review_id')
      .eq('review_id', review_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Review with this ID already exists, duplicate skipped.',
        review_id,
        skipped: true,
      });
    }

    // 5. Insert new review with mandatory status = 'pending'
    const { data: newReview, error: insertError } = await supabase
      .from('reviews')
      .insert({
        review_id,
        client_name,
        company: company || null,
        designation: designation || null,
        review,
        rating,
        image_url: image_url || null,
        status: 'pending', // MUST be pending until admin approval
        featured: false,
      })
      .select('id, review_id, status, created_at')
      .single();

    if (insertError) {
      console.error('[Google Sheet Sync Insert Error]:', insertError.message);
      return NextResponse.json(
        { success: false, error: 'Database error saving review.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review successfully synced and placed into pending queue for admin approval.',
      data: newReview,
    });
  } catch (err: unknown) {
    console.error('[Google Sheet Webhook Handler Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing webhook.' },
      { status: 500 }
    );
  }
}
