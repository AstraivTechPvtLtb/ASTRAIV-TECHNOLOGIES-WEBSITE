import { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar, Footer, CareersConfirmationView } from '@/views';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Application Received | Astraiv Technologies Careers',
  description: 'Thank you for applying to Astraiv Technologies. Our engineering leadership is reviewing your submission.',
  robots: {
    index: false,
    follow: false,
  },
};

interface CareersConfirmationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CareersConfirmationPage({ params }: CareersConfirmationPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        <Suspense
          fallback={
            <div className="w-full min-h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          }
        >
          <CareersConfirmationView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
