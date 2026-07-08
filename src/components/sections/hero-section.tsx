'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CircuitBackground } from './circuit-background';

function parseHeadline(text: string) {
  const words: { word: string; isHighlighted: boolean }[] = [];
  let inHighlight = false;

  const tokens = text.split(/\s+/);
  for (const token of tokens) {
    if (!token) continue;
    let currentToken = token;

    if (currentToken.includes('[')) {
      inHighlight = true;
      currentToken = currentToken.replace('[', '');
    }

    const highlighted = inHighlight;

    if (currentToken.includes(']')) {
      inHighlight = false;
      currentToken = currentToken.replace(']', '');
    }

    words.push({
      word: currentToken,
      isHighlighted: highlighted,
    });
  }

  return words;
}

interface HeroSectionProps {
  badgeText?: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function HeroSection({
  badgeText,
  headline,
  subheadline,
  ctaText = 'Get Started',
  ctaHref = '/auth/signup',
  secondaryCtaText = 'Contact Us',
  secondaryCtaHref = '#contact',
}: HeroSectionProps) {
  const parsedWords = parseHeadline(headline);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    },
  };

  const headlineContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.025, // Stagger each letter by 0.025s for typing effect
        delayChildren: 0.25,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    },
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[92vh] py-20 px-6 overflow-hidden bg-background border-b border-border/40">
      {/* Dynamic Animated Blobs */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"
        animate={{
          x: [0, -30, 45, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-10 right-10 w-[250px] h-[250px] bg-accent/10 rounded-full blur-[80px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Circuit Background Animation with Antigravity repulsion */}
      <CircuitBackground />

      {/* Modern Premium Background Pattern Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_36px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_80%,transparent_100%)] pointer-events-none z-0" />

      {/* Floating Cognitive Shapes */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <motion.div 
          className="absolute top-[20%] left-[10%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-xs backdrop-blur-xs"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cpu className="h-4 w-4 text-secondary" />
          <span className="text-xs font-semibold text-muted-foreground">Autonomous Agents</span>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[25%] right-[12%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-xs backdrop-blur-xs"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground">Enterprise Secure</span>
        </motion.div>
      </div>

      {/* Inner wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-6 md:gap-8 text-center"
      >
        {/* Animated Badge */}
        {badgeText && (
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 bg-secondary/10 dark:bg-secondary/20 border border-secondary/20 dark:border-secondary/30 rounded-full shadow-[0_2px_10px_rgba(91,95,239,0.05)] select-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
            <span>{badgeText}</span>
            <ArrowRight className="h-3.5 w-3.5 text-secondary" />
          </motion.div>
        )}

        {/* Large Premium Headline */}
        <motion.h1
          variants={headlineContainerVariants}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.03em] md:tracking-[-0.04em] text-foreground leading-[1.05] max-w-4xl text-center"
        >
          {parsedWords.map((item, index) => {
            const letters = item.word.split('');
            return (
              <Fragment key={index}>
                <span className="inline-block whitespace-nowrap">
                  {letters.map((char, charIdx) => (
                    <motion.span
                      key={charIdx}
                      variants={letterVariants}
                      className={cn(
                        "inline-block origin-bottom",
                        item.isHighlighted 
                          ? "bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer"
                          : "text-foreground"
                      )}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                {index < parsedWords.length - 1 && ' '}
              </Fragment>
            );
          })}
        </motion.h1>

        {/* Supporting Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-[20px] text-muted-foreground font-medium max-w-3xl leading-relaxed"
        >
          {subheadline}
        </motion.p>

        {/* Interactive Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
          <Link
            href={ctaHref}
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'h-13 px-8 font-bold text-sm tracking-wide shadow-lg group')}
          >
            {ctaText} 
            <ArrowRight className="ml-2.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={secondaryCtaHref}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-13 px-8 font-bold text-sm tracking-wide bg-background/40 backdrop-blur-xs hover:border-primary transition-all duration-300'
            )}
          >
            {secondaryCtaText}
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-border/20 w-full max-w-xl mx-auto"
        >
          <div className="flex flex-col gap-1 items-center">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">100%</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client Retention</span>
          </div>
          <div className="w-[1px] h-8 bg-border/40" />
          <div className="flex flex-col gap-1 items-center">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">SLA</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enterprise Grade</span>
          </div>
          <div className="w-[1px] h-8 bg-border/40" />
          <div className="flex flex-col gap-1 items-center">
            <span className="text-2xl font-extrabold text-foreground tracking-tight">ISO-27001</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Security First</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
