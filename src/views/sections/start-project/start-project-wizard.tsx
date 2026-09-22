'use client';

/**
 * @file client/src/views/sections/start-project/start-project-wizard.tsx
 * @description [VIEW] Enterprise 5-step interactive project scoping wizard.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Code2,
  Globe,
  Smartphone,
  Cloud,
  Palette,
  Cpu,
  Compass,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Clock,
  Send,
  Loader2,
  Building2,
  User,
  Mail,
  FileEdit,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Button } from '@/views/ui/button';
import { Input } from '@/views/ui/input';
import { CountryPhoneInput } from '@/views/ui/country-phone-input';
import { cn } from '@/lib/utils';
import {
  StartProjectType,
  StartProjectFormInput,
} from '@/models/types';
import { submitStartProject } from '@/controllers/start-project.controller';
import { CANONICAL_PROJECT_TYPES } from '@/models/start-project.schema';

interface ProjectTypeOption {
  type: StartProjectType;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  description: string;
  popular?: boolean;
}

const PROJECT_TYPE_OPTIONS: ProjectTypeOption[] = [
  {
    type: 'AI Solution',
    icon: Sparkles,
    headline: 'AI Solution',
    description: 'Autonomous LLM agents, RAG knowledge pipelines, computer vision, and cognitive systems.',
    popular: true,
  },
  {
    type: 'Custom Software',
    icon: Code2,
    headline: 'Custom Software',
    description: 'Mission-critical enterprise software, bespoke APIs, backends, and legacy system overhauls.',
  },
  {
    type: 'Web Application',
    icon: Globe,
    headline: 'Web Application',
    description: 'High-performance SaaS platforms, customer portals, responsive SPAs, and internal tooling.',
  },
  {
    type: 'Mobile Application',
    icon: Smartphone,
    headline: 'Mobile Application',
    description: 'Production-ready iOS and Android mobile apps crafted with React Native or Flutter.',
  },
  {
    type: 'Cloud / DevOps',
    icon: Cloud,
    headline: 'Cloud / DevOps',
    description: 'Kubernetes orchestration, AWS/GCP architecture, Terraform, CI/CD, and zero-downtime infra.',
  },
  {
    type: 'UI/UX',
    icon: Palette,
    headline: 'UI/UX Design',
    description: 'Institutional design systems, user journey mapping, high-fidelity prototypes, and design audits.',
  },
  {
    type: 'Business Automation',
    icon: Cpu,
    headline: 'Business Automation',
    description: 'Workflow automation, ERP/CRM bi-directional sync, custom webhooks, and process bots.',
  },
  {
    type: 'Technology Consulting',
    icon: Compass,
    headline: 'Technology Consulting',
    description: 'Fractional CTO advisory, technical architecture reviews, codebase audits, and security compliance.',
  },
  {
    type: 'Not Sure',
    icon: HelpCircle,
    headline: 'Not Sure',
    description: 'Schedule a free architectural scoping consultation with our senior systems architects.',
  },
];

const INDUSTRIES = [
  'Fintech & Banking',
  'Healthcare & HealthTech',
  'SaaS & B2B Software',
  'E-Commerce & Retail',
  'Logistics & Supply Chain',
  'Real Estate & PropTech',
  'Education & EdTech',
  'Professional Services',
  'Energy & CleanTech',
  'Other / Emerging Sector',
];

const PRODUCT_STATES = [
  {
    id: 'Brand New Product',
    title: 'Brand New Product (Greenfield)',
    desc: 'Starting from scratch with zero legacy code or existing infrastructure.',
  },
  {
    id: 'Existing Product Modernization',
    title: 'Existing Product (Modernization / Redesign)',
    desc: 'Re-engineering, modernizing, or rebuilding an active production application.',
  },
  {
    id: 'Scaling & Feature Expansion',
    title: 'Scaling & Feature Expansion',
    desc: 'Adding advanced features, scaling for high traffic, or accelerating roadmap.',
  },
];

const COMMON_CHALLENGES = [
  'Fast time-to-market required',
  'AI / LLM agent integration needed',
  'Database or infrastructure scalability',
  'Legacy codebase refactoring',
  'High cloud costs / DevOps bottlenecks',
  'UI/UX modernization & low conversion',
  'Strict security & compliance (ISO/SOC2)',
  'Lack of senior in-house engineers',
];

const BUDGET_RANGES = [
  { label: '< $10,000', desc: 'Proof of Concept / Rapid MVP' },
  { label: '$10,000 - $25,000', desc: 'Targeted Core Feature Sprint' },
  { label: '$25,000 - $50,000', desc: 'Complete Production Application' },
  { label: '$50,000 - $100,000', desc: 'Enterprise Grade Multi-Module Platform' },
  { label: '$100,000+', desc: 'Multi-Squad Long-Term Engagement' },
  { label: 'Flexible / Scoping Needed', desc: 'Determine during architectural discovery' },
];

const TIMELINES = [
  { label: 'Urgent (< 1 month)', desc: 'Immediate kickoff, dedicated sprint team' },
  { label: '1 - 3 months', desc: 'Standard agile development cycle' },
  { label: '3 - 6 months', desc: 'Comprehensive enterprise roadmap' },
  { label: '6+ months', desc: 'Long-term phased platform evolution' },
  { label: 'Flexible / Milestone-based', desc: 'Paced according to business milestones' },
];

const PROJECT_STAGES = [
  { id: 'Idea / Concept', title: 'Idea / Concept', desc: 'Defined vision, need technical scoping & MVP architecture' },
  { id: 'Wireframes Ready', title: 'Wireframes / Specs Ready', desc: 'Have designs, PRDs, or wireframes prepared' },
  { id: 'Active Development', title: 'Active Development', desc: 'In-flight codebase or partially finished product' },
  { id: 'Live Production', title: 'Live Production System', desc: 'Live users, looking to scale or overhaul' },
];

export function StartProjectWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial project type from query params (e.g. ?type=ai-solution)
  const initialTypeParam = searchParams.get('type') || searchParams.get('discipline') || searchParams.get('service');
  const resolveInitialType = (): StartProjectType => {
    if (!initialTypeParam) return 'AI Solution';
    const clean = initialTypeParam.toLowerCase();
    if (clean.includes('ai') || clean.includes('agent')) return 'AI Solution';
    if (clean.includes('custom')) return 'Custom Software';
    if (clean.includes('web') || clean.includes('saas')) return 'Web Application';
    if (clean.includes('mobile') || clean.includes('ios') || clean.includes('android')) return 'Mobile Application';
    if (clean.includes('cloud') || clean.includes('devops')) return 'Cloud / DevOps';
    if (clean.includes('ui') || clean.includes('ux') || clean.includes('design')) return 'UI/UX';
    if (clean.includes('auto') || clean.includes('process')) return 'Business Automation';
    if (clean.includes('consult')) return 'Technology Consulting';
    return 'AI Solution';
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<StartProjectFormInput>({
    projectType: resolveInitialType(),
    projectDescription: '',
    industry: 'Fintech & Banking',
    productType: 'Brand New Product',
    challenges: ['Fast time-to-market required'],
    budgetRange: '$25,000 - $50,000',
    timeline: '1 - 3 months',
    projectStage: 'Idea / Concept',
    name: '',
    email: '',
    company: '',
    phone: '',
    preferredContact: 'Email',
    honeypot: '',
  });

  const [mountTime, setMountTime] = useState<number>(0);
  const [sourcePage, setSourcePage] = useState<string>('/start-project');
  const [utmParams, setUtmParams] = useState<{
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }>({});
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Set mount timestamp and resolve source page & UTM parameters on client load
  useEffect(() => {
    setMountTime(Date.now());

    // 1. Resolve source page attribution
    const explicitSource =
      searchParams.get('source_page') ||
      searchParams.get('source') ||
      searchParams.get('from') ||
      searchParams.get('ref_page');

    let detectedSource = '';
    if (explicitSource) {
      detectedSource = explicitSource.startsWith('/') ? explicitSource : `/${explicitSource}`;
    } else if (typeof document !== 'undefined' && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (
          refUrl.origin === window.location.origin &&
          refUrl.pathname !== '/start-project' &&
          refUrl.pathname !== '/'
        ) {
          detectedSource = refUrl.pathname;
        }
      } catch {}
    }

    if (!detectedSource && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('astraiv_lead_source_page');
      if (stored && stored !== '/start-project') {
        detectedSource = stored;
      }
    }

    const finalSource = detectedSource || '/start-project';
    setSourcePage(finalSource);

    // 2. Resolve UTM parameters
    const utmSource =
      searchParams.get('utm_source') ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('astraiv_utm_source') : null) ||
      undefined;
    const utmMedium =
      searchParams.get('utm_medium') ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('astraiv_utm_medium') : null) ||
      undefined;
    const utmCampaign =
      searchParams.get('utm_campaign') ||
      (typeof window !== 'undefined' ? sessionStorage.getItem('astraiv_utm_campaign') : null) ||
      undefined;

    setUtmParams({ utmSource, utmMedium, utmCampaign });

    if (typeof window !== 'undefined') {
      if (utmSource) sessionStorage.setItem('astraiv_utm_source', utmSource);
      if (utmMedium) sessionStorage.setItem('astraiv_utm_medium', utmMedium);
      if (utmCampaign) sessionStorage.setItem('astraiv_utm_campaign', utmCampaign);
    }
  }, [searchParams]);

  // Sync query params if they change
  useEffect(() => {
    if (initialTypeParam) {
      setFormData((prev) => ({ ...prev, projectType: resolveInitialType() }));
    }
  }, [initialTypeParam]);

  // Scroll to top of wizard container when step changes
  const wizardTopRef = useRef<HTMLDivElement>(null);
  const scrollToWizardTop = () => {
    if (wizardTopRef.current) {
      wizardTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const updateField = <K extends keyof StartProjectFormInput>(field: K, value: StartProjectFormInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error
    if (stepErrors[field as string]) {
      setStepErrors((prev) => {
        const updated = { ...prev };
        delete updated[field as string];
        return updated;
      });
    }
  };

  const toggleChallenge = (challenge: string) => {
    setFormData((prev) => {
      const exists = prev.challenges.includes(challenge);
      return {
        ...prev,
        challenges: exists
          ? prev.challenges.filter((c) => c !== challenge)
          : [...prev.challenges, challenge],
      };
    });
  };

  // Validation per step
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.projectType || !CANONICAL_PROJECT_TYPES.includes(formData.projectType)) {
        errors.projectType = 'Please choose what you would like to build.';
      }
    } else if (currentStep === 2) {
      if (!formData.projectDescription || formData.projectDescription.trim().length < 15) {
        errors.projectDescription = 'Please provide at least 15 characters describing your project vision.';
      }
      if (!formData.industry) {
        errors.industry = 'Please select your industry or sector.';
      }
      if (!formData.productType) {
        errors.productType = 'Please select your current product state.';
      }
    } else if (currentStep === 3) {
      if (!formData.budgetRange) {
        errors.budgetRange = 'Please choose an estimated budget range.';
      }
      if (!formData.timeline) {
        errors.timeline = 'Please select your target timeline.';
      }
      if (!formData.projectStage) {
        errors.projectStage = 'Please select your current project stage.';
      }
    } else if (currentStep === 4) {
      if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Please enter your full name (minimum 2 characters).';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid business email address.';
      }
      if (!formData.company || formData.company.trim().length < 2) {
        errors.company = 'Please enter your company or organization name.';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      scrollToWizardTop();
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToWizardTop();
  };

  const jumpToStep = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      scrollToWizardTop();
    }
  };

  // Step 5: Final Submission
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload: StartProjectFormInput = {
        ...formData,
        sourcePage,
        utmSource: utmParams.utmSource,
        utmMedium: utmParams.utmMedium,
        utmCampaign: utmParams.utmCampaign,
        serviceId: searchParams.get('service_id') || searchParams.get('service') || undefined,
        solutionId: searchParams.get('solution_id') || searchParams.get('solution') || undefined,
        industryId: searchParams.get('industry_id') || undefined,
        clientTimestamp: mountTime,
      };

      const res = await submitStartProject(payload);

      if (!res.success) {
        setSubmissionError(res.error || 'Submission failed. Please check your entries.');
        setIsSubmitting(false);
        return;
      }

      const refId = res.data?.leadNumber || res.data?.referenceId || 'AST-LEAD-OK';
      const encodedType = encodeURIComponent(formData.projectType);

      // Successfully transmitted: redirect directly to the dedicated thank you page
      router.push(`/thank-you?ref=${refId}&type=${encodedType}`);
    } catch (err) {
      console.error('[Start Project Submission Error]:', err);
      setSubmissionError('An unexpected network error occurred. Please try again or email info@astraivtechnologies.com.');
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / 4) * 100;

  return (
    <div ref={wizardTopRef} className="w-full max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Stepper Progress Bar */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold tracking-wider text-primary dark:text-blue-400 uppercase">
            STEP {currentStep} OF 5: {
              currentStep === 1 ? 'PROJECT DISCIPLINE' :
              currentStep === 2 ? 'PROJECT SCOPE' :
              currentStep === 3 ? 'PARAMETERS' :
              currentStep === 4 ? 'CONTACT INFO' :
              'REVIEW & SUBMIT'
            }
          </span>
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            {Math.round(progressPercentage)}% Completed
          </span>
        </div>

        {/* Dynamic Track */}
        <div className="w-full h-2 rounded-full bg-border/60 dark:bg-slate-800 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-4 text-center">
          {[
            { num: 1, label: 'Discipline' },
            { num: 2, label: 'Scope' },
            { num: 3, label: 'Parameters' },
            { num: 4, label: 'Contact' },
            { num: 5, label: 'Review' },
          ].map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => jumpToStep(s.num)}
                disabled={s.num > currentStep}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all select-none',
                  isCurrent
                    ? 'text-primary dark:text-blue-400 font-bold bg-primary/10 dark:bg-blue-400/10 border border-primary/20'
                    : isCompleted
                    ? 'text-muted-foreground hover:text-foreground cursor-pointer'
                    : 'text-muted-foreground/40 cursor-not-allowed'
                )}
              >
                <span
                  className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono',
                    isCurrent
                      ? 'bg-primary text-white dark:bg-blue-500'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                </span>
                <span className="hidden sm:inline truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <div className="rounded-3xl border border-border/70 dark:border-slate-800 bg-card/85 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* ============================================================ */}
          {/* STEP 1: PROJECT TYPE                                         */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 mb-3 border border-primary/20">
                  <Zap className="h-3.5 w-3.5" />
                  Step 1 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                  What can we help you build?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                  Choose the core discipline that best matches your immediate requirements. We assemble dedicated squads tailored to your exact tech stack.
                </p>
              </div>

              {stepErrors.projectType && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{stepErrors.projectType}</span>
                </div>
              )}

              {/* 9 Selectable Project Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROJECT_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.projectType === opt.type;
                  return (
                    <div
                      key={opt.type}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onClick={() => updateField('projectType', opt.type)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          updateField('projectType', opt.type);
                        }
                      }}
                      className={cn(
                        'group relative p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 select-none flex flex-col justify-between',
                        isSelected
                          ? 'bg-primary/5 dark:bg-blue-600/10 border-primary dark:border-blue-500 ring-2 ring-primary/20 dark:ring-blue-500/30 shadow-lg'
                          : 'bg-card/50 dark:bg-slate-900/50 border-border/70 dark:border-slate-800 hover:border-primary/40 dark:hover:border-blue-400/50 hover:bg-card dark:hover:bg-slate-800/40'
                      )}
                    >
                      {opt.popular && (
                        <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 border border-blue-500/20">
                          Popular
                        </span>
                      )}
                      <div>
                        <div
                          className={cn(
                            'w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 transition-transform group-hover:scale-105',
                            isSelected
                              ? 'bg-primary text-white dark:bg-blue-500 shadow-md shadow-primary/25'
                              : 'bg-primary/10 dark:bg-blue-400/10 text-primary dark:text-blue-400 border border-primary/15'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                          {opt.headline}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/40 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {isSelected ? 'Selected' : 'Select discipline'}
                        </span>
                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
                            isSelected
                              ? 'border-primary dark:border-blue-400 bg-primary dark:bg-blue-400'
                              : 'border-muted-foreground/40'
                          )}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: PROJECT                                              */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 mb-3 border border-primary/20">
                  <FileEdit className="h-3.5 w-3.5" />
                  Step 2 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                  Tell us about your project
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                  Provide context regarding what you are building, your industry domain, and the core bottlenecks you want to resolve.
                </p>
              </div>

              {/* Project Description */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">
                    Project Description <span className="text-destructive">*</span>
                  </label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {formData.projectDescription.length}/5000 characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.projectDescription}
                  onChange={(e) => updateField('projectDescription', e.target.value)}
                  placeholder="Describe what you want to build, the problems you are solving, key features required, or target users..."
                  className={cn(
                    'w-full rounded-2xl border bg-card/60 dark:bg-slate-900/60 p-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all resize-y min-h-[110px] focus:ring-2 focus:ring-primary/40 dark:focus:ring-blue-400/40',
                    stepErrors.projectDescription
                      ? 'border-destructive ring-1 ring-destructive'
                      : 'border-border/70 dark:border-slate-800'
                  )}
                />
                {stepErrors.projectDescription && (
                  <p className="text-xs text-destructive font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {stepErrors.projectDescription}
                  </p>
                )}
              </div>

              {/* Industry Selection */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-foreground">
                  Industry / Sector <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {INDUSTRIES.map((ind) => {
                    const isSelected = formData.industry === ind;
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => updateField('industry', ind)}
                        className={cn(
                          'p-3 rounded-xl border text-xs font-semibold text-center transition-all select-none',
                          isSelected
                            ? 'bg-primary text-white border-primary dark:bg-blue-600 dark:border-blue-500 shadow-sm'
                            : 'bg-card/40 dark:bg-slate-900/40 border-border/60 dark:border-slate-800 text-muted-foreground hover:text-foreground hover:border-primary/40'
                        )}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
                {stepErrors.industry && (
                  <p className="text-xs text-destructive font-semibold">{stepErrors.industry}</p>
                )}
              </div>

              {/* Existing / New Product */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-foreground">
                  Is this a new or existing product? <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PRODUCT_STATES.map((ps) => {
                    const isSelected = formData.productType === ps.id;
                    return (
                      <div
                        key={ps.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => updateField('productType', ps.id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            updateField('productType', ps.id);
                          }
                        }}
                        className={cn(
                          'p-4 rounded-xl border cursor-pointer transition-all select-none text-left',
                          isSelected
                            ? 'bg-primary/5 dark:bg-blue-600/10 border-primary dark:border-blue-500 ring-2 ring-primary/20 dark:ring-blue-500/30'
                            : 'bg-card/40 dark:bg-slate-900/40 border-border/60 dark:border-slate-800 hover:border-primary/40'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-bold text-xs sm:text-sm text-foreground">{ps.title}</h4>
                          <span
                            className={cn(
                              'w-3.5 h-3.5 rounded-full border',
                              isSelected
                                ? 'border-primary dark:border-blue-400 bg-primary dark:bg-blue-400'
                                : 'border-muted-foreground/40'
                            )}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ps.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Challenges */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">
                    Current challenges to solve <span className="text-xs text-muted-foreground font-normal">(Select all that apply)</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_CHALLENGES.map((ch) => {
                    const isSelected = formData.challenges.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChallenge(ch)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium border transition-all select-none flex items-center gap-1.5',
                          isSelected
                            ? 'bg-primary/15 dark:bg-blue-500/20 text-primary dark:text-blue-300 border-primary/30 dark:border-blue-400/40'
                            : 'bg-card/40 dark:bg-slate-900/40 text-muted-foreground border-border/60 dark:border-slate-800 hover:border-primary/30'
                        )}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary dark:text-blue-400" />}
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: SCOPE & TIMELINE                                     */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 mb-3 border border-primary/20">
                  <Clock className="h-3.5 w-3.5" />
                  Step 3 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                  Project scope & timeline
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                  Helps our engineering leads plan delivery sprints, infrastructure provisioning, and team velocity.
                </p>
              </div>

              {/* Estimated Budget Range */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">
                  Estimated budget range <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BUDGET_RANGES.map((b) => {
                    const isSelected = formData.budgetRange === b.label;
                    return (
                      <div
                        key={b.label}
                        onClick={() => updateField('budgetRange', b.label)}
                        className={cn(
                          'p-4 rounded-xl border cursor-pointer transition-all select-none text-left',
                          isSelected
                            ? 'bg-primary/5 dark:bg-blue-600/10 border-primary dark:border-blue-500 ring-2 ring-primary/20 dark:ring-blue-500/30'
                            : 'bg-card/40 dark:bg-slate-900/40 border-border/60 dark:border-slate-800 hover:border-primary/40'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm text-foreground">{b.label}</h4>
                          <span
                            className={cn(
                              'w-3.5 h-3.5 rounded-full border',
                              isSelected
                                ? 'border-primary dark:border-blue-400 bg-primary dark:bg-blue-400'
                                : 'border-muted-foreground/40'
                            )}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{b.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Timeline */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">
                  Target launch timeline <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TIMELINES.map((t) => {
                    const isSelected = formData.timeline === t.label;
                    return (
                      <div
                        key={t.label}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => updateField('timeline', t.label)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            updateField('timeline', t.label);
                          }
                        }}
                        className={cn(
                          'p-4 rounded-xl border cursor-pointer transition-all select-none text-left',
                          isSelected
                            ? 'bg-primary/5 dark:bg-blue-600/10 border-primary dark:border-blue-500 ring-2 ring-primary/20 dark:ring-blue-500/30'
                            : 'bg-card/40 dark:bg-slate-900/40 border-border/60 dark:border-slate-800 hover:border-primary/40'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm text-foreground">{t.label}</h4>
                          <span
                            className={cn(
                              'w-3.5 h-3.5 rounded-full border',
                              isSelected
                                ? 'border-primary dark:border-blue-400 bg-primary dark:bg-blue-400'
                                : 'border-muted-foreground/40'
                            )}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Project Stage */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground">
                  Current project stage <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PROJECT_STAGES.map((ps) => {
                    const isSelected = formData.projectStage === ps.id;
                    return (
                      <div
                        key={ps.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => updateField('projectStage', ps.id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            updateField('projectStage', ps.id);
                          }
                        }}
                        className={cn(
                          'p-4 rounded-xl border cursor-pointer transition-all select-none text-left flex flex-col justify-between',
                          isSelected
                            ? 'bg-primary/5 dark:bg-blue-600/10 border-primary dark:border-blue-500 ring-2 ring-primary/20 dark:ring-blue-500/30'
                            : 'bg-card/40 dark:bg-slate-900/40 border-border/60 dark:border-slate-800 hover:border-primary/40'
                        )}
                      >
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-foreground mb-1">{ps.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ps.desc}</p>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <span
                            className={cn(
                              'w-3.5 h-3.5 rounded-full border',
                              isSelected
                                ? 'border-primary dark:border-blue-400 bg-primary dark:bg-blue-400'
                                : 'border-muted-foreground/40'
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: CONTACT                                              */}
          {/* ============================================================ */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 mb-3 border border-primary/20">
                  <User className="h-3.5 w-3.5" />
                  Step 4 of 5
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                  How can our architects reach you?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                  We prepare preliminary architectural notes and tech stack suggestions prior to our first conversation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="wizard-name" className="text-sm font-bold text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="wizard-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Jane Doe"
                      aria-required="true"
                      aria-invalid={Boolean(stepErrors.name)}
                      aria-describedby={stepErrors.name ? 'wizard-name-error' : undefined}
                      className={cn(
                        'pl-10 h-12 rounded-xl text-sm',
                        stepErrors.name ? 'border-destructive ring-1 ring-destructive' : ''
                      )}
                    />
                    <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-4 pointer-events-none" />
                  </div>
                  {stepErrors.name && (
                    <p id="wizard-name-error" role="alert" className="text-xs text-destructive font-semibold">{stepErrors.name}</p>
                  )}
                </div>

                {/* Business Email */}
                <div className="space-y-2">
                  <label htmlFor="wizard-email" className="text-sm font-bold text-foreground">
                    Business Email <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="wizard-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="jane@company.com"
                      aria-required="true"
                      aria-invalid={Boolean(stepErrors.email)}
                      aria-describedby={stepErrors.email ? 'wizard-email-error' : undefined}
                      className={cn(
                        'pl-10 h-12 rounded-xl text-sm',
                        stepErrors.email ? 'border-destructive ring-1 ring-destructive' : ''
                      )}
                    />
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-4 pointer-events-none" />
                  </div>
                  {stepErrors.email && (
                    <p id="wizard-email-error" role="alert" className="text-xs text-destructive font-semibold">{stepErrors.email}</p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label htmlFor="wizard-company" className="text-sm font-bold text-foreground">
                    Company / Organization <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="wizard-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      placeholder="Acme Global Inc."
                      aria-required="true"
                      aria-invalid={Boolean(stepErrors.company)}
                      aria-describedby={stepErrors.company ? 'wizard-company-error' : undefined}
                      className={cn(
                        'pl-10 h-12 rounded-xl text-sm',
                        stepErrors.company ? 'border-destructive ring-1 ring-destructive' : ''
                      )}
                    />
                    <Building2 className="w-4 h-4 text-muted-foreground absolute left-3.5 top-4 pointer-events-none" />
                  </div>
                  {stepErrors.company && (
                    <p id="wizard-company-error" role="alert" className="text-xs text-destructive font-semibold">{stepErrors.company}</p>
                  )}
                </div>

                {/* Phone (Optional) */}
                <div className="space-y-2">
                  <label htmlFor="wizard-phone" className="text-sm font-bold text-foreground">
                    Phone Number <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <CountryPhoneInput
                    id="wizard-phone"
                    value={formData.phone}
                    onChange={(val) => updateField('phone', val)}
                    placeholder="Mobile or office phone"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div className="space-y-2.5 pt-2">
                <label className="text-sm font-bold text-foreground">
                  Preferred Contact Method
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Email', 'Video Call / Discovery Session', 'Phone Call', 'WhatsApp'].map((m) => {
                    const isSelected = formData.preferredContact === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => updateField('preferredContact', m)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-xs font-semibold border transition-all select-none',
                          isSelected
                            ? 'bg-primary text-white border-primary dark:bg-blue-600 dark:border-blue-500 shadow-sm'
                            : 'bg-card/40 dark:bg-slate-900/40 border-border/60 dark:border-slate-800 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 5: REVIEW & SUBMIT                                      */}
          {/* ============================================================ */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 mb-3 border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Final Step
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">
                  Review your project specifications
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                  Please confirm your entries below before transmitting your brief. Our Lead Architects sign mutual NDAs before deeper reviews.
                </p>
              </div>

              {/* Honeypot Bot Trap Field (Hidden to real humans) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_honeypot_field">Leave this empty</label>
                <input
                  id="website_honeypot_field"
                  type="text"
                  name="website_honeypot_field"
                  tabIndex={-1}
                  value={formData.honeypot || ''}
                  onChange={(e) => updateField('honeypot', e.target.value)}
                  autoComplete="off"
                />
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Project Type */}
                <div className="p-5 rounded-2xl border border-border/70 dark:border-slate-800 bg-card/40 dark:bg-slate-900/40 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400">
                      Discipline
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToStep(1)}
                      className="text-xs text-primary dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="text-base font-extrabold text-foreground">{formData.projectType}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Industry: <strong className="text-foreground">{formData.industry}</strong>
                  </div>
                </div>

                {/* 2. Scope & Challenges */}
                <div className="p-5 rounded-2xl border border-border/70 dark:border-slate-800 bg-card/40 dark:bg-slate-900/40 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400">
                      Scope & Status
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToStep(2)}
                      className="text-xs text-primary dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="text-xs font-bold text-foreground">{formData.productType}</div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">
                    &ldquo;{formData.projectDescription}&rdquo;
                  </p>
                  {formData.challenges.length > 0 && (
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      Challenges: <span className="font-semibold text-foreground">{formData.challenges.slice(0, 2).join(', ')}</span>
                      {formData.challenges.length > 2 && ` +${formData.challenges.length - 2} more`}
                    </div>
                  )}
                </div>

                {/* 3. Parameters */}
                <div className="p-5 rounded-2xl border border-border/70 dark:border-slate-800 bg-card/40 dark:bg-slate-900/40 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400">
                      Parameters
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToStep(3)}
                      className="text-xs text-primary dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Budget: <strong className="text-foreground">{formData.budgetRange}</strong></div>
                    <div>Timeline: <strong className="text-foreground">{formData.timeline}</strong></div>
                    <div>Stage: <strong className="text-foreground">{formData.projectStage}</strong></div>
                  </div>
                </div>

                {/* 4. Contact Information */}
                <div className="p-5 rounded-2xl border border-border/70 dark:border-slate-800 bg-card/40 dark:bg-slate-900/40 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400">
                      Point of Contact
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToStep(4)}
                      className="text-xs text-primary dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Name: <strong className="text-foreground">{formData.name}</strong></div>
                    <div>Email: <strong className="text-foreground">{formData.email}</strong></div>
                    <div>Company: <strong className="text-foreground">{formData.company}</strong></div>
                    {formData.phone && <div>Phone: <strong className="text-foreground">{formData.phone}</strong></div>}
                  </div>
                </div>
              </div>

              {/* Trust & Mutual NDA Banner */}
              <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-600/10 border border-blue-500/20 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-foreground/80 leading-relaxed">
                  <strong className="text-foreground font-bold">100% Intellectual Property & NDA Protected:</strong> All project specifications, commercial ideas, and architectural briefs are legally bound by our standard institutional mutual Non-Disclosure Agreement.
                </div>
              </div>

              {submissionError && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls Bar */}
        <div className="mt-10 pt-6 border-t border-border/50 dark:border-slate-800/80 flex items-center justify-between gap-4 relative z-10">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="gap-2 px-5 rounded-xl text-xs font-bold border-border/70 hover:bg-card"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}
          </div>

          <div>
            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="gap-2 px-7 py-5 rounded-xl font-extrabold text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 active:scale-95 transition-all"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 px-8 py-5 rounded-xl font-extrabold text-xs sm:text-sm bg-[#0B3D91] hover:bg-[#093275] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xl shadow-blue-500/25 active:scale-95 transition-all select-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Brief Securely...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Project Brief</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges Footer Strip */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl border border-border/40 bg-card/40 dark:bg-slate-900/30 flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>ISO 27001 Certified Security Practices</span>
        </div>
        <div className="p-4 rounded-xl border border-border/40 bg-card/40 dark:bg-slate-900/30 flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Guaranteed 24-Hour Architect SLA</span>
        </div>
        <div className="p-4 rounded-xl border border-border/40 bg-card/40 dark:bg-slate-900/30 flex items-center justify-center gap-2.5 text-xs text-muted-foreground">
          <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>100% Client Code & IP Ownership</span>
        </div>
      </div>
    </div>
  );
}
