'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { label: 'Contact', href: '/#contact' },
  ];

  // Simply toggle languages between 'en' and 'es'
  const toggleLanguage = () => {
    const nextLocale = pathname.startsWith('/es') || pathname === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: nextLocale });
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
      <div className={cn("w-full px-6 md:px-12 flex items-center justify-between transition-all duration-300", scrolled ? "h-14" : "h-20")}>
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

        {/* CTA and Utilities */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-muted-foreground hover:text-foreground">
            <Globe className="h-4 w-5" />
          </Button>
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
          <Link href="/auth/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-muted-foreground hover:text-foreground">
            <Globe className="h-4 w-4" />
          </Button>
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
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full font-semibold justify-center h-10')}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
