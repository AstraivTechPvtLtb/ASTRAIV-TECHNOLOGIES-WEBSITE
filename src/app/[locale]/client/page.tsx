import { setRequestLocale } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Navbar, Footer } from '@/views';
import { getCurrentUserSession } from '@/controllers';
import { ROUTES, PORTAL_ROUTES, getLocalizedPath } from '@/routes';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  FileCheck2,
  Clock,
  LifeBuoy,
  CreditCard,
  CheckCircle2,
  Server,
  Zap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ClientPortalPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ClientPortalPageProps): Promise<Metadata> {
  await params;
  return {
    title: 'Client Portal | Astraiv Technologies',
    description:
      'Access your dedicated Astraiv Client Portal: real-time sprint velocity tracking, architectural RFC blueprints, SLA-backed support tickets, and invoice telemetry.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ClientPortalPage({ params }: ClientPortalPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Check existing session
  const user = await getCurrentUserSession();

  if (user) {
    // Route authenticated users directly to their appropriate dashboard view
    switch (user.role) {
      case 'ADMIN':
        redirect('/admin');
      case 'PROJECT_MANAGER':
        redirect('/manager');
      case 'CLIENT':
        redirect(getLocalizedPath(PORTAL_ROUTES.CLIENT.PROJECTS, locale));
      case 'USER':
      default:
        redirect(getLocalizedPath(PORTAL_ROUTES.DASHBOARD, locale));
    }
  }

  const portalFeatures = [
    {
      icon: <FolderKanban className="h-6 w-6 text-primary" />,
      title: 'Active Sprint Velocity & Milestones',
      description:
        'Inspect two-week sprint burndowns, staging previews, deliverable quality gates, and live production deployment statuses in real time.',
      badge: 'Real-time Telemetry',
    },
    {
      icon: <FileCheck2 className="h-6 w-6 text-indigo-400" />,
      title: 'Architectural RFCs & Specifications',
      description:
        'Access version-controlled technical architecture RFCs, database migration schemas, and API documentation for your platform.',
      badge: 'Immutable Records',
    },
    {
      icon: <LifeBuoy className="h-6 w-6 text-emerald-400" />,
      title: 'SLA-Backed Support & Help Desk',
      description:
        'File prioritized technical tickets directly with senior software architects under contractually guaranteed response times.',
      badge: 'Sub-Hour SLAs',
    },
    {
      icon: <CreditCard className="h-6 w-6 text-amber-400" />,
      title: 'Invoicing & Cloud Telemetry',
      description:
        'Transparent milestone billing, automated itemized invoice downloads, and infrastructure utilization summaries.',
      badge: 'Zero Surprises',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Ambient lighting glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-96 right-10 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Hero Billboard */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 sm:p-14 mb-14 shadow-2xl text-center">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              {/* Security Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 mb-6 select-none">
                <Lock className="h-3.5 w-3.5 text-blue-400" />
                <span>SECURE CLIENT GOVERNANCE PORTAL</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading mb-6">
                Client Portal &amp; <br />
                <span className="bg-gradient-to-r from-blue-400 via-primary to-indigo-300 bg-clip-text text-transparent">
                  Sprint Command Center
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8 max-w-2xl">
                Dedicated interface for enterprise partners to monitor live development velocity, review architectural milestones, download deliverables, and communicate directly with senior software architects.
              </p>

              {/* Primary Sign In Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  href="/auth/login?redirect=/client/projects"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl text-sm font-extrabold text-slate-950 bg-white hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 group"
                >
                  <Lock className="h-4 w-4 text-slate-900" />
                  <span>Sign In to Client Portal</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={ROUTES.PUBLIC.START_PROJECT}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>Start a New Project</span>
                </Link>
              </div>

              {/* Institutional Compliance Micro-Bar */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-slate-800 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>SOC-2 Type II Compliant</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Server className="h-4 w-4 text-blue-400" />
                  <span>TLS 1.3 &amp; AES-256 Encryption</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Row-Level Isolated Partitioning</span>
                </span>
              </div>
            </div>
          </div>

          {/* Portal Features Grid */}
          <div className="mb-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Enterprise Platform Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Everything required to ensure complete technical governance, zero surprise invoices, and high-velocity delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portalFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-7 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg backdrop-blur-md group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/70 group-hover:scale-105 transition-transform">
                        {feat.icon}
                      </div>
                      <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-4">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-primary group-hover:text-blue-400 transition-colors">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Included for all enterprise contracts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assistance & Non-Client Callout */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="max-w-xl">
              <h4 className="text-base font-bold text-white mb-1">
                Need Client Portal Access or Technical Support?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If your organization has an active contract and requires credential onboarding or multi-factor authentication resets, reach our technical account leadership directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contact?subject=Client%20Portal%20Access%20Request"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <span>Request Account Access</span>
              </Link>
              <Link
                href="/auth/login?redirect=/client/projects"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-md"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
