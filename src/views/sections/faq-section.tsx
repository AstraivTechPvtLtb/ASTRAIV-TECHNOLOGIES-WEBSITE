'use client';

import { useState } from 'react';
import { SectionHeader } from './section-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/views/ui/accordion';
import { CANONICAL_FAQS, getFaqsByCategory, FaqCategory, FaqItem } from '@/lib/faq-data';

export interface FaqSectionProps {
  category?: FaqCategory | 'all';
  items?: FaqItem[];
  featuredOnly?: boolean;
  title?: string;
  badge?: string;
  description?: string;
  className?: string;
  showCategoryFilter?: boolean;
  asH1?: boolean;
}

export function FaqSection({
  category = 'all',
  items,
  featuredOnly = false,
  title = 'Everything You Need to Know',
  badge = 'Frequently Asked Questions',
  description = 'Clear answers regarding our technology architecture, engagement models, delivery pipelines, and IP ownership.',
  className,
  showCategoryFilter = false,
  asH1 = false,
}: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FaqCategory | 'all'>(category);

  // Determine active FAQ list
  let displayFaqs: FaqItem[];
  if (items) {
    displayFaqs = activeCategory === 'all' ? items : items.filter((f) => f.category === activeCategory);
  } else if (featuredOnly) {
    displayFaqs = CANONICAL_FAQS.filter((f) => f.isFeatured);
  } else {
    displayFaqs = getFaqsByCategory(activeCategory);
  }

  const categoryLabels: { key: FaqCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Questions' },
    { key: 'general', label: 'General' },
    { key: 'services', label: 'Services & Tech' },
    { key: 'pricing', label: 'Pricing & IP' },
    { key: 'engineering', label: 'Engineering' },
    { key: 'process', label: 'Process' },
  ];

  return (
    <section id="faq" className={`py-16 md:py-24 px-6 bg-transparent relative scroll-mt-24 ${className || ''}`}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge={badge}
          title={title}
          description={description}
          asH1={asH1}
        />

        {showCategoryFilter && !items && (
          <div className="flex flex-wrap justify-center gap-2 mt-8 mb-4">
            {categoryLabels.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-card/70 dark:bg-slate-900/60 border border-border/70 dark:border-slate-800 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        <Accordion className="w-full mt-10 sm:mt-12 space-y-3.5">
          {displayFaqs.map((faq, index) => (
            <AccordionItem
              key={faq.id || index}
              value={`faq-${faq.id || index}`}
              className="border border-border/70 dark:border-slate-800/80 rounded-[20px] px-6 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl shadow-xs hover:border-primary/40 dark:hover:border-blue-400/40 transition-colors"
            >
              <AccordionTrigger className="text-sm sm:text-base font-bold text-foreground hover:no-underline py-5 text-left group">
                <span className="group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-5 font-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

