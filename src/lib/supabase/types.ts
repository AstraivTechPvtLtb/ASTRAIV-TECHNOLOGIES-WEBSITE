export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string
          name: string
          company: string | null
          email: string
          phone: string | null
          service: string
          message: string
          status: 'pending' | 'contacted' | 'closed' | 'spam'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          company?: string | null
          email: string
          phone?: string | null
          service: string
          message: string
          status?: 'pending' | 'contacted' | 'closed' | 'spam'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string | null
          email?: string
          phone?: string | null
          service?: string
          message?: string
          status?: 'pending' | 'contacted' | 'closed' | 'spam'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          review_id: string | null
          client_name: string
          company: string | null
          designation: string | null
          review: string
          rating: number
          image_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          featured: boolean
          admin_note: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          review_id?: string | null
          client_name: string
          company?: string | null
          designation?: string | null
          review: string
          rating: number
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          featured?: boolean
          admin_note?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          review_id?: string | null
          client_name?: string
          company?: string | null
          designation?: string | null
          review?: string
          rating?: number
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          featured?: boolean
          admin_note?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          id: string
          email: string
          role: 'super_admin' | 'admin' | 'editor' | 'support'
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'super_admin' | 'admin' | 'editor' | 'support'
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'super_admin' | 'admin' | 'editor' | 'support'
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string | null
          description: string | null
          client: string | null
          industry: string | null
          services: string[]
          technologies: string[]
          image_url: string | null
          project_url: string | null
          status: 'draft' | 'published' | 'archived'
          featured: boolean
          metric: string | null
          metric_label: string | null
          gradient_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description?: string | null
          description?: string | null
          client?: string | null
          industry?: string | null
          services?: string[]
          technologies?: string[]
          image_url?: string | null
          project_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          metric?: string | null
          metric_label?: string | null
          gradient_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          client?: string | null
          industry?: string | null
          services?: string[]
          technologies?: string[]
          image_url?: string | null
          project_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          metric?: string | null
          metric_label?: string | null
          gradient_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          category: string | null
          short_desc: string | null
          full_desc: string | null
          description: string
          features: string[] | null
          badge: string | null
          icon: string
          image_url: string | null
          status: 'active' | 'draft' | 'archived'
          active?: boolean
          display_order: number
          order_index?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category?: string | null
          short_desc?: string | null
          full_desc?: string | null
          description: string
          features?: string[] | null
          badge?: string | null
          icon?: string
          image_url?: string | null
          status?: 'active' | 'draft' | 'archived'
          active?: boolean
          display_order?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string | null
          short_desc?: string | null
          full_desc?: string | null
          description?: string
          features?: string[] | null
          badge?: string | null
          icon?: string
          image_url?: string | null
          status?: 'active' | 'draft' | 'archived'
          active?: boolean
          display_order?: number
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image: string | null
          author: string
          category: string
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          cover_image?: string | null
          author?: string
          category?: string
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          cover_image?: string | null
          author?: string
          category?: string
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_settings: {
        Row: {
          id: string
          brand_tagline: string
          phone: string
          email: string
          address: string
          map_url: string | null
          copyright_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_tagline?: string
          phone?: string
          email?: string
          address?: string
          map_url?: string | null
          copyright_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_tagline?: string
          phone?: string
          email?: string
          address?: string
          map_url?: string | null
          copyright_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          platform: string
          name: string
          url: string
          icon: string
          active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          name: string
          url: string
          icon?: string
          active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          name?: string
          url?: string
          icon?: string
          active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_openings: {
        Row: {
          id: string
          title: string
          slug: string
          department: string
          type: string
          location: string
          experience: string | null
          description: string
          skills: string[]
          salary: string | null
          apply_url: string | null
          active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          department?: string
          type?: string
          location?: string
          experience?: string | null
          description?: string
          skills?: string[]
          salary?: string | null
          apply_url?: string | null
          active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          department?: string
          type?: string
          location?: string
          experience?: string | null
          description?: string
          skills?: string[]
          salary?: string | null
          apply_url?: string | null
          active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          badge: string | null
          is_popular: boolean
          price_type: string
          price_monthly_inr: number | null
          price_yearly_inr: number | null
          price_monthly_usd: number | null
          price_yearly_usd: number | null
          custom_price_label: string | null
          features: string[]
          button_text: string
          button_url: string
          active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          badge?: string | null
          is_popular?: boolean
          price_type?: string
          price_monthly_inr?: number | null
          price_yearly_inr?: number | null
          price_monthly_usd?: number | null
          price_yearly_usd?: number | null
          custom_price_label?: string | null
          features?: string[]
          button_text?: string
          button_url?: string
          active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          badge?: string | null
          is_popular?: boolean
          price_type?: string
          price_monthly_inr?: number | null
          price_yearly_inr?: number | null
          price_monthly_usd?: number | null
          price_yearly_usd?: number | null
          custom_price_label?: string | null
          features?: string[]
          button_text?: string
          button_url?: string
          active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type AdminProfile = Database['public']['Tables']['admin_profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type FooterSetting = Database['public']['Tables']['footer_settings']['Row'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];
