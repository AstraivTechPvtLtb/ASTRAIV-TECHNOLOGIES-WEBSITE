import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { Navbar, Footer, RelatedCaseStudiesSection } from '@/views';
import {
  RelatedSolutionsSection,
  RelatedServicesSection,
} from '@/views/sections/relationships';
import {
  getPublishedIndustryBySlug,
  getPublishedIndustries,
  getIndustryRelationalContext,
  generateCmsMetadata,
} from '@/controllers/cms.controller';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { ArrowRight, ShieldCheck, Sparkles, Activity, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/routes';
import { BreadcrumbSchema, getServiceJsonLd, createPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface IndustryDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const industry = await getPublishedIndustryBySlug(slug);

  if (!industry) {
    return createPageMetadata({
      title: 'Industry Not Found | Astraiv Technologies',
      noIndex: true,
      locale,
    });
  }

  return generateCmsMetadata({
    title: `${industry.label} Engineering Solutions | Astraiv Technologies`,
    description: industry.headline,
    path: `/industries/${industry.slug}`,
    locale,
  });
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { locale, slug } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Retrieve published industry & resolved relational context
  const context = await getIndustryRelationalContext(slug);

  if (!context || !context.industry) {
    notFound();
  }

  const { industry, relatedServices, relatedSolutions, relatedCaseStudies } = context;

  const allIndustries = await getPublishedIndustries();
  const otherIndustries = allIndustries
    .filter((ind) => ind.slug !== industry.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
          { name: industry.label, path: `/industries/${industry.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getServiceJsonLd({
              title: `${industry.label} Engineering Solutions`,
              description: industry.headline,
              path: `/industries/${industry.slug}`,
            })
          ),
        }}
      />
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Ambient background glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-96 right-10 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Visual Breadcrumb Trail */}
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-semibold text-slate-400">
            <Link href={ROUTES.PUBLIC.HOME} className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={ROUTES.PUBLIC.INDUSTRIES} className="hover:text-primary transition-colors">
              Industries
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-bold truncate max-w-xs">{industry.label}</span>
          </div>

          {/* Header Billboard */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 sm:p-12 mb-12 shadow-2xl">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="font-mono text-xs font-bold text-slate-400 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                  {industry.code}
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-primary/10 text-primary rounded-full border border-primary/20 uppercase tracking-wider">
                  Vertical Specification
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {industry.complianceBadge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
                {industry.label} Engineering
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-3xl mb-8">
                {industry.headline}
              </p>

              {/* KPI Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
                {industry.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      {kpi.value}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-1">
                      {kpi.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Industry Image Showcase */}
          <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-800/80 mb-12 shadow-xl">
            <Image
              src={industry.image}
              alt={industry.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
                {industry.statusText}
              </span>
            </div>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                <Activity className="h-4 w-4" />
                Industry Bottlenecks & Friction
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Architectural Challenge</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {industry.challenge}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Astraiv Engineering Architecture
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Engineered Solution</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {industry.solution}
              </p>
            </div>
          </div>

          {/* Strategic Architectural Pillars */}
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 sm:p-12 mb-12 backdrop-blur-md">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-8 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Strategic Engineering Pillars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {industry.pillars.map((pillar, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-primary mb-2 block font-mono">
                      0{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white mb-2">{pillar.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Production Tech Stack */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Production Stack & Enterprise Protocols
              </span>
              <div className="flex flex-wrap gap-2">
                {industry.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Relevant Solutions (Business Problems Solved in this Industry) */}
          {relatedSolutions && relatedSolutions.length > 0 && (
            <RelatedSolutionsSection
              solutions={relatedSolutions}
              serviceTitle={industry.label}
              title={`Enterprise Solutions for ${industry.label}`}
              subtitle={`Targeted business solutions architected to solve critical compliance, latency, and throughput bottlenecks in ${industry.label}.`}
            />
          )}

          {/* Relevant Services (Engineering Disciplines Deployed in this Industry) */}
          {relatedServices && relatedServices.length > 0 && (
            <RelatedServicesSection
              services={relatedServices}
              solutionTitle={industry.label}
              title={`Engineering Disciplines Deployed in ${industry.label}`}
              subtitle={`Senior software engineering squads providing specialized architectural rigor for ${industry.label}.`}
            />
          )}

          {/* Related Case Studies for this Industry */}
          {relatedCaseStudies.length > 0 && (
            <RelatedCaseStudiesSection
              caseStudies={relatedCaseStudies}
              title={`Verified Case Studies in ${industry.label}`}
              subtitle={`Explore how Astraiv engineered high-performance architectures and solved operational challenges in ${industry.label}.`}
            />
          )}

          {/* Consultation CTA Banner: Intentional Next Step */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950 border border-blue-500/30 p-8 sm:p-12 text-center my-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ARCHITECTURAL CONSULTATION</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Architecting for {industry.label}?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Schedule a consultation directly with our senior industry architects to evaluate compliance, scalability, and delivery cadence.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/start-project?industry=${encodeURIComponent(industry.label)}&source_page=${encodeURIComponent(`/industries/${industry.slug}`)}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/contact?industry=${encodeURIComponent(industry.label)}#schedule`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md font-bold text-sm transition-all duration-300 hover:scale-105"
                >
                  <MessageSquare className="h-4 w-4 text-blue-300" />
                  <span>Talk to an Expert</span>
                </Link>
                <Link
                  href={ROUTES.PUBLIC.INDUSTRIES}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold text-sm transition-colors"
                >
                  <span>All Industries</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Related Industries */}
          {otherIndustries.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-900">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Explore Other Verticals
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    See how our cross-domain engineering expertise translates across industries.
                  </p>
                </div>
                <Link
                  href={ROUTES.PUBLIC.INDUSTRIES}
                  className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>All Industries</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherIndustries.map((other) => (
                  <Link
                    key={other.slug}
                    href={ROUTES.PUBLIC.INDUSTRY_DETAIL(other.slug)}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-primary/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 mb-2 block">
                        {other.code}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors mb-2">
                        {other.label}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {other.tagline}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-primary">
                      <span>Inspect Vertical</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
