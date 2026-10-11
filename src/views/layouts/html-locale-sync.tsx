'use client';

/**
 * @file client/src/views/layouts/html-locale-sync.tsx
 * @description [VIEW] Synchronizes root <html> lang and dir attributes on route transitions.
 * Replaces raw script tags with idiomatic React 19 / Next.js lifecycle hooks.
 */

import { useEffect } from 'react';

interface HtmlLocaleSyncProps {
  locale: string;
}

export function HtmlLocaleSync({ locale }: HtmlLocaleSyncProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  return null;
}
