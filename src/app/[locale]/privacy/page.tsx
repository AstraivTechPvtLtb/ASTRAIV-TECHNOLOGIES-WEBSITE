import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar } from '@/views/layouts/navbar';
import { Footer } from '@/views/layouts/footer';
import { ShieldCheck, Lock, Eye, Database, Globe, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400;

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Privacy Policy | Astraiv Technologies',
    description:
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

  const sections = [
    {
      icon: <Eye className="h-5 w-5 text-primary" />,
      title: '1. Information We Collect',
      content: `Astraiv Technologies collects information to provide higher-quality enterprise software, architectural consultations, and platform performance. This includes:
- **Direct Submissions**: Information you voluntarily provide when requesting a software architecture quote, submitting project requirements, applying for an open engineering role, or submitting client feedback (e.g. name, work email address, company name, telephone number, resume files, and project scope).
- **Technical Telemetry**: Information automatically generated through your interaction with our website and client portal, such as IP address, browser type, device identifiers, referring URLs, operating system, and pages visited, captured via privacy-focused telemetry.
- **Client Engagement Data**: For contracted enterprise clients, project specifications, architectural repositories, ticket communications, and billing metrics managed through encrypted database connections.`,
    },
    {
      icon: <Database className="h-5 w-5 text-blue-500" />,
      title: '2. How We Use Your Information',
      content: `We utilize gathered information exclusively for legitimate business, architectural, and contractual purposes:
- Delivering, operating, testing, and optimizing custom software engineering platforms.
- Responding to project inquiries, preparing commercial proposals, and scheduling technical discovery sessions.
- Administering client portal accounts, support tickets, and role-based access controls.
- Complying with regulatory, tax, accounting, and institutional security mandates.
- Evaluating engineering job applicants and scheduling founder interviews.
- Protecting our systems against unauthorized access, credential stuffing, DDoS attacks, and security vulnerabilities.`,
    },
    {
      icon: <Lock className="h-5 w-5 text-emerald-500" />,
      title: '3. Data Security & Storage Standards',
      content: `Astraiv adheres to strict institutional security benchmarks:
- **Encryption**: All data in transit is encrypted using modern TLS 1.3 cryptographic suites. Persistent data at rest is encrypted using AES-256 standards across PostgreSQL clusters and Cloudflare R2 object storage.
- **Access Control**: Strict principle of least privilege (PoLP) and multi-factor authentication (MFA) govern developer and system access to production databases.
- **Tenant Isolation**: Client data in multi-tenant environments is segregated through Row-Level Security (RLS) policies and dedicated tenant partitions.
- **Data Retention**: We retain commercial records and communication logs only as long as necessary to satisfy contractual obligations or statutory requirements.`,
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      title: '4. Third-Party Sub-Processors',
      content: `We partner with world-class, SOC-2 compliant cloud infrastructure providers to host and secure our platforms:
- **Cloud Infrastructure**: Amazon Web Services (AWS) and Cloudflare for global edge delivery, caching, and CDN routing.
- **Database & Persistence**: Managed PostgreSQL via Supabase and dedicated VPC database clusters.
- **Analytics & Telemetry**: Google Analytics 4 (configured with IP anonymization) to monitor Core Web Vitals and site usability.
We do not sell, rent, or monetize client or visitor data to third-party data brokers or marketing conglomerates.`,
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-amber-500" />,
      title: '5. Your Rights (GDPR & CCPA Compliance)',
      content: `Depending on your jurisdiction, you have statutory privacy rights regarding your personal information:
- **Access & Portability**: Request a copy of the personal information we maintain concerning you in a structured, machine-readable format.
- **Correction & Rectification**: Request correction of any incomplete or inaccurate data.
- **Erasure ("Right to be Forgotten")**: Request deletion of your personal records, subject to ongoing legal or contractual record-retention requirements.
- **Objection & Restriction**: Object to our processing of your personal data or request restricted processing.
To exercise any of these rights, contact our Data Governance team at privacy@astraivtechnologies.com.`,
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: '6. Contact & Data Governance Officer',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our security posture, please reach out directly:
- **Email**: privacy@astraivtechnologies.com / info@astraivtechnologies.com
- **Mailing Address**: Astraiv Technologies, Ashoknagar, Kolkata, West Bengal, India
- **Response SLA**: Inquiries are reviewed and answered within 48 business hours.`,
    },
  ];

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Compliance & Data Governance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Last updated: September 2026. This policy outlines our commitment to safeguarding customer, client, and visitor information across all Astraiv Technologies systems.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <section
                key={idx}
                className="p-7 sm:p-8 rounded-2xl bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/70 dark:border-slate-800/80 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border/40">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium space-y-3 whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Security Note */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              Have security compliance questions or need an Enterprise Data Processing Agreement (DPA)?
            </span>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap shadow-xs"
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
