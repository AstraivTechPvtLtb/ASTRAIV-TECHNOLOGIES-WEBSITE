/**
 * @file client/src/lib/faq-data.ts
 * @description Canonical FAQ Repository.
 * Categorized by domain so pages can render the complete directory or contextual subsets.
 */

export type FaqCategory = 'general' | 'services' | 'pricing' | 'engineering' | 'process';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  isFeatured?: boolean;
}

export const CANONICAL_FAQS: FaqItem[] = [
  // General & Company
  {
    id: 'core-services',
    category: 'general',
    question: 'What core services does Astraiv Technologies provide?',
    answer:
      'Astraiv Technologies provides end-to-end technology solutions: AI & machine learning integrations (multi-agent workflows, enterprise RAG), custom software development, high-velocity Next.js web applications, cross-platform mobile apps (iOS/Android), cloud infrastructure & DevOps, and legacy system modernization.',
    isFeatured: true,
  },
  {
    id: 'start-project',
    category: 'general',
    question: 'How can we start a project with Astraiv Technologies?',
    answer:
      'You can reach out directly via our contact form, email us at info@astraivtechnologies.com, or call +91 8167409664. We typically arrange an initial 30-minute discovery call within 24 hours to review your requirements and provide an architecture estimate.',
    isFeatured: true,
  },

  // Services & Architecture
  {
    id: 'custom-software',
    category: 'services',
    question: 'Can Astraiv build custom enterprise software completely from scratch?',
    answer:
      'Yes. We architect, design, and code bespoke systems from greenfield state through production deployment. Our senior full-stack architects establish scalable database schemas, microservices, and typesafe APIs engineered specifically for your core business operations.',
    isFeatured: true,
  },
  {
    id: 'ai-integration',
    category: 'services',
    question: 'Do you provide enterprise AI integration services?',
    answer:
      'Absolutely. We specialize in practical, production-ready AI capabilities. This includes connecting your internal databases to LLMs with pgvector RAG, deploying autonomous multi-agent task runners, and fine-tuning open-source models with zero data retention or third-party leakage.',
    isFeatured: true,
  },
  {
    id: 'legacy-modernization',
    category: 'engineering',
    question: 'Can you modernize our existing legacy application?',
    answer:
      'Yes. We frequently help organizations migrate legacy monoliths, slow databases, and outdated codebases to modern serverless architectures (Next.js, TypeScript, PostgreSQL, and AWS/Cloudflare). We execute migrations incrementally to ensure zero downtime for your active users.',
    isFeatured: true,
  },

  // Process & Governance
  {
    id: 'process-communication',
    category: 'process',
    question: 'How does the project development process and communication work?',
    answer:
      'We follow our disciplined 6-stage roadmap: Discover, Strategize, Design, Build, Launch, and Scale. Clients receive access to our real-time Astraiv Client Portal to review live sprint boards, milestone releases, and communicate directly with dedicated senior architects.',
    isFeatured: true,
  },

  // Pricing, Commercial & IP
  {
    id: 'ip-ownership',
    category: 'pricing',
    question: 'Who owns the intellectual property and source code?',
    answer:
      'You do. 100% of the repository code, technical documentation, design assets, and architectural configurations are transferred directly to your organization upon project milestones and completion.',
    isFeatured: true,
  },
  {
    id: 'pricing-structure',
    category: 'pricing',
    question: 'How are engagement costs structured and billed?',
    answer:
      'We offer flexible engagement models: Fixed-Price Milestone deliverables with clear acceptance criteria, Two-Week Agile Sprint retainers for dynamic product roadmaps, and Dedicated Squads for enterprise scale. All contracts feature transparent deliverables with zero hidden surcharges.',
    isFeatured: true,
  },
  {
    id: 'warranty-guarantee',
    category: 'pricing',
    question: 'Do you provide a post-launch warranty and SLA support?',
    answer:
      'Yes. Every production delivery includes a 30 to 90-day comprehensive defect warranty. We also provide ongoing SLA maintenance packages covering 24/7 telemetry monitoring, security patching, and proactive performance optimization.',
    isFeatured: true,
  },
  {
    id: 'currencies-invoicing',
    category: 'pricing',
    question: 'What currencies and international payment methods do you support?',
    answer:
      'We accept global electronic wire transfers (ACH, SEPA, SWIFT), corporate credit cards, and multi-currency invoicing in USD ($), EUR (€), GBP (£), and INR (₹) with transparent localized pricing.',
    isFeatured: false,
  },
];

/**
 * Returns FAQs filtered by category, or all FAQs if 'all' is passed.
 */
export function getFaqsByCategory(category?: FaqCategory | 'all'): FaqItem[] {
  if (!category || category === 'all') {
    return CANONICAL_FAQS;
  }
  return CANONICAL_FAQS.filter((faq) => faq.category === category);
}

/**
 * Returns featured FAQs suitable for general overviews or homepage.
 */
export function getFeaturedFaqs(): FaqItem[] {
  return CANONICAL_FAQS.filter((faq) => faq.isFeatured);
}
