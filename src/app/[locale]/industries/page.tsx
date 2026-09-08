import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Navbar, Footer, IndustriesView } from '@/views';

interface IndustriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IndustriesPageProps): Promise<Metadata> {
  await params;
  return {
    title: 'Industries We Empower | Astraiv Technologies',
    description:
      'Explore Astraiv Technologies specialized engineering solutions for high-stakes industries: FinTech, HealthTech, SaaS & Technology, E-commerce, Logistics, EdTech, Professional Services, and Mission-Critical Industrial Systems.',
    keywords: [
      'FinTech Software Engineering',
      'HealthTech HIPAA Compliance',
      'Multi-Tenant SaaS Architecture',
      'Headless E-commerce',
      'Fleet Logistics Telematics',
      'EdTech Virtual Classrooms',
      'Enterprise Practice Automation',
      'Astraiv Technologies Industries',
    ],
    openGraph: {
      title: 'Industries We Empower | Astraiv Technologies',
      description:
        'Mission-critical software engineering architected specifically for regulated, high-velocity enterprise industry sectors.',
      type: 'website',
    },
  };
}

export default async function IndustriesPage({ params }: IndustriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
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
