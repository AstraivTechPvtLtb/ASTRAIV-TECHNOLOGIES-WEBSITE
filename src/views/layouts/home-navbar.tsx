'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll listener for header background and sizing
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Company', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Industries', href: '#industries' },
    { label: 'Insights', href: '#insights' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-border/40 shadow-xs py-3.5'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-36 sm:w-40 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/logo-full.png"
                alt="Astraiv Technologies Logo"
                fill
                priority
                className="object-contain object-left"
                sizes="160px"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-slate-800/40 border border-slate-900/5 dark:border-slate-700/40 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs lg:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-cyan-400 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-all duration-200 select-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Group */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle color theme"
                className="h-9 w-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-foreground bg-slate-100 dark:bg-slate-800/80 border border-border/60 dark:border-slate-700/60 transition-colors cursor-pointer"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </button>
            )}

            {/* Contact CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4.5 py-2 text-xs lg:text-sm font-semibold text-white bg-[#0B3D91] hover:bg-[#082a66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full transition-all duration-200 shadow-xs hover:shadow-sm select-none"
            >
              <span>Contact Us</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Actions & Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle color theme"
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-border/60"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-slate-700" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-foreground bg-card border border-border/60 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-background/95 dark:bg-slate-950/95 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col justify-between md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-1">
                Navigation
              </span>
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 text-base font-semibold text-foreground hover:text-primary dark:hover:text-cyan-400 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition-all"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </motion.a>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/40 flex flex-col gap-4">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 text-center font-bold text-sm text-white bg-[#0B3D91] dark:bg-blue-600 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <div className="text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Astraiv Technologies. All rights reserved.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
