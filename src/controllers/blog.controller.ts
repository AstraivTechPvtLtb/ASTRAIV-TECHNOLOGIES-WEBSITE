/**
 * @file client/src/controllers/blog.controller.ts
 * @description [CONTROLLER] Business logic and data fetching for Blog posts and categories.
 */

import { db } from '@/models/db';

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

export const FALLBACK_BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'cat-tech',
    name: 'Technology & AI',
    slug: 'tech-ai',
  },
  {
    id: 'cat-design',
    name: 'UI/UX & Branding',
    slug: 'design-branding',
  },
  {
    id: 'cat-business',
    name: 'Business Strategy',
    slug: 'business-strategy',
  },
];

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Building Scalable SaaS Solutions in 2026',
    slug: 'building-scalable-saas-2026',
    summary:
      'Explore the modern architectures powering high-performance, enterprise-grade SaaS environments using Next.js 16 and Prisma.',
    content: `
      <p>Enterprise-grade SaaS demands rigorous attention to database normalization, edge-caching strategies, and secure session handshakes. In this technical deep dive, we explore how modern architectures sustain thousands of concurrent queries without latency degradation.</p>
      <h2>The Core Stack</h2>
      <p>Our standard production stack pairs Next.js App Router as the full-stack engine with PostgreSQL and Prisma ORM. By utilizing connection pooling adapters and edge-distributed API routing, we ensure sub-50ms TTFB across global geographic zones.</p>
      <h2>Multi-Tenant Architecture & Data Isolation</h2>
      <p>Designing for enterprise multi-tenancy requires strict separation of tenant data. Whether utilizing row-level security (RLS) or schema-per-tenant isolation, data integrity and compliance (SOC2, GDPR) must be guaranteed at the database layer.</p>
      <h2>Edge Caching & State Hydration</h2>
      <p>Optimizing dynamic content delivery with distributed edge networks minimizes redundant database roundtrips. Employing selective revalidation tags ensures users always see fresh metrics without incurring heavy database overhead.</p>
      <h2>Conclusion</h2>
      <p>Building high-velocity SaaS applications in 2026 requires continuous alignment between frontend responsiveness, robust backend services, and scalable cloud infrastructure.</p>
    `,
    published: true,
    featuredImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-08-15T10:00:00Z',
    categoryId: 'cat-tech',
    category: FALLBACK_BLOG_CATEGORIES[0],
    author: {
      name: 'Astraiv Admin',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop',
    },
  },
  {
    id: 'post-2',
    title: 'The Psychology of Modern UX/UI Systems',
    slug: 'psychology-modern-uxui-systems',
    summary:
      'How strict layout grids, subtle micro-interactions, and curated visual tokens establish immediate customer trust.',
    content: `
      <p>A user interface is the digital storefront of a modern technology firm. The presence of subtle hover animations, predictable layout structures, and high-contrast styling makes digital products feel organic, premium, and dependable.</p>
      <h2>Visual Hierarchy and Cognitive Load</h2>
      <p>Every element on a screen competes for cognitive bandwidth. By establishing clear typography scales, harmonious spacing systems, and purposeful contrast, we guide users effortlessly toward key conversion goals.</p>
      <h2>Micro-Interactions and Tactile Feedback</h2>
      <p>Micro-interactions provide immediate confirmation of user intent. Spring-based physics, smooth accordion expansions, and subtle gradient shines reassure the user that the system is responsive and reliable.</p>
      <h2>Design Tokens & System Scalability</h2>
      <p>Maintaining visual consistency across dozens of application screens requires a centralized token architecture. Standardizing colors, radii, shadows, and spacing tokens in Tailwind CSS and Figma ensures flawless engineering handoffs.</p>
    `,
    published: true,
    featuredImage:
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-08-10T14:30:00Z',
    categoryId: 'cat-design',
    category: FALLBACK_BLOG_CATEGORIES[1],
    author: {
      name: 'Sarah Mitchell',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
    },
  },
  {
    id: 'post-3',
    title: 'AI-Driven Development: Navigating the Next Era of Enterprise Innovation',
    slug: 'future-of-ai-driven-enterprises',
    summary:
      'How forward-thinking leadership teams integrate AI agents and automated workflows to accelerate go-to-market cycles.',
    content: `
      <p>Artificial intelligence is no longer an experimental lab capability; it has become the fundamental backbone of modern enterprise execution and digital operations.</p>
      <h2>Autonomous Agent Workflows</h2>
      <p>Modern AI agents can coordinate complex business workflows, from automated CRM qualification to real-time code refactoring and customer ticket triage. Integrating these agents directly into core company pipelines yields 10x velocity gains.</p>
      <h2>Data Governance and Security</h2>
      <p>Enterprise adoption of AI hinges on stringent data governance. Ensuring model inputs are sanitized, private data is isolated, and compliance guardrails are enforced is paramount before deploying agentic systems in production.</p>
      <h2>The Road Ahead</h2>
      <p>Organizations that adopt intelligent automation today will define market standards for efficiency, product quality, and user satisfaction tomorrow.</p>
    `,
    published: true,
    featuredImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-08-01T09:00:00Z',
    categoryId: 'cat-business',
    category: FALLBACK_BLOG_CATEGORIES[2],
    author: {
      name: 'John Doe',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
    },
  },
  {
    id: 'post-4',
    title: 'Why Cloudflare R2 is the Future of Asset Delivery',
    slug: 'cloudflare-r2-asset-delivery',
    summary:
      'A deep dive comparing AWS S3 egress costs with Cloudflare’s zero-egress asset bucket architecture.',
    content: `
      <p>High egress bandwidth fees have historically presented a major operational hurdle for media-rich SaaS applications and global platforms. Cloudflare R2 reimagines object storage with zero egress charges.</p>
      <h2>S3 API Compatibility</h2>
      <p>Cloudflare R2 provides full S3 API compatibility, allowing engineering teams to seamlessly transition existing AWS SDK code without modifying upload or retrieval logic.</p>
      <h2>Global Edge Distribution</h2>
      <p>Paired with Cloudflare's worldwide CDN network, assets stored in R2 are served with exceptional cache hit ratios and near-instant load times globally.</p>
    `,
    published: true,
    featuredImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-07-25T11:00:00Z',
    categoryId: 'cat-tech',
    category: FALLBACK_BLOG_CATEGORIES[0],
    author: {
      name: 'Alice Smith',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop',
    },
  },
];

/**
 * Fetch all published blog posts with fallback safety for production
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
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

    if (posts && posts.length > 0) {
      return posts as unknown as BlogPost[];
    }
  } catch (error) {
    console.warn('⚠️ Database query for blog posts failed or DB is offline. Using fallback posts.', error);
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
  } catch (error) {
    console.warn(`⚠️ Database query for blog post slug "${slug}" failed. Checking fallback posts.`, error);
  }

  const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
  return fallback || null;
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
