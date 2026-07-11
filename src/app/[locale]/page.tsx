import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { ClientsSection } from '@/components/sections/clients-section';
import { ServicesSection } from '@/components/sections/services-section';
import { WhySection } from '@/components/sections/why-section';
import { IndustriesSection } from '@/components/sections/industries-section';
import { ProcessSection } from '@/components/sections/process-section';
import { PricingSection } from '@/components/sections/pricing-section';

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

      <main className="flex-1 mt-16">
        {/* 1. Hero Area */}
        <HeroSection
          badgeText={t('heroBadge')}
          headline={t('heroHeadline')}
          subheadline={t('heroSubheadline')}
        />

        {/* 2. Clients / Brands */}
        <ClientsSection />

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
