'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Loader2, Sparkles, Briefcase } from 'lucide-react';
import { ContactForm } from './contact-form';
import { SpeculativeApplicationForm } from './speculative-application-form';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

interface ContactSectionProps {
  isPageHero?: boolean;
}

function ContactContent({ isPageHero = false }: ContactSectionProps) {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const typeParam = searchParams.get('type');

  // Determine if this visit is a recruitment speculative application
  const isSpeculative = Boolean(
    roleParam ||
    typeParam === 'speculative' ||
    typeParam === 'apply'
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10"
    >
      {/* Left Column: Context-Aware (Recruitment Speculative vs Sales Proposal) */}
      <motion.div variants={itemVariants} className="lg:col-span-6 flex flex-col gap-6 text-left">
        {isSpeculative ? (
          <>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Unsolicited & Speculative Recruitment</span>
            </div>

            {isPageHero ? (
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-heading leading-tight text-foreground">
                Work With Architects, <br />
                <span className="heading-gradient">Not Bureaucrats.</span>
              </h1>
            ) : (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-heading leading-tight text-foreground">
                Work With Architects, <br />
                <span className="heading-gradient">Not Bureaucrats.</span>
              </h2>
            )}

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-normal">
              Don&apos;t see your exact engineering specialty listed in our active openings? If you are a high-caliber systems engineer, compiler enthusiast, or autonomous AI architect, we always make room for exceptional talent.
            </p>

            {/* Quick action to explore current open roles */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/careers"
                className="group inline-flex items-center justify-center gap-2 w-full sm:w-80 px-7 py-3 rounded-xl bg-card border border-border/80 hover:border-primary text-foreground font-semibold text-xs sm:text-sm tracking-normal shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <Briefcase className="h-4 w-4 text-primary" />
                <span>View All Active Job Openings</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Direct Recruitment Channels */}
            <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-border/40 dark:border-slate-800/60">
              <a
                href="mailto:careers@astraiv.com"
                className="flex items-center gap-3.5 text-foreground/80 hover:text-primary dark:hover:text-blue-400 transition-colors group w-fit"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Recruitment & Founders Inbox
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">careers@astraiv.com</span>
                </div>
              </a>

              <a
                href="tel:+918167409664"
                className="flex items-center gap-3.5 text-foreground/80 hover:text-primary dark:hover:text-blue-400 transition-colors group w-fit"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Engineering Office Direct
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">+91 8167409664</span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 text-foreground/80 w-fit">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 border border-primary/20 dark:border-blue-400/20 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    Global Engineering Center
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">Ashoknagar, Kolkata · 100% Remote Autonomy</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-2">
              <ShieldCheck className="h-4 w-4 text-primary dark:text-cyan-400" />
              <span>Strict candidate confidentiality & direct founder review within 48h</span>
            </div>
          </>
        ) : (
          <>
            {isPageHero ? (
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-heading leading-tight text-foreground">
                Have an Idea? <br />
                <span className="heading-gradient">Let&apos;s Build It.</span>
              </h1>
            ) : (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-heading leading-tight text-foreground">
                Have an Idea? <br />
                <span className="heading-gradient">Let&apos;s Build It.</span>
              </h2>
            )}

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-normal">
              Tell us what you&apos;re building, what you&apos;re solving, or where you want to go next. We&apos;ll help you turn the vision into a scalable, high-conversion digital reality.
            </p>

            {/* Quick CTA button */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 w-full sm:w-95 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm tracking-normal shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Direct channels */}
            <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-border/40 dark:border-slate-800/60">
              <a
                href="mailto:info@astraivtechnologies.com"
                className="flex items-center gap-3.5 text-foreground/80 hover:text-primary dark:hover:text-blue-400 transition-colors group w-fit"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Email Inquiry
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">info@astraivtechnologies.com</span>
                </div>
              </a>

              <a
                href="tel:+918167409664"
                className="flex items-center gap-3.5 text-foreground/80 hover:text-primary dark:hover:text-blue-400 transition-colors group w-fit"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Direct Engineering Hotline
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">+91 8167409664</span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 text-foreground/80 w-fit">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 border border-primary/20 dark:border-blue-400/20 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    Headquarters
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">Ashoknagar, Kolkata</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-2">
              <ShieldCheck className="h-4 w-4 text-primary dark:text-cyan-400" />
              <span>Strict NDA & confidentiality guaranteed on all initial briefs</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Right Column: Speculative Candidate Form vs Sales Project Enquiry Form */}
      <motion.div id="contact-form-box" variants={itemVariants} className="lg:col-span-6 relative w-full">
        <span id="schedule" className="absolute -top-28 pointer-events-none" />
        <div className="absolute inset-0 bg-primary/10 dark:bg-blue-600/10 rounded-3xl blur-2xl pointer-events-none" />
        {isSpeculative ? (
          <SpeculativeApplicationForm initialRole={roleParam || 'Speculative Senior Architect'} />
        ) : (
          <ContactForm />
        )}
      </motion.div>
    </motion.div>
  );
}

export function ContactSection({ isPageHero = false }: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 md:py-28 px-6 relative w-full overflow-hidden scroll-mt-24">
      {/* Ambient background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-primary/10 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-secondary/10 dark:bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <Suspense
        fallback={
          <div className="w-full max-w-xl mx-auto p-12 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-center min-h-112.5">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <ContactContent isPageHero={isPageHero} />
      </Suspense>
    </section>
  );
}
