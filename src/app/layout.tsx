import type { Metadata } from 'next';
import { Geist, Plus_Jakarta_Sans, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
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
        className={`${geist.variable} ${plusJakartaSans.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
