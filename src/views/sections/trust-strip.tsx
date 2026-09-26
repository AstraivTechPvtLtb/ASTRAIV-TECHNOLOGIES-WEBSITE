'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Cloud,
  Star,
  Lock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Check,
  Shield,
  FileCheck,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { PublicComplianceSettings } from '@/models/types';
import { cn } from '@/lib/utils';

export interface AccoladeStripItem {
  id: string;
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  category?: string;
  type?: 'certification' | 'award' | 'partnership' | 'recognition' | string;
  status?: 'verified' | 'active' | 'contractual' | string;
  statusLabel?: string;
  organization?: string;
  year?: string;
  achievement?: string;
  highlights?: string[];
  verificationUrl?: string;
  verificationLabel?: string;
  href?: string;
  displayOrder?: number;
  published?: boolean;
}

export interface TrustStripProps {
  initialSettings?: PublicComplianceSettings;
  items?: AccoladeStripItem[];
  className?: string;
}

/**
 * Resolves an icon prop to an enterprise-styled icon element.
 */
function renderBadgeIcon(
  icon: string | React.ReactNode | undefined,
  size: 'sm' | 'lg' = 'sm'
) {
  if (React.isValidElement(icon)) {
    return icon;
  }

  const iconName = typeof icon === 'string' ? icon : '';
  const iconClass = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';

  switch (iconName) {
    case 'CheckCircle2':
      return <CheckCircle2 className={cn(iconClass, 'text-emerald-600 dark:text-emerald-400')} aria-hidden="true" />;
    case 'Lock':
      return <Lock className={cn(iconClass, 'text-blue-600 dark:text-blue-400')} aria-hidden="true" />;
    case 'Award':
      return <Award className={cn(iconClass, 'text-purple-600 dark:text-purple-400')} aria-hidden="true" />;
    case 'Cloud':
      return <Cloud className={cn(iconClass, 'text-amber-600 dark:text-amber-400')} aria-hidden="true" />;
    case 'Star':
      return (
        <Star
          className={cn(
            iconClass,
            'text-amber-500 fill-amber-500/20 dark:text-amber-400 dark:fill-amber-400/20'
          )}
          aria-hidden="true"
        />
      );
    case 'Sparkles':
      return <Sparkles className={cn(iconClass, 'text-indigo-600 dark:text-indigo-400')} aria-hidden="true" />;
    case 'ShieldCheck':
    default:
      return <ShieldCheck className={cn(iconClass, 'text-sky-600 dark:text-sky-400')} aria-hidden="true" />;
  }
}

/**
 * Individual Mini Accolade Card in the Marquee
 */
interface AccoladeMiniCardProps {
  item: AccoladeStripItem;
  isDuplicate?: boolean;
  onHover: (item: AccoladeStripItem) => void;
  onLeave: () => void;
  onClick: (item: AccoladeStripItem) => void;
}

function AccoladeMiniCard({
  item,
  isDuplicate = false,
  onHover,
  onLeave,
  onClick,
}: AccoladeMiniCardProps) {
  const cardContent = (
    <div
      className={cn(
        'group/card relative shrink-0 flex items-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left',
        'bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/[0.08]',
        'hover:border-primary/50 dark:hover:border-blue-400/50 hover:bg-white dark:hover:bg-slate-800/75',
        'shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
        'hover:-translate-y-0.5 hover:shadow-card transition-all duration-200 ease-out select-none cursor-pointer'
      )}
      title={`${item.title} — Hover or tap to view verified audit details`}
    >
      {/* Icon Badge */}
      <div className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/[0.08] group-hover/card:border-primary/30 dark:group-hover/card:border-blue-400/30 transition-colors">
        {renderBadgeIcon(item.icon, 'sm')}
      </div>

      {/* Content Stack */}
      <div className="flex flex-col text-left min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] sm:text-[12.5px] font-bold text-foreground group-hover/card:text-primary dark:group-hover/card:text-blue-300 transition-colors whitespace-nowrap tracking-tight">
            {item.title}
          </span>
          {item.statusLabel && (
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-md bg-slate-200/60 dark:bg-white/[0.06] text-muted-foreground whitespace-nowrap">
              {item.statusLabel}
            </span>
          )}
        </div>
        <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium whitespace-nowrap">
          {item.description}
        </span>
      </div>
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={isDuplicate ? -1 : 0}
      aria-hidden={isDuplicate}
      onClick={() => onClick(item)}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={onLeave}
      onFocus={() => !isDuplicate && onHover(item)}
      onBlur={onLeave}
      aria-label={`View details for ${item.title}`}
      className="shrink-0 focus-visible:outline-2 focus-visible:outline-primary rounded-xl text-left cursor-pointer"
    >
      {cardContent}
    </div>
  );
}

