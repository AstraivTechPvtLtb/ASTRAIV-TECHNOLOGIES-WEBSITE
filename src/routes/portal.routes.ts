import {
  LayoutDashboard,
  Users,
  FolderKanban,
  LifeBuoy,
  Settings,
  CreditCard,
  User,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { DashboardRole, PortalNavItem } from './types';

/**
 * @file client/src/routes/portal.routes.ts
 * @description Centralized definitions for Client Portal, Dashboard, and role-based app routes.
 */

export const PORTAL_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  BILLING: '/billing',
  SUPPORT: '/support',

  CLIENT: {
    HOME: '/client',
    PROJECTS: '/client/projects',
    TICKETS: '/client/tickets',
    BILLING: '/client/billing',
    SETTINGS: '/client/settings',
  },

  ADMIN: {
    HOME: '/admin',
    USERS: '/admin/users',
    PROJECTS: '/admin/projects',
    LEADS: '/admin/leads',
    TICKETS: '/admin/tickets',
    BLOG: '/admin/blog',
    SETTINGS: '/admin/settings',
  },

  MANAGER: {
    HOME: '/manager',
    PROJECTS: '/manager/projects',
    TICKETS: '/manager/tickets',
    SETTINGS: '/manager/settings',
  },
} as const;

/**
 * Returns navigation links mapped to specific user dashboard roles.
 */
export function getRoleNavLinks(role: DashboardRole = 'USER'): PortalNavItem[] {
  const commonLinks: PortalNavItem[] = [
    { label: 'Overview', href: PORTAL_ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Profile', href: PORTAL_ROUTES.PROFILE, icon: User },
    { label: 'Billing', href: PORTAL_ROUTES.BILLING, icon: CreditCard },
  ];

  switch (role) {
    case 'ADMIN':
      return [
        { label: 'Admin Panel', href: PORTAL_ROUTES.ADMIN.HOME, icon: LayoutDashboard },
        { label: 'User Directory', href: PORTAL_ROUTES.ADMIN.USERS, icon: Users },
        { label: 'Projects Manager', href: PORTAL_ROUTES.ADMIN.PROJECTS, icon: FolderKanban },
        { label: 'CRM Leads', href: PORTAL_ROUTES.ADMIN.LEADS, icon: TrendingUp },
        { label: 'Support Tickets', href: PORTAL_ROUTES.ADMIN.TICKETS, icon: LifeBuoy },
        { label: 'Blog CMS', href: PORTAL_ROUTES.ADMIN.BLOG, icon: FileText },
        { label: 'Settings', href: PORTAL_ROUTES.ADMIN.SETTINGS, icon: Settings },
      ];
    case 'PROJECT_MANAGER':
      return [
        { label: 'Manager Home', href: PORTAL_ROUTES.MANAGER.HOME, icon: LayoutDashboard },
        { label: 'Assigned Projects', href: PORTAL_ROUTES.MANAGER.PROJECTS, icon: FolderKanban },
        { label: 'Support Tickets', href: PORTAL_ROUTES.MANAGER.TICKETS, icon: LifeBuoy },
        { label: 'Settings', href: PORTAL_ROUTES.MANAGER.SETTINGS, icon: Settings },
      ];
    case 'CLIENT':
      return [
        { label: 'Client Home', href: PORTAL_ROUTES.CLIENT.HOME, icon: LayoutDashboard },
        { label: 'My Projects', href: PORTAL_ROUTES.CLIENT.PROJECTS, icon: FolderKanban },
        { label: 'Support Tickets', href: PORTAL_ROUTES.CLIENT.TICKETS, icon: LifeBuoy },
        { label: 'Billing & Invoices', href: PORTAL_ROUTES.CLIENT.BILLING, icon: CreditCard },
        { label: 'Settings', href: PORTAL_ROUTES.CLIENT.SETTINGS, icon: Settings },
      ];
    case 'USER':
    default:
      return [
        ...commonLinks,
        { label: 'Help Desk', href: PORTAL_ROUTES.SUPPORT, icon: LifeBuoy },
        { label: 'Account Settings', href: PORTAL_ROUTES.SETTINGS, icon: Settings },
      ];
  }
}
