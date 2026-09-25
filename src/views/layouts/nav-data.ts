import { ROUTES } from '@/routes';
import type { NavSubItem, NavGroup, MegaMenuConfig, NavItem } from '@/routes';

export type { NavSubItem, NavGroup, MegaMenuConfig, NavItem };

/**
 * SERVICES MEGA MENU
 * Rule: SERVICES = WHAT ASTRAIV DOES (Engineering Disciplines)
 */
export const SERVICES_MEGA: MegaMenuConfig = {
  type: 'mega-3col',
  featured: {
    tagline: 'Engineering That Scales.',
    description: 'From intelligent cognitive systems to high-concurrency cloud backbones, we build mission-critical digital foundations.',
    ctaLabel: 'Explore All Services',
    ctaHref: ROUTES.PUBLIC.SERVICES,
  },
  groups: [
    {
      title: 'CORE SOFTWARE & AI',
      items: [
        {
          name: 'AI Development',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('ai-development'),
          description: 'Autonomous decision pipelines, custom LLM fine-tuning & predictive engines.',
        },
        {
          name: 'Custom Software Development',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('custom-software'),
          description: 'Bespoke architectures crafted strictly around proprietary enterprise workflows.',
        },
        {
          name: 'Web Application Development',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('web-development'),
          description: 'Modern Next.js & React platforms with sub-second page performance.',
        },
        {
          name: 'Mobile Development',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('mobile-development'),
          description: 'Native-feel iOS & Android experiences powered by cross-platform speed.',
        },
      ],
    },
    {
      title: 'CLOUD & INFRASTRUCTURE',
      items: [
        {
          name: 'Cloud Engineering',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('cloud-engineering'),
          description: 'Zero-downtime AWS & Cloudflare primitives with 99.99% availability.',
        },
        {
          name: 'DevOps',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('devops'),
          description: 'Automated test-and-deploy pipelines with immutable security guardrails.',
        },
      ],
    },
    {
      title: 'DESIGN & ADVISORY',
      items: [
        {
          name: 'UI/UX Design',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('ui-ux-design'),
          description: 'Conversion-driven design systems, micro-interactions & user trust.',
        },
        {
          name: 'Technology Consulting',
          href: ROUTES.PUBLIC.SERVICE_DETAIL('technology-consulting'),
          description: 'Technical audits, architectural blueprints & Fractional CTO advisory.',
        },
      ],
    },
  ],
};

/**
 * SOLUTIONS MEGA MENU
 * Rule: SOLUTIONS = WHAT BUSINESS PROBLEMS ASTRAIV SOLVES
 */
export const SOLUTIONS_MEGA: MegaMenuConfig = {
  type: 'mega-3col',
  featured: {
    tagline: 'Engineered for Impact.',
    description: 'Purpose-built technical architectures solving high-stakes enterprise bottlenecks.',
    ctaLabel: 'Explore Solutions',
    ctaHref: ROUTES.PUBLIC.SOLUTIONS,
  },
  groups: [
    {
      title: 'INTELLIGENT AUTOMATION',
      items: [
        {
          name: 'AI & Business Automation',
          href: ROUTES.PUBLIC.SOLUTION_DETAIL('ai-business-automation'),
          description: 'Autonomous decision pipelines & goal-driven multi-agent swarms.',
        },
        {
          name: 'RAG / Enterprise Knowledge Systems',
          href: ROUTES.PUBLIC.SOLUTION_DETAIL('rag-knowledge'),
          description: 'Enterprise search across complex multi-format document lakes.',
        },
        {
          name: 'Business Process Automation',
          href: ROUTES.PUBLIC.SOLUTION_DETAIL('business-process-automation'),
          description: 'End-to-end integration workflows eliminating manual back-office tasks.',
        },
      ],
    },
    {
      title: 'ENTERPRISE PLATFORMS',
      items: [
        {
          name: 'SaaS Platforms',
          href: ROUTES.PUBLIC.SOLUTION_DETAIL('saas-platforms'),
          description: 'Multi-tenant subscription engines, RBAC controls & tenant isolation.',
        },
        {
          name: 'Data & Analytics Platforms',
          href: ROUTES.PUBLIC.SOLUTION_DETAIL('data-analytics'),
          description: 'Real-time telemetry, ClickHouse analytics & executive predictive dashboards.',
        },
      ],
    },
    {
      title: 'TRANSFORMATION & MODERNIZATION',
      items: [
        {
          name: 'Legacy Modernization',
          href: ROUTES.PUBLIC.SOLUTION_DETAIL('legacy-modernization'),
          description: 'Zero-downtime refactoring into modern serverless cloud stacks.',
        },
        {
          name: 'Digital Transformation',
          href: ROUTES.PUBLIC.SOLUTION_DETAIL('digital-transformation'),
          description: 'Transitioning analog workflows to unified, scalable cloud platforms.',
        },
      ],
    },
  ],
};

