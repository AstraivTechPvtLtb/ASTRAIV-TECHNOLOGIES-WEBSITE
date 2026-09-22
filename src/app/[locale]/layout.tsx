import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/providers/theme-provider';
import { TechBackground, GoogleAnalytics } from '@/views';
import { AstraivMotionProvider } from '@/providers/motion-provider';
import { getOrganizationJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    default: 'Astraiv Technologies | Premium Enterprise IT Solutions & SaaS',
    template: '%s | Astraiv Technologies',
  },
  description: 'Enterprise-grade website development, cloud infrastructure, AI solutions, and business automation built with clean architecture.',
  openGraph: {
    title: 'Astraiv Technologies',
    description: 'Enterprise-grade IT Solutions & SaaS platform built for performance.',
    url: 'https://www.astraivtechnologies.com',
    siteName: 'Astraiv Technologies',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

  const orgSchema = getOrganizationJsonLd();

  return (
    <NextIntlClientProvider messages={messages}>
      <GoogleAnalytics />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {/* Temporarily locked to Dark theme as requested */}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AstraivMotionProvider>
          <TechBackground />
          {children}
        </AstraivMotionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
