import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Cloud,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';
import { PublicComplianceSettings } from '@/models/types';

export interface TrustStripProps {
  initialSettings?: PublicComplianceSettings;
}

export function TrustStrip({ initialSettings }: TrustStripProps) {

  const isoNumber = initialSettings?.isoNumber || 'ISO 27001:2022';
  const isoLabel = initialSettings?.isoLabel !== undefined ? initialSettings.isoLabel : 'Certified';
  const showIsoBadge = initialSettings?.showIsoBadge ?? true;

  const trustBadges = [
    ...(showIsoBadge
      ? [
          {
            id: 'iso-security',
            icon: <ShieldCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />,
            badge: `${isoNumber} ${isoLabel}`.trim(),
            subtext: 'Information Security & Data Protection',
            category: 'Security Standard',
            href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
          },
        ]
      : []),
    {
      id: 'iso-quality',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      badge: 'ISO 9001:2015 Quality',
      subtext: 'Standardized SDLC & Zero-Drift Delivery',
      category: 'Quality Governance',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'soc2-ready',
      icon: <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      badge: 'SOC-2 Type II Ready',
      subtext: 'Audited Tenant Isolation & Access Controls',
      category: 'Compliance Posture',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'award-craftsmanship',
      icon: <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
      badge: 'Enterprise Craftsmanship',
      subtext: 'High-Performance Architecture Honoree',
      category: 'Verified Award',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'cloud-partners',
      icon: <Cloud className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      badge: 'AWS & Cloudflare Partners',
      subtext: 'Multi-Region High Availability & Edge CDN',
      category: 'Cloud Architecture',
      href: ROUTES.PUBLIC.REWARDS_ACCOLADES,
    },
    {
      id: 'client-rating',
      icon: <Star className="h-4 w-4 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" />,
      badge: '5.0 / 5.0 Star Client Rating',
      subtext: '100% Retained Client Satisfaction Score',
      category: 'Verified Reviews',
      href: ROUTES.PUBLIC.WORK_TESTIMONIALS,
    },
  ];

  return (
    <section
      id="trust-recognition-strip"
      aria-label="Verified Awards, Certifications, and Industry Recognitions"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 relative z-20 select-none"
    >
      <div className="rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl p-3 sm:p-4 shadow-card">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-5">
          {/* Left: Verified Category Label & Directory Link */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30">
              <Award className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-300">
                  Verified Institutional Trust
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                Audited Standards & Accolades
              </span>
            </div>
          </div>

          {/* Center: Concise Trust Badges Horizontal Scroll / Wrap */}
          <div className="w-full lg:w-auto flex-1 flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
            {trustBadges.map((badge) => (
              <div
                key={badge.id}
                className="group relative shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all cursor-default"
                title={`${badge.badge} · ${badge.subtext}`}
              >
                <div className="shrink-0">{badge.icon}</div>
                <div className="flex flex-col text-left">
                  <span className="text-[11.5px] sm:text-xs font-bold text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors whitespace-nowrap">
                    {badge.badge}
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                    {badge.subtext}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Quick Action Link to Full Rewards & Accolades Page */}
          <div className="shrink-0 self-end lg:self-center">
            <Link
              href={ROUTES.PUBLIC.REWARDS_ACCOLADES}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-primary dark:text-blue-300 bg-primary/10 dark:bg-blue-500/10 hover:bg-primary/15 dark:hover:bg-blue-500/20 border border-primary/20 dark:border-blue-400/30 transition-all group"
            >
              <span>View All Accolades</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
