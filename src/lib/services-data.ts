/**
 * @file client/src/lib/services-data.ts
 * @description Canonical Services Data & Metadata.
 * SERVICES = WHAT ASTRAIV DOES (Engineering disciplines & technical capabilities).
 */

export interface PublicServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  badge?: string | null;
  icon: string;
  orderIndex: number;
  imageSrc?: string;
  deliverables?: string[];
  techStack?: string[];
  slaHighlight?: string;
}

/**
 * The 8 Canonical Engineering Disciplines (SERVICES = WHAT ASTRAIV DOES).
 */
export const DEFAULT_SERVICES: PublicServiceItem[] = [
  {
    id: 'ai-development',
    title: 'AI Development',
    slug: 'ai-development',
    category: 'Intelligent Systems',
    shortDesc: 'Custom LLM fine-tuning, autonomous agent architectures, and predictive machine learning models.',
    fullDesc: `### Cognitive Intelligence & Custom AI Systems

At Astraiv Technologies, our AI Development squad builds state-of-the-art Artificial Intelligence systems that transform raw data into autonomous reasoning engines. We engineer deterministic verification loops around frontier large language models, train domain-adapted neural networks, and deploy sub-second inference pipelines.

#### Core Engineering Disciplines
- **Autonomous Agent Swarms**: Multi-agent task execution systems capable of reasoning, researching, and orchestrating complex operations across external APIs.
- **Enterprise Vector Indexing**: High-precision vector database integrations (pgvector, Pinecone) delivering instant semantic retrieval with strict data isolation.
- **Custom LLM Fine-Tuning & Quantization**: Domain-adapted open models (Llama 3, Mistral, DeepSeek) deployed on private, secure clusters to protect intellectual property.
- **Predictive Telemetry Pipelines**: Real-time statistical modeling, anomaly detection, and forecasting engines embedded directly into production backbones.

#### Our Engineering Approach
We work alongside your technical leaders to evaluate data readiness, design secure API gateways, and deploy resilient AI pipelines backed by enterprise SLAs.`,
    features: ['Custom LLM Fine-Tuning & Quantization', 'Autonomous Multi-Agent Swarms', 'Private Secure Inference Clusters', 'Predictive Telemetry & Real-Time ML'],
    badge: 'Cognitive Engine',
    icon: 'Bot',
    orderIndex: 1,
    imageSrc: '/images/services/service-ai.jpg',
    deliverables: [
      'Multi-agent decision swarms & task routers',
      'Private enterprise vector databases (pgvector)',
      'Deterministic prompt guardrails & citation gates',
    ],
    techStack: ['Python', 'FastAPI', 'PyTorch', 'LangGraph', 'Claude 3.5'],
    slaHighlight: '< 150ms Vector Latency',
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    slug: 'custom-software',
    category: 'Software Engineering',
    shortDesc: 'Bespoke, high-throughput software architectures engineered specifically for your core business operations.',
    fullDesc: `### Tailored Software Engineering for High-Stakes Operations

Off-the-shelf software often forces growing enterprises into rigid, inefficient workflows. Astraiv designs and builds bespoke software systems tailored precisely to your company's operational blueprint, data architecture, and commercial objectives.

#### What We Deliver
- **Bespoke Enterprise Systems**: Custom ERP, CRM, and order fulfillment systems built from the ground up to support proprietary enterprise logic.
- **High-Throughput Backends**: Distributed microservices and monolithic engines built with TypeScript, Go, or Python capable of processing millions of transactions.
- **API & Protocol Integration**: Seamless bridges connecting legacy databases, modern event buses, and external third-party partner rails.
- **Long-Term Maintainability**: Clean architecture, domain-driven design (DDD), comprehensive test suites, and detailed architectural documentation.`,
    features: ['Domain-Driven Architecture (DDD)', 'High-Concurrency Backends (Go & TypeScript)', 'Strict Contract Testing & CI/CD', 'Complete Source IP Ownership'],
    badge: 'Bespoke Engineering',
    icon: 'Cpu',
    orderIndex: 2,
    imageSrc: '/images/services/service-software.jpg',
    deliverables: [
      'Domain-Driven Design (DDD) architectures',
      'High-throughput internal processing queues',
      'Custom admin consoles & telemetry pipelines',
    ],
    techStack: ['TypeScript', 'Go', 'Node.js', 'PostgreSQL', 'Redis'],
    slaHighlight: '100% Client IP Ownership',
  },
  {
    id: 'web-development',
    title: 'Web Application Development',
    slug: 'web-development',
    category: 'Web Platforms',
    shortDesc: 'Modern Next.js & React web platforms engineered for extreme velocity, high concurrency, and zero downtime.',
    fullDesc: `### Enterprise SaaS Platforms & Reactive Web Applications

We engineer high-performance, mission-critical web applications designed for hyper-growth and extreme reliability. Combining modern React 19 / Next.js 16 architectures with strictly-typed backend microservices, our web apps deliver instantaneous response times, fluid micro-interactions, and intuitive user experiences.

#### Key Architecture Highlights
- **Sub-Second Performance**: Server-side rendering (SSR), streaming components, edge middleware, and zero-bundle-overhead client hydration.
- **Multi-Tenant SaaS Architecture**: Strict row-level security (RLS), automated tenant provisioning, role-based access control (RBAC), and SOC-2 compliant data segregation.
- **Real-Time Collaboration**: WebSocket integration, optimistic UI updates, and real-time state synchronization for seamless multiplayer experiences.
- **Hardened API Gateways**: REST, GraphQL, and tRPC endpoints with automated rate limiting, circuit breaking, and telemetry monitoring.`,
    features: ['Next.js 15 & React 19 Architecture', 'Multi-Tenant SaaS Engine with RLS', 'Real-Time WebSockets & Optimistic UI', 'Strict End-to-End Type Safety'],
    badge: 'Fullstack Next.js',
    icon: 'Terminal',
    orderIndex: 3,
    imageSrc: '/images/services/service-web.jpg',
    deliverables: [
      'Multi-tenant architecture & Row-Level Security',
      'Automated recurring Stripe/Paddle billing lifecycles',
      'Real-time WebSocket event feeds & optimistic UI',
    ],
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL'],
    slaHighlight: '99.99% Cluster Availability',
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    slug: 'mobile-development',
    category: 'Mobile Engineering',
    shortDesc: 'Native-feel iOS & Android applications powered by cross-platform speed, offline resilience, and biometric security.',
    fullDesc: `### Native-Grade Mobile Applications for iOS and Android

Deliver fluid, engaging mobile experiences directly to your users' fingertips. We engineer cross-platform and native mobile applications using React Native and Flutter, ensuring native 60fps animations, offline resilience, and seamless device hardware integrations.

#### Mobile Engineering Scope
- **Cross-Platform Velocity**: Single codebase deployment across App Store and Google Play with zero compromise on platform-native UI conventions.
- **Offline-First Synchronization**: Local SQLite / WatermelonDB storage with conflict-free replicated data types (CRDT) for continuous offline functionality.
- **Push Notification Engines**: Targeted, personalized push campaigns via Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNs).
- **Biometric & Secure Hardware**: FaceID, fingerprint authentication, keychain encryption, and secure on-device token storage.`,
    features: ['React Native & Flutter Cross-Platform', 'Offline-First Local Sync & Caching', 'Biometric Security & Hardware APIs', 'Automated App Store CI/CD Pipelines'],
    badge: 'iOS & Android',
    icon: 'Smartphone',
    orderIndex: 4,
    imageSrc: '/images/services/service-mobile.jpg',
    deliverables: [
      'Single codebase iOS & Android applications',
      'Local SQLite caching & optimistic offline sync',
      'Automated App Store & Google Play CI/CD pipelines',
    ],
    techStack: ['React Native', 'Flutter', 'Expo', 'TypeScript', 'SQLite'],
    slaHighlight: '60 FPS Native Velocity',
  },
  {
    id: 'cloud-engineering',
    title: 'Cloud Engineering',
    slug: 'cloud-engineering',
    category: 'Infrastructure',
    shortDesc: 'Zero-downtime AWS & Cloudflare Edge infrastructure with multi-region failover and 99.99% availability.',
    fullDesc: `### Resilient Cloud Infrastructure & Edge Architectures

Modern digital applications require cloud architectures that scale automatically under load, prevent single points of failure, and maintain uncompromising data integrity. We architect and manage high-availability infrastructure across AWS, Google Cloud, and Cloudflare.

#### Infrastructure Capabilities
- **Serverless & Edge Computing**: Global edge networks routing requests to the nearest points of presence, minimizing latency and maximizing throughput.
- **Zero-Egress Asset Delivery**: Cost-effective storage architectures using Cloudflare R2 and S3-compatible CDNs to eliminate punitive bandwidth fees.
- **High-Availability PostgreSQL**: Multi-region read replicas, automated failover loops, connection pooling with PgBouncer, and point-in-time recovery.
- **Disaster Recovery & Redundancy**: Multi-zone deployment topologies with 99.99% uptime SLAs and automated health checks.`,
    features: ['AWS & Cloudflare Global Edge CDN', 'Zero-Egress R2 Object Storage', 'High-Availability Database Clusters', 'Automated Multi-Region Failover'],
    badge: 'Zero-Downtime',
    icon: 'Cloud',
    orderIndex: 5,
    imageSrc: '/images/services/service-cloud.jpg',
    deliverables: [
      'Multi-region Terraform Infrastructure as Code',
      'Cloudflare R2 zero-egress storage & edge caching',
      'High-availability database clusters with read replicas',
    ],
    techStack: ['AWS', 'Cloudflare Edge', 'Docker', 'Terraform', 'PostgreSQL'],
    slaHighlight: '99.99% Availability SLA',
  },
  {
    id: 'devops',
    title: 'DevOps',
    slug: 'devops',
    category: 'Infrastructure',
    shortDesc: 'Automated CI/CD pipelines, container orchestration, and Infrastructure as Code with security guardrails.',
    fullDesc: `### Automated Delivery Pipelines & Infrastructure as Code

Accelerate your engineering release cadence while eliminating human error. We implement automated continuous integration and continuous deployment (CI/CD) pipelines, Docker container orchestration, and Infrastructure as Code (IaC) solutions.

#### DevOps Capabilities
- **Automated CI/CD Pipelines**: GitHub Actions, GitLab CI, and ArgoCD workflows executing unit tests, linting, security scanning, and preview builds automatically.
- **Container Orchestration**: Docker packaging, Kubernetes (EKS/GKE) clusters, and lightweight serverless container runtimes.
- **Infrastructure as Code**: Reproducible environment provisioning via Terraform, OpenTofu, and Pulumi.
- **Observability & APM**: Centralized telemetry dashboards with Datadog, Prometheus, Grafana, and Sentry error alerting.`,
    features: ['GitHub Actions & ArgoCD Workflows', 'Docker & Kubernetes (EKS/GKE) Clusters', 'Terraform Infrastructure as Code', 'Real-Time APM & Sentry Monitoring'],
    badge: 'CI/CD Automation',
    icon: 'GitBranch',
    orderIndex: 6,
    imageSrc: '/images/services/service-api.jpg',
    deliverables: [
      'GitHub Actions automated deployment pipelines',
      'Kubernetes (EKS/GKE) cluster & Helm management',
      'Automated blue/green rollouts & health probes',
    ],
    techStack: ['GitHub Actions', 'Kubernetes', 'Docker', 'Helm', 'ArgoCD'],
    slaHighlight: 'Zero-Downtime Deployments',
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    category: 'Product Design',
    shortDesc: 'Modern, Stripe-grade user interfaces designed with strict layout hierarchies and seamless micro-interactions.',
    fullDesc: `### World-Class Product Design, Design Systems & User Experience

Great software is defined by how effortless it feels to use. Our UI/UX design studio creates comprehensive digital design systems that blend refined aesthetics with rigorous human-computer interaction (HCI) principles.

#### Design System & UX Principles
- **Design Tokens & Component Systems**: Unified design languages in Figma with modular component libraries, color palettes, and typographic scales.
- **Micro-Interactions & Motion Design**: Subtle hover states, smooth page transitions, and tactile feedback using Framer Motion.
- **User Journey Optimization**: Wireframing, interactive prototyping, user testing loops, and friction-reducing onboarding flows.
- **WCAG 2.1 AA Accessibility**: High-contrast modes, keyboard navigation, screen reader compatibility, and inclusive layout hierarchies.`,
    features: ['Figma Design Systems & Modular Tokens', 'Tactile Micro-Interactions & Transitions', 'Conversion-First User Journey UX', 'WCAG 2.1 AA Accessibility Compliance'],
    badge: 'Design Systems',
    icon: 'Layers',
    orderIndex: 7,
    imageSrc: '/images/services/service-uiux.jpg',
    deliverables: [
      'Figma design tokens & modular component libraries',
      'Interactive clickable prototypes & user flows',
      'WCAG 2.1 AA accessibility compliance audits',
    ],
    techStack: ['Figma', 'Design Tokens', 'Tailwind CSS', 'Storybook', 'Framer Motion'],
    slaHighlight: '100% Component Library Spec',
  },
  {
    id: 'technology-consulting',
    title: 'Technology Consulting',
    slug: 'technology-consulting',
    category: 'Advisory',
    shortDesc: 'Senior architectural audits, technology risk assessment, Fractional CTO advisory, and scaling roadmaps.',
    fullDesc: `### Senior Technical Advisory, Architecture Audits & Strategic Guidance

Navigate complex technical inflection points with battle-tested senior engineers. Our Technology Consulting practice provides executive-level architectural oversight, codebase audits, and technology roadmaps to de-risk high-stakes decisions.

#### Advisory Engagements
- **Fractional CTO & Architectural Leadership**: Strategic technology roadmapping, hiring board advisory, and technical vendor vetting.
- **Codebase & Security Audits**: Comprehensive static analysis, technical debt evaluations, OWASP vulnerability assessments, and dependency mapping.
- **Cloud FinOps & Infrastructure Right-Sizing**: Reducing bloated AWS and cloud commitments while improving throughput and system reliability.
- **Technical Due Diligence**: Deep-dive evaluation of software architecture and intellectual property for investors, founders, and acquirers.`,
    features: ['Fractional CTO Leadership', 'Full-Stack Codebase & Security Audits', 'Cloud Infrastructure Cost Optimization (FinOps)', 'Technical Due Diligence for M&A'],
    badge: 'Enterprise Advisory',
    icon: 'Sparkles',
    orderIndex: 8,
    imageSrc: '/images/services/service-transformation.jpg',
    deliverables: [
      'Deep architectural bottleneck diagnosis & code reviews',
      'Security vulnerability evaluations & SOC-2 prep',
      'Fractional CTO guidance & cloud spend optimization',
    ],
    techStack: ['C4 Architecture', 'OpenTelemetry', 'AWS Well-Architected', 'SOC-2 Type II'],
    slaHighlight: 'Actionable Executive Blueprint',
  },
];

