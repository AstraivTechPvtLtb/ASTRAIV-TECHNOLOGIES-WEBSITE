/**
 * @file src/types/admin.ts
 * @description Domain TypeScript definitions and data interfaces for the Astraiv Admin Dashboard.
 */

export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'CLIENT' | 'USER';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type EnquiryStatus = 'pending' | 'contacted' | 'closed' | 'spam';
export type ContentStatus = 'draft' | 'published' | 'archived';

/**
 * Summary telemetry KPIs displayed on the Admin Dashboard overview.
 */
export interface AdminDashboardStats {
  totalEnquiries: number;
  pendingEnquiries: number;
  contactedEnquiries: number;
  closedEnquiries: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  featuredReviews: number;
  publishedProjects: number;
  draftProjects: number;
  totalServices: number;
  activeServices?: number;
  publishedBlogs?: number;
}

/**
 * Contact enquiry record received from client web forms or external leads.
 */
export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  service: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at?: string;
}

/**
 * Client review / testimonial record managed in the Admin Portal.
 */
export interface AdminReview {
  id: string;
  source_submission_id?: string | null;
  review_id?: string | null;
  client_name: string;
  company_name?: string | null;
  company?: string | null;
  designation?: string | null;
  project_name?: string | null;
  email?: string | null;
  overall_service_rating?: number | null;
  software_quality_rating?: number | null;
  communication_support_rating?: number | null;
  average_rating: number;
  display_rating: number;
  rating: number;
  liked_most?: string | null;
  would_recommend?: string | null;
  improvement_feedback?: string | null;
  original_review: string;
  review_text: string;
  review: string;
  image_url?: string | null;
  website_publish_permission?: string | null;
  can_publish_review: boolean;
  identity_display_permission?: string | null;
  status: ReviewStatus;
  featured: boolean;
  admin_note?: string | null;
  submitted_at?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at?: string;
}

/**
 * Input payload for creating or updating portfolio projects.
 */
export interface AdminProjectInput {
  title: string;
  slug: string;
  client?: string | null;
  industry?: string | null;
  short_description?: string | null;
  description?: string | null;
  status: ContentStatus;
  featured: boolean;
  metric?: string | null;
  metric_label?: string | null;
  services?: string[];
  technologies?: string[];
  cover_image?: string | null;
  gallery_images?: string[];
  display_order?: number;
}

/**
 * Input payload for creating or updating service catalog items.
 */
export interface AdminServiceInput {
  title: string;
  slug: string;
  description: string;
  icon: string;
  status: 'active' | 'draft' | 'archived';
  display_order?: number;
}

/**
 * Input payload for creating or updating blog articles.
 */
export interface AdminBlogInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  category: string;
  status: ContentStatus;
  cover_image?: string;
  published_at?: string;
}

/**
 * Query filter parameters for admin data tables.
 */
export interface AdminQueryFilters {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
}

/**
 * Standard server action response envelope.
 */
export interface AdminActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
