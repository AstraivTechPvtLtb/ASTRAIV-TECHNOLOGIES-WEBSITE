'use client';

import { useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { CircuitBackground } from './circuit-background';
import { TypewriterHeadline } from './typewriter-headline';

import { EASE_OUT_EXPO, MOTION_DURATIONS } from '@/lib/motion';

const MAX_DEPTH = 800; // Deep Z-axis perspective depth coordinate in px
export { parseHeadline } from './typewriter-headline';

interface HeroSectionProps {
  badgeText?: string;
  headline?: string;
  headlines?: string[];
  subheadline: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function HeroSection({
  badgeText: _badgeText,
  headline,
  headlines,
  subheadline,
  ctaText = 'Start a Project',
  ctaHref = ROUTES.PUBLIC.START_PROJECT,
  secondaryCtaText = 'Explore Case Studies',
  secondaryCtaHref = ROUTES.PUBLIC.CASE_STUDIES,
}: HeroSectionProps) {
  const effectiveHeadlines = useMemo(() => {
    if (headlines && headlines.length > 0) {
      const filtered = headlines.map((h) => h?.trim()).filter(Boolean);
      if (filtered.length > 0) return filtered;
    }
    if (headline && headline.trim()) {
      return [headline.trim()];
    }
    return ['We Engineer High-Performance Enterprise Software & AI Systems'];
  }, [headlines, headline]);

  const shouldReduceMotion = useReducedMotion();

  // Mouse tracking for subtle, refined 3D perspective depth effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 30, stiffness: 100, mass: 0.4 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Restrained, dignified tilt angles (subtle +/- 2.2 deg to prevent dizzying text distortion)
  const rotateX = useTransform(smoothMouseY, [0, 1], [2.2, -2.2]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-2.5, 2.5]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_DURATIONS.hero,
        ease: EASE_OUT_EXPO,
      },
    },
  };


  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center min-h-svh lg:min-h-dvh overflow-hidden bg-background border-b border-border/40 pt-20 sm:pt-24 pb-8 sm:pb-12"
    >
      {/* 3D Preserved Perspective Background Stage: tilts smoothly with mouse movement to reveal dramatic depth */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
        }}
      >
        {/* Dynamic Animated Blobs in 3D Z-Space */}
        <div
          className="absolute top-1/4 left-1/3 w-125 h-125 bg-primary/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-blob-1"
          style={{ transform: 'translateZ(-1200px)', transformStyle: 'preserve-3d' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-secondary/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none animate-blob-2"
          style={{ transform: 'translateZ(-800px)', transformStyle: 'preserve-3d' }}
        />
        <div
          className="absolute top-10 right-10 w-62.5 h-62.5 bg-accent/10 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none animate-blob-3"
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


      </motion.div>

      {/* Foreground Hero Content Group: 100% stable interaction plane for buttons and text */}
      <motion.div
        data-depth-layer="1-content"
        variants={containerVariants}
        initial={false}
        animate="visible"
        className="relative z-20 w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center text-center my-auto px-4 sm:px-6 lg:px-8 pointer-events-auto"
      >


        {/* 2. Large Premium Headline - Fluid Clamp Scaling and Typewriter Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-[clamp(1.35rem,4.2vw+0.35rem,3.75rem)] font-display font-semibold tracking-tight md:tracking-[-0.03em] text-foreground leading-[1.12] sm:leading-[1.15] w-full text-center mb-4 md:mb-5 whitespace-normal wrap-break-word flex items-center justify-center min-h-[2.4em] sm:min-h-[2.3em]"
          style={{ textWrap: 'balance' }}
        >
          <TypewriterHeadline headlines={effectiveHeadlines} />
        </motion.h1>

        {/* 3. Supporting Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg lg:text-[19px] text-muted-foreground font-normal max-w-2xl lg:max-w-3xl leading-[1.62] mb-6 sm:mb-8 md:mb-10 px-1"
        >
          {subheadline}
        </motion.p>

        {/* 4. Interactive CTA Buttons (Primary: Start a Project, Secondary: Explore Our Work) */}
        <motion.div variants={itemVariants} className="relative z-30 pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto relative group cursor-pointer font-semibold rounded-xl px-6 sm:px-9 h-12 sm:h-13 text-xs sm:text-sm tracking-normal text-white bg-primary hover:bg-[#082d6c] dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md border border-blue-900/20 dark:border-blue-400/30 inline-flex items-center justify-center gap-2 outline-none select-none min-h-11 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
          >
            <span>{ctaText}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </Link>

          <Link
            href={secondaryCtaHref}
            className="w-full sm:w-auto relative group cursor-pointer font-semibold rounded-xl px-6 sm:px-9 h-12 sm:h-13 text-xs sm:text-sm tracking-normal text-foreground bg-card/90 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/15 hover:border-primary/40 dark:hover:border-blue-400/40 active:scale-[0.98] transition-all duration-200 shadow-xs inline-flex items-center justify-center gap-2 outline-none select-none min-h-11 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400"
          >
            <span>{secondaryCtaText}</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 text-primary dark:text-blue-400" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
