'use client';

import { useTranslations } from 'next-intl';
import { SectionHeader } from './section-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqSection() {
  const t = useTranslations('Home');

  return (
    <section id="faq" className="py-20 md:py-28 px-6 bg-background relative">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          badge="Faq"
          title={t('faqTitle')}
          description={t('faqSubtitle')}
        />
        
        <Accordion className="w-full mt-12 space-y-4">
          <AccordionItem value="item-1" className="border border-border/40 rounded-[20px] px-6 bg-card/40 backdrop-blur-xs">
            <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 text-left">
              {t('faq1Q')}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 font-semibold">
              {t('faq1A')}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border border-border/40 rounded-[20px] px-6 bg-card/40 backdrop-blur-xs">
            <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 text-left">
              {t('faq2Q')}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 font-semibold">
              {t('faq2A')}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border border-border/40 rounded-[20px] px-6 bg-card/40 backdrop-blur-xs">
            <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 text-left">
              {t('faq3Q')}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 font-semibold">
              {t('faq3A')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-border/40 rounded-[20px] px-6 bg-card/40 backdrop-blur-xs">
            <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 text-left">
              Who owns the code and intellectual property?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 font-semibold">
              You do. Once the project is completed and invoices are settled, 100% of the repository code, designs, configuration parameters, and intellectual property are officially transferred to your business.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-border/40 rounded-[20px] px-6 bg-card/40 backdrop-blur-xs">
            <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 text-left">
              How do you guarantee data security and compliance?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 font-semibold">
              We build systems prioritizing security. This includes configuring isolated database schemas, utilizing HTTPS/SSL, encrypting sensitive fields, restricting IAM access scopes, and following OWASP Top 10 guidelines to block cross-site scripting and unauthorized requests.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
