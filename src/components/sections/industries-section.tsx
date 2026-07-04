'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from './section-header';
import { 
  DollarSign, 
  Heart, 
  Layers, 
  ShoppingCart, 
  Truck, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';

export function IndustriesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const industries = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: 'FinTech',
      title: 'Secure FinTech & Transactional Infrastructure',
      subtitle: 'High-availability ledger integration and Stripe billing pipelines.',
      details: 'We build institutional-grade payment engines, micro-transaction processing pipelines, multi-tenant subscription routing, and detailed billing analytics dashboards that follow PCI-DSS compliance strictly.',
      metrics: ['99.999% API Uptime', 'Stripe Certified partner integrations', 'PCI-DSS Compliant architectures'],
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: 'HealthTech',
      title: 'HIPAA-Compliant Patient & BioTech Portals',
      subtitle: 'Encrypted databases and secure cloud pipelines for medical applications.',
      details: 'Our BioTech systems automate clinical trials workflow pipelines, manage electronic health record integrations securely, and facilitate patient data access while meeting HIPAA privacy requirements at rest and in transit.',
      metrics: ['Full HIPAA Compliance', 'AES-256 encrypted endpoints', 'Legacy HL7/FHIR compatibility'],
    },
    {
      icon: <Layers className="h-5 w-5" />,
      label: 'SaaS Platforms',
      title: 'Next-Gen SaaS Dashboards & Core Logic',
      subtitle: 'Performant web apps utilizing Server Components and Prisma.',
      details: 'We engineer premium, multi-tenant SaaS dashboards that render instantly, load databases securely with Prisma, sync CRM leads, and offer state-of-the-art UI/UX that keeps users engaged.',
      metrics: ['<100ms average response time', 'Pre-configured auth & role structures', 'Vercel-optimized caching'],
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      title: 'High-Conversion E-commerce Engines',
      label: 'E-commerce',
      subtitle: 'Optimized headless storefronts built for peak loads.',
      details: 'We build lightning-fast storefronts leveraging Shopify headless APIs or custom serverless databases, maximizing conversion rates using layout psychology, and automating inventory sync pipelines.',
      metrics: ['+35% Mobile Conversion Rates', '<1.2s Largest Contentful Paint', 'Dynamic inventory webhook syncs'],
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: 'Logistics & Route Optimization Systems',
      label: 'Logistics',
      subtitle: 'Automating tracking APIs and scheduling systems.',
      details: 'Our custom logistics software tracks delivery fleet routes in real-time, optimizes load capacities using AI models, and automates vendor notification webhooks for zero manual tracking lag.',
      metrics: ['-18% Route overhead costs', 'Real-time WebSockets tracking', 'Automated vendor dispatch'],
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      title: 'Immersive EdTech & Training Modules',
      label: 'EdTech',
      subtitle: 'Scalable class pipelines and automated tests evaluations.',
      details: 'We build interactive learning dashboards, secure student portal billing, real-time assessment APIs, and rich vector-graphic training systems that render fluidly across all mobile devices.',
      metrics: ['Support for 100k+ concurrent users', 'SCORM & LTI compliant adapters', '98% user satisfaction rates'],
    },
  ];

  return (
    <section id="industries" className="py-20 md:py-28 px-6 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Industries"
          title="Tailored Solutions for Complex Industries"
          description="We do not build generic templates. We deliver specialized software architected for the unique regulatory and operational needs of your industry."
        />

        {/* Desktop tab buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-12 max-w-4xl mx-auto">
          {industries.map((ind, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 relative ${
                  isActive 
                    ? 'text-primary-foreground bg-primary shadow-md shadow-primary/10' 
                    : 'text-muted-foreground bg-slate-100 dark:bg-slate-900 border border-border/40 hover:text-foreground'
                }`}
              >
                {ind.icon}
                <span>{ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content panel */}
        <div className="mt-12 max-w-5xl mx-auto min-h-[380px] bg-card border border-border/40 rounded-[20px] shadow-md p-8 md:p-12 text-left relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute right-0 bottom-0 opacity-[0.02] dark:opacity-[0.03] translate-x-12 translate-y-12 select-none pointer-events-none">
            {industries[activeTab].icon}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10"
            >
              <div className="lg:col-span-3 flex flex-col gap-4">
                <span className="inline-flex self-start px-3 py-1 text-[10px] font-bold tracking-wider text-secondary bg-secondary/10 dark:bg-secondary/20 rounded-full border border-secondary/20">
                  {industries[activeTab].label} Architecture
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                  {industries[activeTab].title}
                </h3>
                <h4 className="text-sm font-semibold text-muted-foreground leading-relaxed italic">
                  {industries[activeTab].subtitle}
                </h4>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                  {industries[activeTab].details}
                </p>
                <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-accent hover:underline mt-2">
                  Request {industries[activeTab].label} Consultation <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-border/40 flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Operational Benchmarks</h4>
                <ul className="flex flex-col gap-3">
                  {industries[activeTab].metrics.map((metric, mIdx) => (
                    <li key={mIdx} className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
