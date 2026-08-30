import { setRequestLocale } from 'next-intl/server';
import { Navbar, Footer, FaqSection } from '@/views';

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  
  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />
      <main className="pt-24 flex-grow z-10 relative">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
