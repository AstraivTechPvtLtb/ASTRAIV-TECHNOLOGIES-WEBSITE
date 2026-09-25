'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkipLinkProps {
  targetId?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * WCAG 2.2 AA SC 2.4.1 Bypass Blocks
 * Skip to Main Content Link:
 * - Hidden visually off-screen until focused via keyboard Tab navigation
 * - Renders with high-contrast, prominent focus indicator
 * - Jumps directly to #main-content and focuses it programmatically
 */
export function SkipLink({
  targetId = 'main-content',
  className,
  children = 'Skip to main content',
}: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: false });
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]',
        'px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase',
        'bg-primary text-white shadow-2xl ring-4 ring-primary/40 dark:ring-blue-400/50',
        'border-2 border-white/20 outline-none transition-all duration-150',
        className
      )}
    >
      {children}
    </a>
  );
}
