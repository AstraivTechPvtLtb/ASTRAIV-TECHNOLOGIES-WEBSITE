'use client';

/**
 * @file client/src/views/sections/typewriter-headline.tsx
 * @description [VIEW] Enterprise Typewriter Headline Component.
 * Sequentially cycles through configured hero headlines with character-by-character
 * typing, comfortable reading hold, backspacing, smooth cursor animation,
 * zero layout shift (CLS), full SSR/SEO compliance, and accessibility support.
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function parseHeadline(text: string) {
  if (!text || !text.trim()) return [];

  const words: { word: string; isHighlighted: boolean }[] = [];
  let inHighlight = false;
  let hasExplicitHighlight = false;

  const tokens = text.trim().split(/\s+/);
  for (const token of tokens) {
    if (!token) continue;
    let currentToken = token;

    if (currentToken.includes('[')) {
      inHighlight = true;
      hasExplicitHighlight = true;
      currentToken = currentToken.replace(/\[/g, '');
    }

    const highlighted = inHighlight;

    if (currentToken.includes(']')) {
      inHighlight = false;
      currentToken = currentToken.replace(/\]/g, '');
    }

    if (currentToken) {
      words.push({
        word: currentToken,
        isHighlighted: highlighted,
      });
    }
  }

  // 50% Gradient Policy:
  // If no explicit [brackets] were provided from admin or copy, strictly apply the 50% gradient rule:
  // First ~50% is solid foreground, remaining ~50% displays in the signature Astraiv gradient.
  if (!hasExplicitHighlight && words.length > 0) {
    if (words.length === 1) {
      words[0].isHighlighted = true;
    } else {
      const splitIndex = Math.ceil(words.length / 2);
      for (let i = splitIndex; i < words.length; i++) {
        words[i].isHighlighted = true;
      }
    }
  }

  return words;
}

export interface HeadlineSegment {
  text: string;
  isHighlighted: boolean;
}

/**
 * Splits a headline string into structured text segments based on Astraiv's
 * 50% gradient policy and explicit [bracket] syntax.
 */
