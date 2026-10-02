'use client';

import { Suspense } from 'react';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { ContactForm } from './contact-form';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

interface ContactSectionProps {
  isPageHero?: boolean;
}

export function ContactSection({ isPageHero = false }: ContactSectionProps) {
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
    <section id="contact" className="py-20 md:py-28 px-6 relative w-full overflow-hidden scroll-mt-24">
      {/* Dynamic Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 dark:bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10"
      >
        {/* Left Column: Direct Conversation Trigger */}
        <motion.div variants={itemVariants} className="lg:col-span-6 flex flex-col gap-6 text-left">


          {isPageHero ? (
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.025em] font-heading leading-tight text-foreground">
              Have an Idea? <br />
              <span className="heading-gradient">
                Let&apos;s Build It.
              </span>
            </h1>
          ) : (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.025em] font-heading leading-tight text-foreground">
              Have an Idea? <br />
              <span className="heading-gradient">
                Let&apos;s Build It.
              </span>
            </h2>
          )}

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-normal">
            Tell us what you&apos;re building, what you&apos;re solving, or where you want to go next. We&apos;ll help you turn the vision into a scalable, high-conversion digital reality.
          </p>

          {/* Quick CTA button */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-[380px] px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm tracking-normal shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
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
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Email Inquiry</span>
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
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Direct Engineering Hotline</span>
                <span className="text-xs sm:text-sm font-semibold">+91 8167409664</span>
              </div>
            </a>

            <div className="flex items-center gap-3.5 text-foreground/80 w-fit">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-300 border border-primary/20 dark:border-blue-400/20 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Headquarters</span>
                <span className="text-xs sm:text-sm font-semibold">Ashoknagar, Kolkata</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-2">
            <ShieldCheck className="h-4 w-4 text-primary dark:text-cyan-400" />
            <span>Strict NDA & confidentiality guaranteed on all initial briefs</span>
          </div>
        </motion.div>

        {/* Right Column: Interactive Contact Form */}
        <motion.div id="contact-form-box" variants={itemVariants} className="lg:col-span-6 relative w-full">
          <span id="schedule" className="absolute -top-28 pointer-events-none" />
          <div className="absolute inset-0 bg-primary/10 dark:bg-blue-600/10 rounded-3xl blur-2xl pointer-events-none" />
          <Suspense
            fallback={
              <div className="w-full max-w-xl mx-auto p-12 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-center min-h-[450px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }
          >
            <ContactForm />
          </Suspense>
        </motion.div>
      </motion.div>
    </section>
  );
}
