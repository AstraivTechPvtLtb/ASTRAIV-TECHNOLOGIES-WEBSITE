import { BreadcrumbItemConfig } from './types';

/**
 * @file client/src/routes/helpers.ts
 * @description Pure utility helper functions for route matching, localization, and breadcrumbs.
 */

/**
 * Normalizes a pathname by removing trailing slashes (except root '/') and locale prefixes.
 */
export function normalizePath(path: string): string {
  if (!path) return '/';
  
  // Remove anchor hash or query params if any
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Strip trailing slash unless it's just '/'
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    return cleanPath.slice(0, -1);
  }
  return cleanPath;
}

/**
 * Checks whether a target URL matches the current active pathname.
 * Handles sub-paths and skips active indication when on the root '/' route.
 *
 * @param currentPathname Current pathname (e.g., '/services' or '/blog/first-post')
 * @param targetHref Target route URL (e.g., '/services' or '/services#web-development')
 * @param exact If true, requires exact match
 */
export function isActiveRoute(
  currentPathname: string,
  targetHref: string,
  exact: boolean = false
): boolean {
  const current = normalizePath(currentPathname);
  const target = normalizePath(targetHref);

  // If on root '/', do not match non-root routes
  if (current === '/' || current === '') {
    return target === '/' || target === '';
  }

  // If target is root, only active if current is root
  if (target === '/' || target === '') {
    return current === '/' || current === '';
  }

  if (exact) {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
}

/**
 * Generates a localized path string for server redirects or standard links.
 * 
 * @param path Internal route path (e.g., '/auth/login' or '/blog#faq')
 * @param locale Optional locale code (e.g., 'en', 'es')
 * @returns Formatted path with locale prefix (e.g., '/en/auth/login')
 */
export function getLocalizedPath(path: string, locale?: string): string {
  if (!locale) return path;

  // Preserve hash fragment if present
  const [basePath, hash] = path.split('#');
  const normalizedBase = normalizePath(basePath);
  const hashPart = hash ? `#${hash}` : '';

  if (normalizedBase === '/' || normalizedBase === '') {
    return `/${locale}${hashPart}`;
  }

  const cleanBase = normalizedBase.startsWith('/') ? normalizedBase : `/${normalizedBase}`;
  return `/${locale}${cleanBase}${hashPart}`;
}

/**
 * Builds standard breadcrumbs structure.
 */
export function buildBreadcrumbs(
  items: { label: string; href?: string }[]
): BreadcrumbItemConfig[] {
  return items.map((item) => ({
    label: item.label,
    href: item.href,
  }));
}
