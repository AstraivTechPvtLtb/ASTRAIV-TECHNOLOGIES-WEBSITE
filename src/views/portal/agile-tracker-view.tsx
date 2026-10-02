'use client';

/**
 * @file client/src/views/portal/agile-tracker-view.tsx
 * @description [VIEW] Streamlined, smooth Client Project Tracker:
 * - Title: Track Project
 * - 5 Stages: Design, Coding, Testing, Implementation, Maintainance
 * - Direct email communication with Astraiv engineering
 */

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { logoutClient } from '@/controllers/auth.controller';
import {
  Check,
  CheckCircle2,
  Clock,
  Mail,
  LogOut,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Button } from '@/views/ui/button';
import { Badge } from '@/views/ui/badge';
import { cn } from '@/lib/utils';

export interface ProjectPhase {
  id: string;
  stepNumber: number;
  name: string; // Design, Coding, Testing, Implementation, Maintainance
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  statusLabel: string;
  timeIST?: string;
  dateIST: string;
  summary: string;
  details: string[];
  progressPercent?: number;
}

interface AgileTrackerViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    leadNumber?: string | null;
    company?: string | null;
    serviceId?: string | null;
  };
}

export function AgileTrackerView({ user }: AgileTrackerViewProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>('step-3'); // Testing is active & expanded by default

  const leadNumber = user.leadNumber || 'AST-LEAD-2026';
  const companyName = user.company || 'Enterprise Partner';
  const clientEmail = user.email || 'client@astraiv.com';
  const supportEmail = 'astraivtechnologies@gmail.com';

  const mailtoHref = `mailto:${supportEmail}?subject=Project%20Communication%20-%20Lead%20${encodeURIComponent(
    leadNumber
  )}&body=Hello%20Astraiv%20Team,%0A%0AReferencing%20Lead%20Number:%20${encodeURIComponent(
    leadNumber
  )}%0AClient:%20${encodeURIComponent(user.name)}%20(${encodeURIComponent(
    companyName
  )})%0A%0AMessage:%0A`;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutClient();
    router.push('/auth/login');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Exactly the 5 requested phases under Track Project
  const phases: ProjectPhase[] = [
    {
      id: 'step-1',
      stepNumber: 1,
      name: 'Design',
      status: 'COMPLETED',
      statusLabel: 'Completed',
      timeIST: '10:30 AM (IST)',
      dateIST: '15th Oct, 2025',
      summary: 'UI/UX wireframes, design system tokens, responsive prototypes, and architecture blueprint approved.',
      details: [
        'User journeys, information architecture, and core workflows',
        'Figma high-fidelity interactive prototype & component kit',
        'Design token standards, typography, and WCAG accessibility guidelines',
        'Architecture specification and tech stack sign-off',
      ],
    },
    {
      id: 'step-2',
      stepNumber: 2,
      name: 'Coding',
      status: 'COMPLETED',
      statusLabel: 'Completed',
      timeIST: '04:15 PM (IST)',
      dateIST: '20th Feb, 2026',
      summary: 'Core full-stack engineering, microservices API gateways, database schemas, and frontend build.',
      details: [
        'Clean architecture backend endpoints and business domain services',
        'PostgreSQL schema migration, connection poolers, and indexing',
        'Secure authentication, session controls, and RBAC authorization',
        'Component development with responsive desktop, tablet, and mobile views',
      ],
    },
    {
      id: 'step-3',
      stepNumber: 3,
      name: 'Testing',
      status: 'IN_PROGRESS',
      statusLabel: 'In Progress (85%)',
      timeIST: '02:40 PM (IST)',
      dateIST: 'Current Active Phase',
      progressPercent: 85,
      summary: 'End-to-end quality assurance, automated test suites, security penetration scans, and load testing.',
      details: [
        'Automated unit, integration, and end-to-end regression tests',
        'OWASP Top-10 vulnerability and cryptographic security checks',
        'Cross-browser rendering and mobile device compatibility verification',
        'High-concurrency stress benchmarks and latency optimization',
      ],
    },
    {
      id: 'step-4',
      stepNumber: 4,
      name: 'Implementation',
      status: 'UPCOMING',
      statusLabel: 'Upcoming Phase',
      timeIST: 'Target Go-Live',
      dateIST: 'Estimated 25th Oct, 2026',
      summary: 'Staging environment validation, production cloud container deployment, and zero-downtime cutover.',
      details: [
        'Client User Acceptance Testing (UAT) sandbox verification',
        'Production cloud infrastructure and container orchestration',
        'Zero-downtime blue/green DNS cutover and edge CDN configuration',
        'Final data verification, telemetry instrumentation, and release',
      ],
    },
    {
      id: 'step-5',
      stepNumber: 5,
      name: 'Maintainance',
      status: 'UPCOMING',
      statusLabel: 'Upcoming Phase',
      timeIST: 'Post-Launch SLA',
      dateIST: 'Continuous SLA Support',
      summary: '24/7 SLA uptime monitoring, automated database backups, security patches, and ongoing architect support.',
      details: [
        '24/7 production uptime telemetry, error tracking, and alerting',
        'Scheduled database backups, failover redundancy, and disaster recovery',
        'Continuous security updates, dependency patches, and enhancements',
        'Dedicated senior architect consultation and priority email support',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased relative z-20 selection:bg-teal-500/30 selection:text-white">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md backdrop-blur-xl">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center font-black text-xs text-white shadow-md">
            AI
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-sm tracking-wider text-white">ASTRAIV TECHNOLOGIES</span>
            <span className="text-[8px] font-mono tracking-widest text-teal-400 uppercase">CLIENT PORTAL</span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Lead Number Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400">Lead:</span>
            <span className="font-mono font-bold text-teal-400">{leadNumber}</span>
          </div>

          {/* Contact via Mail Button */}
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md hover:shadow-teal-500/20 active:scale-95"
            title="Send an email to Astraiv engineering team"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact</span>
          </a>

          {/* User & Logout */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="h-7 w-7 rounded-full bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center font-bold text-xs uppercase">
              {user.name.substring(0, 2)}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-300 truncate max-w-[120px]">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 py-8 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Title Bar */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                {leadNumber}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-300">{companyName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Track Project
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live progression of your project phases from design through maintenance.
            </p>
          </div>

          {/* Current Status Pill */}
          <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
                Current Phase
              </span>
              <span className="text-xs font-bold text-white font-mono">
                Testing (85%)
              </span>
            </div>
          </div>
        </div>

        {/* 5-Phase Project Timeline */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-xl space-y-8">
          <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-400" />
              <span>Project Lifecycle Milestones</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              5 Phases
            </span>
          </div>

          {/* Timeline Nodes */}
          <div className="relative space-y-6">
            {phases.map((phase, idx) => {
              const isCompleted = phase.status === 'COMPLETED';
              const isInProgress = phase.status === 'IN_PROGRESS';
              const isUpcoming = phase.status === 'UPCOMING';
              const isLast = idx === phases.length - 1;
              const isExpanded = expandedPhaseId === phase.id;

              return (
                <div
                  key={phase.id}
                  className="relative grid grid-cols-1 md:grid-cols-[140px_40px_1fr] items-start gap-3 md:gap-4"
                >
                  {/* Left Column: Date & Timestamp */}
                  <div className="text-left md:text-right flex flex-row md:flex-col justify-between md:justify-start items-baseline md:items-end gap-0.5 pt-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-200 font-mono">
                      {phase.timeIST || phase.statusLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {phase.dateIST}
                    </span>
                  </div>

                  {/* Center Column: Connecting Line & Node */}
                  <div className="hidden md:flex flex-col items-center justify-start h-full relative">
                    {!isLast && (
                      <div
                        className={cn(
                          'absolute top-8 bottom-0 w-0.5 -mb-6 z-0',
                          isCompleted
                            ? 'bg-teal-500/70'
                            : isInProgress
                            ? 'bg-gradient-to-b from-teal-500 to-slate-800'
                            : 'bg-slate-800'
                        )}
                      />
                    )}

                    <div className="relative z-10 pt-1.5">
                      {isCompleted ? (
                        <div className="h-7 w-7 rounded-full bg-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/30">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      ) : isInProgress ? (
                        <div className="h-7 w-7 rounded-full bg-blue-600 border-2 border-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/40 animate-pulse">
                          <span className="h-2 w-2 rounded-full bg-teal-300" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-400 font-mono text-xs font-bold">
                          {phase.stepNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Clean Phase Card */}
                  <div
                    onClick={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                    className={cn(
                      'p-5 rounded-xl border transition-all cursor-pointer select-none',
                      isCompleted
                        ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        : isInProgress
                        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/40 border-teal-500/40 shadow-lg'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-75 hover:opacity-95'
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          0{phase.stepNumber}.
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                          {phase.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/15 text-teal-400 border border-teal-500/30">
                            <CheckCircle2 className="h-3 w-3" />
                            {phase.statusLabel}
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-teal-300 border border-teal-400/40 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                            {phase.statusLabel}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <Clock className="h-3 w-3" />
                            {phase.statusLabel}
                          </span>
                        )}

                        <button className="text-slate-400 hover:text-white p-1">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {phase.summary}
                    </p>

                    {/* Progress Bar for Active Phase */}
                    {isInProgress && phase.progressPercent && (
                      <div className="mt-3.5 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Phase Completion</span>
                          <span className="font-mono text-teal-400 font-bold">{phase.progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 transition-all duration-700"
                            style={{ width: `${phase.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expandable Deliverables Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Phase Deliverables &amp; Checklist
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {phase.details.map((item, dIdx) => (
                            <div
                              key={dIdx}
                              className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                              <span className="leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact via Mail Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-teal-400" />
              <span>Contact Astraiv Engineering</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Have questions, feedback, or require scope changes for Lead <strong>{leadNumber}</strong>? Communicate directly with your dedicated architects via email.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="h-9 px-3.5 border-slate-700 bg-slate-950/80 text-slate-300 hover:text-white text-xs rounded-xl"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy Email
                </>
              )}
            </Button>

            <a
              href={mailtoHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md hover:shadow-teal-500/20 active:scale-95"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Send Mail</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
