/**
 * @file client/src/lib/services-utils.ts
 * @description Pure utility functions for services, usable by both server and client components.
 */

export function getServiceImage(slug?: string, icon?: string): string {
  const key = (slug || icon || '').toLowerCase();
  if (key.includes('ai') || key.includes('bot') || key.includes('ml') || key.includes('machine')) {
    return '/images/services/service-ai.jpg';
  }
  if (key.includes('software') || key.includes('custom') || key.includes('cpu')) {
    return '/images/services/service-software.jpg';
  }
  if (key.includes('web') || key.includes('saas') || key.includes('globe') || key.includes('terminal')) {
    return '/images/services/service-web.jpg';
  }
  if (key.includes('mobile') || key.includes('app') || key.includes('smartphone')) {
    return '/images/services/service-mobile.jpg';
  }
  if (key.includes('cloud') || key.includes('devops') || key.includes('infra')) {
    return '/images/services/service-cloud.jpg';
  }
  if (key.includes('ui') || key.includes('ux') || key.includes('design') || key.includes('product') || key.includes('layer')) {
    return '/images/services/service-uiux.jpg';
  }
  if (key.includes('api') || key.includes('integ') || key.includes('network') || key.includes('system')) {
    return '/images/services/service-api.jpg';
  }
  if (key.includes('transform') || key.includes('digital') || key.includes('shuffle') || key.includes('modern')) {
    return '/images/services/service-transformation.jpg';
  }
  return '/images/services/service-software.jpg';
}
