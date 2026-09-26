import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar } from '@/views/layouts/navbar';
import { Footer } from '@/views/layouts/footer';
import { PricingSection } from '@/views/sections/pricing-section';
import { FaqSection } from '@/views/sections/faq-section';
import { getPublicPricingPlans } from '@/controllers/public-data.controller';
import { DollarSign, ShieldCheck, Zap, Headphones, ArrowRight } from 'lucide-react';
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
    title: 'Transparent Pricing & Engagement Models | Astraiv Technologies',
    description:
      'Explore scalable pricing tiers for custom software engineering, Next.js web applications, enterprise AI systems, and cloud infrastructure.',
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

  const pricingPlans = await getPublicPricingPlans();

  const guarantees = [
    {
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      title: '100% IP Ownership',
      desc: 'All bespoke source code, UI designs, and database schemas transfer completely to your organization.',
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: 'No Vendor Lock-In',
      desc: 'Engineered on cloud-native standards (Next.js, PostgreSQL, AWS, Docker) you can host anywhere.',
    },
    {
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      title: 'Zero Hidden Surcharges',
      desc: 'Fixed sprint and milestone scopes with transparent deliverable acceptance criteria.',
    },
    {
      icon: <Headphones className="h-5 w-5 text-blue-500" />,
      title: 'Post-Launch Warranty',
      desc: '30 to 90 days of dedicated defect resolution and performance monitoring included.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading mb-4">
              Predictable Investment. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Institutional Quality.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Choose between focused milestone sprints or dedicated senior engineering squads. Every plan includes comprehensive architectural reviews, automated testing, and CI/CD pipelines.
            </p>
          </div>

          {/* Interactive Pricing Section */}
          <PricingSection initialPlans={pricingPlans} />

          {/* Guarantees Bar */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/10 border border-border/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
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
              className="px-6 py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md whitespace-nowrap shrink-0 hover:scale-105"
            >
              Start a Project
            </Link>
          </div>

          {/* Related FAQs */}
          <div className="mt-16">
            <FaqSection
              category="pricing"
              title="Pricing & Engagement FAQs"
              description="Clear answers regarding our billing structures, milestone acceptance, IP transfer, and SLA guarantees."
            />
          </div>

          {/* Post-FAQ Next Action Conversion Section: Never a Dead End */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-border/80 dark:border-slate-800 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">

              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Ready to Initiate Your Engineering Sprint?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Complete our interactive scoping wizard for a guaranteed 24-hour architectural assessment, or connect directly with our senior leadership.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/pricing')}` : `/start-project?source_page=${encodeURIComponent('/pricing')}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-105"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact#schedule"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-card border border-border/80 text-foreground font-bold text-xs sm:text-sm hover:border-primary/40 transition-all"
                >
                  <span>Talk to an Expert</span>
                </Link>
                <Link
                  href={ROUTES.PUBLIC.CASE_STUDIES}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
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
