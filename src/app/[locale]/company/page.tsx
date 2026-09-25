import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/views/layouts/navbar';
import { Footer } from '@/views/layouts/footer';
import { WhySection } from '@/views/sections/why-section';
import { ProcessSection } from '@/views/sections/process-section';
import { ContactSection } from '@/views/sections/contact-section';
import { getPublicJobOpenings } from '@/controllers/public-data.controller';
import {
  Zap,
  Target,
  Globe2,
  Layers,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  DollarSign,
  Clock,
  Users,
  Compass,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 300;

interface CompanyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Company | Astraiv Technologies',
    description:
      'Learn about Astraiv Technologies: our engineering philosophy, collaborative process, senior talent, verified governance credentials, careers, and flexible engagement models.',
    path: '/company',
    locale,
  });
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jobOpenings = await getPublicJobOpenings();

  const pillars = [
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: 'Architectural Rigor',
      description:
        'We reject fragile codebases and short-term hacks. Every platform is designed on modular, strictly typed architectures built to withstand rapid enterprise scale.',
    },
    {
      icon: <Target className="h-6 w-6 text-secondary" />,
      title: 'Conversion Psychology',
      description:
        'Software must feel as good as it functions. We blend cognitive interaction principles with high aesthetics to build instant user trust and authority.',
    },
    {
      icon: <Zap className="h-6 w-6 text-accent" />,
      title: 'Sprint Velocity',
      description:
        'Transparent two-week sprint cadences, automated CI/CD checks, and direct founder-level communication remove red tape and accelerate time-to-market.',
    },
    {
      icon: <Globe2 className="h-6 w-6 text-emerald-500" />,
      title: 'Global Mission',
      description:
        'Partnering with forward-thinking enterprises and ambitious startups worldwide to deploy battle-tested web, cloud, and autonomous AI infrastructure.',
    },
  ];

  const collaborationPhases = [
    {
      step: '01',
      title: 'Architectural Discovery & RFC',
      summary:
        'We define data schemas, API contracts, security perimeters, and non-functional requirements in an immutable RFC before writing production code.',
      deliverable: 'Technical Specification RFC & Architecture Blueprint',
    },
    {
      step: '02',
      title: 'Bi-Weekly Sprint Rhythm',
      summary:
        'Two-week deterministic sprint iterations with direct engineering team communication (Slack/Teams), transparent burndown, and staging preview deployments.',
      deliverable: 'Live Staging Builds & Sprint Burndown Logs',
    },
    {
      step: '03',
      title: 'Deterministic Quality Gates',
      summary:
        'Automated CI/CD validation, strict TypeScript static typing, multi-region container tests, and automated regression benchmarks guarantee zero drift.',
      deliverable: 'Automated Test Suites & Security Audit Gate',
    },
    {
      step: '04',
      title: 'Zero-Downtime Deployment & SLA Handover',
      summary:
        'Production cutover with blue-green failover, full intellectual property and repository handover, client portal access, and a 30-day warranty.',
      deliverable: 'Production Verification, SLA Guarantee & Full IP Transfer',
    },
  ];

  const accolades = [
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      badge: 'ISO Certification',
      title: 'ISO 9001:2015 Quality Management',
      description:
        'Standardized software development lifecycle protocols, strict peer reviews, and automated regression tests ensuring zero-drift delivery.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
      badge: 'Security Standard',
      title: 'ISO/IEC 27001:2022 Information Security',
      description:
        'Enterprise-level data protection, cryptographic key rotation, and strict zero-trust operational security applied across every client repository.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      badge: 'Compliance Standard',
      title: 'SOC-2 Type II Compliance Ready',
      description:
        'Audited data processing integrity, strict role-based access governance, and comprehensive privacy safeguards for high-stakes enterprise data.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      badge: 'Cloud Partner',
      title: 'AWS & Cloudflare Partner Architecture',
      description:
        'Certified cloud solutions architects engineering fault-tolerant serverless clusters, global edge caching, and scalable object stores.',
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-cyan-500" />,
      badge: 'Reliability Honors',
      title: '99.99% On-Time SLA Delivery',
      description:
        'Predictable two-week sprint cadences, transparent milestone burndown, and SLA commitments backed by contractual performance guarantees.',
    },
    {
      icon: <Award className="h-6 w-6 text-purple-500" />,
      badge: 'Industry Recognition',
      title: 'Top Rated B2B Software Engineering',
      description:
        'Consistently validated 4.9/5 star ratings from founders, CTOs, and product leaders for high-velocity AI automation and web app delivery.',
    },
  ];

  const quickNav = [
    { label: 'About Us', href: '#about' },
    { label: 'Why Astraiv', href: '#why-us' },
    { label: 'Our Process', href: '#process' },
    { label: 'Rewards & Accolades', href: '#rewards-accolades' },
    { label: 'Engagement Models', href: '#engagement-models' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Company', path: '/company' },
        ]}
      />
      {/* Global Navigation */}
      <Navbar />

      <main className="flex-grow z-10 relative">
        {/* 1. About Us: Mission & Philosophy */}
        <section
          id="about"
          className="pt-28 pb-16 md:pt-36 md:pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center scroll-mt-24 relative"
        >
          {/* Ambient Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Quick Jump Navigation Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl p-1.5 bg-card/80 dark:bg-slate-900/80 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl shadow-xs mb-10">
            {quickNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Eyebrow & Hero Statement */}
          <div className="max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Organizational Identity & Values</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 text-foreground">
              Engineering Intelligent Systems <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                With Architectural Rigor.
              </span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
              Astraiv Technologies partners with forward-thinking enterprises to design, develop, and deploy
              mission-critical software, custom AI models, and scalable cloud infrastructure. We eliminate
              technical bottlenecks and accelerate engineering velocity.
            </p>
          </div>

          <h2 className="sr-only">Our Core Engineering Pillars</h2>

          {/* Mission & Philosophy Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left mb-12">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-7 bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-md hover:border-primary/30 dark:hover:border-accent/30 transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-border/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Canonical Linkouts: Services & Technology */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-4xl text-left">
            <Link
              href={ROUTES.PUBLIC.SERVICES}
              className="p-5 rounded-2xl bg-card/60 dark:bg-slate-900/50 border border-border/60 hover:border-primary/50 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-0.5">
                  Canonical Services
                </span>
                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Explore All 8 Core Engineering Disciplines →
                </h4>
                <span className="text-xs text-muted-foreground">
                  AI Systems, Cloud Infrastructure, Custom Software, Web & Mobile
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-3" />
            </Link>

            <Link
              href={ROUTES.PUBLIC.TECHNOLOGY}
              className="p-5 rounded-2xl bg-card/60 dark:bg-slate-900/50 border border-border/60 hover:border-primary/50 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500 block mb-0.5">
                  Technology Spectrum
                </span>
                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Inspect Our Architecture & Tech Radar →
                </h4>
                <span className="text-xs text-muted-foreground">
                  Next.js 16, TypeScript, Rust, Python, Postgres & AWS
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-3" />
            </Link>
          </div>
        </section>

        {/* 2. Why Astraiv Section (Detailed Variant) */}
        <div id="why-us" className="scroll-mt-24">
          <WhySection variant="detailed" />

          {/* Canonical Linkouts: Case Studies & Testimonials */}
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto text-left">
              <Link
                href={ROUTES.PUBLIC.CASE_STUDIES}
                className="p-5 rounded-2xl bg-card/60 dark:bg-slate-900/50 border border-border/60 hover:border-primary/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 block mb-0.5">
                    Production Case Studies
                  </span>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Explore Enterprise Deployments & Architecture →
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Inspect high-frequency ledgers, multi-tenant analytics, and IoT mesh systems
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </Link>

              <Link
                href={ROUTES.PUBLIC.WORK_TESTIMONIALS}
                className="p-5 rounded-2xl bg-card/60 dark:bg-slate-900/50 border border-border/60 hover:border-primary/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 block mb-0.5">
                    Verified Endorsements
                  </span>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Read All Client Reviews & Testimonials →
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    Direct feedback from enterprise CTOs, VP of Engineering, and startup founders
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Our Process: 6-Stage Engineering Lifecycle & Quality Gates */}
        <div id="process" className="scroll-mt-24">
          <ProcessSection variant="detailed" />

          {/* Execution Cadence & Sprint Delivery */}
          <div className="max-w-7xl mx-auto px-6 pb-20">
            <div className="p-8 sm:p-10 rounded-3xl bg-card/60 dark:bg-slate-900/40 border border-border/60 dark:border-slate-800/80">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-2">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Execution Cadence</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-heading">
                  Asynchronous Sprint Cadence &amp; Transparency
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                  How our distributed squad stays locked in alignment with your executive and engineering leaders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                {collaborationPhases.map((phase) => (
                  <div
                    key={phase.step}
                    className="p-5 bg-card/90 dark:bg-slate-900/80 border border-border/60 dark:border-slate-800/80 rounded-xl flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-primary block mb-2">
                        Phase {phase.step}
                      </span>
                      <h4 className="text-sm font-bold text-foreground mb-1">
                        {phase.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        {phase.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border/40 text-[11px] font-semibold text-primary/90 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{phase.deliverable}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Rewards, Accolades & Governance */}
        <section
          id="rewards-accolades"
          className="py-20 md:py-28 px-6 bg-background relative scroll-mt-24 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-3">
                <Award className="h-3.5 w-3.5" />
                <span>Industry Standards & Governance</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4">
                Rewards, Certifications & Accolades
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                Our commitment to architectural precision, enterprise data protection, and continuous velocity is validated by rigorous global compliance benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accolades.map((acc) => (
                <div
                  key={acc.title}
                  className="p-7 bg-card/90 dark:bg-slate-900/80 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-md hover:border-primary/40 dark:hover:border-accent/40 transition-all flex flex-col justify-between group text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent border border-primary/20 dark:border-accent/20">
                        {acc.badge}
                      </span>
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                        {acc.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-2 leading-snug">
                      {acc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                      {acc.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-border/40 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>Verified Audit Status</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Compliant
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Link to Dedicated Accolades Directory */}
            <div className="mt-12 text-center">
              <Link
                href={ROUTES.PUBLIC.REWARDS_ACCOLADES}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 text-xs sm:text-sm font-bold transition-all group cursor-pointer"
              >
                <span>Explore Full Accolades, Certifications & Governance Directory</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Flexible Engagement Models (Evaluated & Reframed) */}
        <section
          id="engagement-models"
          className="py-20 md:py-28 px-6 bg-slate-50/50 dark:bg-slate-900/20 border-t border-border/30 dark:border-slate-800/60 relative scroll-mt-24"
        >
          {/* Backwards compatibility anchor */}
          <span id="pricing" className="scroll-mt-24" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-accent/10 border border-primary/20 dark:border-accent/20 text-primary dark:text-accent text-xs font-bold uppercase tracking-wider mb-3">
                <DollarSign className="h-3.5 w-3.5" />
                <span>Commercial Frameworks</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4">
                Flexible Engagement Models
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                Enterprise software engineering and AI implementations depend heavily on architectural scope, legacy constraints, and velocity goals. We provide deterministic engagement structures built for capital efficiency and contractual transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              <div className="p-8 rounded-2xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800/80 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div>
                  <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-5">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Milestone-Based</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                    Fixed-scope execution with crystal-clear deliverables, contractual acceptance criteria, and guaranteed budgets. Ideal for MVPs, scoping sprints, and system modernizations.
                  </p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground mb-8">
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Guaranteed scope & deadline
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Milestone acceptance gates
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      30-day defect warranty
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-semibold text-primary">
                  Structured Milestones
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-card/90 dark:bg-slate-900/80 border-2 border-primary/50 dark:border-blue-500/50 shadow-md flex flex-col justify-between relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary text-white shadow-xs">
                  Most Popular
                </span>
                <div>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 w-fit mb-5">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Agile Sprint Retainer</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                    Bi-weekly sprint allocations offering agile flexibility for rapid iteration, continuous deployment, and evolving feature backlogs.
                  </p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground mb-8">
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Two-week sprint cadences
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Dynamic backlog reprioritization
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Direct Slack/Teams integration
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-semibold text-primary">
                  Bi-Weekly Sprints
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800/80 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
                <div>
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit mb-5">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Dedicated Squad</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                    A dedicated, self-contained engineering pod (Architect, Senior Full-Stack Developers, QA) embedded seamlessly within your product organization.
                  </p>
                  <ul className="space-y-2.5 text-xs text-muted-foreground mb-8">
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Dedicated senior engineering pod
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Enterprise SLA & SOC-2 compliance
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      Full IP & architectural ownership
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border/40 text-xs font-semibold text-primary">
                  Enterprise Scale
                </div>
              </div>
            </div>

            {/* Canonical Linkout to Dedicated Pricing Plans & Currency Calculator */}
            <div className="mt-12 text-center">
              <Link
                href={ROUTES.PUBLIC.PRICING}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 text-xs sm:text-sm font-bold transition-all group"
              >
                <span>View Complete Pricing Plans & Interactive Currency Calculator</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Careers Culture & Team Spotlight (Streamlined; Extensive Job Board in /careers) */}
        <section
          id="careers"
          className="py-20 md:py-28 px-6 bg-background border-t border-border/30 dark:border-slate-800/60 relative scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto text-left">
            <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/10 border border-border/80 dark:border-slate-800 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  <Users className="h-3.5 w-3.5" />
                  <span>Careers & Team Culture</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                  Work With Senior Architects, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                    Not Bureaucrats.
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  We are a 100% remote-first engineering collective. No micromanagement, no useless status meetings. We value written RFCs, clean code, and deep uninterrupted focus time.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>100% Remote Global Autonomy</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Async Deep Work Culture</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Top-Tier Global Pay & Equity</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{jobOpenings.length} Active Positions Open</span>
                </span>

                <Link
                  href={ROUTES.PUBLIC.CAREERS}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm font-bold transition-all shadow-md shadow-primary/20 group cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Open Positions & Apply</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <span className="text-[11px] text-muted-foreground">
                  Reviewed by engineering founders within 48h
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Contact Consultation Section */}
        <section id="contact" className="scroll-mt-24">
          <ContactSection />
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
