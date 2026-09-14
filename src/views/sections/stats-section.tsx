'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { PublicComplianceSettings } from '@/models/types';

// ==========================================
// Authentic Company Brand Logos (Originals)
// ==========================================

function AcmeLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Acme Corp logo">
      {/* Acme geometric diamond/anvil icon */}
      <path
        d="M12 2.5L3.5 17.5H8.5L9.5 21.5H14.5L15.5 17.5H20.5L12 2.5Z"
        fill="#EF4444"
        fillOpacity="0.2"
        stroke="#EF4444"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 7.5L8.5 14H15.5L12 7.5Z" fill="#EF4444" />
      <rect x="10.8" y="11.5" width="2.4" height="2.4" fill="#121824" />
    </svg>
  );
}

function GlobexLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Globex logo">
      <circle cx="12" cy="12" r="7.5" stroke="#38BDF8" strokeWidth="1.6" fill="#0284C7" fillOpacity="0.18" />
      <ellipse cx="12" cy="12" rx="3.4" ry="7.5" stroke="#38BDF8" strokeWidth="1.1" strokeOpacity="0.85" />
      <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="#38BDF8" strokeWidth="1.1" strokeOpacity="0.85" />
      <path
        d="M3.2 8.2C5.5 5 18.5 5 20.8 8.2C23 11.5 18.5 18 15 19.8"
        stroke="#00F2FE"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="20.5" cy="8.2" r="1.4" fill="#00F2FE" />
    </svg>
  );
}

function InitechLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Initech logo">
      <path d="M3.5 18.5L8.5 5.5H11.5L6.5 18.5H3.5Z" fill="#2563EB" />
      <path d="M9.5 18.5L14.5 5.5H17.5L12.5 18.5H9.5Z" fill="#38BDF8" />
      <path d="M15.5 18.5L20.5 5.5H23.5L18.5 18.5H15.5Z" fill="#00F2FE" />
    </svg>
  );
}

function UmbrellaLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Umbrella Corp logo">
      <circle cx="12" cy="12" r="9.5" stroke="#EF4444" strokeWidth="1.2" strokeOpacity="0.9" />
      {/* 8 alternating red and white pie segments */}
      <path d="M12 12L9.2 3.8C10.1 3.3 11 3 12 3C13 3 13.9 3.3 14.8 3.8L12 12Z" fill="#EF4444" />
      <path d="M12 12L14.8 3.8C16.5 4.5 18 5.7 18.9 7.3L12 12Z" fill="#F8FAFC" />
      <path d="M12 12L18.9 7.3C19.8 8.7 20.2 10.3 20.2 12C20.2 13.7 19.8 15.3 18.9 16.7L12 12Z" fill="#EF4444" />
      <path d="M12 12L18.9 16.7C18 18.3 16.5 19.5 14.8 20.2L12 12Z" fill="#F8FAFC" />
      <path d="M12 12L14.8 20.2C13.9 20.7 13 21 12 21C11 21 10.1 20.7 9.2 20.2L12 12Z" fill="#EF4444" />
      <path d="M12 12L9.2 20.2C7.5 19.5 6 18.3 5.1 16.7L12 12Z" fill="#F8FAFC" />
      <path d="M12 12L5.1 16.7C4.2 15.3 3.8 13.7 3.8 12C3.8 10.3 4.2 8.7 5.1 7.3L12 12Z" fill="#EF4444" />
      <path d="M12 12L5.1 7.3C6 5.7 7.5 4.5 9.2 3.8L12 12Z" fill="#F8FAFC" />
      <circle cx="12" cy="12" r="1.6" fill="#121824" stroke="#EF4444" strokeWidth="0.8" />
    </svg>
  );
}

function HooliLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Hooli logo">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1.5" />
      <path
        d="M7.5 6.5V17.5M7.5 12C8.5 9.8 10.5 9 12.8 9C15.2 9 16.5 10.5 16.5 13V17.5"
        stroke="#10B981"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="7.5" r="1.3" fill="#34D399" />
    </svg>
  );
}

function StarkIndustriesLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 20" fill="none" className={className} aria-label="Stark Industries logo">
      <path d="M1.5 10H13.5M1.5 5.5H17.5M1.5 14.5H17.5" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M11.5 2L24.5 10L11.5 18L15.5 10L11.5 2Z"
        fill="#38BDF8"
        fillOpacity="0.85"
        stroke="#60A5FA"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Enterprise client partner list
