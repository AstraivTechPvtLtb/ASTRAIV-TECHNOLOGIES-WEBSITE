import { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Navbar, Footer } from '@/views';
import { ThankYouView } from '@/views/sections/start-project/thank-you-view';
import { Loader2 } from 'lucide-react';
import { createPageMetadata } from '@/lib/seo';

interface ThankYouPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ThankYouPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Thank You | Astraiv Technologies',
    description:
      'Thank you for submitting your project brief to Astraiv Technologies. Our senior solutions architects are currently reviewing your specifications.',
    path: '/thank-you',
    locale,
    noIndex: true,
  });
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="pt-24 pb-16 flex-grow z-10 relative">
        <Suspense
          fallback={
            <div className="w-full min-h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          }
        >
          <ThankYouView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
