import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TrustStrip, AccoladeStripItem } from './trust-strip';
import { ROUTES } from '@/routes';

// Mock routing Link
vi.mock('@/i18n/routing', () => ({
  Link: ({
    children,
    href,
    className,
    tabIndex,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    tabIndex?: number;
  }) => (
    <a href={href} className={className} tabIndex={tabIndex} {...props}>
      {children}
    </a>
  ),
}));

describe('TrustStrip Enterprise Marquee Redesign', () => {
  it('renders default institutional trust credentials and categories', () => {
    const html = renderToString(<TrustStrip />);

    // Institutional trust heading
    expect(html).toContain('Verified Institutional Trust');
    expect(html).toContain('Audited Standards &amp; Accolades');

    // Default institutional badges
    expect(html).toContain('ISO 9001:2015 Quality');
    expect(html).toContain('Standardized SDLC &amp; Zero-Drift Delivery');
    expect(html).toContain('SOC-2 Type II Ready');
    expect(html).toContain('Audited Tenant Isolation &amp; Access Controls');
    expect(html).toContain('Enterprise Craftsmanship');
    expect(html).toContain('High-Performance Architecture Honoree');

    // View All Accolades CTA
    expect(html).toContain('View All Accolades');
    expect(html).toContain(ROUTES.PUBLIC.REWARDS_ACCOLADES);
  });

  it('renders dynamic ISO settings properly', () => {
    const html = renderToString(
      <TrustStrip
        initialSettings={{
          isoNumber: 'ISO 27001:2025',
          isoLabel: 'Validated Architecture',
          showIsoBadge: true,
          showIsoSection: true,
          uptimeValue: '99.99%',
          uptimeLabel: 'Uptime',
          savingsValue: '40%',
          savingsLabel: 'Savings',
          actionsValue: '10M+',
          actionsLabel: 'Actions',
          slaValue: '15m',
          slaLabel: 'SLA',
        }}
      />
    );

    expect(html).toContain('ISO 27001:2025 Validated Architecture');
    expect(html).toContain('Information Security &amp; Data Protection');
  });

  it('hides ISO badge when showIsoBadge is false', () => {
    const html = renderToString(
      <TrustStrip
        initialSettings={{
          isoNumber: 'ISO 27001:2022',
          isoLabel: 'Certified',
          showIsoBadge: false,
          showIsoSection: true,
          uptimeValue: '99.99%',
          uptimeLabel: 'Uptime',
          savingsValue: '40%',
          savingsLabel: 'Savings',
          actionsValue: '10M+',
          actionsLabel: 'Actions',
          slaValue: '15m',
          slaLabel: 'SLA',
        }}
      />
    );

    expect(html).not.toContain('ISO 27001:2022 Certified');
    // Other badges must remain
    expect(html).toContain('ISO 9001:2015 Quality');
    expect(html).toContain('SOC-2 Type II Ready');
  });

  it('supports custom dynamic accolade items for admin/API integration', () => {
    const customItems: AccoladeStripItem[] = [
      {
        id: 'pci-dss',
        title: 'PCI-DSS Level 1 Compliance',
        description: 'Vault Encryption & FinTech Security',
        statusLabel: 'FinTech Grade',
        icon: 'Lock',
        href: '/company/security',
      },
      {
        id: 'ai-excellence',
        title: 'Autonomous AI Orchestration',
        description: 'Deterministic Multi-Agent Runtime Honoree',
        statusLabel: 'Innovation Award',
        icon: 'Sparkles',
        href: '/company/rewards-accolades',
      },
    ];

    const html = renderToString(<TrustStrip items={customItems} />);

    expect(html).toContain('PCI-DSS Level 1 Compliance');
    expect(html).toContain('Vault Encryption &amp; FinTech Security');
    expect(html).toContain('Autonomous AI Orchestration');
  });

  it('contains seamless infinite marquee structure with accessibility semantics', () => {
    const html = renderToString(<TrustStrip />);

    // Region label
    expect(html).toContain('aria-label="Audited Standards and Accolades marquee"');

    // Marquee viewport class
    expect(html).toContain('accolade-marquee-viewport');

    // Duplicate track has aria-hidden="true" for screen readers
    expect(html).toContain('aria-hidden="true"');

    // Marquee animation utility class
    expect(html).toContain('animate-accolade-marquee');

    // Reduced motion support
    expect(html).toContain('motion-reduce:animate-none');
    expect(html).toContain('motion-reduce:hidden');

    // Removed exposed browser scrollbar class
    expect(html).toContain('no-scrollbar');
  });

  it('renders mini cards as interactive buttons with accessible labels for modal view', () => {
    const html = renderToString(<TrustStrip />);

    // Interactive button triggers for modal
    expect(html).toContain('aria-label="View details for ISO 9001:2015 Quality"');
    expect(html).toContain('aria-label="View details for SOC-2 Type II Ready"');
    expect(html).toContain('aria-label="View details for Enterprise Craftsmanship"');
  });
});

