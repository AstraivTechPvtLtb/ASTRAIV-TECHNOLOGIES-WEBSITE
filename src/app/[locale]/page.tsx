import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Navbar,
  Footer,
  HeroSection,
  ClientsSection,
  StatsSection,
} from '@/views';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // Set the request locale for server caching
  setRequestLocale(locale);

  // Load language bundles
  const t = await getTranslations('Home');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Headers */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Area */}
        <HeroSection
          badgeText={t('heroBadge')}
          headline={t('heroHeadline')}
          subheadline={t('heroSubheadline')}
        />

        {/* 2. Clients / Brands */}
        <ClientsSection />

        {/* Highlighted Important Metrics Section */}
        <StatsSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
