import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/providers/theme-provider';
import { TechBackground } from '@/views';

export const metadata: Metadata = {
  title: {
    default: 'Astraiv Technologies | Premium Enterprise IT Solutions & SaaS',
    template: '%s | Astraiv Technologies',
  },
  description: 'Enterprise-grade website development, cloud infrastructure, AI solutions, and business automation built with clean architecture.',
  metadataBase: new URL('https://www.astraivtechnologies.com'),
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
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: 'vOihYvEytgm-hcOnX7P5sfCpcV1Zj3ZdfpYrXV756C4',
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

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Astraiv Technologies',
    url: 'https://www.astraivtechnologies.com',
    logo: 'https://www.astraivtechnologies.com/icon-512.png',
    image: 'https://www.astraivtechnologies.com/icon-512.png',
    description: 'Enterprise-grade website development, cloud infrastructure, AI solutions, and business automation built with clean architecture.',
  };

  return (
    <NextIntlClientProvider messages={messages}>
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
        <TechBackground />
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
