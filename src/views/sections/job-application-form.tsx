'use client';

import { useState, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import {
  Send,
  Loader2,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  X,
  ShieldCheck,
} from 'lucide-react';
import { GithubIcon } from '@/views/ui/icons';
import { submitCandidateApplication } from '@/controllers/application.controller';

interface JobApplicationFormProps {
  jobId?: string;
  roleTitle: string;
  roleSlug: string;
  department: string;
  experienceLevel?: string;
  defaultPrivacyText?: string;
}

interface StagedResume {
  file: File;
  stagingKey: string;
  finalKey: string;
  sessionToken: string;
  uploadMethod: 'direct-put' | 'api-relay';
  declaredMimeType: string;
}

export function JobApplicationForm({
  jobId,
  roleTitle,
  roleSlug,
  department: _department,
  experienceLevel: initialExperienceLevel,
  defaultPrivacyText,
}: JobApplicationFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<string>(
    initialExperienceLevel === 'Fresher' ? 'Fresher' : '1-3 years'
  );
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Resume state: either file or link
  const [resumeMode, setResumeMode] = useState<'upload' | 'link'>('upload');
  const [stagedResume, setStagedResume] = useState<StagedResume | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Anti-spam honeypot
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);

    // 1. Client-side size & extension verification
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please upload a smaller document or provide a cloud link.');
      return;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = ['.pdf', '.doc', '.docx'];
    if (!allowed.includes(ext)) {
      setErrorMessage('Only PDF, DOC, and DOCX documents up to 10MB are accepted.');
      return;
    }

    setIsUploadingFile(true);
    setUploadProgress(15);

    try {
      // 2. Request staging upload session ticket from server
      const sessionRes = await fetch('/api/applications/upload-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'application/pdf',
          sizeBytes: file.size,
          jobId: jobId || roleSlug,
        }),
      });

      if (!sessionRes.ok) {
        const errorData = await sessionRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize secure upload session.');
      }

      const session = await sessionRes.json();
      setUploadProgress(50);

      // 3. Upload file directly to presigned PUT URL or staging endpoint
      if (session.uploadMethod === 'direct-put' && session.uploadUrl) {
        const putRes = await fetch(session.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type || 'application/pdf',
          },
          body: file,
        });

        if (!putRes.ok) {
          throw new Error('Direct storage upload failed. Falling back to local upload handler.');
        }
      } else {
        // Fallback direct staging upload via API route
        const formData = new FormData();
        formData.append('file', file);
        formData.append('stagingKey', session.stagingKey);
        formData.append('sessionToken', session.sessionToken);

        const relayRes = await fetch('/api/applications/upload-direct', {
          method: 'POST',
          body: formData,
        });

        if (!relayRes.ok) {
          const relayError = await relayRes.json().catch(() => ({}));
          throw new Error(relayError.error || 'Direct upload processing failed.');
        }
      }

      setUploadProgress(100);
      setStagedResume({
        file,
        stagingKey: session.stagingKey,
        finalKey: session.finalKey,
        sessionToken: session.sessionToken,
        uploadMethod: session.uploadMethod,
        declaredMimeType: file.type || 'application/pdf',
      });
      setErrorMessage(null);
    } catch (err: unknown) {
      console.error('[Resume Upload Error]:', err);
      setErrorMessage((err as Error).message || 'Failed to upload resume. Please try again or provide a cloud link.');
      setStagedResume(null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Honeypot check
    if (honeypot) {
      router.push(`/careers/confirmation?ref=AST-APP-${Date.now().toString(36).toUpperCase()}&role=${encodeURIComponent(roleTitle)}`);
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Please fill in your full name and email address.');
      return;
    }

    if (!location.trim()) {
      setErrorMessage('Please specify your current location or primary timezone.');
      return;
    }

    if (resumeMode === 'upload' && !stagedResume) {
      setErrorMessage('Please upload your resume in PDF or DOCX format, or switch to providing a cloud link.');
      return;
    }

    if (resumeMode === 'link' && !resumeUrl.trim()) {
      setErrorMessage('Please provide a valid HTTPS link to your resume or Google Drive document.');
      return;
    }

    if (!privacyConsent) {
      setErrorMessage('Please acknowledge our candidate data protection terms to submit your application.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCandidateApplication({
        type: 'job',
        jobId: jobId || undefined,
        jobSlug: roleSlug,
        jobTitle: roleTitle,
        applicantName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        location: location.trim(),
        experienceLevel: experienceLevel || 'Experienced',
        githubUrl: githubUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        resumeType: resumeMode,
        stagingKey: resumeMode === 'upload' ? stagedResume?.stagingKey : undefined,
        finalKey: resumeMode === 'upload' ? stagedResume?.finalKey : undefined,
        sessionToken: resumeMode === 'upload' ? stagedResume?.sessionToken : undefined,
        originalFilename: resumeMode === 'upload' ? stagedResume?.file.name : undefined,
        declaredMimeType: resumeMode === 'upload' ? stagedResume?.declaredMimeType : undefined,
        resumeUrl: resumeMode === 'link' ? resumeUrl.trim() : undefined,
        candidateNote: coverNote.trim() || undefined,
        privacyConsent: true,
        honeypot,
      });

      if (result.success && result.referenceId) {
        router.push(
          `/careers/confirmation?ref=${encodeURIComponent(result.referenceId)}&role=${encodeURIComponent(roleTitle)}`
        );
      } else {
        setErrorMessage(result.error || 'Failed to submit application. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('[Job application submission error]:', err);
      setErrorMessage('An unexpected error occurred. Please try again or email our founders directly at careers@astraiv.com.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="apply" className="scroll-mt-28 w-full">
      <div className="p-8 sm:p-12 rounded-3xl bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/80 dark:border-slate-800 shadow-xl relative overflow-hidden text-left">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading">
              Apply for {roleTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
              Reviewed directly by senior engineering architects within 48 business hours. Zero recruiter filters.
            </p>
          </div>

          {errorMessage && (
            <motion.div
              role="alert"
              aria-live="assertive"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm font-medium flex items-start gap-3 mb-8"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Honeypot anti-spam */}
            <input
              type="text"
              name="astraiv_app_check_code"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="job-fullname" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="job-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="job-email" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="job-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="job-phone" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                  Phone / WhatsApp (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="job-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="job-location" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                  Location & Timezone <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="job-location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India (IST) / Remote"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Experience Level & GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="job-experience" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                  Experience Level
                </label>
                <select
                  id="job-experience"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                >
                  <option value="Fresher">Fresher (Zero Work Exp / Graduate / Student Projects)</option>
                  <option value="0-1 years">0 - 1 Year (Early Career / Internships)</option>
                  <option value="1-3 years">1 - 3 Years (Junior / Mid-Level)</option>
                  <option value="3-5 years">3 - 5 Years (Mid-Level Engineer)</option>
                  <option value="5-8 years">5 - 8 Years (Senior Architect)</option>
                  <option value="8+ years">8+ Years (Staff / Principal Engineer)</option>
                </select>
              </div>

              <div>
                <label htmlFor="job-github" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                  GitHub Profile URL (Optional)
                </label>
                <div className="relative">
                  <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="job-github"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Portfolio or LinkedIn URL */}
            <div>
              <label htmlFor="job-portfolio" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                Portfolio or LinkedIn URL (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  id="job-portfolio"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username or https://myportfolio.dev"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Resume Upload / Link Selector */}
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-border/70 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Resume / CV Document <span className="text-primary">*</span>
                </label>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setResumeMode('upload');
                      setErrorMessage(null);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      resumeMode === 'upload'
                        ? 'bg-card text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResumeMode('link');
                      setErrorMessage(null);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      resumeMode === 'link'
                        ? 'bg-card text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Cloud Link
                  </button>
                </div>
              </div>

              {resumeMode === 'upload' ? (
                <div>
                  <input
                    id="job-resume-file"
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    aria-label="Upload resume file in PDF, DOC, or DOCX format"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {stagedResume ? (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{stagedResume.file.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {(stagedResume.file.size / 1024).toFixed(0)} KB • Verified & Ready
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStagedResume(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isUploadingFile}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-border/80 dark:border-slate-800 rounded-xl p-6 text-center hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-card/40"
                    >
                      {isUploadingFile ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            Uploading & verifying document structure... ({uploadProgress}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            Click to upload your resume (PDF, DOCX up to 10MB)
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Binary document headers validated server-side
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="job-resume-url"
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or https://notion.so/resume"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5 pl-1">
                    Please ensure link permissions allow viewing by anyone with the link.
                  </p>
                </div>
              )}
            </div>

            {/* Candidate Cover Note */}
            <div>
              <label htmlFor="job-cover-note" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
                Why Astraiv & Recent Architectural Challenge (Optional)
              </label>
              <textarea
                id="job-cover-note"
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Tell us about a technical challenge you tackled, open source work, or why you want to build with our team..."
                className="w-full p-4 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Privacy Consent Checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="job-privacy-consent"
                type="checkbox"
                required
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-md border-border text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="job-privacy-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                {defaultPrivacyText ||
                  'By submitting, your data is processed strictly under our NDA protocols and privacy policy. No unsolicited third-party disclosure.'}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isUploadingFile}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transmitting Application to Recruitment Engine...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Submit Application for {roleTitle}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-semibold pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Direct encryption & private storage isolation enabled</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
