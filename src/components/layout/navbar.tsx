'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    const closeDropdown = () => {
      setShowDropdown(false);
      setShowLangMenu(false);
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [showDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy logic
      const sectionIds = ['services', 'why-us', 'industries', 'process', 'case-studies', 'pricing', 'contact'];
      let currentSection = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom > 180) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial load calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Why Us', href: '/#why-us' },
    { label: 'Industries', href: '/#industries' },
    { label: 'Process', href: '/#process' },
    { label: 'Portfolio', href: '/#case-studies' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  const handleLanguageChange = (newLocale: 'en' | 'es' | 'bn' | 'hi' | 'ar') => {
    router.replace(pathname, { locale: newLocale });
    setShowDropdown(false);
    setShowLangMenu(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b backdrop-blur-2xl py-0',
        scrolled 
          ? 'bg-slate-100/80 dark:bg-slate-950/85 border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-[0_10px_30px_-10px_rgba(91,95,239,0.25)]' 
          : 'bg-slate-100/50 dark:bg-slate-950/45 border-slate-200/80 dark:border-slate-800/60 shadow-md dark:shadow-[0_4px_20px_-10px_rgba(91,95,239,0.15)]'
      )}
    >
      <div className={cn("w-full pl-6 md:pl-12 pr-4 md:pr-6 flex items-center justify-between transition-all duration-300", scrolled ? "h-14" : "h-20")}>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground group">
          <Image
            src="/logo-icon.jpg"
            alt="Astraiv Logo"
            width={35}
            height={35}
            className="rounded-full object-cover group-hover:scale-105 transition-all duration-300 ring-2 ring-primary/10 group-hover:ring-primary/30"
          />
          <div className="flex flex-col items-start leading-[1.05]">
            <span className="font-heading font-extrabold text-xl tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">ASTRAIV</span>
            <span className="text-[8px] uppercase tracking-[0.28em] font-black text-black dark:text-white dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.85)] mt-0.5">TECHNOLOGIES</span>
          </div>
        </Link>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const sectionId = link.href.split('#')[1] || '';
            const isActive = activeSection === sectionId;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-semibold tracking-wide transition-all duration-300 relative h-full flex items-center hover:text-foreground',
                  isActive ? 'text-primary dark:text-accent font-semibold' : 'text-muted-foreground'
                )}
              >
                {link.label}
                {isActive && (
                  <>
                    {/* Glowing Indicator Line at bottom border */}
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-primary via-secondary to-accent z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                    {/* Soft glowing light beam rising upwards, fading to transparent */}
                    <motion.span
                      layoutId="activeGlow"
                      className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-secondary/15 via-accent/5 to-transparent dark:from-secondary/25 dark:via-accent/10 dark:to-transparent blur-[8px] z-0 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA and Utilities as separate buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Company Contact Glowing Button (Blue color in light and dark mode, smaller size) */}
          <Link href="/contact" className="relative group inline-block">
            {/* Soft glowing ambient light beam behind the button */}
            <div className={cn(
              "absolute -inset-[2px] bg-blue-500 rounded-full blur-[6px] opacity-40 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none",
              pathname === '/contact'
                ? "opacity-90 blur-[8px] scale-[1.03] animate-pulse"
                : "group-hover:animate-pulse"
            )} />
            
            {/* The main button */}
            <button
              className={cn(
                "relative cursor-pointer font-bold rounded-full px-3 h-7.5 text-[10px] uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-1 border-none outline-none select-none text-white bg-blue-600 hover:bg-blue-750 active:scale-95",
                pathname === '/contact' ? "bg-blue-700" : ""
              )}
            >
              {/* Left small glowing dot inside the button for micro-animation */}
              <span className={cn(
                "h-1 w-1 rounded-full bg-white transition-all duration-300",
                pathname === '/contact' ? "animate-ping" : "group-hover:animate-ping"
              )} />
              <span>Contact</span>
            </button>
          </Link>

          {/* Login Button */}
          <Link href="/auth/login">
            <button
              className={cn(
                "cursor-pointer font-bold rounded-full px-3.5 h-7.5 text-[10px] uppercase tracking-wider transition-all duration-300 border bg-transparent flex items-center justify-center select-none active:scale-95",
                pathname === '/auth/login'
                  ? "border-primary text-primary dark:border-accent dark:text-accent font-extrabold"
                  : "border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-850 dark:hover:border-slate-700"
              )}
            >
              Login
            </button>
          </Link>

          {/* Custom Options Dropdown ("three lines") */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-7.5 w-7.5 hover:bg-slate-250 dark:hover:bg-slate-850 flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 transition-colors select-none active:scale-95"
              aria-label="More Options"
            >
              <Menu className="h-4 w-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl p-2 shadow-xl z-50 text-xs flex flex-col gap-1">
                {/* Language Selector Header */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLangMenu(!showLangMenu);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  <span>Language</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black">{locale.toUpperCase()}</span>
                </button>

                {/* Sub-menu with actual languages options */}
                {showLangMenu && (
                  <div className="pl-2 border-l border-slate-200 dark:border-slate-800 ml-2 mt-1 mb-1 flex flex-col gap-1">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-[10px]",
                        locale === 'en' ? "text-primary dark:text-accent font-bold" : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('es')}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-[10px]",
                        locale === 'es' ? "text-primary dark:text-accent font-bold" : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      🇪🇸 Español
                    </button>
                    <button
                      onClick={() => handleLanguageChange('bn')}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-[10px]",
                        locale === 'bn' ? "text-primary dark:text-accent font-bold" : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      🇧🇩 Bengali
                    </button>
                    <button
                      onClick={() => handleLanguageChange('hi')}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-[10px]",
                        locale === 'hi' ? "text-primary dark:text-accent font-bold" : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      🇮🇳 Hindi
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ar')}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-md font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors cursor-pointer text-[10px]",
                        locale === 'ar' ? "text-primary dark:text-accent font-bold" : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      🇸🇦 Arabic
                    </button>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                {/* Theme Selector */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200"
                >
                  <span>Theme</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black flex items-center gap-1.5">
                    {mounted && resolvedTheme === 'dark' ? (
                      <>
                        <span>Dark</span>
                        <Moon className="h-3.5 w-3.5 text-primary" />
                      </>
                    ) : (
                      <>
                        <span>Light</span>
                        <Sun className="h-3.5 w-3.5 text-accent" />
                      </>
                    )}
                  </span>
                </button>

                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                {/* FAQ Link */}
                <Link
                  href="/faq"
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-3 py-2 rounded-lg font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>FAQ</span>
                </Link>


              </div>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 py-6 px-6 flex flex-col gap-4 shadow-lg animate-fade-in">
          {navLinks.map((link) => {
            const sectionId = link.href.split('#')[1] || '';
            const isActive = activeSection === sectionId;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-base font-semibold py-2 transition-colors border-b border-border/10 flex items-center justify-between',
                  isActive ? 'text-primary dark:text-accent font-semibold' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_rgba(91,95,239,0.8)] animate-pulse" />
                )}
              </Link>
            );
          })}
          <div className="flex flex-col gap-3 mt-4 border-t border-border/20 pt-4">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full font-semibold justify-center h-10')}
            >
              Login
            </Link>
            
            {/* Mobile Language Selector */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground/60 px-1">Language</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { handleLanguageChange('en'); setIsOpen(false); }}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg font-bold text-xs bg-muted/40 cursor-pointer",
                    locale === 'en' ? "text-primary dark:text-accent font-extrabold ring-1 ring-primary/20" : "text-muted-foreground"
                  )}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => { handleLanguageChange('es'); setIsOpen(false); }}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg font-bold text-xs bg-muted/40 cursor-pointer",
                    locale === 'es' ? "text-primary dark:text-accent font-extrabold ring-1 ring-primary/20" : "text-muted-foreground"
                  )}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => { handleLanguageChange('bn'); setIsOpen(false); }}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg font-bold text-xs bg-muted/40 cursor-pointer",
                    locale === 'bn' ? "text-primary dark:text-accent font-extrabold ring-1 ring-primary/20" : "text-muted-foreground"
                  )}
                >
                  🇧🇩 Bengali
                </button>
                <button
                  onClick={() => { handleLanguageChange('hi'); setIsOpen(false); }}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg font-bold text-xs bg-muted/40 cursor-pointer",
                    locale === 'hi' ? "text-primary dark:text-accent font-extrabold ring-1 ring-primary/20" : "text-muted-foreground"
                  )}
                >
                  🇮🇳 Hindi
                </button>
                <button
                  onClick={() => { handleLanguageChange('ar'); setIsOpen(false); }}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg font-bold text-xs bg-muted/40 cursor-pointer col-span-2 text-center",
                    locale === 'ar' ? "text-primary dark:text-accent font-extrabold ring-1 ring-primary/20" : "text-muted-foreground"
                  )}
                >
                  🇸🇦 Arabic
                </button>
              </div>
            </div>

            {/* Mobile FAQ Option */}
            <Link
              href="/faq"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between py-2.5 px-1 text-sm font-bold text-muted-foreground hover:text-foreground border-t border-border/15 mt-2"
            >
              <span>FAQ</span>
              <span className="text-[10px] uppercase font-bold text-accent">New</span>
            </Link>

            {/* Mobile Contact Option */}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between py-2.5 px-1 text-sm font-bold text-muted-foreground hover:text-foreground border-t border-border/15 mt-2"
            >
              <span>Contact</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
