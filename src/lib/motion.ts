/**
 * @file client/src/lib/motion.ts
 * @description Unified Motion Design System for Astraiv Technologies.
 *
 * Core Objectives:
 * - Technological sophistication & executive polish without visual noise
 * - Strict compositor-only performance (transform + opacity)
 * - Strict adherence to prefers-reduced-motion
 * - Consistent easing curves, durations, and hierarchy across all sections
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// 1. EASING CURVES (Strictly tuned for high-end digital precision)
// ============================================================================

/** Silky smooth cubic-bezier curve that decelerates quickly into resting state */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Subtle symmetrical ease for modest transitions (menus, modals) */
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

/** Standard ease-out for quick interactions */
export const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

// ============================================================================
// 2. TIMING TOKENS (Milliseconds as seconds for Framer Motion)
// ============================================================================

export const MOTION_DURATIONS = {
  /** 100ms - Toggles, active button press, immediate feedback */
  instant: 0.1,
  /** 180ms - Button hover, tab indicators, tooltip reveal */
  fast: 0.18,
  /** 260ms - Dropdowns, small accordions, card elevation */
  normal: 0.26,
  /** 420ms - Standard section scroll reveal */
  reveal: 0.42,
  /** 580ms - Hero section entrance, primary page landmarks */
  hero: 0.58,
} as const;

// ============================================================================
// 3. SPRINGS (Snappy & stable, zero oscillation jitter)
// ============================================================================

export const MOTION_SPRINGS = {
  /** Responsive spring for layout indicators (active nav tab, slider indicator) */
  snappy: {
    type: 'spring',
    stiffness: 450,
    damping: 35,
  } as Transition,
  /** Soft spring for subtle natural movement */
  gentle: {
    type: 'spring',
    stiffness: 280,
    damping: 30,
  } as Transition,
} as const;

// ============================================================================
// 4. VIEWPORT TRIGGERS (Standardized IntersectionObserver configurations)
// ============================================================================

export const MOTION_VIEWPORT = {
  /** Default viewport trigger: fires once, slightly before fully entering viewport */
  once: {
    once: true,
    margin: '-40px',
  },
  /** Early trigger for large components */
  eager: {
    once: true,
    margin: '-20px',
  },
} as const;

// ============================================================================
// 5. UNIFIED VARIANTS
// ============================================================================

/**
 * Page entrance: gentle fade and modest translate
 */
export const pageEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.hero,
      ease: EASE_OUT_EXPO,
    },
  },
};

/**
 * Scroll reveal for section containers / section headers
 * Restrained: 14px translate, 0.42s duration
 */
export const scrollRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.reveal,
      ease: EASE_OUT_EXPO,
    },
  },
};

/**
 * Staggered container for grids (cards, metrics, logos)
 */
export const staggerGroupVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

/**
 * Card / Item within a staggered group
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.reveal,
      ease: EASE_OUT_EXPO,
    },
  },
};

/**
 * Desktop dropdown panel variant (snappy, compositor-friendly)
 */
export const dropdownMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 6,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.99,
    transition: {
      duration: 0.14,
      ease: 'easeIn',
    },
  },
};

/**
 * Mobile drawer transition variant (compositor transform & opacity, no height reflow)
 */
export const mobileDrawerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: 'easeIn',
    },
  },
};

/**
 * Card hover micro-interaction: subtle elevation (-2px), no rotation, no constant float
 */
export const cardHoverProps = {
  whileHover: {
    y: -2,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: EASE_OUT_EXPO,
    },
  },
  whileTap: {
    scale: 0.99,
    transition: {
      duration: MOTION_DURATIONS.instant,
    },
  },
};

/**
 * Button tap micro-interaction (clean 0.98 scale, no layout shift)
 */
export const buttonInteractionProps = {
  whileHover: {
    scale: 1.01,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: EASE_OUT_EXPO,
    },
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: MOTION_DURATIONS.instant,
    },
  },
};
