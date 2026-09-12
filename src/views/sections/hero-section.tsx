'use client';

import { Fragment, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Cpu } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { CircuitBackground } from './circuit-background';

const TOTAL_INTERMEDIATE_LAYERS = 400;
const MAX_DEPTH = 2000; // Deep Z-axis depth coordinate in px

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

  // Mouse tracking for interactive 3D perspective depth effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Dynamic 3D tilt angles calculated smoothly from cursor position
  const rotateX = useTransform(smoothMouseY, [0, 1], [7, -7]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Generate 400 discrete depth layers between Layer 1 (foreground) and Layer 402 (deep hover animation)
  const intermediateLayers = useMemo(() => {
    return Array.from({ length: TOTAL_INTERMEDIATE_LAYERS }, (_, idx) => {
      const layerNum = idx + 2; // Layers 2 through 401 (exactly 400 layers)
      const depthRatio = (layerNum - 1) / (TOTAL_INTERMEDIATE_LAYERS + 1);
      const z = -(depthRatio * MAX_DEPTH);
      return {
        layerNum,
        z: Number(z.toFixed(2)),
      };
    });
  }, []);

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
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center min-h-[88vh] sm:min-h-[90vh] lg:min-h-[92vh] pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 lg:pt-44 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background border-b border-border/40"
      style={{
        isolation: 'isolate',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Preserved Perspective Stage: tilts smoothly with mouse movement to reveal dramatic depth */}
      <motion.div
        className="relative w-full h-full flex flex-col items-center justify-center pointer-events-auto"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
        }}
      >
        {/* Dynamic Animated Blobs in 3D Z-Space */}
        <div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-blob-1"
          style={{ transform: 'translateZ(-1200px)', transformStyle: 'preserve-3d' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-blob-2"
          style={{ transform: 'translateZ(-800px)', transformStyle: 'preserve-3d' }}
        />
        <div
          className="absolute top-10 right-10 w-[250px] h-[250px] bg-accent/10 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none animate-blob-3"
          style={{ transform: 'translateZ(-500px)', transformStyle: 'preserve-3d' }}
        />

        {/* ========================================================================= */}
        {/* LAYER 402 — HOVER ANIMATION (DEEPEST VISUAL 3D PLANE: -2000px)            */}
        {/* Positioned deep in Z-space (-2000px) with scale compensation (2.85x)      */}
        {/* at perspective 1200px for full visual coverage and expansive 3D parallax  */}
        {/* ========================================================================= */}
        <div
          data-depth-layer="402"
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            transform: `translateZ(-${MAX_DEPTH}px) scale(2.85)`,
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
          }}
        >
          <CircuitBackground />
        </div>

        {/* ========================================================================= */}
        {/* LAYERS 2–401 — 400 INTERMEDIATE 3D DEPTH LAYERS                           */}
        {/* Exactly 400 real depth planes separating Layer 1 (foreground) and         */}
        {/* Layer 402 (hover animation) to deliver immense continuous 3D spatial depth*/}
        {/* ========================================================================= */}
        {intermediateLayers.map(({ layerNum, z }) => (
          <div
            key={layerNum}
            data-depth-layer={layerNum}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none"
            style={{
              transform: `translateZ(${z}px)`,
              transformStyle: 'preserve-3d',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              filter: 'none',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* ========================================================================= */}
        {/* LAYER 1 — FOREGROUND / CONTENT PLANE (ELEVATED IN 3D Z-SPACE)             */}
        {/* Hero badges, headline, subheadline, CTA elevated at Z=+35px for maximum   */}
        {/* stereoscopic contrast against the deep -1200px background plane           */}
        {/* ========================================================================= */}
        {/* Floating Cognitive Shapes */}
        <div
          data-depth-layer="1-badges"
          className="absolute inset-0 pointer-events-none select-none overflow-hidden"
          style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
        >
          <motion.div 
            className="absolute top-[22%] left-[6%] lg:left-[10%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-xs backdrop-blur-xs"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cpu className="h-4 w-4 text-secondary dark:text-blue-400" />
            <span className="text-xs font-semibold text-muted-foreground">Autonomous Agents</span>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-[22%] right-[6%] lg:right-[10%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-xs backdrop-blur-xs"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Shield className="h-4 w-4 text-primary dark:text-blue-400" />
            <span className="text-xs font-semibold text-muted-foreground">Enterprise Secure</span>
          </motion.div>
        </div>

        {/* Unified Hero Content Group */}
        <motion.div
          data-depth-layer="1-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center text-center px-4"
          style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}
        >
          {/* 1. Animated Badge */}
          {badgeText && (
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 md:mb-6 text-xs font-mono font-bold text-slate-800 dark:text-blue-300 bg-secondary/10 dark:bg-blue-600/10 border border-secondary/20 dark:border-blue-500/30 rounded-full shadow-[0_2px_10px_rgba(37,99,235,0.05)] select-none hover:border-blue-500/40 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-secondary dark:text-blue-400 animate-pulse" />
              <span>{badgeText}</span>
              <ArrowRight className="h-3.5 w-3.5 text-secondary dark:text-blue-400" />
            </motion.div>
          )}

          {/* 2. Large Premium Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-[30px] md:text-4xl lg:text-[46px] xl:text-[52px] 2xl:text-[58px] font-display font-extrabold tracking-tight md:tracking-[-0.02em] text-foreground leading-[1.2] w-full text-center mb-4 md:mb-5 whitespace-normal sm:whitespace-nowrap"
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
                          className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-blue-500/15 via-indigo-500/20 to-blue-400/20 dark:from-blue-600/25 dark:via-blue-500/20 dark:to-indigo-500/25 blur-xl rounded-full pointer-events-none -z-10 animate-pulse"
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
                                ? "bg-gradient-to-r from-[#0B3D91] via-[#5B5FEF] to-[#0099FF] dark:from-[#2563EB] dark:via-[#3B82F6] dark:to-[#60A5FA] bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer dark:drop-shadow-[0_0_20px_rgba(37,99,235,0.35)]"
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
                className="relative cursor-pointer font-bold rounded-md px-10 h-13 text-sm tracking-wide text-white bg-[#0B3D91] hover:bg-[#093275] dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg dark:border dark:border-blue-400/30 dark:shadow-[0_0_16px_-2px_rgba(59,130,246,0.35)] dark:hover:shadow-[0_0_22px_-1px_rgba(59,130,246,0.55)] flex items-center justify-center gap-2 outline-none select-none"
              >
                <span>{ctaText}</span>
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
