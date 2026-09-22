import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Navbar, Footer, ServicesView } from '@/views';
import { getPublicActiveServices } from '@/controllers/services.controller';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Engineering Services | Astraiv Technologies',
    description:
      'Explore Astraiv Technologies engineering services: AI & Intelligent Systems, Custom Software, Web Applications, Mobile Apps, Cloud Engineering, DevOps, and UI/UX Design.',
    path: '/services',
    locale,
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const activeServices = await getPublicActiveServices();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />
      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow z-10 relative">
        <ServicesView activeServices={activeServices} />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
