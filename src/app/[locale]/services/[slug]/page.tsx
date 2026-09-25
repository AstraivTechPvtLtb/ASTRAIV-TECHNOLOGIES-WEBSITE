import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Navbar, Footer } from '@/views';
import { routing } from '@/i18n/routing';
import { notFound, permanentRedirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowRight, CheckCircle2, Sparkles, Wrench, Star, Quote } from 'lucide-react';
import { ServiceIcon } from '@/views/ui/service-icon';
import {
  getPublishedServiceBySlug,
  getServiceRelationalContext,
  generateCmsMetadata,
} from '@/controllers/cms.controller';
import {
  RelatedSolutionsSection,
  RelevantIndustriesSection,
  TechnologiesSection,
  RelatedCaseStudiesSection,
  ServiceCTASection,
} from '@/views/sections/relationships';
import { ROUTES } from '@/routes';
import { BreadcrumbSchema, getServiceJsonLd, createPageMetadata } from '@/lib/seo';
import { RECLASSIFIED_SERVICES_TO_SOLUTIONS, SLUG_ALIASES } from '@/lib/services-data';

export const dynamic = 'force-dynamic';

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  const normalizedSlug = slug.toLowerCase().trim();

  const reclassifiedPath = RECLASSIFIED_SERVICES_TO_SOLUTIONS[normalizedSlug];
  if (reclassifiedPath) {
    return createPageMetadata({
      title: 'Astraiv Solutions',
      path: reclassifiedPath,
      locale,
    });
  }

  const service = await getPublishedServiceBySlug(slug);

  if (!service) {
    return createPageMetadata({
      title: 'Service Not Found | Astraiv Technologies',
      noIndex: true,
      locale,
    });
  }

  return generateCmsMetadata({
    title: `${service.title} | Astraiv Services`,
    description: service.shortDesc,
    path: `/services/${service.slug}`,
    locale,
  });
}

/**
 * Parses markdown-style headers, lists, and paragraphs into styled JSX.
 */
