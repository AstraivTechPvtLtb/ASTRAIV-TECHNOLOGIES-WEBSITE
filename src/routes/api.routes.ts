/**
 * @file client/src/routes/api.routes.ts
 * @description Centralized definitions for all backend API endpoints and webhooks.
 */

export const API_ROUTES = {
  AUTH: '/api/auth',
  AUTH_SESSION: '/api/auth/get-session',
  REVIEWS: '/api/reviews',
  REVIEWS_GOOGLE_FORM: '/api/reviews/google-form',
  WEBHOOKS_GOOGLE_SHEETS: '/api/webhooks/google-sheets',
} as const;
