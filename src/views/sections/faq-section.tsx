'use client';

import { SectionHeader } from './section-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/views/ui/accordion';

export function FaqSection() {
  const faqs = [
    {
      q: 'What core services does AstraIV Technologies provide?',
      a: 'AstraIV Technologies provides end-to-end technology solutions: AI & machine learning integrations (multi-agent workflows, enterprise RAG), custom software development, high-velocity Next.js web applications, cross-platform mobile apps (iOS/Android), cloud infrastructure & DevOps, and legacy system modernization.',
    },
    {
      q: 'Can AstraIV build custom enterprise software completely from scratch?',
      a: 'Yes. We architect, design, and code bespoke systems from greenfield state through production deployment. Our senior full-stack architects establish scalable database schemas, microservices, and typesafe APIs engineered specifically for your core business operations.',
    },
    {
      q: 'Do you provide enterprise AI integration services?',
      a: 'Absolutely. We specialize in practical, production-ready AI capabilities. This includes connecting your internal databases to LLMs with pgvector RAG, deploying autonomous multi-agent task runners, and fine-tuning open-source models with zero data retention or third-party leakage.',
    },
    {
      q: 'Can you modernize our existing legacy application?',
      a: 'Yes. We frequently help organizations migrate legacy monoliths, slow databases, and outdated codebases to modern serverless architectures (Next.js, TypeScript, PostgreSQL, and AWS/Cloudflare). We execute migrations incrementally to ensure zero downtime for your active users.',
    },
    {
      q: 'Who owns the intellectual property and source code?',
      a: 'You do. 100% of the repository code, technical documentation, design assets, and architectural configurations are transferred directly to your organization upon project milestones and completion.',
    },
    {
      q: 'How does the project development process and communication work?',
      a: 'We follow our disciplined 6-stage roadmap: Discover, Strategize, Design, Build, Launch, and Scale. Clients receive access to our real-time AstraIV Client Portal to review live sprint boards, milestone releases, and communicate directly with dedicated senior architects.',
    },
    {
      q: 'How can we start a project with AstraIV Technologies?',
      a: 'You can reach out directly via our contact form, email us at info@astraivtechnologies.com, or call +91 8167409664. We typically arrange an initial 30-minute discovery call within 24 hours to review your requirements and provide an architecture estimate.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 px-6 bg-transparent relative scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge="Frequently Asked Questions"
          title="Everything You Need to Know"
          description="Clear answers regarding our technology architecture, engagement models, delivery pipelines, and IP ownership."
        />

        <Accordion className="w-full mt-12 sm:mt-14 space-y-3.5">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-border/70 dark:border-slate-800/80 rounded-[20px] px-6 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl shadow-xs hover:border-primary/40 dark:hover:border-blue-400/40 transition-colors"
            >
              <AccordionTrigger className="text-sm sm:text-base font-bold text-foreground hover:no-underline py-5 text-left group">
                <span className="group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                  {faq.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 font-medium">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
