import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Named proxy function is the Next.js 16 standard
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass next-intl middleware for admin portal and API webhooks
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, skipping api, admin, static assets and _next internals
  matcher: [
    '/', 
    '/(es|en|bn|hi|ar)/:path*', 
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};
