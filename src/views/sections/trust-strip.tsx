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
      return <CheckCircle2 className={cn(iconClass, 'text-primary dark:text-cyan-400')} aria-hidden="true" />;
    case 'Lock':
      return <Lock className={cn(iconClass, 'text-blue-600 dark:text-blue-400')} aria-hidden="true" />;
    case 'Award':
      return <Award className={cn(iconClass, 'text-primary dark:text-cyan-400')} aria-hidden="true" />;
    case 'Cloud':
      return <Cloud className={cn(iconClass, 'text-sky-600 dark:text-sky-400')} aria-hidden="true" />;
    case 'Star':
      return (
        <Star
          className={cn(
            iconClass,
            'text-blue-500 fill-blue-500/20 dark:text-cyan-400 dark:fill-cyan-400/20'
          )}
          aria-hidden="true"
        />
      );
    case 'Sparkles':
      return <Sparkles className={cn(iconClass, 'text-primary dark:text-cyan-400')} aria-hidden="true" />;
    case 'ShieldCheck':
    default:
      return <ShieldCheck className={cn(iconClass, 'text-primary dark:text-blue-400')} aria-hidden="true" />;
  }
}

/**
 * Individual Mini Accolade Card in the Marquee
 */
interface AccoladeMiniCardProps {
  item: AccoladeStripItem;
  isDuplicate?: boolean;
  isOpen?: boolean;
  onHover: (item: AccoladeStripItem, el: HTMLElement) => void;
  onLeave: () => void;
  onClick: (item: AccoladeStripItem, el: HTMLElement) => void;
}

function AccoladeMiniCard({
  item,
  isDuplicate = false,
  isOpen = false,
  onHover,
  onLeave,
  onClick,
}: AccoladeMiniCardProps) {
  const cardContent = (
    <div
      className={cn(
        'group/card relative shrink-0 flex items-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left',
        'bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/8',
        'hover:border-primary/50 dark:hover:border-blue-400/50 hover:bg-white dark:hover:bg-slate-800/75',
        'shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
        'hover:-translate-y-0.5 hover:shadow-card transition-all duration-200 ease-out select-none cursor-pointer',
        isOpen && 'border-primary/60 dark:border-blue-400/60 bg-white dark:bg-slate-800/90 shadow-card -translate-y-0.5'
      )}
      title={`${item.title} — Hover or tap to view verified audit details`}
    >
      {/* Icon Badge */}
      <div className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/8 group-hover/card:border-primary/30 dark:group-hover/card:border-blue-400/30 transition-colors">
        {renderBadgeIcon(item.icon, 'sm')}
      </div>

      {/* Content Stack */}
      <div className="flex flex-col text-left min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] sm:text-[12.5px] font-medium text-foreground group-hover/card:text-primary dark:group-hover/card:text-blue-300 transition-colors whitespace-nowrap tracking-tight">
            {item.title}
          </span>
          {item.statusLabel && (
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-md bg-slate-200/60 dark:bg-white/6 text-muted-foreground whitespace-nowrap">
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
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={isOpen ? 'accolade-popover' : undefined}
      onClick={(e) => onClick(item, e.currentTarget)}
      onMouseEnter={(e) => onHover(item, e.currentTarget)}
      onMouseLeave={onLeave}
      onFocus={(e) => {
        if (!isDuplicate) {
          onHover(item, e.currentTarget);
        }
      }}
      onBlur={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item, e.currentTarget);
        }
      }}
      aria-label={`View details for ${item.title}`}
      className="shrink-0 focus-visible:outline-2 focus-visible:outline-primary rounded-xl text-left cursor-pointer"
    >
      {cardContent}
    </div>
  );
}

import { createPortal } from 'react-dom';

/**
 * Calculates optimal popover coordinates anchored to the trigger card.
 * Handles viewport clamping, flipping (above vs below), sticky header offset, and horizontal shifting.
 */
interface PopoverPosition {
  top: number;
  left: number;
  placement: 'bottom' | 'top';
  maxHeight: number;
  width: number;
}

