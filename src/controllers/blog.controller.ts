/**
 * @file client/src/controllers/blog.controller.ts
 * @description [CONTROLLER] Business logic and data fetching for Blog posts and categories.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  name: string;
  image: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  published: boolean;
  featuredImage: string | null;
  createdAt: Date | string;
  categoryId: string;
  category: BlogCategory;
  authorId?: string;
  author: BlogAuthor;
}

import {
  INSIGHT_CATEGORIES,
  INSIGHT_ARTICLES,
} from '@/lib/insights-data';

export const FALLBACK_BLOG_CATEGORIES: BlogCategory[] = INSIGHT_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
}));

export const FALLBACK_BLOG_POSTS: BlogPost[] = INSIGHT_ARTICLES.map((article) => ({
  id: article.id,
  title: article.title,
  slug: article.slug,
  summary: article.excerpt,
  content: article.content,
  published: true,
  featuredImage: article.coverImage,
  createdAt: article.publishedAt,
  categoryId: article.category.id,
  category: {
    id: article.category.id,
    name: article.category.name,
    slug: article.category.slug,
  },
  author: {
    name: article.author.name,
    image: article.author.image,
  },
}));

/**
 * Fetch all published blog posts with fallback safety for production
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  // 1. Primary: PostgreSQL / Prisma DB
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // If query succeeded, return database posts directly (including empty array if all hidden)
    return posts as unknown as BlogPost[];
  } catch (error) {
    console.warn('⚠️ Database query for blog posts failed or DB is offline. Checking fallback.', error);
  }

  // 2. Secondary: Supabase client fallback
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          summary: p.excerpt || p.title,
          content: p.content,
          published: true,
          featuredImage: p.cover_image || null,
          createdAt: p.created_at || new Date().toISOString(),
          categoryId: p.category || 'tech',
          category: {
            id: p.category || 'tech',
            name: p.category || 'Engineering',
            slug: (p.category || 'tech').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
          author: {
            name: p.author || 'AstraIV Engineering Team',
            image: null,
          },
        }));
      }
    } catch (supaErr) {
      console.warn('[Client Supabase Blog Notice]:', supaErr);
    }
  }

  return FALLBACK_BLOG_POSTS;
}

/**
 * Fetch all blog categories with fallback safety for production
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });

    if (categories && categories.length > 0) {
      return categories as BlogCategory[];
    }
  } catch (error) {
    console.warn('⚠️ Database query for blog categories failed or DB is offline. Using fallback categories.', error);
  }

  return FALLBACK_BLOG_CATEGORIES;
}

/**
 * Fetch a single blog post by slug with fallback safety
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  let dbError = false;
  try {
    const post = await db.blogPost.findFirst({
      where: { slug, published: true },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (post) {
      return post as unknown as BlogPost;
    }
    // If query succeeded and returned null, article doesn't exist or is unpublished/hidden
    return null;
  } catch (error) {
    dbError = true;
    console.warn(`⚠️ Database query for blog post slug "${slug}" failed. Checking fallback posts.`, error);
  }

  // Fallback to Supabase if DB errored
  if (dbError && isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          slug: data.slug,
          summary: data.excerpt || data.title,
          content: data.content,
          published: true,
          featuredImage: data.cover_image || null,
          createdAt: data.created_at || new Date().toISOString(),
          categoryId: data.category || 'tech',
          category: {
            id: data.category || 'tech',
            name: data.category || 'Engineering',
            slug: (data.category || 'tech').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
          author: {
            name: data.author || 'AstraIV Engineering Team',
            image: null,
          },
        };
      }
    } catch (supaErr) {
      console.warn('[Client Supabase Single Post Notice]:', supaErr);
    }
  }

  // Only fall back to mock posts if DB is offline
  if (dbError) {
    const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
    return fallback || null;
  }

  return null;
}

/**
 * Fetch related blog posts
 */
export async function getRelatedBlogPosts(
  categoryId: string,
  excludePostIdOrSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    const posts = await db.blogPost.findMany({
      where: {
        published: true,
        categoryId: categoryId,
        NOT: [{ id: excludePostIdOrSlug }, { slug: excludePostIdOrSlug }],
      },
      take: limit,
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (posts && posts.length > 0) {
      return posts as unknown as BlogPost[];
    }
  } catch (error) {
    console.warn('⚠️ Database query for related posts failed. Using fallback related posts.', error);
  }

  const matchingFallback = FALLBACK_BLOG_POSTS.filter(
    (p) =>
      (p.categoryId === categoryId || p.category.slug === categoryId) &&
      p.id !== excludePostIdOrSlug &&
      p.slug !== excludePostIdOrSlug
  ).slice(0, limit);

  if (matchingFallback.length > 0) {
    return matchingFallback;
  }

  return FALLBACK_BLOG_POSTS.filter(
    (p) => p.id !== excludePostIdOrSlug && p.slug !== excludePostIdOrSlug
  ).slice(0, limit);
}