/**
 * INDUSTRIES MEGA MENU
 * Industry listing + Individual Industry Details
 */
export const INDUSTRIES_MEGA: MegaMenuConfig = {
  type: 'mega-industries',
  featured: {
    tagline: 'Specialized Vertical Engineering.',
    description: 'Domain-specific software engineering adhering to rigorous compliance and performance benchmarks.',
    ctaLabel: 'Explore All Industries',
    ctaHref: ROUTES.PUBLIC.INDUSTRIES,
  },
  items: [
    {
      name: 'FinTech & Banking',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('fintech'),
      description: 'Immutable ledger engines, real-time fraud mitigation & PCI-DSS compliance.',
    },
    {
      name: 'HealthTech & MedTech',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('healthtech'),
      description: 'HIPAA-compliant healthcare architectures, clinical data flows & EHR sync.',
    },
    {
      name: 'SaaS & Technology',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('saas'),
      description: 'High-velocity multi-tenant platforms, automated billing & API ecosystems.',
    },
    {
      name: 'E-commerce & Retail',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('ecommerce'),
      description: 'Headless commerce engines with sub-second checkout speeds and inventory sync.',
    },
    {
      name: 'Logistics & Fleet',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('logistics'),
      description: 'Intelligent fleet tracking, IoT telemetry & automated supply chain routing.',
    },
    {
      name: 'EdTech & Learning',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('edtech'),
      description: 'Interactive virtual classrooms, student analytics & adaptive assessment portals.',
    },
    {
      name: 'Professional Services',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('professional-services'),
      description: 'Automated practice management, client onboarding & transparent billing.',
    },
    {
      name: 'Industrial & IoT Systems',
      href: ROUTES.PUBLIC.INDUSTRY_DETAIL('other-industries'),
      description: 'Telemetry ingestion, edge device synchronization & predictive asset monitoring.',
    },
  ],
};

/**
 * WORK MEGA MENU
 * Focuses exclusively on Case Studies and Testimonials (no separate primary items)
 */
