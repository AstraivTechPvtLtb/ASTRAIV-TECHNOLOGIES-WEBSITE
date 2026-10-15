'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Loader2, Briefcase, MessageSquare } from 'lucide-react';
import { ContactForm } from './contact-form';
import { SpeculativeApplicationForm } from './speculative-application-form';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import type { PublicCareersPageContent } from '@/models/types';

interface ContactSectionProps {
  isPageHero?: boolean;
  categories?: Array<{ id: string; name: string; slug: string }>;
  roles?: Array<string | { id: string; title: string; slug: string }>;
  careersContent?: PublicCareersPageContent;
}

function ContactContent({ isPageHero = false, categories, roles, careersContent }: ContactSectionProps) {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const typeParam = searchParams.get('type');

  // Determine if this visit is a recruitment speculative application
  const isSpeculative = Boolean(
    roleParam ||
    typeParam === 'speculative' ||
    typeParam === 'apply'
  );

  const specHeading = careersContent?.heroHeading || careersContent?.speculativePageCopy?.heading || 'Work With Architects,\nNot Bureaucrats.';
  const specSubheading = careersContent?.heroSubtitle || careersContent?.speculativePageCopy?.subheading || "We are always seeking exceptional architects, systems engineers, and ambitious fresh talent. Submit your background directly to our engineering founders.";
  const specBtnText = careersContent?.speculativePageCopy?.buttonText || 'View All Active Job Openings';
  const specBtnUrl = careersContent?.speculativePageCopy?.buttonUrl || '/careers';
  const specNotice = careersContent?.speculativePageCopy?.supportGuidance || 'Strict candidate privacy. Your submission is reviewed directly by our founding engineers under strict confidentiality.';
  const specImage = careersContent?.speculativeImage || {
    enabled: true,
    imageUrl: '/images/speculative-team-banner.jpg',
    altText: 'Astraiv Technologies engineering architects and emerging engineers collaborating on software architecture',
    badgeText: 'Open Engineering Swarm',
    badgeSubtext: 'Fresher & Experienced',
  };

  const contactEmailLabel = careersContent?.speculativePageCopy?.contactEmailLabel || 'Recruitment';
  const contactEmail = careersContent?.speculativePageCopy?.contactEmail || 'careers@astraivtechnologies.com';
  const contactPhoneLabel = careersContent?.speculativePageCopy?.contactPhoneLabel || 'Contact Us';
  const contactPhone = careersContent?.speculativePageCopy?.contactPhone || '+91 8167409664';
  const contactLocationLabel = careersContent?.speculativePageCopy?.contactLocationLabel || 'Global Engineering Center';
  const contactLocation = careersContent?.speculativePageCopy?.contactLocation || 'Ashoknagar, Kolkata · 100% Remote Autonomy';

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
      className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-2 sm:pt-4 relative z-10"
    >
      {/* Left Column: Context-Aware (Recruitment Speculative vs Sales Proposal) - Top-Left Aligned */}
      <motion.div variants={itemVariants} className="lg:col-span-6 flex flex-col gap-6 text-left">
        {isSpeculative ? (
          <>
            {isPageHero ? (
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-heading leading-tight text-foreground">
                {specHeading.includes('\n') ? (
                  <>
                    {specHeading.split('\n')[0]} <br />
                    <span className="heading-gradient font-medium">{specHeading.split('\n').slice(1).join('\n')}</span>
                  </>
                ) : (
                  <>
                    Work With Architects, <br />
                    <span className="heading-gradient font-medium">Not Bureaucrats.</span>
                  </>
                )}
              </h1>
            ) : (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-heading leading-tight text-foreground">
                {specHeading.includes('\n') ? (
                  <>
                    {specHeading.split('\n')[0]} <br />
                    <span className="heading-gradient font-medium">{specHeading.split('\n').slice(1).join('\n')}</span>
                  </>
                ) : (
                  <>
                    Work With Architects, <br />
                    <span className="heading-gradient font-medium">Not Bureaucrats.</span>
                  </>
                )}
              </h2>
            )}

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-light dark:font-normal">
              {specSubheading}
            </p>

            {/* Quick action to explore current open roles */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={specBtnUrl}
                className="group inline-flex items-center justify-center gap-2 w-full sm:w-80 px-6 py-3 rounded-xl filter-btn-gradient text-foreground font-medium text-xs sm:text-sm tracking-normal transition-all active:scale-95 cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-primary dark:text-cyan-400" />
                <span>{specBtnText}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Speculative Team Culture & Hiring Banner Image - between Button and Contact Details */}
            {specImage.enabled !== false && specImage.imageUrl && (
              <div className="relative w-full rounded-2xl overflow-hidden border border-border/80 dark:border-slate-800/80 bg-card/60 dark:bg-slate-900/60 aspect-16/9 feature-card-shadow group mt-1">
                <Image
                  src={specImage.imageUrl}
                  alt={specImage.altText || 'Astraiv Technologies engineering team collaborating on software architecture'}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/75 dark:bg-slate-900/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] text-slate-200 font-medium pointer-events-none">
                  <span className="flex items-center gap-1.5 font-medium tracking-tight text-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {specImage.badgeText || 'Open Engineering Swarm'}
                  </span>
                  <span className="text-[10.5px] text-slate-300 font-mono">
                    {specImage.badgeSubtext || 'Fresher & Experienced'}
                  </span>
                </div>
              </div>
            )}

            {/* Direct Recruitment Channels */}
            <div className="flex flex-col gap-3 mt-2 pt-6 border-t border-border/40 dark:border-slate-800/60">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-card/60 dark:bg-slate-900/40 border border-border/60 dark:border-slate-800/80 feature-card-shadow text-foreground/90 hover:text-primary dark:hover:text-cyan-300 hover:border-primary/40 transition-all group"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {contactEmailLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{contactEmail}</span>
                </div>
              </a>

              <a
                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-card/60 dark:bg-slate-900/40 border border-border/60 dark:border-slate-800/80 feature-card-shadow text-foreground/90 hover:text-primary dark:hover:text-cyan-300 hover:border-primary/40 transition-all group"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {contactPhoneLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{contactPhone}</span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-card/60 dark:bg-slate-900/40 border border-border/60 dark:border-slate-800/80 feature-card-shadow text-foreground/90">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-blue-400/20 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    {contactLocationLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">{contactLocation}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground pt-2">
              <ShieldCheck className="h-4 w-4 text-primary dark:text-cyan-400 shrink-0" />
              <span>{specNotice}</span>
            </div>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium skill-badge-gradient text-foreground w-fit shadow-xs">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>Project Scoping & Strategic Consulting</span>
            </div>

            {isPageHero ? (
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-heading leading-tight text-foreground">
                Have an Idea? <br />
                <span className="heading-gradient font-medium">Let&apos;s Build It.</span>
              </h1>
            ) : (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight font-heading leading-tight text-foreground">
                Have an Idea? <br />
                <span className="heading-gradient font-medium">Let&apos;s Build It.</span>
              </h2>
            )}

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-light dark:font-normal">
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
            <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-border/40 dark:border-slate-800/60">
              <a
                href="mailto:info@astraivtechnologies.com"
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-card/60 dark:bg-slate-900/40 border border-border/60 dark:border-slate-800/80 feature-card-shadow text-foreground/90 hover:text-primary dark:hover:text-cyan-300 hover:border-primary/40 transition-all group"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
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
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-card/60 dark:bg-slate-900/40 border border-border/60 dark:border-slate-800/80 feature-card-shadow text-foreground/90 hover:text-primary dark:hover:text-cyan-300 hover:border-primary/40 transition-all group"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-blue-400/20 group-hover:scale-105 transition-all shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Direct Engineering Hotline
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">+91 8167409664</span>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-card/60 dark:bg-slate-900/40 border border-border/60 dark:border-slate-800/80 feature-card-shadow text-foreground/90">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-blue-400/20 shrink-0">
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
              <ShieldCheck className="h-4 w-4 text-primary dark:text-cyan-400 shrink-0" />
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
          <SpeculativeApplicationForm
            initialRole={
              roleParam &&
              roleParam !== 'Speculative Senior Architect' &&
              roleParam !== 'Speculative Candidate'
                ? roleParam
                : 'Open Application · Fresher & Experienced'
            }
            categories={categories}
            roles={roles}
            careersContent={careersContent}
          />
        ) : (
          <ContactForm />
        )}
      </motion.div>
    </motion.div>
  );
}

export function ContactSection({ isPageHero = false, categories, roles, careersContent }: ContactSectionProps) {
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
        <ContactContent
          isPageHero={isPageHero}
          categories={categories}
          roles={roles}
          careersContent={careersContent}
        />
      </Suspense>
    </section>
  );
}