const clientLogos = [
  { name: 'ACME CORP', Logo: AcmeLogo },
  { name: 'GLOBEX', Logo: GlobexLogo },
  { name: 'INITECH', Logo: InitechLogo },
  { name: 'UMBRELLA', Logo: UmbrellaLogo },
  { name: 'HOOLI', Logo: HooliLogo },
  { name: 'STARK INDUSTRIES', Logo: StarkIndustriesLogo },
];

// Helper to format title to clean Title Case matching Screenshot 2
function formatTitle(rawTitle: string | undefined, defaultTitle: string): string {
  const title = rawTitle?.trim() || defaultTitle;
  if (title === title.toUpperCase()) {
    return title
      .toLowerCase()
      .split(' ')
      .map((word) => {
        if (word === 'sla') return 'SLA';
        if (word === 'api') return 'API';
        if (word === 'iso') return 'ISO';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
  return title;
}

// Helper to parse values
function parseStat(
  raw: string | undefined,
  defaultTarget: number,
  defaultSuffix: string,
  defaultDecimals: number
) {
  if (!raw) {
    return {
      targetValue: defaultTarget,
      decimals: defaultDecimals,
      suffix: defaultSuffix,
      num: `${defaultTarget}${defaultSuffix}`,
    };
  }
  const match = raw.trim().match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (match) {
    const val = parseFloat(match[1]);
    const suf = match[2];
    const dec = match[1].includes('.') ? match[1].split('.')[1].length : 0;
    return {
      targetValue: isNaN(val) ? defaultTarget : val,
      decimals: dec,
      suffix: suf,
      num: raw,
    };
  }
  return {
    targetValue: defaultTarget,
    decimals: defaultDecimals,
    suffix: defaultSuffix,
    num: raw,
  };
}

function AnimatedStatValue({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  displayRaw,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  displayRaw: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 28,
    stiffness: 75,
  });
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springValue, decimals, prefix, suffix, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span>{displayRaw}</span>;
  }

  return (
    <span ref={ref}>
      {prefix}0{decimals > 0 ? '.' + '0'.repeat(decimals) : ''}{suffix}
    </span>
  );
}

export interface StatsSectionProps {
  initialSettings?: PublicComplianceSettings;
}

export function StatsSection({ initialSettings }: StatsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const showIsoSection = initialSettings?.showIsoSection ?? true;
  if (!showIsoSection) {
    return null;
  }

  const isoNumber = initialSettings?.isoNumber || 'ISO 27001:2022';
  const isoLabel = initialSettings?.isoLabel !== undefined ? initialSettings.isoLabel : 'Certified';

  const stat1 = parseStat(initialSettings?.uptimeValue, 99.99, '%', 2);
  const stat2 = parseStat(initialSettings?.savingsValue, 40, '%+', 0);
  const stat3 = parseStat(initialSettings?.actionsValue, 10, 'M+', 0);
  const stat4 = parseStat(initialSettings?.slaValue, 100, '%', 0);

  const cards = [
    {
      id: 'uptime',
      stat: stat1,
      title: formatTitle(initialSettings?.uptimeLabel, 'Server Uptime'),
      description: `${isoNumber} ${isoLabel} infrastructure ensuring non-stop operations.`,
      color: '#00f2fe',
      colorClass: 'text-[#00f2fe]',
      indicatorBg: 'bg-[#00f2fe]',
      indicatorShadow: 'shadow-[0_0_12px_rgba(0,242,254,0.5)]',
      hoverBorder: 'hover:border-[#00f2fe]/40',
      hoverShadow: 'hover:shadow-[0_8px_30px_-6px_rgba(0,242,254,0.2)]',
    },
    {
      id: 'savings',
      stat: stat2,
      title: formatTitle(initialSettings?.savingsLabel, 'Infrastructure Saving'),
      description: 'Automated resource autoscaling and edge cache deduplication.',
      color: '#38bdf8',
      colorClass: 'text-[#38bdf8]',
      indicatorBg: 'bg-[#3b82f6]',
      indicatorShadow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
      hoverBorder: 'hover:border-[#38bdf8]/40',
      hoverShadow: 'hover:shadow-[0_8px_30px_-6px_rgba(56,189,248,0.2)]',
    },
    {
      id: 'actions',
      stat: stat3,
      title: formatTitle(initialSettings?.actionsLabel, 'API Actions'),
      description: 'Processed daily across distributed edge pipelines with sub-millisecond p99.',
      color: '#00f2fe',
      colorClass: 'text-[#00f2fe]',
      indicatorBg: 'bg-[#00f2fe]',
      indicatorShadow: 'shadow-[0_0_12px_rgba(0,242,254,0.5)]',
      hoverBorder: 'hover:border-[#00f2fe]/40',
      hoverShadow: 'hover:shadow-[0_8px_30px_-6px_rgba(0,242,254,0.2)]',
    },
    {
      id: 'sla',
      stat: stat4,
      title: formatTitle(initialSettings?.slaLabel, 'On-Time SLA Delivery'),
      description: 'Strict sprint governance, zero architectural debt, and reliable sprints.',
      color: '#10b981',
      colorClass: 'text-[#10b981]',
      indicatorBg: 'bg-[#10b981]',
      indicatorShadow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
      hoverBorder: 'hover:border-[#10b981]/40',
      hoverShadow: 'hover:shadow-[0_8px_30px_-6px_rgba(16,185,129,0.2)]',
    },
  ];

  // Motion variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : index * 0.07,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const tickerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.3,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="metrics-and-proof"
      className="w-full max-w-[1400px] xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 select-none"
      data-purpose="metrics-and-social-proof"
    >
      {/* Subtle background ambient glow for cyber aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[260px] bg-blue-600/[0.04] dark:bg-cyan-500/[0.04] rounded-full blur-[130px] pointer-events-none" />

      {/* BEGIN: MetricCardsGrid - Sleek rectangular cards matching Screenshot 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5 relative z-10">
        {cards.map((card, index) => (
          <motion.article
            key={card.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.22, ease: 'easeOut' } }}
            className={`group relative overflow-hidden rounded-xl bg-[#0c121e] border border-[#1e293b]/75 px-5 py-4 sm:px-5.5 sm:py-4.5 lg:px-6 lg:py-4.5 flex flex-col justify-start transition-[border-color,background-color,box-shadow] duration-300 ${card.hoverBorder} hover:bg-[#101726] ${card.hoverShadow} will-change-transform`}
            data-purpose="metric-card"
          >
            {/* Ambient Corner Radial on Hover */}
            <div
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `${card.color}15` }}
            />

            {/* Shimmer Light Sweep on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

            {/* Indicator Vertical Pill */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-3.5 bottom-3.5 w-1 sm:w-[4px] rounded-r-md ${card.indicatorBg} ${card.indicatorShadow} group-hover:w-[5px] transition-all duration-300`}
            />

            <div className="pl-2 sm:pl-2.5 relative z-10">
              {/* Metric Number */}
              <div className="text-3xl sm:text-[32px] lg:text-[36px] font-extrabold text-white leading-none tracking-tight font-heading group-hover:scale-[1.01] transition-transform duration-300 origin-left">
                <AnimatedStatValue
                  value={card.stat.targetValue}
                  decimals={card.stat.decimals}
                  suffix={card.stat.suffix}
                  displayRaw={card.stat.num}
                />
              </div>

              {/* Metric Title */}
              <h3 className={`mt-2 sm:mt-2.5 text-[13.5px] sm:text-[14px] font-medium ${card.colorClass} tracking-normal`}>
                {card.title}
              </h3>

              {/* Metric Description */}
              <p className="mt-1 sm:mt-1.5 text-xs sm:text-[12.5px] leading-snug sm:leading-relaxed text-slate-400 font-normal">
                {card.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
      {/* END: MetricCardsGrid */}

      {/* BEGIN: ClientLogosTicker - Always guaranteed single line with full STARK INDUSTRIES */}
      <motion.div
        variants={tickerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 sm:mt-10 w-full flex flex-nowrap items-center justify-between gap-3 sm:gap-5 lg:gap-8 overflow-x-auto no-scrollbar relative z-10"
        data-purpose="client-logos-ticker"
      >
        {/* Section Tagline / Category Label */}
        <div className="shrink-0">
          <span className="text-[10px] sm:text-[10.5px] lg:text-[11px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] text-slate-500 font-medium whitespace-nowrap select-none">
            POWERING HIGH-VELOCITY ENGINEERING TEAMS:
          </span>
        </div>

        {/* Enterprise Client Wordmarks with Authentic Original Logos in ONE line */}
        <div className="flex flex-nowrap items-center justify-end gap-3.5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 shrink-0">
          {clientLogos.map((client) => {
            const Icon = client.Logo;
            return (
              <div
                key={client.name}
                className="group flex items-center gap-1.5 sm:gap-2 cursor-default select-none shrink-0"
              >
                <div className="shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-[filter] duration-300">
                  <Icon className="w-4 h-4 sm:w-[17px] sm:h-[17px] shrink-0 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-heading font-extrabold text-xs sm:text-[12.5px] lg:text-[13px] text-slate-300 group-hover:text-white tracking-wider whitespace-nowrap transition-colors duration-200">
                  {client.name}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
      {/* END: ClientLogosTicker */}
    </section>
  );
}
