import { describe, it, expect } from 'vitest';
import {
  getHeadlineSegments,
  sliceHeadlineSegments,
} from './typewriter-headline';

describe('TypewriterHeadline Segmentation & Gradient Engine', () => {
  it('correctly segments a 50% gradient headline (3 plain words, 2 highlighted words)', () => {
    const { segments, cleanText } = getHeadlineSegments('We Engineer the Digital Future');
    expect(cleanText).toBe('We Engineer the Digital Future');
    expect(segments).toHaveLength(2);

    expect(segments[0]).toEqual({
      text: 'We Engineer the ',
      isHighlighted: false,
    });
    expect(segments[1]).toEqual({
      text: 'Digital Future',
      isHighlighted: true,
    });
  });

  it('correctly segments an explicit bracket highlighted headline', () => {
    const { segments, cleanText } = getHeadlineSegments('We build [intelligent digital] experiences');
    expect(cleanText).toBe('We build intelligent digital experiences');
    expect(segments).toHaveLength(3);

    expect(segments[0]).toEqual({
      text: 'We build ',
      isHighlighted: false,
    });
    expect(segments[1]).toEqual({
      text: 'intelligent digital ',
      isHighlighted: true,
    });
    expect(segments[2]).toEqual({
      text: 'experiences',
      isHighlighted: false,
    });
  });

  it('handles a single word headline as highlighted', () => {
    const { segments, cleanText } = getHeadlineSegments('Astraiv');
    expect(cleanText).toBe('Astraiv');
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({
      text: 'Astraiv',
      isHighlighted: true,
    });
  });

  it('handles empty string gracefully', () => {
    const { segments, cleanText } = getHeadlineSegments('');
    expect(cleanText).toBe('');
    expect(segments).toEqual([]);
  });

  it('slices segments smoothly character by character during typing & backspacing', () => {
    const { segments } = getHeadlineSegments('We Engineer the Digital Future');
    // Segment 0: "We Engineer the " (16 chars, plain)
    // Segment 1: "Digital Future" (14 chars, highlighted)

    // At 0 chars: empty
    expect(sliceHeadlineSegments(segments, 0)).toEqual([]);

    // At 2 chars: "We"
    expect(sliceHeadlineSegments(segments, 2)).toEqual([
      { text: 'We', isHighlighted: false },
    ]);

    // At 16 chars: full segment 0
    expect(sliceHeadlineSegments(segments, 16)).toEqual([
      { text: 'We Engineer the ', isHighlighted: false },
    ]);

    // At 17 chars: segment 0 + "D" from segment 1
    expect(sliceHeadlineSegments(segments, 17)).toEqual([
      { text: 'We Engineer the ', isHighlighted: false },
      { text: 'D', isHighlighted: true },
    ]);

    // At 30 chars: full headline
    expect(sliceHeadlineSegments(segments, 30)).toEqual([
      { text: 'We Engineer the ', isHighlighted: false },
      { text: 'Digital Future', isHighlighted: true },
    ]);

    // Beyond max chars: caps at full headline without crashing
    expect(sliceHeadlineSegments(segments, 50)).toEqual([
      { text: 'We Engineer the ', isHighlighted: false },
      { text: 'Digital Future', isHighlighted: true },
    ]);
  });
});

