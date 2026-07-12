'use client';

import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './contact-form';
import { motion } from 'framer-motion';

export function ContactSection() {
  const t = useTranslations('Home');

  // Animation variants matching HeroSection
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
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="contact" className="py-12 md:py-24 px-6 relative w-full overflow-hidden">
      {/* Dynamic Animated Background Blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[110px] pointer-events-none z-0"
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -15, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_36px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10"
      >
        {/* Contact details */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6 text-left">
          <span className="inline-flex self-start px-3.5 py-1.5 text-xs font-bold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground uppercase w-fit select-none">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer">
            {t('ctaTitle')}
          </h2>
          <p className="text-base md:text-[18px] text-muted-foreground leading-relaxed max-w-xl font-medium">
            {t('ctaSubtitle')}
          </p>

          <div className="flex flex-col gap-6 mt-6">
            {/* Email link */}
            <a 
              href="mailto:info@astraiv.com" 
              className="flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors duration-300 group w-fit"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300 shrink-0 shadow-xs dark:group-hover:shadow-[0_0_15px_rgba(91,95,239,0.3)]">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Email Us</span>
                <span className="text-sm font-bold">info@astraiv.com</span>
              </div>
            </a>

            {/* Phone link */}
            <a 
              href="tel:+15550199231" 
              className="flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors duration-300 group w-fit"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300 shrink-0 shadow-xs dark:group-hover:shadow-[0_0_15px_rgba(91,95,239,0.3)]">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Call Us</span>
                <span className="text-sm font-bold">+1 (555) 019-9231</span>
              </div>
            </a>

            {/* Address / Maps link */}
            <a 
              href="https://maps.google.com/?q=100+Pine+Street,+San+Francisco,+CA+94111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-foreground/80 hover:text-primary transition-colors duration-300 group w-fit"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300 shrink-0 shadow-xs dark:group-hover:shadow-[0_0_15px_rgba(91,95,239,0.3)]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Our Office</span>
                <span className="text-sm font-semibold max-w-xs leading-normal">
                  100 Pine Street, San Francisco, CA 94111
                </span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Reusable Contact Form */}
        <motion.div variants={itemVariants} className="relative w-full">
          {/* Glowing aura effect */}
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl pointer-events-none" />
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
}
