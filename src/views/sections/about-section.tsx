'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Cpu, Cloud, Code2, Users } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const capabilities = [
    {
      metric: '99.99%',
      label: 'Cloud Availability SLA',
      detail: 'Multi-region distributed failover',
      icon: <Cloud className="h-4 w-4 text-cyan-400" />,
    },
    {
      metric: '10M+',
      label: 'API Operations & Actions',
      detail: 'Mission-critical automated pipelines',
      icon: <Cpu className="h-4 w-4 text-indigo-400" />,
    },
    {
      metric: '40%+',
      label: 'Infrastructure Savings',
      detail: 'Optimized serverless architectures',
      icon: <Code2 className="h-4 w-4 text-blue-400" />,
    },
    {
      metric: '100%',
      label: 'Sprint SLA Delivery',
      detail: 'Predictable high-velocity sprints',
      icon: <Shield className="h-4 w-4 text-emerald-400" />,
    },
  ];

  const teamChips = [
    {
      name: 'Senior AI Architect',
      role: 'Autonomous Agent Pipelines & RAG',
      status: 'Active · Distributed Systems',
    },
    {
      name: 'Cloud Infrastructure Lead',
      role: 'Zero-Downtime AWS / Kubernetes',
      status: 'Active · Multi-Region Edge',
    },
    {
      name: 'Principal Fullstack Engineer',
      role: 'Next.js 16, Prisma & Typesafe APIs',
      status: 'Active · Real-Time Portals',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Large Dark Showcase Panel (Matching PDF Page 1 Composition) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          className="relative bg-slate-950 text-white rounded-3xl lg:rounded-[32px] border border-slate-800/80 p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl"
        >
          {/* Subtle Mouse-Following Glow (Restrained 600px radius) */}
          {!shouldReduceMotion && (
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-60 dark:opacity-80"
              style={{
                background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(11, 61, 145, 0.25), rgba(0, 194, 255, 0.08), transparent 80%)`,
              }}
            />
          )}

          {/* Grid Layout: Left Narrative / Right Metrics & Platform Showcase */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            {/* Left Column (5 Cols): Editorial Narrative & Leadership Badges */}
            <div className="lg:col-span-6 flex flex-col justify-between text-left">
              <div>
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 mb-6 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>ABOUT ASTRAIV</span>
                </div>

                {/* Main Statement */}
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.18] mb-5">
                  Engineering intelligent digital systems for ambitious businesses.
                </h2>

                {/* Supporting Copy */}
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-8 font-normal">
                  Astraiv Technologies partners with forward-thinking enterprises to design, develop, and deploy
                  mission-critical software, custom AI models, and scalable cloud infrastructure. We eliminate
                  technical bottlenecks and accelerate engineering velocity.
                </p>

                {/* Learn More CTA */}
                <Link
                  href="/company#why-us"
                  className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 group transition-colors mb-10 cursor-pointer"
                >
                  <span>Learn About Our Methodology</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Stacked Team / Engineering Credibility Chips (PDF Page 1 reference) */}
              <div className="flex flex-col gap-2.5 pt-6 border-t border-slate-800/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Core Engineering Capabilities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {teamChips.map((chip) => (
                    <div
                      key={chip.name}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="block text-xs font-bold text-slate-200 truncate">{chip.name}</span>
                      <span className="block text-[10px] text-slate-400 truncate">{chip.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (6 Cols): 2x2 Metric Grid & Astraiv Platform Showcase Card */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              {/* 2x2 Matrix */}
              <div className="grid grid-cols-2 gap-4">
                {capabilities.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-8 w-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wide">
                        Verified
                      </span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block mb-1">
                        {item.metric}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-200 block mb-0.5">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{item.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Showcase Card (Matching PDF Page 1 "TOTALWORX" Card) */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      ASTRAIV PLATFORM ENGINE
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                    End-to-end engineering from system architecture to production deployment with full client portal transparency.
                  </p>
                </div>

                <Link
                  href="/services"
                  className="shrink-0 h-10 w-10 rounded-xl bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 border border-slate-700 flex items-center justify-center transition-all duration-200"
                  aria-label="Explore Platform Services"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
