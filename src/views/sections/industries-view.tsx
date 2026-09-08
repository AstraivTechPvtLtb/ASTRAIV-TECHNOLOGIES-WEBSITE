'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  HeartPulse,
  Layers,
  ShoppingBag,
  Truck,
  GraduationCap,
  Briefcase,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Lock,
  Compass,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               DATA DEFINITION                              */
/* -------------------------------------------------------------------------- */

interface IndustryData {
  id: string;
  code: string;
  label: string;
  tagline: string;
  headline: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
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

const INDUSTRIES_DATA: IndustryData[] = [
  {
    id: 'fintech',
    code: 'SEC-FIN-01',
    label: 'FinTech',
    tagline: 'High-Frequency Financial Platforms & Ledger Architecture',
    headline: 'Deterministic, Zero-Drift Financial Systems & Transaction Mesh',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Algorithmic financial trading monitors and quantitative data terminal',
    icon: <DollarSign className="h-5 w-5" />,
    accentColor: 'text-emerald-500 dark:text-emerald-400',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    accentBorder: 'border-emerald-500/30',
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
    id: 'healthtech',
    code: 'HLT-MED-02',
    label: 'HealthTech',
    tagline: 'HIPAA & HITECH Compliant Clinical & BioTech Pipelines',
    headline: 'Sovereign Patient Portals, HL7/FHIR Ingestion & Clinical Systems',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Medical doctor operating advanced laboratory robotic software interface',
    icon: <HeartPulse className="h-5 w-5" />,
    accentColor: 'text-rose-500 dark:text-rose-400',
    accentBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    accentBorder: 'border-rose-500/30',
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
    id: 'saas',
    code: 'ARC-SAS-03',
    label: 'SaaS & Technology',
    tagline: 'High-Velocity Multi-Tenant Architectures & Cloud Engines',
    headline: 'Next-Gen B2B Product Engineering, Tiered Auth & Extreme Concurrency',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Sleek multi-tenant SaaS analytics command dashboard with real-time graphs',
    icon: <Layers className="h-5 w-5" />,
    accentColor: 'text-indigo-500 dark:text-indigo-400',
    accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    accentBorder: 'border-indigo-500/30',
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
        description: 'Deep integration of usage-based meters, enterprise license keys, and self-serve team seat management.',
      },
      {
        title: 'Edge-Rendered Real-Time Dashboards',
        description: 'Server Components and WebSocket streaming delivering sub-80ms page loads regardless of enterprise team size.',
      },
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Redis', 'Cloudflare Workers'],
    kpis: [
      { label: 'Average Response Time', value: '< 65ms' },
      { label: 'Concurrent User Capacity', value: '1M+' },
      { label: 'Platform Uptime Target', value: '99.99%' },
    ],
  },
  {
    id: 'ecommerce',
    code: 'RET-ECM-04',
    label: 'E-commerce',
    tagline: 'Headless Digital Commerce Engines Built for Peak Concurrency',
    headline: 'Sub-Second Storefronts, Dynamic Caching & Global Checkout Velocity',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Modern robotic automated logistics warehouse and high-speed fulfillment hub',
    icon: <ShoppingBag className="h-5 w-5" />,
    accentColor: 'text-amber-500 dark:text-amber-400',
    accentBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    accentBorder: 'border-amber-500/30',
    statusText: 'Checkout P99: 420ms | Flash Sale Resilient',
    complianceBadge: 'PCI-DSS • Global Taxjar • SCA Compliant',
    challenge:
      'Monolithic e-commerce stacks buckle during flash traffic spikes, suffer 3+ second page load abandonment, and struggle with multi-warehouse inventory desyncs.',
    solution:
      'We build decoupled headless storefronts leveraging Shopify Storefront APIs, serverless edge compute, sub-second search indexing, and real-time inventory reservation locks.',
    pillars: [
      {
        title: 'Edge Headless Architecture',
        description: 'Static prerendering blended with incremental static regeneration for instant product catalog browsing worldwide.',
      },
      {
        title: 'Atomic Inventory Reservation Locks',
        description: 'Distributed Redis locks preventing overselling or phantom cart checkouts during high-demand product drops.',
      },
      {
        title: 'One-Click Sub-Second Checkout',
        description: 'Streamlined payment flows with Apple Pay, Google Pay, and localized regional payment providers.',
      },
    ],
    techStack: ['Shopify Headless', 'Next.js 15', 'Algolia Search', 'Redis', 'Tailwind CSS', 'Stripe'],
    kpis: [
      { label: 'Mobile Conversion Lift', value: '+38%' },
      { label: 'Largest Contentful Paint', value: '0.8s' },
      { label: 'Flash Sale Concurrency', value: '150k/min' },
    ],
  },
  {
    id: 'logistics',
    code: 'LOG-FLT-05',
    label: 'Logistics',
    tagline: 'Intelligent Fleet Tracking, IoT Telemetry & Automated Supply Chains',
    headline: 'Real-Time Dispatching, Route Graph AI & Automated Freight Workflows',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Aerial container port and modern freight transportation fleet',
    icon: <Truck className="h-5 w-5" />,
    accentColor: 'text-cyan-500 dark:text-cyan-400',
    accentBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    accentBorder: 'border-cyan-500/30',
    statusText: 'IoT Ingestion: 25k Pings/s | Telematics Live',
    complianceBadge: 'DOT Compliant • EDI 204/214 • Geofence Verified',
    challenge:
      'Inefficient route dispatching leading to excessive fuel overhead, lack of real-time container visibility, and manual paper-based bill of lading errors.',
    solution:
      'We engineer continuous IoT telematics pipelines, graph-based route optimization algorithms, dynamic driver dispatch consoles, and automated customer tracking webhooks.',
    pillars: [
      {
        title: 'Real-Time Geospatial Ingestion',
        description: 'High-throughput WebSocket and MQTT broker pipelines capturing continuous GPS coordinates, speed, and fuel telemetry.',
      },
      {
        title: 'Dynamic Graph Route Optimization',
        description: 'Heuristic pathfinding reducing deadhead miles, avoiding choke points, and scheduling driver hours-of-service.',
      },
      {
        title: 'Automated Geofence Triggers',
        description: 'Sub-second event dispatching when vehicles cross facility perimeters, initiating automatic gate pass generation.',
      },
    ],
    techStack: ['Node.js', 'PostGIS', 'WebSockets', 'Go', 'RabbitMQ', 'Mapbox GL'],
    kpis: [
      { label: 'Route Overhead Reduced', value: '-24%' },
      { label: 'Real-Time Tracking Accuracy', value: '99.98%' },
      { label: 'Daily Telematics Packets', value: '80M+' },
    ],
  },
  {
    id: 'edtech',
    code: 'EDU-EDT-06',
    label: 'EdTech',
    tagline: 'Interactive Virtual Learning Platforms & Adaptive Knowledge Portals',
    headline: 'Scalable Class Concurrency, AI Proctoring & Dynamic Skill Graphs',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Students and engineers collaborating in a modern university high-tech lab',
    icon: <GraduationCap className="h-5 w-5" />,
    accentColor: 'text-violet-500 dark:text-violet-400',
    accentBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    accentBorder: 'border-violet-500/30',
    statusText: 'Concurrent Classrooms: 3,200 | Latency <150ms',
    complianceBadge: 'FERPA Compliant • COPPA • SCORM/LTI v1.3',
    challenge:
      'Monotonous static courseware resulting in sub-10% completion rates, clunky proctoring protocols, and legacy LMS platforms unable to scale during peak exam windows.',
    solution:
      'We build low-latency interactive video classrooms, dynamic knowledge graphs with AI-assisted exercise generation, proctoring audit trails, and modular SCORM/LTI adapters.',
    pillars: [
      {
        title: 'Interactive WebRTC Classrooms',
        description: 'Ultra-low latency virtual lecture halls with interactive whiteboarding, breakout sessions, and dynamic screen sharing.',
      },
      {
        title: 'Adaptive Learning Assessment Engine',
        description: 'AI-guided difficulty calibration tailoring question banks dynamically to each student’s demonstrated comprehension.',
      },
      {
        title: 'SCORM & LTI v1.3 Compatibility',
        description: 'Seamless integration with existing school district infrastructure (Canvas, Blackboard, Moodle) with zero data sync lag.',
      },
    ],
    techStack: ['React', 'FastAPI', 'LiveKit', 'MongoDB', 'Python', 'Tailwind CSS'],
    kpis: [
      { label: 'Student Course Completion', value: '94.6%' },
      { label: 'Concurrent Student Loads', value: '300k+' },
      { label: 'FERPA Audit Rating', value: '100%' },
    ],
  },
  {
    id: 'professional-services',
    code: 'PRO-SRV-07',
    label: 'Professional Services',
    tagline: 'Automated Practice Management, Secure Client Portals & Billing',
    headline: 'Enterprise Client Portals, Contract Lifecycle & Sovereign Vaults',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Modern high-rise architectural glass corporate boardroom and law advisory center',
    icon: <Briefcase className="h-5 w-5" />,
    accentColor: 'text-sky-500 dark:text-sky-400',
    accentBg: 'bg-sky-500/10 dark:bg-sky-500/20',
    accentBorder: 'border-sky-500/30',
    statusText: 'Client Vault: Zero-Trust Enforced | E2EE Active',
    complianceBadge: 'ISO 27001 • SOC-2 Type II • Strict Confidentiality',
    challenge:
      'Law firms, accounting practices, and consultancies losing billable hours to manual document intake, uncoordinated email chains, and disjointed time-tracking systems.',
    solution:
      'We architect white-labeled client self-service portals, automated contract drafting pipelines, granular audit-room vaults, and automated retainer billing reconciliations.',
    pillars: [
      {
        title: 'Zero-Trust Client Data Rooms',
        description: 'Client matter vaults with strict cryptographic permissions, watermarked previews, and immutable document access logs.',
      },
      {
        title: 'Contract Lifecycle Automation',
        description: 'Dynamic contract generation from verified templates with seamless e-signature routing and compliance tracking.',
      },
      {
        title: 'Automated Retainer & Time Billing',
        description: 'Synchronized timesheet capture with automated client trust accounting and instant invoice generation.',
      },
    ],
    techStack: ['Next.js 15', 'Prisma', 'PostgreSQL', 'AWS KMS', 'DocuSign API', 'Stripe'],
    kpis: [
      { label: 'Client Onboarding Time', value: '-65%' },
      { label: 'Invoice Settlement Speed', value: '3.4x Faster' },
      { label: 'Data Security Compliance', value: '100%' },
    ],
  },
  {
    id: 'other-industries',
    code: 'ADV-IND-08',
    label: 'Other Industries',
    tagline: 'Deep Tech, Clean Energy, Industrial IoT & Sovereign GovTech',
    headline: 'Bespoke Engineering for Mission-Critical & Air-Gapped Environments',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop',
    imageAlt: 'Advanced industrial robotics and clean energy telemetry control room',
    icon: <Cpu className="h-5 w-5" />,
    accentColor: 'text-purple-500 dark:text-purple-400',
    accentBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    accentBorder: 'border-purple-500/30',
    statusText: 'SCADA Telemetry Stream: <8ms | Air-Gapped Ready',
    complianceBadge: 'NIST 800-53 • NERC-CIP • ISO 9001',
    challenge:
      'Extreme industrial operating conditions, non-standard protocol hardware (Modbus, CAN-bus, OPC-UA), and strict zero-failure operational tolerances.',
    solution:
      'We deliver custom digital twins, predictive maintenance AI edge models, high-frequency SCADA data collectors, and resilient air-gapped on-premise deployments.',
    pillars: [
      {
        title: 'SCADA & Industrial Edge Ingestion',
        description: 'Embedded Rust and Python daemons converting legacy factory telemetry into standardized cloud or edge time-series streams.',
      },
      {
        title: 'Digital Twin Predictive Modeling',
        description: 'Continuous physics-informed neural networks forecasting machine degradation and anomalies hours before critical failure.',
      },
      {
        title: 'Air-Gapped & Sovereign Deployments',
        description: 'Hardened Kubernetes distributions built to execute offline in secure facilities without external internet dependencies.',
      },
    ],
    techStack: ['Rust', 'Python', 'TimescaleDB', 'MQTT / OPC-UA', 'Docker', 'Kubernetes'],
    kpis: [
      { label: 'Unplanned Downtime', value: '0.00%' },
      { label: 'Edge Signal Sampling Rate', value: '100kHz' },
      { label: 'Predictive Horizon', value: '72h Ahead' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                        REGULATORY MATRIX DATA                              */
/* -------------------------------------------------------------------------- */

const REGULATORY_MATRIX = [
  {
    vertical: 'FinTech',
    certifications: 'PCI-DSS Level 1, SOC-2 Type II, ISO 27001',
    latencyRequirement: '< 150ms P99',
    encryptionProtocol: 'AES-256-GCM + Hardware Security Module (HSM)',
    auditLogging: 'Cryptographic Immutable Ledger',
  },
  {
    vertical: 'HealthTech',
    certifications: 'HIPAA, HITECH, FDA 21 CFR Part 11, GDPR',
    latencyRequirement: '< 200ms Telemetry',
    encryptionProtocol: 'Field-level Zero-Knowledge Encryption',
    auditLogging: 'Strict Access Log Trails with FHIR v4 Prov',
  },
  {
    vertical: 'SaaS & Technology',
    certifications: 'SOC-2 Type II, ISO 27001, CCPA / GDPR',
    latencyRequirement: '< 80ms Edge Routing',
    encryptionProtocol: 'TLS 1.3 + Dynamic Tenant Key Rotation',
    auditLogging: 'OpenTelemetry Distributed Tracing',
  },
  {
    vertical: 'E-commerce',
    certifications: 'PCI-DSS, PSD2 / SCA, Global Sales Tax Audit',
    latencyRequirement: '< 500ms Checkout P99',
    encryptionProtocol: 'Encrypted Vault Tokenization',
    auditLogging: 'Automated Cart & Webhook Event Logs',
  },
  {
    vertical: 'Logistics',
    certifications: 'DOT / FMCSA, EDI Standards, ISO 28000',
    latencyRequirement: '< 1s Telemetry Stream',
    encryptionProtocol: 'IoT Certificate-Based Mutual TLS (mTLS)',
    auditLogging: 'Immutable GPS Geofence Checkpoints',
  },
  {
    vertical: 'EdTech',
    certifications: 'FERPA, COPPA, SCORM / LTI 1.3 Certified',
    latencyRequirement: '< 150ms WebRTC Stream',
    encryptionProtocol: 'E2EE Video & Anonymous Student Identifiers',
    auditLogging: 'Encrypted Assessment Audit Records',
  },
  {
    vertical: 'Professional Services',
    certifications: 'SOC-2 Type II, ISO 27001, Bar Confidentiality',
    latencyRequirement: '< 250ms Document Access',
    encryptionProtocol: 'Customer Managed Keys (CMK) / AWS KMS',
    auditLogging: 'Strict Role-Based Document Access Logs',
  },
  {
    vertical: 'Other Industries',
    certifications: 'NIST 800-53, NERC-CIP, ISA/IEC 62443',
    latencyRequirement: '< 10ms SCADA Edge',
    encryptionProtocol: 'Air-Gapped Sovereign HSM Keys',
    auditLogging: 'SCADA Operational Blackbox Logging',
  },
];

/* -------------------------------------------------------------------------- */
/*                               MAIN VIEW                                    */
/* -------------------------------------------------------------------------- */

export function IndustriesView() {
  const [activeVertical, setActiveVertical] = useState<string>('fintech');

  // Listen to hash changes if user navigated with anchor
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && INDUSTRIES_DATA.some((ind) => ind.id === hash)) {
        setActiveVertical(hash);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const scrollToIndustry = (id: string) => {
    setActiveVertical(id);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HEADER */}
      <section className="pt-28 pb-4 md:pt-36 md:pb-6 px-6 max-w-7xl mx-auto w-full text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
          Industries We Empower
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-1">
          Mission-critical software engineering architected for regulated and high-velocity sectors.
        </p>
      </section>

      {/* ==================================================================== */}
      {/* 2. STICKY COMMAND DOCK (QUICK SCROLL JUMP)                          */}
      {/* ==================================================================== */}
      <section className="sticky top-20 z-30 py-3 bg-background/80 dark:bg-slate-950/80 backdrop-blur-xl border-y border-border/50 dark:border-slate-800/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-start lg:justify-center gap-2 min-w-max py-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              <span>Sectors:</span>
            </span>

            {INDUSTRIES_DATA.map((ind) => {
              const isActive = activeVertical === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => scrollToIndustry(ind.id)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 border border-primary scale-[1.02]'
                      : 'bg-card/70 dark:bg-slate-900/60 text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border border-border/50 dark:border-slate-800/80'
                  )}
                >
                  <span className={cn('transition-colors', isActive ? 'text-primary-foreground' : ind.accentColor)}>
                    {ind.icon}
                  </span>
                  <span>{ind.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. THE 8 INDUSTRY VERTICAL SHOWCASES                                 */}
      {/* ==================================================================== */}
      <section className="py-16 md:py-24 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-24">
          {INDUSTRIES_DATA.map((ind, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={ind.id}
                id={ind.id}
                className="scroll-mt-36 p-6 sm:p-8 md:p-12 rounded-3xl bg-card/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-border/60 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/30 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background decorative watermark code */}
                <div className="absolute top-4 right-6 text-7xl md:text-8xl font-black text-slate-200/30 dark:text-slate-800/20 select-none pointer-events-none tracking-tighter">
                  {ind.code}
                </div>

                <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10')}>
                  {/* Left Column: Visual Photograph & Telemetry Card */}
                  <div className={cn('lg:col-span-5 flex flex-col', isReversed ? 'lg:order-2' : 'lg:order-1')}>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border/60 dark:border-slate-800 aspect-[4/3] group-hover:shadow-2xl transition-all">
                      <Image
                        src={ind.image}
                        alt={ind.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                      {/* Top floating badge */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-xs">
                          <span className={cn('h-2 w-2 rounded-full animate-ping', ind.accentBg)} />
                          <span>{ind.code}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xs">
                          <ShieldCheck className="h-3 w-3 text-primary" />
                          <span>{ind.complianceBadge}</span>
                        </span>
                      </div>

                      {/* Bottom floating telemetry status bar */}
                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                          <span className="truncate">{ind.statusText}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          Live Node
                        </span>
                      </div>
                    </div>

                    {/* KPI Metric Pods below image */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {ind.kpis.map((kpi, kIdx) => (
                        <div
                          key={kIdx}
                          className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-950/50 border border-border/40 dark:border-slate-800/80 flex flex-col text-center"
                        >
                          <span className="text-lg sm:text-xl font-extrabold text-foreground font-heading">
                            {kpi.value}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground leading-tight mt-0.5">
                            {kpi.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Architectural Narrative & Core Pillars */}
                  <div className={cn('lg:col-span-7 flex flex-col gap-6', isReversed ? 'lg:order-1' : 'lg:order-2')}>
                    <div>
                      {/* Sub-tag */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase',
                            ind.accentBg,
                            ind.accentColor,
                            ind.accentBorder,
                            'border'
                          )}
                        >
                          {ind.icon}
                          <span>{ind.label} Vertical</span>
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">{ind.tagline}</span>
                      </div>

                      {/* Headline */}
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-heading leading-tight">
                        {ind.headline}
                      </h2>
                    </div>

                    {/* The Friction vs Astraiv Resolution */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-border/50 dark:border-slate-800/80">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-1 mb-1">
                          <span>Legacy Friction</span>
                        </span>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {ind.challenge}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1 mb-1">
                          <span>Astraiv Resolution</span>
                        </span>
                        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                          {ind.solution}
                        </p>
                      </div>
                    </div>

                    {/* Architectural Pillars */}
                    <div className="space-y-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Proprietary Engineering Pillars
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ind.pillars.map((pillar, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3.5 rounded-xl bg-card/90 dark:bg-slate-900/90 border border-border/60 dark:border-slate-800 shadow-2xs hover:border-primary/30 transition-all flex flex-col gap-1.5"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="truncate">{pillar.title}</span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-3">
                              {pillar.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Chips & Action Link */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40 dark:border-slate-800/80">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                          Stack:
                        </span>
                        {ind.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border/50 dark:border-slate-700/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/contact?vertical=${ind.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs group/btn"
                      >
                        <span>Request {ind.label} Brief</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. REGULATORY & COMPLIANCE MATRIX                                   */}
      {/* ==================================================================== */}
      <section className="py-20 px-6 bg-slate-50/50 dark:bg-slate-950/40 border-y border-border/60 dark:border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-secondary bg-secondary/10 dark:bg-secondary/20 border border-secondary/20 uppercase mb-4">
              <Lock className="h-3.5 w-3.5" />
              <span>Compliance & Security Governance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground mb-4">
              Enterprise Regulatory Matrix
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Every vertical we engineer adheres to rigid sovereign audit frameworks, deterministic encryption
              standards, and guaranteed transaction latency SLAs.
            </p>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-border/60 dark:border-slate-800/80 bg-card/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-xl">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-border/60 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 pl-6">Sector Vertical</th>
                  <th className="p-4">Governing Frameworks</th>
                  <th className="p-4">Latency SLA</th>
                  <th className="p-4">Cryptographic Protocol</th>
                  <th className="p-4 pr-6">Audit Trail Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-slate-800/60 text-xs sm:text-sm">
                {REGULATORY_MATRIX.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="p-4 pl-6 font-bold text-foreground flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                      <span>{row.vertical}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {row.certifications}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {row.latencyRequirement}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono text-[11px] sm:text-xs">
                      {row.encryptionProtocol}
                    </td>
                    <td className="p-4 pr-6 text-muted-foreground font-medium">
                      {row.auditLogging}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. PRINCIPAL ARCHITECT CONSULTATION CTA                             */}
      {/* ==================================================================== */}
      <section className="py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-br from-card via-card to-primary/5 dark:from-slate-900 dark:via-slate-900/90 dark:to-primary/15 border border-border/80 dark:border-slate-800 shadow-2xl relative text-center flex flex-col items-center">
          {/* Subtle glowing orb */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider text-accent bg-accent/10 dark:bg-accent/20 border border-accent/20 uppercase mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Vertical Architecture Advisory</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground max-w-3xl leading-[1.15] mb-6">
            Have a Complex Vertical with Non-Standard Constraints?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl font-medium leading-relaxed mb-10">
            Our principal software architects and systems engineers work directly with your leadership to design,
            prototype, and deploy compliant software tailored exactly to your sector&apos;s parameters.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/25 group"
            >
              <span>Schedule Architecture Review</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-card dark:bg-slate-800 text-foreground hover:bg-slate-100 dark:hover:bg-slate-700 border border-border dark:border-slate-700 transition-all"
            >
              <span>View Case Studies</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
