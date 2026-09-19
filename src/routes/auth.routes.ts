/**
 * @file client/src/routes/auth.routes.ts
 * @description Centralized definitions for all authentication and session management routes.
 */

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;
