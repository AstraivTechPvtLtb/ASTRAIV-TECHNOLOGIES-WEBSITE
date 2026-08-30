/**
 * @file src/types/index.ts
 * @description Centralized Type Definitions & Domain Re-exports for AstraIV Technologies.
 */

export * from './admin';
export * from './client';

/**
 * Standard generic API & Server Action response format.
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Common pagination result format.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
