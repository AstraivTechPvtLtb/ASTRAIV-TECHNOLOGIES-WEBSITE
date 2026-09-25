'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { PublicComplianceSettings } from '@/models/types';

// ==========================================
// Authentic Company Brand Logos (Originals)
// ==========================================

function AwsPartnerLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="AWS Partner Network logo">
      <path
        d="M6.5 13.5c1.8 1.4 4.5 2 7 1.5 3-.6 5-2.2 5.5-2.8.2-.2.4 0 .3.2-.8 1.1-2.8 2.6-6 3.1-2.8.5-5.8-.2-7.5-1.7-.3-.2 0-.5.7-.3z"
        fill="#FF9900"
      />
      <path
        d="M19.2 12.1c-.2-.3-.8-.2-.9.1-.2.8-.7 1.4-1.2 1.8-.2.1-.1.3.1.3.5 0 1.2-.5 1.7-1.3.2-.3.3-.7.3-.9z"
        fill="#FF9900"
      />
      <path
        d="M4.5 9.5l2.5 5 1.5-3-2-4H4.5z"
        fill="#38BDF8"
      />
      <path
        d="M9.5 7.5h2l-2 7h-2z"
        fill="#60A5FA"
      />
    </svg>
  );
}

function CloudflareLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Cloudflare logo">
      <path
        d="M19.5 15.5c1.4 0 2.5-1.1 2.5-2.5 0-1.2-.9-2.2-2.1-2.4-.1-2.3-2-4.1-4.4-4.1-1.6 0-3 .8-3.8 2.1-.4-.2-.8-.2-1.2-.2-1.9 0-3.5 1.6-3.5 3.5 0 .2 0 .4.1.6C5.5 12.8 4 14 4 15.5c0 1.4 1.1 2.5 2.5 2.5h13z"
        fill="#F38020"
        fillOpacity="0.25"
        stroke="#F38020"
        strokeWidth="1.4"
      />
      <path
        d="M14 11.5c1.8 0 3.2 1.2 3.5 2.8H8.5c-.3-1.6 1.1-2.8 2.9-2.8h2.6z"
        fill="#FAAD3F"
      />
    </svg>
  );
}

function NextjsLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Next.js logo">
      <circle cx="12" cy="12" r="9.5" fill="#090D16" stroke="#38BDF8" strokeWidth="1.2" />
      <path
        d="M8.5 7.5v9h2.2v-4.8l5.3 5.3c.7-.5 1.3-1.1 1.7-1.8L10.7 7.5H8.5z"
        fill="#F8FAFC"
      />
      <path d="M15.5 7.5h2.2v5.5h-2.2z" fill="#38BDF8" />
    </svg>
  );
}

function PostgresLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="PostgreSQL logo">
      <ellipse cx="12" cy="12" rx="8" ry="7.5" fill="#336791" fillOpacity="0.2" stroke="#336791" strokeWidth="1.4" />
      <path
        d="M8.5 9.5c.8-1.5 2.2-2 3.5-2 2 0 3.8 1.2 4.2 3.2.5 2.3-.8 4.3-2.7 4.8-1.5.4-3.2-.2-4-1.5"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="11" r="1" fill="#38BDF8" />
      <circle cx="14" cy="11" r="1" fill="#38BDF8" />
      <path d="M11 14.5c.6.4 1.4.4 2 0" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function DockerLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Docker logo">
      {/* 2x3 grid of containers */}
      <rect x="5.5" y="10" width="2" height="2" rx=".3" fill="#2496ED" />
      <rect x="8" y="10" width="2" height="2" rx=".3" fill="#2496ED" />
      <rect x="10.5" y="10" width="2" height="2" rx=".3" fill="#2496ED" />
      <rect x="8" y="7.5" width="2" height="2" rx=".3" fill="#38BDF8" />
      <rect x="10.5" y="7.5" width="2" height="2" rx=".3" fill="#38BDF8" />
      <rect x="13" y="10" width="2" height="2" rx=".3" fill="#2496ED" />
      {/* Whale body */}
      <path
        d="M3.5 13.5c1 0 2.2.8 3.5.8 1.8 0 2.8-.8 4.5-.8 1.5 0 2.7.8 4.2.8 2.2 0 4.3-1.5 4.8-3.3.2 0 1.2.5 1.5 1.2.4.9.1 2.3-1.8 3.3-2.5 1.3-6.5 1.5-9.7 1.5-2.8 0-5.5-.8-7-2.5v-1z"
        fill="#2496ED"
        fillOpacity="0.85"
      />
    </svg>
  );
}

function AiPartnerLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Enterprise AI Ecosystem logo">
      <circle cx="12" cy="12" r="8" stroke="#10B981" strokeWidth="1.4" fill="#10B981" fillOpacity="0.15" />
      <circle cx="12" cy="12" r="2.5" fill="#34D399" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6.5" cy="6.5" r="1" fill="#10B981" />
      <circle cx="17.5" cy="6.5" r="1" fill="#10B981" />
      <circle cx="6.5" cy="17.5" r="1" fill="#10B981" />
      <circle cx="17.5" cy="17.5" r="1" fill="#10B981" />
    </svg>
  );
}

const DEFAULT_LOGOS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  aws: AwsPartnerLogo,
  cloudflare: CloudflareLogo,
  nextjs: NextjsLogo,
  postgres: PostgresLogo,
  docker: DockerLogo,
  ai: AiPartnerLogo,
  'ai-apis': AiPartnerLogo,
  acme: AwsPartnerLogo,
  globex: CloudflareLogo,
  initech: NextjsLogo,
  umbrella: PostgresLogo,
  hooli: DockerLogo,
  stark: AiPartnerLogo,
};

const DEFAULT_CLIENT_LOGOS = [
  { id: 'aws', name: 'AWS PARTNER NETWORK', iconKey: 'aws', imageUrl: null },
  { id: 'cloudflare', name: 'CLOUDFLARE EDGE', iconKey: 'cloudflare', imageUrl: null },
  { id: 'nextjs', name: 'NEXT.JS ENTERPRISE', iconKey: 'nextjs', imageUrl: null },
  { id: 'postgres', name: 'POSTGRESQL CLOUD', iconKey: 'postgres', imageUrl: null },
  { id: 'docker', name: 'DOCKER CONTAINERIZED', iconKey: 'docker', imageUrl: null },
  { id: 'ai-apis', name: 'ENTERPRISE AI APIS', iconKey: 'ai-apis', imageUrl: null },
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

import { CountUp } from '@/views/ui/motion-reveal';
import { EASE_OUT_EXPO, MOTION_DURATIONS } from '@/lib/motion';

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

  const logosList =
    initialSettings?.clientLogos && initialSettings.clientLogos.length > 0
      ? initialSettings.clientLogos
      : DEFAULT_CLIENT_LOGOS;

  const cards = [
    {
      id: 'uptime',
      stat: stat1,
      title: formatTitle(initialSettings?.uptimeLabel, 'Server Uptime'),
      description: `${isoNumber} ${isoLabel} infrastructure ensuring non-stop operations.`,
      color: '#0284c7',
      colorClass: 'text-sky-600 dark:text-sky-400',
      indicatorBg: 'bg-sky-500',
      indicatorShadow: 'shadow-sm',
      hoverBorder: 'hover:border-sky-500/40',
      hoverShadow: 'hover:shadow-card-hover',
    },
    {
      id: 'savings',
      stat: stat2,
      title: formatTitle(initialSettings?.savingsLabel, 'Infrastructure Saving'),
      description: 'Automated resource autoscaling and edge cache deduplication.',
      color: '#2563eb',
      colorClass: 'text-blue-600 dark:text-blue-400',
      indicatorBg: 'bg-blue-600',
      indicatorShadow: 'shadow-sm',
      hoverBorder: 'hover:border-blue-500/40',
      hoverShadow: 'hover:shadow-card-hover',
    },
    {
      id: 'actions',
      stat: stat3,
      title: formatTitle(initialSettings?.actionsLabel, 'API Actions'),
      description: 'Processed daily across distributed edge pipelines with sub-millisecond p99.',
      color: '#6366f1',
      colorClass: 'text-indigo-600 dark:text-indigo-400',
      indicatorBg: 'bg-indigo-500',
      indicatorShadow: 'shadow-sm',
      hoverBorder: 'hover:border-indigo-500/40',
      hoverShadow: 'hover:shadow-card-hover',
    },
    {
      id: 'sla',
      stat: stat4,
      title: formatTitle(initialSettings?.slaLabel, 'On-Time SLA Delivery'),
      description: 'Strict sprint governance, zero architectural debt, and reliable sprints.',
      color: '#10b981',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      indicatorBg: 'bg-emerald-500',
      indicatorShadow: 'shadow-sm',
      hoverBorder: 'hover:border-emerald-500/40',
      hoverShadow: 'hover:shadow-card-hover',
    },
  ];

  // Motion variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 14,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : index * 0.06,
        duration: MOTION_DURATIONS.reveal,
        ease: EASE_OUT_EXPO,
      },
    }),
  };

  const tickerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.2,
        duration: MOTION_DURATIONS.reveal,
        ease: EASE_OUT_EXPO,
      },
    },
  };

  return (
    <section
      id="metrics-and-proof"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 select-none"
      data-purpose="metrics-and-social-proof"
    >
      {/* MetricCardsGrid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5 relative z-10">
        {cards.map((card, index) => (
          <motion.article
            key={card.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: MOTION_DURATIONS.fast, ease: EASE_OUT_EXPO } }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
            className={`group relative overflow-hidden rounded-2xl bg-card/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 px-5 py-4 sm:px-5.5 sm:py-4.5 lg:px-6 lg:py-4.5 flex flex-col justify-start transition-all duration-300 shadow-card hover:shadow-card-hover ${card.hoverBorder} will-change-transform`}
            data-purpose="metric-card"
          >
            {/* Ambient Corner Radial on Hover */}
            <div
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `${card.color}15` }}
            />

            {/* Shimmer Light Sweep on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

            {/* Indicator Vertical Pill */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-3.5 bottom-3.5 w-1 sm:w-[4px] rounded-r-md ${card.indicatorBg} group-hover:w-[5px] transition-all duration-300`}
            />

            <div className="pl-2 sm:pl-2.5 relative z-10">
              {/* Metric Number */}
              <div className="text-3xl sm:text-[32px] lg:text-[36px] font-extrabold text-foreground leading-none tracking-tight font-heading group-hover:scale-[1.01] transition-transform duration-300 origin-left">
                <CountUp
                  value={card.stat.targetValue}
                  decimals={card.stat.decimals}
                  suffix={card.stat.suffix}
                  displayRaw={card.stat.num}
                />
              </div>

              {/* Metric Title */}
              <h3 className={`mt-2 sm:mt-2.5 text-[13.5px] sm:text-[14px] font-semibold ${card.colorClass} tracking-normal`}>
                {card.title}
              </h3>

              {/* Metric Description */}
              <p className="mt-1 sm:mt-1.5 text-xs sm:text-[12.5px] leading-snug sm:leading-relaxed text-muted-foreground font-normal">
                {card.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
      {/* END: MetricCardsGrid */}

      {/* BEGIN: ClientLogosTicker */}
      <motion.div
        variants={tickerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 sm:mt-10 w-full flex flex-nowrap items-center justify-between gap-3 sm:gap-5 lg:gap-8 overflow-x-auto no-scrollbar relative z-10 py-3 sm:py-3.5"
        data-purpose="client-logos-ticker"
      >
        {/* Section Tagline / Category Label */}
        <div className="shrink-0">
          <span className="text-[10px] sm:text-[10.5px] lg:text-[11px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] text-muted-foreground font-medium whitespace-nowrap select-none">
            ENTERPRISE TECHNOLOGY ECOSYSTEM & PARTNER CLOUDS:
          </span>
        </div>

        {/* Enterprise Client Wordmarks with Small Circle Profile Picture Type Logos in ONE line */}
        <div className="flex flex-nowrap items-center justify-end gap-3.5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 shrink-0 py-1">
          {logosList.map((client) => {
            const iconKey = (client.iconKey || client.id || client.name.toLowerCase().split(' ')[0] || '').toLowerCase();
            const Icon = DEFAULT_LOGOS_MAP[iconKey] || null;
            return (
              <div
                key={client.id || client.name}
                className="group flex items-center gap-2 sm:gap-2.5 cursor-default select-none shrink-0"
              >
                {/* Small Circle Container */}
                <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 aspect-square rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs group-hover:border-primary/50 group-hover:shadow-card-hover transition-all duration-300">
                  {client.imageUrl ? (
                    <Image
                      src={client.imageUrl}
                      alt={client.name}
                      width={28}
                      height={28}
                      unoptimized
                      className="w-full h-full object-cover rounded-full aspect-square"
                    />
                  ) : Icon ? (
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 text-foreground" />
                  ) : (
                    <span className="text-[10px] sm:text-[11px] font-bold text-primary font-mono">
                      {client.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="font-heading font-extrabold text-xs sm:text-[12.5px] lg:text-[13px] text-foreground/80 group-hover:text-foreground tracking-wider whitespace-nowrap transition-colors duration-200">
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
