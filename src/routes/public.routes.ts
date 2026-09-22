/**
 * @file client/src/routes/public.routes.ts
 * @description Centralized definitions for all public marketing, content, and section anchor routes.
 * Strictly adheres to:
 * SERVICES = WHAT ASTRAIV DOES
 * SOLUTIONS = WHAT BUSINESS PROBLEMS ASTRAIV SOLVES
 */

export const PUBLIC_ROUTES = {
  HOME: '/',

  // Services (WHAT ASTRAIV DOES)
  SERVICES: '/services',
  SERVICE_DETAIL: (slug: string) => `/services/${slug}`,
  SERVICES_ANCHORS: {
    // Canonical 8 Engineering Disciplines
    AI_DEVELOPMENT: '/services#ai-development',
    CUSTOM_SOFTWARE: '/services#custom-software',
    WEB_DEVELOPMENT: '/services#web-development',
    WEB_APPLICATIONS: '/services#web-development',
    MOBILE_DEVELOPMENT: '/services#mobile-development',
    CLOUD_ENGINEERING: '/services#cloud-engineering',
    DEVOPS: '/services#devops',
    UI_UX_DESIGN: '/services#ui-ux-design',
    TECHNOLOGY_CONSULTING: '/services#technology-consulting',

    // Backward-compatibility Aliases
    AI_INTELLIGENT_SYSTEMS: '/services#ai-development',
    AI_SOLUTIONS: '/services#ai-development',
    SAAS_DEVELOPMENT: '/services#web-development',
    ENTERPRISE_SOFTWARE: '/services#custom-software',
    WEBSITE_DEVELOPMENT: '/services#web-development',
    MOBILE_APPS: '/services#mobile-development',
    UIUX_DESIGN: '/services#ui-ux-design',
    CLOUD_INFRASTRUCTURE: '/services#cloud-engineering',
    CLOUD_SOLUTIONS: '/services#cloud-engineering',
    DEVOPS_CICD: '/services#devops',
    BUSINESS_AUTOMATION: '/solutions#business-process-automation',
    DIGITAL_TRANSFORMATION: '/solutions#digital-transformation',
    IT_CONSULTING: '/services#technology-consulting',
  },

  // Solutions (WHAT BUSINESS PROBLEMS ASTRAIV SOLVES)
  SOLUTIONS: '/solutions',
  SOLUTION_DETAIL: (slug: string) => `/solutions/${slug}`,
  SOLUTIONS_ANCHORS: {
    // Canonical 7 Enterprise Solutions
    AI_BUSINESS_AUTOMATION: '/solutions#ai-business-automation',
    RAG_KNOWLEDGE: '/solutions#rag-knowledge',
    SAAS_PLATFORMS: '/solutions#saas-platforms',
    DATA_ANALYTICS: '/solutions#data-analytics',
    BUSINESS_PROCESS_AUTOMATION: '/solutions#business-process-automation',
    LEGACY_MODERNIZATION: '/solutions#legacy-modernization',
    DIGITAL_TRANSFORMATION: '/solutions#digital-transformation',

    // Backward-compatibility Aliases
    AI_AGENTS: '/solutions#ai-business-automation',
    ENTERPRISE_APPLICATIONS: '/solutions#saas-platforms',
    SYSTEM_INTEGRATION: '/solutions#legacy-modernization',
    CLOUD_MIGRATION: '/solutions#legacy-modernization',
    SECURITY_COMPLIANCE: '/solutions#legacy-modernization',
    WORKFLOW_AUTOMATION: '/solutions#business-process-automation',
    CUSTOMER_EXPERIENCE: '/solutions#legacy-modernization',
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
  INDUSTRY_DETAIL: (slug: string) => `/industries/${slug}`,
  INDUSTRIES_ANCHORS: {
    FINTECH: '/industries#fintech',
    FINTECH_BANKING: '/industries#fintech-banking',
    HEALTHCARE: '/industries#healthtech',
    HEALTHCARE_HEALTHTECH: '/industries#healthcare-healthtech',
    SAAS: '/industries#saas',
    ECOMMERCE: '/industries#ecommerce',
    ECOMMERCE_RETAIL: '/industries#ecommerce-retail',
    LOGISTICS: '/industries#logistics',
    LOGISTICS_SUPPLY_CHAIN: '/industries#logistics-supply-chain',
    REAL_ESTATE: '/industries#realestate-proptech',
    EDUCATION: '/industries#edtech',
    EDUCATION_EDTECH: '/industries#education-edtech',
    PROFESSIONAL_SERVICES: '/industries#professional-services',
    OTHER_INDUSTRIES: '/industries#other-industries',
  },

  // Company
  COMPANY: '/company',
  COMPANY_REWARDS_ACCOLADES: '/company/rewards-accolades',
  COMPANY_ANCHORS: {
    ABOUT: '/company#about',
    WHY_US: '/company#why-us',
    PROCESS: '/company#process',
    REVIEWS: '/company#reviews',
    REWARDS_ACCOLADES: '/company/rewards-accolades',
    REWARDS_ACCOLADES_ANCHOR: '/company#rewards-accolades',
    ENGAGEMENT_MODELS: '/company#engagement-models',
    PRICING: '/company#engagement-models',
    CAREERS: '/company#careers',
    CONTACT: '/company#contact',
  },

  // Work & Case Studies Architecture
  WORK: '/work',
  CASE_STUDIES: '/work/case-studies',
  WORK_CASE_STUDIES: '/work/case-studies',
  CASE_STUDY_DETAIL: (slug: string) => `/work/case-studies/${slug}`,
  WORK_CASE_STUDY_DETAIL: (slug: string) => `/work/case-studies/${slug}`,
  WORK_TESTIMONIALS: '/work/testimonials',

  // Backward-compatible Portfolio Aliases
  PORTFOLIO: '/work/case-studies',
  PORTFOLIO_DETAIL: (slug: string) => `/work/case-studies/${slug}`,

  // Standalone Specialized Pages & Careers Architecture
  CAREERS: '/careers',
  CAREER_DETAIL: (slug: string) => `/careers/${slug}`,
  CAREER_APPLY: (slug: string) => `/careers/${slug}#apply`,
  CAREER_CONFIRMATION: '/careers/confirmation',
  PRICING: '/pricing',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ABOUT: '/company',
  REVIEWS: '/work/testimonials',
  TESTIMONIALS: '/work/testimonials',
  REWARDS_ACCOLADES: '/company/rewards-accolades',

  // Scalable Insights & Blog Architecture
  INSIGHTS: '/insights',
  INSIGHTS_BLOG: '/insights/blog',
  INSIGHTS_DETAIL: (slug: string) => `/insights/${slug}`,
  BLOG: '/insights/blog',
  BLOG_DETAIL: (slug: string) => `/insights/${slug}`,
  BLOG_FAQ_ANCHOR: '/insights#faq',
  INSIGHTS_ANCHORS: {
    BLOG: '/insights#blog',
    AI_INSIGHTS: '/insights#ai-insights',
    ENGINEERING: '/insights#blog',
    TECH_INSIGHTS: '/insights#tech-insights',
    TECHNOLOGY: '/technology',
    RESOURCES: '/insights#resources',
  },

  // CTA & Utilities
  PRIMARY_CTA: '/start-project',
  START_PROJECT: '/start-project',
  THANK_YOU: '/thank-you',
  SECONDARY_UTILITY: '/auth/login',
  CLIENT_PORTAL: '/auth/login',

  // Contact
  CONTACT: '/contact',
} as const;
