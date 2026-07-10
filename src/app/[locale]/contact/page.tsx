import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ContactSection } from '@/components/sections/contact-section';
import { CircuitBackground } from '@/components/sections/circuit-background';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  
  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white flex flex-col justify-between relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      <main className="pt-24 flex-grow z-10 relative">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
