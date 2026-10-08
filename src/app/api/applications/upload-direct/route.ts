/**
 * @file client/src/app/api/applications/upload-direct/route.ts
 * @description [API] Staging upload handler for local development or fallback environments.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateDocumentBuffer } from '@/lib/storage/validator';
import { verifyUploadSessionToken } from '@/lib/storage/token';

const STAGING_KEY_PATTERN = /^staging\/\d{4}-\d{2}-\d{2}\/[a-f0-9]{32}\.(pdf|docx|doc)$/;

async function handleDirectUpload(key: string | null, token: string | null, buffer: Buffer) {
  if (!key || !token) {
    return NextResponse.json({ error: 'Missing staging key or session token' }, { status: 400 });
  }

  if (!STAGING_KEY_PATTERN.test(key)) {
    return NextResponse.json({ error: 'Invalid staging key format' }, { status: 400 });
  }

  // Cryptographic token verification: authenticated, bound to stagingKey, time-limited, and single-purpose
  const tokenVerification = verifyUploadSessionToken(key, token);
  if (!tokenVerification.valid) {
    return NextResponse.json({ error: tokenVerification.error || 'Unauthorized upload session token' }, { status: 403 });
  }

  const baseDir = path.resolve(process.cwd(), '.data', 'resumes');
  const filePath = path.resolve(baseDir, key);

  // Strict path traversal containment
  if (!filePath.startsWith(baseDir + path.sep)) {
    return NextResponse.json({ error: 'Access denied: Path traversal detected' }, { status: 403 });
  }

  // Validate magic bytes and payload limits
  const validation = validateDocumentBuffer(buffer, key);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error || 'Invalid file format' }, { status: 400 });
  }

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ success: true, size: buffer.length });
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const token = searchParams.get('token');

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await handleDirectUpload(key, token, buffer);
  } catch (err) {
    console.error('[Direct Upload PUT Error]:', err);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const key = (formData.get('stagingKey') as string) || (formData.get('key') as string);
    const token = (formData.get('sessionToken') as string) || (formData.get('token') as string);
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Missing file payload' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await handleDirectUpload(key, token, buffer);
  } catch (err) {
    console.error('[Direct Upload POST Error]:', err);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}

