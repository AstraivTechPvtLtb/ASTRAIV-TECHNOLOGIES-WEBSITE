import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { ServicesSection } from './services-section';
import { DEFAULT_SERVICES, SERVICE_VISUAL_MAP, getServiceVisual } from '@/lib/services-data';

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

// Mock framer-motion for SSR testing
vi.mock('framer-motion', () => ({
  useReducedMotion: () => false,
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ServicesSection Dynamic SVG Visual System', () => {
  it('renders all 6 service tabs with proper accessibility and text labels', () => {
    const html = renderToString(<ServicesSection initialServices={DEFAULT_SERVICES} />);

    // Heading
    expect(html).toContain('What can Astraiv');
    expect(html).toContain('engineer for you?');

    // Architecture badges
    expect(html).toContain('ISO 27001 &amp; SOC-2 READY ARCHITECTURE');
    expect(html).toContain('GLOBAL RESILIENCE:');
    expect(html).toContain('ACTIVE MULTI-REGION');
    expect(html).toContain('SLA 99.99%');

    // All 6 tabs must be present
    expect(html).toContain('services-tab-ai-development');
    expect(html).toContain('services-tab-custom-software');
    expect(html).toContain('services-tab-web-development');
    expect(html).toContain('services-tab-mobile-development');
    expect(html).toContain('services-tab-cloud-engineering');
    expect(html).toContain('services-tab-devops');

    // Tab labels
    expect(html).toContain('AI Development');
    expect(html).toContain('Custom Software Development');
    expect(html).toContain('Web Application Development');
    expect(html).toContain('Mobile Development');
    expect(html).toContain('Cloud Engineering');
    expect(html).toContain('DevOps &amp; CI/CD');

    // Default active visual must be AI Development SVG
    expect(html).toContain('ai-development.svg');
    expect(html).toContain('AI Development &amp; Cognitive Engineering Operations Center Photograph');

    // CTA Button
    expect(html).toContain('Explore Service Architecture');
  });

  it('correctly maps every service to its unique SVG illustration', () => {
    const services = [
      'ai-development',
      'custom-software',
      'web-development',
      'cloud-engineering',
      'mobile-development',
      'devops',
    ];

    const expectedSvgs: Record<string, string> = {
      'ai-development': '/images/services/ai-development.svg',
      'custom-software': '/images/services/custom-software-development.svg',
      'web-development': '/images/services/web-application-development.svg',
      'cloud-engineering': '/images/services/cloud-engineering.svg',
      'mobile-development': '/images/services/mobile-development.svg',
      'devops': '/images/services/devops-cicd.svg',
    };

    services.forEach((slug) => {
      const visual = getServiceVisual(slug);
      expect(visual.src).toBe(expectedSvgs[slug]);
      expect(visual.src.endsWith('.svg')).toBe(true);
      expect(visual.alt.length).toBeGreaterThan(10);
      expect(visual.glowGradient).toContain('radial-gradient');
    });
  });
});
