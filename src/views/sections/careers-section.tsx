'use client';

import { useState, useEffect, useTransition, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  MapPin,
  Clock,
  GraduationCap,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { DynamicIcon } from '@/views/ui/dynamic-icon';
import {
  PublicCareersPageContent,
  JobCategory,
  PublicJobOpening,
  PaginatedJobsResult,
} from '@/models/types';
import { getPaginatedPublicJobs } from '@/controllers/public-data.controller';

interface CareersSectionProps {
  content: PublicCareersPageContent;
  categories: JobCategory[];
  initialJobsData: PaginatedJobsResult;
}

/**
 * Formats a UTC timestamp into Asia/Kolkata timezone with date and time.
 */
function formatKolkataTime(isoString: string | null | undefined): { full: string; iso: string } {
  if (!isoString) {
    return { full: 'Recently Posted', iso: new Date().toISOString() };
  }
  try {
    const d = new Date(isoString);
    const formatted = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
    return {
      full: `Posted ${formatted} IST`,
      iso: d.toISOString(),
    };
  } catch {
    return { full: 'Recently Posted', iso: isoString };
  }
}

export function CareersSection({
  content,
  categories,
  initialJobsData,
}: CareersSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial state from URL query parameters
  const urlCategory = searchParams.get('category') || 'all';
  const urlQuery = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(urlCategory);
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(urlQuery);
  const [currentPage, setCurrentPage] = useState<number>(isNaN(urlPage) || urlPage < 1 ? 1 : urlPage);

  const [jobsData, setJobsData] = useState<PaginatedJobsResult>(initialJobsData);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const isFirstRender = useRef<boolean>(true);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state if server initialJobsData updates
  useEffect(() => {
    setJobsData(initialJobsData);
  }, [initialJobsData]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL query state
  const updateUrlState = useCallback(
    (newCategory: string, newQuery: string, newPage: number) => {
      const params = new URLSearchParams();
      if (newCategory && newCategory !== 'all') {
        params.set('category', newCategory);
      }
      if (newQuery && newQuery.trim()) {
        params.set('q', newQuery.trim());
      }
      if (newPage > 1) {
        params.set('page', newPage.toString());
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Fetch paginated jobs when filters or page change
  const fetchJobs = useCallback(
    async (catSlug: string, q: string, pageNum: number) => {
      setIsFetching(true);
      try {
        const res = await getPaginatedPublicJobs({
          categorySlug: catSlug === 'all' ? undefined : catSlug,
          query: q || undefined,
          page: pageNum,
          limit: 5,
        });
        if (res && Array.isArray(res.jobs)) {
          setJobsData(res);
        }
      } catch (err) {
        console.error('[Client Job Fetch Error]:', err);
      } finally {
        setIsFetching(false);
      }
    },
    []
  );

  // Trigger data fetch on filter changes (skip first render since server already provided initialJobsData)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchJobs(selectedCategorySlug, debouncedQuery, currentPage);
    updateUrlState(selectedCategorySlug, debouncedQuery, currentPage);
  }, [selectedCategorySlug, debouncedQuery, currentPage, fetchJobs, updateUrlState]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategorySlug('all');
    setSearchQuery('');
    setDebouncedQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > jobsData.totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);

    // Smooth scroll to jobs directory heading without jumping to page top
    const heading = document.getElementById('open-roles-heading');
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Active public culture cards & benefits cards (sorted by orderIndex)
  const activeCultureCards = useMemo(() => {
    return (content.cultureCards || [])
      .filter((c) => c.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [content.cultureCards]);

  const activeBenefitsCards = useMemo(() => {
    return (content.benefitsCards || [])
      .filter((b) => b.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [content.benefitsCards]);

  // Scalable category controls: First 4 as shortcuts, rest inside "More Roles" dropdown
  const SHORTCUT_LIMIT = 4;
  const shortcutCategories = categories.slice(0, SHORTCUT_LIMIT);
  const remainingCategories = categories.slice(SHORTCUT_LIMIT);

  const filteredDropdownCategories = remainingCategories.filter((cat) =>
    cat.name.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  const totalOpeningsCount = categories.reduce((sum, c) => sum + (c.openingCount || 0), 0);

  // Selected category object
  const currentCategoryObj = categories.find((c) => c.slug === selectedCategorySlug);
  const isCustomCategorySelected =
    selectedCategorySlug !== 'all' && !shortcutCategories.some((c) => c.slug === selectedCategorySlug);

  return (
    <div className="w-full flex flex-col gap-16 md:gap-20">
      {/* 1. Core Culture Cards */}
      {activeCultureCards.length > 0 && (
        <section aria-label="Core Engineering Culture" className="w-full">
          <h2 className="sr-only">Core Engineering Culture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {activeCultureCards.map((card, idx) => (
              <motion.div
                key={card.title + idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="p-6 sm:p-7 rounded-2xl bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 shadow-xs hover:border-primary/40 dark:hover:border-primary/40 transition-all group flex flex-col text-left"
              >
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-primary dark:text-cyan-400 w-fit mb-4 border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <DynamicIcon name={card.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 tracking-tight group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Optional Dynamic Careers Image (Between Culture and Benefits) */}
      {content.careersImage?.enabled && content.careersImage.imageUrl && (
        <section aria-label="Astraiv Engineering Architecture" className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-16/9 rounded-3xl overflow-hidden border border-border/80 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-950"
          >
            <Image
              src={content.careersImage.imageUrl}
              alt={content.careersImage.altText || 'Astraiv Technologies engineering team and culture'}
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover transition-transform duration-500 hover:scale-102"
              style={{ objectPosition: content.careersImage.focalPoint || 'center' }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white text-xs font-semibold drop-shadow-md">
              <span className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                Astraiv Distributed Architecture Labs
              </span>
              <span className="hidden sm:inline-block text-white/80">
                High-Concurrency • Async Focus • Zero Bureaucracy
              </span>
            </div>
          </motion.div>
        </section>
      )}

      {/* 3. Benefits Heading & Benefits Cards */}
      <section aria-label="Benefits and Culture" className="w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-heading mb-3">
            {(() => {
              const rawHeading =
                typeof content.benefitsHeading === 'string'
                  ? content.benefitsHeading
                  : typeof (content.benefitsHeading as unknown as { title?: string })?.title === 'string'
                  ? `${(content.benefitsHeading as unknown as { title: string; highlightText?: string }).title} [${(content.benefitsHeading as unknown as { highlightText?: string }).highlightText || ''}]`.trim()
                  : 'Build the Future with [Elite Engineers]';

              if (rawHeading.includes('[') && rawHeading.includes(']')) {
                const before = rawHeading.split('[')[0];
                const highlight = rawHeading.split('[')[1].split(']')[0];
                const after = rawHeading.split(']')[1];
                return (
                  <>
                    {before}
                    <span className="heading-gradient">{highlight}</span>
                    {after}
                  </>
                );
              }
              return rawHeading;
            })()}
          </h2>
          {content.benefitsSubtitle && typeof content.benefitsSubtitle === 'string' && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {content.benefitsSubtitle}
            </p>
          )}
        </div>

        {activeBenefitsCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {activeBenefitsCards.map((benefit, idx) => (
              <motion.div
                key={benefit.title + idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="p-6 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl flex flex-col text-left shadow-xs hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40 transition-all group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-primary dark:text-cyan-400 shrink-0 border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors mb-4">
                  <DynamicIcon name={benefit.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                  {benefit.body}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Open Positions Directory (Server-Side Paginated 5 per page) */}
      <section id="careers" className="w-full scroll-mt-28">
        <div className="max-w-5xl mx-auto flex flex-col gap-6 text-left">
          {/* Header */}
          <div
            id="open-roles-heading"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50 scroll-mt-32"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {content.opportunitiesHeading}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {content.opportunitiesSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-cyan-400 bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/20 w-fit">
                <Sparkles className="h-3 w-3" />
                <span>
                  {jobsData.total} {jobsData.total === 1 ? 'Open Position' : 'Open Positions'}
                </span>
              </span>
            </div>
          </div>

          {/* Filtering Controls: Search, Desktop Shortcuts & More Dropdown, Compact Mobile Selector */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Desktop & Tablet Category Filter Bar */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                {/* All Roles Button */}
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategorySlug === 'all'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card dark:bg-slate-900 text-muted-foreground hover:text-foreground border border-border/70 hover:border-border'
                  }`}
                >
                  <span>All Roles</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategorySlug === 'all'
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {totalOpeningsCount}
                  </span>
                </button>

                {/* Shortcut Category Pills */}
                {shortcutCategories.map((cat) => {
                  const isSelected = selectedCategorySlug === cat.slug;
                  return (
                    <button
                      key={cat.id || cat.slug}
                      type="button"
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-card dark:bg-slate-900 text-muted-foreground hover:text-foreground border border-border/70 hover:border-border'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {cat.openingCount ?? 0}
                      </span>
                    </button>
                  );
                })}

                {/* More Roles Dropdown (For remaining categories) */}
                {remainingCategories.length > 0 && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCustomCategorySelected
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-card dark:bg-slate-900 text-muted-foreground hover:text-foreground border border-border/70 hover:border-border'
                      }`}
                    >
                      <span>
                        {isCustomCategorySelected ? currentCategoryObj?.name || 'More Roles' : 'More Roles'}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-card dark:bg-slate-950 border border-border/80 dark:border-slate-800 shadow-2xl z-50 p-2 text-left animate-in fade-in zoom-in-95 duration-150">
                        <div className="relative mb-2 px-1 pt-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Filter categories..."
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-muted/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary border border-border/40"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-1">
                          {filteredDropdownCategories.length === 0 ? (
                            <p className="text-xs text-muted-foreground p-3 text-center">No categories found</p>
                          ) : (
                            filteredDropdownCategories.map((cat) => (
                              <button
                                key={cat.id || cat.slug}
                                type="button"
                                onClick={() => handleCategorySelect(cat.slug)}
                                className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                  selectedCategorySlug === cat.slug
                                    ? 'bg-primary/10 text-primary dark:text-cyan-400 font-bold'
                                    : 'text-foreground hover:bg-muted/70'
                                }`}
                              >
                                <span>{cat.name}</span>
                                <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-md bg-muted">
                                  {cat.openingCount ?? 0}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Compact Category Select Dropdown */}
              <div className="sm:hidden flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  aria-label="Filter role category"
                  value={selectedCategorySlug}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-card dark:bg-slate-900 border border-border/70 text-xs font-bold text-foreground focus:outline-hidden focus:border-primary"
                >
                  <option value="all">All Roles ({totalOpeningsCount})</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.openingCount ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  id="careers-search-roles"
                  name="careers_search_roles"
                  aria-label="Search skills or job title"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={content.searchPlaceholder || 'Search skills, title...'}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-card dark:bg-slate-900 border border-border/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Indicators / Reset */}
            {(selectedCategorySlug !== 'all' || searchQuery.trim()) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <span>Filtered by:</span>
                {selectedCategorySlug !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-cyan-400 font-semibold text-[11px] border border-primary/20">
                    Category: {categories.find((c) => c.slug === selectedCategorySlug)?.name || selectedCategorySlug}
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-semibold text-[11px]">
                    Keyword: &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="ml-auto text-primary hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Job Openings List */}
          <div className="flex flex-col gap-4 mt-2 relative min-h-[140px]">
            {isFetching && (
              <div className="absolute inset-0 bg-background/50 dark:bg-slate-950/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card dark:bg-slate-900 border border-border shadow-md">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-foreground">Updating positions...</span>
                </div>
              </div>
            )}

            {jobsData.jobs.length === 0 && !isFetching ? (
              <div className="p-10 sm:p-12 bg-card/80 dark:bg-slate-900/70 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-3xl text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No Roles Found Matching Criteria</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed font-normal">
                  {content.emptyStateCopy}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                  <Link
                    href={`/contact?role=${encodeURIComponent('Speculative Candidate')}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Submit Speculative Application
                  </Link>
                </div>
              </div>
            ) : (
              jobsData.jobs.map((job, idx) => {
                const timeInfo = formatKolkataTime(job.publishedAt || job.createdAt);
                const displayLocation =
                  job.geographicLocation && job.workMode
                    ? `${job.geographicLocation} · ${job.workMode}`
                    : job.location || 'Worldwide · Remote';

                return (
                  <motion.div
                    key={job.id || job.slug}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.35 }}
                    className="p-6 sm:p-7 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 rounded-2xl hover:border-primary/50 dark:hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  >
                    <div className="flex flex-col gap-3 max-w-2xl text-left">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Canonical Category Badge */}
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20">
                          {job.department}
                        </span>

                        {/* Work Mode & Type */}
                        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-border/40">
                          <Clock className="h-3 w-3" />
                          <span>{job.employmentType || 'Full-Time'}</span>
                        </span>

                        {/* Geographic Location & Modality (Honest, No Top Market) */}
                        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-border/40">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{displayLocation}</span>
                        </span>

                        {/* Experience Eligibility */}
                        {job.experienceLevel && (
                          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-border/40">
                            <GraduationCap className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>
                              {job.experienceLevel === 'Both'
                                ? 'Fresher & Exp.'
                                : job.experienceLevel === 'Fresher'
                                ? 'Fresher Eligible'
                                : job.experience || 'Experienced'}
                            </span>
                          </span>
                        )}

                        {/* Optional Genuine Compensation (Only if explicitly enabled) */}
                        {job.showSalary && job.salary && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                            {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                        {job.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                        {job.description}
                      </p>

                      {/* Skills Chips */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-md bg-muted/80 text-foreground/90 border border-border/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Posted Timestamp in Asia/Kolkata */}
                      <div className="pt-1 text-[11px] text-muted-foreground/80 font-medium">
                        <time dateTime={timeInfo.iso}>{timeInfo.full}</time>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="shrink-0 flex items-center md:self-center">
                      <Link
                        href={`/careers/${job.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs hover:shadow-md transition-all duration-200 select-none active:scale-95 group/btn whitespace-nowrap"
                      >
                        <span>View Role & Apply</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* 5-Item Pagination Controls */}
          {jobsData.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
              <div className="text-xs text-muted-foreground font-medium">
                Showing{' '}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * jobsData.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-bold text-foreground">
                  {Math.min(currentPage * jobsData.limit, jobsData.total)}
                </span>{' '}
                of <span className="font-bold text-foreground">{jobsData.total}</span> positions
              </div>

              <div className="flex items-center gap-2" role="navigation" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isFetching}
                  aria-label="Previous page"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border/70 bg-card hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: jobsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isFetching}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                      aria-label={`Page ${pageNum}`}
                      className={`h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= jobsData.totalPages || isFetching}
                  aria-label="Next page"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border/70 bg-card hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Speculative Application CTA Banner */}
      {content.speculativeCta?.enabled !== false && (
        <section aria-label="Speculative Application Banner" className="max-w-6xl mx-auto w-full">
          <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-br from-card via-card/90 to-primary/10 border border-border/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
            <div className="max-w-2xl">
              {content.speculativeCta.kicker && (
                <span className="text-xs uppercase font-extrabold tracking-wider text-primary dark:text-cyan-400 block mb-1">
                  {content.speculativeCta.kicker}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mb-2">
                {content.speculativeCta.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {content.speculativeCta.body}
              </p>
            </div>
            <Link
              href={content.speculativeCta.buttonUrl || '/contact?role=Speculative%20Senior%20Architect'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{content.speculativeCta.buttonText || 'Send Speculative Application'}</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
