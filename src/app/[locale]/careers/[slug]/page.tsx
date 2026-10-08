import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar, Footer } from '@/views';
import { getPublicJobBySlug, getPublicJobOpenings, getPublicCareersPageContent } from '@/controllers/public-data.controller';
import { JobApplicationForm } from '@/views/sections/job-application-form';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import {
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Cpu,
  Laptop,
  GraduationCap,
  AlertCircle,
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

  const metaTitle = job.metaTitle || `${job.title} | Careers | Astraiv Technologies`;
  const metaDescription =
    job.metaDescription ||
    `${job.title} (${job.department}) - ${job.description} Join our distributed engineering team.`;

  return createPageMetadata({
    title: metaTitle,
    description: metaDescription,
    path: `/careers/${job.slug}`,
    locale,
  });
}

function formatDetailKolkataTime(isoString: string | null | undefined): { formatted: string; iso: string } {
  if (!isoString) {
    return { formatted: 'Recently Posted', iso: new Date().toISOString() };
  }
  try {
    const d = new Date(isoString);
    const formatted = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
    return { formatted: `${formatted} (Asia/Kolkata)`, iso: d.toISOString() };
  } catch {
    return { formatted: 'Recently Posted', iso: isoString };
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { locale, slug } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [job, pageData] = await Promise.all([
    getPublicJobBySlug(slug),
    getPublicCareersPageContent(),
  ]);

  if (!job) {
    notFound();
  }

  const { sharedDefaults } = pageData;

  // Resolve interview stages and benefits (either per-job customized or inherited from shared defaults)
  const interviewStages =
    job.interviewStages && job.interviewStages.length > 0
      ? job.interviewStages
      : sharedDefaults.interviewStages;

  const benefitsList =
    job.benefits && job.benefits.length > 0
      ? job.benefits
      : sharedDefaults.commonBenefits;

  const displayLocation =
    job.geographicLocation && job.workMode
      ? `${job.geographicLocation} · ${job.workMode}`
      : job.location || 'Worldwide · Remote';

  const timeInfo = formatDetailKolkataTime(job.publishedAt || job.createdAt);

  // Structured data ONLY on active job postings
  const jobJsonLd = job.active
    ? getJobPostingJsonLd(
        {
          title: job.title,
          description: job.description,
          slug: job.slug,
          department: job.department,
          type: job.type,
          location: displayLocation,
          salary: job.showSalary && job.salary ? job.salary : undefined,
        },
        locale
      )
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
          { name: job.title, path: `/careers/${job.slug}` },
        ]}
      />
      {jobJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }}
        />
      )}
      <Navbar />

      <main className="pt-28 pb-20 grow z-10 relative">
        {/* Ambient Top Glow */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-212.5 h-90 bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

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

          {/* Closed Job Alert Banner */}
          {!job.active && (
            <div className="p-6 mb-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Position Currently Filled / Closed</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    This position is no longer accepting new applications. You may submit an open speculative application below.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={ROUTES.PUBLIC.CAREERS}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  View Active Roles
                </Link>
                <Link
                  href={`/contact?role=${encodeURIComponent('Speculative Candidate')}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Speculative Application
                </Link>
              </div>
            </div>
          )}

          {/* Role Header Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl border border-border/80 dark:border-slate-800 shadow-md mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Department */}
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20">
                  {job.department}
                </span>

                {/* Employment Type */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border/50">
                  <Clock className="h-3.5 w-3.5" />
                  {job.employmentType || 'Full-Time'}
                </span>

                {/* Modality & Geographic Region */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20">
                  <MapPin className="h-3.5 w-3.5" />
                  {displayLocation}
                </span>

                {/* Experience Level */}
                {job.experienceLevel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {job.experienceLevel === 'Both'
                      ? 'Fresher & Experienced Eligible'
                      : job.experienceLevel === 'Fresher'
                      ? 'Fresher Eligible'
                      : job.experience || 'Experienced'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading heading-gradient">
                {job.title}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground font-medium">
                <div>
                  <span className="font-semibold text-foreground">Posted: </span>
                  <time dateTime={timeInfo.iso}>{timeInfo.formatted}</time>
                </div>
                {job.showSalary && job.salary && (
                  <div className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    <span>Compensation:</span>
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              {job.active ? (
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 transition-all group active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>Apply for this Position</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-muted text-muted-foreground cursor-not-allowed opacity-70 whitespace-nowrap"
                >
                  <span>Position Closed</span>
                </button>
              )}
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
                    <CheckCircle2 className="h-5 w-5 text-primary dark:text-cyan-400" />
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
                  {job.skills && job.skills.length > 0 && (
                    <div className="pt-3">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                        Core Technology Stack
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Nice-to-Haves */}
              {job.niceToHave && job.niceToHave.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary dark:text-cyan-400" />
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
              {benefitsList && benefitsList.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Laptop className="h-5 w-5 text-indigo-500" />
                    <span>What We Offer & Engineering Culture</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {benefitsList.map((benefit: string, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-card/70 dark:bg-slate-900/60 border border-border/60 dark:border-slate-800/80 flex items-start gap-3"
                      >
                        <ShieldCheck className="h-4 w-4 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground/90 font-medium leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 4-Stage Interview Process */}
              {interviewStages && interviewStages.length > 0 && (
                <section className="p-8 rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-border/70 dark:border-slate-800/80 space-y-6">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-primary dark:text-cyan-400">
                      Hiring Roadmap
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                      Transparent {interviewStages.length}-Stage Interview Process
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Fast, respectful, and zero algorithmic trick questions. We respect your time.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {interviewStages.map((stage: { num: string; title: string; desc: string }) => (
                      <div
                        key={stage.num}
                        className="p-5 rounded-2xl bg-card dark:bg-slate-950 border border-border/70 dark:border-slate-800 shadow-2xs"
                      >
                        <span className="text-xs font-mono font-bold text-primary dark:text-cyan-400 block mb-1">
                          Stage {stage.num}
                        </span>
                        <h3 className="text-sm font-bold text-foreground mb-1.5">{stage.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{stage.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Application Form Component */}
              {job.active && (
                <JobApplicationForm
                  jobId={job.id}
                  roleTitle={job.title}
                  roleSlug={job.slug}
                  department={job.department}
                  experienceLevel={job.experienceLevel}
                  defaultPrivacyText={sharedDefaults.defaultPrivacyText}
                />
              )}
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
                    <span className="text-muted-foreground block mb-0.5">Role Category</span>
                    <span className="text-foreground font-bold">{job.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Work Modality</span>
                    <span className="text-foreground font-bold">{job.workMode || 'Remote'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Geographic Location</span>
                    <span className="text-foreground font-bold">{job.geographicLocation || 'Worldwide'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Experience Requirement</span>
                    <span className="text-foreground font-bold">
                      {job.experienceLevel === 'Both'
                        ? 'Fresher & Experienced'
                        : job.experienceLevel === 'Fresher'
                        ? 'Fresher Eligible (0 Yrs)'
                        : job.experience || 'Experienced'}
                    </span>
                  </div>
                  {job.showSalary && job.salary && (
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Compensation</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {job.salary}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Date Published</span>
                    <time dateTime={timeInfo.iso} className="text-foreground font-semibold">
                      {timeInfo.formatted}
                    </time>
                  </div>
                </div>

                {job.active && (
                  <div className="pt-4 border-t border-border/40">
                    <a
                      href="#apply"
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
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
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span>No pointless meetings. We communicate via written RFCs and async specs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span>Work from anywhere in the world on modern, strictly typed tech stacks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span>Rapid sprint cadences with zero red tape and direct founder access.</span>
                  </li>
                </ul>
              </div>

              {/* Referral Banner (Configurable / Hideable) */}
              {job.showReferralBonus !== false && (
                <div className="p-6 rounded-2xl bg-linear-to-br from-primary/10 via-card to-card border border-primary/20 text-left">
                  <h4 className="text-sm font-bold text-foreground mb-1">Know an exceptional architect?</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    We offer a{' '}
                    <strong className="text-foreground">
                      {job.referralBonus || sharedDefaults.defaultReferralBonus}
                    </strong>{' '}
                    referral bonus for successfully placed engineers and architects.
                  </p>
                  <Link
                    href="/contact"
                    className="text-xs font-bold text-primary dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Submit Candidate Referral</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
