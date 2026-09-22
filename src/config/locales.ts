/**
 * Supported internationalization locales for Astraiv Technologies.
 */
export const SUPPORTED_LOCALES = ['en', 'es', 'bn', 'hi', 'ar'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en';
