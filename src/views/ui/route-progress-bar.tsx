'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

/**
 * RouteProgressBar provides immediate top-line feedback for route transitions
 * without blocking UI or causing layout shifts.
 */
export function RouteProgressBar() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [, startTransition] = useTransition();

  // Reset navigation indicator whenever path changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    // Intercept clicks on internal links to provide instantaneous perceived feedback
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, anchor hashes, downloads, and new tabs
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        target.getAttribute('target') === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      // If navigating to the same URL, don't trigger indicator
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      startTransition(() => {
        setIsNavigating(true);
      });
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div
      role="progressbar"
      aria-label="Navigating route"
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none overflow-hidden bg-transparent"
    >
      <div className="h-full bg-gradient-to-r from-primary via-cyan-400 to-blue-500 animate-[route-progress_1.2s_ease-in-out_infinite] w-full origin-left" />
    </div>
  );
}
