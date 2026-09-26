import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar, Footer, CareersSection } from '@/views';
import { getPublicJobOpenings } from '@/controllers/public-data.controller';
import { Users, HeartHandshake, Compass, Send } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CareersPageProps {
  params: Promise<{ locale: string }>;
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

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const jobOpenings = await getPublicJobOpenings();

  const values = [
    {
      icon: <Compass className="h-5 w-5 text-primary" />,
      title: 'Architectural Ownership',
      desc: 'We do not micromanage tickets. Engineers own architecture end-to-end, from schema definition to multi-region cloud deployment.',
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      title: 'Async Deep Work Culture',
      desc: 'We minimize synchronous meetings in favor of precise technical specs, RFC documents, and uninterrupted focus time.',
    },
    {
      icon: <HeartHandshake className="h-5 w-5 text-emerald-500" />,
      title: 'Radical Engineering Candor',
      desc: 'Code reviews are honest, rigorous, and ego-free. We care deeply about clean code, memory safety, and performance budgets.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
        ]}
      />
      <Navbar />

      <main id="main-content" className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading mb-4">
              Work With Architects, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Not Bureaucrats.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              We are a team of senior software engineers, cloud architects, and AI researchers building mission-critical platforms for high-growth enterprises worldwide.
            </p>
          </div>

          {/* Core Values */}
          <h2 className="sr-only">Core Engineering Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/70 dark:border-slate-800/80 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit mb-3.5 border border-border/40">
                  {val.icon}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{val.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Roles Section */}
          <CareersSection initialRoles={jobOpenings} />

          {/* Speculative Application Banner */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/10 border border-border/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-left">
              <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
                Unsolicited & Speculative Applications
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mt-1 mb-2">
                Don&apos;t See Your Exact Specialty Listed?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                If you are a world-class systems engineer, compiler enthusiast, or AI infrastructure architect, we always make room for exceptional talent.
              </p>
            </div>
            <Link
              href={`/contact?role=${encodeURIComponent('Speculative Senior Architect')}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md whitespace-nowrap shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Speculative Application</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
