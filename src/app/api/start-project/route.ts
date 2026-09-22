import { NextRequest, NextResponse } from 'next/server';
import { submitStartProject } from '@/controllers/start-project.controller';

/**
 * @file client/src/app/api/start-project/route.ts
 * @description API route handler for the Start a Project wizard submission.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await submitStartProject(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Submission failed' }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API /api/start-project Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while securing project submission.' },
      { status: 500 }
    );
  }
}