/**
 * Enlarged Medium Size Card (Modal Dialog)
 * - Cross button is removed as requested.
 * - Backdrop blur is reduced to 2px so background is visible.
 * - Pointer events are non-blocking so all cards (side and middle) hover seamlessly.
 */
interface AccoladeDetailModalProps {
  item: AccoladeStripItem | null;
  onClose: () => void;
  onMouseEnterCard: () => void;
  onMouseLeaveCard: () => void;
}

function AccoladeDetailModal({
  item,
  onClose,
  onMouseEnterCard,
  onMouseLeaveCard,
}: AccoladeDetailModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const targetUrl = item.verificationUrl || item.href || ROUTES.PUBLIC.REWARDS_ACCOLADES;
  const isExternal = targetUrl.startsWith('http');

  const getStatusBadge = () => {
    switch (item.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10.5px] font-bold">
            <Check className="h-3 w-3" /> Audited & Verified
          </span>
        );
      case 'contractual':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[10.5px] font-bold">
            <Shield className="h-3 w-3" /> Contractual SLA
          </span>
        );
      case 'active':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10.5px] font-bold">
            <FileCheck className="h-3 w-3" /> Active Alliance
          </span>
        );
    }
  };

  return (
    <>
      {/* Light subtle backdrop with reduced blur so background remains clearly visible. Pointer-events are non-blocking to never interfere with hovering side cards. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="fixed inset-0 z-40 bg-slate-950/20 dark:bg-black/35 backdrop-blur-[2px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Enlarged Medium Size Card Container */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accolade-modal-title"
        aria-describedby="accolade-modal-description"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={onMouseEnterCard}
          onMouseLeave={onMouseLeaveCard}
          className="pointer-events-auto relative w-full max-w-lg sm:max-w-xl group/modal select-text"
        >
          {/* Layer 1: Ambient Outer Glow Halo matching Astraiv UI palette (#2563eb, #38bdf8, #818cf8) */}
          <div
            className="pointer-events-none absolute -inset-2 rounded-[28px] bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 opacity-45 dark:opacity-65 blur-2xl animate-modal-glow-pulse -z-10 transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Layer 2: Glowing Border Frame with Broad 2.5px-3px Border and Circulating Light Effect (top -> right -> down -> left -> up) */}
          <div className="relative rounded-[20px] p-[2.5px] sm:p-[3px] overflow-hidden bg-slate-200/90 dark:bg-slate-800/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
            {/* Circulating Light Effect rounding the rectangle clockwise */}
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 w-[350%] h-[350%] -translate-x-1/2 -translate-y-1/2 animate-modal-border-spin motion-reduce:hidden"
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, transparent 0deg 180deg, rgba(37, 99, 235, 0.2) 220deg, #2563eb 250deg, #0ea5e9 280deg, #818cf8 310deg, #38bdf8 335deg, #ffffff 352deg, #38bdf8 358deg, transparent 360deg)',
              }}
              aria-hidden="true"
            />

            {/* Accessible static fallback for reduced-motion */}
            <div
              className="hidden motion-reduce:block pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500"
              aria-hidden="true"
            />

            {/* Layer 3: Inner Card Content */}
            <div className="relative w-full max-h-[85vh] overflow-y-auto no-scrollbar rounded-[17px] bg-card dark:bg-slate-900/98 backdrop-blur-2xl p-5 sm:p-7 text-left z-10">
              {/* Subtle Ambient Radial Highlight inside card */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[17px]"
                aria-hidden="true"
              >
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 dark:bg-blue-500/10 rounded-full blur-3xl" />
              </div>

              {/* Top Header Bar: Category Chip & Status Badge (Cross button removed as requested) */}
              <div className="flex items-center gap-2 flex-wrap pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
                {item.category && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-300 px-2.5 py-0.5 rounded-md bg-primary/10 dark:bg-blue-500/10 border border-primary/20 dark:border-blue-400/25">
                    {item.category}
                  </span>
                )}
                {getStatusBadge()}
              </div>

              {/* Core Identity Row */}
              <div className="flex items-start gap-3.5 sm:gap-4 pt-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  {renderBadgeIcon(item.icon, 'lg')}
                </div>

                <div className="flex flex-col min-w-0 pr-1">
                  <h3
                    id="accolade-modal-title"
                    className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug"
                  >
                    {item.title}
                  </h3>

                  {(item.organization || item.year) && (
                    <span className="text-xs text-muted-foreground font-medium mt-0.5">
                      {[item.organization, item.year].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed Description */}
              <p
                id="accolade-modal-description"
                className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal mt-4"
              >
                {item.description}
              </p>

              {/* Key Highlights / Audit Verification Controls */}
              {item.highlights && item.highlights.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-white/[0.06]">
                  <h4 className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Verified Technical Benchmarks & Scope
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-[11.5px] text-slate-700 dark:text-slate-300 leading-snug"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Achievement / Impact Callout */}
              {item.achievement && (
                <div className="mt-4 p-3 rounded-xl bg-primary/[0.04] dark:bg-blue-500/[0.06] border border-primary/15 dark:border-blue-400/20 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-primary dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary dark:text-blue-300">
                      Audited Operational Impact
                    </span>
                    <span className="text-[11.5px] text-slate-700 dark:text-slate-300 font-medium leading-normal mt-0.5">
                      {item.achievement}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Continuous Production Verification</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-auto text-center"
                  >
                    Close
                  </button>

                  {isExternal ? (
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 w-full sm:w-auto text-center shadow-xs"
                    >
                      <span>{item.verificationLabel || 'Verify External Registry'}</span>
                      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      href={targetUrl}
                      className="group/btn inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 w-full sm:w-auto text-center shadow-xs"
                    >
                      <span>{item.verificationLabel || 'Inspect Full Accreditation'}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/**
 * Enterprise Trust & Accolades Mini Carousel Banner
 */
export function TrustStrip({ initialSettings, items, className }: TrustStripProps) {
  const [selectedAccolade, setSelectedAccolade] = useState<AccoladeStripItem | null>(null);
  const isCardOpen = selectedAccolade !== null;
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringCardRef = useRef(false);
  const activeMiniCardRef = useRef<string | null>(null);

  const isoNumber = initialSettings?.isoNumber || 'ISO 27001:2022';
  const isoLabel = initialSettings?.isoLabel !== undefined ? initialSettings.isoLabel : 'Certified';
  const showIsoBadge = initialSettings?.showIsoBadge ?? true;

  const defaultBadges: AccoladeStripItem[] = [
    ...(showIsoBadge
      ? [
          {
            id: 'iso-security',
            icon: 'ShieldCheck',
            title: `${isoNumber} ${isoLabel}`.trim(),
            description: 'Information Security & Data Protection',
            category: 'Security Standard',
            status: 'verified',
            statusLabel: 'ISO ISMS',
            organization: 'International Organization for Standardization (ISO)',
            year: '2022 – Present',
            achievement:
              'Zero security breaches, zero unencrypted credential disclosures, and continuous data isolation maintained across every production client deployment.',
            highlights: [
              'Zero-Trust tenant partitioning',
              'Automated cryptographic credential rotation',
              'Encrypted transit & storage (TLS 1.3 / AES-256)',
              'Regular threat surface penetration assessments',
            ],
            verificationUrl: ROUTES.PUBLIC.REWARDS_ACCOLADES,
            verificationLabel: 'Inspect Security ISMS',
            href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
          },
        ]
      : []),
    {
      id: 'iso-quality',
      icon: 'CheckCircle2',
      title: 'ISO 9001:2015 Quality',
      description: 'Standardized SDLC & Zero-Drift Delivery',
      category: 'Quality Governance',
      status: 'verified',
      statusLabel: 'SDLC Quality',
      organization: 'International Organization for Standardization (ISO)',
      year: '2015 – Present',
      achievement:
        'Maintained a 99.8% bug-free milestone completion rate across client production deliveries with zero architectural regression drift.',
      highlights: [
        'Standardized SDLC release gates & verification protocols',
        'Mandatory double-peer PR reviews',
        'Strict automated Vitest & TypeScript verification',
        'Continuous quality feedback loops',
      ],
      verificationUrl: ROUTES.PUBLIC.REWARDS_ACCOLADES,
      verificationLabel: 'Inspect Delivery Lifecycle',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'soc2-ready',
      icon: 'Lock',
      title: 'SOC-2 Type II Ready',
      description: 'Audited Tenant Isolation & Access Controls',
      category: 'Compliance Posture',
      status: 'verified',
      statusLabel: 'Audited',
      organization: 'AICPA Trust Services Criteria (Security, Availability, Confidentiality)',
      year: '2024 – 2026',
      achievement:
        'Passed institutional client third-party architectural compliance assessments on initial submission without corrective action requests.',
      highlights: [
        'Immutable database audit logging & session tracking',
        'Role-based granular access controls (RBAC)',
        'Automated daily backup & failover redundancy tests',
        'Strict confidentiality & NDA safeguards',
      ],
      verificationUrl: ROUTES.PUBLIC.REWARDS_ACCOLADES,
      verificationLabel: 'View Compliance Blueprint',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'award-craftsmanship',
      icon: 'Award',
      title: 'Enterprise Craftsmanship',
      description: 'High-Performance Architecture Honoree',
      category: 'Verified Award',
      status: 'verified',
      statusLabel: 'Honoree',
      organization: 'Client Peer Review & Technology Evaluation Forum',
      year: '2025 – 2026',
      achievement:
        'Delivered up to 40% cloud infrastructure cost reductions and zero unscheduled downtime across mission-critical client deployments.',
      highlights: [
        'Deterministic AI agent verification loops',
        'Scalable Next.js 16 / React 19 architecture',
        '40% cloud footprint cost optimization',
        'Zero unscheduled production downtime',
      ],
      verificationUrl: ROUTES.PUBLIC.REWARDS_ACCOLADES,
      verificationLabel: 'Inspect Case Studies & Architecture',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'cloud-partners',
      icon: 'Cloud',
      title: 'AWS & Cloudflare Partners',
      description: 'Multi-Region High Availability & Edge CDN',
      category: 'Cloud Architecture',
      status: 'active',
      statusLabel: 'Tier-1 Alliance',
      organization: 'Amazon Web Services & Cloudflare Global Edge Network',
      year: '2024 – Present',
      achievement:
        'Achieved global p95 latency under 50ms and 99.99% system availability across enterprise fintech and SaaS client deployments.',
      highlights: [
        'Multi-region high availability & automated failover',
        'Global 300+ edge city point-of-presence',
        'Zero-egress asset storage via Cloudflare R2',
        'Sub-50ms p95 API response gateways',
      ],
      verificationUrl: ROUTES.PUBLIC.REWARDS_ACCOLADES,
      verificationLabel: 'View Cloud Alliances',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'client-rating',
      icon: 'Star',
      title: '5.0 / 5.0 Star Client Rating',
      description: '100% Retained Client Satisfaction Score',
      category: 'Verified Reviews',
      status: 'verified',
      statusLabel: '5.0 Rating',
      organization: 'Verified Client Reviews & Leadership Endorsements',
      year: '2025 – 2026',
      achievement:
        '100% client retention and positive endorsements across enterprise fintech, SaaS, logistics, and healthcare software deployments.',
      highlights: [
        '100% client recommendation rate',
        'Zero architectural drift on handoff',
        'Direct founder-level engineering access',
        'Transparent milestone sign-offs & SLA delivery',
      ],
      verificationUrl: ROUTES.PUBLIC.WORK_TESTIMONIALS,
      verificationLabel: 'Read Client Testimonials',
      href: ROUTES.PUBLIC.WORK_TESTIMONIALS,
    },
  ];

  const baseItems = items && items.length > 0 ? items : defaultBadges;
  const activeItems = baseItems.filter((i) => i.published !== false);

  // Intelligently repeat at presentation layer to guarantee seamless infinite loop width on all viewports
  const presentationGroup = React.useMemo(() => {
    if (activeItems.length === 0) return [];
    let group = [...activeItems];
    while (group.length < 6) {
      group = [...group, ...activeItems];
    }
    return group;
  }, [activeItems]);

  // Open modal on hover or tap (works for any card: side, middle, or duplicate)
  const handleOpen = useCallback((item: AccoladeStripItem) => {
    activeMiniCardRef.current = item.id;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setSelectedAccolade(item);
  }, []);

  // When cursor leaves any mini card: brief grace period to allow cursor to reach enlarged card or another card
  const handleLeaveMiniCard = useCallback(() => {
    activeMiniCardRef.current = null;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringCardRef.current && !activeMiniCardRef.current) {
        setSelectedAccolade(null);
      }
    }, 220);
  }, []);

  // When cursor enters the enlarged card: keep open while user reads
  const handleMouseEnterCard = useCallback(() => {
    isHoveringCardRef.current = true;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  // When cursor leaves the enlarged card: auto-close gracefully and smoothly
  const handleMouseLeaveCard = useCallback(() => {
    isHoveringCardRef.current = false;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringCardRef.current && !activeMiniCardRef.current) {
        setSelectedAccolade(null);
      }
    }, 180);
  }, []);

  // Immediate close (for Close button, Escape key)
  const handleImmediateClose = useCallback(() => {
    isHoveringCardRef.current = false;
    activeMiniCardRef.current = null;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setSelectedAccolade(null);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <section
        id="trust-recognition-strip"
        aria-label="Verified Awards, Certifications, and Industry Recognitions"
        className={cn(
          'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 relative z-30 select-none',
          className
        )}
      >
        {/* Slightly increased height & padding for relaxed enterprise breathing room */}
        <div className="relative rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl p-3.5 sm:p-4 lg:py-3.5 lg:px-4.5 shadow-card overflow-hidden">
          {/* Subtle Ambient Radial Highlight Behind Carousel */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl"
            aria-hidden="true"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-blue-500/[0.03] dark:bg-blue-500/[0.04] blur-2xl" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-3.5 lg:gap-4">
            {/* Top Bar for Mobile/Tablet or Left Anchor on Desktop */}
            <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-3.5 shrink-0">
              {/* Left: Verified Category Label */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30 shrink-0">
                  <Award className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-[10.5px] font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-300">
                      Verified Institutional Trust
                    </span>
                    {/* Subtle, calm verification indicator */}
                    <span
                      className="relative flex h-2 w-2 items-center justify-center"
                      aria-label="Verified Status Active"
                      title="Active Verified Compliance"
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 [animation-duration:3.5s]" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                    Audited Standards & Accolades
                  </span>
                </div>
              </div>

              {/* Tablet CTA: Visible between 640px and 1023px */}
              <div className="hidden sm:block lg:hidden shrink-0">
                <Link
                  href={ROUTES.PUBLIC.REWARDS_ACCOLADES}
                  className="group/cta inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary dark:text-blue-300 bg-primary/[0.06] dark:bg-blue-500/[0.08] hover:bg-primary/[0.12] dark:hover:bg-blue-500/[0.16] border border-primary/20 dark:border-blue-400/25 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200"
                >
                  <span>View All Accolades</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-primary/70 dark:text-blue-300/80 transition-transform duration-200 group-hover/cta:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Left Divider */}
            <div
              className="hidden lg:block h-8 w-px bg-slate-200/80 dark:bg-white/10 shrink-0 mx-0.5"
              aria-hidden="true"
            />

            {/* Center: Infinite Continuous Auto-Scrolling Accolade Marquee */}
            <div
              className="accolade-marquee-viewport relative flex-1 min-w-0 w-full lg:w-auto overflow-hidden py-1 motion-reduce:overflow-x-auto no-scrollbar [mask-image:linear-gradient(to_right,transparent_0%,black_24px,black_calc(100%-24px),transparent_100%)] sm:[mask-image:linear-gradient(to_right,transparent_0%,black_36px,black_calc(100%-36px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_24px,black_calc(100%-24px),transparent_100%)] sm:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_36px,black_calc(100%-36px),transparent_100%)]"
              role="region"
              aria-label="Audited Standards and Accolades marquee"
              data-paused={isCardOpen}
            >
              <div className="flex w-max items-center">
                {/* Group 1: Primary items */}
                <div
                  className={cn(
                    'marquee-group flex shrink-0 items-center gap-3 pr-3 animate-accolade-marquee motion-reduce:animate-none',
                    isCardOpen && '[animation-play-state:paused!important]'
                  )}
                  style={isCardOpen ? { animationPlayState: 'paused' } : undefined}
                >
                  {presentationGroup.map((item, idx) => (
                    <AccoladeMiniCard
                      key={`g1-${item.id}-${idx}`}
                      item={item}
                      onHover={handleOpen}
                      onLeave={handleLeaveMiniCard}
                      onClick={handleOpen}
                    />
                  ))}
                </div>

                {/* Group 2: Seamless duplicate set */}
                <div
                  className={cn(
                    'marquee-group flex shrink-0 items-center gap-3 pr-3 animate-accolade-marquee motion-reduce:hidden',
                    isCardOpen && '[animation-play-state:paused!important]'
                  )}
                  style={isCardOpen ? { animationPlayState: 'paused' } : undefined}
                  aria-hidden="true"
                >
                  {presentationGroup.map((item, idx) => (
                    <AccoladeMiniCard
                      key={`g2-${item.id}-${idx}`}
                      item={item}
                      isDuplicate
                      onHover={handleOpen}
                      onLeave={handleLeaveMiniCard}
                      onClick={handleOpen}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Right Divider */}
            <div
              className="hidden lg:block h-8 w-px bg-slate-200/80 dark:bg-white/10 shrink-0 mx-0.5"
              aria-hidden="true"
            />

            {/* Right: Quick Action Link on Desktop (>= 1024px) */}
            <div className="hidden lg:block shrink-0">
              <Link
                href={ROUTES.PUBLIC.REWARDS_ACCOLADES}
                className="group/cta inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-primary dark:text-blue-300 bg-primary/[0.06] dark:bg-blue-500/[0.08] hover:bg-primary/[0.12] dark:hover:bg-blue-500/[0.16] border border-primary/20 dark:border-blue-400/25 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200"
              >
                <span className="whitespace-nowrap">View All Accolades</span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-primary/70 dark:text-blue-300/80 transition-transform duration-200 group-hover/cta:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Mobile CTA: Visible under 640px, centered below carousel */}
            <div className="w-full sm:hidden pt-0.5 flex justify-center">
              <Link
                href={ROUTES.PUBLIC.REWARDS_ACCOLADES}
                className="group/cta w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary dark:text-blue-300 bg-primary/[0.06] dark:bg-blue-500/[0.08] hover:bg-primary/[0.12] dark:hover:bg-blue-500/[0.16] border border-primary/20 dark:border-blue-400/25 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200"
              >
                <span>View All Accolades</span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-primary/70 dark:text-blue-300/80 transition-transform duration-200 group-hover/cta:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enlarged Medium Size Card Modal with Smooth Transitions & Light Subtle Backdrop */}
      <AnimatePresence>
        {selectedAccolade && (
          <AccoladeDetailModal
            item={selectedAccolade}
            onClose={handleImmediateClose}
            onMouseEnterCard={handleMouseEnterCard}
            onMouseLeaveCard={handleMouseLeaveCard}
          />
        )}
      </AnimatePresence>
    </>
  );
}
