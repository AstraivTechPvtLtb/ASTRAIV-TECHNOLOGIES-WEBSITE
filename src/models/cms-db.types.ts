/**
 * @file client/src/models/cms-db.types.ts
 * @description Strongly-typed CMS Database models and queries for Astraiv Relational CMS.
 * Decoupled from internal Prisma client generation cache to ensure 100% IDE and runtime stability.
 */

export interface DbServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  badge: string | null;
  icon: string;
  active: boolean;
  status: string;
  featured: boolean;
  orderIndex: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbSolutionItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel: string | null;
  tagline: string | null;
  shortDesc: string;
  fullDesc: string | null;
  metricValue: string | null;
  metricLabel: string | null;
  features: string[];
  technologies: string[];
  capabilities: unknown;
  businessProblem: unknown;
  astraivApproach: unknown;
  active: boolean;
  status: string;
  featured: boolean;
  orderIndex: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbIndustryItem {
  id: string;
  slug: string;
  code: string | null;
  label: string;
  tagline: string | null;
  headline: string | null;
  image: string | null;
  imageAlt: string | null;
  accentColor: string | null;
  statusText: string | null;
  complianceBadge: string | null;
  challenge: string | null;
  solution: string | null;
  pillars: unknown;
  techStack: string[];
  kpis: unknown;
  active: boolean;
  status: string;
  featured: boolean;
  orderIndex: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbTechnologyItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  description: string | null;
  active: boolean;
  status: string;
  featured: boolean;
  orderIndex: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbPortfolioProject {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  projectType: string;
  credibilityBadge: string | null;
  credibilityNote: string | null;
  isRealClient: boolean;
  verifiedOutcome: boolean;
  client: string | null;
  clientContext: string | null;
  timeline: string | null;
  category: string;
  categoryType: string[];
  industrySlug: string | null;
  industryName: string | null;
  description: string;
  content: string;
  imageUrl: string | null;
  projectUrl: string | null;
  tags: string[];
  challenge: string | null;
  challengeDetails: string[];
  requirements: string[];
  solutionDetails: string[];
  architectureApproach: string | null;
  architectureHighlights: unknown;
  developmentProcess: unknown;
  measurableResults: unknown;
  techStackByCategory: unknown;
  testimonialId: string | null;
  published: boolean;
  status: string;
  featured: boolean;
  orderIndex: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  published: boolean;
  featuredImage: string | null;
  readingTime: string | null;
  authorName: string | null;
  authorRole: string | null;
  authorImage: string | null;
  tags: string[];
  status: string;
  featured: boolean;
  orderIndex: number;
  metaTitle: string | null;
  metaDescription: string | null;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
}

export interface DbAwardItem {
  id: string;
  type: string;
  title: string;
  organization: string;
  year: string;
  category: string;
  description: string;
  achievement: string;
  verificationUrl: string | null;
  verificationLabel: string | null;
  badgeText: string;
  status: string;
  published: boolean;
  featured: boolean;
  orderIndex: number;
  icon: string;
  highlights: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DbFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  isFeatured: boolean;
  status: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CmsDbClient {
  serviceItem: {
    findMany(args?: {
      where?: { active?: boolean; status?: string; slug?: { in?: string[] } | string };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbServiceItem[]>;
    findFirst(args: {
      where: { slug?: { in?: string[] } | string; active?: boolean; status?: string };
    }): Promise<DbServiceItem | null>;
  };
  solutionItem: {
    findMany(args?: {
      where?: { active?: boolean; status?: string; slug?: { in?: string[] } | string };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbSolutionItem[]>;
    findFirst(args: {
      where: { slug?: { in?: string[] } | string; active?: boolean; status?: string };
    }): Promise<DbSolutionItem | null>;
  };
  industryItem: {
    findMany(args?: {
      where?: { active?: boolean; status?: string; slug?: { in?: string[] } | string };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbIndustryItem[]>;
    findFirst(args: {
      where: { slug?: { in?: string[] } | string; active?: boolean; status?: string };
    }): Promise<DbIndustryItem | null>;
  };
  technologyItem: {
    findMany(args?: {
      where?: { active?: boolean; status?: string };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbTechnologyItem[]>;
  };
  portfolioProject: {
    findMany(args?: {
      where?: { published?: boolean; status?: string };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbPortfolioProject[]>;
    findFirst(args: {
      where: { slug: string; published?: boolean; status?: string };
    }): Promise<DbPortfolioProject | null>;
  };
  blogPost: {
    findMany(args?: {
      where?: { published?: boolean; status?: string };
      include?: { category?: boolean };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbBlogPost[]>;
    findFirst(args: {
      where: { slug: string; published?: boolean; status?: string };
      include?: { category?: boolean };
    }): Promise<DbBlogPost | null>;
  };
  awardItem: {
    findMany(args?: {
      where?: { published?: boolean; status?: string };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbAwardItem[]>;
  };
  faqItem: {
    findMany(args?: {
      where?: { status?: string; category?: string };
      orderBy?: { orderIndex?: 'asc' | 'desc' };
    }): Promise<DbFaqItem[]>;
  };
}
