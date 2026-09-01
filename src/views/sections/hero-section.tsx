'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import { Link } from '@/i18n/routing';
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
}

export function HeroSection({
  badgeText,
  headline,
  subheadline,
  ctaText = 'Get Started',
  ctaHref = '/auth/signup',
}: HeroSectionProps) {
  const parsedWords = parseHeadline(headline);
  const shouldReduceMotion = useReducedMotion();

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

  // Refined slow, sequential letter reveal animation (left-to-right)
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      x: shouldReduceMotion ? 0 : -6,
      filter: shouldReduceMotion ? 'none' : 'blur(4px)',
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            delay: 0.25 + i * 0.058, // ~58ms stagger between consecutive letters
            duration: 0.6,          // 600ms smooth individual character entrance
            ease: [0.16, 1, 0.3, 1] as const, // Silky smooth ease-out curve
          },
    }),
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[88vh] sm:min-h-[90vh] lg:min-h-[92vh] pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 lg:pt-44 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background border-b border-border/40">
      {/* Dynamic Animated Blobs (GPU Composited) */}
      <div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-blob-1"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-blob-2"
      />
      <div
        className="absolute top-10 right-10 w-[250px] h-[250px] bg-accent/10 dark:bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none animate-blob-3"
      />

      {/* Circuit Background Animation with Antigravity repulsion */}
      <CircuitBackground />

      {/* Floating Cognitive Shapes */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <motion.div 
          className="absolute top-[22%] left-[6%] lg:left-[10%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-xs backdrop-blur-xs"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cpu className="h-4 w-4 text-secondary" />
          <span className="text-xs font-semibold text-muted-foreground">Autonomous Agents</span>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[22%] right-[6%] lg:right-[10%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-xs backdrop-blur-xs"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground">Enterprise Secure</span>
        </motion.div>
      </div>

      {/* Unified Hero Content Group */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center text-center px-2"
      >
        {/* 1. Animated Badge */}
        {badgeText && (
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 md:mb-6 text-xs font-bold text-slate-800 dark:text-slate-100 bg-secondary/10 dark:bg-secondary/20 border border-secondary/20 dark:border-secondary/30 rounded-full shadow-[0_2px_10px_rgba(91,95,239,0.05)] select-none hover:border-secondary/40 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
            <span>{badgeText}</span>
            <ArrowRight className="h-3.5 w-3.5 text-secondary" />
          </motion.div>
        )}

        {/* 2. Large Premium Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[70px] font-extrabold tracking-tight md:tracking-[-0.03em] text-foreground leading-[1.14] max-w-5xl xl:max-w-6xl text-center mb-4 md:mb-5 whitespace-normal sm:whitespace-nowrap"
        >
          {(() => {
            let charCounter = 0;
            return parsedWords.map((item, index) => {
              const letters = item.word.split('');
              const wordStartIdx = charCounter;
              return (
                <Fragment key={index}>
                  <span
                    className={cn(
                      "inline-block whitespace-nowrap pb-1",
                      item.isHighlighted && "relative"
                    )}
                  >
                    {item.isHighlighted && (
                      <motion.span
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={
                          shouldReduceMotion 
                            ? { duration: 0 } 
                            : { delay: 0.25 + wordStartIdx * 0.058, duration: 0.9, ease: "easeOut" }
                        }
                        className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-blue-500/15 via-indigo-500/20 to-cyan-400/20 dark:from-blue-500/35 dark:via-indigo-500/30 dark:to-cyan-400/35 blur-xl rounded-full pointer-events-none -z-10 animate-pulse"
                        style={{ animationDuration: '4s' }}
                      />
                    )}
                    {letters.map((char, charIdx) => {
                      const currentIdx = charCounter++;
                      return (
                        <motion.span
                          key={charIdx}
                          custom={currentIdx}
                          variants={letterVariants}
                          initial="hidden"
                          animate="visible"
                          className={cn(
                            "inline-block origin-bottom pb-1",
                            item.isHighlighted 
                              ? "bg-gradient-to-r from-[#0B3D91] via-[#5B5FEF] to-[#0099FF] dark:from-[#38BDF8] dark:via-[#818CF8] dark:to-[#60A5FA] bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer dark:drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                              : "text-foreground"
                          )}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </span>
                  {index < parsedWords.length - 1 && ' '}
                </Fragment>
              );
            });
          })()}
        </motion.h1>

        {/* 3. Supporting Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-[19px] lg:text-[20px] text-muted-foreground font-medium max-w-3xl leading-relaxed mb-8 md:mb-10"
        >
          {subheadline}
        </motion.p>

        {/* 4. Interactive CTA Button */}
        <motion.div variants={itemVariants} className="flex justify-center w-full">
          <Link
            href={ctaHref}
            className="relative group inline-block"
          >
            <button
              className="relative cursor-pointer font-bold rounded-md px-10 h-13 text-sm tracking-wide text-white bg-[#0B3D91] hover:bg-[#093275] dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none outline-none select-none"
            >
              <span>{ctaText}</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
