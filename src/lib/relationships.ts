/**
 * @file client/src/lib/relationships.ts
 * @description Centralized declarative relationship registry connecting:
 * SERVICES (What Astraiv Does)
 * SOLUTIONS (What Business Problems Astraiv Solves)
 * INDUSTRIES (Domain Verticals)
 * CASE STUDIES (Production Proof)
 * TECHNOLOGIES (Hardened Production Primitives)
 */

import { getSolutionBySlug, getAllSolutions, SolutionDetail } from '@/lib/solutions-data';
import { getIndustryBySlug, getAllIndustries, IndustryDetail } from '@/lib/industries-data';
import { DEFAULT_PORTFOLIO_PROJECTS, PublicPortfolioProject } from '@/lib/portfolio-data';
import { DEFAULT_SERVICES, PublicServiceItem } from '@/lib/services-data';

/* -------------------------------------------------------------------------- */
/*                               SERVICE RELATIONS                            */
/* -------------------------------------------------------------------------- */

export interface ServiceRelationshipConfig {
  serviceSlug: string;
  relatedSolutionSlugs: string[];
  relevantIndustrySlugs: string[];
  technologies: {
    category: string;
    items: string[];
  }[];
  relatedCaseStudySlugs: string[];
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    href: string;
  };
}

export const SERVICE_RELATIONSHIPS: Record<string, ServiceRelationshipConfig> = {
  'ai-development': {
    serviceSlug: 'ai-development',
    relatedSolutionSlugs: ['ai-business-automation', 'rag-knowledge', 'data-analytics'],
    relevantIndustrySlugs: ['fintech', 'healthtech', 'saas', 'logistics'],
    technologies: [
      { category: 'AI & Inference', items: ['Python', 'FastAPI', 'PyTorch', 'Claude 3.5 Sonnet', 'OpenAI GPT-4o'] },
      { category: 'Agent Orchestration', items: ['LangGraph', 'Temporal.io', 'LangChain', 'LlamaIndex'] },
      { category: 'Vector & Data', items: ['pgvector', 'Pinecone', 'Redis', 'PostgreSQL'] },
    ],
    relatedCaseStudySlugs: ['financeflow', 'aerosync'],
    cta: {
      title: 'Ready to engineer frontier AI into your production pipelines?',
      subtitle: 'Connect with our senior AI architects to assess data readiness, model fine-tuning, and SLA guardrails.',
      buttonText: 'Start a Project',
      href: '/contact?service=AI%20Development',
    },
  },
  'custom-software': {
    serviceSlug: 'custom-software',
    relatedSolutionSlugs: ['saas-platforms', 'business-process-automation', 'legacy-modernization'],
    relevantIndustrySlugs: ['fintech', 'saas', 'logistics', 'professional-services'],
    technologies: [
      { category: 'Core Languages', items: ['TypeScript', 'Go', 'Node.js', 'Python'] },
      { category: 'Architecture & Storage', items: ['PostgreSQL', 'Redis', 'GraphQL', 'Prisma ORM'] },
      { category: 'Event Streaming', items: ['Apache Kafka', 'RabbitMQ', 'Docker', 'BullMQ'] },
    ],
    relatedCaseStudySlugs: ['pulsefit', 'financeflow'],
    cta: {
      title: 'Ready to build bespoke software engineered for proprietary scale?',
      subtitle: 'Eliminate rigid off-the-shelf SaaS constraints with custom architectures tailored to your exact workflows.',
      buttonText: 'Start a Project',
      href: '/contact?service=Custom%20Software%20Development',
    },
  },
  'web-applications': {
    serviceSlug: 'web-applications',
    relatedSolutionSlugs: ['saas-platforms', 'data-analytics', 'digital-transformation'],
    relevantIndustrySlugs: ['saas', 'ecommerce', 'edtech', 'healthtech'],
    technologies: [
      { category: 'Frontend Frameworks', items: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS'] },
      { category: 'State & Realtime', items: ['WebSockets', 'React Server Actions', 'TanStack Query', 'Zustand'] },
      { category: 'Cloud Edge', items: ['Cloudflare Edge', 'Vercel', 'PostgreSQL', 'Prisma'] },
    ],
    relatedCaseStudySlugs: ['pulsefit'],
    cta: {
      title: 'Ready to launch an ultra-fast, high-concurrency web platform?',
      subtitle: 'From sub-second page loads to multi-tenant client portals, we build mission-critical web applications.',
      buttonText: 'Start a Project',
      href: '/contact?service=Web%20Application%20Development',
    },
  },
  'mobile-development': {
    serviceSlug: 'mobile-development',
    relatedSolutionSlugs: ['saas-platforms', 'business-process-automation', 'digital-transformation'],
    relevantIndustrySlugs: ['logistics', 'healthtech', 'ecommerce', 'edtech'],
    technologies: [
      { category: 'Mobile Frameworks', items: ['React Native', 'Flutter', 'Expo', 'TypeScript'] },
      { category: 'Offline Storage', items: ['SQLite', 'WatermelonDB', 'MMKV', 'CRDT Sync'] },
      { category: 'Services & Auth', items: ['Firebase Cloud Messaging', 'APNs', 'Biometric APIs', 'WebSockets'] },
    ],
    relatedCaseStudySlugs: ['aerosync'],
    cta: {
      title: 'Ready to build high-performance mobile apps for iOS and Android?',
      subtitle: 'Single-codebase cross-platform velocity paired with 60fps native performance and offline resilience.',
      buttonText: 'Start a Project',
      href: '/contact?service=Mobile%20Development',
    },
  },
  'cloud-engineering': {
    serviceSlug: 'cloud-engineering',
    relatedSolutionSlugs: ['legacy-modernization', 'saas-platforms', 'data-analytics', 'digital-transformation'],
    relevantIndustrySlugs: ['fintech', 'saas', 'ecommerce', 'other-industries'],
    technologies: [
      { category: 'Cloud Providers', items: ['AWS', 'Cloudflare', 'Google Cloud', 'Terraform'] },
      { category: 'Database & Caching', items: ['PostgreSQL Replicas', 'PgBouncer', 'Redis', 'R2 Storage'] },
      { category: 'Containers & Edge', items: ['Docker', 'AWS ECS / Fargate', 'Edge Workers', 'Zero-Egress CDNs'] },
    ],
    relatedCaseStudySlugs: ['pulsefit', 'aerosync'],
    cta: {
      title: 'Ready to architect zero-downtime, multi-region cloud infrastructure?',
      subtitle: 'Scale automatically under load, prevent single points of failure, and optimize monthly cloud expenditures.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Cloud%20Engineering',
    },
  },
  'devops': {
    serviceSlug: 'devops',
    relatedSolutionSlugs: ['legacy-modernization', 'saas-platforms', 'digital-transformation'],
    relevantIndustrySlugs: ['fintech', 'saas', 'healthtech', 'ecommerce'],
    technologies: [
      { category: 'CI/CD & GitOps', items: ['GitHub Actions', 'ArgoCD', 'GitLab CI', 'Helm'] },
      { category: 'Orchestration', items: ['Kubernetes (EKS/GKE)', 'Docker', 'OpenTofu', 'Terraform'] },
      { category: 'Observability', items: ['Datadog', 'Prometheus', 'Grafana', 'Sentry APM'] },
    ],
    relatedCaseStudySlugs: ['pulsefit', 'financeflow'],
    cta: {
      title: 'Ready to accelerate deployment velocity with automated DevOps?',
      subtitle: 'Eliminate human error with continuous integration, automated test suites, and immutable infrastructure.',
      buttonText: 'Start a Project',
      href: '/contact?service=DevOps',
    },
  },
  'ui-ux-design': {
    serviceSlug: 'ui-ux-design',
    relatedSolutionSlugs: ['saas-platforms', 'digital-transformation', 'ai-business-automation'],
    relevantIndustrySlugs: ['saas', 'fintech', 'healthtech', 'edtech'],
    technologies: [
      { category: 'Design Systems', items: ['Figma Tokens', 'Design Systems', 'Component Libraries', 'Storybook'] },
      { category: 'Prototyping & Motion', items: ['Framer Motion', 'Interactive Prototypes', 'User Journeys'] },
      { category: 'Standards', items: ['WCAG 2.1 AAA', 'Responsive Grids', 'Tailwind CSS', 'Micro-Interactions'] },
    ],
    relatedCaseStudySlugs: ['pulsefit'],
    cta: {
      title: 'Ready to design a Stripe-grade interface that converts and retains users?',
      subtitle: 'We craft comprehensive design systems, high-fidelity prototypes, and frictionless user experiences.',
      buttonText: 'Start a Project',
      href: '/contact?service=UI%2FUX%20Design',
    },
  },
  'technology-consulting': {
    serviceSlug: 'technology-consulting',
    relatedSolutionSlugs: ['legacy-modernization', 'digital-transformation', 'ai-business-automation', 'data-analytics'],
    relevantIndustrySlugs: ['fintech', 'healthtech', 'professional-services', 'other-industries'],
    technologies: [
      { category: 'Architecture Frameworks', items: ['C4 Model', 'Domain-Driven Design', 'AWS Well-Architected'] },
      { category: 'Audits & Security', items: ['SOC-2 Type II Prep', 'Threat Modeling', 'Code Quality Audits'] },
      { category: 'Leadership & FinOps', items: ['Fractional CTO', 'Cloud Cost Optimization', 'Vendor Selection'] },
    ],
    relatedCaseStudySlugs: ['financeflow', 'pulsefit'],
    cta: {
      title: 'Need senior technical advisory or an architectural audit?',
      subtitle: 'Partner with principal architects to de-risk investments, evaluate vendor tech, and build scaling roadmaps.',
      buttonText: 'Talk to an Expert',
      href: '/contact?service=Technology%20Consulting',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                              SOLUTION RELATIONS                            */
/* -------------------------------------------------------------------------- */

export interface SolutionRelationshipConfig {
  solutionSlug: string;
  relatedServiceSlugs: string[];
  relevantIndustrySlugs: string[];
  relatedCaseStudySlugs: string[];
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    href: string;
  };
}

export const SOLUTION_RELATIONSHIPS: Record<string, SolutionRelationshipConfig> = {
  'ai-business-automation': {
    solutionSlug: 'ai-business-automation',
    relatedServiceSlugs: ['ai-development', 'custom-software', 'devops'],
    relevantIndustrySlugs: ['fintech', 'logistics', 'healthtech', 'saas'],
    relatedCaseStudySlugs: ['aerosync', 'financeflow'],
    cta: {
      title: 'Ready to solve operational bottlenecks with AI & Business Automation?',
      subtitle: 'Schedule a discovery session with our engineers to scope agent architectures and automated pipelines.',
      buttonText: 'Talk to an Expert',
      href: '/contact?solution=AI%20%26%20Business%20Automation',
    },
  },
  'rag-knowledge': {
    solutionSlug: 'rag-knowledge',
    relatedServiceSlugs: ['ai-development', 'custom-software', 'cloud-engineering'],
    relevantIndustrySlugs: ['healthtech', 'fintech', 'professional-services', 'saas'],
    relatedCaseStudySlugs: ['financeflow'],
    cta: {
      title: 'Ready to turn unstructured document lakes into instant neural knowledge?',
      subtitle: 'Discuss private vector indexing, RBAC security gates, and zero-hallucination guardrails with our team.',
      buttonText: 'Talk to an Expert',
      href: '/contact?solution=RAG%20%2F%20Enterprise%20Knowledge%20Systems',
    },
  },
  'saas-platforms': {
    solutionSlug: 'saas-platforms',
    relatedServiceSlugs: ['web-applications', 'custom-software', 'cloud-engineering', 'ui-ux-design'],
    relevantIndustrySlugs: ['saas', 'fintech', 'edtech', 'ecommerce'],
    relatedCaseStudySlugs: ['pulsefit'],
    cta: {
      title: 'Ready to architect a high-growth, multi-tenant SaaS platform?',
      subtitle: 'Consult with our architects on Row-Level Security, automated billing lifecycles, and sub-second edge SSR.',
      buttonText: 'Talk to an Expert',
      href: '/contact?solution=SaaS%20Platforms',
    },
  },
  'data-analytics': {
    solutionSlug: 'data-analytics',
    relatedServiceSlugs: ['custom-software', 'cloud-engineering', 'ai-development'],
    relevantIndustrySlugs: ['fintech', 'logistics', 'ecommerce', 'other-industries'],
    relatedCaseStudySlugs: ['pulsefit', 'aerosync'],
    cta: {
      title: 'Ready to unlock sub-50ms analytical telemetry over billions of rows?',
      subtitle: 'Scope your event streaming pipelines, columnar warehouse architecture, and executive BI dashboards.',
      buttonText: 'Talk to an Expert',
      href: '/contact?solution=Data%20%26%20Analytics%20Platforms',
    },
  },
  'business-process-automation': {
    solutionSlug: 'business-process-automation',
    relatedServiceSlugs: ['custom-software', 'devops', 'technology-consulting'],
    relevantIndustrySlugs: ['logistics', 'professional-services', 'fintech', 'ecommerce'],
    relatedCaseStudySlugs: ['aerosync'],
    cta: {
      title: 'Ready to eliminate hundreds of manual administrative hours per month?',
      subtitle: 'Let our integration engineers construct durable, event-driven orchestration pipelines with automated recovery.',
      buttonText: 'Talk to an Expert',
      href: '/contact?solution=Business%20Process%20Automation',
    },
  },
  'legacy-modernization': {
    solutionSlug: 'legacy-modernization',
    relatedServiceSlugs: ['cloud-engineering', 'devops', 'custom-software', 'technology-consulting'],
    relevantIndustrySlugs: ['fintech', 'healthtech', 'logistics', 'other-industries'],
    relatedCaseStudySlugs: ['pulsefit', 'financeflow'],
    cta: {
      title: 'Ready to migrate off fragile legacy monoliths with zero downtime?',
      subtitle: 'Discover our proven strangler-fig pattern, dual-write data verification, and cloud-native microservices.',
      buttonText: 'Talk to an Expert',
      href: '/contact?solution=Legacy%20Modernization',
    },
  },
  'digital-transformation': {
    solutionSlug: 'digital-transformation',
    relatedServiceSlugs: ['technology-consulting', 'web-applications', 'mobile-development', 'ui-ux-design'],
    relevantIndustrySlugs: ['professional-services', 'healthtech', 'logistics', 'edtech'],
    relatedCaseStudySlugs: ['pulsefit', 'aerosync'],
    cta: {
      title: 'Ready to transition analog operations to unified, scalable cloud platforms?',
      subtitle: 'Schedule a holistic operational consultation to map bottlenecks, blueprints, and change management.',
      buttonText: 'Talk to an Expert',
      href: '/contact?solution=Digital%20Transformation',
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                                HELPER GETTERS                              */
/* -------------------------------------------------------------------------- */

const CANONICAL_SERVICE_SLUG_MAP: Record<string, string> = {
  'ai-solutions': 'ai-development',
  'ai-intelligent-systems': 'ai-development',
  'ai-development': 'ai-development',
  'custom-software': 'custom-software',
  'custom-software-development': 'custom-software',
  'enterprise-software': 'custom-software',
  'web-applications': 'web-applications',
  'web-development': 'web-applications',
  'website-development': 'web-applications',
  'mobile-apps': 'mobile-development',
  'mobile-development': 'mobile-development',
  'cloud-solutions': 'cloud-engineering',
  'cloud-infrastructure': 'cloud-engineering',
  'cloud-engineering': 'cloud-engineering',
  'devops-ci-cd': 'devops',
  'devops-cicd': 'devops',
  'devops': 'devops',
  'ui-ux-design': 'ui-ux-design',
  'uiux-design': 'ui-ux-design',
  'it-consulting': 'technology-consulting',
  'technology-consulting': 'technology-consulting',
};

const CANONICAL_SOLUTION_SLUG_MAP: Record<string, string> = {
  'ai-agents': 'ai-business-automation',
  'ai-business-automation': 'ai-business-automation',
  'business-automation': 'ai-business-automation',
  'rag-knowledge': 'rag-knowledge',
  'rag-knowledge-systems': 'rag-knowledge',
  'saas-platforms': 'saas-platforms',
  'saas-development': 'saas-platforms',
  'enterprise-applications': 'saas-platforms',
  'data-analytics': 'data-analytics',
  'data-analytics-platforms': 'data-analytics',
  'business-process-automation': 'business-process-automation',
  'workflow-automation': 'business-process-automation',
  'legacy-modernization': 'legacy-modernization',
  'cloud-migration': 'legacy-modernization',
  'system-integration': 'legacy-modernization',
  'customer-experience': 'legacy-modernization',
  'security-compliance': 'legacy-modernization',
  'digital-transformation': 'digital-transformation',
  'enterprise-transformation': 'digital-transformation',
};

/**
 * Normalizes any service slug to its canonical key.
 */
export function normalizeServiceSlug(slug: string): string {
  const norm = slug.toLowerCase().trim();
  return CANONICAL_SERVICE_SLUG_MAP[norm] || norm;
}

/**
 * Normalizes any solution slug to its canonical key.
 */
export function normalizeSolutionSlug(slug: string): string {
  const norm = slug.toLowerCase().trim();
  return CANONICAL_SOLUTION_SLUG_MAP[norm] || norm;
}

/**
 * Normalizes any industry slug to its canonical key.
 */
export function normalizeIndustrySlug(slug: string): string {
  const norm = slug.toLowerCase().trim();
  const map: Record<string, string> = {
    'fintech-banking': 'fintech',
    'healthcare-healthtech': 'healthtech',
    'healthcare': 'healthtech',
    'saas-technology': 'saas',
    'ecommerce-retail': 'ecommerce',
    'logistics-supply-chain': 'logistics',
    'education-edtech': 'edtech',
    'legal-professional': 'professional-services',
  };
  return map[norm] || norm;
}

/**
 * Dynamically queries all Case Studies associated with a specific Service.
 */
export function getCaseStudiesForService(rawSlug: string): PublicPortfolioProject[] {
  const canonical = normalizeServiceSlug(rawSlug);
  return DEFAULT_PORTFOLIO_PROJECTS.filter((cs) =>
    cs.relatedServiceSlugs?.some((s) => normalizeServiceSlug(s) === canonical)
  );
}

/**
 * Dynamically queries all Case Studies associated with a specific Solution.
 */
export function getCaseStudiesForSolution(rawSlug: string): PublicPortfolioProject[] {
  const canonical = normalizeSolutionSlug(rawSlug);
  return DEFAULT_PORTFOLIO_PROJECTS.filter((cs) =>
    cs.relatedSolutionSlugs?.some((s) => normalizeSolutionSlug(s) === canonical)
  );
}

/**
 * Dynamically queries all Case Studies associated with a specific Industry.
 */
export function getCaseStudiesForIndustry(rawSlug: string): PublicPortfolioProject[] {
  const canonical = normalizeIndustrySlug(rawSlug);
  return DEFAULT_PORTFOLIO_PROJECTS.filter((cs) =>
    normalizeIndustrySlug(cs.industrySlug) === canonical
  );
}

/**
 * Resolves full structured relationships for a Service Detail Page.
 */
export function getServiceRelationships(rawSlug: string) {
  const canonical = normalizeServiceSlug(rawSlug);
  const config = SERVICE_RELATIONSHIPS[canonical] || SERVICE_RELATIONSHIPS['ai-development'];

  // Resolve Related Solutions
  const relatedSolutions: SolutionDetail[] = config.relatedSolutionSlugs
    .map((slug) => getSolutionBySlug(slug))
    .filter((s): s is SolutionDetail => Boolean(s));

  // Resolve Relevant Industries
  const relevantIndustries: IndustryDetail[] = config.relevantIndustrySlugs
    .map((slug) => getIndustryBySlug(slug))
    .filter((ind): ind is IndustryDetail => Boolean(ind));

  // Dynamically resolve and deduplicate Related Case Studies
  const dynamicCaseStudies = getCaseStudiesForService(canonical);
  const configCaseStudies = config.relatedCaseStudySlugs
    .map((slug) => DEFAULT_PORTFOLIO_PROJECTS.find((p) => p.slug === slug || p.id === slug))
    .filter((cs): cs is PublicPortfolioProject => Boolean(cs));

  const allCaseStudiesMap = new Map<string, PublicPortfolioProject>();
  [...configCaseStudies, ...dynamicCaseStudies].forEach((cs) => {
    allCaseStudiesMap.set(cs.slug, cs);
  });
  const relatedCaseStudies = Array.from(allCaseStudiesMap.values());

  return {
    config,
    relatedSolutions,
    relevantIndustries,
    technologies: config.technologies,
    relatedCaseStudies,
    cta: config.cta,
  };
}

/**
 * Resolves full structured relationships for a Solution Detail Page.
 */
export function getSolutionRelationships(rawSlug: string) {
  const canonical = normalizeSolutionSlug(rawSlug);
  const config = SOLUTION_RELATIONSHIPS[canonical] || SOLUTION_RELATIONSHIPS['ai-business-automation'];

  // Resolve Related Services (WHAT ASTRAIV DOES)
  const relatedServices: PublicServiceItem[] = config.relatedServiceSlugs
    .map((slug) => DEFAULT_SERVICES.find((s: PublicServiceItem) => s.slug === slug))
    .filter((s): s is PublicServiceItem => Boolean(s));

  // Resolve Relevant Industries
  const relevantIndustries: IndustryDetail[] = config.relevantIndustrySlugs
    .map((slug) => getIndustryBySlug(slug))
    .filter((ind): ind is IndustryDetail => Boolean(ind));

  // Dynamically resolve and deduplicate Related Case Studies
  const dynamicCaseStudies = getCaseStudiesForSolution(canonical);
  const configCaseStudies = config.relatedCaseStudySlugs
    .map((slug) => DEFAULT_PORTFOLIO_PROJECTS.find((p) => p.slug === slug || p.id === slug))
    .filter((cs): cs is PublicPortfolioProject => Boolean(cs));

  const allCaseStudiesMap = new Map<string, PublicPortfolioProject>();
  [...configCaseStudies, ...dynamicCaseStudies].forEach((cs) => {
    allCaseStudiesMap.set(cs.slug, cs);
  });
  const relatedCaseStudies = Array.from(allCaseStudiesMap.values());

  return {
    config,
    relatedServices,
    relevantIndustries,
    relatedCaseStudies,
    cta: config.cta,
  };
}

/**
 * Resolves full structured relationships for a Case Study Detail Page.
 */
export function getCaseStudyRelationships(project: PublicPortfolioProject) {
  // 1. Resolve Related Services
  const relatedServices: PublicServiceItem[] = (project.relatedServiceSlugs || [])
    .map((slug) => {
      const canonical = normalizeServiceSlug(slug);
      return DEFAULT_SERVICES.find((s) => s.slug === canonical);
    })
    .filter((s): s is PublicServiceItem => Boolean(s));

  // 2. Resolve Related Solutions
  const relatedSolutions: SolutionDetail[] = (project.relatedSolutionSlugs || [])
    .map((slug) => {
      const canonical = normalizeSolutionSlug(slug);
      return getSolutionBySlug(canonical);
    })
    .filter((s): s is SolutionDetail => Boolean(s));

  // 3. Resolve Related Industry
  const relatedIndustry: IndustryDetail | undefined = getIndustryBySlug(
    normalizeIndustrySlug(project.industrySlug)
  );

  // 4. Resolve Related / Companion Case Studies (same industry, services, or solutions, excluding self)
  const companionCandidates = DEFAULT_PORTFOLIO_PROJECTS.filter((p) => p.slug !== project.slug);
  const scoredCompanions = companionCandidates.map((cand) => {
    let score = 0;
    if (cand.industrySlug === project.industrySlug) score += 3;
    const commonServices = (cand.relatedServiceSlugs || []).filter((s) =>
      (project.relatedServiceSlugs || []).includes(s)
    );
    score += commonServices.length * 2;
    const commonSolutions = (cand.relatedSolutionSlugs || []).filter((s) =>
      (project.relatedSolutionSlugs || []).includes(s)
    );
    score += commonSolutions.length * 2;
    return { cand, score };
  });

  scoredCompanions.sort((a, b) => b.score - a.score);
  const relatedCaseStudies = scoredCompanions.slice(0, 2).map((item) => item.cand);

  // 5. Final CTA
  const cta = {
    title: 'Need Something Similar?',
    subtitle: `Consult directly with our principal software architects to engineer a ${project.category} solution tailored to your operational scale.`,
    buttonText: 'Start a Project',
    href: `/contact?service=${encodeURIComponent(project.category)}&caseStudy=${encodeURIComponent(project.slug)}`,
  };

  return {
    relatedServices,
    relatedSolutions,
    relatedIndustry,
    relatedCaseStudies,
    cta,
  };
}

