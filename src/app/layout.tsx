import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const generalSans = localFont({
  src: [
    {
      path: '../fonts/GeneralSans-Variable.woff2',
      style: 'normal',
      weight: '200 700',
    },
    {
      path: '../fonts/GeneralSans-VariableItalic.woff2',
      style: 'italic',
      weight: '200 700',
    },
  ],
  variable: '--font-primary',
  display: 'swap',
  preload: true,
  fallback: [
    'Fellix',
    'General Sans',
    'Satoshi',
    'Plus Jakarta Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Noto Sans',
    'Noto Sans Arabic',
    'Noto Sans Bengali',
    'sans-serif',
  ],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Astraiv Technologies | Premium Enterprise IT Solutions & SaaS',
    template: '%s | Astraiv Technologies',
  },
  description:
    'Enterprise-grade website development, cloud infrastructure, AI solutions, and business automation built with clean architecture.',
  metadataBase: new URL('https://www.astraivtechnologies.com'),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${generalSans.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground min-h-screen flex flex-col overflow-x-hidden`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
