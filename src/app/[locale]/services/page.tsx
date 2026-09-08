import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Navbar, Footer, ServicesView } from '@/views';

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  await params;
  return {
    title: 'Engineering Services | Astraiv Technologies',
    description:
      'Explore Astraiv Technologies engineering services: AI & Intelligent Systems, SaaS Development, Custom Software, Enterprise Software, Web & Mobile Applications, UI/UX Design, Cloud & Infrastructure, DevOps, and Automation.',
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow z-10 relative">
        <ServicesView />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
