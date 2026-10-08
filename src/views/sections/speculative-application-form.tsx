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
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '@/views/ui/icons';
import { submitCandidateApplication } from '@/controllers/application.controller';

interface SpeculativeApplicationFormProps {
  initialRole?: string;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

interface StagedResume {
  file: File;
  stagingKey: string;
  finalKey: string;
  sessionToken: string;
  uploadMethod: 'direct-put' | 'api-relay';
  declaredMimeType: string;
}

export function SpeculativeApplicationForm({
  initialRole = 'Speculative Candidate',
  categories = [
    { id: 'eng', name: 'Engineering & Architecture', slug: 'engineering' },
    { id: 'ai', name: 'AI & Automation', slug: 'ai-automation' },
    { id: 'cloud', name: 'Cloud Ops & Distributed Systems', slug: 'cloud-ops' },
    { id: 'security', name: 'Security & Infrastructure', slug: 'security' },
  ],
}: SpeculativeApplicationFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Engineering & Architecture']);
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Resume state
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

  const toggleInterest = (catName: string) => {
    setSelectedInterests((prev) =>
      prev.includes(catName) ? prev.filter((i) => i !== catName) : [...prev, catName]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB. Please upload a smaller PDF or supply a cloud link.');
      return;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = ['.pdf', '.doc', '.docx'];
    if (!allowed.includes(ext)) {
      setErrorMessage('Only PDF, DOC, and DOCX documents up to 10MB are accepted.');
      return;
    }

    setIsUploadingFile(true);
    setUploadProgress(20);

    try {
      const sessionRes = await fetch('/api/applications/upload-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'application/pdf',
          sizeBytes: file.size,
          jobId: 'speculative-candidate',
        }),
      });

      if (!sessionRes.ok) {
        const errorData = await sessionRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize secure upload session.');
      }

      const session = await sessionRes.json();
      setUploadProgress(50);

      if (session.uploadMethod === 'direct-put' && session.uploadUrl) {
        const putRes = await fetch(session.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/pdf' },
          body: file,
        });

        if (!putRes.ok) {
          throw new Error('Direct storage upload failed. Falling back to local upload handler.');
        }
      } else {
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
      console.error('[Speculative Resume Upload Error]:', err);
      setErrorMessage((err as Error).message || 'Failed to upload resume. Please try again or provide a cloud link.');
      setStagedResume(null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (honeypot) {
      router.push(`/careers/confirmation?ref=AST-APP-${Date.now().toString(36).toUpperCase()}&role=${encodeURIComponent(initialRole)}`);
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
      setErrorMessage('Please upload your resume in PDF or DOCX format, or provide a cloud link.');
      return;
    }

    if (resumeMode === 'link' && !resumeUrl.trim()) {
      setErrorMessage('Please provide a valid HTTPS link to your resume or Google Drive document.');
      return;
    }

    if (!privacyConsent) {
      setErrorMessage('Please acknowledge our candidate data protection terms.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitCandidateApplication({
        type: 'speculative',
        jobTitle: initialRole || 'Speculative Application',
        applicantName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        location: location.trim(),
        experienceLevel: experienceLevel || 'Fresher',
        categoryInterests: selectedInterests,
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
          `/careers/confirmation?ref=${encodeURIComponent(result.referenceId)}&role=${encodeURIComponent(initialRole)}`
        );
      } else {
        setErrorMessage(result.error || 'Failed to submit speculative application. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('[Speculative Application Submission Error]:', err);
      setErrorMessage('An unexpected error occurred. Please try again or email careers@astraiv.com directly.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] text-left">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary dark:text-cyan-400" />
            <span>Speculative Application</span>
          </h2>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-cyan-400 border border-primary/20">
            {initialRole}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Tell us about your technical depth, open-source projects, or architectural interests.
        </p>
      </div>

      {errorMessage && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium flex items-start gap-2.5"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {/* Anti-spam honeypot */}
        <input
          type="text"
          name="astraiv_speculative_check"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="spec-name" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="spec-email" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Phone & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="spec-phone" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
              Phone / WhatsApp (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="spec-location" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
              Location & Timezone <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India (IST) / Remote"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="spec-experience" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
            Experience Level
          </label>
          <select
            id="spec-experience"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
          >
            <option value="Fresher">Fresher (Zero Work Exp / Graduate / Student Projects)</option>
            <option value="0-1 years">0 - 1 Year (Early Career / Internships)</option>
            <option value="1-3 years">1 - 3 Years (Junior / Mid-Level)</option>
            <option value="3-5 years">3 - 5 Years (Mid-Level Engineer)</option>
            <option value="5-8 years">5 - 8 Years (Senior Architect)</option>
            <option value="8+ years">8+ Years (Staff / Principal Engineer)</option>
          </select>
        </div>

        {/* Areas of Interest Chips */}
        <div>
          <label className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-2">
            Areas of Specialty & Interest
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedInterests.includes(cat.name);
              return (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  onClick={() => toggleInterest(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card text-muted-foreground hover:text-foreground border-border/70'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* GitHub & Portfolio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="spec-github" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
              GitHub (Optional)
            </label>
            <div className="relative">
              <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-github"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="spec-portfolio" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
              Portfolio / LinkedIn (Optional)
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-portfolio"
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Resume File Upload or Cloud Link */}
        <div className="p-4.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-border/70 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Resume / CV <span className="text-destructive">*</span>
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
                id="spec-resume-file"
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                aria-label="Upload resume file in PDF, DOC, or DOCX format"
                onChange={handleFileUpload}
                className="hidden"
              />
              {stagedResume ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
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
                    className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
                  className="w-full border-2 border-dashed border-border/80 dark:border-slate-800 rounded-xl p-5 text-center hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-card/40"
                >
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-xs font-bold text-foreground">
                        Uploading & verifying document... ({uploadProgress}%)
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-primary" />
                      <span className="text-xs font-bold text-foreground">
                        Upload resume (PDF, DOCX up to 10MB)
                      </span>
                      <span className="text-[10.5px] text-muted-foreground">
                        Direct encrypted upload with binary validation
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
                id="spec-resume-url"
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... or https://notion.so/resume"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>

        {/* Candidate Note / Elevator Pitch */}
        <div>
          <label htmlFor="spec-note" className="block text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1.5">
            Technical Background & Elevator Pitch (Optional)
          </label>
          <textarea
            id="spec-note"
            rows={3}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Tell us what technologies you build with, your favorite technical problem, or what role you aspire to create..."
            className="w-full p-3.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Privacy Checkbox */}
        <div className="flex items-start gap-2.5">
          <input
            id="spec-privacy"
            type="checkbox"
            required
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            className="mt-1 h-3.5 w-3.5 rounded-md border-border text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="spec-privacy" className="text-[11px] text-muted-foreground leading-relaxed cursor-pointer">
            By submitting, your profile is stored privately and reviewed strictly by our engineering founders under NDA.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isUploadingFile}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Transmitting Candidate Profile...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Speculative Application</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10.5px] text-muted-foreground font-semibold">
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span>Private recruitment engine • Direct founder review SLA 48h</span>
        </div>
      </form>
    </div>
  );
}
