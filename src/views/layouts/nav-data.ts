export interface NavSubItem {
  name: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavSubItem[];
}

export interface MegaMenuConfig {
  type: 'mega-3col' | 'mega-industries' | 'dropdown' | 'simple';
  featured?: {
    tagline: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  groups?: NavGroup[];
  items?: NavSubItem[];
}

export interface NavItem {
  id: string;
  labelKey: string;
  defaultLabel: string;
  href: string;
  hasDropdown: boolean;
  megaMenu?: MegaMenuConfig;
}

export const SERVICES_MEGA: MegaMenuConfig = {
  type: 'mega-3col',
  featured: {
    tagline: 'Build something exceptional.',
    description: 'From AI systems to scalable enterprise applications, we engineer technology around your business.',
    ctaLabel: 'Explore All Services',
    ctaHref: '/services',
  },
  groups: [
    {
      title: 'AI & SOFTWARE',
      items: [
        {
          name: 'AI & Intelligent Systems',
          href: '/services#ai-intelligent-systems',
          description: 'Autonomous agents, cognitive workflows & predictive engines.',
        },
        {
          name: 'SaaS Development',
          href: '/services#saas-development',
          description: 'Scalable multi-tenant platforms built for high user growth.',
        },
        {
          name: 'Custom Software Development',
          href: '/services#custom-software',
          description: 'Tailored enterprise architectures engineered for your workflows.',
        },
        {
          name: 'Enterprise Software',
          href: '/services#enterprise-software',
          description: 'Mission-critical portals, microservices & legacy migrations.',
        },
      ],
    },
    {
      title: 'APPLICATIONS',
      items: [
        {
          name: 'Web Application Development',
          href: '/services#web-development',
          description: 'Modern Next.js & React apps with sub-second performance.',
        },
        {
          name: 'Mobile App Development',
          href: '/services#mobile-apps',
          description: 'Native-feel iOS & Android apps with seamless UX.',
        },
        {
          name: 'UI/UX Design',
          href: '/services#uiux-design',
          description: 'High-conversion design systems & micro-interactions.',
        },
      ],
    },
    {
      title: 'CLOUD & ENGINEERING',
      items: [
        {
          name: 'Cloud & Infrastructure',
          href: '/services#cloud-infrastructure',
          description: 'Reliable AWS & Cloudflare setups with 99.99% availability.',
        },
        {
          name: 'DevOps & CI/CD',
          href: '/services#devops-cicd',
          description: 'Automated test-and-deploy pipelines & container orchestration.',
        },
        {
          name: 'Business Automation',
          href: '/services#business-automation',
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
    ctaHref: '/solutions',
  },
  groups: [
    {
      title: 'INTELLIGENT SYSTEMS',
      items: [
        {
          name: 'AI Agents & Automation',
          href: '/solutions#ai-agents',
          description: 'Autonomous decision pipelines & goal-driven task bots.',
        },
        {
          name: 'RAG & Knowledge Systems',
          href: '/solutions#rag-knowledge',
          description: 'Enterprise search across complex multi-format document lakes.',
        },
        {
          name: 'Data & Analytics',
          href: '/solutions#data-analytics',
          description: 'Real-time metrics, telemetry & executive predictive dashboards.',
        },
      ],
    },
    {
      title: 'DIGITAL PRODUCTS',
      items: [
        {
          name: 'SaaS Platforms',
          href: '/solutions#saas-platforms',
          description: 'Enterprise recurring revenue engines & customer portals.',
        },
        {
          name: 'Enterprise Applications',
          href: '/solutions#enterprise-applications',
          description: 'High-throughput business operations & unified command centers.',
        },
        {
          name: 'Business Process Automation',
          href: '/solutions#business-process-automation',
          description: 'End-to-end integration workflows eliminating manual labor.',
        },
      ],
    },
    {
      title: 'ENGINEERING TRANSFORMATION',
      items: [
        {
          name: 'System Integration',
          href: '/solutions#system-integration',
          description: 'Robust API gateways, event buses & microservice links.',
        },
        {
          name: 'Legacy Modernization',
          href: '/solutions#legacy-modernization',
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
    ctaHref: '/technology',
  },
  groups: [
    {
      title: 'AI & DATA',
      items: [
        { name: 'AI & Machine Learning', href: '/technology#ai-expertise', description: 'PyTorch, custom fine-tuning & inference.' },
        { name: 'LLMs & Generative AI', href: '/technology#ai-expertise', description: 'OpenAI, Anthropic & private local models.' },
        { name: 'RAG & Vector Systems', href: '/technology#ai-expertise', description: 'Pinecone, pgvector & contextual search.' },
        { name: 'Data Engineering', href: '/technology#technologies', description: 'Data pipelines, warehousing & ETL flows.' },
      ],
    },
    {
      title: 'APPLICATION ENGINEERING',
      items: [
        { name: 'Next.js / React', href: '/technology#technologies', description: 'App router, streaming SSR & reactivity.' },
        { name: 'TypeScript', href: '/technology#technologies', description: 'Strict end-to-end type safety & contracts.' },
        { name: 'Node.js & Python', href: '/technology#technologies', description: 'FastAPI, async workers & API gateways.' },
        { name: 'APIs & Integrations', href: '/technology#technologies', description: 'REST, GraphQL, WebSockets & webhooks.' },
      ],
    },
    {
      title: 'DATA & INFRASTRUCTURE',
      items: [
        { name: 'PostgreSQL & MongoDB', href: '/technology#technologies', description: 'ACID transactional data & dynamic schemas.' },
        { name: 'AWS & Cloud Infrastructure', href: '/technology#technologies', description: 'Cloudflare edge, Lambda & S3 architecture.' },
        { name: 'Docker / DevOps', href: '/technology#technologies', description: 'Automated CI/CD, staging & container runs.' },
      ],
    },
  ],
};

export const INDUSTRIES_MEGA: MegaMenuConfig = {
  type: 'mega-industries',
  items: [
    {
      name: 'FinTech',
      href: '/#industries',
      description: 'Secure financial platforms and intelligent transaction systems.',
    },
    {
      name: 'HealthTech',
      href: '/#industries',
      description: 'HIPAA-compliant healthcare software and clinical data workflows.',
    },
    {
      name: 'SaaS & Technology',
      href: '/#industries',
      description: 'High-velocity multi-tenant architectures and product engineering.',
    },
    {
      name: 'E-commerce',
      href: '/#industries',
      description: 'Headless digital commerce engines with sub-second checkout speeds.',
    },
    {
      name: 'Logistics',
      href: '/#industries',
      description: 'Intelligent fleet tracking, telemetry & automated supply chains.',
    },
    {
      name: 'EdTech',
      href: '/#industries',
      description: 'Interactive learning management systems and virtual student portals.',
    },
    {
      name: 'Professional Services',
      href: '/#industries',
      description: 'Automated practice management, client onboarding & billing.',
    },
    {
      name: 'Other Industries',
      href: '/#industries',
      description: 'Custom architectural solutions tailored for specialized verticals.',
    },
  ],
};

export const INSIGHTS_DROPDOWN: MegaMenuConfig = {
  type: 'dropdown',
  items: [
    {
      name: 'Blog',
      href: '/blog',
      description: 'Technical deep dives, architectural tutorials & insights.',
    },
    {
      name: 'Case Studies',
      href: '/portfolio#case-studies',
      description: 'Real client projects and measurable business outcomes.',
    },
    {
      name: 'AI Insights',
      href: '/technology#ai-expertise',
      description: 'Breakthroughs in autonomous agents & cognitive workflows.',
    },
    {
      name: 'Technology Insights',
      href: '/technology#technologies',
      description: 'Engineering practices for modern cloud applications.',
    },
    {
      name: 'FAQs',
      href: '/faq',
      description: 'Answers about our delivery velocity, SLAs & security.',
    },
    {
      name: 'Resources',
      href: '/contact',
      description: 'Client documentation, consultation guides & technical blueprints.',
    },
  ],
};

export const COMPANY_DROPDOWN: MegaMenuConfig = {
  type: 'dropdown',
  items: [
    {
      name: 'About Astraiv',
      href: '/company#about',
      description: 'Our engineering philosophy and global mission.',
    },
    {
      name: 'Why Astraiv',
      href: '/company#why-us',
      description: 'Architectural rigor, speed, and proven delivery track record.',
    },
    {
      name: 'Our Process',
      href: '/company#process',
      description: 'Agile execution, rigorous code QA & transparent sprint cadence.',
    },
    {
      name: 'Client Reviews',
      href: '/company#reviews',
      description: 'Feedback from founders and senior engineering leaders.',
    },
    {
      name: 'Careers',
      href: '/company#careers',
      description: 'Join our team of elite full-stack engineers and architects.',
    },
    {
      name: 'Pricing & Models',
      href: '/company#pricing',
      description: 'Dedicated squads, staff augmentation & fixed sprint models.',
    },
    {
      name: 'Contact',
      href: '/company#contact',
      description: 'Schedule a direct architectural consultation with our team.',
    },
  ],
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'services',
    labelKey: 'services',
    defaultLabel: 'Services',
    href: '/services',
    hasDropdown: true,
    megaMenu: SERVICES_MEGA,
  },
  {
    id: 'solutions',
    labelKey: 'solutions',
    defaultLabel: 'Solutions',
    href: '/solutions',
    hasDropdown: true,
    megaMenu: SOLUTIONS_MEGA,
  },
  {
    id: 'technologies',
    labelKey: 'technologies',
    defaultLabel: 'Technologies',
    href: '/technology',
    hasDropdown: true,
    megaMenu: TECHNOLOGIES_MEGA,
  },
  {
    id: 'industries',
    labelKey: 'industries',
    defaultLabel: 'Industries',
    href: '/#industries',
    hasDropdown: true,
    megaMenu: INDUSTRIES_MEGA,
  },
  {
    id: 'portfolio',
    labelKey: 'portfolio',
    defaultLabel: 'Portfolio',
    href: '/portfolio',
    hasDropdown: false,
  },
  {
    id: 'insights',
    labelKey: 'insights',
    defaultLabel: 'Insights',
    href: '/blog',
    hasDropdown: true,
    megaMenu: INSIGHTS_DROPDOWN,
  },
  {
    id: 'company',
    labelKey: 'company',
    defaultLabel: 'Company',
    href: '/company',
    hasDropdown: true,
    megaMenu: COMPANY_DROPDOWN,
  },
];
