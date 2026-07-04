'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { TestimonialCard } from './testimonial-card';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Astraiv's team is exceptional. They restructured our entire cloud architecture on AWS using Next.js and reduced our server overhead by 42%. The UI aesthetics are Stripe-level premium.",
      authorName: 'Sarah Jenkins',
      authorRole: 'VP of Engineering',
      authorCompany: 'Vercel Staging Partner',
    },
    {
      quote: "Working with Astraiv Technologies has automated our entire CRM sync pipeline and customer portal. The project was delivered ahead of schedule and the codebase is flawlessly typed.",
      authorName: 'Marcus Vance',
      authorRole: 'Founder',
      authorCompany: 'Linear Integrations',
    },
    {
      quote: "Their attention to design details, micro-animations, and WCAG accessibility is unmatched. Our clients have commented on the dashboard speed. It feels incredibly premium.",
      authorName: 'Elena Rostova',
      authorRole: 'CTO',
      authorCompany: 'Framer Modules',
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-y border-border/20 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Success Stories"
          title="What Technology Leaders Say"
          description="Hear from engineering VP, founders, and CTOs who trust Astraiv with their complex software architectures."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <TestimonialCard
                quote={test.quote}
                authorName={test.authorName}
                authorRole={test.authorRole}
                authorCompany={test.authorCompany}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