function renderFormattedContent(content: string) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list`} className="space-y-3 my-6 pl-2">
          {currentList.map((item, idx) => {
            const boldMatch = item.match(/^\*\*(.*?)\*\*:?\s*(.*)$/);
            return (
              <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                {boldMatch ? (
                  <span>
                    <strong className="text-white font-bold">{boldMatch[1]}: </strong>
                    {boldMatch[2]}
                  </span>
                ) : (
                  <span>{item}</span>
                )}
              </li>
            );
          })}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.replace(/^[-*]\s+/, ''));
      return;
    }

    flushList(`flush-${index}`);

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={index} className="text-lg sm:text-xl font-bold text-white tracking-tight mt-8 mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary inline-block" />
          {trimmed.replace(/^####\s+/, '')}
        </h4>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-10 mb-4 pb-2 border-b border-slate-800/80">
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-12 mb-5">
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={index} className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-normal">
          {trimmed}
        </p>
      );
    }
  });

  flushList('flush-final');

  return elements;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { locale, slug } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const normalizedSlug = slug.toLowerCase().trim();

  // Seamless permanent 308 redirect for items reclassified to Solutions
  const reclassifiedPath = RECLASSIFIED_SERVICES_TO_SOLUTIONS[normalizedSlug];
  if (reclassifiedPath) {
    permanentRedirect(`/${locale}${reclassifiedPath}`);
  }

  // Seamless permanent 308 redirect for legacy aliases
  const canonicalAlias = SLUG_ALIASES[normalizedSlug];
  if (canonicalAlias && canonicalAlias !== normalizedSlug) {
    permanentRedirect(`/${locale}/services/${canonicalAlias}`);
  }

  // Retrieve published service and resolved relational context from Relational CMS
  const context = await getServiceRelationalContext(slug);

  if (!context || !context.service) {
    notFound();
  }

  const {
    service,
    relatedSolutions,
    relevantIndustries,
    technologies,
    relatedCaseStudies,
    testimonials: serviceTestimonials,
    cta,
  } = context;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getServiceJsonLd({
              title: service.title,
              description: service.shortDesc,
              path: `/services/${service.slug}`,
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
            <Link href={ROUTES.PUBLIC.SERVICES} className="hover:text-primary transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-bold truncate max-w-xs">{service.title}</span>
          </div>

          {/* 1. SERVICE HERO CARD */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 sm:p-12 mb-12 shadow-2xl">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-extrabold bg-primary/10 text-primary rounded-full border border-primary/20 uppercase tracking-wider">
                  <Wrench className="h-3 w-3" />
                  <span>SERVICES = WHAT ASTRAIV DOES</span>
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                  {service.category}
                </span>
                {service.badge && (
                  <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    {service.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10">
                  <ServiceIcon name={service.icon} className="h-8 w-8" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {service.title}
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl border-l-2 border-primary/40 pl-4 py-1">
                {service.shortDesc}
              </p>
            </div>
          </div>

          {/* 1.1 SERVICE DETAILED ARCHITECTURE */}
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 sm:p-12 mb-12 backdrop-blur-md">
            <div className="text-slate-200">
              {renderFormattedContent(service.fullDesc)}
            </div>

            {service.features && service.features.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-5 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Core Technical Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm font-medium text-slate-200"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. RELATED SOLUTIONS (WHAT BUSINESS PROBLEMS ASTRAIV SOLVES) */}
          <RelatedSolutionsSection
            solutions={relatedSolutions}
            serviceTitle={service.title}
          />

          {/* 3. RELEVANT INDUSTRIES */}
          <RelevantIndustriesSection
            industries={relevantIndustries}
            title={`Industries Impacted by ${service.title}`}
            subtitle={`Domain verticals where our ${service.title} engineering squads solve high-stakes compliance and performance bottlenecks.`}
          />

          {/* 4. TECHNOLOGIES */}
          <TechnologiesSection
            technologies={technologies}
            title={`${service.title} Production Tech Stack`}
            subtitle="Hardened languages, frameworks, vector stores, and infrastructure tools utilized by our senior engineers."
          />

          {/* 5. RELATED CASE STUDIES */}
          <RelatedCaseStudiesSection
            caseStudies={relatedCaseStudies}
            title={`Verified Deployments Powered by ${service.title}`}
            subtitle="Production case studies demonstrating measurable ROI, sub-second latencies, and zero-downtime reliability."
          />

          {/* 5.5 VERIFIED CLIENT TESTIMONIALS FOR THIS SERVICE */}
          {serviceTestimonials && serviceTestimonials.length > 0 && (
            <section id="service-testimonials" className="mb-14 text-left">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider mb-2">
                    <Quote className="h-3 w-3" />
                    <span>Verified Client Endorsement</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    What Leaders Say About Our {service.title}
                  </h3>
                </div>
                <Link
                  href={ROUTES.PUBLIC.WORK_TESTIMONIALS}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>All Testimonials</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-1 mb-4 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-4 w-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed font-normal mb-6">
                        &ldquo;{t.review_text}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3.5">
                      {t.avatar ? (
                        <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0 border border-slate-700">
                          <Image src={t.avatar} alt={t.client_name} fill sizes="44px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-11 w-11 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs font-mono shrink-0">
                          {t.client_name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-bold text-white block">{t.client_name}</span>
                        <span className="text-xs text-slate-400">
                          {t.role} {t.company && `• ${t.company}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. START A PROJECT CTA */}
          <ServiceCTASection
            serviceName={service.title}
            title={cta.title}
            subtitle={cta.subtitle}
            buttonText={cta.buttonText || 'Start a Project'}
            href={`/start-project?source_page=${encodeURIComponent(`/services/${service.slug}`)}&service=${encodeURIComponent(service.slug)}`}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
