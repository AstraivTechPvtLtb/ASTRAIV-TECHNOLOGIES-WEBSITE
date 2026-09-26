'use client';

/**
 * @file client/src/views/sections/service-architecture-visual.tsx
 * @description Dynamic Service-Specific SVG Visual System.
 * Renders enterprise-grade SVG architecture visuals synchronized with active service tabs.
 * Features cinematic crossfade/scale transitions, localized contrast vignettes,
 * dynamic ambient glow matching Astraiv design tokens, and instant background preloading.
 */

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ServiceVisualInfo, SERVICE_VISUAL_MAP } from '@/lib/services-data';

export interface ServiceArchitectureVisualProps {
  visual: ServiceVisualInfo;
  serviceId: string;
}

export function ServiceArchitectureVisual({
  visual,
  serviceId,
}: ServiceArchitectureVisualProps) {
  const shouldReduceMotion = useReducedMotion();

  // Intelligent preloading of all 6 service SVGs after mount for instantaneous tab switching
  useEffect(() => {
    if (typeof window === 'undefined') return;
    Object.values(SERVICE_VISUAL_MAP).forEach((v) => {
      const img = new window.Image();
      img.src = v.src;
    });
  }, []);

  const transitionDuration = shouldReduceMotion ? 0.22 : 0.46;
  const easing = [0.22, 1, 0.36, 1] as const;

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* 1. Dynamic Ambient Glow Layer matching service domain */}
      <motion.div
        key={`ambient-glow-${serviceId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: visual.glowGradient,
        }}
      />

      {/* 2. Dynamic SVG Illustration with Premium Cinematic Transition */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={`service-svg-${serviceId}`}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.02, filter: 'blur(3px)' }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, filter: 'blur(0px)' }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.015, filter: 'blur(3px)' }
          }
          transition={{
            duration: transitionDuration,
            ease: easing,
          }}
          className="absolute inset-0 w-full h-full transform-gpu"
        >
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* 3. High-Clarity Localized Gradient Overlays (70–85% Central Visibility, 15–30% Localized Contrast) */}
      {/* Top subtle vignette behind architecture badges */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-transparent pointer-events-none z-10" />

      {/* Bottom localized gradient behind tabs and description/specs/CTA */}
      <div className="absolute bottom-0 inset-x-0 h-64 sm:h-72 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none z-10" />

      {/* Subtle edge framing vignettes */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-slate-950/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-slate-950/40 to-transparent pointer-events-none z-10" />
    </div>
  );
}
