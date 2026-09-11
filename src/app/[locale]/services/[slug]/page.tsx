import { setRequestLocale } from 'next-intl/server';
import { getPublicServiceBySlug, getPublicActiveServices } from '@/controllers/services.controller';
import { Navbar, Footer } from '@/views';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ServiceIcon } from '@/views/ui/service-icon';
import { ServiceCard } from '@/views/sections/service-card';
import { getServiceImage } from '@/lib/services-utils';

export const dynamic = 'force-dynamic';

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Service Not Found | Astraiv Technologies',
    };
  }

  return {
    title: `${service.title} | Astraiv Technologies`,
    description: service.shortDesc,
  };
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
            // Check if bold title exists e.g. "**Title**: Desc"
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

    // Flush any pending bullet lists before rendering headings or paragraphs
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

  // Validate locale
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Fetch service safely
  const [service, allServices] = await Promise.all([
    getPublicServiceBySlug(slug),
    getPublicActiveServices(),
  ]);

  if (!service) {
    notFound();
  }

  // Filter other related services for the bottom recommendation section
  const relatedServices = allServices
    .filter((s) => s.slug !== service.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Subtle Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-96 right-10 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Back to Services Navigation */}
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-primary transition-all duration-300 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Services</span>
          </Link>

          {/* Service Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 sm:p-12 mb-12 shadow-2xl">
            {/* Header background accents */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3.5 py-1 text-xs font-extrabold bg-primary/10 text-primary rounded-full border border-primary/20 uppercase tracking-wider">
                  {service.category || 'Engineering'}
                </span>
                {service.badge && (
                  <span className="px-3 py-1 text-xs font-bold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                    {service.badge}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400">
                  Service #{service.orderIndex}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10">
                  <ServiceIcon name={service.icon} className="h-8 w-8" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {service.title}
                </h1>
              </div>

              {/* Brief Description Callout */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-medium max-w-3xl border-l-2 border-primary/40 pl-4 py-1">
                {service.shortDesc}
              </p>
            </div>
          </div>

          {/* Main Large Description Section */}
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 sm:p-12 mb-12 backdrop-blur-md">
            <div className="text-slate-200">
              {renderFormattedContent(service.fullDesc)}
            </div>

            {/* Key Features & Capabilities Pill Grid */}
            {service.features && service.features.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-5 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Core Technical Highlights
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

          {/* Consultation / Conversion CTA Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950 border border-blue-500/30 p-8 sm:p-12 text-center my-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to engineer with our {service.title} team?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Connect directly with our senior software architects to scope your architecture, deliverables, and velocity.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 transition-all duration-300 group"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/#pricing"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-colors"
                >
                  <span>View Pricing Models</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Related / Other Services Section */}
          {relatedServices.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-900">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Explore Other Capabilities
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Discover how our integrated engineering squads accelerate your stack.
                  </p>
                </div>
                <Link
                  href="/#services"
                  className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>All Services</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {relatedServices.map((rel) => (
                  <div key={rel.id || rel.slug} className="h-full flex flex-col">
                    <ServiceCard
                      icon={<ServiceIcon name={rel.icon} className="h-5 w-5" />}
                      title={rel.title}
                      badge={rel.badge || rel.category}
                      description={rel.shortDesc}
                      href={`/services/${rel.slug}`}
                      imageSrc={getServiceImage(rel.slug, rel.icon)}
                    />
                  </div>
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
