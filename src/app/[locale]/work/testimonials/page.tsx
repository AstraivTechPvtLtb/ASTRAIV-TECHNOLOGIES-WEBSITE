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
  ShieldCheck,
  ArrowRight,
  Sparkles,
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
      : '5.0';

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Astraiv Technologies',
    url: 'https://www.astraivtechnologies.com',
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
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
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

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Background ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-96 right-10 w-[450px] h-[350px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <Link href="/work" className="hover:text-primary transition-colors">
              Work
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-white font-bold">Testimonials</span>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 sm:p-14 mb-12 shadow-2xl text-left">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary mb-6">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>WORK • VERIFIED CLIENT ENDORSEMENTS</span>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
                Executive Endorsements &amp; Client Testimonials
              </h1>

              <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal mb-10 max-w-3xl">
                Real feedback from Chief Technology Officers, Founders, and Engineering Vice Presidents who have trusted Astraiv Technologies to architect and deliver their highest-stakes digital platforms.
              </p>

              {/* Trust Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-2xl sm:text-3xl mb-1">
                    <span>{averageRating}</span>
                    <Star className="h-5 w-5 fill-amber-400 shrink-0" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Average Client Rating</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-emerald-400 font-extrabold text-2xl sm:text-3xl mb-1">
                    100%
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Verified Client Reviews</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-blue-400 font-extrabold text-2xl sm:text-3xl mb-1">
                    99.8%
                  </div>
                  <span className="text-xs text-slate-400 font-medium">On-Time SLA Delivery</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-purple-400 font-extrabold text-2xl sm:text-3xl mb-1">
                    {totalReviews}+
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Approved Testimonials</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canonical Testimonials Directory Component */}
          <TestimonialsDirectory testimonials={testimonials} locale={locale} />

          {/* Bottom Conversion & Assurance Section */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 border border-primary/20 relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider mb-3">
                  <Sparkles className="h-3 w-3" />
                  <span>Start Your Success Story</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  Ready to engineer enterprise-grade software with guaranteed outcomes?
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  Connect with our senior technical squad to assess your architecture, establish strict SLA guardrails, and build software that earns executive praise.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full md:w-auto shrink-0">
                <Link
                  href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/work/testimonials')}` : `/start-project?source_page=${encodeURIComponent('/work/testimonials')}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-lg hover:scale-105"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={ROUTES.PUBLIC.CONTACT}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <span>Talk to an Expert</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={ROUTES.PUBLIC.CASE_STUDIES}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all"
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
