'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  DollarSign, 
  Heart, 
  ShoppingCart, 
  Truck, 
  GraduationCap,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { EASE_OUT_EXPO, MOTION_DURATIONS } from '@/lib/motion';

export function IndustriesSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);

  const industries = [
    {
      id: 'fintech',
      icon: <DollarSign className="h-5 w-5" />,
      label: 'FinTech',
      title: 'Institutional FinTech & Transactional Infrastructure',
      subtitle: 'PCI-DSS compliant ledgers, Stripe pipelines, and automated reconciliation.',
      details: 'We engineer institutional-grade payment engines, micro-transaction processing pipelines, multi-tenant billing algorithms, and risk analytics dashboards that strictly adhere to PCI-DSS Level 1 compliance.',
      imageSrc: '/images/industries/industry-fintech.jpg',
      metrics: [
        { label: 'API Uptime SLA', val: '99.999%' },
        { label: 'Reconciliation Latency', val: '< 18ms' },
        { label: 'Compliance Standard', val: 'PCI-DSS & SOC-2' },
      ],
    },
    {
      id: 'healthtech',
      icon: <Heart className="h-5 w-5" />,
      label: 'HealthTech',
      title: 'HIPAA-Compliant Patient & Biotech Telemetry Portals',
      subtitle: 'Encrypted databases, EHR synchronization, and secure clinical telemetry.',
      details: 'Our biotech systems automate clinical trial data collection, securely synchronize Electronic Health Record (EHR/FHIR) databases, and provide doctors and patients with sub-second real-time vitals access.',
      imageSrc: '/images/industries/industry-healthtech.jpg',
      metrics: [
        { label: 'Privacy Standard', val: 'Full HIPAA Compliance' },
        { label: 'Data Encryption', val: 'AES-256 GCM Rest/Transit' },
        { label: 'Interoperability', val: 'HL7 / FHIR V4 Ready' },
      ],
    },
    {
      id: 'ecommerce',
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'E-Commerce',
      title: 'High-Conversion Headless Storefronts & Inventory Engines',
      subtitle: 'Sub-second checkout velocity, Shopify headless, and dynamic inventory sync.',
      details: 'We build lightning-fast headless storefronts with Next.js edge rendering, maximizing purchase conversions through layout psychology, automated inventory webhooks, and zero cart abandonment lag.',
      imageSrc: '/images/industries/industry-ecommerce.jpg',
      metrics: [
        { label: 'Mobile Conversion', val: '+38% Average Lift' },
        { label: 'Largest Contentful Paint', val: '< 0.9s Globally' },
        { label: 'Inventory Webhooks', val: 'Instant Redis Cache' },
      ],
    },
    {
      id: 'logistics',
      icon: <Truck className="h-5 w-5" />,
      label: 'Logistics',
      title: 'Real-Time Fleet Telemetry & AI Route Optimization',
      subtitle: 'Live parcel coordination, WebSocket telemetry maps, and auto-dispatching.',
      details: 'Our custom supply chain software tracks delivery fleets in real-time across global waypoints, leverages predictive AI models to minimize route fuel overhead, and automates vendor notification dispatch loops.',
      imageSrc: '/images/industries/industry-logistics.jpg',
      metrics: [
        { label: 'Route Overhead', val: '-22% Fuel Savings' },
        { label: 'Live Tracking Stream', val: 'Sub-50ms WebSockets' },
        { label: 'Dispatch Precision', val: 'Automated Routing' },
      ],
    },
    {
      id: 'edtech',
      icon: <GraduationCap className="h-5 w-5" />,
      label: 'EdTech',
      title: 'Interactive Learning Dashboards & Mastery Tracking',
      subtitle: 'Scalable student class pipelines, real-time tests, and vector knowledge graphs.',
      details: 'We create immersive digital learning hubs, automated test evaluation APIs, secure student billing, and rich interactive knowledge graph visualizers that deliver seamless performance across any device.',
      imageSrc: '/images/industries/industry-edtech.jpg',
      metrics: [
        { label: 'Concurrent Users', val: '100k+ Load Tested' },
        { label: 'Curriculum Standards', val: 'SCORM & LTI Adapters' },
        { label: 'Course Completion', val: '+45% Engagement' },
      ],
    },
  ];

  return (
    <section id="industries" className="py-20 md:py-28 px-4 sm:px-6 bg-transparent relative scroll-mt-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[400px] bg-primary/5 dark:bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          badge="Industries"
          title="Technology for Every Industry"
          description="We do not build generic templates. We deliver specialized software architected for the unique regulatory, operational, and scale requirements of your domain."
        />

        {/* Industry Category Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-12 max-w-5xl mx-auto w-full">
          {industries.map((ind, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'text-white bg-primary shadow-md shadow-primary/25 border border-primary ring-2 ring-primary/20'
                    : 'text-muted-foreground bg-card/85 dark:bg-slate-900/70 border border-border/70 dark:border-slate-800/80 hover:text-foreground hover:border-primary/40 dark:hover:border-blue-400/40 active:scale-[0.98]'
                }`}
              >
                {ind.icon}
                <span>{ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Industry Showcase Feature Card with Large Picture */}
        <div className="mt-12 max-w-6xl mx-auto bg-card/90 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={{ duration: MOTION_DURATIONS.normal, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-5 sm:p-8 md:p-10 items-center text-left"
            >
              {/* Left Column: High-Resolution Visual Picture */}
              <div className="lg:col-span-6 relative w-full h-[260px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden shadow-inner group/img border border-border/50 dark:border-slate-800/80 bg-slate-950">
                <Image
                  src={industries[activeTab].imageSrc}
                  alt={industries[activeTab].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover/img:scale-[1.03] will-change-transform"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />
                
                {/* Visual Overlay Tag */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-blue-400/30 text-blue-300 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 animate-pulse" />
                    <span>Live Sector Architecture</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-300 bg-slate-950/60 px-2.5 py-1 rounded-md">
                    0{activeTab + 1} / 05
                  </span>
                </div>
              </div>

              {/* Right Column: Detailed Business & Engineering Scope */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-5">
                <div>
                  <span className="inline-flex self-start px-3 py-1 text-[10px] font-extrabold tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 rounded-full border border-primary/20 dark:border-blue-400/20 uppercase mb-3">
                    {industries[activeTab].label} Technology
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                    {industries[activeTab].title}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-secondary dark:text-indigo-400 mt-2 italic">
                    {industries[activeTab].subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium mt-3">
                    {industries[activeTab].details}
                  </p>
                </div>

                {/* Operational Benchmarks Grid */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-border/60 dark:border-slate-700/60 flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Operational Benchmarks
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {industries[activeTab].metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="text-sm sm:text-base font-extrabold text-foreground font-mono">
                          {m.val}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Linking to Industry Detail Page */}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={ROUTES.PUBLIC.INDUSTRY_DETAIL(industries[activeTab].id)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors group min-h-[28px] py-1"
                  >
                    <span>Explore {industries[activeTab].label} Solutions</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Explore All Industries Section CTA */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            href={ROUTES.PUBLIC.INDUSTRIES}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-foreground hover:text-primary dark:hover:text-blue-400 bg-card/80 hover:bg-card border border-border/60 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all shadow-xs hover:shadow-md group"
          >
            <span>Explore All Industries</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
