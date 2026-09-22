'use client';

import * as React from 'react';
import { MotionConfig } from 'framer-motion';

/**
 * Universal Framer Motion Provider configured to respect
 * the OS/browser prefers-reduced-motion setting automatically.
 * When reducedMotion="user", Framer Motion disables transform and positional animations
 * while maintaining non-disruptive opacity transitions.
 */
export function AstraivMotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
