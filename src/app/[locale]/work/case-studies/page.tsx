import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Navbar, Footer, CaseStudiesDirectory } from '@/views';
import { getPublicCaseStudies } from '@/controllers/portfolio.controller';
import { Layers } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CaseStudiesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CaseStudiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Enterprise Case Studies & Architecture Directory | Astraiv Technologies',
    description:
      'Inspect production case studies, internal platforms, exploratory concept prototypes, and hardened reference architectures engineered by Astraiv Technologies.',
    path: '/work/case-studies',
    locale,
  });
}

export default async function CaseStudiesPage({ params }: CaseStudiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getPublicCaseStudies();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: 'Case Studies', path: '/work/case-studies' },
        ]}
      />
      <Navbar />

      <main className="flex-grow z-10 relative pt-24 md:pt-32">
        {/* Ambient Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary/5 dark:bg-blue-600/5 rounded-full blur-[180px] pointer-events-none" />

        {/* Header Hero Section */}
        <section className="px-6 max-w-7xl mx-auto text-center pb-6">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs font-semibold text-muted-foreground">
            <Link href={ROUTES.PUBLIC.HOME} className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={ROUTES.PUBLIC.WORK} className="hover:text-primary transition-colors">
              Work
            </Link>
            <span>/</span>
            <span className="text-foreground">Case Studies</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="h-3.5 w-3.5" />
            <span>Architecture & Outcomes Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading max-w-4xl mx-auto mb-6 leading-tight">
            Case Studies & Architecture Blueprints
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
            Filter our portfolio by project classification, domain vertical, or technology stack. We maintain strict credibility standards across client engagements, internal tooling, and concept architectures.
          </p>
        </section>

        {/* Interactive Directory with Search & Filtering */}
        <CaseStudiesDirectory initialProjects={projects} />
      </main>

      <Footer />
    </div>
  );
}
