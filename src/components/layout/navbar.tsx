'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  // Simply toggle languages between 'en' and 'es'
  const toggleLanguage = () => {
    const nextLocale = pathname.startsWith('/es') || pathname === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b',
        scrolled 
          ? 'bg-background/85 backdrop-blur-md border-border/40 py-3 shadow-xs' 
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground group">
          <Image
            src="/logo-icon.jpg"
            alt="Astraiv Logo"
            width={30}
            height={30}
            className="rounded-lg object-cover group-hover:scale-105 transition-transform"
          />
          <span>Astraiv</span>
        </Link>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-semibold transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA and Utilities */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-muted-foreground hover:text-foreground">
            <Globe className="h-4 w-4" />
          </Button>
          <Link href="/auth/login" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'font-semibold')}>
            Login
          </Link>
          <Link href="/auth/signup" className={cn(buttonVariants({ size: 'sm' }), 'font-semibold')}>
            Sign Up
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-muted-foreground hover:text-foreground">
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/40 py-6 px-6 flex flex-col gap-4 shadow-lg animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'text-base font-semibold py-2 transition-colors hover:text-primary border-b border-border/10',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full font-semibold')}
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className={cn(buttonVariants({ variant: 'default' }), 'w-full font-semibold')}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
