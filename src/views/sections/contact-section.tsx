'use client';

import { Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { ContactForm } from './contact-form';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

export function ContactSection() {
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
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
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
          <span className="inline-flex self-start px-3.5 py-1 text-xs font-extrabold tracking-wider text-primary dark:text-cyan-400 bg-primary/10 dark:bg-cyan-400/10 rounded-full border border-primary/20 dark:border-cyan-400/20 uppercase w-fit select-none">
            Start Your Next Build
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-foreground">
            Have an Idea? <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Let&apos;s Build It.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-medium">
            Tell us what you&apos;re building, what you&apos;re solving, or where you want to go next. We&apos;ll help you turn the vision into a scalable, high-conversion digital reality.
          </p>

          {/* Quick CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#contact-form-box"
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
            >
              Start a Conversation
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-card/85 dark:bg-slate-900/80 border border-border/70 dark:border-slate-800 text-foreground font-bold text-xs sm:text-sm hover:border-primary/40 dark:hover:border-cyan-400 transition-all"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Direct channels */}
          <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-border/40 dark:border-slate-800/60">
            <a 
              href="mailto:info@astraivtechnologies.com" 
              className="flex items-center gap-3.5 text-foreground/80 hover:text-primary dark:hover:text-cyan-400 transition-colors group w-fit"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-cyan-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-cyan-400/20 group-hover:scale-105 transition-all shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Email Inquiry</span>
                <span className="text-xs sm:text-sm font-bold">info@astraivtechnologies.com</span>
              </div>
            </a>

            <a 
              href="tel:+918167409664" 
              className="flex items-center gap-3.5 text-foreground/80 hover:text-primary dark:hover:text-cyan-400 transition-colors group w-fit"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-cyan-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-cyan-400/20 group-hover:scale-105 transition-all shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Direct Engineering Hotline</span>
                <span className="text-xs sm:text-sm font-bold">+91 8167409664</span>
              </div>
            </a>

            <div className="flex items-center gap-3.5 text-foreground/80 w-fit">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-cyan-400/10 text-primary dark:text-cyan-300 border border-primary/20 dark:border-cyan-400/20 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Headquarters</span>
                <span className="text-xs sm:text-sm font-semibold">Ashoknagar, Kolkata</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Strict NDA & confidentiality guaranteed on all initial briefs</span>
          </div>
        </motion.div>

        {/* Right Column: Interactive Contact Form */}
        <motion.div id="contact-form-box" variants={itemVariants} className="lg:col-span-6 relative w-full">
          <div className="absolute inset-0 bg-primary/10 dark:bg-cyan-500/10 rounded-3xl blur-2xl pointer-events-none" />
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
}
