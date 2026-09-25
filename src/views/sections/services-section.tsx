'use client';

/**
 * @file client/src/views/sections/services-section.tsx
 * @description [VIEW] Capabilities Blueprint - Futuristic Holographic Operations Center
 * High-tech interactive billboard with real-time telemetry, 3D mouse tracking,
 * dynamic capability switching, and direct navigation to services.
 */

import React, { useState, useRef, useTransition } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { DEFAULT_SERVICES, type PublicServiceItem } from '@/lib/services-data';
import { getServiceImage } from '@/lib/services-utils';

import { useReducedMotion } from 'framer-motion';

export { getServiceImage };

export interface ServicesSectionProps {
  initialServices?: PublicServiceItem[];
}

interface CapabilityItem {
  id: string;
  label: string;
  badge: string;
  specs: string;
  desc: string;
  latency: string;
  href: string;
}

export function ServicesSection({ initialServices = [] }: ServicesSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<string>('ai-development');
  const [isFading, setIsFading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const billboardRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const servicesList = initialServices && initialServices.length > 0 ? initialServices : DEFAULT_SERVICES;
  const seenSlugs = new Set<string>();
  const uniqueServices = servicesList.filter((s) => {
    if (seenSlugs.has(s.slug)) return false;
    seenSlugs.add(s.slug);
    return true;
  });

  const capabilities: CapabilityItem[] = uniqueServices.slice(0, 6).map((s, idx) => ({
    id: s.slug,
    label: s.title,
    badge: (s.badge || 'ENGINEERING EXCELLENCE').toUpperCase(),
    specs: s.techStack ? s.techStack.join(' · ') : s.features.slice(0, 3).join(' · '),
    desc: s.shortDesc,
    latency: ['12ms', '8ms', '11ms', '14ms', '9ms', '7ms'][idx % 6],
    href: `/services/${s.slug}`,
  }));

  const activeCapability = capabilities.find((c) => c.id === activeTab) || capabilities[0];

  // Smooth Tab Switcher
  const handleTabChange = (categoryId: string) => {
    if (categoryId === activeTab) return;
    setIsFading(true);
    setTimeout(() => {
      startTransition(() => {
        setActiveTab(categoryId);
        setIsFading(false);
      });
    }, 140);
  };

  // Holographic Mouse Spotlight & 3D Tilt interaction (restrained and desktop-only)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || typeof window !== 'undefined' && window.innerWidth < 768) return;
    const billboard = billboardRef.current;
    const spotlight = spotlightRef.current;
    if (!billboard) return;

    const rect = billboard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (spotlight) {
      spotlight.style.opacity = '1';
      spotlight.style.setProperty('--mouse-x', `${x}px`);
      spotlight.style.setProperty('--mouse-y', `${y}px`);
    }

    // Subtle, restrained 3D tilt calculation (1.2deg max)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -1.2;
    const rotateY = ((x - centerX) / centerX) * 1.2;
    billboard.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0';
    }
    if (billboardRef.current) {
      billboardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <section
      id="services"
      aria-labelledby="blueprint-heading"
      className="max-w-7xl mx-auto w-full relative z-10 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20 overflow-hidden"
    >
      {/* Subtle Ambient Glow Layers */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 dark:bg-blue-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <header className="mb-10 sm:mb-12 lg:mb-14">
        {/* Category Badge */}
        <div className="inline-flex items-center mb-4">
          <span className="px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/25">
            Capabilities & Architecture
          </span>
        </div>

        {/* Main Heading and Contextual Subtitle */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold tracking-tight text-foreground leading-[1.2] max-w-2xl"
            id="blueprint-heading"
          >
            What can Astraiv{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
              engineer for you?
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed lg:text-left font-medium">
            From autonomous AI systems and custom enterprise SaaS to high-velocity web platforms and zero-downtime cloud networks, we design, build, and scale mission-critical software.
          </p>
        </div>
      </header>

      {/* ENTERPRISE CAPABILITIES BILLBOARD */}
      <div className="w-full" style={{ perspective: '1200px' }}>
        <article
          ref={billboardRef}
          id="billboard-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform 0.2s ease-out',
          }}
          className="relative w-full rounded-2xl lg:rounded-3xl overflow-hidden bg-card dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-card-hover group"
        >
          {/* Ambient Spotlight Mouse Follower Canvas Layer */}
          <div
            ref={spotlightRef}
            id="cyber-spotlight"
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(37,99,235,0.12),transparent_45%)]"
          />

          {/* Panoramic Photography with Clean Architectural Gradients */}
          <div className="relative w-full min-h-[560px] sm:min-h-[540px] lg:h-[600px] overflow-hidden flex flex-col justify-between">
            {/* Background Image Layer */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/services/capabilities-command-center.jpg"
                alt="Astraiv Technologies Engineering Operations Center"
                id="command-img"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-1000 ease-out brightness-[0.75] contrast-[1.10]"
              />
              {/* Refined Obsidian Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/80" />
            </div>

            {/* Top Status Ribbon */}
            <div className="relative top-0 left-0 right-0 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 z-20">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ISO 27001 &amp; SOC-2 READY ARCHITECTURE</span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-300 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xs">
                <span className="text-slate-400">GLOBAL RESILIENCE:</span>
                <span className="text-emerald-400 font-semibold tracking-wide">
                  ACTIVE MULTI-REGION
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  SLA 99.99%
                </span>
              </div>
            </div>

            {/* Integrated Capabilities Ribbon Matrix & Footer */}
            <div className="relative bottom-0 inset-x-0 p-4 sm:p-7 lg:p-9 z-20 flex flex-col justify-end mt-auto">
              {/* Capabilities Interactive Ribbon Matrix: Horizontal Scroll on Mobile (<640px) */}
              <div
                role="tablist"
                aria-label="Technology Capabilities (Mobile)"
                className="flex sm:hidden overflow-x-auto no-scrollbar gap-2 pb-2 mb-4"
              >
                {capabilities.map((cap) => {
                  const isActive = cap.id === activeTab;
                  return (
                    <button
                      key={`mob-${cap.id}`}
                      id={`services-tab-mob-${cap.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="services-tabpanel"
                      onClick={() => handleTabChange(cap.id)}
                      className={`shrink-0 text-left transition-all duration-200 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center gap-2 cursor-pointer border text-xs font-semibold select-none min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        isActive
                          ? 'active-tab bg-primary text-white border-primary shadow-xs'
                          : 'bg-slate-950/70 hover:bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                      <span className="whitespace-nowrap">{cap.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Capabilities Interactive Ribbon Matrix: Desktop Grid (>=640px) */}
              <div
                role="tablist"
                aria-label="Technology Capabilities"
                className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 mb-6"
              >
                {capabilities.map((cap) => {
                  const isActive = cap.id === activeTab;
                  return (
                    <button
                      key={cap.id}
                      id={`services-tab-${cap.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="services-tabpanel"
                      onClick={() => handleTabChange(cap.id)}
                      className={`cap-tab text-left transition-all duration-200 backdrop-blur-md px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 group/tab cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        isActive
                          ? 'active-tab bg-primary text-white border-primary shadow-sm -translate-y-0.5'
                          : 'bg-slate-950/60 hover:bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className={`indicator w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-slate-400 group-hover/tab:bg-blue-400'}`} />
                      <span className="text-xs font-semibold tracking-wide truncate">
                        {cap.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Footer Banner Inside Card */}
              <div
                role="tabpanel"
                id="services-tabpanel"
                aria-labelledby={`services-tab-${activeTab}`}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/15"
              >
                <div className="max-w-2xl text-left">
                  <div
                    className="flex flex-wrap items-center gap-2 mb-2 transition-opacity duration-200"
                    style={{ opacity: isFading ? 0 : 1 }}
                  >
                    <span
                      id="suite-badge"
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 border border-white/20 text-white tracking-wider"
                    >
                      {activeCapability.badge}
                    </span>
                    <span
                      id="category-specs"
                      className="text-xs font-mono text-slate-300"
                    >
                      {activeCapability.specs}
                    </span>
                  </div>
                  <p
                    id="category-description"
                    className="text-xs sm:text-sm text-slate-200 leading-relaxed transition-opacity duration-200 font-medium"
                    style={{ opacity: isFading ? 0 : 1 }}
                  >
                    {activeCapability.desc}
                  </p>
                </div>

                {/* Primary CTA Button */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <Link
                    href={activeCapability.href || '/services'}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-primary hover:bg-[#082d6c] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-sm hover:shadow-md border border-blue-900/20 dark:border-blue-400/30 min-h-[44px]"
                  >
                    <span>Explore Service Architecture</span>
                    <span aria-hidden="true" className="font-mono">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
