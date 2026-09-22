'use client';

/**
 * @file client/src/views/sections/services-section.tsx
 * @description [VIEW] Capabilities Blueprint - Futuristic Holographic Operations Center
 * High-tech interactive billboard with real-time telemetry, 3D mouse tracking,
 * dynamic capability switching, and direct navigation to services.
 */

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { DEFAULT_SERVICES, type PublicServiceItem } from '@/lib/services-data';
import { getServiceImage } from '@/lib/services-utils';

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
  const [activeTab, setActiveTab] = useState<string>('ai-development');
  const [ping, setPing] = useState<string>('12ms');
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

  // Telemetry Ping simulation for live authentic feel
  useEffect(() => {
    const pings = ['11ms', '12ms', '14ms', '15ms', '16ms', '13ms'];
    const interval = setInterval(() => {
      const nextPing = pings[Math.floor(Math.random() * pings.length)];
      setPing(nextPing);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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

  // Holographic Mouse Spotlight & 3D Tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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

    // Subtle 3D tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -1.5;
    const rotateY = ((x - centerX) / centerX) * 1.5;
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
      className="max-w-[1520px] mx-auto w-full relative z-10 transition-all duration-700 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 scroll-mt-20 overflow-hidden"
    >
      {/* Cyber Ambient Canvas Grid & Glow Layers */}
      <div className="absolute inset-0 cyber-grid-pattern pointer-events-none opacity-40 -z-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-[520px] h-[320px] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-12 left-10 w-[380px] h-[220px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* HEADER SECTION */}
      <header className="mb-8 sm:mb-10 lg:mb-12">
        {/* Category Badge */}
        <div className="inline-flex items-center mb-5 group cursor-default">
          <span className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase text-cyan-300 bg-[#091e32]/85 border border-cyan-500/40 font-mono flex items-center gap-2.5 shadow-[0_0_15px_rgba(0,242,254,0.15)] transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            OUR SERVICES & CAPABILITIES
          </span>
        </div>

        {/* Main Heading and Contextual Subtitle */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
          <h2
            className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight text-white max-w-3xl leading-[1.2] lg:leading-[1.22]"
            id="blueprint-heading"
          >
            What can Astraiv
            <br />
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
              build & engineer for you?
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-[15px] max-w-md leading-relaxed lg:text-left lg:self-center">
            From autonomous AI systems and custom enterprise SaaS to high-velocity web platforms and zero-downtime cloud networks, we design, build, and scale mission-critical software.
          </p>
        </div>
      </header>

      {/* GIANT HOLOGRAPHIC BILLBOARD */}
      <div className="perspective-card w-full" style={{ perspective: '1200px' }}>
        <article
          ref={billboardRef}
          id="billboard-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative w-full rounded-3xl overflow-hidden hologram-glow bg-[#080e1c]/85 backdrop-blur-2xl border border-cyan-500/30 group"
        >
          {/* Ambient Spotlight Mouse Follower Canvas Layer */}
          <div
            ref={spotlightRef}
            id="cyber-spotlight"
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(0,242,254,0.14),transparent_45%)]"
          />

          {/* Interactive Corner Accents with Active Glow */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80 z-20 pointer-events-none rounded-tl-3xl shadow-[0_0_12px_rgba(0,242,254,0.5)]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80 z-20 pointer-events-none rounded-tr-3xl shadow-[0_0_12px_rgba(0,242,254,0.5)]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80 z-20 pointer-events-none rounded-bl-3xl shadow-[0_0_12px_rgba(0,242,254,0.5)]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80 z-20 pointer-events-none rounded-br-3xl shadow-[0_0_12px_rgba(0,242,254,0.5)]" />

          {/* Real Panoramic Photography with High-Tech Dark Gradient Overlay */}
          <div className="relative w-full min-h-[580px] sm:min-h-[560px] lg:h-[630px] overflow-hidden flex flex-col justify-between">
            {/* Background Image Layer */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/images/services/capabilities-command-center.jpg"
                alt="Astraiv Technologies Engineering Operations Center"
                id="command-img"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.80] contrast-[1.10]"
              />
              {/* Cyberpunk Obsidian & Cyan Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#080e1c]/75 to-[#040813]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-transparent to-[#030712]/90" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#030712_100%)] opacity-85" />
            </div>

            {/* Top HUD Status Ribbon */}
            <div className="relative top-0 left-0 right-0 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 z-20">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#081222]/90 backdrop-blur-md border border-cyan-500/50 text-[11px] font-mono uppercase tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
                </span>
                <span className="font-semibold">
                  OPS NODE ACTIVE // <span className="text-white" id="uptime-val">99.99%</span> SYSTEM UPTIME
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-300 bg-[#080e1c]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-900/60 shadow-inner">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400">GLOBAL TELEMETRY:</span>
                </span>
                <span className="text-cyan-400 font-semibold tracking-wide" id="telemetry-status">
                  SYNCHRONIZED
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] text-slate-400 font-mono" id="telemetry-ping">
                  {ping}
                </span>
              </div>
            </div>

            {/* Integrated Overlay Blueprint Grid Matrix & Footer */}
            <div className="relative bottom-0 inset-x-0 p-5 sm:p-8 lg:p-10 z-20 flex flex-col justify-end mt-auto">
              {/* Capabilities Interactive Ribbon Matrix (Clickable Tabs) */}
              <div
                role="tablist"
                aria-label="Technology Capabilities"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 lg:gap-3 mb-6 sm:mb-7"
              >
                {capabilities.map((cap) => {
                  const isActive = cap.id === activeTab;
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTabChange(cap.id)}
                      className={`cap-tab text-left transition-all duration-300 backdrop-blur-md px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-2.5 group/tab cursor-pointer ${
                        isActive
                          ? 'active-tab bg-[#0c1c38]/95 border border-cyan-400/80 shadow-[0_0_20px_rgba(0,242,254,0.35)] -translate-y-0.5 ring-1 ring-cyan-400/50'
                          : 'bg-[#0b162c]/80 hover:bg-[#0f1f3d]/90 border border-cyan-500/25 hover:border-cyan-400/60 hover:shadow-[0_0_18px_rgba(0,242,254,0.18)] hover:-translate-y-0.5'
                      }`}
                    >
                      {isActive ? (
                        <div className="indicator relative flex h-2.5 w-2.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300 shadow-[0_0_6px_#00f2fe]" />
                        </div>
                      ) : (
                        <div className="indicator w-2 h-2 rounded-full bg-slate-400 group-hover/tab:bg-cyan-400 transition-colors shrink-0" />
                      )}
                      <span
                        className={`tab-label text-[11.5px] sm:text-[12px] font-semibold tracking-wide truncate ${
                          isActive
                            ? 'text-cyan-300'
                            : 'text-slate-200 group-hover/tab:text-cyan-200'
                        }`}
                      >
                        {cap.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Footer Banner Inside Card with Dynamic Tab Telemetry */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 pt-5 sm:pt-6 border-t border-cyan-500/25">
                <div className="max-w-2xl">
                  <div
                    className="flex flex-wrap items-center gap-2 mb-2 transition-opacity duration-200"
                    style={{ opacity: isFading ? 0 : 1 }}
                  >
                    <span
                      id="suite-badge"
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-cyan-950/85 border border-cyan-500/50 text-cyan-300 tracking-wider shadow-[0_0_10px_rgba(0,242,254,0.15)]"
                    >
                      {activeCapability.badge}
                    </span>
                    <span
                      id="category-specs"
                      className="text-xs font-mono text-slate-300 sm:text-slate-400"
                    >
                      {activeCapability.specs}
                    </span>
                    <span
                      id="live-latency"
                      className="hidden sm:inline-flex text-[11px] font-mono text-cyan-400/80 border-l border-slate-700 pl-2"
                    >
                      LATENCY: {activeCapability.latency}
                    </span>
                  </div>
                  <p
                    id="category-description"
                    className="text-xs sm:text-sm text-slate-200 sm:text-slate-300 leading-relaxed transition-opacity duration-200"
                    style={{ opacity: isFading ? 0 : 1 }}
                  >
                    {activeCapability.desc}
                  </p>
                </div>

                {/* Primary Magnetic CTA Button - Directly opens Services page */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <Link
                    href="/services"
                    className="relative w-full md:w-auto inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:via-sky-300 hover:to-blue-500 text-slate-950 font-extrabold text-sm tracking-wide transition-all duration-300 shadow-[0_0_35px_rgba(0,242,254,0.45)] hover:shadow-[0_0_50px_rgba(0,242,254,0.7)] transform hover:-translate-y-0.5 active:translate-y-0 group/btn overflow-hidden"
                  >
                    {/* Button Light Sweep Beam */}
                    <span className="absolute inset-0 cyber-btn-shine animate-shimmer-btn opacity-40 group-hover/btn:opacity-80 pointer-events-none" />
                    <span className="relative z-10 font-extrabold tracking-wide">
                      Explore All Services
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative z-10 text-lg transition-transform duration-300 group-hover/btn:translate-x-1.5 font-mono"
                    >
                      →
                    </span>
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
