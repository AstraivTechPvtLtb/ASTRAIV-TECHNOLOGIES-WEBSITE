import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar, Footer, CareersSection } from '@/views';
import {
  getPublicCareersPageContent,
  getPublicJobCategories,
  getPaginatedPublicJobs,
} from '@/controllers/public-data.controller';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CareersPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; q?: string; page?: string }>;
}

export async function generateMetadata({ params }: CareersPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Careers & Open Engineering Positions | Astraiv Technologies',
    description:
      'Join Astraiv Technologies as a senior software architect, full-stack engineer, or AI researcher. Build high-impact systems with 100% remote autonomy.',
    path: '/careers',
    locale,
  });
}

export default async function CareersPage({ params, searchParams }: CareersPageProps) {
  const { locale } = await params;
  const search = searchParams ? await searchParams : {};

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Fetch dynamic page content, canonical role categories, and server-paginated initial jobs
  const [pageData, categories, initialJobsData] = await Promise.all([
    getPublicCareersPageContent(),
    getPublicJobCategories(),
    getPaginatedPublicJobs({
      categorySlug: search?.category && search.category !== 'all' ? search.category : undefined,
      query: search?.q,
      page: search?.page ? parseInt(search.page, 10) || 1 : 1,
      limit: 5,
    }),
  ]);

  const { content } = pageData;

  const heroHeadingText =
    typeof content.heroHeading === 'string'
      ? content.heroHeading
      : typeof (content.heroHeading as unknown as { heading?: string })?.heading === 'string'
      ? `${(content.heroHeading as unknown as { heading: string; highlightText?: string }).heading}\n${(content.heroHeading as unknown as { highlightText?: string }).highlightText || ''}`.trim()
      : 'Work With Architects,\nNot Bureaucrats.';

  // Split hero heading for gradient accentuation if formatted with newlines or tags
  const headingLines = heroHeadingText.split('\n');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
        ]}
      />
      <Navbar />

      <main id="main-content" className="pt-28 pb-20 grow z-10 relative">
        {/* Ambient background lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-200 h-87.5 bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Dynamic Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading mb-4">
              {headingLines.length > 1 ? (
                <>
                  {headingLines[0]} <br />
                  <span className="heading-gradient">{headingLines.slice(1).join(' ')}</span>
                </>
              ) : (
                <span className="heading-gradient">{heroHeadingText}</span>
              )}
            </h1>
            {content.heroSubtitle && typeof content.heroSubtitle === 'string' && (
              <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                {content.heroSubtitle}
              </p>
            )}
          </div>

          {/* Dynamic Interactive Careers Section (Culture Cards, Optional Image, Benefits, Filterable Roles, Speculative CTA) */}
          <CareersSection
            content={content}
            categories={categories}
            initialJobsData={initialJobsData}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