export function getHeadlineSegments(text: string): {
  segments: HeadlineSegment[];
  cleanText: string;
} {
  const words = parseHeadline(text);
  if (!words.length) {
    return { segments: [], cleanText: '' };
  }

  const segments: HeadlineSegment[] = [];
  let currentSegment: HeadlineSegment | null = null;

  for (let i = 0; i < words.length; i++) {
    const item = words[i];
    const isLast = i === words.length - 1;
    const wordWithTrailingSpace = item.word + (isLast ? '' : ' ');

    if (!currentSegment) {
      currentSegment = {
        text: wordWithTrailingSpace,
        isHighlighted: item.isHighlighted,
      };
    } else if (currentSegment.isHighlighted === item.isHighlighted) {
      currentSegment.text += wordWithTrailingSpace;
    } else {
      segments.push(currentSegment);
      currentSegment = {
        text: wordWithTrailingSpace,
        isHighlighted: item.isHighlighted,
      };
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  const cleanText = segments.map((s) => s.text).join('');
  return { segments, cleanText };
}

/**
 * Slices pre-calculated segments to display only the requested character count,
 * preserving highlight formatting across plain and gradient text without generating
 * separate DOM elements per character.
 */
export function sliceHeadlineSegments(
  segments: HeadlineSegment[],
  charCount: number
): { text: string; isHighlighted: boolean }[] {
  let remaining = Math.max(0, charCount);
  const result: { text: string; isHighlighted: boolean }[] = [];

  for (const seg of segments) {
    if (remaining <= 0) break;
    const sliceLen = Math.min(remaining, seg.text.length);
    result.push({
      text: seg.text.slice(0, sliceLen),
      isHighlighted: seg.isHighlighted,
    });
    remaining -= sliceLen;
  }

  return result;
}

export const TYPE_SPEED = 75; // ms per typed character (70–100ms)
export const DELETE_SPEED = 45; // ms per deleted character (40–60ms)
export const HOLD_TIME = 1800; // ms to hold completed headline (1400–2000ms)
export const EMPTY_PAUSE = 350; // ms pause at empty state before next headline (250–500ms)

export type TypewriterPhase = 'empty' | 'typing' | 'holding' | 'deleting';

interface TypewriterHeadlineProps {
  headlines: string[];
  className?: string;
}

export function TypewriterHeadline({ headlines, className }: TypewriterHeadlineProps) {
  const shouldReduceMotion = useReducedMotion();

  // Normalize headlines: trim whitespace, filter empty/spaces, fallback safely
  const normalizedHeadlines = useMemo(() => {
    const filtered = (headlines || [])
      .map((h) => (typeof h === 'string' ? h.trim() : ''))
      .filter((h) => h.length > 0);
    return filtered.length > 0 ? filtered : ['We Engineer the Digital Future'];
  }, [headlines]);

  // Pre-calculate segments and clean text for each headline in the sequence
  const parsedHeadlines = useMemo(() => {
    return normalizedHeadlines.map((h) => getHeadlineSegments(h));
  }, [normalizedHeadlines]);

  // Determine longest headline for phantom spacer to strictly guarantee ZERO Cumulative Layout Shift (CLS)
  const longestHeadline = useMemo(() => {
    return parsedHeadlines.reduce((longest, current) => {
      return current.cleanText.length > longest.cleanText.length ? current : longest;
    }, parsedHeadlines[0]);
  }, [parsedHeadlines]);

  // Initial state:
  // MUST start completely EMPTY (charCount = 0) in 'empty' phase.
  // The headline area initially renders conceptually as '|' and then begins typing naturally from character 1.
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>('empty');

  // Handle asynchronous data updates or Admin prop updates cleanly
  const headlinesKey = normalizedHeadlines.join('|||');
  const prevHeadlinesKeyRef = useRef(headlinesKey);

  useEffect(() => {
    if (prevHeadlinesKeyRef.current !== headlinesKey) {
      prevHeadlinesKeyRef.current = headlinesKey;
      setHeadlineIndex(0);
      setCharCount(0);
      setPhase('empty');
    }
  }, [headlinesKey]);

  const safeIndex = headlineIndex % parsedHeadlines.length;
  const currentParsed = parsedHeadlines[safeIndex] || parsedHeadlines[0];
  const totalLength = currentParsed.cleanText.length;

  // Animation cycle state machine:
  // EMPTY -> TYPING -> HOLDING (complete) -> DELETING -> EMPTY -> NEXT HEADLINE -> TYPING
  useEffect(() => {
    if (shouldReduceMotion) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'empty') {
      timer = setTimeout(() => {
        setPhase('typing');
      }, EMPTY_PAUSE);
    } else if (phase === 'typing') {
      if (charCount < totalLength) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev + 1);
        }, TYPE_SPEED);
      } else {
        setPhase('holding');
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => {
        setPhase('deleting');
      }, HOLD_TIME);
    } else if (phase === 'deleting') {
      if (charCount > 0) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev - 1);
        }, DELETE_SPEED);
      } else {
        setHeadlineIndex((prev) => (prev + 1) % parsedHeadlines.length);
        setPhase('empty');
      }
    }

    return () => clearTimeout(timer);
  }, [phase, charCount, totalLength, parsedHeadlines.length, shouldReduceMotion]);

  // Accessibility: Users with prefers-reduced-motion get clean, static headline without continuous typing/deleting
  if (shouldReduceMotion) {
    const firstSegments = parsedHeadlines[0]?.segments || [];
    return (
      <span className={cn('inline-block text-center w-full', className)}>
        <span className="sr-only">{normalizedHeadlines[0]}</span>
        <span aria-hidden="true" className="inline">
          {firstSegments.map((seg, idx) => (
            <span
              key={idx}
              className={cn(
                'inline pb-0.5',
                seg.isHighlighted
                  ? 'heading-gradient font-semibold bg-linear-to-r from-[#0B3D91] via-[#1D4ED8] to-[#2563EB] dark:from-[#38BDF8] dark:via-[#60A5FA] dark:to-[#93C5FD] bg-clip-text text-transparent'
                  : 'text-foreground'
              )}
            >
              {seg.text}
            </span>
          ))}
        </span>
      </span>
    );
  }

  const activeSegments = sliceHeadlineSegments(currentParsed.segments, charCount);

  return (
    <span className={cn('relative inline-block w-full min-h-[2.4em] sm:min-h-[2.3em]', className)}>
      {/* Accessible text for screen readers - provides static readable heading without announcing each keystroke */}
      <span className="sr-only">{normalizedHeadlines[safeIndex]}</span>

      {/* Sizer phantom: perfectly preserves space for the longest headline at all responsive breakpoints */}
      <span
        aria-hidden="true"
        className="invisible pointer-events-none select-none block max-w-full text-center"
      >
        {longestHeadline.segments.map((seg, idx) => (
          <span key={idx} className="inline pb-0.5">
            {seg.text}
          </span>
        ))}
        {/* Reserve cursor width so multi-line text wrapping behaves identically */}
        <span className="inline-block ml-0.5 sm:ml-1 w-[2.5px] sm:w-[3px] md:w-[3.5px] h-[0.88em]" />
      </span>

      {/* Active animated typewriter text positioned absolutely over the reserved space */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block text-center"
      >
        {activeSegments.map((seg, idx) => (
          <span
            key={idx}
            className={cn(
              'inline pb-0.5',
              seg.isHighlighted
                ? 'heading-gradient font-semibold bg-linear-to-r from-[#0B3D91] via-[#1D4ED8] to-[#2563EB] dark:from-[#38BDF8] dark:via-[#60A5FA] dark:to-[#93C5FD] bg-clip-text text-transparent'
                : 'text-foreground'
            )}
          >
            {seg.text}
          </span>
        ))}

        {/* Professional blinking cursor with Astraiv blue accent styling */}
        <span
          className="inline-block ml-0.5 sm:ml-1 w-[2.5px] sm:w-[3px] md:w-[3.5px] h-[0.88em] -mb-[0.05em] align-baseline bg-blue-600 dark:bg-blue-400 rounded-full animate-cursor-blink select-none pointer-events-none"
        />
      </span>
    </span>
  );
}
