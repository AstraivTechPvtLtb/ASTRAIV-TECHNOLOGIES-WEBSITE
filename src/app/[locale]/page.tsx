import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Navbar,
  Footer,
  HeroSection,
  ClientsSection,
  StatsSection,
  ServicesSection,
  WhySection,
  TechSection,
  IndustriesSection,
  ProcessSection,
  CaseStudiesSection,
  AiSection,
  TestimonialsSection,
  FaqSection,
  ContactSection,
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
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      {/* 1. Global Navigation Header */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-hidden">
        {/* 2. Hero Section (Kept 100% as is per requirement) */}
        <HeroSection
          badgeText={t('heroBadge')}
          headline={t('heroHeadline')}
          subheadline={t('heroSubheadline')}
        />

        {/* 3. Trusted Enterprise Network */}
        <ClientsSection />

        {/* 4. Crucial Performance Metrics & Value Strip */}
        <StatsSection />

        {/* 5. Core Services with Pictures & Card Animations */}
        <ServicesSection />

        {/* 6. Why Businesses Choose AstraIV */}
        <WhySection />

        {/* 7. Categorized Technology Stack */}
        <TechSection />

        {/* 8. Industries We Serve with Picture Showcases */}
        <IndustriesSection />

        {/* 9. Execution Process & Roadmap */}
        <ProcessSection />

        {/* 10. Featured Work & Case Studies with Pictures */}
        <CaseStudiesSection />

        {/* 11. AI & Innovation Spotlight */}
        <AiSection />

        {/* 12. Client Testimonials & Leadership Endorsements */}
        <TestimonialsSection />

        {/* 13. Frequently Asked Questions */}
        <FaqSection />

        {/* 14. Final Conversion CTA & Contact Form */}
        <ContactSection />
      </main>

      {/* 15. Global Solid Enterprise Footer */}
      <Footer />
    </div>
  );
}
