'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { NAV_ITEMS, NavItem, MegaMenuConfig } from './nav-data';

export function Navbar() {
  const tNav = useTranslations('Nav');
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 3-lines Custom Options Dropdown states
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const optionsDropdownRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const closeDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeOptionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
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

  // Scroll listener & Scrollspy
  useEffect(() => {
    let ticking = false;
    const sectionIds = [
      'services',
      'why-us',
      'industries',
      'process',
      'case-studies',
      'testimonials',
      'pricing',
      'contact',
      'technologies',
      'ai-expertise',
    ];

    const updateScrollState = () => {
      const isScrolled = window.scrollY > 15;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

      let currentSection = '';
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom > 180) {
            currentSection = sectionIds[i];
            break;
          }
        }
      }
      setActiveSection((prev) => (prev !== currentSection ? currentSection : prev));
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
    if (item.id === 'services') {
      return (pathname === '/' || pathname === '') && activeSection === 'services';
    }
    if (item.id === 'solutions') {
      return (pathname === '/' || pathname === '') && (activeSection === 'services' || activeSection === 'ai-expertise');
    }
    if (item.id === 'technologies') {
      return pathname === '/technology' || activeSection === 'technologies' || activeSection === 'ai-expertise';
    }
    if (item.id === 'industries') {
      return (pathname === '/' || pathname === '') && activeSection === 'industries';
    }
    if (item.id === 'portfolio') {
      return pathname === '/portfolio' || activeSection === 'case-studies' || activeSection === 'testimonials';
    }
    if (item.id === 'insights') {
      return pathname.startsWith('/blog') || pathname === '/faq';
    }
    if (item.id === 'company') {
      return (
        (pathname === '/' || pathname === '') &&
        (activeSection === 'why-us' || activeSection === 'process' || activeSection === 'pricing')
      );
    }
    return false;
  };

  // Render Mega Menu or Dropdown Panel for Desktop
  const renderMegaMenu = (config?: MegaMenuConfig) => {
    if (!config) return null;

    if (config.type === 'mega-3col') {
      return (
        <div className="w-[880px] lg:w-[940px] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-6 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] grid grid-cols-12 gap-6">
          {/* Main 3 Columns */}
          <div className="col-span-8 lg:col-span-9 grid grid-cols-3 gap-5">
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
                      className="group/item flex flex-col p-2 rounded-lg hover:bg-slate-100/90 dark:hover:bg-slate-900/80 transition-all duration-150"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-primary dark:group-hover/item:text-accent transition-colors flex items-center justify-between">
                        <span>{sub.name}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-primary dark:text-accent" />
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
            <div className="col-span-4 lg:col-span-3 rounded-xl border border-primary/15 dark:border-primary/25 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/5 p-4 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary dark:text-accent mb-2 px-2 py-0.5 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20">
                  <Sparkles className="h-2.5 w-2.5" />
                  Enterprise IT
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
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent hover:underline group/cta"
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
        <div className="w-[780px] lg:w-[840px] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-6 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Industry Verticals & Domains
            </span>
            <Link
              href="/#industries"
              onClick={() => setActiveDropdown(null)}
              className="text-xs font-bold text-primary dark:text-accent hover:underline flex items-center gap-1"
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
                className="group/ind p-3 rounded-xl hover:bg-slate-100/90 dark:hover:bg-slate-900/80 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60 transition-all duration-150 flex flex-col"
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

    // Standard Curated Dropdown (Insights, Company)
    if (config.type === 'dropdown') {
      return (
        <div className="w-72 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-2 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col gap-1">
          {config.items?.map((sub) => (
            <Link
              key={sub.name}
              href={sub.href}
              onClick={() => setActiveDropdown(null)}
              className="group/drop px-3 py-2.5 rounded-lg hover:bg-slate-100/90 dark:hover:bg-slate-900/80 transition-colors flex flex-col"
            >
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/drop:text-primary dark:group-hover/drop:text-accent transition-colors flex items-center justify-between">
                <span>{sub.name}</span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/drop:opacity-100 group-hover/drop:translate-x-0 transition-all text-primary dark:text-accent" />
              </span>
              {sub.description && (
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 leading-snug">
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
          ? 'bg-slate-100/85 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800 shadow-md dark:shadow-[0_10px_30px_-10px_rgba(91,95,239,0.25)]'
          : 'bg-slate-100/55 dark:bg-slate-950/50 border-slate-200/80 dark:border-slate-800/60 shadow-xs'
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
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground group select-none shrink-0"
        >
          <Image
            src="/logo-icon.jpg"
            alt="AstraIV Logo"
            width={34}
            height={34}
            className="rounded-full object-cover group-hover:scale-105 transition-all duration-300 ring-2 ring-primary/15 group-hover:ring-primary/40"
          />
          <div className="flex flex-col items-start leading-tight">
            <span className="font-heading font-extrabold text-[19px] tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent pb-0.5">
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
                      // Allow toggling dropdown via click on desktop
                      if (activeDropdown === item.id) {
                        setActiveDropdown(null);
                      } else {
                        setActiveDropdown(item.id);
                      }
                    }
                  }}
                  className={cn(
                    'text-[13px] font-semibold tracking-wide transition-all duration-200 relative h-full flex items-center gap-1 px-3 group/link select-none',
                    active
                      ? 'text-primary dark:text-accent font-bold'
                      : isDropdownOpen
                      ? 'text-foreground font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-foreground'
                  )}
                  aria-expanded={item.hasDropdown ? isDropdownOpen : undefined}
                  aria-haspopup={item.hasDropdown ? 'true' : undefined}
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
                        className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-primary via-secondary to-accent z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                      <motion.span
                        layoutId="activeNavGlow"
                        className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-secondary/15 via-accent/5 to-transparent dark:from-secondary/25 dark:via-accent/10 dark:to-transparent blur-[8px] z-0 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    </>
                  )}
                </Link>

                {/* Dropdown Container */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.99 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={cn(
                          'absolute top-full z-50 pt-2',
                          item.megaMenu?.type === 'dropdown'
                            ? 'left-0'
                            : item.id === 'services'
                            ? '-left-12'
                            : item.id === 'solutions'
                            ? '-left-48'
                            : item.id === 'technologies'
                            ? '-left-64'
                            : item.id === 'industries'
                            ? '-left-48'
                            : 'left-1/2 -translate-x-1/2'
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

        {/* Right Side: CTA and Preserved 3-Lines Options Button */}
        <div className="hidden lg:flex items-center gap-3 h-full">
          {/* Primary Enterprise CTA: Let's Talk → */}
          <Link href="/contact" className="relative group inline-block">
            <button
              className={cn(
                'relative cursor-pointer font-bold rounded-md px-4.5 h-9 text-[12px] tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-2 border-none outline-none select-none text-white bg-[#0B3D91] hover:bg-[#093275] dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95',
                pathname === '/contact' ? 'bg-[#093275] dark:bg-blue-500' : ''
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
              <span>{tNav.has('letsTalk') ? tNav('letsTalk') : "Let's Talk"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
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
                  initial={{ opacity: 0, y: -2, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -2, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-2 shadow-2xl shadow-slate-900/15 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] z-50 text-xs flex flex-col gap-1"
                >
                  {/* Language Selector Header */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLangMenu(!showLangMenu);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs select-none active:scale-[0.99]"
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
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                    }}
                    className="w-full text-left px-3 py-2 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs select-none group"
                    role="button"
                    tabIndex={0}
                    aria-label="Toggle theme"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Theme</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        {mounted ? (resolvedTheme === 'dark' ? 'Dark' : 'Light') : ''}
                      </span>
                    </div>

                    {/* Smooth sliding toggle button */}
                    <div
                      className={cn(
                        'relative w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 flex items-center border cursor-pointer',
                        mounted && resolvedTheme === 'dark'
                          ? 'bg-slate-800/90 border-slate-700 shadow-inner'
                          : 'bg-slate-200/90 border-slate-300 shadow-inner'
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                        <Sun className="h-2.5 w-2.5 text-amber-500/50" />
                        <Moon className="h-2.5 w-2.5 text-cyan-400/50" />
                      </div>

                      <motion.div
                        initial={false}
                        className="relative z-10 w-4.5 h-4.5 rounded-full bg-white dark:bg-slate-950 shadow-xs flex items-center justify-center border border-slate-200/80 dark:border-cyan-500/40"
                        animate={{
                          x: mounted && resolvedTheme === 'dark' ? 18 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 32,
                        }}
                      >
                        {mounted &&
                          (resolvedTheme === 'dark' ? (
                            <Moon className="h-2.5 w-2.5 text-cyan-400" />
                          ) : (
                            <Sun className="h-2.5 w-2.5 text-amber-500" />
                          ))}
                      </motion.div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                  {/* FAQ Link */}
                  <Link
                    href="/faq"
                    onClick={() => setShowOptionsDropdown(false)}
                    className="w-full text-left px-3 py-2 rounded-md font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-between cursor-pointer text-xs select-none active:scale-[0.99]"
                  >
                    <span>FAQ</span>
                  </Link>

                  {/* Login Link */}
                  <Link
                    href="/auth/login"
                    onClick={() => setShowOptionsDropdown(false)}
                    className="w-full text-left px-3 py-2 rounded-md font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-between cursor-pointer text-xs select-none active:scale-[0.99]"
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
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            aria-label="Toggle Theme"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 4.5rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden absolute top-full left-0 w-full bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto px-6 py-6 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-1 divide-y divide-slate-100 dark:divide-slate-800/80">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                const isExpanded = expandedMobileItem === item.id;
                const translatedLabel = tNav.has(item.labelKey) ? tNav(item.labelKey) : item.defaultLabel;

                return (
                  <div key={item.id} className="py-2.5">
                    {item.hasDropdown ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => setExpandedMobileItem(isExpanded ? null : item.id)}
                          className={cn(
                            'w-full flex items-center justify-between text-left text-base font-bold transition-colors py-1.5',
                            active
                              ? 'text-primary dark:text-accent'
                              : 'text-slate-800 dark:text-slate-200'
                          )}
                        >
                          <span>{translatedLabel}</span>
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform duration-200 text-slate-400',
                              isExpanded ? 'rotate-180 text-primary dark:text-accent' : ''
                            )}
                          />
                        </button>

                        {/* Accordion Expandable Content */}
                        {isExpanded && item.megaMenu && (
                          <div className="mt-2 pl-3 border-l-2 border-primary/20 dark:border-accent/20 flex flex-col gap-3 py-1 animate-fade-in">
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
                                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent py-1"
                                    >
                                      {sub.name}
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
                                    className="flex flex-col py-1 group/mitem"
                                  >
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/mitem:text-primary dark:group-hover/mitem:text-accent">
                                      {sub.name}
                                    </span>
                                    {sub.description && (
                                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">
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
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              {/* Primary Mobile CTA */}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-[#0B3D91] hover:bg-[#093275] dark:bg-blue-600 shadow-md active:scale-98 transition-all"
              >
                <span>{tNav.has('letsTalk') ? tNav('letsTalk') : "Let's Talk"}</span>
                <ArrowRight className="h-4 w-4" />
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
