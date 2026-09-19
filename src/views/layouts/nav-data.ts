import { ROUTES } from '@/routes';
import type { NavSubItem, NavGroup, MegaMenuConfig, NavItem } from '@/routes';

export type { NavSubItem, NavGroup, MegaMenuConfig, NavItem };

export const SERVICES_MEGA: MegaMenuConfig = {
  type: 'mega-3col',
  featured: {
    tagline: 'Build something exceptional.',
    description: 'From AI systems to scalable enterprise applications, we engineer technology around your business.',
    ctaLabel: 'Explore All Services',
    ctaHref: ROUTES.PUBLIC.SERVICES,
  },
  groups: [
    {
      title: 'AI & SOFTWARE',
      items: [
        {
          name: 'AI & Intelligent Systems',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.AI_INTELLIGENT_SYSTEMS,
          description: 'Autonomous agents, cognitive workflows & predictive engines.',
        },
        {
          name: 'SaaS Development',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.SAAS_DEVELOPMENT,
          description: 'Scalable multi-tenant platforms built for high user growth.',
        },
        {
          name: 'Custom Software Development',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.CUSTOM_SOFTWARE,
          description: 'Tailored enterprise architectures engineered for your workflows.',
        },
        {
          name: 'Enterprise Software',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.ENTERPRISE_SOFTWARE,
          description: 'Mission-critical portals, microservices & legacy migrations.',
        },
      ],
    },
    {
      title: 'APPLICATIONS',
      items: [
        {
          name: 'Web Application Development',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.WEB_DEVELOPMENT,
          description: 'Modern Next.js & React apps with sub-second performance.',
        },
        {
          name: 'Mobile App Development',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.MOBILE_APPS,
          description: 'Native-feel iOS & Android apps with seamless UX.',
        },
        {
          name: 'UI/UX Design',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.UIUX_DESIGN,
          description: 'High-conversion design systems & micro-interactions.',
        },
      ],
    },
    {
      title: 'CLOUD & ENGINEERING',
      items: [
        {
          name: 'Cloud & Infrastructure',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.CLOUD_INFRASTRUCTURE,
          description: 'Reliable AWS & Cloudflare setups with 99.99% availability.',
        },
        {
          name: 'DevOps & CI/CD',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.DEVOPS_CICD,
          description: 'Automated test-and-deploy pipelines & container orchestration.',
        },
        {
          name: 'Business Automation',
          href: ROUTES.PUBLIC.SERVICES_ANCHORS.BUSINESS_AUTOMATION,
          description: 'Automated CRM, billing pipelines & operational bots.',
        },
      ],
    },
  ],
};

export const SOLUTIONS_MEGA: MegaMenuConfig = {
  type: 'mega-3col',
  featured: {
    tagline: 'Engineered for Impact.',
    description: 'Purpose-built technical architectures solving high-stakes enterprise bottlenecks.',
    ctaLabel: 'View All Solutions',
    ctaHref: ROUTES.PUBLIC.SOLUTIONS,
  },
  groups: [
    {
      title: 'INTELLIGENT SYSTEMS',
      items: [
        {
          name: 'AI Agents & Automation',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.AI_AGENTS,
          description: 'Autonomous decision pipelines & goal-driven task bots.',
        },
        {
          name: 'RAG & Knowledge Systems',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.RAG_KNOWLEDGE,
          description: 'Enterprise search across complex multi-format document lakes.',
        },
        {
          name: 'Data & Analytics',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.DATA_ANALYTICS,
          description: 'Real-time metrics, telemetry & executive predictive dashboards.',
        },
      ],
    },
    {
      title: 'DIGITAL PRODUCTS',
      items: [
        {
          name: 'SaaS Platforms',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.SAAS_PLATFORMS,
          description: 'Enterprise recurring revenue engines & customer portals.',
        },
        {
          name: 'Enterprise Applications',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.ENTERPRISE_APPLICATIONS,
          description: 'High-throughput business operations & unified command centers.',
        },
        {
          name: 'Business Process Automation',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.WORKFLOW_AUTOMATION,
          description: 'End-to-end integration workflows eliminating manual labor.',
        },
      ],
    },
    {
      title: 'ENGINEERING TRANSFORMATION',
      items: [
        {
          name: 'System Integration',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.CUSTOMER_EXPERIENCE,
          description: 'Robust API gateways, event buses & microservice links.',
        },
        {
          name: 'Legacy Modernization',
          href: ROUTES.PUBLIC.SOLUTIONS_ANCHORS.CLOUD_MIGRATION,
          description: 'Zero-downtime refactoring into modern serverless stacks.',
        },
      ],
    },
  ],
};

