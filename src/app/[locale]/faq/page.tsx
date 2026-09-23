import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar, Footer, FaqSection } from '@/views';
import { MessageSquare, ArrowRight, ShieldCheck, Cpu, DollarSign } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Frequently Asked Questions (FAQ) | Astraiv Technologies',
    description:
      'Explore frequently asked questions regarding Astraiv custom software engineering, enterprise AI, IP ownership, project roadmaps, and pricing models.',
    path: '/faq',
    locale,
  });
}

import { getPublishedFaqs } from '@/controllers/cms.controller';

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Retrieve strictly published FAQs from CMS
  const publishedFaqs = await getPublishedFaqs();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: publishedFaqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const quickCategories = [
    {
      title: 'Services & Stacks',
      desc: 'Understand our Next.js, AI, and Cloud engineering capabilities.',
      href: ROUTES.PUBLIC.SERVICES,
      icon: <Cpu className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Flexible Pricing',
      desc: 'Transparent milestone and sprint rates with zero hidden fees.',
      href: ROUTES.PUBLIC.PRICING,
      icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
    },
    {
      title: 'Legal & IP Ownership',
      desc: '100% IP transfer, mutual NDAs, and enterprise SLAs.',
      href: ROUTES.PUBLIC.TERMS,
      icon: <ShieldCheck className="h-5 w-5 text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Schema.org Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6">
          {/* Quick Categories Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {quickCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group p-5 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/70 dark:border-slate-800/80 hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit mb-3 border border-border/40">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Embedded FAQ Section */}
          <FaqSection showCategoryFilter={true} items={publishedFaqs as unknown as import('@/lib/faq-data').FaqItem[]} />

          {/* Dedicated Still Have Questions CTA */}
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            <div className="p-3.5 rounded-2xl bg-primary/20 text-primary border border-primary/30 mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading mb-2">
              Have a Specific Technical Question?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
              Our principal software architects are available to review your system requirements, explain our migration playbooks, or draft an initial architectural proposal.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={ROUTES.PUBLIC.CONTACT}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-xs"
              >
                Talk to an Expert
              </Link>
              <Link
                href={ROUTES.PUBLIC.CASE_STUDIES}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-card border border-border hover:bg-accent/10 transition-colors text-foreground"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
