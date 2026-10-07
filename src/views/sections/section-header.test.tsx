import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { renderFormattedTitle } from './section-header';

describe('renderFormattedTitle 50% Gradient Policy', () => {
  it('applies 50% gradient when no brackets are provided', () => {
    const rendered = renderToString(<>{renderFormattedTitle('We engineer the digital future')}</>);
    // First half "We engineer the " is plain text
    expect(rendered).toContain('We engineer the');
    // Second half "digital future" is wrapped in heading-gradient
    expect(rendered).toContain('heading-gradient font-semibold');
    expect(rendered).toContain('digital future');
  });

  it('respects explicit brackets when provided', () => {
    const rendered = renderToString(<>{renderFormattedTitle('We engineer the [digital future]')}</>);
    expect(rendered).toContain('We engineer the ');
    expect(rendered).toContain('heading-gradient font-semibold');
    expect(rendered).toContain('digital future');
  });

  it('handles single word title by applying gradient', () => {
    const rendered = renderToString(<>{renderFormattedTitle('Astraiv')}</>);
    expect(rendered).toContain('heading-gradient font-semibold');
    expect(rendered).toContain('Astraiv');
  });
});
