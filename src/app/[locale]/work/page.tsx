import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Navbar, Footer, CaseStudiesSection, TestimonialsSection, ContactSection } from '@/views';
import { getPublicApprovedReviews } from '@/controllers/public-data.controller';
import { Briefcase, ArrowRight, Star, Layers, ShieldCheck, Code2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface WorkPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Enterprise Work & Client Endorsements | Astraiv Technologies',
    description:
      'Explore Astraiv Technologies proven track record: production enterprise case studies, cloud platforms, and verified client testimonials from founders and engineering leaders.',
    path: '/work',
    locale,
  });
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const reviews = await getPublicApprovedReviews();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ]}
      />
      {/* Global Navigation */}
      <Navbar />

      <main className="flex-grow z-10 relative pt-24 md:pt-32">
        {/* Header Hero Section */}
        <section className="px-6 max-w-7xl mx-auto text-center pb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Proven Enterprise Impact</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading max-w-4xl mx-auto mb-6 leading-tight">
            Engineering Outcomes, Delivered at Scale
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Explore our battle-tested client deployments, internal platforms, exploratory concept builds, and verifiable client testimonials.
          </p>

          {/* Quick Jump Navigation Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-card/80 dark:bg-slate-900/80 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl shadow-xs mb-10">
            <a
              href="#case-studies"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Featured Work</span>
            </a>
            <Link
              href={ROUTES.PUBLIC.CASE_STUDIES}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Case Studies Directory</span>
            </Link>
            <Link
              href={ROUTES.PUBLIC.WORK_TESTIMONIALS}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Star className="h-3.5 w-3.5" />
              <span>Testimonials Directory</span>
            </Link>
            <Link
              href={ROUTES.PUBLIC.START_PROJECT ? `${ROUTES.PUBLIC.START_PROJECT}?source_page=${encodeURIComponent('/work')}` : `/start-project?source_page=${encodeURIComponent('/work')}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-xs hover:scale-105"
            >
              <span>Start a Project</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Credibility Standards Architecture Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 backdrop-blur-xl text-left max-w-5xl mx-auto shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border/50 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Astraiv Credibility & Project Classification Standard
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    We maintain strict transparency: real production client deployments are distinctly classified from internal platforms, reference architectures, and exploratory concept builds.
                  </p>
                </div>
              </div>
              <Link
                href={ROUTES.PUBLIC.CASE_STUDIES}
                className="text-xs font-bold text-primary dark:text-blue-400 hover:underline shrink-0 flex items-center gap-1"
              >
                <span>Filter by Type</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="p-3.5 rounded-xl bg-card/60 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800/80">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Client Projects
                </span>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Real enterprise client engagements with verified production ROI metrics and executive endorsements.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-card/60 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800/80">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
                  Internal Platforms
                </span>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Proprietary developer tooling, agent orchestrators, and internal infrastructure engineered by Astraiv.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-card/60 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800/80">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                  Concept Projects
                </span>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Astraiv AI Labs exploratory prototypes and simulated benchmarks. Never presented as client work.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-card/60 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800/80">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  Reference Architectures
                </span>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Hardened infrastructure blueprints and deployment templates vetted against AWS Well-Architected rules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Case Studies Section */}
        <div id="case-studies" className="scroll-mt-24">
          <CaseStudiesSection />
        </div>

        {/* 2. Testimonials Section */}
        <div id="testimonials" className="scroll-mt-24">
          <TestimonialsSection initialReviews={reviews} />
        </div>

        {/* 3. Final Conversion Section */}
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