export const TECHNOLOGIES_MEGA: MegaMenuConfig = {
  type: 'mega-3col',
  featured: {
    tagline: 'Modern Technical Stack.',
    description: 'Battle-tested frameworks and cloud primitives engineered for enterprise scale.',
    ctaLabel: 'Explore Technology Stack',
    ctaHref: ROUTES.PUBLIC.TECHNOLOGY,
  },
  groups: [
    {
      title: 'AI & DATA',
      items: [
        { name: 'AI & Machine Learning', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.AI_EXPERTISE, description: 'PyTorch, custom fine-tuning & inference.' },
        { name: 'LLMs & Generative AI', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.AI_EXPERTISE, description: 'OpenAI, Anthropic & private local models.' },
        { name: 'RAG & Vector Systems', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.AI_EXPERTISE, description: 'Pinecone, pgvector & contextual search.' },
        { name: 'Data Engineering', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'Data pipelines, warehousing & ETL flows.' },
      ],
    },
    {
      title: 'APPLICATION ENGINEERING',
      items: [
        { name: 'Next.js / React', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'App router, streaming SSR & reactivity.' },
        { name: 'TypeScript', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'Strict end-to-end type safety & contracts.' },
        { name: 'Node.js & Python', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'FastAPI, async workers & API gateways.' },
        { name: 'APIs & Integrations', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'REST, GraphQL, WebSockets & webhooks.' },
      ],
    },
    {
      title: 'DATA & INFRASTRUCTURE',
      items: [
        { name: 'PostgreSQL & MongoDB', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'ACID transactional data & dynamic schemas.' },
        { name: 'AWS & Cloud Infrastructure', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'Cloudflare edge, Lambda & S3 architecture.' },
        { name: 'Docker / DevOps', href: ROUTES.PUBLIC.TECHNOLOGY_ANCHORS.ALL_TECHNOLOGIES, description: 'Automated CI/CD, staging & container runs.' },
      ],
    },
  ],
};

export const INDUSTRIES_MEGA: MegaMenuConfig = {
  type: 'mega-industries',
  items: [
    {
      name: 'FinTech',
      href: ROUTES.PUBLIC.INDUSTRIES_ANCHORS.FINTECH,
      description: 'Secure financial platforms and intelligent transaction systems.',
    },
    {
      name: 'HealthTech',
      href: ROUTES.PUBLIC.INDUSTRIES_ANCHORS.HEALTHCARE,
      description: 'HIPAA-compliant healthcare software and clinical data workflows.',
    },
    {
      name: 'SaaS & Technology',
      href: '/industries#saas',
      description: 'High-velocity multi-tenant architectures and product engineering.',
    },
    {
      name: 'E-commerce',
      href: ROUTES.PUBLIC.INDUSTRIES_ANCHORS.ECOMMERCE,
      description: 'Headless digital commerce engines with sub-second checkout speeds.',
    },
    {
      name: 'Logistics',
      href: ROUTES.PUBLIC.INDUSTRIES_ANCHORS.LOGISTICS,
      description: 'Intelligent fleet tracking, telemetry & automated supply chains.',
    },
    {
      name: 'EdTech',
      href: ROUTES.PUBLIC.INDUSTRIES_ANCHORS.EDUCATION,
      description: 'Interactive learning management systems and virtual student portals.',
    },
    {
      name: 'Professional Services',
      href: '/industries#professional-services',
      description: 'Automated practice management, client onboarding & billing.',
    },
    {
      name: 'Other Industries',
      href: '/industries#other-industries',
      description: 'Custom architectural solutions tailored for specialized verticals.',
    },
  ],
};

