import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar, Footer, RewardsAccoladesView } from '@/views';
import { getPublicComplianceSettings } from '@/controllers/public-data.controller';
import { getPublishedAwards, generateCmsMetadata } from '@/controllers/cms.controller';
import { getAccoladesData, type AccoladeItem } from '@/lib/accolades-data';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';

import { BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RewardsAccoladesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RewardsAccoladesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateCmsMetadata({
    title: 'Rewards, Certifications & Accolades | Astraiv Technologies',
    description:
      'Verified institutional certifications (ISO/IEC 27001, ISO 9001, SOC-2), cloud partnerships (AWS, Cloudflare), client satisfaction honors, and architectural engineering awards.',
    path: '/company/rewards-accolades',
    locale,
  });
}

export default async function RewardsAccoladesPage({ params }: RewardsAccoladesPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Fetch dynamic compliance settings and verified published awards from CMS
  const [complianceSettings, publishedAwards] = await Promise.all([
    getPublicComplianceSettings(),
    getPublishedAwards(),
  ]);

  const baseAccolades = getAccoladesData(complianceSettings);
  const accolades: AccoladeItem[] =
    publishedAwards && publishedAwards.length > 0
      ? (publishedAwards as unknown as AccoladeItem[])
      : baseAccolades;

  const isoNum = complianceSettings?.isoNumber || 'ISO 27001:2022';
  const isoLab = complianceSettings?.isoLabel !== undefined ? complianceSettings.isoLabel : 'Certified';

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Astraiv Technologies',
    url: 'https://www.astraivtechnologies.com',
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'ISO/IEC 27001:2022 Information Security Management',
        credentialCategory: 'certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'International Organization for Standardization',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'ISO 9001:2015 Quality Management System',
        credentialCategory: 'certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'International Organization for Standardization',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'SOC-2 Type II Compliance Architecture Readiness',
        credentialCategory: 'compliance',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Company', path: '/company' },
          { name: 'Rewards & Accolades', path: '/company/rewards-accolades' },
        ]}
      />
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global Navigation Header */}
      <Navbar />

      <main className="flex-grow z-10 relative">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-primary/[0.04] dark:bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-28">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8 select-none"
          >
            <Link href={ROUTES.PUBLIC.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link href={ROUTES.PUBLIC.COMPANY} className="hover:text-foreground transition-colors">
              Company
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-foreground font-semibold">Rewards & Accolades</span>
          </nav>

          {/* Hero Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">


            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight mb-6">
              Rewards, Certifications & Industry Accolades
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-normal">
              Every system engineered by Astraiv Technologies is built upon audited security governance, proven contractual SLA delivery, and recognized cloud architecture standards.
            </p>
          </div>

          {/* Quick Metrics & Operational Reliability Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 mb-12 sm:mb-16">
            <div className="p-4 sm:p-5 rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl text-left shadow-card">
              <div className="flex items-center gap-2 mb-1.5 text-sky-600 dark:text-sky-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10.5px] font-mono uppercase font-bold tracking-wider">
                  Information Security
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
                {isoNum}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{isoLab} ISMS Standard</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl text-left shadow-card">
              <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[10.5px] font-mono uppercase font-bold tracking-wider">
                  Quality Management
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
                ISO 9001:2015
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">SDLC Quality Governance</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl text-left shadow-card">
              <div className="flex items-center gap-2 mb-1.5 text-amber-600 dark:text-amber-400">
                <Lock className="h-4 w-4" />
                <span className="text-[10.5px] font-mono uppercase font-bold tracking-wider">
                  Operational SLA
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
                99.99% On-Time
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Sprint Burndown Rate</div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl text-left shadow-card">
              <div className="flex items-center gap-2 mb-1.5 text-amber-500 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10.5px] font-mono uppercase font-bold tracking-wider">
                  Client Rating
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
                5.0 / 5.0 Star
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Verified Reviews</div>
            </div>
          </div>

          {/* Genuine Claims & Data Integrity Notice */}
          <div className="mb-14 sm:mb-16 p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/20 text-left relative overflow-hidden backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 border border-cyan-500/20">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Data Integrity & Verified Claims Policy
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-400 mt-1 leading-relaxed">
                  Astraiv Technologies maintains strict regulatory transparency. All credentials, certifications, cloud technology alliances, and performance records displayed below are backed by genuine corporate audits, contractual guarantees, and authentic client reviews. We do not invent accolades, display placeholder company logos as real clients, or publish unverified certification badges.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Accolades Directory Component (Tabs for AWARDS, CERTIFICATIONS, PARTNERSHIPS, RECOGNITIONS) */}
          <RewardsAccoladesView initialAccolades={accolades} />

          {/* Bottom Conversion & Scoping Section */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-slate-950 border border-slate-800/90 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-radial from-cyan-500/[0.06] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3 block">
                Technical Governance In Practice
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-heading mb-4">
                Engineer Your Next Platform With Proven Rigor
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8">
                Ready to review our technical compliance frameworks, sample architecture diagrams, or contractual SLA models? Schedule a direct architectural discussion with our senior engineers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href={ROUTES.PUBLIC.CONTACT}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Talk to an Expert</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={ROUTES.PUBLIC.WORK_TESTIMONIALS}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  Explore Testimonials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Solid Enterprise Footer */}
      <Footer />
    </div>
  );
}
