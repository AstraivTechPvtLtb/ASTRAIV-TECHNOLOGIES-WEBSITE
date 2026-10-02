import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar } from '@/views/layouts/navbar';
import { Footer } from '@/views/layouts/footer';
import { ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';
import { getPublishedLegalDocument } from '@/controllers/legal.controller';
import { LegalIcon } from '@/views/legal/legal-icon-renderer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400;

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const doc = await getPublishedLegalDocument('privacy');
  return createPageMetadata({
    title: `${doc.title || 'Privacy Policy'} | Astraiv Technologies`,
    description:
      doc.description ||
      'Learn how Astraiv Technologies protects and manages client and visitor data in compliance with GDPR, CCPA, ISO 27001, and SOC-2 standards.',
    path: '/privacy',
    locale,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const doc = await getPublishedLegalDocument('privacy');

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Background ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 py-6 text-left">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Compliance & Data Governance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-[-0.025em] font-heading mb-3">
              Privacy <span className="heading-gradient">Policy</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed">
              {doc.summary || `Last updated: ${doc.effectiveDate || 'September 2026'}. This policy outlines our commitment to safeguarding customer, client, and visitor information across all Astraiv Technologies systems.`}
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10">
            {doc.sections.map((section, idx) => (
              <section
                key={idx}
                className="p-7 sm:p-8 rounded-2xl bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border/40">
                    <LegalIcon name={section.icon} className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground tracking-[-0.015em]">
                    {section.title}
                  </h2>
                </div>

                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal space-y-3 whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Security Note */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground font-normal">
              Have security compliance questions or need an Enterprise Data Processing Agreement (DPA)?
            </span>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap shadow-xs"
            >
              Contact Legal & Security
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

