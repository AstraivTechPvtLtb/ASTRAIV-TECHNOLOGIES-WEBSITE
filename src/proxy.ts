import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Named proxy function is the new Next.js 16 standard
export function proxy(request: any) {
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, skipping api, static assets and _next internals
  matcher: [
    '/', 
    '/(es|en)/:path*', 
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};
