import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { ClientsSection } from '@/components/sections/clients-section';
import { ServicesSection } from '@/components/sections/services-section';
import { WhySection } from '@/components/sections/why-section';
import { IndustriesSection } from '@/components/sections/industries-section';
import { TechSection } from '@/components/sections/tech-section';
import { AiSection } from '@/components/sections/ai-section';
import { ProcessSection } from '@/components/sections/process-section';
import { CaseStudiesSection } from '@/components/sections/case-studies-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { StatsSection } from '@/components/sections/stats-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { FaqSection } from '@/components/sections/faq-section';
import { ContactSection } from '@/components/sections/contact-section';

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

        {/* 6. Technologies */}
        <TechSection />

        {/* 7. AI Expertise */}
        <AiSection />

        {/* 8. Development Process */}
        <ProcessSection />

        {/* 9. Case Studies */}
        <CaseStudiesSection />

        {/* 10. Testimonials */}
        <TestimonialsSection />

        {/* 11. Statistics */}
        <StatsSection />

        {/* 12. Pricing */}
        <PricingSection />

        {/* 13. FAQs */}
        <FaqSection />

        {/* 14. Contact Form */}
        <ContactSection />
      </main>

      {/* 15. Global Footer */}
      <Footer />
    </div>
  );
}