export const WORK_MEGA: MegaMenuConfig = {
  type: 'mega-work',
  featured: {
    tagline: 'Proven Track Record.',
    description: 'Explore verified enterprise deployments and executive testimonials demonstrating measurable business ROI.',
    ctaLabel: 'Explore Case Studies',
    ctaHref: ROUTES.PUBLIC.WORK,
  },
  groups: [
    {
      title: 'CASE STUDIES & IMPACT',
      items: [
        {
          name: 'FinanceFlow Ledger Engine',
          href: ROUTES.PUBLIC.CASE_STUDY_DETAIL('financeflow'),
          description: 'High-frequency transaction ledger handling millions in volume with zero drift.',
          badge: '100% PCI-DSS',
        },
        {
          name: 'PulseFit Analytics Platform',
          href: ROUTES.PUBLIC.CASE_STUDY_DETAIL('pulsefit'),
          description: 'Multi-tenant streaming analytics serving 120+ gym facilities at edge speed.',
          badge: '65% Faster',
        },
        {
          name: 'AeroSync Logistics Mesh',
          href: ROUTES.PUBLIC.CASE_STUDY_DETAIL('aerosync'),
          description: 'Real-time dispatch coordination handling 50k+ daily deliveries.',
          badge: '-22% Fuel',
        },
        {
          name: 'Explore All Case Studies →',
          href: ROUTES.PUBLIC.CASE_STUDIES,
          description: 'Inspect our full directory of client, internal, and reference architectures.',
        },
      ],
    },
    {
      title: 'TESTIMONIALS & TRUST',
      items: [
        {
          name: 'Client Endorsements & Reviews',
          href: ROUTES.PUBLIC.WORK_TESTIMONIALS,
          description: 'Direct feedback from founders, CTOs, and enterprise engineering directors.',
          badge: '5.0 / 5 Rating',
        },
        {
          name: 'Certifications & Accolades',
          href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
          description: 'Audited ISO 27001, SOC-2 readiness, and cloud ecosystem alliances.',
          badge: 'ISO Certified',
        },
        {
          name: 'Sprint SLA & Production Benchmarks',
          href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
          description: '99.8% on-time sprint velocity backed by contractual guarantees.',
          badge: '99.8% SLA',
        },
        {
          name: 'Client Portal & Sprints →',
          href: ROUTES.PUBLIC.CLIENT_PORTAL,
          description: 'Secure dashboard for active clients to track sprint burndown & staging releases.',
        },
      ],
    },
  ],
};

/**
 * INSIGHTS MEGA MENU
 * Blog, AI Insights, Engineering, Technology, and Resources
 */
export const INSIGHTS_MEGA: MegaMenuConfig = {
  type: 'mega-insights',
  featured: {
    tagline: 'Technical Rigor & Perspectives.',
    description: 'In-depth architectural analysis, engineering tutorials, and open blueprints from our senior architects.',
    ctaLabel: 'Explore Insights',
    ctaHref: ROUTES.PUBLIC.INSIGHTS,
  },
  groups: [
    {
      title: 'ARTICLES & RESEARCH',
      items: [
        {
          name: 'Engineering Blog',
          href: ROUTES.PUBLIC.INSIGHTS_BLOG,
          description: 'Deep dives into distributed systems, TypeScript patterns & cloud primitives.',
        },
        {
          name: 'AI Insights & Research',
          href: ROUTES.PUBLIC.INSIGHTS_ANCHORS.AI_INSIGHTS,
          description: 'Breakthroughs in autonomous agent orchestration & contextual vector RAG.',
        },
      ],
    },
    {
      title: 'ENGINEERING & STACK',
      items: [
        {
          name: 'Engineering Architecture',
          href: ROUTES.PUBLIC.INSIGHTS_ANCHORS.ENGINEERING,
          description: 'Best practices for high-concurrency microservices, CI/CD & zero tech debt.',
        },
        {
          name: 'Full Technology Spectrum',
          href: ROUTES.PUBLIC.INSIGHTS_ANCHORS.TECHNOLOGY,
          description: 'Inspect our complete stack: Next.js, Rust, Python, Postgres & AWS.',
        },
      ],
    },
    {
      title: 'RESOURCES & GUIDES',
      items: [
        {
          name: 'Technical Blueprints & Downloads',
          href: ROUTES.PUBLIC.INSIGHTS_ANCHORS.RESOURCES,
          description: 'Downloadable architecture diagrams, security checklists & enterprise RFPs.',
        },
        {
          name: 'Delivery FAQs',
          href: ROUTES.PUBLIC.FAQ,
          description: 'Answers about our sprint cadence, IP ownership, SLAs & security gates.',
        },
      ],
    },
  ],
};

/**
 * COMPANY MEGA MENU
 * About Us, Why Astraiv, Our Process, Rewards & Accolades, Careers, and Contact
 */
