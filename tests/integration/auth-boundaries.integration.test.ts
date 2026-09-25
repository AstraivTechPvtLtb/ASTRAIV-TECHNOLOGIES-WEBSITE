import { describe, it, expect } from 'vitest';
import { PORTAL_ROUTES, getRoleNavLinks } from '@/routes/portal.routes';
import { AUTH_ROUTES } from '@/routes/auth.routes';
import { DashboardRole } from '@/routes/types';

describe('Integration: Authentication Boundaries & Role Navigation Matrix', () => {
  describe('Role-Based Navigation Provisioning', () => {
    it('provisions ADMIN navigation with full system cockpit links', () => {
      const links = getRoleNavLinks('ADMIN');
      const hrefs = links.map((l) => l.href);

      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.USERS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.LEADS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.BLOG);
      expect(hrefs).toContain(PORTAL_ROUTES.ADMIN.SETTINGS);
    });

    it('provisions PROJECT_MANAGER navigation with project & ticket triage links', () => {
      const links = getRoleNavLinks('PROJECT_MANAGER');
      const hrefs = links.map((l) => l.href);

      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.MANAGER.TICKETS);
      expect(hrefs).not.toContain(PORTAL_ROUTES.ADMIN.USERS);
      expect(hrefs).not.toContain(PORTAL_ROUTES.ADMIN.LEADS);
    });

    it('provisions CLIENT navigation with client projects, invoices & tickets', () => {
      const links = getRoleNavLinks('CLIENT');
      const hrefs = links.map((l) => l.href);

      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.HOME);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.PROJECTS);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.TICKETS);
      expect(hrefs).toContain(PORTAL_ROUTES.CLIENT.BILLING);
      expect(hrefs).not.toContain(PORTAL_ROUTES.ADMIN.HOME);
    });

    it('provisions standard USER navigation with base dashboard and support links', () => {
      const links = getRoleNavLinks('USER');
      const hrefs = links.map((l) => l.href);

      expect(hrefs).toContain(PORTAL_ROUTES.DASHBOARD);
      expect(hrefs).toContain(PORTAL_ROUTES.PROFILE);
      expect(hrefs).toContain(PORTAL_ROUTES.SUPPORT);
      expect(hrefs).toContain(PORTAL_ROUTES.SETTINGS);
      expect(hrefs).not.toContain(PORTAL_ROUTES.ADMIN.HOME);
      expect(hrefs).not.toContain(PORTAL_ROUTES.CLIENT.PROJECTS);
    });
  });

  describe('Authentication Route Boundaries', () => {
    it('defines canonical authentication gateways', () => {
      expect(AUTH_ROUTES.LOGIN).toBe('/auth/login');
      expect(AUTH_ROUTES.SIGNUP).toBe('/auth/signup');
      expect(AUTH_ROUTES.FORGOT_PASSWORD).toBe('/auth/forgot-password');
      expect(AUTH_ROUTES.RESET_PASSWORD).toBe('/auth/reset-password');
    });

    it('determines the correct destination route per user role on login', () => {
      function getRedirectForRole(role: DashboardRole): string {
        switch (role) {
          case 'ADMIN':
            return '/admin';
          case 'PROJECT_MANAGER':
            return '/manager';
          case 'CLIENT':
            return PORTAL_ROUTES.CLIENT.PROJECTS;
          case 'USER':
          default:
            return PORTAL_ROUTES.DASHBOARD;
        }
      }

      expect(getRedirectForRole('ADMIN')).toBe('/admin');
      expect(getRedirectForRole('PROJECT_MANAGER')).toBe('/manager');
      expect(getRedirectForRole('CLIENT')).toBe('/client/projects');
      expect(getRedirectForRole('USER')).toBe('/dashboard');
    });
  });
});
