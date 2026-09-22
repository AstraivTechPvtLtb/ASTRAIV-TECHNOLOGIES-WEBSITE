/**
 * @file client/src/controllers/services.controller.ts
 * @description [CONTROLLER] Business logic for retrieving public database-backed services for the AstraIV client website.
 * SERVICES = WHAT ASTRAIV DOES (Engineering disciplines & capabilities).
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import {
  type PublicServiceItem,
  DEFAULT_SERVICES,
  SLUG_ALIASES,
  RECLASSIFIED_SERVICES_TO_SOLUTIONS,
} from '@/lib/services-data';

export type { PublicServiceItem };

/**
 * Retrieves all publicly active services sorted by display order.
 */
export async function getPublicActiveServices(): Promise<PublicServiceItem[]> {
  try {
    const records = await db.serviceItem.findMany({
      where: { active: true },
      orderBy: { orderIndex: 'asc' },
    });

    if (records && records.length > 0) {
      // Filter out reclassified items from services catalog so only WHAT ASTRAIV DOES is shown
      const filtered = records.filter(
        (s) => !RECLASSIFIED_SERVICES_TO_SOLUTIONS[s.slug.toLowerCase().trim()]
      );

      if (filtered.length > 0) {
        const seenSlugs = new Set<string>();
        const uniqueItems: PublicServiceItem[] = [];

        for (const s of filtered) {
          const canonicalSlug = SLUG_ALIASES[s.slug.toLowerCase().trim()] || s.slug;
          if (seenSlugs.has(canonicalSlug)) {
            continue;
          }
          seenSlugs.add(canonicalSlug);

          const defaultMeta = DEFAULT_SERVICES.find((d) => d.slug === canonicalSlug);

          uniqueItems.push({
            id: s.id,
            title: defaultMeta?.title || s.title,
            slug: canonicalSlug,
            category: s.category || defaultMeta?.category || 'Software Engineering',
            shortDesc: s.shortDesc || defaultMeta?.shortDesc || '',
            fullDesc: s.fullDesc || s.shortDesc || defaultMeta?.fullDesc || '',
            features: s.features && s.features.length > 0 ? s.features : defaultMeta?.features || [],
            badge: s.badge || defaultMeta?.badge || null,
            icon: s.icon || defaultMeta?.icon || 'Cpu',
            orderIndex: s.orderIndex,
            imageSrc: defaultMeta?.imageSrc,
            deliverables: defaultMeta?.deliverables,
            techStack: defaultMeta?.techStack,
            slaHighlight: defaultMeta?.slaHighlight,
          });
        }

        return uniqueItems;
      }
    }
  } catch (prismaErr) {
    console.warn('[Prisma Public Services Notice - Falling back]:', (prismaErr as Error)?.message || prismaErr);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      const { data: records, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (!error && records && records.length > 0) {
        const filtered = records.filter(
          (s) => !RECLASSIFIED_SERVICES_TO_SOLUTIONS[s.slug?.toLowerCase().trim()]
        );
        if (filtered.length > 0) {
          const seenSlugs = new Set<string>();
          const uniqueItems: PublicServiceItem[] = [];

          for (const s of filtered) {
            const canonicalSlug = SLUG_ALIASES[s.slug.toLowerCase().trim()] || s.slug;
            if (seenSlugs.has(canonicalSlug)) {
              continue;
            }
            seenSlugs.add(canonicalSlug);

            const defaultMeta = DEFAULT_SERVICES.find((d) => d.slug === canonicalSlug);

            uniqueItems.push({
              id: s.id,
              title: defaultMeta?.title || s.title,
              slug: canonicalSlug,
              category: s.category || defaultMeta?.category || 'Software Engineering',
              shortDesc: s.short_desc || s.description || defaultMeta?.shortDesc || '',
              fullDesc: s.full_desc || s.short_desc || s.description || defaultMeta?.fullDesc || '',
              features: s.features && s.features.length > 0 ? s.features : defaultMeta?.features || [],
              badge: s.badge || defaultMeta?.badge || null,
              icon: s.icon || defaultMeta?.icon || 'Cpu',
              orderIndex: s.order_index ?? 0,
              imageSrc: defaultMeta?.imageSrc,
              deliverables: defaultMeta?.deliverables,
              techStack: defaultMeta?.techStack,
              slaHighlight: defaultMeta?.slaHighlight,
            });
          }

          return uniqueItems;
        }
      }
    } catch (supaErr) {
      console.warn('[Supabase Client Error]:', (supaErr as Error)?.message || supaErr);
    }
  }

  return DEFAULT_SERVICES;
}

/**
 * Retrieves a single service by slug if active.
 */
export async function getPublicServiceBySlug(slug: string): Promise<PublicServiceItem | null> {
  const rawCleanSlug = slug.toLowerCase().trim();
  const cleanSlug = SLUG_ALIASES[rawCleanSlug] || rawCleanSlug;

  try {
    const record = await db.serviceItem.findFirst({
      where: {
        slug: { in: [cleanSlug, rawCleanSlug] },
        active: true,
      },
    });

    if (record) {
      return {
        id: record.id,
        title: record.title,
        slug: cleanSlug,
        category: record.category || 'Software Engineering',
        shortDesc: record.shortDesc || '',
        fullDesc: record.fullDesc || record.shortDesc || '',
        features: record.features || [],
        badge: record.badge || null,
        icon: record.icon || 'Cpu',
        orderIndex: record.orderIndex,
      };
    }
  } catch {
    // Fallback
  }

  return DEFAULT_SERVICES.find((s) => s.slug === cleanSlug) || null;
}

/**
 * Retrieves all active service slugs for static routing or sitemaps.
 */
export async function getAllActiveServiceSlugs(): Promise<string[]> {
  return DEFAULT_SERVICES.map((s) => s.slug);
}

/**
 * Returns default services fallback list.
 */
export async function getDefaultServices(): Promise<PublicServiceItem[]> {
  return DEFAULT_SERVICES;
}
