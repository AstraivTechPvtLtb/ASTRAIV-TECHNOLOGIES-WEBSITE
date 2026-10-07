import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPublicActiveServices } from '@/controllers/services.controller';
import { getFeaturedTestimonials, getPublicComplianceSettings } from '@/controllers/public-data.controller';
import { getPublicPageContent } from '@/controllers/cms.controller';
import { ROUTES } from '@/routes';
import { createPageMetadata, getWebSiteJsonLd } from '@/lib/seo';
import { Navbar } from '@/views/layouts/navbar';
import { Footer } from '@/views/layouts/footer';
import { HeroSection } from '@/views/sections/hero-section';
import { TrustStrip } from '@/views/sections/trust-strip';
import { ServicesSection } from '@/views/sections/services-section';
import { SolutionsSection } from '@/views/sections/solutions-section';
import { CaseStudiesSection } from '@/views/sections/case-studies-section';
import { IndustriesSection } from '@/views/sections/industries-section';
import { TechSection } from '@/views/sections/tech-section';
import { WhySection } from '@/views/sections/why-section';
import { ProcessSection } from '@/views/sections/process-section';
import { TestimonialsSection } from '@/views/sections/testimonials-section';
import { InsightsSection } from '@/views/sections/insights-section';
import { FinalCtaSection } from '@/views/sections/final-cta-section';

import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 0;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Astraiv Technologies | Enterprise Software Engineering & AI Solutions',
    description:
      'Enterprise-grade website development, cloud infrastructure, AI solutions, and business automation built with clean architecture.',
    path: '',
    locale,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // Set the request locale for server caching
  setRequestLocale(locale);

  // Load language bundles, active services, selected/featured approved testimonials (3 items), compliance/ISO settings, and dynamic homepage content
  const [t, services, reviews, complianceSettings, dynamicPage, dynamicProcess] = await Promise.all([
    getTranslations('Home'),
    getPublicActiveServices(),
    getFeaturedTestimonials(3),
    getPublicComplianceSettings(),
    getPublicPageContent('homepage'),
    getPublicPageContent('process'),
  ]);

  const sec = (dynamicPage?.sections as Record<string, string>) || {};
  const headline = sec.heroHeadline?.trim() || t('heroHeadline');
  const subheadline = sec.heroSubheadline?.trim() || t('heroSubheadline');
  const ctaText = sec.primaryCtaText?.trim() || 'Start a Project';
  const ctaHref = sec.primaryCtaUrl?.trim() || ROUTES.PUBLIC.START_PROJECT;
  const secondaryCtaText = sec.secondaryCtaText?.trim() || 'Explore Case Studies';
  const secondaryCtaHref = sec.secondaryCtaUrl?.trim() || ROUTES.PUBLIC.CASE_STUDIES;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteJsonLd(locale)) }}
      />
      {/* Global Navigation Header */}
      <Navbar />

      <main id="main-content" className="flex-1 w-full overflow-x-hidden">
        {/* 1. HERO */}
        <HeroSection
          headline={headline}
          subheadline={subheadline}
          ctaText={ctaText}
          ctaHref={ctaHref}
          secondaryCtaText={secondaryCtaText}
          secondaryCtaHref={secondaryCtaHref}
        />

        {/* 2. TRUST / REWARDS & ACCOLADES */}
        <TrustStrip initialSettings={complianceSettings} />

        {/* 3. SERVICES */}
        <ServicesSection initialServices={services} />

        {/* 4. SOLUTIONS */}
        <SolutionsSection />

        {/* 5. FEATURED CASE STUDIES */}
        <CaseStudiesSection />

        {/* 6. INDUSTRIES */}
        <IndustriesSection />

        {/* 7. TECHNOLOGIES SUMMARY */}
        <TechSection />

        {/* 8. WHY ASTRAIV (Summary Variant) */}
        <WhySection variant="summary" />

        {/* 9. OUR PROCESS (Summary Variant) */}
        <ProcessSection
          variant="summary"
          headline={((dynamicProcess?.sections as Record<string, string>)?.headline || (dynamicProcess?.sections as Record<string, string>)?.processHeadline)?.trim()}
        />

        {/* 9. TESTIMONIALS */}
        <TestimonialsSection initialReviews={reviews} />

        {/* 10. LATEST INSIGHTS */}
        <InsightsSection />

        {/* 11. FINAL CONVERSION CTA */}
        <FinalCtaSection />
      </main>

      {/* 12. FOOTER */}
      <Footer />
    </div>
  );
}
