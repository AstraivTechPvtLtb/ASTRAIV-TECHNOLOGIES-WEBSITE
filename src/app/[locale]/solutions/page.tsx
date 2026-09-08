import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Navbar, Footer, SolutionsView } from '@/views';

interface SolutionsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SolutionsPageProps): Promise<Metadata> {
  await params;
  return {
    title: 'Enterprise Solutions | Astraiv Technologies',
    description:
      'Explore Astraiv Technologies solutions: AI Agents & Automation, RAG & Knowledge Systems, Data & Analytics, SaaS Platforms, Enterprise Applications, Business Automation, System Integration, and Legacy Modernization.',
  };
}

export default async function SolutionsPage({ params }: SolutionsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow z-10 relative">
        <SolutionsView />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
