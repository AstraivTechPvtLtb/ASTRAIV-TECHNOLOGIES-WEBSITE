/**
 * @file client/src/utils/pricing.ts
 * @description Engagement model utility helpers and quote URL builders.
 */

export function buildQuotationUrl(modelSlug?: string): string {
  if (!modelSlug) return '/start-project?source_page=/pricing';
  return `/start-project?source_page=/pricing&engagement_model=${encodeURIComponent(modelSlug)}`;
}
