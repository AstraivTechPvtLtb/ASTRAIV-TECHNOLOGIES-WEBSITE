import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar, Footer } from '@/views';
import { getPublicJobBySlug, getPublicJobOpenings } from '@/controllers/public-data.controller';
import { JobApplicationForm } from '@/views/sections/job-application-form';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Terminal,
  Cpu,
  Laptop,
} from 'lucide-react';
import { createPageMetadata, BreadcrumbSchema, getJobPostingJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface JobDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const jobs = await getPublicJobOpenings();
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getPublicJobBySlug(slug);

  if (!job) {
    return createPageMetadata({
      title: 'Job Not Found | Astraiv Technologies Careers',
      noIndex: true,
      locale,
    });
  }

  return createPageMetadata({
    title: `${job.title} | Careers | Astraiv Technologies`,
    description: `${job.title} (${job.department}) - ${job.description} Join our distributed engineering team.`,
    path: `/careers/${job.slug}`,
    locale,
  });
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { locale, slug } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const job = await getPublicJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const interviewStages = [
    {
      num: '01',
      title: 'Profile & Architecture Review',
      desc: 'Our senior architects review your GitHub, past system implementations, and RFCs within 48 business hours.',
    },
    {
      num: '02',
      title: 'Technical & Systems Discussion',
      desc: 'A 45-minute deep-dive with our engineering founders into real-world architecture trade-offs, concurrency, and reliability.',
    },
    {
      num: '03',
      title: 'Practical System Design Exercise',
      desc: 'A scoped, paid system design discussion or take-home RFC tailored to your specialty. No inverted binary trees on whiteboards.',
    },
    {
      num: '04',
      title: 'Mutual Offer & Onboarding',
      desc: 'Transparent compensation offer, equity allocation, home workstation budget setup, and seamless async onboarding.',
    },
  ];

  const jobJsonLd = getJobPostingJsonLd({
    title: job.title,
    description: job.description,
    slug: job.slug,
    department: job.department,
    type: job.type,
    location: job.location,
    salary: job.salary || undefined,
  }, locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
          { name: job.title, path: `/careers/${job.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }}
      />
      <Navbar />

      <main className="pt-28 pb-20 flex-grow z-10 relative">
        {/* Ambient Top Glow */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-8">
            <Link href={ROUTES.PUBLIC.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={ROUTES.PUBLIC.CAREERS} className="hover:text-foreground transition-colors">
              Careers
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-bold truncate max-w-xs">{job.title}</span>
          </nav>

          {/* Role Header Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/80 dark:border-slate-800 shadow-md mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {job.department}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border/50">
                  <Clock className="h-3.5 w-3.5" />
                  {job.type}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
                {job.title}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                {job.description}
              </p>

              {job.salary && (
                <div className="inline-flex items-center gap-2 pt-2 text-xs sm:text-sm font-bold text-foreground">
                  <span className="text-muted-foreground font-normal">Compensation:</span>
                  <span className="text-primary font-mono">{job.salary}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 transition-all group active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>Apply for this Position</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href={ROUTES.PUBLIC.CAREERS}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                <span>← Back to all open roles</span>
              </Link>
            </div>
          </div>

          {/* Grid Layout: Main Specs + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
            {/* Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Mission & Overview */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <span>The Mission & Role Impact</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  At Astraiv Technologies, we reject bloated corporate committees and endless synchronous alignment meetings. As our {job.title}, you will possess end-to-end ownership of critical technical foundations, working asynchronously with senior peers to deploy battle-tested digital infrastructure.
                </p>
              </section>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>Key Architectural Responsibilities</span>
                  </h2>
                  <div className="space-y-3">
                    {job.responsibilities.map((resp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-xl bg-card/70 dark:bg-slate-900/60 border border-border/60 dark:border-slate-800/80 shadow-2xs"
                      >
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                          {resp}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Qualifications & Skills */}
              {job.requirements && job.requirements.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-500" />
                    <span>Technical Qualifications</span>
                  </h2>
                  <div className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-xl bg-card/70 dark:bg-slate-900/60 border border-border/60 dark:border-slate-800/80 shadow-2xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Skills Chips */}
                  <div className="pt-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                      Core Technology Stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Nice-to-Haves */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Bonus / Nice-to-Have Background</span>
                  </h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
                    {job.niceToHave.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* What We Offer / Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Laptop className="h-5 w-5 text-indigo-500" />
                    <span>What We Offer & Engineering Culture</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {job.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-card/70 dark:bg-slate-900/60 border border-border/60 dark:border-slate-800/80 flex items-start gap-3"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground/90 font-medium leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 4-Stage Interview Process */}
              <section className="p-8 rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-border/70 dark:border-slate-800/80 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Hiring Roadmap
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                    Transparent 4-Stage Interview Process
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Fast, respectful, and zero algorithmic trick questions. We respect your time.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {interviewStages.map((stage) => (
                    <div
                      key={stage.num}
                      className="p-5 rounded-2xl bg-card dark:bg-slate-950 border border-border/70 dark:border-slate-800 shadow-2xs"
                    >
                      <span className="text-xs font-mono font-bold text-primary block mb-1">
                        Stage {stage.num}
                      </span>
                      <h3 className="text-sm font-bold text-foreground mb-1.5">{stage.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{stage.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Application Form Component */}
              <JobApplicationForm
                roleTitle={job.title}
                roleSlug={job.slug}
                department={job.department}
              />
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Role Snapshot Card */}
              <div className="p-6 rounded-2xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800/80 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-foreground pb-3 border-b border-border/40">
                  Role Overview
                </h3>

                <div className="space-y-4 text-xs font-medium">
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Department</span>
                    <span className="text-foreground font-bold">{job.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Work Modality</span>
                    <span className="text-foreground font-bold">{job.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Location</span>
                    <span className="text-foreground font-bold">{job.location}</span>
                  </div>
                  {job.experience && (
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Experience Level</span>
                      <span className="text-foreground font-bold">{job.experience}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Compensation</span>
                      <span className="text-primary font-mono font-bold">{job.salary}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/40">
                  <a
                    href="#apply"
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Engineering Culture Card */}
              <div className="p-6 rounded-2xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Zap className="h-4 w-4" />
                  <span>The Astraiv Standard</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">Why Engineers Love Building Here</h4>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>No pointless meetings. We communicate via written RFCs and async specs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Work from anywhere in the world on modern, strictly typed tech stacks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Rapid two-week sprint cadences with zero red tape and direct founder access.</span>
                  </li>
                </ul>
              </div>

              {/* Referral Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 text-left">
                <h4 className="text-sm font-bold text-foreground mb-1">Know an exceptional architect?</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  We offer a $2,500 referral bonus for successfully placed senior engineers and architects.
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Submit a Candidate Referral</span>
                  <ArrowRight className="h-3 w-3" />
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