export const COMPANY_MEGA: MegaMenuConfig = {
  type: 'mega-company',
  featured: {
    tagline: 'Built for High-Velocity Teams.',
    description: 'We partner with ambitious startups and global enterprises to engineer software that withstands rapid scale.',
    ctaLabel: 'Explore Company',
    ctaHref: ROUTES.PUBLIC.COMPANY,
  },
  groups: [
    {
      title: 'WHO WE ARE',
      items: [
        {
          name: 'About Us',
          href: ROUTES.PUBLIC.COMPANY_ANCHORS.ABOUT,
          description: 'Our founding engineering philosophy and global mission to build resilient tech.',
        },
        {
          name: 'Why Astraiv',
          href: ROUTES.PUBLIC.COMPANY_ANCHORS.WHY_US,
          description: 'Elite senior squads, rapid sprint velocity, and zero architectural compromises.',
        },
        {
          name: 'Our Process',
          href: ROUTES.PUBLIC.COMPANY_ANCHORS.PROCESS,
          description: 'Agile sprints, rigorous automated QA & transparent continuous communication.',
        },
      ],
    },
    {
      title: 'CREDIBILITY & CAREERS',
      items: [
        {
          name: 'Rewards & Accolades',
          href: ROUTES.PUBLIC.COMPANY_ANCHORS.REWARDS_ACCOLADES,
          description: 'ISO 9001 / ISO 27001 certifications, SOC-2 compliance & AWS Partner honors.',
          badge: 'ISO & SOC-2',
        },
        {
          name: 'Careers & Team',
          href: ROUTES.PUBLIC.CAREERS,
          description: 'Join our team of elite full-stack engineers, cloud architects, and designers.',
          badge: 'We are hiring',
        },
        {
          name: 'Contact & Scoping',
          href: ROUTES.PUBLIC.CONTACT,
          description: 'Schedule a direct architectural consultation with our senior engineering squad.',
        },
      ],
    },
  ],
};

/**
 * Clean, business-focused top navigation hierarchy:
 * 1. SERVICES (What Astraiv Does)
 * 2. SOLUTIONS (What Business Problems Astraiv Solves)
 * 3. INDUSTRIES
 * 4. WORK (Case Studies + Testimonials)
 * 5. INSIGHTS (Blog + AI + Engineering + Tech + Resources)
 * 6. COMPANY (About + Why Astraiv + Process + Rewards & Accolades + Careers + Contact)
 */
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'services',
    labelKey: 'services',
    defaultLabel: 'Services',
    href: ROUTES.PUBLIC.SERVICES,
    hasDropdown: true,
    megaMenu: SERVICES_MEGA,
  },
  {
    id: 'solutions',
    labelKey: 'solutions',
    defaultLabel: 'Solutions',
    href: ROUTES.PUBLIC.SOLUTIONS,
    hasDropdown: true,
    megaMenu: SOLUTIONS_MEGA,
  },
  {
    id: 'industries',
    labelKey: 'industries',
    defaultLabel: 'Industries',
    href: ROUTES.PUBLIC.INDUSTRIES,
    hasDropdown: true,
    megaMenu: INDUSTRIES_MEGA,
  },
  {
    id: 'work',
    labelKey: 'work',
    defaultLabel: 'Work',
    href: ROUTES.PUBLIC.WORK,
    hasDropdown: true,
    megaMenu: WORK_MEGA,
  },
  {
    id: 'insights',
    labelKey: 'insights',
    defaultLabel: 'Insights',
    href: ROUTES.PUBLIC.INSIGHTS,
    hasDropdown: true,
    megaMenu: INSIGHTS_MEGA,
  },
  {
    id: 'company',
    labelKey: 'company',
    defaultLabel: 'Company',
    href: ROUTES.PUBLIC.COMPANY,
    hasDropdown: true,
    megaMenu: COMPANY_MEGA,
  },
];
