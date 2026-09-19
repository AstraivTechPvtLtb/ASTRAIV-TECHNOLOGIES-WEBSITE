import { describe, it, expect } from 'vitest';
import {
  ROUTES,
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  PORTAL_ROUTES,
  API_ROUTES,
  getRoleNavLinks,
  normalizePath,
  isActiveRoute,
  getLocalizedPath,
  buildBreadcrumbs,
} from './index';

describe('MVC Routes Layer', () => {
  describe('Static & Dynamic Route Paths', () => {
    it('defines public routes correctly', () => {
      expect(PUBLIC_ROUTES.HOME).toBe('/');
      expect(PUBLIC_ROUTES.SERVICES).toBe('/services');
      expect(PUBLIC_ROUTES.SERVICE_DETAIL('web-development')).toBe('/services/web-development');
      expect(PUBLIC_ROUTES.BLOG).toBe('/blog');
      expect(PUBLIC_ROUTES.BLOG_DETAIL('ai-trends')).toBe('/blog/ai-trends');
      expect(PUBLIC_ROUTES.CONTACT).toBe('/contact');
      expect(PUBLIC_ROUTES.COMPANY).toBe('/company');
      expect(PUBLIC_ROUTES.INDUSTRIES).toBe('/industries');
      expect(PUBLIC_ROUTES.PORTFOLIO).toBe('/portfolio');
      expect(PUBLIC_ROUTES.SOLUTIONS).toBe('/solutions');
      expect(PUBLIC_ROUTES.TECHNOLOGY).toBe('/technology');
    });

    it('defines anchor routes correctly', () => {
      expect(PUBLIC_ROUTES.SERVICES_ANCHORS.AI_INTELLIGENT_SYSTEMS).toBe(
        '/services#ai-intelligent-systems'
      );
      expect(PUBLIC_ROUTES.SOLUTIONS_ANCHORS.AI_AGENTS).toBe('/solutions#ai-agents');
      expect(PUBLIC_ROUTES.COMPANY_ANCHORS.WHY_US).toBe('/company#why-us');
    });

    it('defines auth routes correctly', () => {
      expect(AUTH_ROUTES.LOGIN).toBe('/auth/login');
      expect(AUTH_ROUTES.SIGNUP).toBe('/auth/signup');
      expect(AUTH_ROUTES.FORGOT_PASSWORD).toBe('/auth/forgot-password');
    });

    it('defines portal routes correctly', () => {
      expect(PORTAL_ROUTES.DASHBOARD).toBe('/dashboard');
      expect(PORTAL_ROUTES.SETTINGS).toBe('/settings');
      expect(PORTAL_ROUTES.CLIENT.PROJECTS).toBe('/client/projects');
      expect(PORTAL_ROUTES.CLIENT.TICKETS).toBe('/client/tickets');
      expect(PORTAL_ROUTES.CLIENT.BILLING).toBe('/client/billing');
      expect(PORTAL_ROUTES.ADMIN.HOME).toBe('/admin');
    });

    it('defines api routes correctly', () => {
      expect(API_ROUTES.AUTH).toBe('/api/auth');
      expect(API_ROUTES.REVIEWS).toBe('/api/reviews');
      expect(API_ROUTES.WEBHOOKS_GOOGLE_SHEETS).toBe('/api/webhooks/google-sheets');
    });

    it('is accessible via the central ROUTES namespace', () => {
      expect(ROUTES.PUBLIC.SERVICES).toBe('/services');
      expect(ROUTES.AUTH.LOGIN).toBe('/auth/login');
      expect(ROUTES.PORTAL.DASHBOARD).toBe('/dashboard');
      expect(ROUTES.API.REVIEWS).toBe('/api/reviews');
    });
  });

  describe('Route Helpers', () => {
    it('normalizes paths properly', () => {
      expect(normalizePath('/services/')).toBe('/services');
      expect(normalizePath('/services')).toBe('/services');
      expect(normalizePath('/')).toBe('/');
      expect(normalizePath('')).toBe('/');
      expect(normalizePath('/services#ai-intelligent-systems')).toBe('/services');
      expect(normalizePath('/blog?page=2')).toBe('/blog');
    });

    it('calculates active routes correctly', () => {
      // Home page check
      expect(isActiveRoute('/', '/')).toBe(true);
      expect(isActiveRoute('/', '/services')).toBe(false);

      // Root path does not mark other pages active
      expect(isActiveRoute('/services', '/')).toBe(false);

      // Prefix match
      expect(isActiveRoute('/services', '/services')).toBe(true);
      expect(isActiveRoute('/services/web-dev', '/services')).toBe(true);
      expect(isActiveRoute('/blog/my-post', '/blog')).toBe(true);

      // Exact match
      expect(isActiveRoute('/services/web-dev', '/services', true)).toBe(false);
      expect(isActiveRoute('/services', '/services', true)).toBe(true);

      // With hash anchors in target
      expect(isActiveRoute('/services', '/services#ai-intelligent-systems')).toBe(true);
    });

    it('generates localized paths correctly', () => {
      expect(getLocalizedPath('/services', 'en')).toBe('/en/services');
      expect(getLocalizedPath('/', 'es')).toBe('/es');
      expect(getLocalizedPath('/auth/login', 'bn')).toBe('/bn/auth/login');
      expect(getLocalizedPath('/blog#faq', 'en')).toBe('/en/blog#faq');
      expect(getLocalizedPath('/services')).toBe('/services');
    });

    it('builds breadcrumb structures correctly', () => {
      const crumbs = buildBreadcrumbs([
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings' },
      ]);
      expect(crumbs).toHaveLength(2);
      expect(crumbs[0]).toEqual({ label: 'Dashboard', href: '/dashboard' });
      expect(crumbs[1]).toEqual({ label: 'Settings', href: undefined });
    });
  });

  describe('Role-based Portal Navigation', () => {
    it('returns client role navigation links', () => {
      const clientLinks = getRoleNavLinks('CLIENT');
      const hrefs = clientLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.BILLING);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.SETTINGS);
    });

    it('returns admin role navigation links', () => {
      const adminLinks = getRoleNavLinks('ADMIN');
      const hrefs = adminLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.USERS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.LEADS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.BLOG);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.SETTINGS);
    });

    it('returns project manager navigation links', () => {
      const managerLinks = getRoleNavLinks('PROJECT_MANAGER');
      const hrefs = managerLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.SETTINGS);
    });

    it('returns regular user navigation links by default', () => {
      const userLinks = getRoleNavLinks('USER');
      const hrefs = userLinks.map((l) => l.href);
      expect(hrefs).toContain(PORTAL_ROUTES.DASHBOARD);
      expect(hrefs).toContain(PORTAL_ROUTES.PROFILE);
      expect(hrefs).toContain(PORTAL_ROUTES.BILLING);
      expect(hrefs).toContain(PORTAL_ROUTES.SUPPORT);
      expect(hrefs).toContain(PORTAL_ROUTES.SETTINGS);
    });
  });
});
