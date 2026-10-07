import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { routing } from '@/i18n/routing';

const SHARED_SECRET =
  process.env.REVALIDATE_SECRET ||
  process.env.JWT_SECRET ||
  'REDACTED_SHARED_64_BYTE_SECRET';

function isAuthorized(req: NextRequest): boolean {
  const url = new URL(req.url);
  const secretParam = url.searchParams.get('secret');
  const headerSecret = req.headers.get('x-revalidate-secret');
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  const provided = secretParam || headerSecret || authHeader;
  return Boolean(provided && provided === SHARED_SECRET);
}

function performRevalidation(paths: string[], tags: string[] = []): string[] {
  const revalidated: string[] = [];

  for (const rawPath of paths) {
    if (!rawPath) continue;
    const cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;

    try {
      revalidatePath(cleanPath);
      revalidated.push(cleanPath);
    } catch (e) {
      console.warn(`[Revalidate Route] Failed to revalidate ${cleanPath}:`, e);
    }

    // Revalidate locale-scoped paths across all supported languages
    for (const locale of routing.locales) {
      const localizedPath = cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
      try {
        revalidatePath(localizedPath, 'page');
        revalidated.push(localizedPath);
      } catch (e) {
        console.warn(`[Revalidate Route] Failed to revalidate ${localizedPath}:`, e);
      }
    }

    try {
      revalidatePath(`/[locale]${cleanPath === '/' ? '' : cleanPath}`, 'page');
    } catch {
      // Ignore layout revalidation errors
    }
  }

  for (const tag of tags) {
    if (!tag) continue;
    try {
      (revalidateTag as unknown as (tag: string, profile?: unknown) => void)(tag, 'default');
      revalidated.push(`tag:${tag}`);
    } catch (e) {
      console.warn(`[Revalidate Route] Failed to revalidate tag ${tag}:`, e);
    }
  }

  return Array.from(new Set(revalidated));
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get('path') || '/';
  const tag = url.searchParams.get('tag');

  const revalidated = performRevalidation([path], tag ? [tag] : []);
  return NextResponse.json({ success: true, revalidated });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let paths: string[] = [];
  let tags: string[] = [];

  try {
    const body = await req.json();
    if (Array.isArray(body.paths)) {
      paths = body.paths;
    } else if (typeof body.path === 'string') {
      paths = [body.path];
    }
    if (Array.isArray(body.tags)) {
      tags = body.tags;
    } else if (typeof body.tag === 'string') {
      tags = [body.tag];
    }
  } catch {
    const url = new URL(req.url);
    const path = url.searchParams.get('path');
    if (path) paths = [path];
  }

  if (paths.length === 0 && tags.length === 0) {
    paths = ['/'];
  }

  const revalidated = performRevalidation(paths, tags);
  return NextResponse.json({ success: true, revalidated });
}
