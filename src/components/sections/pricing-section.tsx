'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { PricingCard } from './pricing-card';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter Plan',
      price: billingCycle === 'monthly' ? '$4,999' : '$3,999',
      description: 'Ideal for early-stage startups needing a premium marketing website and brand system.',
      features: [
        'Custom Web Design (Framer/Next.js)',
        'SEO & Performance Tuning',
        'Standard Contact Integrations',
        '2 rounds of layout revisions',
        'Email Support',
      ],
      buttonText: 'Start Building',
    },
    {
      name: 'Professional Plan',
      price: billingCycle === 'monthly' ? '$9,999' : '$7,999',
      description: 'Our most popular plan, covering custom web applications, SaaS dashboards, and database setup.',
      features: [
        'Everything in Starter',
        'SaaS Dashboard & User Login',
        'Prisma & Postgres integrations',
        'Stripe payment stub setup',
        '2 weeks post-launch SLA support',
        'Dedicated Slack support channel',
      ],
      buttonText: 'Hire Our Architects',
      isPopular: true,
    },
    {
      name: 'Enterprise Plan',
      price: 'Custom',
      description: 'For companies requiring dedicated cloud infrastructure, AI integrations, and full SLA support.',
      features: [
        'Custom AI & Agent workflow stubs',
        'Cloudflare R2 CDNs config',
        'AWS load-balanced hosting setup',
        'Role-Based admin dashboards',
        'Priority SLA 24/7 Response time',
        'Unlimited revision approvals',
      ],
      buttonText: 'Book a Consultation',
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-y border-border/20 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Pricing"
          title="Flexible Engagement Models"
          description="Choose a plan that matches your engineering velocity. No hidden contracts, completely transparent timelines."
        />

        {/* Billing cycle toggle */}
        <div className="flex items-center justify-center gap-4 mt-12 mb-8">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-slate-200 dark:bg-slate-800 rounded-full p-1 transition-colors duration-300 relative focus:outline-hidden"
          >
            <motion.div
              layout
              className="w-6 h-6 bg-primary dark:bg-accent rounded-full"
              animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-md border border-emerald-500/20">
              Save 20%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <PricingCard
                name={plan.name}
                price={plan.price}
                period={billingCycle === 'monthly' ? '/mo' : '/yr'}
                description={plan.description}
                features={plan.features}
                buttonText={plan.buttonText}
                isPopular={plan.isPopular}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
