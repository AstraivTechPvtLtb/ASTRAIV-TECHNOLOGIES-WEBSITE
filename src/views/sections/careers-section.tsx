'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import {
  Briefcase,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  MapPin,
  Clock,
  Send,
  X,
  Check,
} from 'lucide-react';
import { DynamicIcon } from '@/views/ui/dynamic-icon';
import {
  PublicCareersPageContent,
  JobCategory,
  PaginatedJobsResult,
} from '@/models/types';
import { getPaginatedPublicJobs } from '@/controllers/public-data.controller';

interface CareersSectionProps {
  content: PublicCareersPageContent;
  categories: JobCategory[];
  initialJobsData: PaginatedJobsResult;
}

const LOCATION_OPTIONS = [
  { value: 'all', label: 'All Locations' },
  { value: 'india', label: 'India · Remote' },
  { value: 'worldwide', label: 'Worldwide · Remote' },
  { value: 'us', label: 'US / Americas' },
  { value: 'europe', label: 'Europe / UK' },
  { value: 'apac', label: 'Asia-Pacific' },
];

const WORK_MODE_OPTIONS = [
  { value: 'all', label: 'All Work Modes' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on-site', label: 'On-site' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'all', label: 'All Experience' },
  { value: 'fresher', label: 'Fresher (0-1 Yr)' },
  { value: '1-3', label: '1-3 Years' },
  { value: '3+', label: '3+ Years' },
  { value: '5+', label: '5+ Years (Lead)' },
  { value: 'experienced', label: 'Experienced' },
];

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
  const urlLocation = searchParams.get('location') || 'all';
  const urlWorkMode = searchParams.get('mode') || 'all';
  const urlExperience = searchParams.get('exp') || 'all';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(urlCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>(urlLocation);
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>(urlWorkMode);
  const [selectedExperience, setSelectedExperience] = useState<string>(urlExperience);
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(urlQuery);
  const [currentPage, setCurrentPage] = useState<number>(isNaN(urlPage) || urlPage < 1 ? 1 : urlPage);

  const [jobsData, setJobsData] = useState<PaginatedJobsResult>(initialJobsData);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const isFirstRender = useRef<boolean>(true);

  const [openDropdown, setOpenDropdown] = useState<'category' | 'location' | 'mode' | 'experience' | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const filterHubRef = useRef<HTMLDivElement>(null);

  // Sync state if server initialJobsData updates
  useEffect(() => {
    setJobsData(initialJobsData);
  }, [initialJobsData]);

  // Close all filter dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterHubRef.current && !filterHubRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
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
    (
      newCategory: string,
      newQuery: string,
      newLocation: string,
      newWorkMode: string,
      newExperience: string,
      newPage: number
    ) => {
      const params = new URLSearchParams();
      if (newCategory && newCategory !== 'all') {
        params.set('category', newCategory);
      }
      if (newQuery && newQuery.trim()) {
        params.set('q', newQuery.trim());
      }
      if (newLocation && newLocation !== 'all') {
        params.set('location', newLocation);
      }
      if (newWorkMode && newWorkMode !== 'all') {
        params.set('mode', newWorkMode);
      }
      if (newExperience && newExperience !== 'all') {
        params.set('exp', newExperience);
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
    async (
      catSlug: string,
      q: string,
      loc: string,
      mode: string,
      exp: string,
      pageNum: number
    ) => {
      setIsFetching(true);
      try {
        const res = await getPaginatedPublicJobs({
          categorySlug: catSlug === 'all' ? undefined : catSlug,
          query: q || undefined,
          location: loc === 'all' ? undefined : loc,
          workMode: mode === 'all' ? undefined : mode,
          experienceLevel: exp === 'all' ? undefined : exp,
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
    fetchJobs(
      selectedCategorySlug,
      debouncedQuery,
      selectedLocation,
      selectedWorkMode,
      selectedExperience,
      currentPage
    );
    updateUrlState(
      selectedCategorySlug,
      debouncedQuery,
      selectedLocation,
      selectedWorkMode,
      selectedExperience,
      currentPage
    );
  }, [
    selectedCategorySlug,
    debouncedQuery,
    selectedLocation,
    selectedWorkMode,
    selectedExperience,
    currentPage,
    fetchJobs,
    updateUrlState,
  ]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const handleWorkModeSelect = (mode: string) => {
    setSelectedWorkMode(mode);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const handleExperienceSelect = (exp: string) => {
    setSelectedExperience(exp);
    setCurrentPage(1);
    setOpenDropdown(null);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategorySlug('all');
    setSelectedLocation('all');
    setSelectedWorkMode('all');
    setSelectedExperience('all');
    setSearchQuery('');
    setDebouncedQuery('');
    setCurrentPage(1);
    setOpenDropdown(null);
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

  const activeLocationLabel = LOCATION_OPTIONS.find((o) => o.value === selectedLocation)?.label || 'Location: All';
  const activeWorkModeLabel = WORK_MODE_OPTIONS.find((o) => o.value === selectedWorkMode)?.label || 'Mode: All';
  const activeExperienceLabel = EXPERIENCE_OPTIONS.find((o) => o.value === selectedExperience)?.label || 'Exp: All';

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
                className="p-6 sm:p-7 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-300 group flex flex-col text-left"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <DynamicIcon name={card.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light dark:font-normal">
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
            className="relative w-full aspect-16/9 min-h-[220px] sm:min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-card bg-slate-950"
          >
            <Image
              src={content.careersImage.imageUrl}
              alt={content.careersImage.altText || 'Astraiv Technologies engineering team and culture'}
              fill
              priority={false}
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1200px"
              className="object-cover object-center transition-transform duration-500 hover:scale-102"
              style={{ objectPosition: content.careersImage.focalPoint || 'center' }}
            />
          </motion.div>
        </section>
      )}

      {/* 3. Benefits Heading & Benefits Cards */}
      <section aria-label="Benefits and Culture" className="w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground tracking-tight font-heading mb-3">
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
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light dark:font-normal">
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
                className="p-6 bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl flex flex-col text-left shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors mb-4">
                  <DynamicIcon name={benefit.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light dark:font-normal">
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
            className="pb-4 border-b border-slate-200/80 dark:border-white/10 scroll-mt-32"
          >
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight font-heading text-foreground">
              {content.opportunitiesHeading}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light dark:font-normal leading-relaxed">
              {content.opportunitiesSubtitle}
            </p>
          </div>

          {/* Filtering Controls: Minimalist Glassmorphic Search & Filter Hub */}
          <div
            ref={filterHubRef}
            className="relative z-30 bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-card flex flex-col gap-4 transition-all"
          >
            {/* Section 1: Modern Integrated Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                <input
                  type="text"
                  id="careers-search-roles"
                  name="careers_search_roles"
                  aria-label="Search skills, job title, or keywords"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={content.searchPlaceholder || 'Search roles by title, technology, or skills (e.g. React, Java, AI)...'}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 focus:bg-background border border-slate-200/80 dark:border-white/10 focus:border-primary text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-primary/15 transition-all duration-200 font-light dark:font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Quick Reset Action (Only shown when any filter is active) */}
              {(selectedCategorySlug !== 'all' ||
                selectedLocation !== 'all' ||
                selectedWorkMode !== 'all' ||
                selectedExperience !== 'all' ||
                searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-10 px-3.5 rounded-xl bg-card/90 dark:bg-slate-800 text-foreground border border-slate-200/80 dark:border-white/10 hover:border-primary/40 text-xs font-medium transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95 shadow-xs"
                  title="Reset all filters"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>

            {/* Section 2: Category Roles Navigation (Horizontal segmented rail) */}
            <div className="w-full">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 -mx-1 px-1">
                {/* All Roles */}
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className={`h-8.5 px-3.5 rounded-xl text-xs font-medium shrink-0 transition-all duration-150 cursor-pointer flex items-center gap-2 select-none ${
                    selectedCategorySlug === 'all'
                      ? 'filter-btn-active font-medium scale-[1.02]'
                      : 'filter-btn-gradient text-muted-foreground hover:text-foreground shadow-xs'
                  }`}
                >
                  <span>All Roles</span>
                  <span
                    className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full ${
                      selectedCategorySlug === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
                      className={`h-8.5 px-3.5 rounded-xl text-xs font-medium shrink-0 transition-all duration-150 cursor-pointer flex items-center gap-2 select-none ${
                        isSelected
                          ? 'filter-btn-active font-medium scale-[1.02]'
                          : 'filter-btn-gradient text-muted-foreground hover:text-foreground shadow-xs'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cat.openingCount ?? 0}
                      </span>
                    </button>
                  );
                })}

                {/* More Roles Dropdown */}
                {remainingCategories.length > 0 && (
                  <div className={`relative shrink-0 ${openDropdown === 'category' ? 'z-50' : 'z-20'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                      className={`h-8.5 px-3.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 select-none ${
                        isCustomCategorySelected || openDropdown === 'category'
                          ? 'filter-btn-active font-medium scale-[1.02]'
                          : 'filter-btn-gradient text-muted-foreground hover:text-foreground shadow-xs'
                      }`}
                    >
                      <span>
                        {isCustomCategorySelected ? currentCategoryObj?.name || 'More Roles' : 'More Roles'}
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          openDropdown === 'category' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openDropdown === 'category' && (
                      <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card z-50 p-2 text-left animate-in fade-in zoom-in-95 duration-150">
                        <div className="relative mb-2 px-1 pt-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Filter categories..."
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary border border-slate-200/80 dark:border-white/10 font-light dark:font-normal"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                          {filteredDropdownCategories.length === 0 ? (
                            <p className="text-xs text-muted-foreground p-3 text-center font-light dark:font-normal">No categories found</p>
                          ) : (
                            filteredDropdownCategories.map((cat) => {
                              const isCatActive = selectedCategorySlug === cat.slug;
                              return (
                                <button
                                  key={cat.id || cat.slug}
                                  type="button"
                                  onClick={() => handleCategorySelect(cat.slug)}
                                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                    isCatActive
                                      ? 'bg-primary/10 text-primary font-medium'
                                      : 'text-foreground hover:bg-slate-100 dark:hover:bg-white/5'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    {isCatActive && <Check className="h-3.5 w-3.5 text-primary" />}
                                    <span>{cat.name}</span>
                                  </span>
                                  <span className="text-[10px] font-mono font-medium text-muted-foreground px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800">
                                    {cat.openingCount ?? 0}
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Refined Filters Toolbar (Location, Mode, Exp) */}
            <div className="pt-3.5 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[11px] font-mono font-medium tracking-wider text-muted-foreground uppercase mr-1 select-none">
                  Filters:
                </span>

                {/* Location Filter Dropdown */}
                <div className={`relative ${openDropdown === 'location' ? 'z-50' : 'z-20'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all select-none flex items-center gap-1.5 ${
                      selectedLocation !== 'all' || openDropdown === 'location'
                        ? 'bg-primary/10 text-primary border border-primary/50 font-medium ring-1 ring-primary/20 shadow-xs'
                        : 'bg-card/90 dark:bg-slate-900/85 text-slate-700 dark:text-slate-300 hover:text-foreground border border-slate-200/80 dark:border-white/10 shadow-xs'
                    }`}
                  >
                    <span>{selectedLocation === 'all' ? 'Location: All' : activeLocationLabel}</span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'location' && (
                    <div className="absolute left-0 top-full mt-1.5 w-52 rounded-2xl bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card z-50 p-1.5 text-left animate-in fade-in zoom-in-95 duration-150">
                      <div className="space-y-0.5">
                        {LOCATION_OPTIONS.map((opt) => {
                          const isLocActive = selectedLocation === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleLocationSelect(opt.value)}
                              className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                isLocActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-foreground hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isLocActive && <Check className="h-3.5 w-3.5 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Work Mode Filter Dropdown */}
                <div className={`relative ${openDropdown === 'mode' ? 'z-50' : 'z-20'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'mode' ? null : 'mode')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all select-none flex items-center gap-1.5 ${
                      selectedWorkMode !== 'all' || openDropdown === 'mode'
                        ? 'bg-primary/10 text-primary border border-primary/50 font-medium ring-1 ring-primary/20 shadow-xs'
                        : 'bg-card/90 dark:bg-slate-900/85 text-slate-700 dark:text-slate-300 hover:text-foreground border border-slate-200/80 dark:border-white/10 shadow-xs'
                    }`}
                  >
                    <span>{selectedWorkMode === 'all' ? 'Mode: All' : activeWorkModeLabel}</span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${openDropdown === 'mode' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'mode' && (
                    <div className="absolute left-0 top-full mt-1.5 w-48 rounded-2xl bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card z-50 p-1.5 text-left animate-in fade-in zoom-in-95 duration-150">
                      <div className="space-y-0.5">
                        {WORK_MODE_OPTIONS.map((opt) => {
                          const isModeActive = selectedWorkMode === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleWorkModeSelect(opt.value)}
                              className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                isModeActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-foreground hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isModeActive && <Check className="h-3.5 w-3.5 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Experience Filter Dropdown */}
                <div className={`relative ${openDropdown === 'experience' ? 'z-50' : 'z-20'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'experience' ? null : 'experience')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all select-none flex items-center gap-1.5 ${
                      selectedExperience !== 'all' || openDropdown === 'experience'
                        ? 'bg-primary/10 text-primary border border-primary/50 font-medium ring-1 ring-primary/20 shadow-xs'
                        : 'bg-card/90 dark:bg-slate-900/85 text-slate-700 dark:text-slate-300 hover:text-foreground border border-slate-200/80 dark:border-white/10 shadow-xs'
                    }`}
                  >
                    <span>{selectedExperience === 'all' ? 'Exp: All' : activeExperienceLabel}</span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'experience' && (
                    <div className="absolute left-0 top-full mt-1.5 w-52 rounded-2xl bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card z-50 p-1.5 text-left animate-in fade-in zoom-in-95 duration-150">
                      <div className="space-y-0.5">
                        {EXPERIENCE_OPTIONS.map((opt) => {
                          const isExpActive = selectedExperience === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleExperienceSelect(opt.value)}
                              className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                isExpActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-foreground hover:bg-slate-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isExpActive && <Check className="h-3.5 w-3.5 text-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Clean Results Counter */}
              <div className="text-xs text-muted-foreground font-mono font-medium select-none">
                Showing <span className="font-medium text-foreground">{jobsData.jobs.length}</span> of{' '}
                <span className="font-medium text-foreground">{jobsData.total}</span> roles
              </div>
            </div>

            {/* Section 4: Active Filter Chips Strip */}
            {(selectedCategorySlug !== 'all' ||
              selectedLocation !== 'all' ||
              selectedWorkMode !== 'all' ||
              selectedExperience !== 'all' ||
              searchQuery.trim() !== '') && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/80 dark:border-white/10 text-xs">
                <span className="text-muted-foreground font-mono font-medium text-[11px] select-none">Active Filters:</span>

                {/* Category Chip */}
                {selectedCategorySlug !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono font-medium text-[11px] border border-primary/20 shadow-2xs">
                    <span>Role: {currentCategoryObj?.name || selectedCategorySlug}</span>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('all')}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Clear role filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {/* Location Chip */}
                {selectedLocation !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono font-medium text-[11px] border border-primary/20 shadow-2xs">
                    <span>
                      Location:{' '}
                      {selectedLocation === 'india'
                        ? 'India'
                        : selectedLocation === 'worldwide'
                        ? 'Worldwide'
                        : selectedLocation === 'us'
                        ? 'USA'
                        : selectedLocation === 'europe'
                        ? 'Europe'
                        : selectedLocation === 'apac'
                        ? 'APAC'
                        : selectedLocation}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLocationSelect('all')}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Clear location filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {/* Work Mode Chip */}
                {selectedWorkMode !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono font-medium text-[11px] border border-primary/20 shadow-2xs">
                    <span>Mode: {WORK_MODE_OPTIONS.find((o) => o.value === selectedWorkMode)?.label || selectedWorkMode}</span>
                    <button
                      type="button"
                      onClick={() => handleWorkModeSelect('all')}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Clear work mode filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {/* Experience Chip */}
                {selectedExperience !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono font-medium text-[11px] border border-primary/20 shadow-2xs">
                    <span>
                      Exp:{' '}
                      {selectedExperience === 'fresher'
                        ? 'Fresher (0-1 Yr)'
                        : selectedExperience === '1-3'
                        ? '1-3 Years'
                        : selectedExperience === '3+'
                        ? '3+ Years'
                        : selectedExperience === '5+'
                        ? '5+ Years (Lead)'
                        : selectedExperience}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleExperienceSelect('all')}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Clear experience filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {/* Search Query Chip */}
                {searchQuery.trim() !== '' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono font-medium text-[11px] border border-primary/20 shadow-2xs">
                    <span>Query: &quot;{searchQuery}&quot;</span>
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Clear search query"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {/* Clear All Link */}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-mono font-medium text-primary hover:underline underline-offset-2 ml-1 cursor-pointer transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Job Openings List */}
          <div className="flex flex-col gap-4 mt-2 relative z-10 min-h-[140px]">
            {isFetching && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-2xl">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-card">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-foreground">Updating positions...</span>
                </div>
              </div>
            )}

            {jobsData.jobs.length === 0 && !isFetching ? (
              <div className="p-10 sm:p-12 bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-card">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No Roles Found Matching Criteria</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed font-light dark:font-normal">
                  {content.emptyStateCopy}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-card/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-foreground border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer shadow-xs"
                  >
                    Clear All Filters
                  </button>
                  <Link
                    href={`/contact?role=${encodeURIComponent('Speculative Candidate')}`}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
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
                    className="p-6 sm:p-7 rounded-2xl job-card-interactive flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  >
                    <div className="flex flex-col gap-3 max-w-2xl text-left">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Canonical Category Badge */}
                        <span className="text-[11px] font-mono font-medium uppercase tracking-wider px-3 py-1 rounded-full skill-badge-gradient text-foreground shadow-xs">
                          {job.department}
                        </span>

                        {/* Work Mode & Type */}
                        <span className="text-xs text-foreground font-mono font-medium flex items-center gap-1.5 px-3 py-1 rounded-full skill-badge-gradient shadow-xs">
                          <Clock className="h-3 w-3 text-primary" />
                          <span>{job.employmentType || 'Full-Time'}</span>
                        </span>

                        {/* Geographic Location & Modality */}
                        <span className="text-xs text-foreground font-mono font-medium flex items-center gap-1.5 px-3 py-1 rounded-full skill-badge-gradient shadow-xs">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{displayLocation}</span>
                        </span>

                        {/* Experience Eligibility */}
                        {job.experienceLevel && (
                          <span className="text-xs text-foreground font-mono font-medium px-3 py-1 rounded-full skill-badge-gradient shadow-xs">
                            <span>
                              {job.experienceLevel === 'Both'
                                ? 'Fresher & Exp.'
                                : job.experienceLevel === 'Fresher'
                                ? 'Fresher Eligible'
                                : job.experience || 'Experienced'}
                            </span>
                          </span>
                        )}

                        {/* Optional Genuine Compensation */}
                        {job.showSalary && job.salary && (
                          <span className="text-xs text-primary font-mono font-medium px-3 py-1 rounded-full skill-badge-gradient shadow-xs">
                            {job.salary}
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="text-lg sm:text-xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light dark:font-normal">
                        {job.description}
                      </p>

                      {/* Skills Chips */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10.5px] font-mono font-medium px-2.5 py-1 rounded-lg skill-badge-gradient text-foreground select-none shadow-2xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Posted Timestamp in Asia/Kolkata */}
                      <div className="pt-1 text-[11px] text-muted-foreground font-mono font-medium">
                        <time dateTime={timeInfo.iso}>{timeInfo.full}</time>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="shrink-0 flex items-center md:self-center">
                      <Link
                        href={`/careers/${job.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs filter-btn-active hover:scale-[1.02] shadow-xs hover:shadow-card transition-all duration-200 select-none active:scale-95 group/btn whitespace-nowrap cursor-pointer"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
              <div className="text-xs text-muted-foreground font-mono font-medium">
                Showing{' '}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * jobsData.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium text-foreground">
                  {Math.min(currentPage * jobsData.limit, jobsData.total)}
                </span>{' '}
                of <span className="font-medium text-foreground">{jobsData.total}</span> positions
              </div>

              <div className="flex items-center gap-2" role="navigation" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isFetching}
                  aria-label="Previous page"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200/80 dark:border-white/10 bg-card/90 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
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
                      className={`h-8 w-8 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-primary text-white shadow-card'
                          : 'bg-card/90 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground border border-slate-200/80 dark:border-white/10 shadow-xs'
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
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200/80 dark:border-white/10 bg-card/90 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
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
          <div className="p-8 sm:p-10 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card hover:shadow-card-hover hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
            <div className="max-w-2xl">
              {content.speculativeCta.kicker && (
                <span className="text-xs uppercase font-mono font-medium tracking-wider text-primary block mb-1">
                  {content.speculativeCta.kicker}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-medium text-foreground tracking-tight font-heading mb-2">
                {content.speculativeCta.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light dark:font-normal">
                {content.speculativeCta.body}
              </p>
            </div>
            <Link
              href={content.speculativeCta.buttonUrl || '/contact?type=speculative'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
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
