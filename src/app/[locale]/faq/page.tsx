import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FaqSection } from '@/components/sections/faq-section';

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  
  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-primary selection:text-white flex flex-col justify-between">
      <Navbar />
      <main className="pt-24 flex-grow bg-slate-900">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
