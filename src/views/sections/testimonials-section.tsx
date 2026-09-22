'use client';

/**
 * @file src/components/sections/testimonials-section.tsx
 * @description Client-facing testimonials section with real-time public database review fetching.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { TestimonialCard } from './testimonial-card';
import { type TestimonialItem } from '@/models/types';
import { getPublicApprovedReviews } from '@/controllers/public-data.controller';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { ArrowRight } from 'lucide-react';

interface TestimonialsSectionProps {
  initialReviews?: TestimonialItem[];
}

export function TestimonialsSection({ initialReviews }: TestimonialsSectionProps) {
  const [reviews, setReviews] = useState<TestimonialItem[]>(
    initialReviews && initialReviews.length > 0 ? initialReviews : []
  );

  useEffect(() => {
    if (!initialReviews || initialReviews.length === 0) {
      getPublicApprovedReviews().then((fetched) => {
        if (fetched && fetched.length > 0) {
          setReviews(fetched);
        }
      });
    }
  }, [initialReviews]);

  return (
    <section id="testimonials" className="py-20 md:py-28 px-6 bg-slate-50/50 dark:bg-slate-900/10 border-y border-border/20 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Success Stories"
          title="What Technology Leaders Say"
          description="Hear from engineering VP, founders, and CTOs who trust Astraiv with their complex software architectures."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {reviews.map((test, index) => (
            <motion.div
              key={test.id || index}
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
                avatarUrl={test.avatarUrl}
                rating={test.rating}
              />
            </motion.div>
          ))}
        </div>

        {/* Link to Dedicated Testimonials Directory Under WORK */}
        <div className="mt-14 text-center">
          <Link
            href={ROUTES.PUBLIC.WORK_TESTIMONIALS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-foreground hover:text-primary dark:hover:text-blue-400 bg-card/80 hover:bg-card border border-border/60 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200 shadow-xs hover:shadow-md group"
          >
            <span>Read Client Stories / View Testimonials</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
