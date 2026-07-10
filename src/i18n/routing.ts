import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Supported locales
  locales: ['en', 'es', 'bn', 'hi', 'ar'],
  // Default locale if no match is found
  defaultLocale: 'en',
});

// Wrapped routing methods to use locales automatically
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
