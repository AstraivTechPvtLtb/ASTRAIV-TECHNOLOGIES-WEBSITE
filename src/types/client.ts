/**
 * @file src/types/client.ts
 * @description Domain TypeScript definitions for AstraIV Technologies Client-Facing Website and Portal.
 * Includes data models for public services, portfolio, blog, enquiries, client tickets, and telemetry.
 */

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

/**
 * Public Contact / Enquiry submission payload.
 */
export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
  source?: string;
}

/**
 * Public review submission payload from client feedback form.
 */
export interface PublicReviewInput {
  client_name: string;
  company?: string;
  rating: number;
  review: string;
  service?: string;
}

/**
 * Publicly visible approved client review.
 */
export interface PublicReview {
  id: string;
  client_name: string;
  company?: string | null;
  rating: number;
  review: string;
  service?: string | null;
  created_at: Date | string;
}

/**
 * Publicly visible portfolio project / case study.
 */
export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail?: string | null;
  clientName?: string | null;
  category: string;
  featured: boolean;
  technologies: string[];
  createdAt: Date | string;
}

/**
 * Publicly visible service catalog item.
 */
export interface PublicService {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
  features: string[];
  pricingStartingAt?: number | null;
  popular?: boolean;
}

/**
 * Publicly visible blog post.
 */
export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  category: string;
  tags: string[];
  createdAt: Date | string;
}

/**
 * Client Portal Ticket model.
 */
export interface ClientTicketData {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  clientId: string;
  assignedToId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Client Portal Project overview model.
 */
export interface ClientProjectData {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  budget?: number | null;
  clientId?: string | null;
  managerId?: string | null;
}

/**
 * Generic response wrapper for Client-facing server actions.
 */
export interface ClientActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
