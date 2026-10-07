import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href, ...props }: { children?: React.ReactNode; href?: string } & Record<string, unknown>) =>
    React.createElement('a', { href: href || '#', ...props }, children),
}));

import { parseHeadline } from './hero-section';

describe('HeroSection 50% Gradient Policy', () => {
  it('splits a 5-word headline into ~50% (3 plain words, 2 gradient words) when no brackets are provided', () => {
    const result = parseHeadline('We engineer the digital future');
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ word: 'We', isHighlighted: false });
    expect(result[1]).toEqual({ word: 'engineer', isHighlighted: false });
    expect(result[2]).toEqual({ word: 'the', isHighlighted: false });
    expect(result[3]).toEqual({ word: 'digital', isHighlighted: true });
    expect(result[4]).toEqual({ word: 'future', isHighlighted: true });
  });

  it('splits a 2-word headline into exactly 50% (1 plain, 1 gradient)', () => {
    const result = parseHeadline('Enterprise Solutions');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ word: 'Enterprise', isHighlighted: false });
    expect(result[1]).toEqual({ word: 'Solutions', isHighlighted: true });
  });

  it('splits a 4-word headline into exactly 50% (2 plain, 2 gradient)', () => {
    const result = parseHeadline('Engineering Outcomes Delivered Scale');
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ word: 'Engineering', isHighlighted: false });
    expect(result[1]).toEqual({ word: 'Outcomes', isHighlighted: false });
    expect(result[2]).toEqual({ word: 'Delivered', isHighlighted: true });
    expect(result[3]).toEqual({ word: 'Scale', isHighlighted: true });
  });

  it('splits a 6-word headline into exactly 50% (3 plain, 3 gradient)', () => {
    const result = parseHeadline('Engineering Built on Trust and Rigor');
    expect(result).toHaveLength(6);
    expect(result[0]).toEqual({ word: 'Engineering', isHighlighted: false });
    expect(result[1]).toEqual({ word: 'Built', isHighlighted: false });
    expect(result[2]).toEqual({ word: 'on', isHighlighted: false });
    expect(result[3]).toEqual({ word: 'Trust', isHighlighted: true });
    expect(result[4]).toEqual({ word: 'and', isHighlighted: true });
    expect(result[5]).toEqual({ word: 'Rigor', isHighlighted: true });
  });

  it('highlights a single word headline', () => {
    const result = parseHeadline('Astraiv');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ word: 'Astraiv', isHighlighted: true });
  });

  it('respects explicit bracket syntax when provided', () => {
    const result = parseHeadline('We engineer the [digital future]');
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ word: 'We', isHighlighted: false });
    expect(result[1]).toEqual({ word: 'engineer', isHighlighted: false });
    expect(result[2]).toEqual({ word: 'the', isHighlighted: false });
    expect(result[3]).toEqual({ word: 'digital', isHighlighted: true });
    expect(result[4]).toEqual({ word: 'future', isHighlighted: true });
  });

  it('handles empty string gracefully', () => {
    const result = parseHeadline('');
    expect(result).toEqual([]);
  });
});