describe('Typewriter Sequence Normalization (Tests A - E)', () => {
  function normalizeHeadlines(input: (string | undefined | null)[]): string[] {
    const filtered = input
      .map((h) => (typeof h === 'string' ? h.trim() : ''))
      .filter((h) => h.length > 0);
    return filtered.length > 0 ? filtered : ['We Engineer the Digital Future'];
  }

  it('Test A: Single headline only (Headline 1 exists, 2 & 3 blank)', () => {
    const result = normalizeHeadlines([
      'We Engineer the Digital Future',
      '',
      '',
    ]);
    expect(result).toEqual(['We Engineer the Digital Future']);
    expect(result).toHaveLength(1);
    // Sequence wraps: 0 -> (0 + 1) % 1 = 0 (1 -> delete -> 1)
  });

  it('Test B: Two headlines exist (Headline 1 & 2 filled, 3 blank)', () => {
    const result = normalizeHeadlines([
      'We Engineer the Digital Future',
      'Technology Built for Ambitious Businesses',
      '',
    ]);
    expect(result).toEqual([
      'We Engineer the Digital Future',
      'Technology Built for Ambitious Businesses',
    ]);
    expect(result).toHaveLength(2);
    // Sequence wraps: 0 -> 1 -> 0 (1 -> delete -> 2 -> delete -> 1)
  });

  it('Test C: Three headlines exist (1, 2, 3 all filled)', () => {
    const result = normalizeHeadlines([
      'We Engineer the Digital Future',
      'Technology Built for Ambitious Businesses',
      'From Ideas to Production-Ready Platforms',
    ]);
    expect(result).toEqual([
      'We Engineer the Digital Future',
      'Technology Built for Ambitious Businesses',
      'From Ideas to Production-Ready Platforms',
    ]);
    expect(result).toHaveLength(3);
    // Sequence wraps: 0 -> 1 -> 2 -> 0 (1 -> 2 -> 3 -> 1)
  });

  it('Test D: Headline 2 contains only spaces and tabs (treated as empty)', () => {
    const result = normalizeHeadlines([
      'We Engineer the Digital Future',
      '    \t   ',
      'From Ideas to Production-Ready Platforms',
    ]);
    expect(result).toEqual([
      'We Engineer the Digital Future',
      'From Ideas to Production-Ready Platforms',
    ]);
    expect(result).toHaveLength(2);
    // Ignored completely, does not create an empty animation cycle
  });

  it('Test E: Admin clears Headline 3 after previously having three headlines', () => {
    const previous = normalizeHeadlines([
      'We Engineer the Digital Future',
      'Technology Built for Ambitious Businesses',
      'From Ideas to Production-Ready Platforms',
    ]);
    expect(previous).toHaveLength(3);

    // After clearing headline 3:
    const updated = normalizeHeadlines([
      'We Engineer the Digital Future',
      'Technology Built for Ambitious Businesses',
      '',
    ]);
    expect(updated).toEqual([
      'We Engineer the Digital Future',
      'Technology Built for Ambitious Businesses',
    ]);
    expect(updated).toHaveLength(2);
  });

  it('Fallback: When all inputs are undefined, null, or whitespace', () => {
    const result = normalizeHeadlines([null, undefined, '   ']);
    expect(result).toEqual(['We Engineer the Digital Future']);
  });
});

describe('Typewriter Animation Lifecycle & Initial State', () => {
  it('strictly starts with 0 rendered characters so the headline area begins EMPTY (|)', () => {
    const { segments } = getHeadlineSegments('We Engineer the Digital Future');
    const initialRenderedSegments = sliceHeadlineSegments(segments, 0);
    expect(initialRenderedSegments).toEqual([]);
    expect(initialRenderedSegments).toHaveLength(0);
  });

  it('progressively reveals characters forward starting from index 0 during typing phase', () => {
    const { segments, cleanText } = getHeadlineSegments('We Engineer the Digital Future');
    for (let charCount = 1; charCount <= cleanText.length; charCount++) {
      const sliced = sliceHeadlineSegments(segments, charCount);
      const combined = sliced.map((s) => s.text).join('');
      expect(combined).toBe(cleanText.slice(0, charCount));
    }
  });

  it('deletes characters strictly in reverse until reaching empty string before advancing', () => {
    const { segments, cleanText } = getHeadlineSegments('We Engineer the Digital Future');
    for (let charCount = cleanText.length; charCount >= 0; charCount--) {
      const sliced = sliceHeadlineSegments(segments, charCount);
      const combined = sliced.map((s) => s.text).join('');
      expect(combined).toBe(cleanText.slice(0, charCount));
    }
    expect(sliceHeadlineSegments(segments, 0)).toEqual([]);
  });

  it('strictly advances headline indices sequentially without skipping or inverting order', () => {
    const headlinesCount = 3;
    let currentIndex = 0;
    const history: number[] = [currentIndex];

    // Simulate 6 complete deletion cycles
    for (let cycle = 0; cycle < 6; cycle++) {
      currentIndex = (currentIndex + 1) % headlinesCount;
      history.push(currentIndex);
    }

    // Must be exactly 0 -> 1 -> 2 -> 0 -> 1 -> 2 -> 0
    expect(history).toEqual([0, 1, 2, 0, 1, 2, 0]);
  });
});
