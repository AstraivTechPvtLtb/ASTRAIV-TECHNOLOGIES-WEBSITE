import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { PricingCard } from './pricing-card';

// Mock routing Link
vi.mock('@/i18n/routing', () => ({
  Link: ({
    children,
    href,
    className,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

describe('PricingCard Engagement Model Component', () => {
  it('renders title, description, features and CTA without artificial price gaps', () => {
    const html = renderToString(
      <PricingCard
        name="Fixed-Scope Project"
        description="For clearly defined deliverables with milestones and quotation."
        features={[
          'Detailed requirements & architectural roadmap',
          'Fixed milestone schedule',
          'Code reviews and 100% IP ownership',
        ]}
        buttonText="Request a Quote"
        href="/start-project?model=Fixed-Scope"
      />
    );

    // Title & description
    expect(html).toContain('Fixed-Scope Project');
    expect(html).toContain('For clearly defined deliverables with milestones and quotation.');

    // Features & Inclusions
    expect(html).toContain('What&#x27;s Included:');
    expect(html).toContain('Detailed requirements &amp; architectural roadmap');
    expect(html).toContain('Fixed milestone schedule');
    expect(html).toContain('Code reviews and 100% IP ownership');

    // CTA
    expect(html).toContain('Request a Quote');
    expect(html).toContain('href="/start-project?model=Fixed-Scope"');

    // Should NOT contain arbitrary price strings or empty price placeholders
    expect(html).not.toContain('/month');
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('null');
  });

  it('renders badge for popular cards', () => {
    const html = renderToString(
      <PricingCard
        name="Ongoing Agile Retainer"
        description="Dedicated team capacity."
        features={['Sprint-based delivery']}
        buttonText="Hire Our Architects"
        isPopular={true}
        badge="Most Popular"
        href="/start-project?model=Agile"
      />
    );

    expect(html).toContain('Most Popular');
    expect(html).toContain('Ongoing Agile Retainer');
    expect(html).toContain('Hire Our Architects');
  });

  it('conditionally renders price only when a valid numeric price is provided', () => {
    const htmlWithPrice = renderToString(
      <PricingCard
        name="Starter Package"
        description="Standard setup package."
        features={['Basic Setup']}
        price={499}
        currency="$"
        billingPeriod="month"
        buttonText="Get Started"
        href="/start-project"
      />
    );

    expect(htmlWithPrice).toContain('$499');
    expect(htmlWithPrice).toContain('/month');
  });
});
