export interface IndustryDetail {
  slug: string;
  code: string;
  label: string;
  tagline: string;
  headline: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  statusText: string;
  complianceBadge: string;
  challenge: string;
  solution: string;
  pillars: {
    title: string;
    description: string;
  }[];
  techStack: string[];
  kpis: {
    label: string;
    value: string;
  }[];
}

export const INDUSTRIES_LIST: IndustryDetail[] = [
  {
    slug: 'fintech',
    code: 'SEC-FIN-01',
    label: 'FinTech',
    tagline: 'High-Frequency Financial Platforms & Ledger Architecture',
    headline: 'Deterministic, Zero-Drift Financial Systems & Transaction Mesh',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Algorithmic financial trading monitors and quantitative data terminal',
    accentColor: 'text-emerald-500 dark:text-emerald-400',
    statusText: 'Ledger Engine: Active | 99.999% SLA',
    complianceBadge: 'PCI-DSS Level 1 • SOC-2 Type II',
    challenge:
      'Legacy banking mainframes and loose API gateways suffer from concurrency lock contention, transaction drift, high reconciliation costs, and severe regulatory audit penalties.',
    solution:
      'We engineer immutable double-entry ledger engines, real-time micro-transaction pipelines, automated multi-tenant subscription routing, and zero-loss payment webhooks.',
    pillars: [
      {
        title: 'Immutable Double-Entry Ledger',
        description: 'ACID-compliant cryptographic journals guaranteeing zero balance drift across distributed payment gateways.',
      },
      {
        title: 'Intelligent Anti-Fraud Streaming',
        description: 'Real-time vector pattern evaluation catching anomaly signatures in sub-10ms transaction windows.',
      },
      {
        title: 'Idempotent Multi-Provider Fallbacks',
        description: 'Automated failover routing between Stripe, Adyen, and regional rails with zero duplicate charge states.',
      },
    ],
    techStack: ['Rust', 'PostgreSQL', 'Kafka', 'Stripe API', 'Redis', 'Temporal'],
    kpis: [
      { label: 'Annual Throughput Handled', value: '$2.4B+' },
      { label: 'Settlement Latency', value: '< 180ms' },
      { label: 'Ledger Audit Parity', value: '100%' },
    ],
  },
  {
    slug: 'healthtech',
    code: 'HLT-MED-02',
    label: 'HealthTech',
    tagline: 'HIPAA & HITECH Compliant Clinical & BioTech Pipelines',
    headline: 'Sovereign Patient Portals, HL7/FHIR Ingestion & Clinical Systems',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Medical doctor operating advanced laboratory robotic software interface',
    accentColor: 'text-rose-500 dark:text-rose-400',
    statusText: 'FHIR v4 Active | AES-256 Vault Locked',
    complianceBadge: 'HIPAA Enforced • HITECH • GDPR Health',
    challenge:
      'Fragmented Electronic Health Record (EHR) schemas, rigid legacy HL7 protocol integrations, and stringent patient privacy sanctions hinder modern digital patient care.',
    solution:
      'We architect end-to-end zero-knowledge patient portals, automated clinical trial telemetry, and bidirectional FHIR v4 API pipelines with comprehensive audit trails.',
    pillars: [
      {
        title: 'Zero-Knowledge Patient Vaults',
        description: 'Granular field-level database encryption at rest and in transit adhering strictly to HIPAA and GDPR mandates.',
      },
      {
        title: 'HL7 & FHIR v4 Interoperability',
        description: 'Universal clinical data normalization connecting modern web applications to legacy hospital Epic/Cerner nodes.',
      },
      {
        title: 'Sub-second WebRTC Telehealth',
        description: 'E2EE video consultation rooms with instant diagnostic streaming and automated practitioner SOAP note transcription.',
      },
    ],
    techStack: ['Next.js 15', 'WebRTC', 'AWS HealthLake', 'PostgreSQL', 'Python', 'Docker'],
    kpis: [
      { label: 'HIPAA Audit Compliance', value: '100%' },
      { label: 'Clinical Telemetry Latency', value: '< 120ms' },
      { label: 'Active Clinical Trials', value: '45+' },
    ],
  },
  {
    slug: 'saas',
    code: 'ARC-SAS-03',
    label: 'SaaS & Technology',
    tagline: 'High-Velocity Multi-Tenant Architectures & Cloud Engines',
    headline: 'Next-Gen B2B Product Engineering, Tiered Auth & Extreme Concurrency',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Sleek multi-tenant SaaS analytics command dashboard with real-time graphs',
    accentColor: 'text-indigo-500 dark:text-indigo-400',
    statusText: 'Tenant Isolation: Tier 4 | Distributed Edge',
    complianceBadge: 'SOC-2 Type II • ISO 27001 Architecture',
    challenge:
      'Cross-tenant noisy-neighbor resource starvation, rigid permission schemes, clunky onboarding funnels, and slow server response times that kill user retention.',
    solution:
      'We engineer ultra-performant SaaS platforms powered by Next.js App Router, Prisma ORM, row-level tenant security, and distributed event-driven microservices.',
    pillars: [
      {
        title: 'Row-Level Tenant Isolation',
        description: 'Complete data boundary segregation preventing cross-tenant leakage with automated schema migrations.',
      },
      {
        title: 'Automated Tiered Monetization',
        description: 'Usage metering, team seat scaling, and automated payment recovery workflows.',
      },
      {
        title: 'Edge Caching & Global CDNs',
        description: 'Sub-50ms TTFB across North America, Europe, and Asia-Pacific via Cloudflare edge routing.',
      },
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Prisma', 'Stripe', 'Redis', 'PostgreSQL'],
    kpis: [
      { label: 'Average TTFB Globally', value: '< 45ms' },
      { label: 'System Uptime SLA', value: '99.99%' },
      { label: 'Active Tenant Orgs', value: '1,200+' },
    ],
  },
  {
    slug: 'ecommerce',
    code: 'COM-RT-04',
    label: 'E-commerce & Retail',
    tagline: 'Headless Digital Commerce & Global Inventory Sync',
    headline: 'Sub-Second Checkout Velocity, Multi-Warehouse Inventory & Edge Personalization',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Modern minimalist luxury apparel boutique with omnichannel checkout systems',
    accentColor: 'text-amber-500 dark:text-amber-400',
    statusText: 'Checkout Stream: 12,000 req/s | 0 Drift',
    complianceBadge: 'PCI-DSS Compliant • Global Edge CDN',
    challenge:
      'Monolithic e-commerce templates buckle under flash-sale traffic surges, creating abandoned checkouts, inventory race conditions, and catastrophic revenue loss.',
    solution:
      'We deploy headless e-commerce architectures on Next.js with sub-second storefront rendering, atomic inventory locks, and distributed cart caches.',
    pillars: [
      {
        title: 'Sub-second Edge Storefronts',
        description: 'Pre-rendered static catalog pages revalidated incrementally on stock changes with zero server delay.',
      },
      {
        title: 'Atomic Inventory Locks',
        description: 'Redis-backed distributed mutex locks eliminating overselling during high-concurrency flash sale spikes.',
      },
      {
        title: 'Frictionless Multi-Currency Checkout',
        description: 'Dynamic local currency conversion, tax calculation, and one-click payment wallet support.',
      },
    ],
    techStack: ['Next.js', 'Shopify Storefront API', 'Stripe', 'Redis', 'Algolia'],
    kpis: [
      { label: 'Checkout Conversion Boost', value: '+34%' },
      { label: 'Peak Flash-Sale RPS', value: '14,000' },
      { label: 'Catalog Revalidation', value: '< 200ms' },
    ],
  },
  {
    slug: 'logistics',
    code: 'LOG-TRK-05',
    label: 'Logistics & Supply Chain',
    tagline: 'Fleet Telematics, Dynamic Route Optimization & Warehouse Mesh',
    headline: 'Real-Time Telemetry Streaming, Geofencing & Automated Manifest Verification',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Automated high-bay warehouse distribution facility with automated guided vehicles',
    accentColor: 'text-cyan-500 dark:text-cyan-400',
    statusText: 'IoT Mesh: 48,000 Pings/min | Geo-Lock Active',
    complianceBadge: 'ISO 27001 • Telematics Encrypted',
    challenge:
      'Blind delivery spots, disconnected ERP databases, fuel waste from sub-optimal routing, and inaccurate manual dispatch logs.',
    solution:
      'We engineer IoT telemetry ingestion engines, automated dynamic dispatch algorithms, driver mobile companion apps, and real-time shipment portals.',
    pillars: [
      {
        title: 'High-Throughput IoT Streams',
        description: 'Ingest millions of vehicle coordinates, engine diagnostics, and cold-chain temperature sensors per second.',
      },
      {
        title: 'Automated Route Optimization',
        description: 'Dynamic graph routing evaluating traffic, delivery windows, and truck weight constraints in real-time.',
      },
      {
        title: 'Electronic Bill of Lading (eBOL)',
        description: 'Cryptographic digital signature capture and automated ERP reconciliation on delivery completion.',
      },
    ],
    techStack: ['Node.js', 'Go', 'Kafka', 'PostGIS', 'Flutter', 'TimescaleDB'],
    kpis: [
      { label: 'Fuel & Mileage Reduction', value: '18.4%' },
      { label: 'On-Time Delivery SLA', value: '98.9%' },
      { label: 'Live Tracked Assets', value: '85,000+' },
    ],
  },
  {
    slug: 'edtech',
    code: 'EDT-ACD-06',
    label: 'EdTech & Learning',
    tagline: 'Interactive Virtual Classrooms & Adaptive Learning Engines',
    headline: 'High-Concurrency Collaborative Portals, Interactive Media & Student Analytics',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Students and educators collaborating around interactive learning technology screens',
    accentColor: 'text-violet-500 dark:text-violet-400',
    statusText: 'Realtime Mesh: 120ms Latency | Adaptive Active',
    complianceBadge: 'FERPA Compliant • COPPA Enforced',
    challenge:
      'High latency during live virtual sessions, fragmented learning tools, low student engagement, and lack of real-time student performance feedback.',
    solution:
      'We architect unified learning management ecosystems with sub-150ms WebRTC live virtual classrooms, interactive whiteboards, and predictive learning paths.',
    pillars: [
      {
        title: 'Ultra-Low Latency Virtual Rooms',
        description: 'Scalable WebRTC mesh supporting hundreds of simultaneous participants with interactive polls and breakout rooms.',
      },
      {
        title: 'Adaptive Assessment Engines',
        description: 'Item Response Theory (IRT) algorithms dynamically adjusting problem difficulty based on learner mastery.',
      },
      {
        title: 'FERPA & COPPA Compliance',
        description: 'Strict student privacy protection, encrypted assessment logs, and automated parental consent workflows.',
      },
    ],
    techStack: ['Next.js', 'WebRTC', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Redis'],
    kpis: [
      { label: 'Daily Active Learners', value: '250k+' },
      { label: 'Engagement Completion', value: '+42%' },
      { label: 'Streaming Latency', value: '< 150ms' },
    ],
  },
  {
    slug: 'professional-services',
    code: 'PRO-SRV-07',
    label: 'Professional Services',
    tagline: 'Practice Automation, Secure Client Vaults & Billing Engines',
    headline: 'Unified Practice Management, Automated Trust Accounting & Matter Tracking',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Modern glass enterprise skyscraper representing legal, accounting, and consulting firms',
    accentColor: 'text-blue-600 dark:text-blue-400',
    statusText: 'Vault Encrypted | Automated Trust Sync Active',
    complianceBadge: 'SOC-2 Type II • Strict Confidentiality',
    challenge:
      'Disjointed time-tracking, error-prone manual invoicing, insecure email document transfers, and unbilled operational hours.',
    solution:
      'We engineer bespoke practice management software that integrates automated time capture, matter tracking, secure client document vaults, and trust accounting.',
    pillars: [
      {
        title: 'Secure Client Collaboration Vaults',
        description: 'End-to-end encrypted document rooms with granular access permissions and complete access audit trails.',
      },
      {
        title: 'Automated Time & Trust Accounting',
        description: 'Seamless capture of billable hours with automated matter allocation, trust retainer accounting, and billing.',
      },
      {
        title: 'Workflow Automation for Intake',
        description: 'Self-service client onboarding forms, automated conflict checks, and digital engagement letter sign-off.',
      },
    ],
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'Stripe Invoicing', 'Cloudflare R2'],
    kpis: [
      { label: 'Unbilled Time Recovery', value: '+22%' },
      { label: 'Client Onboarding Time', value: '-65%' },
      { label: 'Billing Cycle Speed', value: '3x Faster' },
    ],
  },
  {
    slug: 'other-industries',
    code: 'IND-IOT-08',
    label: 'Industrial & IoT Systems',
    tagline: 'Custom Mission-Critical Architectures for Specialized Verticals',
    headline: 'High-Reliability Embedded Telemetry, Edge Computing & Industrial Automation',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Industrial automated manufacturing robotics and telemetry control monitors',
    accentColor: 'text-slate-400 dark:text-slate-300',
    statusText: 'SCADA Bridge: Online | Edge Node Verified',
    complianceBadge: 'ISO 9001 • Industrial Safety Compliant',
    challenge:
      'Harsh operational environments, high-frequency sensor noise, unreliable remote network connectivity, and zero tolerance for downtime.',
    solution:
      'We develop edge computing software, real-time SCADA sensor visualization portals, and predictive maintenance engines for industrial operations.',
    pillars: [
      {
        title: 'Resilient Edge Computing',
        description: 'Local edge caching and offline-first processing ensuring continuous operation even during connectivity blackouts.',
      },
      {
        title: 'Real-Time Sensor Telemetry',
        description: 'High-frequency time-series ingestion capable of processing millions of sensor signals per second.',
      },
      {
        title: 'Predictive Equipment Maintenance',
        description: 'Anomaly detection models predicting component failure weeks ahead of operational downtime.',
      },
    ],
    techStack: ['Rust', 'Go', 'TimescaleDB', 'MQTT', 'Docker', 'WebSockets'],
    kpis: [
      { label: 'Unscheduled Downtime', value: '-38%' },
      { label: 'Telemetry Throughput', value: '2M msg/s' },
      { label: 'Audit Verification', value: '100%' },
    ],
  },
];

export function getIndustryBySlug(slug: string): IndustryDetail | undefined {
  const normalized = slug.toLowerCase().trim();
  return INDUSTRIES_LIST.find(
    (ind) =>
      ind.slug === normalized ||
      (normalized === 'fintech-banking' && ind.slug === 'fintech') ||
      (normalized === 'healthcare' && ind.slug === 'healthtech') ||
      (normalized === 'healthcare-healthtech' && ind.slug === 'healthtech') ||
      (normalized === 'ecommerce-retail' && ind.slug === 'ecommerce') ||
      (normalized === 'logistics-supply-chain' && ind.slug === 'logistics') ||
      (normalized === 'education' && ind.slug === 'edtech') ||
      (normalized === 'education-edtech' && ind.slug === 'edtech')
  );
}

export function getAllIndustries(): IndustryDetail[] {
  return INDUSTRIES_LIST;
}
