import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/providers/theme-provider';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: {
    default: 'Astraiv Technologies | Premium Enterprise IT Solutions & SaaS',
    template: '%s | Astraiv Technologies',
  },
  description: 'Enterprise-grade website development, cloud infrastructure, AI solutions, and business automation built with clean architecture.',
  metadataBase: new URL('https://astraiv.com'),
  openGraph: {
    title: 'Astraiv Technologies',
    description: 'Enterprise-grade IT Solutions & SaaS platform built for performance.',
    url: 'https://astraiv.com',
    siteName: 'Astraiv Technologies',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Set the request locale for server-side API caching
  setRequestLocale(locale);

  // Load language translation bundle
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
