/**
 * @file client/src/app/api/applications/upload-direct/route.ts
 * @description [API] Staging upload handler for local development or fallback environments.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const token = searchParams.get('token');

    if (!key || !token) {
      return NextResponse.json({ error: 'Missing staging key or session token' }, { status: 400 });
    }

    // Safety: prevent directory traversal
    const normalizedKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
    const baseDir = path.join(process.cwd(), '.data', 'resumes');
    const filePath = path.join(baseDir, normalizedKey);

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ success: true, size: buffer.length });
  } catch (err) {
    console.error('[Direct Upload Error]:', err);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}
