import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Navbar,
  Footer,
  HeroSection,
  ClientsSection,
  StatsSection,
  ServicesSection,
  WhySection,
  IndustriesSection,
  ProcessSection,
  PricingSection,
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

        {/* Highlighted Important Metrics Section before Services */}
        <StatsSection />

        {/* 3. Services */}
        <ServicesSection />

        {/* 4. Why Astraiv */}
        <WhySection />

        {/* 5. Industries */}
        <IndustriesSection />



        {/* 8. Development Process */}
        <ProcessSection />





        {/* 12. Pricing */}
        <PricingSection />




      </main>

      {/* 15. Global Footer */}
      <Footer />
    </div>
  );
}
