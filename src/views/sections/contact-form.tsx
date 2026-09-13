'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/views/ui/button';
import { Input } from '@/views/ui/input';
import { CountryPhoneInput } from '@/views/ui/country-phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/views/ui/select';
import { Loader2, UploadCloud, FileText, X, Link2, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitContactEnquiry } from '@/controllers/contact.controller';

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
  const isApplying = Boolean(roleParam || typeParam === 'apply');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      service: '',
      message: '',
      isApplying,
    },
  });

  // Sync isApplying flag to form values whenever URL params change
  useEffect(() => {
    setValue('isApplying', isApplying);
  }, [isApplying, setValue]);

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
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Apply for Role
            </h3>
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
          <h3 className="text-xl font-bold tracking-tight text-foreground mb-1.5">Request a Quote</h3>
          <p className="text-sm text-muted-foreground font-medium">
            Let&apos;s discuss how we can build, scale, or automate your technology needs.
          </p>
        </div>
      )}

      {submitSuccess === true && (
        <div className="p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
          {isApplying
            ? 'Thank you! Your job application has been submitted successfully. Our engineering recruitment team will review your profile and reach out within 48 business hours.'
            : 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.'}
        </div>
      )}

      {submitSuccess === false && (
        <div className="p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {errorMessage || 'Something went wrong. Please try again or email us directly at info@astraivtechnologies.com.'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <Input
              placeholder="Enter Your Name"
              {...register('name')}
              className={cn(
                'h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30',
                errors.name ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
              )}
            />
            {errors.name && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your Email Address"
              {...register('email')}
              className={cn(
                'h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30',
                errors.email ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
              )}
            />
            {errors.email && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Phone (Optional)
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <CountryPhoneInput value={field.value} onChange={field.onChange} placeholder="0000000000" />
              )}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">
              Company (Optional)
            </label>
            <Input
              {...register('company')}
              className="h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30"
            />
          </div>
        </div>

        {/* CONDITIONAL SECTION: Apply for Role vs Standard Quote */}
        {isApplying ? (
          /* ADD YOUR RESUME FIELD */
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-foreground/80 uppercase tracking-wider">
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
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                {!resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={cn(
                      'cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 flex flex-col items-center justify-center gap-2',
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
                  </div>
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
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <Input
                  type="url"
                  placeholder="https://drive.google.com/... or linkedin.com/in/..."
                  value={resumeLink}
                  onChange={(e) => {
                    setResumeLink(e.target.value);
                    if (resumeError) setResumeError(null);
                  }}
                  className="h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30 text-xs"
                />
                <p className="text-[10.5px] text-muted-foreground">
                  Ensure link permissions allow viewing by anyone with the link.
                </p>
              </div>
            )}

            {resumeError && <p className="text-xs text-destructive mt-1.5 font-semibold">{resumeError}</p>}
          </div>
        ) : (
          /* STANDARD FORM: REQUESTED SERVICE & PROJECT DETAILS */
          <>
            <div>
              <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">
                Requested Service
              </label>
              <Select onValueChange={(val) => setValue('service', val as string)}>
                <SelectTrigger
                  className={cn(
                    'w-full h-11 px-3.5 bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 text-foreground transition-all duration-200 border-border/50 dark:border-border/30 text-left justify-between',
                    errors.service ? 'border-destructive focus:ring-destructive border-destructive' : ''
                  )}
                >
                  <SelectValue placeholder="Select a Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-development">Website Development</SelectItem>
                  <SelectItem value="web-applications">Web Applications</SelectItem>
                  <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                  <SelectItem value="brand-identity">Brand Identity</SelectItem>
                  <SelectItem value="ai-solutions">AI Solutions</SelectItem>
                  <SelectItem value="cloud-solutions">Cloud Solutions</SelectItem>
                  <SelectItem value="business-automation">Business Automation</SelectItem>
                </SelectContent>
              </Select>
              {errors.service && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.service.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-foreground/80 mb-1.5 uppercase tracking-wider">
                Project Details / Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your project requirements..."
                {...register('message')}
                className={cn(
                  'flex w-full rounded-lg border bg-slate-100/30 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 dark:focus:bg-slate-950/80 border-border/50 dark:border-border/30 px-3.5 py-2.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none text-foreground',
                  errors.message ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive' : ''
                )}
              />
              {errors.message && <p className="text-xs text-destructive mt-1.5 font-semibold">{errors.message.message}</p>}
            </div>
          </>
        )}

        {/* Dynamic Action Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 font-bold tracking-wide mt-2">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
              {isApplying ? 'Submitting Application...' : 'Sending Request...'}
            </>
          ) : isApplying ? (
            'Submit Application'
          ) : (
            'Send Request'
          )}
        </Button>
      </form>
    </div>
  );
}
