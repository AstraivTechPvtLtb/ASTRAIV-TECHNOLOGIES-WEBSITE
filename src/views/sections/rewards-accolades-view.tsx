'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Sparkles,
  Cloud,
  Star,
  Lock,
  ExternalLink,
  ArrowRight,
  Shield,
  FileCheck,
  Check,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  AccoladeItem,
  AccoladeCategory,
  ACCOLADE_CATEGORIES,
} from '@/lib/accolades-data';

interface RewardsAccoladesViewProps {
  initialAccolades: AccoladeItem[];
}

export function RewardsAccoladesView({ initialAccolades }: RewardsAccoladesViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedTab, setSelectedTab] = useState<AccoladeCategory | 'all'>('all');

  const filteredItems =
    selectedTab === 'all'
      ? initialAccolades
      : initialAccolades.filter((item) => item.type === selectedTab);

  // Grouped items for Section-by-Section layout when 'all' is selected
  const awards = initialAccolades.filter((item) => item.type === 'award');
  const certifications = initialAccolades.filter((item) => item.type === 'certification');
  const partnerships = initialAccolades.filter((item) => item.type === 'partnership');
  const recognitions = initialAccolades.filter((item) => item.type === 'recognition');

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="h-6 w-6 text-sky-600 dark:text-sky-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Lock':
        return <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case 'Cloud':
        return <Cloud className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />;
      case 'Star':
        return <Star className="h-6 w-6 text-amber-500 fill-amber-500/30 dark:text-amber-400" />;
      case 'Award':
      default:
        return <Award className="h-6 w-6 text-primary" />;
    }
  };

  const getStatusBadge = (status: AccoladeItem['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <Check className="h-3 w-3" /> Audited & Verified
          </span>
        );
      case 'contractual':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[11px] font-bold">
            <Shield className="h-3 w-3" /> Contractual SLA
          </span>
        );
      case 'active':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-bold">
            <FileCheck className="h-3 w-3" /> Active Alliance
          </span>
        );
    }
  };

  const renderCard = (item: AccoladeItem) => {
    const isExternal = item.verificationUrl?.startsWith('http');

    return (
      <motion.article
        key={item.id}
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.4 }}
        className="group relative flex flex-col justify-between rounded-2xl bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-7 shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all duration-300"
      >
        {/* Glow ambient background on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.04] rounded-full blur-2xl pointer-events-none group-hover:bg-primary/[0.08] transition-colors" />

        <div>
          {/* Top Row: Category Badge + Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              {item.category}
            </span>
            {getStatusBadge(item.status)}
          </div>

          {/* Header with Icon, Title, and Organization */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-border/40 dark:border-slate-700/60 shrink-0 group-hover:scale-105 transition-transform">
              {getIconComponent(item.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors leading-snug">
                {item.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-muted-foreground font-medium">
                <span className="text-foreground/90 font-semibold">{item.organization}</span>
                <span>•</span>
                <span className="font-mono text-primary dark:text-blue-400 font-semibold">{item.year}</span>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal mb-5">
            {item.description}
          </p>

          {/* Related Achievement Callout Box */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-950/60 border border-border/50 dark:border-slate-800/80 mb-5 text-left">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Related Achievement
              </span>
            </div>
            <p className="text-xs text-foreground/80 font-medium leading-normal">
              {item.achievement}
            </p>
          </div>

          {/* Technical Highlights / Safeguards */}
          <div className="space-y-1.5 mb-6 text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Verified Technical Safeguards
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {item.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer: Verification Link & Badge */}
        <div className="pt-4 border-t border-border/40 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            {item.badgeText}
          </span>

          {item.verificationUrl && (
            isExternal ? (
              <a
                href={item.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-blue-400 hover:underline transition-colors"
              >
                <span>{item.verificationLabel || 'Verify Credential'}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <Link
                href={item.verificationUrl}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-cyan-400 hover:text-primary/80 dark:hover:text-cyan-300 transition-colors"
              >
                <span>{item.verificationLabel || 'View Verification'}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            )
          )}
        </div>
      </motion.article>
    );
  };

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sm:mb-16">
        <button
          onClick={() => setSelectedTab('all')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer',
            selectedTab === 'all'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'bg-card/80 dark:bg-slate-900/80 text-muted-foreground hover:text-foreground border border-border/60 dark:border-slate-800/80'
          )}
        >
          All Accolades ({initialAccolades.length})
        </button>

        {ACCOLADE_CATEGORIES.map((cat) => {
          const count = initialAccolades.filter((item) => item.type === cat.type).length;
          return (
            <button
              key={cat.type}
              onClick={() => setSelectedTab(cat.type)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                selectedTab === cat.type
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card/80 dark:bg-slate-900/80 text-muted-foreground hover:text-foreground border border-border/60 dark:border-slate-800/80'
              )}
            >
              <span>{cat.label}</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-background/20 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {selectedTab === 'all' ? (
        <div className="space-y-16 sm:space-y-20 text-left">
          {/* 1. AWARDS */}
          <section id="awards" className="scroll-mt-24">
            <div className="mb-6 sm:mb-8 border-b border-border/40 dark:border-slate-800/80 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Award className="h-3.5 w-3.5" />
                <span>Section 1 · Awards</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                Technical & Engineering Awards
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                Honors recognizing architectural craftsmanship, deterministic AI orchestration, and software delivery excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {awards.map(renderCard)}
            </div>
          </section>

          {/* 2. CERTIFICATIONS */}
          <section id="certifications" className="scroll-mt-24">
            <div className="mb-6 sm:mb-8 border-b border-border/40 dark:border-slate-800/80 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Section 2 · Certifications</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                Compliance & Security Certifications
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                Audited global benchmarks governing enterprise data protection, quality SDLC governance, and regulatory posture.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map(renderCard)}
            </div>
          </section>

          {/* 3. PARTNERSHIPS */}
          <section id="partnerships" className="scroll-mt-24">
            <div className="mb-6 sm:mb-8 border-b border-border/40 dark:border-slate-800/80 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Cloud className="h-3.5 w-3.5" />
                <span>Section 3 · Partnerships</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                Cloud & Technology Ecosystem Partnerships
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                Verified alliances with foundational cloud providers, edge networks, and modern software architectures.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnerships.map(renderCard)}
            </div>
          </section>

          {/* 4. RECOGNITIONS */}
          <section id="recognitions" className="scroll-mt-24">
            <div className="mb-6 sm:mb-8 border-b border-border/40 dark:border-slate-800/80 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Star className="h-3.5 w-3.5" />
                <span>Section 4 · Recognitions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                Audited Recognitions & Operational Benchmarks
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                Documented delivery reliability, 100% positive executive feedback, and contractually guaranteed SLAs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recognitions.map(renderCard)}
            </div>
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredItems.map(renderCard)}
        </div>
      )}
    </div>
  );
}
