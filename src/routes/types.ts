import { ComponentType } from 'react';

/**
 * @file client/src/routes/types.ts
 * @description Type definitions for the application's central Routes layer.
 */

export type DashboardRole = 'ADMIN' | 'PROJECT_MANAGER' | 'CLIENT' | 'USER';

export interface RouteDefinition {
  path: string;
  label?: string;
  description?: string;
  isProtected?: boolean;
  roles?: DashboardRole[];
}

export interface NavSubItem {
  name: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavSubItem[];
}

export interface MegaMenuConfig {
  type: 'mega-3col' | 'mega-industries' | 'dropdown' | 'simple';
  featured?: {
    tagline: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  groups?: NavGroup[];
  items?: NavSubItem[];
}

export interface NavItem {
  id: string;
  labelKey: string;
  defaultLabel: string;
  href: string;
  hasDropdown: boolean;
  megaMenu?: MegaMenuConfig;
}

export interface PortalNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export interface BreadcrumbItemConfig {
  label: string;
  href?: string;
}
