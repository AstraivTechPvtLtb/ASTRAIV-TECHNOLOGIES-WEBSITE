import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Navbar, Footer, IndustriesView } from '@/views';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

interface IndustriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IndustriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Industries We Empower | Astraiv Technologies',
    description:
      'Explore Astraiv Technologies specialized engineering solutions for high-stakes industries: FinTech, HealthTech, SaaS & Technology, E-commerce, Logistics, EdTech, Professional Services, and Mission-Critical Industrial Systems.',
    path: '/industries',
    locale,
  });
}

export default async function IndustriesPage({ params }: IndustriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
        ]}
      />
      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow z-10 relative">
        <IndustriesView />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
