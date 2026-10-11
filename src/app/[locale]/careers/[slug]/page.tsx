import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Navbar, Footer } from '@/views';
import { getPublicJobBySlug, getPublicCareersPageContent, getPublicJobOpenings } from '@/controllers/public-data.controller';
import { JobApplicationForm } from '@/views/sections/job-application-form';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import {
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  Check,
} from 'lucide-react';
import { createPageMetadata, BreadcrumbSchema, getJobPostingJsonLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateStaticParams() {
  const jobs = await getPublicJobOpenings();
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of routing.locales) {
    for (const job of jobs) {
      params.push({ locale, slug: job.slug });
    }
  }
  return params;
}

interface JobDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
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

  const astraivPoints =
    sharedDefaults.astraivStandardPoints && sharedDefaults.astraivStandardPoints.length > 0
      ? sharedDefaults.astraivStandardPoints
      : [
          'No pointless meetings. We communicate via written RFCs and async specs.',
          'Work from anywhere in the world on modern, strictly typed tech stacks.',
          'Rapid sprint cadences with zero red tape and direct founder access.',
        ];

  const missionText = (
    sharedDefaults.missionTemplate ||
    'At Astraiv Technologies, we reject bloated corporate committees and endless synchronous alignment meetings. As our {roleTitle}, you will possess end-to-end ownership of critical technical foundations, working asynchronously with senior peers to deploy battle-tested digital infrastructure.'
  ).replace(/\{roleTitle\}/g, job.title);

  const referralBonusAmount = job.referralBonus || sharedDefaults.defaultReferralBonus;
  const referralText = (
    sharedDefaults.referralBody ||
    'We offer a {referralBonus} referral bonus for successfully placed engineers and architects.'
  ).replace(/\{referralBonus\}/g, referralBonusAmount);

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
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-200 h-90 bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground mb-8">
            <Link href={ROUTES.PUBLIC.HOME} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={ROUTES.PUBLIC.CAREERS} className="hover:text-foreground transition-colors">
              Careers
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium truncate max-w-xs">{job.title}</span>
          </nav>

          {/* Closed Job Alert Banner */}
          {!job.active && (
            <div className="p-6 mb-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-foreground">Position Currently Filled / Closed</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-light dark:font-normal">
                    This position is no longer accepting new applications. You may submit an open speculative application below.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={ROUTES.PUBLIC.CAREERS}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-card/90 dark:bg-slate-800 text-foreground border border-slate-200/80 dark:border-white/10 hover:border-primary/40 transition-all shadow-xs"
                >
                  View Active Roles
                </Link>
                <Link
                  href={`/contact?role=${encodeURIComponent('Speculative Candidate')}`}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
                >
                  Speculative Application
                </Link>
              </div>
            </div>
          )}

          {/* Role Header Banner */}
          <div className="p-8 sm:p-12 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left relative overflow-hidden">
            {/* Ambient subtle glow inside card */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-4 max-w-2xl relative z-10">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Department */}
                <span className="text-[11px] font-mono font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20 shadow-2xs">
                  {job.department}
                </span>

                {/* Employment Type */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-foreground/85 shadow-2xs">
                  <Clock className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
                  {job.employmentType || 'Full-Time'}
                </span>

                {/* Modality & Geographic Region */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20 shadow-2xs">
                  <MapPin className="h-3.5 w-3.5 text-primary dark:text-cyan-400" />
                  {displayLocation}
                </span>

                {/* Experience Level */}
                {job.experienceLevel && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    {job.experienceLevel === 'Both'
                      ? 'Fresher & Experienced Eligible'
                      : job.experienceLevel === 'Fresher'
                      ? 'Fresher Eligible'
                      : job.experience || 'Experienced'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-heading heading-gradient leading-tight">
                {job.title}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground font-light dark:font-normal leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground font-mono font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Posted: </span>
                  <time dateTime={timeInfo.iso}>{timeInfo.formatted}</time>
                </div>
                {job.showSalary && job.salary && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                    <span>Compensation:</span>
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 relative z-10">
              {job.active ? (
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-xs sm:text-sm uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all group active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>Apply for this Position</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-xs uppercase tracking-wider bg-muted text-muted-foreground cursor-not-allowed opacity-70 whitespace-nowrap border border-slate-200/80 dark:border-white/10"
                >
                  <span>Position Closed</span>
                </button>
              )}
              <Link
                href={ROUTES.PUBLIC.CAREERS}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-foreground/80 hover:text-foreground bg-card/90 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 hover:border-primary/40 transition-all text-center shadow-xs"
              >
                <span>← Back to all open roles</span>
              </Link>
            </div>
          </div>

          {/* Grid Layout: Main Specs + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left items-start">
            {/* Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Mission & Overview */}
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-medium tracking-tight font-heading text-foreground">
                  {sharedDefaults.missionHeading || 'The Mission & Role Impact'}
                </h2>
                <div className="p-6 sm:p-7 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card">
                  <p className="text-sm sm:text-base text-muted-foreground font-light dark:font-normal leading-relaxed">
                    {missionText}
                  </p>
                </div>
              </section>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight font-heading text-foreground">
                    Key Architectural Responsibilities
                  </h2>
                  <div className="space-y-3">
                    {job.responsibilities.map((resp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card hover:border-primary/40 transition-colors group"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-foreground/90 font-light dark:font-normal leading-relaxed">
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
                  <h2 className="text-xl sm:text-2xl font-medium tracking-tight font-heading text-foreground">
                    Technical Qualifications
                  </h2>
                  <div className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card hover:border-primary/40 transition-colors group"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-foreground/90 font-light dark:font-normal leading-relaxed">
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Skills Chips */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="pt-3">
                      <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider block mb-2.5">
                        Core Technology Stack
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-foreground shadow-xs"
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
                  <h2 className="text-lg sm:text-xl font-medium tracking-tight font-heading text-foreground">
                    Bonus / Nice-to-Have Background
                  </h2>
                  <div className="p-6 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card">
                    <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground list-disc list-inside font-light dark:font-normal">
                      {job.niceToHave.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar (4 cols) - Sticky */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Role Snapshot Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card space-y-5 text-left">
                <h3 className="text-base font-medium tracking-tight text-foreground pb-3.5 border-b border-slate-200/80 dark:border-white/10">
                  Role Overview
                </h3>

                <div className="space-y-4 text-xs font-light dark:font-normal">
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Role Category</span>
                    <span className="text-foreground font-medium">{job.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Work Modality</span>
                    <span className="text-foreground font-medium">{job.workMode || 'Remote'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Geographic Location</span>
                    <span className="text-foreground font-medium">{job.geographicLocation || 'Worldwide'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Experience Requirement</span>
                    <span className="text-foreground font-medium">
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
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                        {job.salary}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Date Published</span>
                    <time dateTime={timeInfo.iso} className="text-foreground font-mono font-medium">
                      {timeInfo.formatted}
                    </time>
                  </div>
                </div>

                {job.active && (
                  <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
                    <a
                      href="#apply"
                      className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs uppercase tracking-wider shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Experienced Engineering Culture & Candidate Showcase Banner (Right Sidebar) */}
              {sharedDefaults.jobDetailImage?.enabled !== false && sharedDefaults.jobDetailImage?.imageUrl && (
                <div className="rounded-2xl overflow-hidden bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card p-3 space-y-3 group text-left transition-all hover:border-primary/40">
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-200/80 dark:border-white/10 shadow-inner">
                    <Image
                      src={sharedDefaults.jobDetailImage.imageUrl}
                      alt={
                        sharedDefaults.jobDetailImage.altText ||
                        'Experienced architect candidate presenting cloud system architecture to Astraiv engineering leaders'
                      }
                      fill
                      sizes="(max-width: 1024px) 100vw, 380px"
                      className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                    />
                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Live Glassmorphism Badge Overlay */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-md text-white text-[11px] font-mono font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                        <span className="font-medium tracking-tight">
                          {sharedDefaults.jobDetailImage.badgeText || 'Elite Architecture Swarm'}
                        </span>
                      </div>
                      {sharedDefaults.jobDetailImage.badgeSubtext && (
                        <span className="text-[10px] font-mono font-medium text-cyan-200/90 bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/10 hidden sm:inline">
                          {sharedDefaults.jobDetailImage.badgeSubtext}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-2 pb-1.5 pt-0.5 space-y-1">
                    <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-primary dark:text-cyan-400 block">
                      {sharedDefaults.jobDetailImage.title || 'Experienced Architecture Swarm'}
                    </span>
                    {sharedDefaults.jobDetailImage.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed font-light dark:font-normal">
                        {sharedDefaults.jobDetailImage.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Engineering Culture Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card space-y-4 text-left">
                <div className="text-primary dark:text-cyan-400 font-mono font-medium text-xs uppercase tracking-wider">
                  {sharedDefaults.astraivStandardHeading || 'The Astraiv Standard'}
                </div>
                <h4 className="text-sm font-medium text-foreground">
                  {sharedDefaults.astraivStandardSubtitle || 'Why Engineers Love Building Here'}
                </h4>
                <ul className="space-y-3 text-xs text-muted-foreground font-light dark:font-normal">
                  {astraivPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary dark:text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Referral Banner (Configurable / Hideable) */}
              {job.showReferralBonus !== false && (
                <div className="p-6 sm:p-7 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card text-left">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {sharedDefaults.referralHeading || 'Know an exceptional architect?'}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-light dark:font-normal">
                    {referralText}
                  </p>
                  <Link
                    href="/contact"
                    className="text-xs font-medium text-primary dark:text-cyan-400 hover:underline inline-flex items-center gap-1 group"
                  >
                    <span>Submit Candidate Referral</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Full-Width Engineering Culture, Hiring Roadmap & Application Form */}
          <div className="space-y-16 text-left mt-16">
            {/* What We Offer / Benefits (Full-Width Responsive 4-Column Grid) */}
            {benefitsList && benefitsList.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono font-medium uppercase tracking-wider text-primary dark:text-cyan-400">
                    Engineering Culture & Benefits
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-tight font-heading text-foreground">
                    {sharedDefaults.benefitsHeading || 'What We Offer & Engineering Culture'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {benefitsList.map((benefit: string, i: number) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4 shadow-card hover:border-primary/40 transition-all group"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-cyan-400 shrink-0 border border-primary/20">
                        <Check className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm text-foreground/90 font-light dark:font-normal leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4-Stage Interview Process (Full-Width Responsive Roadmap Grid) */}
            {interviewStages && interviewStages.length > 0 && (
              <section className="p-8 sm:p-10 rounded-2xl bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-card space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                  <span className="text-xs font-mono font-medium uppercase tracking-wider text-primary dark:text-cyan-400">
                    Hiring Roadmap
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-tight font-heading text-foreground mt-1">
                    {sharedDefaults.interviewRoadmapHeading || `Transparent ${interviewStages.length}-Stage Interview Process`}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed font-light dark:font-normal">
                    {sharedDefaults.interviewRoadmapSubtitle || 'Fast, respectful, and zero algorithmic trick questions. We respect your engineering time.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                  {interviewStages.map((stage: { num: string; title: string; desc: string }) => (
                    <div
                      key={stage.num}
                      className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-primary/40 transition-all relative overflow-hidden group flex flex-col justify-between"
                    >
                      <div>
                        <span className="inline-flex items-center text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20 mb-3">
                          Stage {stage.num}
                        </span>
                        <h3 className="text-sm font-medium text-foreground mb-2 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                          {stage.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2 font-light dark:font-normal">{stage.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Application Form Component */}
            {job.active && (
              <div id="apply" className="scroll-mt-28">
                <JobApplicationForm
                  jobId={job.id}
                  roleTitle={job.title}
                  roleSlug={job.slug}
                  department={job.department}
                  experienceLevel={job.experienceLevel}
                  applicationSubheading={sharedDefaults.applicationSubheading}
                  defaultPrivacyText={sharedDefaults.defaultPrivacyText}
                  applicationSlaNote={sharedDefaults.applicationSlaNote}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
