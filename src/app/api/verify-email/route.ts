import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailAddress } from '@/lib/services/email-verifier';

/**
 * @file client/src/app/api/verify-email/route.ts
 * @description Secure internal endpoint for validating and verifying email deliverability without exposing secrets.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ isValid: false, error: 'Email address is required.' }, { status: 400 });
    }

    const verification = await verifyEmailAddress(email);

    return NextResponse.json(
      {
        isValid: verification.isValid,
        error: verification.error,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/verify-email Error]:', error);
    // Graceful fallback on unexpected server error: return 200 with isValid: true
    return NextResponse.json({ isValid: true }, { status: 200 });
  }
}
