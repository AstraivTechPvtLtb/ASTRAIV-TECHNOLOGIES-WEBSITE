'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, ArrowRight, Sparkles, LogIn } from 'lucide-react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { NAV_ITEMS, NavItem, MegaMenuConfig } from './nav-data';
import { ROUTES, isActiveRoute } from '@/routes';
import { dropdownMenuVariants, mobileDrawerVariants, MOTION_SPRINGS } from '@/lib/motion';

export function Navbar() {
  const tNav = useTranslations('Nav');
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    setMounted(true);
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // 3-lines Custom Options Dropdown states
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const optionsDropdownRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const closeDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeOptionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (closeDropdownTimeoutRef.current) clearTimeout(closeDropdownTimeoutRef.current);
      if (closeOptionsTimeoutRef.current) clearTimeout(closeOptionsTimeoutRef.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menus on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveDropdown(null);
      setShowOptionsDropdown(false);
      setShowLangMenu(false);
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(e.target as Node)) {
        setShowOptionsDropdown(false);
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Scroll listener for header background and sizing
  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const isScrolled = window.scrollY > 15;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollState);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setIsOpen(false);
    setShowOptionsDropdown(false);
    setShowLangMenu(false);
  }, [pathname]);

  // Desktop hover intent
  const handleNavMouseEnter = (itemId: string, hasDropdown: boolean) => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
      closeDropdownTimeoutRef.current = null;
    }
    if (hasDropdown) {
      setActiveDropdown(itemId);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleNavMouseLeave = () => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // 3-lines options hover handlers
  const handleOptionsMouseEnter = () => {
    if (closeOptionsTimeoutRef.current) {
      clearTimeout(closeOptionsTimeoutRef.current);
      closeOptionsTimeoutRef.current = null;
    }
  };

  const handleOptionsMouseLeave = () => {
    if (closeOptionsTimeoutRef.current) {
      clearTimeout(closeOptionsTimeoutRef.current);
    }
    closeOptionsTimeoutRef.current = setTimeout(() => {
      setShowOptionsDropdown(false);
      setShowLangMenu(false);
    }, 200);
  };

  const handleLanguageChange = (newLocale: 'en' | 'es' | 'bn' | 'hi' | 'ar') => {
    router.replace(pathname, { locale: newLocale });
    setShowOptionsDropdown(false);
    setShowLangMenu(false);
    setIsOpen(false);
  };

  // Determine active state for each nav item
  const isItemActive = (item: NavItem) => {
    // 1. On Home page ('/' or ''), do not show any active indicating underline
    if (pathname === '/' || pathname === '') {
      return false;
    }

    // 2. Work covers /work and /portfolio
    if (item.id === 'work') {
      return (
        isActiveRoute(pathname, ROUTES.PUBLIC.WORK) ||
        isActiveRoute(pathname, ROUTES.PUBLIC.PORTFOLIO)
      );
    }

    // 3. Insights covers /insights, /blog, /technology, and /faq
    if (item.id === 'insights') {
      return (
        isActiveRoute(pathname, ROUTES.PUBLIC.INSIGHTS) ||
        isActiveRoute(pathname, ROUTES.PUBLIC.INSIGHTS_BLOG) ||
        isActiveRoute(pathname, ROUTES.PUBLIC.BLOG) ||
        isActiveRoute(pathname, ROUTES.PUBLIC.TECHNOLOGY) ||
        isActiveRoute(pathname, ROUTES.PUBLIC.FAQ)
      );
    }

    // 4. Company covers /company, /careers, and /pricing
    if (item.id === 'company') {
      return (
        isActiveRoute(pathname, ROUTES.PUBLIC.COMPANY) ||
        isActiveRoute(pathname, ROUTES.PUBLIC.CAREERS) ||
        isActiveRoute(pathname, ROUTES.PUBLIC.PRICING)
      );
    }

    // 5. Match against item's route href
    return isActiveRoute(pathname, item.href);
  };

  const getDropdownPositionClass = (itemId: string) => {
    switch (itemId) {
      case 'services':
        return '-left-4 lg:-left-6 xl:-left-8';
      case 'solutions':
        return '-left-12 lg:-left-20 xl:-left-28';
      case 'industries':
        return '-left-20 lg:-left-36 xl:-left-44';
      case 'work':
        return 'right-0 lg:-right-16 xl:-left-56';
      case 'insights':
        return 'right-0 lg:right-0 xl:-left-72';
      case 'company':
        return 'right-0';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  // Render Mega Menu or Dropdown Panel for Desktop
  const renderMegaMenu = (config?: MegaMenuConfig) => {
    if (!config) return null;

    // Group-based Mega Menus (mega-3col, mega-work, mega-insights, mega-company)
    if (
      config.type === 'mega-3col' ||
      config.type === 'mega-work' ||
      config.type === 'mega-insights' ||
      config.type === 'mega-company' ||
      config.groups
    ) {
      const isTwoCol = config.groups && config.groups.length === 2;

      return (
        <div
          className={cn(
            'rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0D1320]/95 backdrop-blur-2xl p-6 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] grid grid-cols-12 gap-6',
            isTwoCol ? 'w-[min(820px,calc(100vw-3rem))] max-w-[calc(100vw-2rem)]' : 'w-[min(920px,calc(100vw-3rem))] max-w-[calc(100vw-2rem)]'
          )}
        >
          {/* Main Groups Columns */}
          <div
            className={cn(
              'gap-5',
              isTwoCol
                ? 'col-span-8 grid grid-cols-2'
                : 'col-span-8 lg:col-span-9 grid grid-cols-3'
            )}
          >
            {config.groups?.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  {group.title}
                </div>
                <div className="flex flex-col gap-1">
                  {group.items.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setActiveDropdown(null)}
                      className="group/item flex flex-col p-2 rounded-lg hover:bg-slate-100/90 dark:hover:bg-[#172033]/80 transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-primary dark:group-hover/item:text-accent transition-colors flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1.5 flex-wrap">
                          <span>{sub.name}</span>
                          {sub.badge && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent border border-primary/20 dark:border-accent/25 shrink-0">
                              {sub.badge}
                            </span>
                          )}
                        </span>
                        <ArrowRight className="h-3 w-3 shrink-0 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-primary dark:text-accent" />
                      </span>
                      {sub.description && (
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal mt-0.5">
                          {sub.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Right Panel */}
          {config.featured && (
            <div
              className={cn(
                'rounded-xl border border-primary/15 dark:border-primary/25 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/5 p-4 flex flex-col justify-between',
                isTwoCol ? 'col-span-4' : 'col-span-4 lg:col-span-3'
              )}
            >
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-accent mb-2 px-2 py-0.5 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20">
                  <Sparkles className="h-2.5 w-2.5" />
                  Astraiv Corporate
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1.5">
                  {config.featured.tagline}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {config.featured.description}
                </p>
              </div>

              <Link
                href={config.featured.ctaHref}
                onClick={() => setActiveDropdown(null)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent hover:underline group/cta focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
              >
                <span>{config.featured.ctaLabel}</span>
                <ArrowRight className="h-3 w-3 group-hover/cta:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      );
    }

    if (config.type === 'mega-industries') {
      return (
        <div
          className="w-[min(840px,calc(100vw-3rem))] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-6 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col gap-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Industry Verticals & Domains
            </span>
            <Link
              href={ROUTES.PUBLIC.INDUSTRIES}
              onClick={() => setActiveDropdown(null)}
              className="text-xs font-bold text-primary dark:text-accent hover:underline flex items-center gap-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
            >
              <span>Explore All Industries</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {config.items?.map((sub) => (
              <Link
                key={sub.name}
                href={sub.href}
                onClick={() => setActiveDropdown(null)}
                className="group/ind p-3 rounded-xl hover:bg-slate-100/90 dark:hover:bg-slate-900/80 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60 transition-all duration-150 flex flex-col focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/ind:text-primary dark:group-hover/ind:text-accent transition-colors flex items-center justify-between">
                  <span>{sub.name}</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/ind:opacity-100 group-hover/ind:translate-x-0 transition-all text-primary dark:text-accent" />
                </span>
                {sub.description && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {sub.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // Standard Curated Dropdown
    if (config.type === 'dropdown') {
      return (
        <div
          className="w-72 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0D1320] backdrop-blur-2xl p-2 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col gap-1"
        >
          {config.items?.map((sub) => (
            <Link
              key={sub.name}
              href={sub.href}
              onClick={() => setActiveDropdown(null)}
              className="group/drop px-3 py-2.5 rounded-lg hover:bg-slate-100/90 dark:hover:bg-[#172033]/80 transition-colors flex flex-col focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover/drop:text-primary dark:group-hover/drop:text-accent transition-colors flex items-center justify-between">
                <span>{sub.name}</span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/drop:opacity-100 group-hover/drop:translate-x-0 transition-all text-primary dark:text-accent" />
              </span>
              {sub.description && (
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 group-hover/drop:text-slate-600 dark:group-hover/drop:text-slate-300 mt-0.5 line-clamp-1 leading-snug transition-colors">
                  {sub.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <header
      ref={navContainerRef}
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b backdrop-blur-2xl py-0',
        scrolled
          ? 'bg-slate-100/85 dark:bg-[#080C14]/90 border-slate-200 dark:border-white/10 shadow-md dark:shadow-[0_10px_30px_-10px_rgba(0,240,255,0.1)]'
          : 'bg-slate-100/55 dark:bg-[#080C14]/60 border-slate-200/80 dark:border-white/5 shadow-xs'
      )}
      onMouseLeave={handleNavMouseLeave}
    >
      <div
        className={cn(
          'w-full px-5 lg:px-8 xl:px-12 flex items-center justify-between transition-all duration-300',
          scrolled ? 'h-16' : 'h-20'
        )}
      >
        {/* Brand Logo */}
        <Link
          href={ROUTES.PUBLIC.HOME}
          aria-current={pathname === '/en' || pathname === '/' ? 'page' : undefined}
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground group select-none shrink-0"
        >
          <Image
            src="/logo-icon.jpg"
            alt="Astraiv Logo"
            width={34}
            height={34}
            priority
            className="rounded-full object-cover group-hover:scale-105 transition-all duration-300 ring-2 ring-primary/15 group-hover:ring-primary/40"
          />
          <div className="flex flex-col items-start leading-tight">
            <span className="font-heading font-extrabold text-[19px] tracking-wider bg-gradient-to-r from-[#0B3D91] via-[#5B5FEF] to-[#0099FF] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent pb-0.5">
              ASTRAIV
            </span>
            <span className="text-[7.5px] uppercase tracking-[0.28em] font-black text-black dark:text-white dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.85)]">
              TECHNOLOGIES
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item);
            const isDropdownOpen = activeDropdown === item.id;
            const translatedLabel = tNav.has(item.labelKey) ? tNav(item.labelKey) : item.defaultLabel;

            return (
              <div
                key={item.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleNavMouseEnter(item.id, item.hasDropdown)}
              >
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.hasDropdown) {
                      // On touch/hybrid devices, first tap opens the dropdown instead of navigating away
                      if (activeDropdown !== item.id) {
                        e.preventDefault();
                        setActiveDropdown(item.id);
                      } else {
                        setActiveDropdown(null);
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (item.hasDropdown) {
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      } else {
                        router.push(item.href);
                      }
                    } else if (e.key === 'Escape') {
                      setActiveDropdown(null);
                    }
                  }}
                  className={cn(
                    'text-[13px] font-semibold tracking-wide transition-all duration-200 relative h-full flex items-center gap-1 px-3 group/link select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 rounded-md',
                    active
                      ? 'text-primary dark:text-accent font-bold'
                      : isDropdownOpen
                      ? 'text-foreground font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-foreground'
                  )}
                  aria-current={active ? 'page' : undefined}
                  aria-expanded={item.hasDropdown ? isDropdownOpen : undefined}
                  aria-haspopup={item.hasDropdown ? 'true' : undefined}
                  aria-controls={item.hasDropdown ? `nav-dropdown-${item.id}` : undefined}
                >
                  <span>{translatedLabel}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover/link:opacity-100',
                        isDropdownOpen ? 'rotate-180 opacity-100 text-primary dark:text-accent' : ''
                      )}
                    />
                  )}

                  {/* Glowing Indicator Line at bottom border */}
                  {active && (
                    <>
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-[2.5px] rounded-full bg-gradient-to-r from-primary via-secondary to-accent dark:from-accent dark:via-primary dark:to-blue-400 z-10 shadow-[0_1px_6px_rgba(11,61,145,0.35)] dark:shadow-[0_0_12px_rgba(37,99,235,0.7)]"
                        transition={MOTION_SPRINGS.snappy}
                      />
                      <motion.span
                        layoutId="activeNavGlow"
                        className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-primary/15 via-accent/5 to-transparent dark:from-accent/25 dark:via-primary/15 dark:to-transparent blur-[8px] z-0 pointer-events-none"
                        transition={MOTION_SPRINGS.snappy}
                      />
                    </>
                  )}
                </Link>

                {/* Dropdown Container */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        id={`nav-dropdown-${item.id}`}
                        variants={dropdownMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                          'absolute top-full z-50 pt-2',
                          getDropdownPositionClass(item.id)
                        )}
                      >
                        {renderMegaMenu(item.megaMenu)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Side: Secondary Utility, Primary CTA, and Preserved 3-Lines Options Button */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 h-full">
          {/* Secondary Utility: Client Portal / Sign In */}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-slate-700 dark:text-slate-300 hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-300/80 dark:hover:border-white/10 select-none cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
            title="Client Portal / Sign In"
          >
            <LogIn className="h-3.5 w-3.5 text-primary dark:text-accent" />
            <span>{tNav.has('clientPortalSignIn') ? tNav('clientPortalSignIn') : 'Client Portal / Sign In'}</span>
          </Link>

          {/* Primary Enterprise CTA: Start a Project */}
          <Link
            href={ROUTES.PUBLIC.START_PROJECT}
            className={cn(
              'relative cursor-pointer font-bold rounded-md px-4.5 h-9 text-[12px] tracking-wide transition-all duration-200 shadow-sm inline-flex items-center justify-center gap-2 border outline-none select-none active:scale-95 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400',
              'text-white bg-[#0B3D91] hover:bg-[#082d6c] border-blue-900/20 hover:shadow-md hover:shadow-[#0B3D91]/25',
              'dark:bg-blue-600 dark:hover:bg-blue-500 dark:border-blue-400/30 dark:shadow-[0_0_16px_-2px_rgba(59,130,246,0.35)] dark:hover:shadow-[0_0_22px_-1px_rgba(59,130,246,0.55)]',
              pathname === ROUTES.PUBLIC.START_PROJECT ? 'bg-[#093275] ring-2 ring-blue-500/40 dark:bg-blue-500 dark:ring-blue-400/50' : ''
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.9)] animate-pulse" />
            <span>{tNav.has('startProject') ? tNav('startProject') : 'Start a Project'}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* Custom Options Dropdown ("three lines" - strictly preserved) */}
          <div
            ref={optionsDropdownRef}
            className="relative h-full flex items-center"
            onMouseEnter={handleOptionsMouseEnter}
            onMouseLeave={handleOptionsMouseLeave}
          >
            <button
              onClick={() => {
                setShowOptionsDropdown((prev) => {
                  if (prev) setShowLangMenu(false);
                  return !prev;
                });
              }}
              className={cn(
                'text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8 flex items-center justify-center border transition-colors select-none active:scale-95',
                showOptionsDropdown
                  ? 'bg-slate-200 text-foreground border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700'
                  : 'bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-800'
              )}
              aria-label="More Options"
              aria-expanded={showOptionsDropdown}
            >
              <Menu className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {showOptionsDropdown && (
                <motion.div
                  variants={dropdownMenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 top-full w-52 max-w-[calc(100vw-1.5rem)] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1320] backdrop-blur-xl p-2 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] z-50 text-xs flex flex-col gap-1"
                >
                  {/* Language Selector Header */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLangMenu(!showLangMenu);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs select-none active:scale-[0.99]"
                  >
                    <span>Language</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black">
                      {locale.toUpperCase()}
                    </span>
                  </button>

                  {/* Sub-menu with actual languages options */}
                  {showLangMenu && (
                    <div className="pl-2 border-l border-slate-200 dark:border-slate-800 ml-2 mt-0.5 mb-1 flex flex-col gap-1">
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer text-[11px]',
                          locale === 'en'
                            ? 'bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        )}
                      >
                        🇺🇸 English
                      </button>
                      <button
                        onClick={() => handleLanguageChange('es')}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer text-[11px]',
                          locale === 'es'
                            ? 'bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        )}
                      >
                        🇪🇸 Español
                      </button>
                      <button
                        onClick={() => handleLanguageChange('bn')}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer text-[11px]',
                          locale === 'bn'
                            ? 'bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        )}
                      >
                        🇧🇩 Bengali
                      </button>
                      <button
                        onClick={() => handleLanguageChange('hi')}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer text-[11px]',
                          locale === 'hi'
                            ? 'bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        )}
                      >
                        🇮🇳 Hindi
                      </button>
                      <button
                        onClick={() => handleLanguageChange('ar')}
                        className={cn(
                          'w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer text-[11px]',
                          locale === 'ar'
                            ? 'bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        )}
                      >
                        🇸🇦 Arabic
                      </button>
                    </div>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                  {/* Theme Toggle Slider Section */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                    }}
                    className="w-full text-left px-3 py-2 rounded-md font-semibold flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs select-none group transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Toggle theme (currently ${mounted ? (resolvedTheme === 'dark' ? 'Dark' : 'Light') : 'Theme'})`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Theme</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        {mounted ? (resolvedTheme === 'dark' ? 'Dark' : 'Light') : 'Theme'}
                      </span>
                    </div>

                    {/* Smooth sliding toggle button */}
                    <div
                      className="relative w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 flex items-center border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-inner"
                    >
                      <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                        <Sun className="h-2.5 w-2.5 text-amber-500" />
                        <Moon className="h-2.5 w-2.5 text-blue-400" />
                      </div>

                      <motion.div
                        initial={false}
                        className="relative z-10 w-4.5 h-4.5 rounded-full bg-white dark:bg-slate-950 shadow-xs flex items-center justify-center border border-slate-200 dark:border-blue-500/40"
                        animate={{
                          x: mounted && resolvedTheme === 'dark' ? 18 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 32,
                        }}
                      >
                        {mounted && resolvedTheme === 'dark' ? (
                          <Moon className="h-2.5 w-2.5 text-blue-400" />
                        ) : (
                          <Sun className="h-2.5 w-2.5 text-amber-500" />
                        )}
                      </motion.div>
                    </div>
                  </button>

                  <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                  {/* Login Link */}
                  <Link
                    href={ROUTES.AUTH.LOGIN}
                    onClick={() => setShowOptionsDropdown(false)}
                    className="w-full text-left px-3 py-2 rounded-md font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white transition-colors flex items-center justify-between cursor-pointer text-xs select-none active:scale-[0.99]"
                  >
                    <span>Client Portal</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Trigger & Theme Quick Switch */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            title="Toggle between Dark and Light mode"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            variants={mobileDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden absolute top-full left-0 w-full h-[calc(100dvh-4.5rem)] max-h-[calc(100dvh-4.5rem)] bg-white/98 dark:bg-[#080C14]/98 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto px-5 sm:px-6 py-6 flex flex-col justify-between overscroll-contain"
          >
            <div className="flex flex-col gap-1 divide-y divide-slate-100 dark:divide-slate-800/80">
              {/* Explicit Home link in mobile drawer */}
              <div className="py-2.5">
                <Link
                  href={ROUTES.PUBLIC.HOME}
                  onClick={() => setIsOpen(false)}
                  aria-current={pathname === '/en' || pathname === '/' ? 'page' : undefined}
                  className={cn(
                    'text-base font-bold transition-colors hover:text-primary block py-1.5',
                    pathname === '/en' || pathname === '/'
                      ? 'text-primary dark:text-accent'
                      : 'text-slate-800 dark:text-slate-200'
                  )}
                >
                  <span>Home</span>
                </Link>
              </div>

              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                const isExpanded = expandedMobileItem === item.id;
                const translatedLabel = tNav.has(item.labelKey) ? tNav(item.labelKey) : item.defaultLabel;

                return (
                  <div key={item.id} className="py-2.5">
                    {item.hasDropdown ? (
                      <div className="flex flex-col">
                        <div className="w-full flex items-center justify-between py-1.5">
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'text-base font-bold transition-colors hover:text-primary',
                              active
                                ? 'text-primary dark:text-accent'
                                : 'text-slate-800 dark:text-slate-200'
                            )}
                          >
                            <span>{translatedLabel}</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setExpandedMobileItem(isExpanded ? null : item.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`mobile-menu-${item.id}`}
                            aria-label={`Toggle ${translatedLabel} menu`}
                            className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center rounded-md text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                isExpanded ? 'rotate-180 text-primary dark:text-accent' : ''
                              )}
                            />
                          </button>
                        </div>

                        {/* Accordion Expandable Content */}
                        {isExpanded && item.megaMenu && (
                          <div id={`mobile-menu-${item.id}`} className="mt-2 pl-3 border-l-2 border-primary/20 dark:border-accent/20 flex flex-col gap-3 py-1 animate-fade-in">
                            {/* For 3-column mega menus */}
                            {item.megaMenu.groups &&
                              item.megaMenu.groups.map((grp) => (
                                <div key={grp.title} className="flex flex-col gap-1.5">
                                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                                    {grp.title}
                                  </span>
                                  {grp.items.map((sub) => (
                                    <Link
                                      key={sub.name}
                                      href={sub.href}
                                      onClick={() => setIsOpen(false)}
                                      className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent py-1.5 px-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-900/80 transition-colors"
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <span>{sub.name}</span>
                                        {sub.badge && (
                                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent border border-primary/20 dark:border-accent/25">
                                            {sub.badge}
                                          </span>
                                        )}
                                      </span>
                                      <ArrowRight className="h-3 w-3 opacity-40" />
                                    </Link>
                                  ))}
                                </div>
                              ))}

                            {/* For items lists (Industries, Insights, Company) */}
                            {item.megaMenu.items && (
                              <div className="flex flex-col gap-2">
                                {item.megaMenu.items.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex flex-col py-1.5 px-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-900/80 group/mitem"
                                  >
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/mitem:text-primary dark:group-hover/mitem:text-accent flex items-center justify-between">
                                      <span>{sub.name}</span>
                                      <ArrowRight className="h-3 w-3 opacity-40" />
                                    </span>
                                    {sub.description && (
                                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                        {sub.description}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            )}

                            {/* Featured CTA */}
                            {item.megaMenu.featured && (
                              <Link
                                href={item.megaMenu.featured.ctaHref}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent pt-1"
                              >
                                <span>{item.megaMenu.featured.ctaLabel}</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between text-base font-bold py-1.5',
                          active
                            ? 'text-primary dark:text-accent'
                            : 'text-slate-800 dark:text-slate-200 hover:text-primary'
                        )}
                      >
                        <span>{translatedLabel}</span>
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Bottom Utilities */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
              {/* Primary Mobile CTA: Start a Project */}
              <Link
                href={ROUTES.PUBLIC.START_PROJECT}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 select-none active:scale-[0.98]',
                  'bg-[#0B3D91] hover:bg-[#082d6c] border border-blue-900/20 shadow-sm hover:shadow-md hover:shadow-[#0B3D91]/25',
                  'dark:bg-blue-600 dark:hover:bg-blue-500 dark:border-blue-400/30 dark:shadow-[0_0_16px_-2px_rgba(59,130,246,0.35)]',
                  pathname === ROUTES.PUBLIC.START_PROJECT ? 'bg-[#093275] ring-2 ring-blue-500/40 dark:bg-blue-500 dark:ring-blue-400/50' : ''
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.9)] animate-pulse" />
                <span>{tNav.has('startProject') ? tNav('startProject') : 'Start a Project'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Secondary Mobile Utility: Client Portal / Sign In */}
              <Link
                href={ROUTES.AUTH.LOGIN}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs text-foreground bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-border/60 transition-colors select-none"
              >
                <LogIn className="h-3.5 w-3.5 text-primary dark:text-accent" />
                <span>{tNav.has('clientPortalSignIn') ? tNav('clientPortalSignIn') : 'Client Portal / Sign In'}</span>
              </Link>

              {/* Mobile Language Selector */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                  Language
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={cn(
                      'text-left px-3 py-2 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-900 cursor-pointer',
                      locale === 'en'
                        ? 'text-primary dark:text-accent font-extrabold ring-1 ring-primary/30'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    🇺🇸 English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('es')}
                    className={cn(
                      'text-left px-3 py-2 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-900 cursor-pointer',
                      locale === 'es'
                        ? 'text-primary dark:text-accent font-extrabold ring-1 ring-primary/30'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => handleLanguageChange('bn')}
                    className={cn(
                      'text-left px-3 py-2 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-900 cursor-pointer',
                      locale === 'bn'
                        ? 'text-primary dark:text-accent font-extrabold ring-1 ring-primary/30'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    🇧🇩 Bengali
                  </button>
                  <button
                    onClick={() => handleLanguageChange('hi')}
                    className={cn(
                      'text-left px-3 py-2 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-900 cursor-pointer',
                      locale === 'hi'
                        ? 'text-primary dark:text-accent font-extrabold ring-1 ring-primary/30'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    🇮🇳 Hindi
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={cn(
                      'text-left px-3 py-2 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-900 cursor-pointer col-span-2 text-center',
                      locale === 'ar'
                        ? 'text-primary dark:text-accent font-extrabold ring-1 ring-primary/30'
                        : 'text-slate-600 dark:text-slate-400'
                    )}
                  >
                    🇸🇦 Arabic
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link href="/faq" onClick={() => setIsOpen(false)} className="hover:text-foreground">
                  FAQ
                </Link>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="hover:text-foreground">
                  Client Portal
                </Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-foreground">
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
