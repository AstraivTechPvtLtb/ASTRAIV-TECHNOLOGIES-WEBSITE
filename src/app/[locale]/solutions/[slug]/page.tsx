import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar, Footer } from '@/views';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { ArrowRight, Cpu } from 'lucide-react';
import { ROUTES } from '@/routes';
import {
  getPublishedSolutionBySlug,
  getSolutionRelationalContext,
  generateCmsMetadata,
} from '@/controllers/cms.controller';
import {
  BusinessProblemSection,
  AstraivApproachSection,
  RelatedServicesSection,
  RelevantIndustriesSection,
  RelatedCaseStudiesSection,
  SolutionCTASection,
} from '@/views/sections/relationships';
import { BreadcrumbSchema, getServiceJsonLd, createPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface SolutionDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: SolutionDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = await getPublishedSolutionBySlug(slug);

  if (!solution) {
    return createPageMetadata({
      title: 'Solution Not Found | Astraiv Technologies',
      noIndex: true,
      locale,
    });
  }

  return generateCmsMetadata({
    title: `${solution.title} | Astraiv Solutions`,
    description: solution.shortDesc,
    path: `/solutions/${solution.slug}`,
    locale,
  });
}

export default async function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const { locale, slug } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Retrieve published solution and resolved relational context from Relational CMS
  const context = await getSolutionRelationalContext(slug);

  if (!context || !context.solution) {
    notFound();
  }

  const { solution, relatedServices, relevantIndustries, relatedCaseStudies, cta } = context;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Solutions', path: '/solutions' },
          { name: solution.title, path: `/solutions/${solution.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getServiceJsonLd({
              title: solution.title,
              description: solution.shortDesc,
              path: `/solutions/${solution.slug}`,
            })
          ),
        }}
      />
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-96 right-10 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Visual Breadcrumb Trail */}
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-semibold text-slate-400">
            <Link href={ROUTES.PUBLIC.HOME} className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={ROUTES.PUBLIC.SOLUTIONS} className="hover:text-primary transition-colors">
              Solutions
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-bold truncate max-w-xs">{solution.title}</span>
          </div>

          {/* 1. SOLUTION HERO CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 sm:p-12 mb-12 shadow-2xl">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">

                <span className="px-3 py-1 text-xs font-bold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                  {solution.categoryLabel}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                  <Cpu className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {solution.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
                    {solution.tagline}
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium max-w-3xl mb-6">
                {solution.shortDesc}
              </p>

              {/* Highlight Metric Card */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
                    {solution.metric?.value || '99.9%'}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                    {solution.metric?.label || 'Production Efficiency'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/start-project?solution=${encodeURIComponent(solution.slug)}`}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>Start a Project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/contact?solution=${encodeURIComponent(solution.title)}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
                  >
                    <span>Talk to Expert</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2. THE BUSINESS PROBLEM */}
          <BusinessProblemSection
            problem={solution.businessProblem}
            solutionTitle={solution.title}
          />

          {/* 3. THE ASTRAIV APPROACH */}
          <AstraivApproachSection
            approach={solution.astraivApproach}
            capabilities={solution.capabilities}
            fullDesc={solution.fullDesc}
          />

          {/* 4. RELATED SERVICES (WHAT ASTRAIV DOES) */}
          <RelatedServicesSection
            services={relatedServices}
            solutionTitle={solution.title}
          />

          {/* 5. RELEVANT INDUSTRIES */}
          <RelevantIndustriesSection
            industries={relevantIndustries}
            title={`Industries Transformed by ${solution.title}`}
            subtitle="Vertical domains where this solution resolves high-stakes compliance, cost, and throughput bottlenecks."
          />

          {/* 6. RELATED CASE STUDIES */}
          <RelatedCaseStudiesSection
            caseStudies={relatedCaseStudies}
            title={`Case Studies Demonstrating ${solution.title}`}
            subtitle="Verified client deployments proving measurable operational ROI and technical reliability."
          />

          {/* 7. TALK TO AN EXPERT CTA */}
          <SolutionCTASection
            solutionName={solution.title}
            title={cta.title}
            subtitle={cta.subtitle}
            buttonText={cta.buttonText}
            href={cta.href}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
