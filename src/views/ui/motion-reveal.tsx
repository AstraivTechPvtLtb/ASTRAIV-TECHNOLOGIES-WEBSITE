'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { EASE_OUT_EXPO, MOTION_DURATIONS, MOTION_VIEWPORT } from '@/lib/motion';
import { cn } from '@/lib/utils';

// ============================================================================
// 1. MOTION REVEAL COMPONENT
// ============================================================================

export interface MotionRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'none';
  distance?: number;
  className?: string;
}

/**
 * Controlled, restrained section/card reveal.
 * Respects prefers-reduced-motion automatically.
 * Avoids dramatic fly-ins (default: 14px max).
 */
export function MotionReveal({
  children,
  delay = 0,
  duration = MOTION_DURATIONS.reveal,
  direction = 'up',
  distance = 14,
  className,
  ...props
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div className={className} {...props}>
        {children}
      </motion.div>
    );
  }

  const initialY = direction === 'up' ? distance : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={MOTION_VIEWPORT.once}
      transition={{
        duration,
        delay,
        ease: EASE_OUT_EXPO,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// 2. CONTROLLED COUNT-UP COMPONENT (Genuine Metrics Only)
// ============================================================================

export interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
  displayRaw?: string;
}

/**
 * Performance-engineered metric counter:
 * - Uses requestAnimationFrame with cubic ease-out
 * - Fires once via IntersectionObserver
 * - Strictly respects prefers-reduced-motion (renders instantly)
 * - Uses tabular-nums to prevent parent layout shifts
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  durationMs = 1100,
  className,
  displayRaw,
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    displayRaw || `${prefix}0${decimals > 0 ? '.' + '0'.repeat(decimals) : ''}${suffix}`
  );
  const containerRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(displayRaw || `${prefix}${value.toFixed(decimals)}${suffix}`);
      return;
    }

    const element = containerRef.current;
    if (!element || hasAnimatedRef.current) return;

    let animId: number;
    let startTime: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const rawProgress = Math.min(elapsed / durationMs, 1);
            
            // Ease out cubic: 1 - (1 - t)^3
            const progress = 1 - Math.pow(1 - rawProgress, 3);
            const current = progress * value;

            setDisplayValue(`${prefix}${current.toFixed(decimals)}${suffix}`);

            if (rawProgress < 1) {
              animId = requestAnimationFrame(step);
            } else {
              setDisplayValue(`${prefix}${value.toFixed(decimals)}${suffix}`);
            }
          };

          animId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, [value, decimals, prefix, suffix, durationMs, shouldReduceMotion, displayRaw]);

  return (
    <span
      ref={containerRef}
      className={cn('tabular-nums inline-block', className)}
    >
      {displayValue}
    </span>
  );
}
