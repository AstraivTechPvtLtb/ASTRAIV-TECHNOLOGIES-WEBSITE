'use server';

/**
 * @file client/src/controllers/services.controller.ts
 * @description [CONTROLLER] Business logic for retrieving public database-backed services for the AstraIV client website.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';

export interface PublicServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  badge?: string | null;
  icon: string;
  orderIndex: number;
}

/**
 * Fallback static services in case of transient database connection interruption.
 */
const DEFAULT_SERVICES: PublicServiceItem[] = [
  {
    id: 'def-1',
    title: 'AI Solutions',
    slug: 'ai-solutions',
    category: 'Artificial Intelligence',
    shortDesc: 'Integration of Large Language Models, custom agents, and predictive analytics into your pipelines.',
    fullDesc: 'Empower your enterprise with autonomous AI agents, enterprise RAG search engines, custom LLM fine-tuning, and real-time telemetry prediction.',
    features: ['Custom LLM Pipelines', 'Enterprise RAG Systems', 'Autonomous Agent Swarms', 'Predictive Analytics'],
    badge: 'Popular',
    icon: 'Bot',
    orderIndex: 1,
  },
  {
    id: 'def-2',
    title: 'Web Applications',
    slug: 'web-applications',
    category: 'Engineering',
    shortDesc: 'Custom, scalable SaaS applications and dashboards designed for optimal workflow performance.',
    fullDesc: 'End-to-end full stack web engineering utilizing modern React 19 / Next.js 16 architectures, PostgreSQL databases, and high-concurrency microservices.',
    features: ['Next.js 16 & React 19', 'Multi-Tenant SaaS Engine', 'Real-Time WebSockets', 'Strict Type Safety'],
    badge: 'Core',
    icon: 'Terminal',
    orderIndex: 2,
  },
  {
    id: 'def-3',
    title: 'Custom Software',
    slug: 'custom-software',
    category: 'Engineering',
    shortDesc: 'Bespoke, high-performance software engineered specifically for your core business operations.',
    fullDesc: 'Tailored software systems built to solve high-stakes operational bottlenecks with clean architectures and automated test coverage.',
    features: ['Domain-Driven Architecture', 'High-Throughput Backends', 'Legacy Modernization', 'Comprehensive Testing'],
    badge: 'Enterprise',
    icon: 'Cpu',
    orderIndex: 3,
  },
  {
    id: 'def-4',
    title: 'Cloud Solutions',
    slug: 'cloud-solutions',
    category: 'Infrastructure',
    shortDesc: 'Sleek, highly available AWS and Cloudflare R2 infrastructure designed for near-zero downtime.',
    fullDesc: 'Serverless deployments, multi-region database clusters, zero-egress asset delivery, and 99.99% uptime SLA topologies.',
    features: ['AWS & Cloudflare Edge', 'Zero-Egress Buckets', 'HA Postgres Clusters', '99.99% Uptime Topologies'],
    badge: 'Cloud',
    icon: 'Cloud',
    orderIndex: 4,
  },
];

/**
 * Retrieves all publicly active services sorted by display order.
 */
export async function getPublicActiveServices(): Promise<PublicServiceItem[]> {
  try {
    if (!isSupabaseConfigured()) {
      const records = await db.serviceItem.findMany({
        where: { active: true },
        orderBy: { orderIndex: 'asc' },
      });

      if (!records || records.length === 0) {
        return DEFAULT_SERVICES;
      }

      return records.map((s) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        category: s.category || 'Engineering',
        shortDesc: s.shortDesc,
        fullDesc: s.fullDesc,
        features: s.features || [],
        badge: s.badge || null,
        icon: s.icon || 'Cpu',
        orderIndex: s.orderIndex,
      }));
    }

    const supabase = await createSupabaseClient();
    const { data: records, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error || !records || records.length === 0) {
      return DEFAULT_SERVICES;
    }

    return records.map((s: any) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      category: s.category || 'Engineering',
      shortDesc: s.short_desc || s.description || '',
      fullDesc: s.full_desc || s.description || '',
      features: s.features || [],
      badge: s.badge || null,
      icon: s.icon || 'Cpu',
      orderIndex: s.display_order ?? s.order_index ?? 0,
    }));
  } catch (error) {
    console.error('[Get Public Services Controller Error]:', error);
    return DEFAULT_SERVICES;
  }
}

/**
 * Retrieves a single service by slug if active.
 */
export async function getPublicServiceBySlug(slug: string): Promise<PublicServiceItem | null> {
  try {
    const cleanSlug = slug.toLowerCase().trim();

    if (!isSupabaseConfigured()) {
      const record = await db.serviceItem.findFirst({
        where: {
          slug: cleanSlug,
          active: true,
        },
      });

      if (!record) return null;

      return {
        id: record.id,
        title: record.title,
        slug: record.slug,
        category: record.category || 'Engineering',
        shortDesc: record.shortDesc,
        fullDesc: record.fullDesc,
        features: record.features || [],
        badge: record.badge || null,
        icon: record.icon || 'Cpu',
        orderIndex: record.orderIndex,
      };
    }

    const supabase = await createSupabaseClient();
    const { data: record, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', cleanSlug)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !record) return null;

    return {
      id: record.id,
      title: record.title,
      slug: record.slug,
      category: record.category || 'Engineering',
      shortDesc: record.short_desc || record.description || '',
      fullDesc: record.full_desc || record.description || '',
      features: record.features || [],
      badge: record.badge || null,
      icon: record.icon || 'Cpu',
      orderIndex: record.display_order ?? record.order_index ?? 0,
    };
  } catch (error) {
    console.error('[Get Public Service By Slug Error]:', error);
    return null;
  }
}

/**
 * Retrieves all active service slugs for static routing or sitemaps.
 */
export async function getAllActiveServiceSlugs(): Promise<string[]> {
  try {
    if (!isSupabaseConfigured()) {
      const records = await db.serviceItem.findMany({
        where: { active: true },
        select: { slug: true },
      });
      return records.map((s) => s.slug);
    }

    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('services')
      .select('slug')
      .eq('status', 'active');

    if (error || !data) return [];
    return data.map((s: any) => s.slug);
  } catch {
    return [];
  }
}
