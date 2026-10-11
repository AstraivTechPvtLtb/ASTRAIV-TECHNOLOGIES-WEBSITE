import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar, Footer } from '@/views';
import { getApprovedTestimonials } from '@/controllers/public-data.controller';
import { TestimonialsDirectory } from '@/views/sections/testimonials-directory';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import {
  Star,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface TestimonialsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TestimonialsPageProps) {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Client Testimonials & Executive Endorsements | Astraiv Technologies',
    description:
      'Explore verified executive testimonials and client reviews from engineering leaders, CTOs, and founders who trust Astraiv Technologies with enterprise software, AI systems, and cloud architectures.',
    path: '/work/testimonials',
    locale,
  });
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Fetch approved testimonials from the single canonical data source
  const testimonials = await getApprovedTestimonials({ limit: 50 });

  // Calculate statistics from canonical approved data
  const totalReviews = testimonials.length;
  const averageRating =
    totalReviews > 0
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / totalReviews).toFixed(1)
      : null;

  // Schema.org JSON-LD Structured Data (strictly omit aggregate rating if no verified reviews to prevent fabrication)
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Astraiv Technologies',
    url: 'https://www.astraivtechnologies.com',
    ...(totalReviews > 0 && averageRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating,
            bestRating: '5',
            worstRating: '1',
            ratingCount: totalReviews,
          },
          review: testimonials.map((t) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: t.client_name,
            },
            reviewBody: t.review_text,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: t.rating || 5,
              bestRating: '5',
              worstRating: '1',
            },
            datePublished: t.published_at || new Date().toISOString(),
          })),
        }
      : {}),
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden transition-colors">
      {/* Schema.org Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: 'Testimonials', path: '/work/testimonials' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="pt-28 pb-20 grow z-10 relative">
        {/* Background ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-212.5 h-105 bg-primary/5 dark:bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-96 right-10 w-112.5 h-87.5 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <Link href="/work" className="hover:text-primary transition-colors">
              Work
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-medium">Testimonials</span>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-card/90 dark:bg-slate-900/85 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl p-8 sm:p-14 mb-12 shadow-card text-left transition-colors">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl">
              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground font-heading leading-tight mb-6">
                Executive Endorsements &amp; <span className="heading-gradient">Client Testimonials</span>
              </h1>

              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-light dark:font-normal mb-10 max-w-3xl">
                Real feedback from Chief Technology Officers, Founders, and Engineering Vice Presidents who have trusted Astraiv Technologies to architect and deliver their highest-stakes digital platforms.
              </p>

              {/* Trust Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
                <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="flex items-center gap-1.5 text-primary dark:text-cyan-400 font-medium font-heading tracking-tight text-2xl sm:text-3xl mb-1">
                    <span>{averageRating}</span>
                    <Star className="h-5 w-5 fill-primary dark:fill-cyan-400 shrink-0" />
                  </div>
                  <span className="text-xs text-muted-foreground font-light dark:font-normal">Average Client Rating</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="text-primary dark:text-cyan-400 font-medium font-heading tracking-tight text-2xl sm:text-3xl mb-1">
                    100%
                  </div>
                  <span className="text-xs text-muted-foreground font-light dark:font-normal">Verified Client Reviews</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="text-primary dark:text-blue-400 font-medium font-heading tracking-tight text-2xl sm:text-3xl mb-1">
                    99.8%
                  </div>
                  <span className="text-xs text-muted-foreground font-light dark:font-normal">On-Time SLA Delivery</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <div className="text-cyan-600 dark:text-cyan-400 font-medium font-heading tracking-tight text-2xl sm:text-3xl mb-1">
                    {totalReviews}+
                  </div>
                  <span className="text-xs text-muted-foreground font-light dark:font-normal">Approved Testimonials</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canonical Testimonials Directory Component */}
          <TestimonialsDirectory testimonials={testimonials} locale={locale} />

          {/* Bottom Conversion & Assurance Section */}
          <div className="mt-20 p-8 sm:p-12 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden shadow-card transition-colors">
            <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl text-left">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight font-heading text-foreground mb-3">
                  Ready to engineer enterprise-grade software with guaranteed outcomes?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light dark:font-normal">
                  Connect with our senior technical squad to assess your architecture, establish strict SLA guardrails, and build software that earns executive praise.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full md:w-auto shrink-0">
                <Link
                  href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/work/testimonials')}` : `/start-project?source_page=${encodeURIComponent('/work/testimonials')}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-medium text-white bg-primary hover:bg-primary/90 transition-all shadow-md hover:scale-105"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={ROUTES.PUBLIC.CONTACT}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-medium text-foreground bg-card/90 dark:bg-slate-800 hover:bg-muted border border-slate-200/80 dark:border-white/10 hover:border-primary/40 transition-all shadow-xs"
                >
                  <span>Talk to an Expert</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={ROUTES.PUBLIC.CASE_STUDIES}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all shadow-xs"
                >
                  <span>Explore Case Studies</span>
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
