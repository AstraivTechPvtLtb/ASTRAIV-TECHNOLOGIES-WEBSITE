/**
 * @file client/src/lib/process-data.ts
 * @description Canonical 6-Stage Process Data.
 * Defines the single authoritative lifecycle: Discover -> Strategize -> Design -> Build -> Launch -> Scale.
 * Powers both Homepage (summary cards) and Company/Services Pages (detailed execution & quality gates).
 */

export interface ProcessStage {
  num: string;
  stageNumber: number;
  title: 'Discover' | 'Strategize' | 'Design' | 'Build' | 'Launch' | 'Scale';
  tag: string;
  iconName: 'Compass' | 'Target' | 'Palette' | 'Code2' | 'Rocket' | 'LineChart';
  summary: string;
  detailedDesc: string;
  keyDeliverables: string[];
  qualityGates: string[];
}

export const CANONICAL_PROCESS_STAGES: ProcessStage[] = [
  {
    num: '01',
    stageNumber: 1,
    title: 'Discover',
    tag: 'Alignment',
    iconName: 'Compass',
    summary:
      'We audit your current tech, understand core business challenges, analyze end-user personas, and define measurable outcomes.',
    detailedDesc:
      'Deep architectural discovery, technical stack audit, stakeholder persona mapping, and commercial ROI definition prior to drafting code. We uncover non-functional requirements and eliminate security boundary risks.',
    keyDeliverables: [
      'Technical Discovery Assessment',
      'Entity Relationship Model',
      'Non-Functional Requirement Matrix',
      'Commercial Milestone Roadmap',
    ],
    qualityGates: [
      'Executive stakeholder alignment sign-off',
      'Initial security & compliance boundary verification',
    ],
  },
  {
    num: '02',
    stageNumber: 2,
    title: 'Strategize',
    tag: 'Architecture',
    iconName: 'Target',
    summary:
      'We design the technology blueprint, data schemas, API contracts, cloud architecture, and sprint delivery milestones.',
    detailedDesc:
      'Senior principal architects formulate the system blueprint, API contracts (OpenAPI / GraphQL), database migration strategies, and multi-region cloud topology to ensure zero architectural debt.',
    keyDeliverables: [
      'System Architecture Document (C4 Model)',
      'OpenAPI 3.1 Contract Specifications',
      'Multi-Region Cloud Topology',
      'Two-Week Sprint Allocation Plan',
    ],
    qualityGates: [
      'Peer architectural review approval',
      'API schema contract lock with zero breaking change risk',
    ],
  },
  {
    num: '03',
    stageNumber: 3,
    title: 'Design',
    tag: 'Experience',
    iconName: 'Palette',
    summary:
      'We construct modern, accessible, high-conversion UI/UX interfaces backed by cohesive design tokens and psychology-driven layouts.',
    detailedDesc:
      'Our UI/UX squad translates product requirements into cohesive design systems. We engineer accessible, mobile-responsive Figma tokens, high-fidelity interaction flows, and conversion-optimized checkout and onboarding paths.',
    keyDeliverables: [
      'Modular Figma Design System & Tokens',
      'Interactive High-Fidelity Clickable Prototypes',
      'WCAG 2.1 AA Accessibility Audit',
      'User Journey & Conversion Funnel Maps',
    ],
    qualityGates: [
      'WCAG 2.1 AA accessibility score verification',
      'Design token synchronization with frontend Tailwind configuration',
    ],
  },
  {
    num: '04',
    stageNumber: 4,
    title: 'Build',
    tag: 'Engineering',
    iconName: 'Code2',
    summary:
      'Our senior architects code with strict typesafety in Next.js, TypeScript, and modern databases with zero architectural debt.',
    detailedDesc:
      'Two-week agile sprint execution with strict TypeScript compilation, automated CI/CD unit testing, preview staging branch deployments, and weekly transparent video walkthroughs for stakeholders.',
    keyDeliverables: [
      'Production-Grade TypeScript / Next.js Codebase',
      'Automated Test Suite (Unit, Integration & E2E)',
      'Per-PR Ephemeral Preview Environments',
      'Weekly Demo Builds & Client Portal Updates',
    ],
    qualityGates: [
      '100% Typecheck & strict linter pass',
      'Unit test coverage threshold > 85%',
      'Automated SAST security vulnerability scan',
    ],
  },
  {
    num: '05',
    stageNumber: 5,
    title: 'Launch',
    tag: 'Verification',
    iconName: 'Rocket',
    summary:
      'We run end-to-end security audits, load-testing, and SEO optimization before deploying to zero-downtime multi-region edge servers.',
    detailedDesc:
      'Pre-production hardening including simulated high-concurrency DDoS penetration testing, edge CDN cache warmup, structured metadata/SEO verification, and blue-green zero-downtime traffic cutover.',
    keyDeliverables: [
      'Third-Party Penetration Test Sign-Off',
      'Load Testing Benchmarks (10k+ concurrent users)',
      'Production Cutover Runbook',
      'Automated Multi-Region Edge Rollout',
    ],
    qualityGates: [
      'Zero high or critical CVE security vulnerabilities',
      'Edge p99 latency < 200ms under 5x simulated traffic',
      'Automated rollback test verified in staging',
    ],
  },
  {
    num: '06',
    stageNumber: 6,
    title: 'Scale',
    tag: 'Evolution',
    iconName: 'LineChart',
    summary:
      'We continuously monitor live telemetry, optimize conversion funnels, automate internal pipelines, and scale features alongside growth.',
    detailedDesc:
      'Post-launch 24/7 telemetry monitoring, distributed error tracing via OpenTelemetry, continuous database index optimization, and proactive feature evolution under contractual 99.9% uptime SLAs.',
    keyDeliverables: [
      'Live OpenTelemetry & Sentry Monitoring',
      'Database Index & Query Latency Telemetry',
      '30-to-90 Day Post-Launch Warranty',
      'Continuous Feature & Model Iteration Sprints',
    ],
    qualityGates: [
      'Contractual 99.9% availability SLA compliance',
      'Automated mean-time-to-detection (MTTD) < 5 minutes',
    ],
  },
];
