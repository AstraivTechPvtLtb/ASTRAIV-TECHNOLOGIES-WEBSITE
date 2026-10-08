/**
 * @file client/src/app/api/applications/upload-session/route.ts
 * @description [API] Creates a short-lived presigned upload session for candidate resumes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider, MAX_RESUME_SIZE_BYTES } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, mimeType, sizeBytes, candidateName, roleSlug, isSpeculative } = body;

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    if (!sizeBytes || typeof sizeBytes !== 'number' || sizeBytes <= 0) {
      return NextResponse.json({ error: 'Valid file size is required' }, { status: 400 });
    }

    if (sizeBytes > MAX_RESUME_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const ext = (filename.split('.').pop() || '').toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX documents are accepted' },
        { status: 400 }
      );
    }

    const provider = getStorageProvider();
    const session = await provider.createUploadSession({
      filename,
      mimeType: mimeType || 'application/pdf',
      sizeBytes,
      candidateName,
      roleSlug,
      isSpeculative: Boolean(isSpeculative),
    });

    return NextResponse.json({
      success: true,
      data: session,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (err) {
    console.error('[Upload Session Error]:', err);
    return NextResponse.json(
      { error: 'Failed to create upload session' },
      { status: 500 }
    );
  }
}
