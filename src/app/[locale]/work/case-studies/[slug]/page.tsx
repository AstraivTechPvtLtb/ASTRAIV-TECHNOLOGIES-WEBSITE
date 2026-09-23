import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Navbar, Footer } from '@/views';
import {
  getPublishedCaseStudyBySlug,
  getCaseStudyRelationalContext,
  generateCmsMetadata,
} from '@/controllers/cms.controller';
import { getCaseStudyRelationships } from '@/lib/relationships';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Zap,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  Quote,
  Clock,
  Code2,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  Workflow,
  Wrench,
  Boxes,
  MessageSquare,
} from 'lucide-react';
import { ROUTES } from '@/routes';
import { ServiceIcon } from '@/views/ui/service-icon';
import { BreadcrumbSchema, createPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface CaseStudyDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyDetailPageProps) {
  const { locale, slug } = await params;
  const project = await getPublishedCaseStudyBySlug(slug);

  if (!project) {
    return createPageMetadata({
      title: 'Case Study Not Found | Astraiv Technologies',
      noIndex: true,
      locale,
    });
  }

  return generateCmsMetadata({
    title: `${project.title} | Case Study | Astraiv Technologies`,
    description: project.summary || project.challenge,
    path: `/work/case-studies/${project.slug}`,
    image: project.imageSrc,
    locale,
    type: 'article',
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailPageProps) {
  const { locale, slug } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Retrieve published case study, strictly approved testimonial, and relational context
  const context = await getCaseStudyRelationalContext(slug);

  if (!context || !context.project) {
    notFound();
  }

  const {
    project,
    relatedServices,
    relatedSolutions,
    relatedIndustry,
    relatedCaseStudies,
    testimonial: canonicalTestimonial,
  } = context;

  // Resolve bidirectional relationships combining live published CMS data with fallback definitions
  const baseRelationships = getCaseStudyRelationships(project);
  const relationships = {
    relatedServices: relatedServices && relatedServices.length > 0 ? relatedServices : baseRelationships.relatedServices,
    relatedSolutions: relatedSolutions && relatedSolutions.length > 0 ? relatedSolutions : baseRelationships.relatedSolutions,
    relatedIndustry: relatedIndustry || baseRelationships.relatedIndustry,
    relatedCaseStudies: relatedCaseStudies && relatedCaseStudies.length > 0 ? relatedCaseStudies : baseRelationships.relatedCaseStudies,
    cta: baseRelationships.cta,
  };

  const badgeIconNode =
    project.badgeIcon === 'Zap' ? (
      <Zap className="h-4 w-4 text-blue-400" />
    ) : project.badgeIcon === 'Cpu' ? (
      <Cpu className="h-4 w-4 text-purple-400" />
    ) : (
      <ShieldCheck className="h-4 w-4 text-emerald-400" />
    );

  const projectTypeColor =
    project.projectType === 'Client Project'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : project.projectType === 'Internal Project'
      ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
      : project.projectType === 'Concept Project'
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      : 'bg-blue-500/15 text-blue-400 border-blue-500/30';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: project.summary,
    image: project.imageSrc,
    author: {
      '@type': 'Organization',
      name: 'Astraiv Technologies',
      url: 'https://www.astraivtechnologies.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Astraiv Technologies',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.astraivtechnologies.com/logo-full.png',
      },
    },
    about: {
      '@type': 'Thing',
      name: project.industryName,
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: 'Case Studies', path: '/work/case-studies' },
          { name: project.title, path: `/work/case-studies/${project.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-20 flex-grow z-10 relative">
        {/* Ambient Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* ========================================================================= */}
          {/* SECTION 1: PROJECT HERO                                                   */}
          {/* ========================================================================= */}
          <section id="hero" className="mb-12 text-left">
            {/* Breadcrumbs Navigation */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-semibold text-muted-foreground">
              <Link href={ROUTES.PUBLIC.HOME} className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href={ROUTES.PUBLIC.WORK} className="hover:text-primary transition-colors">
                Work
              </Link>
              <span>/</span>
              <Link href={ROUTES.PUBLIC.CASE_STUDIES} className="hover:text-primary transition-colors">
                Case Studies
              </Link>
              <span>/</span>
              <span className="text-foreground truncate max-w-xs sm:max-w-md">{project.title}</span>
            </div>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border backdrop-blur-md ${projectTypeColor}`}>
                {project.projectType}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {badgeIconNode}
                <span>{project.category}</span>
              </span>

              {project.timeline && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-slate-100 dark:bg-slate-800/80 border border-border/60">
                  <Clock className="h-3 w-3" />
                  <span>{project.timeline}</span>
                </span>
              )}
            </div>

            {/* Title & Summary */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading leading-tight mb-4">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl font-medium mb-8">
              {project.summary}
            </p>

            {/* Visual Hero Showcase with Metric Pill */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[460px] rounded-3xl overflow-hidden border border-border/70 dark:border-slate-800 bg-slate-950 shadow-xl">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 950px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/10" />

              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
                <div className="p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                    {project.metricLabel}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                    {project.metric}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900/80 border border-white/15 text-slate-200 backdrop-blur-md">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    <span>{project.client}</span>
                  </span>

                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${
                    project.verifiedOutcome
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{project.credibilityBadge}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: CLIENT / PROJECT CONTEXT                                      */}
          {/* ========================================================================= */}
          <section id="context" className="mb-12 text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                  02 // CLIENT & PROJECT CONTEXT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-3">
                Operational Background & Scope
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium mb-4">
                {project.clientContext}
              </p>

              {/* Strict Credibility Clarification Note (For Internal, Concept, Reference) */}
              {project.credibilityNote && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs sm:text-sm leading-relaxed">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Credibility & Benchmark Notice:</span>
                    <span>{project.credibilityNote}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: INDUSTRY                                                      */}
          {/* ========================================================================= */}
          <section id="industry" className="mb-12 text-left">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/80 dark:bg-slate-900/50 border border-border/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                  03 // DOMAIN VERTICAL & COMPLIANCE
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Industry Focus: {project.industryName}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Engineered specifically to solve compliance constraints, high-concurrency demands, and operational patterns within {project.industryName}.
                </p>
              </div>

              {relationships.relatedIndustry && (
                <Link
                  href={ROUTES.PUBLIC.INDUSTRY_DETAIL(relationships.relatedIndustry.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card dark:bg-slate-800 hover:bg-primary hover:text-white border border-border/80 text-xs font-bold text-foreground transition-all shrink-0 shadow-xs"
                >
                  <span>Explore {project.industryName} Solutions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 4: CHALLENGE                                                      */}
          {/* ========================================================================= */}
          <section id="challenge" className="mb-12 text-left">
            <div className="p-7 sm:p-8 rounded-3xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  04 // THE CORE CHALLENGE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-4">
                Operational Bottlenecks & Scale Constraints
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium mb-6">
                {project.challenge}
              </p>

              {/* Challenge Details breakdown */}
              {project.challengeDetails && project.challengeDetails.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/50 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Critical Pain Points Identified:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.challengeDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 text-xs leading-relaxed text-muted-foreground flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 5: REQUIREMENTS                                                   */}
          {/* ========================================================================= */}
          <section id="requirements" className="mb-12 text-left">
            <div className="p-7 sm:p-8 rounded-3xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                  05 // ARCHITECTURAL REQUIREMENTS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-4">
                Functional & Non-Functional Engineering Criteria
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {project.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-muted-foreground font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 6: ASTRAIV SOLUTION                                              */}
          {/* ========================================================================= */}
          <section id="solution" className="mb-12 text-left">
            <div className="p-7 sm:p-8 rounded-3xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary dark:text-blue-400">
                  06 // THE ASTRAIV SOLUTION
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-4">
                Engineered Full-Stack Software Response
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium mb-6">
                {project.solution}
              </p>

              {/* Solution Details */}
              {project.solutionDetails && project.solutionDetails.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/50 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Core Architectural Deliverables:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.solutionDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-primary/5 dark:bg-blue-500/5 border border-primary/20 dark:border-blue-500/20 text-xs leading-relaxed text-muted-foreground flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 7: ARCHITECTURE / APPROACH                                        */}
          {/* ========================================================================= */}
          <section id="architecture" className="mb-12 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                07 // System Architecture & Technical Strategy
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-3xl mb-6">
              {project.architectureApproach}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {project.architectureHighlights.map((arch, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/60 dark:border-slate-800/80 flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-primary dark:text-blue-400">
                        PILLAR 0{idx + 1}
                      </span>
                      {arch.architecturalPattern && (
                        <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                          {arch.architecturalPattern}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{arch.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                      {arch.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 8: TECHNOLOGIES USED                                              */}
          {/* ========================================================================= */}
          <section id="technologies" className="mb-12 text-left">
            <div className="p-7 sm:p-8 rounded-3xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                  08 // HARDENED PRODUCTION PRIMITIVES
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-6">
                Technologies Deployed in Production
              </h2>

              {project.techStackByCategory && project.techStackByCategory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {project.techStackByCategory.map((stack, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-border/60 dark:border-slate-800"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2.5">
                        {stack.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {stack.items.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-0.5 text-xs font-semibold rounded-md bg-card dark:bg-slate-800 text-foreground border border-border/60 dark:border-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-foreground border border-border/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 9: DEVELOPMENT PROCESS                                           */}
          {/* ========================================================================= */}
          {project.developmentProcess && project.developmentProcess.length > 0 && (
            <section id="process" className="mb-12 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Workflow className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                  09 // Engineering Methodology & Delivery Roadmap
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-3xl mb-6">
                A rigorous four-phase agile engineering cadence designed to eliminate risk, maintain SOC-2 compliance, and execute seamless production cutovers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.developmentProcess.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/60 dark:border-slate-800 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-primary dark:text-blue-400">
                          PHASE {phase.phase}
                        </span>
                        {phase.duration && (
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {phase.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-2">{phase.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        {phase.description}
                      </p>
                    </div>

                    {phase.keyDeliverables && phase.keyDeliverables.length > 0 && (
                      <div className="pt-3 border-t border-border/40 dark:border-slate-800/80">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                          Milestones:
                        </span>
                        <ul className="space-y-1">
                          {phase.keyDeliverables.map((item, dIdx) => (
                            <li key={dIdx} className="text-[11px] text-foreground font-medium flex items-center gap-1.5">
                              <span className="h-1 w-1 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 10: MEASURABLE RESULTS                                            */}
          {/* ========================================================================= */}
          <section id="results" className="mb-12 text-left">
            <div className="p-7 sm:p-8 rounded-3xl bg-card/90 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      10 // MEASURABLE OUTCOMES
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    Verifiable Technical & Business Impact
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{project.credibilityBadge}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {project.measurableResults && project.measurableResults.length > 0 ? (
                  project.measurableResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/70 border border-border/60 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono block mb-1">
                          {result.metric}
                        </span>
                        <span className="text-xs font-bold text-foreground block mb-2">
                          {result.label}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {result.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-border/40 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {result.isVerified ? '✓ Production Verified' : 'Simulated Benchmark'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950/60 col-span-full">
                    <span className="text-2xl font-bold text-white font-mono">{project.metric}</span>
                    <span className="text-xs text-slate-400 block">{project.metricLabel}</span>
                  </div>
                )}
              </div>

              {/* Deliverables summary */}
              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-border/50">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Key Production Deliverables Deployed:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.deliverables.map((item, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 11: CLIENT TESTIMONIAL, IF AVAILABLE                              */}
          {/* ========================================================================= */}
          {(() => {
            const testimonialData = canonicalTestimonial
              ? {
                  text: canonicalTestimonial.review_text,
                  author: canonicalTestimonial.client_name,
                  role: canonicalTestimonial.role,
                  company: canonicalTestimonial.company,
                  avatar: canonicalTestimonial.avatar,
                  verified: true,
                }
              : project.clientQuote && project.clientQuote.verified
              ? project.clientQuote
              : null;

            if (!testimonialData) return null;

            return (
              <section id="testimonial" className="mb-14 text-left">
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card dark:from-blue-600/15 dark:via-slate-900 dark:to-slate-900 border border-primary/20 dark:border-blue-500/20 shadow-lg relative">
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="h-8 w-8 text-primary/40" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verified Client Endorsement</span>
                    </span>
                  </div>

                  <p className="text-base sm:text-xl text-foreground italic font-medium leading-relaxed mb-6">
                    &ldquo;{testimonialData.text}&rdquo;
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/40 dark:border-slate-800/60">
                    <div className="flex items-center gap-3.5">
                      {'avatar' in testimonialData && testimonialData.avatar ? (
                        <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0 border border-border/60">
                          <Image
                            src={testimonialData.avatar}
                            alt={testimonialData.author}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-11 w-11 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs font-mono shrink-0">
                          {testimonialData.author.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="text-base font-bold text-foreground block">
                          {testimonialData.author}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {testimonialData.role}
                          {testimonialData.company && ` • ${testimonialData.company}`}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={ROUTES.PUBLIC.WORK_TESTIMONIALS}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-blue-400 hover:text-primary/80 transition-colors"
                    >
                      <span>Explore All Testimonials</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* ========================================================================= */}
          {/* SECTION 12: RELATED SERVICES                                              */}
          {/* ========================================================================= */}
          {relationships.relatedServices && relationships.relatedServices.length > 0 && (
            <section id="related-services" className="mb-12 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    12 // Related Engineering Services (What Astraiv Does)
                  </h3>
                </div>
                <Link
                  href={ROUTES.PUBLIC.SERVICES}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>All Services</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relationships.relatedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={ROUTES.PUBLIC.SERVICE_DETAIL(service.slug)}
                    className="p-5 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/60 hover:border-primary/40 transition-all group flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <ServiceIcon name={service.icon} className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {service.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                        {service.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {service.shortDesc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary">
                      <span>Explore Service Discipline</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 13: RELATED SOLUTIONS                                             */}
          {/* ========================================================================= */}
          {relationships.relatedSolutions && relationships.relatedSolutions.length > 0 && (
            <section id="related-solutions" className="mb-12 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    13 // Related Business Solutions (Problems Solved)
                  </h3>
                </div>
                <Link
                  href={ROUTES.PUBLIC.SOLUTIONS}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>All Solutions</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relationships.relatedSolutions.map((solution) => (
                  <Link
                    key={solution.slug}
                    href={ROUTES.PUBLIC.SOLUTION_DETAIL(solution.slug)}
                    className="p-5 rounded-2xl bg-card/80 dark:bg-slate-900/70 border border-border/60 hover:border-blue-500/40 transition-all group flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded-md">
                          {solution.categoryLabel}
                        </span>
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          {solution.metric.value}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-blue-400 transition-colors mb-1.5">
                        {solution.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {solution.shortDesc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-blue-400">
                      <span>View Solution Architecture</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 14: RELATED INDUSTRY                                              */}
          {/* ========================================================================= */}
          {relationships.relatedIndustry && (
            <section id="related-industry" className="mb-12 text-left">
              <div className="p-6 sm:p-7 rounded-3xl bg-card/80 dark:bg-slate-900/70 border border-border/60 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      14 // RELATED INDUSTRY VERTICAL
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {relationships.relatedIndustry.label}: {relationships.relatedIndustry.tagline}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                    {relationships.relatedIndustry.challenge}
                  </p>
                </div>

                <Link
                  href={ROUTES.PUBLIC.INDUSTRY_DETAIL(relationships.relatedIndustry.slug)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shrink-0 shadow-sm"
                >
                  <span>Explore {relationships.relatedIndustry.label}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 15: RELATED CASE STUDIES                                          */}
          {/* ========================================================================= */}
          {relationships.relatedCaseStudies && relationships.relatedCaseStudies.length > 0 && (
            <section id="related-case-studies" className="mb-14 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    15 // Related Case Studies
                  </h3>
                </div>
                <Link
                  href={ROUTES.PUBLIC.CASE_STUDIES}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>All Case Studies</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relationships.relatedCaseStudies.map((rel) => (
                  <Link
                    key={rel.id}
                    href={ROUTES.PUBLIC.CASE_STUDY_DETAIL(rel.slug)}
                    className="p-6 rounded-2xl bg-card/80 dark:bg-slate-900/80 border border-border/60 hover:border-primary/40 transition-all group flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                          {rel.category}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {rel.projectType}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {rel.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary">
                      <span>{rel.metric}</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Case Study &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 16: CONVERSION CTA                                                */}
          {/* ========================================================================= */}
          <section id="cta" className="text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-blue-900 text-white flex flex-col items-center justify-center gap-4 shadow-xl shadow-primary/20">
              <span className="text-xs font-extrabold uppercase tracking-widest bg-white/15 px-3.5 py-1 rounded-full text-white">
                16 // ARCHITECTURAL CONSULTATION
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
                Need Something Similar?
              </h2>
              <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
                Consult directly with our principal software architects to engineer a {project.category} solution tailored to your operational scale and compliance mandates.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <Link
                  href={relationships.cta.href || `/start-project?source_page=${encodeURIComponent(`/work/case-studies/${project.slug}`)}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-white text-slate-950 hover:bg-slate-100 transition-transform hover:scale-105 shadow-md"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/contact?project=${encodeURIComponent(project.slug)}#schedule`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md transition-transform hover:scale-105 shadow-md"
                >
                  <MessageSquare className="h-4 w-4 text-blue-300" />
                  <span>Talk to an Expert</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
