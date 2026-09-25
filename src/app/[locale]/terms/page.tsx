import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar } from '@/views/layouts/navbar';
import { Footer } from '@/views/layouts/footer';
import { FileText, ShieldAlert, Award, RefreshCw, CheckCircle2, Scale, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400;

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Terms of Service | Astraiv Technologies',
    description:
      'Review the terms of service, engagement models, intellectual property assignments, and service level agreements for Astraiv Technologies.',
    path: '/terms',
    locale,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const sections = [
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: '1. Engagement Scope & Master Service Agreements',
      content: `Astraiv Technologies provides high-performance custom software engineering, AI intelligent systems, distributed cloud architecture, and technical consulting services.
- **Statement of Work (SOW)**: Each client engagement is governed by a dedicated Statement of Work or commercial proposal defining deliverables, architectural milestones, technology stacks, pricing, and delivery timelines.
- **Mutual Agreement**: Engaging Astraiv or executing an SOW constitutes binding acceptance of these Terms of Service alongside any custom Master Services Agreement (MSA) executed between the parties.`,
    },
    {
      icon: <Award className="h-5 w-5 text-emerald-500" />,
      title: '2. Intellectual Property & Ownership Rights',
      content: `We believe in unconditional, unencumbered client ownership:
- **100% Client Ownership**: Upon full payment of milestone fees, all bespoke source code, UI/UX designs, database schemas, and custom algorithms developed specifically for the client transfer completely and exclusively to the client.
- **Pre-Existing Frameworks & Boilerplates**: Astraiv retains ownership of its internal reusable engineering libraries, development toolchains, and open-source contributions. The client is granted a perpetual, irrevocable, royalty-free, worldwide license to utilize and modify any incorporated Astraiv frameworks within their bespoke application.
- **No Vendor Lock-In**: We construct platforms with standard, documented, cloud-native technologies (Next.js, Node.js, PostgreSQL, Docker, Kubernetes) ensuring clients can independently host, deploy, and maintain their codebases.`,
    },
    {
      icon: <ShieldAlert className="h-5 w-5 text-blue-500" />,
      title: '3. Confidentiality & Non-Disclosure (NDA)',
      content: `Astraiv treats all proprietary client information with institutional rigor:
- **Mutual Non-Disclosure**: All trade secrets, architectural schematics, business roadmaps, client data, and proprietary algorithms shared during discovery or execution are protected under strict mutual confidentiality.
- **Code & Credential Isolation**: Developer access to client repositories, staging environments, and production systems is governed by role-based credentials, SSH keys, and encrypted secret vaults. Astraiv developers never share or commit private client keys or customer data to public repositories.`,
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-purple-500" />,
      title: '4. Delivery Milestones, Invoicing & Acceptance',
      content: `Project milestones adhere to structured engineering sprints:
- **Sprint Reviews & Demo Sign-Off**: Deliverables are deployed to staging environments for client validation. Clients have an agreed acceptance window (typically 10 business days) to review features and submit revision requests.
- **Payment Terms**: Invoices for milestone phases or dedicated monthly retainer sprints are payable within the net terms defined in the SOW (typically Net-15 or Net-30). Late payments may result in temporary staging deployment freezes.
- **Warranty & Hypercare**: Astraiv includes a 30 to 90-day post-launch warranty window (as defined in the SOW) to rectify any functional defects or deviations from approved specifications at zero additional charge.`,
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-amber-500" />,
      title: '5. Service Level Agreements (SLAs) & Hosting Availability',
      content: `For clients engaging Astraiv for DevOps, Cloud Architecture, and Managed Infrastructure:
- **High-Availability Targets**: We engineer systems targeting 99.9% uptime across multi-region cloud infrastructures (AWS, Cloudflare, Supabase, Google Cloud).
- **Incident Response Levels**: P1 critical production outages are prioritized with initial technical response within 1 hour. P2 and P3 issues are addressed within standard business hours as dictated by the support agreement.
- **Third-Party Outages**: Astraiv is not liable for infrastructure downtime caused by global outages of upstream cloud providers (e.g. AWS regional power losses, Cloudflare global edge degradation).`,
    },
    {
      icon: <Scale className="h-5 w-5 text-rose-500" />,
      title: '6. Limitation of Liability & Governing Law',
      content: `To the maximum extent permitted by applicable law:
- **Liability Cap**: In no event shall either party's total aggregate liability arising out of or related to these Terms exceed the total fees paid by the client under the specific Statement of Work giving rise to the claim.
- **Consequential Damages**: Neither party shall be liable for indirect, incidental, punitive, or consequential damages (including loss of profits or data interruptions).
- **Governing Law**: These Terms and any dispute arising hereunder shall be governed by and construed in accordance with the laws of West Bengal, India, without regard to conflict of law principles. Parties agree to submit to the jurisdiction of competent courts in Kolkata, India, or mutually agreed international arbitration.`,
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: '7. Inquiries & Legal Notices',
      content: `Legal notices, contractual revisions, or enterprise MSA inquiries should be addressed to:
- **Email**: legal@astraivtechnologies.com / info@astraivtechnologies.com
- **Corporate Entity**: Astraiv Technologies, Ashoknagar, Kolkata, West Bengal, India.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' },
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
              <Scale className="h-3.5 w-3.5" />
              <span>Commercial & Legal Framework</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading mb-3">
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Last updated: September 2026. These terms govern software engineering engagements, architectural consultations, IP assignments, and support agreements with Astraiv Technologies.
            </p>
          </div>

          {/* Terms Sections */}
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

          {/* Bottom Call to Action */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border/60 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              Need custom contractual terms, a bilateral NDA, or tailored Enterprise SLA parameters?
            </span>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap shadow-xs"
            >
              Request Custom MSA / NDA
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
