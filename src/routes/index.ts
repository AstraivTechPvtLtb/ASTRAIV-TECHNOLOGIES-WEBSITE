import { PUBLIC_ROUTES } from './public.routes';
import { AUTH_ROUTES } from './auth.routes';
import { PORTAL_ROUTES } from './portal.routes';
import { API_ROUTES } from './api.routes';

/**
 * @file client/src/routes/index.ts
 * @description Central export barrel for the application's MVC Routes Layer.
 */

export const ROUTES = {
  PUBLIC: PUBLIC_ROUTES,
  AUTH: AUTH_ROUTES,
  PORTAL: PORTAL_ROUTES,
  API: API_ROUTES,
} as const;

export { PUBLIC_ROUTES } from './public.routes';
export { AUTH_ROUTES } from './auth.routes';
export { PORTAL_ROUTES, getRoleNavLinks } from './portal.routes';
export { API_ROUTES } from './api.routes';

export * from './types';
export * from './helpers';
