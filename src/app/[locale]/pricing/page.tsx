import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/views/layouts/navbar';
import { Footer } from '@/views/layouts/footer';
import { PricingSection } from '@/views/sections/pricing-section';
import { FaqSection } from '@/views/sections/faq-section';
import { getPublicPricingPlans, getPublicPricingPageSettings } from '@/controllers/public-data.controller';
import { ShieldCheck, Zap, Headphones, ArrowRight, FileCheck, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 300;

interface PricingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Engagement Models & Delivery Structures | Astraiv Technologies',
    description:
      "Explore Astraiv's flexible engagement models: Fixed-Scope Projects, Ongoing Agile Development, and Maintenance & Support. Transparent scope assessments and milestone quotations.",
    path: '/pricing',
    locale,
  });
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [pricingPlans, pageSettings] = await Promise.all([
    getPublicPricingPlans(),
    getPublicPricingPageSettings(),
  ]);

  const guarantees = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary dark:text-cyan-400" />,
      title: '100% IP Ownership',
      desc: 'All bespoke source code, UI designs, and database schemas transfer completely to your organization.',
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: 'No Vendor Lock-In',
      desc: 'Engineered on cloud-native standards (Next.js, PostgreSQL, AWS, Docker) you can host anywhere.',
    },
    {
      icon: <FileCheck className="h-5 w-5 text-primary dark:text-cyan-400" />,
      title: 'Transparent Quotations',
      desc: 'Itemized milestone scopes with clear acceptance criteria and predictable commitments.',
    },
    {
      icon: <Headphones className="h-5 w-5 text-blue-500" />,
      title: 'Post-Launch Warranty',
      desc: 'Dedicated defect resolution and performance monitoring included after deployment.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Engagement Models', path: '/pricing' },
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-20 grow z-10 relative">
        {/* Ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-200 h-87.5 bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading mb-4">
              Structured for Velocity. <br />
              <span className="heading-gradient">
                Tailored to Your Scope.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Astraiv delivers custom technology services engineered around your specific product requirements. Select the engagement structure that matches your timeline and operational needs, then request a detailed architectural quotation.
            </p>
          </div>

          {/* Admin-Managed Engagement Hero Image */}
          {pageSettings.showHeroImage && pageSettings.heroImageUrl && (
            <div className="mb-10 sm:mb-14 max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 dark:border-slate-800/80 shadow-xl bg-card/40 backdrop-blur-xs aspect-16/9">
                <Image
                  src={pageSettings.heroImageUrl}
                  alt={pageSettings.heroImageAlt || 'Astraiv Technologies engineering team collaborating on system architecture and milestone roadmaps'}
                  width={pageSettings.imageWidth || 1792}
                  height={pageSettings.imageHeight || 1008}
                  priority
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.01]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                />
              </div>
            </div>
          )}

          {/* Interactive Engagement Models Section */}
          <PricingSection initialPlans={pricingPlans} />

          {/* Quotation Transparency Notice */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-card/60 dark:bg-slate-900/60 border border-border/70 dark:border-slate-800 text-center max-w-3xl mx-auto">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">How quotation works:</span> Every project is evaluated based on feature scope, external API integrations, architectural complexity, timeline urgency, and post-launch support requirements. No surprise fees or ambiguous commitments.
            </p>
          </div>

          {/* Guarantees Bar */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guarantees.map((g, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/70 dark:border-slate-800/80 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit mb-3.5 border border-border/40">
                  {g.icon}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">{g.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Enterprise Custom Scope Callout */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-linear-to-br from-card via-card/90 to-primary/10 border border-border/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-left">
              <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
                Enterprise & Large Organizations
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mt-1 mb-2">
                Need a Custom RFP or Multi-Squad Engineering Retainer?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We partner with venture-backed scaleups and mid-market enterprises requiring dedicated multi-disciplinary squads, custom SLAs, SOC-2 compliance, and legacy modernization roadmaps.
              </p>
            </div>
            <Link
              href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/pricing')}` : `/start-project?source_page=${encodeURIComponent('/pricing')}`}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md whitespace-nowrap shrink-0 hover:scale-105 cursor-pointer"
            >
              Request a Custom Proposal
            </Link>
          </div>

          {/* Related FAQs */}
          <div className="mt-16">
            <FaqSection
              category="pricing"
              title="Engagement & Quotation FAQs"
              description="Clear answers regarding our engagement models, scoping process, milestone deliverables, IP transfer, and support arrangements."
            />
          </div>

          {/* Post-FAQ Next Action Conversion Section */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-card dark:bg-card/75 border border-border/80 dark:border-border/40 text-center relative overflow-hidden shadow-card hover:shadow-card-hover transition-all">
            {/* Ambient tech accent glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading">
                Ready to Scope Your Next Engineering Milestone?
              </h3>
              <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Submit your project specifications for a structured 24-hour architectural assessment, or speak directly with our engineering leadership.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/pricing')}` : `/start-project?source_page=${encodeURIComponent('/pricing')}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-[0.98] cursor-pointer"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-background dark:bg-slate-800/90 border border-border/90 dark:border-slate-700/80 text-foreground font-bold text-xs sm:text-sm hover:bg-muted/60 dark:hover:bg-slate-800 hover:border-primary/50 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <span>Talk to an Architect</span>
                </Link>
                <Link
                  href={ROUTES.PUBLIC.CASE_STUDIES}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-primary dark:text-cyan-400 hover:text-primary/80 dark:hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                >
                  <span>Explore Case Studies &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
