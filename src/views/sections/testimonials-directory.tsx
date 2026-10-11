'use client';

/**
 * @file client/src/views/sections/testimonials-directory.tsx
 * @description Interactive, searchable, and category-filtered testimonials directory.
 */

import { useState, useMemo } from 'react';
import { ResilientImage } from '@/views/ui/resilient-image';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Testimonial } from '@/models/types';
import { cn } from '@/lib/utils';

interface TestimonialsDirectoryProps {
  testimonials: Testimonial[];
  locale?: string;
}

type FilterCategory = 'all' | 'featured' | 'ai' | 'saas' | 'engineering';

export function TestimonialsDirectory({ testimonials }: TestimonialsDirectoryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      // 1. Status check: STRICT GUARANTEE only approved testimonials appear
      if (item.status !== 'approved') return false;

      // 2. Category Filter
      if (activeFilter === 'featured' && !item.featured) return false;
      if (activeFilter === 'ai') {
        const isAi =
          item.service_id?.includes('ai') ||
          item.industry_id?.includes('ai') ||
          item.project_id === 'financeflow' ||
          item.review_text.toLowerCase().includes('ai') ||
          item.review_text.toLowerCase().includes('model');
        if (!isAi) return false;
      }
      if (activeFilter === 'saas') {
        const isSaas =
          item.service_id?.includes('web') ||
          item.industry_id === 'saas' ||
          item.project_id === 'pulsefit' ||
          item.project_id === 'nova-crm-saas' ||
          item.project_id === 'nova-crm' ||
          item.project_id === 'lumina-brand-strategy';
        if (!isSaas) return false;
      }
      if (activeFilter === 'engineering') {
        const isEng =
          item.service_id === 'custom-software' ||
          item.service_id === 'cloud-devops' ||
          item.project_id === 'aerosync';
        if (!isEng) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.client_name.toLowerCase().includes(q);
        const matchesCompany = item.company.toLowerCase().includes(q);
        const matchesRole = item.role.toLowerCase().includes(q);
        const matchesText = item.review_text.toLowerCase().includes(q);
        return matchesName || matchesCompany || matchesRole || matchesText;
      }

      return true;
    });
  }, [testimonials, activeFilter, searchQuery]);

  const filterTabs: { id: FilterCategory; label: string; count?: number }[] = [
    { id: 'all', label: 'All Testimonials', count: testimonials.length },
    { id: 'featured', label: 'Featured Endorsements', count: testimonials.filter((t) => t.featured).length },
    { id: 'ai', label: 'AI & Inference' },
    { id: 'saas', label: 'SaaS & Web Platforms' },
    { id: 'engineering', label: 'Custom Software & Cloud' },
  ];

  return (
    <div className="w-full">
      {/* Interactive Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/80 dark:border-white/10">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5',
                  isActive
                    ? 'filter-btn-active font-medium scale-[1.02]'
                    : 'filter-btn-gradient text-muted-foreground hover:text-foreground shadow-xs'
                )}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium',
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Real-time Search Input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, company, or keyword..."
            className="w-full px-4 py-2 rounded-xl text-xs bg-card/90 dark:bg-slate-900/85 border border-slate-200/80 dark:border-white/10 focus:border-primary focus:outline-hidden text-foreground placeholder:text-muted-foreground/60 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Approved Testimonials */}
      <AnimatePresence mode="popLayout">
        {filteredTestimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-dashed border-slate-200/80 dark:border-white/10 shadow-card"
          >
            <Quote className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-base font-medium text-foreground">No matching testimonials</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-light dark:font-normal leading-relaxed">
              Try adjusting your category filter or search query to see other verified client reviews.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTestimonials.map((item, index) => {
              const activeStars = Math.min(5, Math.max(1, Math.round(item.rating || 5)));

              return (
                <motion.div
                  key={item.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="group relative bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-primary/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  {/* Decorative background watermark */}
                  <Quote className="absolute right-6 top-6 h-16 w-16 text-primary/5 dark:text-blue-400/5 pointer-events-none group-hover:text-primary/10 transition-colors" />

                  <div>
                    {/* Top Row: Ratings & Verification Badge */}
                    <div className="flex items-center justify-between mb-5">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1" aria-label={`${activeStars} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={cn(
                              'h-4 w-4',
                              starIdx <= activeStars
                                ? 'fill-primary text-primary dark:fill-cyan-400 dark:text-cyan-400'
                                : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
                            )}
                          />
                        ))}
                      </div>

                      {/* Verified Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium skill-badge-gradient text-foreground shadow-xs">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-primary dark:text-cyan-400" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Testimonial Quote Text */}
                    <p className="text-sm sm:text-[15px] text-foreground/90 dark:text-slate-200 leading-relaxed font-light dark:font-normal mb-6">
                      &ldquo;{item.review_text}&rdquo;
                    </p>
                  </div>

                  <div>
                    {/* Associated Case Study & Service Navigation Links */}
                    {(item.project_id || item.service_id) && (
                      <div className="mb-6 pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                        {item.project_id ? (
                          <Link
                            href={`/work/case-studies/${item.project_id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors group/link"
                          >
                            <span>View Case Study</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                          </Link>
                        ) : (
                          <div />
                        )}

                        {item.service_id && (
                          <Link
                            href={`/services/${item.service_id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-foreground hover:text-primary dark:hover:text-blue-300 transition-colors skill-badge-gradient px-2.5 py-1 rounded-full shadow-xs"
                          >
                            <span>Explore Service</span>
                            <ArrowRight className="h-2.5 w-2.5" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Reviewer Bio Footer */}
                    <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center gap-3.5">
                      {/* Avatar */}
                      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 shrink-0">
                        {item.avatar ? (
                          <ResilientImage
                            src={item.avatar}
                            alt={item.client_name}
                            fill
                            sizes="44px"
                            className="object-cover"
                            fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 font-mono font-medium text-xs">
                            {item.client_name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Name, Role & Company */}
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {item.client_name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate font-light dark:font-normal">
                          {item.role && item.company ? (
                            <>
                              {item.role} • <span className="font-medium text-secondary dark:text-blue-400">{item.company}</span>
                            </>
                          ) : item.company ? (
                            <span className="font-medium text-secondary dark:text-blue-400">{item.company}</span>
                          ) : (
                            item.role || 'Client Partner'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