function calculatePopoverPosition(
  triggerEl: HTMLElement,
  popoverEl: HTMLElement | null
): PopoverPosition | null {
  if (typeof window === 'undefined') return null;

  const triggerRect = triggerEl.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Sticky header safe offset (approx 72px on desktop, 64px on mobile)
  const NAV_OFFSET = windowWidth < 640 ? 64 : 76;
  const MARGIN = 12;
  const GAP = 8;

  // Check if trigger is currently visible in viewport
  const isVisible =
    triggerRect.bottom > NAV_OFFSET &&
    triggerRect.top < windowHeight &&
    triggerRect.right > 0 &&
    triggerRect.left < windowWidth;

  if (!isVisible) {
    return null;
  }

  // Compact popover width: target ~360px on desktop, capped to viewport width minus safe margins
  const targetWidth = Math.min(360, windowWidth - MARGIN * 2);

  // Measure or estimate popover height
  const popoverHeight = popoverEl ? popoverEl.offsetHeight : 340;

  // Available vertical space
  const spaceBelow = windowHeight - triggerRect.bottom - GAP - MARGIN;
  const spaceAbove = triggerRect.top - NAV_OFFSET - GAP - MARGIN;

  let placement: 'bottom' | 'top' = 'bottom';
  let top = 0;
  let maxHeight = 360;

  // Choose placement: prefer bottom unless space below is tight and above has more space
  if (spaceBelow >= Math.min(popoverHeight, 260) || spaceBelow >= spaceAbove) {
    placement = 'bottom';
    top = triggerRect.bottom + GAP;
    maxHeight = Math.max(160, Math.min(480, spaceBelow));
  } else {
    placement = 'top';
    maxHeight = Math.max(160, Math.min(480, spaceAbove));
    top = Math.max(NAV_OFFSET + MARGIN, triggerRect.top - GAP - Math.min(popoverHeight, maxHeight));
  }

  // Horizontal alignment: Center over the trigger card, clamped to viewport safe margins
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  let left = triggerCenter - targetWidth / 2;

  // Clamp left to stay within viewport
  const minLeft = MARGIN;
  const maxLeft = Math.max(MARGIN, windowWidth - targetWidth - MARGIN);
  left = Math.max(minLeft, Math.min(maxLeft, left));

  return {
    top,
    left,
    placement,
    maxHeight,
    width: targetWidth,
  };
}

/**
 * Compact, Card-Anchored Popover
 * - Renders through a Portal without modal backdrop, blur, or scroll lock.
 * - Non-modal (role="dialog", aria-modal="false") keeping page readable and scrollable.
 * - Anchors directly to the hovered/focused trust card and updates position during scrolling.
 */
interface AccoladeDetailPopoverProps {
  item: AccoladeStripItem | null;
  triggerElement: HTMLElement | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function AccoladeDetailPopover({
  item,
  triggerElement,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: AccoladeDetailPopoverProps) {
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position on render, scroll, resize, or trigger changes
  const updatePosition = useCallback(() => {
    if (!triggerElement) {
      setPosition(null);
      return;
    }
    const pos = calculatePopoverPosition(triggerElement, popoverRef.current);
    if (!pos) {
      // Trigger scrolled out of visible viewport -> dismiss safely
      onClose();
    } else {
      setPosition(pos);
    }
  }, [triggerElement, onClose]);

  // Handle position calculation and scroll/resize listeners
  useEffect(() => {
    if (!item || !triggerElement) return;

    updatePosition();

    // Listen to window scroll (capture true to detect ancestor scrolls) and resize
    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Close on outside pointer click
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerElement &&
        !triggerElement.contains(target)
      ) {
        onClose();
      }
    };

    // Close on Escape key press and restore focus to trigger
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        triggerElement?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, triggerElement, updatePosition, onClose]);

