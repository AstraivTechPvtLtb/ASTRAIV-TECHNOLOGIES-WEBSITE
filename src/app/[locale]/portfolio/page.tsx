import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CaseStudiesSection } from '@/components/sections/case-studies-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { CircuitBackground } from '@/components/sections/circuit-background';

interface PortfolioPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  
  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white flex flex-col justify-between relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      <main className="pt-24 flex-grow z-10 relative">
        <CaseStudiesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
