'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/views/ui/button';
import { Input } from '@/views/ui/input';
import { CountryPhoneInput } from '@/views/ui/country-phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/views/ui/select';
import { Loader2, UploadCloud, FileText, X, Link2, Briefcase, CheckCircle2, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitContactEnquiry } from '@/controllers/contact.controller';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/routes';

const contactFormSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    phone: z.string().optional(),
    company: z.string().optional(),
    service: z.string().optional(),
    message: z.string().optional(),
    isApplying: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate service and message when NOT applying for a role
    if (!data.isApplying) {
      if (!data.service || data.service.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a service.',
          path: ['service'],
        });
      }
      if (!data.message || data.message.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Message must be at least 10 characters.',
          path: ['message'],
        });
      }
    }
  });

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const typeParam = searchParams.get('type');
  const serviceParam = searchParams.get('service');
  const planParam = searchParams.get('plan');
  const caseStudyParam = searchParams.get('caseStudy');
  const verticalParam = searchParams.get('vertical');
  const solutionParam = searchParams.get('solution');
  const isApplying = Boolean(roleParam || typeParam === 'apply');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Map incoming service query param to exact select values
  const normalizeServiceParam = (param: string | null): string => {
    if (!param) {
      if (solutionParam) {
        const sol = solutionParam.toLowerCase();
        if (sol.includes('agent') || sol.includes('rag') || sol.includes('ai')) return 'ai-solutions';
        if (sol.includes('saas') || sol.includes('platform')) return 'web-applications';
        if (sol.includes('automation') || sol.includes('process')) return 'business-automation';
        return 'custom-software';
      }
      if (verticalParam) {
        const vert = verticalParam.toLowerCase();
        if (vert.includes('saas')) return 'web-applications';
        return 'custom-software';
      }
      return '';
    }
    const clean = param.toLowerCase().trim();
    if (clean.includes('ai') || clean.includes('agent')) return 'ai-solutions';
    if (clean.includes('saas') || clean.includes('app')) return 'web-applications';
    if (clean.includes('custom') || clean.includes('bespoke')) return 'custom-software';
    if (clean.includes('cloud') || clean.includes('infra')) return 'cloud-solutions';
    if (clean.includes('site') || clean.includes('web-dev')) return 'website-development';
    if (clean.includes('mobile') || clean.includes('ios') || clean.includes('android')) return 'mobile-apps';
    if (clean.includes('design') || clean.includes('ui') || clean.includes('ux')) return 'ui-ux-design';
    if (clean.includes('devops') || clean.includes('cicd') || clean.includes('kubernetes')) return 'devops-ci-cd';
    if (clean.includes('automation') || clean.includes('process')) return 'business-automation';
    if (clean.includes('enterprise') || clean.includes('microservice')) return 'enterprise-software';
    if (clean.includes('transform') || clean.includes('modern')) return 'digital-transformation';
    if (clean.includes('consult') || clean.includes('audit')) return 'it-consulting';
    return clean;
  };

  const initialService = normalizeServiceParam(serviceParam);
  let initialMessage = '';
  if (planParam) {
    initialMessage = `Inquiry regarding the ${planParam.toUpperCase()} engagement model. We would like to discuss scope, timeline, and squad allocation.`;
  } else if (caseStudyParam) {
    initialMessage = `Inquiry inspired by the ${caseStudyParam.toUpperCase()} case study. We are looking to engineer a similar high-performance architecture.`;
  } else if (solutionParam) {
    initialMessage = `Inquiry regarding ${solutionParam}. We are looking to assess requirements, timeline, and architectural implementation.`;
  } else if (verticalParam) {
    initialMessage = `Inquiry regarding engineering solutions for the ${verticalParam.toUpperCase()} sector. We would like to schedule an architectural scoping session.`;
  }

  // Resume states for job applications
  const [resumeFile, setResumeFile] = useState<{
    name: string;
    size: string;
    data: string;
  } | null>(null);
  const [resumeLink, setResumeLink] = useState('');
  const [resumeMode, setResumeMode] = useState<'upload' | 'link'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      service: initialService,
      message: initialMessage,
      isApplying,
    },
  });

  // Sync isApplying flag and pre-filled parameters to form values whenever URL params change
  useEffect(() => {
    setValue('isApplying', isApplying);
    if (initialService) {
      setValue('service', initialService);
    }
    if (initialMessage) {
      setValue('message', initialMessage);
    }
  }, [isApplying, initialService, initialMessage, setValue]);

  const selectedService = useWatch({ control, name: 'service' });

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setResumeError(null);

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setResumeError('Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeError('File size exceeds 10MB limit.');
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        name: file.name,
        size: formattedSize,
        data: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    if (isApplying) {
      const hasFile = Boolean(resumeFile);
      const hasLink = Boolean(resumeLink.trim());
      if (!hasFile && !hasLink) {
        setResumeError('Please upload your resume file (PDF/DOCX) or provide a resume link.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitSuccess(null);
    setErrorMessage(null);

    try {
      const payload = isApplying
        ? {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            role: roleParam || 'Engineering Role',
            resumeName: resumeFile?.name,
            resumeData: resumeFile?.data,
            resumeUrl: resumeLink.trim() || undefined,
          }
        : {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
            service: data.service || 'General Inquiry',
            message: data.message || '',
          };

      const result = await submitContactEnquiry(payload);
      if (result.success) {
        setSubmitSuccess(true);
        reset();
        setResumeFile(null);
        setResumeLink('');
        setResumeError(null);
      } else {
        setSubmitSuccess(false);
        setErrorMessage(result.error || 'Something went wrong. Please try again or email us directly.');
      }
    } catch (error) {
      console.error(error);
      setSubmitSuccess(false);
      setErrorMessage('Something went wrong. Please try again or email us directly at info@astraiv.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      {/* Dynamic Header */}
      {isApplying ? (
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Apply for Role
            </h2>
            {roleParam && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {roleParam}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Submit your details and resume to join the AstraIV engineering team.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-1.5">Project Inquiry</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Let&apos;s discuss how we can build, scale, or automate your technology needs.
          </p>
        </div>
      )}

      {submitSuccess === true && (
        <div role="status" aria-live="polite" className="p-6 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-foreground space-y-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                {isApplying ? 'Application Received' : 'Message Received Successfully'}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                {isApplying
                  ? 'Thank you! Your job application has been submitted successfully. Our engineering recruitment team will review your profile and reach out within 48 business hours.'
                  : 'Thank you! We will review your requirements and respond within 24 business hours with an initial architectural perspective.'}
              </p>
            </div>
          </div>

          {!isApplying && (
            <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">While you wait:</span>
              <Link
                href={ROUTES.PUBLIC.START_PROJECT}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                <span>Scope with 5-Step Project Wizard</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <Link
                href={ROUTES.PUBLIC.CASE_STUDIES}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <span>Explore Production Case Studies</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {submitSuccess === false && (
        <div role="alert" aria-live="assertive" className="p-5 mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
            <div className="space-y-1">
              <h4 className="font-bold text-foreground">Submission Interrupted</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {errorMessage || 'A temporary transmission interruption occurred. Your entries are saved below.'}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-destructive/15 flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="font-bold text-primary hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Submission</span>
            </button>
            <span className="text-muted-foreground/40">•</span>
            <a
              href="mailto:info@astraivtechnologies.com"
              className="text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Email Directly: info@astraivtechnologies.com
            </a>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="contact-name"
              placeholder="Enter Your Name"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              {...register('name')}
              className={cn(
                'h-11 px-3.5 bg-background/50 hover:bg-background/80 focus:bg-background border-border/80 dark:border-border/40 text-foreground transition-all duration-200',
                errors.name ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
              )}
            />
            {errors.name && (
              <p id="contact-name-error" role="alert" className="text-xs text-destructive mt-1.5 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
              Email Address <span className="text-destructive">*</span>
            </label>
            <Input
              id="contact-email"
              type="email"
              placeholder="Enter your Email Address"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              {...register('email')}
              className={cn(
                'h-11 px-3.5 bg-background/50 hover:bg-background/80 focus:bg-background border-border/80 dark:border-border/40 text-foreground transition-all duration-200',
                errors.email ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
              )}
            />
            {errors.email && (
              <p id="contact-email-error" role="alert" className="text-xs text-destructive mt-1.5 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Phone & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-phone" className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
              Phone (Optional)
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <CountryPhoneInput id="contact-phone" value={field.value} onChange={field.onChange} placeholder="0000000000" />
              )}
            />
          </div>

          <div>
            <label htmlFor="contact-company" className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
              Company (Optional)
            </label>
            <Input
              id="contact-company"
              {...register('company')}
              className="h-11 px-3.5 bg-background/50 hover:bg-background/80 focus:bg-background border-border/80 dark:border-border/40 text-foreground transition-all duration-200"
            />
          </div>
        </div>

        {/* CONDITIONAL SECTION: Apply for Role vs Standard Quote */}
        {isApplying ? (
          /* ADD YOUR RESUME FIELD */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={resumeMode === 'link' ? 'contact-resume-link' : 'contact-resume-upload'} className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider">
                Add Your Resume <span className="text-destructive">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setResumeMode(resumeMode === 'upload' ? 'link' : 'upload');
                  setResumeError(null);
                }}
                className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {resumeMode === 'upload' ? (
                  <>
                    <Link2 className="h-3 w-3" /> Or provide resume link
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-3 w-3" /> Or upload file (PDF/DOCX)
                  </>
                )}
              </button>
            </div>

            {resumeMode === 'upload' ? (
              <div>
                <input
                  id="contact-resume-upload"
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  aria-label="Upload resume file (PDF or DOCX)"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                {!resumeFile ? (
                  <button
                    type="button"
                    aria-label="Click to upload resume file or drag and drop"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={cn(
                      'w-full cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary',
                      isDragging
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-300/80 dark:border-slate-700/70 bg-slate-100/30 hover:bg-slate-100/60 dark:bg-slate-950/20 dark:hover:bg-slate-950/40'
                    )}
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{resumeFile.name}</p>
                        <p className="text-[10.5px] text-muted-foreground font-medium">{resumeFile.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Remove file"
                      aria-label="Remove uploaded resume file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <Input
                  id="contact-resume-link"
                  type="url"
                  placeholder="https://drive.google.com/... or linkedin.com/in/..."
                  value={resumeLink}
                  aria-invalid={Boolean(resumeError)}
                  aria-describedby={resumeError ? 'contact-resume-error' : undefined}
                  onChange={(e) => {
                    setResumeLink(e.target.value);
                    if (resumeError) setResumeError(null);
                  }}
                  className="h-11 px-3.5 bg-background/50 hover:bg-background/80 focus:bg-background border-border/80 dark:border-border/40 text-foreground transition-all duration-200 text-xs"
                />
                <p className="text-[10.5px] text-muted-foreground">
                  Ensure link permissions allow viewing by anyone with the link.
                </p>
              </div>
            )}

            {resumeError && (
              <p id="contact-resume-error" role="alert" className="text-xs text-destructive mt-1.5 font-semibold">
                {resumeError}
              </p>
            )}
          </div>
        ) : (
          /* STANDARD FORM: REQUESTED SERVICE & PROJECT DETAILS */
          <>
            <div>
              <label htmlFor="contact-service" className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
                Requested Service <span className="text-destructive">*</span>
              </label>
              <Select
                value={selectedService}
                onValueChange={(val) => setValue('service', val as string, { shouldValidate: true })}
              >
                <SelectTrigger
                  id="contact-service"
                  aria-required="true"
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={errors.service ? 'contact-service-error' : undefined}
                  className={cn(
                    'w-full h-11 px-3.5 bg-background/50 hover:bg-background/80 focus:bg-background border-border/80 dark:border-border/40 text-foreground transition-all duration-200 text-left justify-between rounded-xl',
                    errors.service ? 'border-destructive focus:ring-destructive border-destructive' : ''
                  )}
                >
                  <SelectValue placeholder="Select a Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-solutions">AI Solutions & Autonomous Agents</SelectItem>
                  <SelectItem value="web-applications">Web Applications & SaaS Platforms</SelectItem>
                  <SelectItem value="custom-software">Custom Software Development</SelectItem>
                  <SelectItem value="cloud-solutions">Cloud Solutions & Infrastructure</SelectItem>
                  <SelectItem value="website-development">Corporate Website Development</SelectItem>
                  <SelectItem value="mobile-apps">Mobile Applications (iOS & Android)</SelectItem>
                  <SelectItem value="ui-ux-design">UI/UX Design & Design Systems</SelectItem>
                  <SelectItem value="devops-ci-cd">DevOps, CI/CD & Kubernetes</SelectItem>
                  <SelectItem value="business-automation">Business Process Automation</SelectItem>
                  <SelectItem value="enterprise-software">Enterprise Software & Microservices</SelectItem>
                  <SelectItem value="digital-transformation">Digital Transformation & Modernization</SelectItem>
                  <SelectItem value="it-consulting">IT Consulting & Architecture Audits</SelectItem>
                  <SelectItem value="general-inquiry">Other / Custom Engineering Project</SelectItem>
                </SelectContent>
              </Select>
              {errors.service && (
                <p id="contact-service-error" role="alert" className="text-xs text-destructive mt-1.5 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.service.message}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-foreground/90 mb-1.5 uppercase tracking-wider">
                Project Details / Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Tell us about your project requirements..."
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                {...register('message')}
                className={cn(
                  'flex w-full rounded-xl border bg-background/50 hover:bg-background/80 focus:bg-background border-border/80 dark:border-border/40 px-3.5 py-2.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none text-foreground',
                  errors.message ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
                )}
              />
              {errors.message && (
                <p id="contact-message-error" role="alert" className="text-xs text-destructive mt-1.5 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.message.message}</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* Dynamic Action Button */}
        <Button
          type="submit"
          variant="enterprise"
          disabled={isSubmitting}
          className="w-full h-12 font-bold tracking-wide mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
              {isApplying ? 'Submitting Application...' : 'Submitting Project Inquiry...'}
            </>
          ) : isApplying ? (
            'Submit Application'
          ) : (
            'Submit Project Inquiry'
          )}
        </Button>
      </form>
    </div>
  );
}
