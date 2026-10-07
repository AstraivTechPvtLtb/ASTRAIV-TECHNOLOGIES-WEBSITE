'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { PricingCard } from './pricing-card';
import { Link } from '@/i18n/routing';
import { PublicPricingPlan, DEFAULT_PRICING_PLANS } from '@/models/types';

interface PricingSectionProps {
  initialPlans?: PublicPricingPlan[];
}

export function PricingSection({ initialPlans }: PricingSectionProps) {
  const rawPlans = initialPlans !== undefined && initialPlans.length > 0 ? initialPlans : DEFAULT_PRICING_PLANS;

  return (
    <section id="pricing" className="py-10 md:py-14 px-0 bg-transparent relative scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Structured [Engagement Models]"
          description="Choose a delivery structure that aligns with your product goals. We partner on clearly scoped sprints, transparent milestone deliverables, and dedicated maintenance."
        />

        {rawPlans.length === 0 ? (
          <div className="p-12 max-w-2xl mx-auto bg-card/70 dark:bg-slate-900/60 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-3xl text-center flex flex-col items-center justify-center gap-4 mt-8">
            <h4 className="text-xl font-semibold tracking-[-0.015em] text-foreground">Custom Consultation & Scope Assessment</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
              We engineer custom enterprise engagement models tailored strictly to your company&apos;s architecture, timeline, and security requirements.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all cursor-pointer"
            >
              <span>Request a Quote</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10 max-w-6xl mx-auto items-stretch">
            {rawPlans.map((plan, index) => {
              const ctaDestination = plan.buttonUrl
                ? plan.buttonUrl
                : `/start-project?source_page=${encodeURIComponent('/pricing')}&model=${encodeURIComponent(plan.name)}`;

              return (
                <motion.div
                  key={plan.id || plan.slug || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                  className="h-full flex flex-col"
                >
                  <PricingCard
                    name={plan.name}
                    description={plan.description}
                    features={plan.features}
                    buttonText={plan.buttonText || 'Request a Quote'}
                    isPopular={plan.isPopular}
                    badge={plan.badge}
                    href={ctaDestination}
                    price={plan.priceMonthly}
                    currency={plan.currency}
                    billingPeriod={plan.billingPeriod}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