/**
 * Complete slug aliases mapping old or synonymous URLs to canonical disciplines.
 */
export const SLUG_ALIASES: Record<string, string> = {
  // AI aliases
  'ai-intelligent-systems': 'ai-development',
  'ai-solutions': 'ai-development',
  'ai-machine-learning': 'ai-development',
  'ai-consulting': 'ai-development',

  // Custom software aliases
  'enterprise-software': 'custom-software',
  'bespoke-software': 'custom-software',
  'custom-software-development': 'custom-software',

  // Web aliases
  'web-applications': 'web-development',
  'website-development': 'web-development',
  'web-app-development': 'web-development',
  'saas-development': 'web-development',

  // Mobile aliases
  'mobile-apps': 'mobile-development',
  'ios-android-development': 'mobile-development',
  'react-native-development': 'mobile-development',

  // Cloud aliases
  'cloud-infrastructure': 'cloud-engineering',
  'cloud-solutions': 'cloud-engineering',
  'cloud-architecture': 'cloud-engineering',
  'cloud-devops': 'cloud-engineering',

  // DevOps aliases
  'devops-cicd': 'devops',
  'ci-cd-automation': 'devops',

  // Design aliases
  'uiux-design': 'ui-ux-design',
  'product-design': 'ui-ux-design',

  // Consulting aliases
  'it-consulting': 'technology-consulting',
  'tech-consulting': 'technology-consulting',
  'fractional-cto': 'technology-consulting',
};

/**
 * Reclassified services that now canonically belong to SOLUTIONS.
 */
export const RECLASSIFIED_SERVICES_TO_SOLUTIONS: Record<string, string> = {
  'digital-transformation': '/solutions/digital-transformation',
  'business-automation': '/solutions/business-process-automation',
  'enterprise-automation': '/solutions/ai-business-automation',
};

export function getServiceBySlugSync(slug: string): PublicServiceItem | undefined {
  const normalized = slug.toLowerCase().trim();
  const canonical = SLUG_ALIASES[normalized] || normalized;
  return DEFAULT_SERVICES.find((s) => s.slug === canonical);
}

export function getAllServicesSync(): PublicServiceItem[] {
  return DEFAULT_SERVICES;
}