export const INSIGHTS_DROPDOWN: MegaMenuConfig = {
  type: 'dropdown',
  items: [
    {
      name: 'Blog',
      href: '/blog#blog',
      description: 'Technical deep dives, architectural tutorials & insights.',
    },
    {
      name: 'Case Studies',
      href: '/blog#case-studies',
      description: 'Real client projects and measurable business outcomes.',
    },
    {
      name: 'AI Insights',
      href: '/blog#ai-insights',
      description: 'Breakthroughs in autonomous agents & cognitive workflows.',
    },
    {
      name: 'Technology Insights',
      href: '/blog#tech-insights',
      description: 'Engineering practices for modern cloud applications.',
    },
    {
      name: 'FAQs',
      href: ROUTES.PUBLIC.BLOG_FAQ_ANCHOR,
      description: 'Answers about our delivery velocity, SLAs & security.',
    },
    {
      name: 'Resources',
      href: '/blog#resources',
      description: 'Client documentation, consultation guides & technical blueprints.',
    },
  ],
};

export const COMPANY_DROPDOWN: MegaMenuConfig = {
  type: 'dropdown',
  items: [
    {
      name: 'About Astraiv',
      href: ROUTES.PUBLIC.COMPANY_ANCHORS.ABOUT,
      description: 'Our engineering philosophy and global mission.',
    },
    {
      name: 'Why Astraiv',
      href: ROUTES.PUBLIC.COMPANY_ANCHORS.WHY_US,
      description: 'Architectural rigor, speed, and proven delivery track record.',
    },
    {
      name: 'Our Process',
      href: ROUTES.PUBLIC.COMPANY_ANCHORS.PROCESS,
      description: 'Agile execution, rigorous code QA & transparent sprint cadence.',
    },
    {
      name: 'Client Reviews',
      href: '/company#reviews',
      description: 'Feedback from founders and senior engineering leaders.',
    },
    {
      name: 'Careers',
      href: ROUTES.PUBLIC.COMPANY_ANCHORS.CAREERS,
      description: 'Join our team of elite full-stack engineers and architects.',
    },
    {
      name: 'Pricing & Models',
      href: ROUTES.PUBLIC.COMPANY_ANCHORS.PRICING,
      description: 'Dedicated squads, staff augmentation & fixed sprint models.',
    },
    {
      name: 'Contact',
      href: ROUTES.PUBLIC.CONTACT,
      description: 'Schedule a direct architectural consultation with our team.',
    },
  ],
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'company',
    labelKey: 'aboutUs',
    defaultLabel: 'About Us',
    href: ROUTES.PUBLIC.COMPANY,
    hasDropdown: true,
    megaMenu: COMPANY_DROPDOWN,
  },
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
    id: 'technologies',
    labelKey: 'technologies',
    defaultLabel: 'Technologies',
    href: ROUTES.PUBLIC.TECHNOLOGY,
    hasDropdown: true,
    megaMenu: TECHNOLOGIES_MEGA,
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
    id: 'portfolio',
    labelKey: 'portfolio',
    defaultLabel: 'Portfolio',
    href: ROUTES.PUBLIC.PORTFOLIO,
    hasDropdown: false,
  },
  {
    id: 'insights',
    labelKey: 'insights',
    defaultLabel: 'Insights',
    href: ROUTES.PUBLIC.BLOG,
    hasDropdown: true,
    megaMenu: INSIGHTS_DROPDOWN,
  },
];
