/**
 * @file client/src/routes/public.routes.ts
 * @description Centralized definitions for all public marketing, content, and section anchor routes.
 */

export const PUBLIC_ROUTES = {
  HOME: '/',

  // Services
  SERVICES: '/services',
  SERVICE_DETAIL: (slug: string) => `/services/${slug}`,
  SERVICES_ANCHORS: {
    AI_INTELLIGENT_SYSTEMS: '/services#ai-intelligent-systems',
    SAAS_DEVELOPMENT: '/services#saas-development',
    CUSTOM_SOFTWARE: '/services#custom-software',
    ENTERPRISE_SOFTWARE: '/services#enterprise-software',
    WEB_DEVELOPMENT: '/services#web-development',
    MOBILE_APPS: '/services#mobile-apps',
    UIUX_DESIGN: '/services#uiux-design',
    CLOUD_INFRASTRUCTURE: '/services#cloud-infrastructure',
    DEVOPS_CICD: '/services#devops-cicd',
    BUSINESS_AUTOMATION: '/services#business-automation',
  },

  // Solutions
  SOLUTIONS: '/solutions',
  SOLUTIONS_ANCHORS: {
    AI_AGENTS: '/solutions#ai-agents',
    RAG_KNOWLEDGE: '/solutions#rag-knowledge',
    DATA_ANALYTICS: '/solutions#data-analytics',
    SAAS_PLATFORMS: '/solutions#saas-platforms',
    ENTERPRISE_APPLICATIONS: '/solutions#enterprise-applications',
    CLOUD_MIGRATION: '/solutions#cloud-migration',
    SECURITY_COMPLIANCE: '/solutions#security-compliance',
    WORKFLOW_AUTOMATION: '/solutions#workflow-automation',
    CUSTOMER_EXPERIENCE: '/solutions#customer-experience',
  },

  // Technology
  TECHNOLOGY: '/technology',
  TECHNOLOGY_ANCHORS: {
    ALL_TECHNOLOGIES: '/technology#technologies',
    AI_EXPERTISE: '/technology#ai-expertise',
    ARCHITECTURE: '/technology#architecture',
    FRONTEND: '/technology#frontend',
    BACKEND: '/technology#backend',
    CLOUD: '/technology#cloud',
    DATABASE: '/technology#database',
  },

  // Industries
  INDUSTRIES: '/industries',
  INDUSTRIES_ANCHORS: {
    FINTECH: '/industries#fintech-banking',
    HEALTHCARE: '/industries#healthcare-healthtech',
    ECOMMERCE: '/industries#ecommerce-retail',
    LOGISTICS: '/industries#logistics-supply-chain',
    REAL_ESTATE: '/industries#realestate-proptech',
    EDUCATION: '/industries#education-edtech',
  },

  // Company
  COMPANY: '/company',
  COMPANY_ANCHORS: {
    ABOUT: '/company#about',
    WHY_US: '/company#why-us',
    PROCESS: '/company#process',
    PRICING: '/company#pricing',
    CAREERS: '/company#careers',
  },

  // Portfolio
  PORTFOLIO: '/portfolio',

  // Blog & Insights
  BLOG: '/blog',
  BLOG_DETAIL: (slug: string) => `/blog/${slug}`,
  FAQ: '/faq',
  BLOG_FAQ_ANCHOR: '/blog#faq',

  // Contact
  CONTACT: '/contact',
} as const;