  // Recalculate after content mount/paint to measure true height
  useEffect(() => {
    if (mounted && item && triggerElement) {
      const frameId = requestAnimationFrame(() => {
        updatePosition();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [mounted, item, triggerElement, updatePosition]);

  if (!mounted || !item || !triggerElement || !position) return null;

  const targetUrl = item.verificationUrl || item.href || ROUTES.PUBLIC.REWARDS_ACCOLADES;
  const isExternal = targetUrl.startsWith('http');

  const getStatusBadge = () => {
    switch (item.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-cyan-300 border border-primary/20 text-[10px] font-medium">
            <Check className="h-2.5 w-2.5" /> Audited &amp; Verified
          </span>
        );
      case 'contractual':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[10px] font-medium">
            <Shield className="h-2.5 w-2.5" /> Contractual SLA
          </span>
        );
      case 'active':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-medium">
            <FileCheck className="h-2.5 w-2.5" /> Active Alliance
          </span>
        );
    }
  };

  const popoverContent = (
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="false"
      id="accolade-popover"
      aria-labelledby="accolade-popover-title"
      aria-describedby="accolade-popover-description"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        zIndex: 50,
      }}
      className="pointer-events-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: position.placement === 'bottom' ? 5 : -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position.placement === 'bottom' ? 4 : -4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={cn(
          'relative rounded-xl border p-3.5 sm:p-4 text-left shadow-xl',
          'bg-card/98 dark:bg-slate-900/98 backdrop-blur-xl',
          'border-slate-200/90 dark:border-white/12',
          'shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_14px_40px_-8px_rgba(0,0,0,0.6)]'
        )}
      >
        {/* Subtle Ambient Radial Highlight inside card */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl"
          aria-hidden="true"
        >
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-primary/8 dark:bg-blue-500/10 rounded-full blur-2xl" />
        </div>

        {/* Top Header Bar: Category Chip, Status Badge, & Close Button */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70 dark:border-white/8">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.category && (
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-300 px-2 py-0.5 rounded-md bg-primary/10 dark:bg-blue-500/10 border border-primary/20 dark:border-blue-400/25">
                {item.category}
              </span>
            )}
            {getStatusBadge()}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <span className="text-xs font-semibold select-none leading-none">✕</span>
          </button>
        </div>

        {/* Scrollable Body (if content is tall) */}
        <div
          className="overflow-y-auto no-scrollbar pt-2.5 space-y-3"
          style={{ maxHeight: `${position.maxHeight - 90}px` }}
        >
          {/* Core Identity Row */}
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
              {renderBadgeIcon(item.icon, 'sm')}
            </div>

            <div className="flex flex-col min-w-0 pr-1">
              <h3
                id="accolade-popover-title"
                className="text-xs sm:text-[13px] font-bold text-foreground tracking-tight leading-snug"
              >
                {item.title}
              </h3>

              {(item.organization || item.year) && (
                <span className="text-[10.5px] text-muted-foreground font-medium mt-0.5 truncate">
                  {[item.organization, item.year].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>
          </div>

          {/* Detailed Description */}
          <p
            id="accolade-popover-description"
            className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
          >
            {item.description}
          </p>

          {/* Key Highlights / Audit Verification Controls */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="pt-2.5 border-t border-slate-200/60 dark:border-white/6">
              <h4 className="text-[9.5px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Verified Benchmarks &amp; Scope
              </h4>
              <div className="flex flex-col gap-1.5">
                {item.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 leading-snug"
                  >
                    <CheckCircle2
                      className="h-3 w-3 text-primary dark:text-cyan-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Achievement / Impact Callout */}
          {item.achievement && (
            <div className="p-2 rounded-lg bg-primary/4 dark:bg-blue-500/6 border border-primary/15 dark:border-blue-400/20 flex items-start gap-2">
              <ShieldCheck
                className="h-3.5 w-3.5 text-primary dark:text-blue-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-primary dark:text-blue-300">
                  Audited Impact
                </span>
                <span className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-normal mt-0.5">
                  {item.achievement}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-cyan-400" />
            <span className="truncate">Continuous Verification</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isExternal ? (
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center justify-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 shadow-xs"
              >
                <span>{item.verificationLabel || 'Verify Registry'}</span>
                <ExternalLink
                  className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ) : (
              <Link
                href={targetUrl}
                className="group/btn inline-flex items-center justify-center gap-1 px-3 py-1 rounded-lg text-[11px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 shadow-xs"
              >
                <span>{item.verificationLabel || 'Inspect Details'}</span>
                <ArrowRight
                  className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(popoverContent, document.body);
}

/**
 * Enterprise Trust & Accolades Mini Carousel Banner
 */
export function TrustStrip({ initialSettings, items, className }: TrustStripProps) {
  const [selectedAccolade, setSelectedAccolade] = useState<AccoladeStripItem | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const isCardOpen = selectedAccolade !== null && triggerElement !== null;
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringCardRef = useRef(false);

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

  // Immediate close (for Close button, Escape key)
  const handleImmediateClose = useCallback(() => {
    isHoveringCardRef.current = false;
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setSelectedAccolade(null);
    setTriggerElement(null);
  }, []);

  // Open popover on hover (debounced) or click/keyboard (immediate)
  const handleOpen = useCallback((item: AccoladeStripItem, el: HTMLElement, immediate = false) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (immediate) {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
      setSelectedAccolade(item);
      setTriggerElement(el);
      return;
    }

    // Debounce hover opening by 160ms to prevent flicker while crossing cards
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
    openTimeoutRef.current = setTimeout(() => {
      setSelectedAccolade(item);
      setTriggerElement(el);
    }, 160);
  }, []);

  // Click handler for toggle behavior
  const handleCardClick = useCallback((item: AccoladeStripItem, el: HTMLElement) => {
    setSelectedAccolade((prev) => {
      if (prev?.id === item.id) {
        setTriggerElement(null);
        return null;
      }
      setTriggerElement(el);
      return item;
    });
  }, []);

  // When cursor leaves any mini card: grace period to allow cursor to cross gap into popover
  const handleLeaveMiniCard = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringCardRef.current) {
        setSelectedAccolade(null);
        setTriggerElement(null);
      }
    }, 220);
  }, []);

  // When cursor enters the popover: keep it open while user interacts
  const handleMouseEnterPopover = useCallback(() => {
    isHoveringCardRef.current = true;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  // When cursor leaves the popover: auto-close smoothly after grace period
  const handleMouseLeavePopover = useCallback(() => {
    isHoveringCardRef.current = false;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringCardRef.current) {
        setSelectedAccolade(null);
        setTriggerElement(null);
      }
    }, 180);
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-blue-500/3 dark:bg-blue-500/4 blur-2xl" />
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
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary dark:bg-cyan-400 opacity-30 animation-duration-[3.5s]" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary dark:bg-cyan-400" />
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
                  className="group/cta inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary dark:text-blue-300 bg-primary/6 dark:bg-blue-500/8 hover:bg-primary/12 dark:hover:bg-blue-500/16 border border-primary/20 dark:border-blue-400/25 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200"
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
              className="accolade-marquee-viewport relative flex-1 min-w-0 w-full lg:w-auto overflow-hidden py-1 motion-reduce:overflow-x-auto no-scrollbar mask-[linear-gradient(to_right,transparent_0%,black_24px,black_calc(100%-24px),transparent_100%)] sm:mask-[linear-gradient(to_right,transparent_0%,black_36px,black_calc(100%-36px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_24px,black_calc(100%-24px),transparent_100%)] sm:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_36px,black_calc(100%-36px),transparent_100%)]"
              role="region"
              aria-label="Audited Standards and Accolades marquee"
              data-paused={isCardOpen}
            >
              <div className="flex w-max items-center">
                {/* Group 1: Primary items */}
                <div
                  className={cn(
                    'marquee-group flex shrink-0 items-center gap-3 pr-3 animate-accolade-marquee motion-reduce:animate-none',
                    isCardOpen && 'play-state-[paused!important]'
                  )}
                  style={isCardOpen ? { animationPlayState: 'paused' } : undefined}
                >
                  {presentationGroup.map((item, idx) => (
                    <AccoladeMiniCard
                      key={`g1-${item.id}-${idx}`}
                      item={item}
                      isOpen={selectedAccolade?.id === item.id}
                      onHover={(it, el) => handleOpen(it, el, false)}
                      onLeave={handleLeaveMiniCard}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>

                {/* Group 2: Seamless duplicate set */}
                <div
                  className={cn(
                    'marquee-group flex shrink-0 items-center gap-3 pr-3 animate-accolade-marquee motion-reduce:hidden',
                    isCardOpen && 'play-state-[paused!important]'
                  )}
                  style={isCardOpen ? { animationPlayState: 'paused' } : undefined}
                  aria-hidden="true"
                >
                  {presentationGroup.map((item, idx) => (
                    <AccoladeMiniCard
                      key={`g2-${item.id}-${idx}`}
                      item={item}
                      isDuplicate
                      isOpen={selectedAccolade?.id === item.id}
                      onHover={(it, el) => handleOpen(it, el, false)}
                      onLeave={handleLeaveMiniCard}
                      onClick={handleCardClick}
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
                className="group/cta inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-primary dark:text-blue-300 bg-primary/6 dark:bg-blue-500/8 hover:bg-primary/12 dark:hover:bg-blue-500/16 border border-primary/20 dark:border-blue-400/25 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200"
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
                className="group/cta w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary dark:text-blue-300 bg-primary/6 dark:bg-blue-500/8 hover:bg-primary/12 dark:hover:bg-blue-500/16 border border-primary/20 dark:border-blue-400/25 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200"
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

      {/* Compact Card-Anchored Popover with Smooth Transitions */}
      <AnimatePresence>
        {selectedAccolade && triggerElement && (
          <AccoladeDetailPopover
            item={selectedAccolade}
            triggerElement={triggerElement}
            onClose={handleImmediateClose}
            onMouseEnter={handleMouseEnterPopover}
            onMouseLeave={handleMouseLeavePopover}
          />
        )}
      </AnimatePresence>
    </>
  );
}
