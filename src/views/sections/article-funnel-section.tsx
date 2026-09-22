'use client';

import { Link } from '@/i18n/routing';
import { ArrowRight, Sparkles, CheckCircle2, Layers, Cpu, BarChart3, MessageSquareCode } from 'lucide-react';
import type { ArticleFunnelRelationships } from '@/lib/insights-data';

interface ArticleFunnelSectionProps {
  funnel: ArticleFunnelRelationships;
  articleTitle: string;
}

export function ArticleFunnelSection({ funnel, articleTitle }: ArticleFunnelSectionProps) {
  const {
    primarySolution,
    primaryService,
    primaryCaseStudy,
    conversionCta,
  } = funnel;

  return (
    <section className="my-16 relative">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-blue-500/5 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />

      <div className="p-8 sm:p-12 rounded-[28px] border border-border/80 dark:border-slate-800 bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Enterprise Implementation Funnel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground font-heading">
            From Research to Production Deployment
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 leading-relaxed">
            How Astraiv translates the architectural concepts from &ldquo;{articleTitle}&rdquo; into hardened production software.
          </p>
        </div>

        {/* Step-by-Step 3-Node Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-12">
          {/* STEP 1: RELATED SOLUTION */}
          {primarySolution && (
            <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-background/80 dark:bg-slate-950/70 border border-border/70 dark:border-slate-800/90 hover:border-primary/40 dark:hover:border-accent/40 shadow-xs hover:shadow-md transition-all group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10.5px] font-black uppercase tracking-widest text-primary dark:text-blue-400 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>1. Related Solution</span>
                  </span>
                  {primarySolution.metric && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-blue-400/10 dark:text-blue-400 border border-primary/20">
                      {primarySolution.metric.value}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-2 leading-snug">
                  {primarySolution.title}
                </h3>

                <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5 line-clamp-3">
                  {primarySolution.shortDesc}
                </p>

                {primarySolution.features && primarySolution.features.length > 0 && (
                  <div className="space-y-1.5 mb-6">
                    {primarySolution.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-foreground/80 font-semibold">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={`/solutions/${primarySolution.slug}`}
                className="inline-flex items-center justify-between text-xs font-extrabold text-primary dark:text-accent hover:underline pt-4 border-t border-border/50 dark:border-slate-800 group/btn"
              >
                <span>Explore Solution</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          )}

          {/* STEP 2: RELATED SERVICE */}
          {primaryService && (
            <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-background/80 dark:bg-slate-950/70 border border-border/70 dark:border-slate-800/90 hover:border-primary/40 dark:hover:border-accent/40 shadow-xs hover:shadow-md transition-all group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10.5px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>2. Engineering Discipline</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Senior Squad
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-2 leading-snug">
                  {primaryService.title}
                </h3>

                <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5 line-clamp-3">
                  {primaryService.shortDesc}
                </p>

                {primaryService.features && primaryService.features.length > 0 && (
                  <div className="space-y-1.5 mb-6">
                    {primaryService.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-foreground/80 font-semibold">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={`/services/${primaryService.slug}`}
                className="inline-flex items-center justify-between text-xs font-extrabold text-primary dark:text-accent hover:underline pt-4 border-t border-border/50 dark:border-slate-800 group/btn"
              >
                <span>Explore Service</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          )}

          {/* STEP 3: RELATED CASE STUDY */}
          {primaryCaseStudy && (
            <div className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-background/80 dark:bg-slate-950/70 border border-border/70 dark:border-slate-800/90 hover:border-primary/40 dark:hover:border-accent/40 shadow-xs hover:shadow-md transition-all group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10.5px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>3. Production Proof</span>
                  </span>
                  {primaryCaseStudy.metric && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {primaryCaseStudy.metric}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary dark:group-hover:text-accent transition-colors mb-2 leading-snug">
                  {primaryCaseStudy.client}
                </h3>

                <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-5 line-clamp-3">
                  {primaryCaseStudy.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {primaryCaseStudy.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-card border border-border/50 text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/work/case-studies/${primaryCaseStudy.slug}`}
                className="inline-flex items-center justify-between text-xs font-extrabold text-primary dark:text-accent hover:underline pt-4 border-t border-border/50 dark:border-slate-800 group/btn"
              >
                <span>View Case Study</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          )}
        </div>

        {/* STEP 4: INTERACTIVE DISCUSSION & SCOPING CTA */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-blue-600/20 dark:via-slate-950 dark:to-slate-950 border border-primary/20 dark:border-blue-500/30 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-inner">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <MessageSquareCode className="h-3.5 w-3.5" />
              <span>Engineering Scoping Session</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight font-heading mb-2">
              {conversionCta.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
              {conversionCta.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href={conversionCta.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95 text-center"
            >
              <span>{conversionCta.buttonText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact#schedule"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl bg-card border border-border/70 hover:border-primary/40 text-foreground font-bold text-xs sm:text-sm transition-all text-center"
            >
              <span>Talk to an Expert</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
