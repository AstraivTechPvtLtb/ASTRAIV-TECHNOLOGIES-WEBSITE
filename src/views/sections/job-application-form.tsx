'use client';

import { useState } from 'react';
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
  Briefcase,
  Globe,
} from 'lucide-react';
import { GithubIcon } from '@/views/ui/icons';
import { submitContactForm } from '@/controllers/contact.controller';

interface JobApplicationFormProps {
  roleTitle: string;
  roleSlug: string;
  department: string;
}

export function JobApplicationForm({
  roleTitle,
  roleSlug: _roleSlug,
  department,
}: JobApplicationFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('3-5 years');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');

  // Resume state: either file or link
  const [resumeMode, setResumeMode] = useState<'upload' | 'link'>('upload');
  const [resumeFile, setResumeFile] = useState<{ name: string; data: string } | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');

  // Anti-spam honeypot
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please upload a smaller PDF or supply a link.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        name: file.name,
        data: reader.result as string,
      });
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Anti-bot check
    if (honeypot) {
      // Silently pretend success
      router.push(`/careers/confirmation?ref=AST-APP-${Date.now().toString(36).toUpperCase()}&role=${encodeURIComponent(roleTitle)}`);
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Please fill in your name and email address.');
      return;
    }

    if (resumeMode === 'upload' && !resumeFile) {
      setErrorMessage('Please upload your resume in PDF or Word format, or switch to providing a link.');
      return;
    }

    if (resumeMode === 'link' && !resumeUrl.trim()) {
      setErrorMessage('Please provide a valid link to your resume or Google Drive document.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: `${location.trim()} · ${experience}`,
        service: `Job Application: ${roleTitle}`,
        message: [
          `=== JOB APPLICATION ===`,
          `Role: ${roleTitle} (${department})`,
          `Candidate Name: ${fullName.trim()}`,
          `Email: ${email.trim()}`,
          phone.trim() ? `Phone: ${phone.trim()}` : null,
          `Location / Timezone: ${location.trim()}`,
          `Experience Level: ${experience}`,
          githubUrl.trim() ? `GitHub: ${githubUrl.trim()}` : null,
          portfolioUrl.trim() ? `Portfolio / LinkedIn: ${portfolioUrl.trim()}` : null,
          coverNote.trim() ? `\nCandidate Note:\n${coverNote.trim()}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
        role: roleTitle,
        resumeName: resumeMode === 'upload' ? resumeFile?.name : undefined,
        resumeData: resumeMode === 'upload' ? resumeFile?.data : undefined,
        resumeUrl: resumeMode === 'link' ? resumeUrl.trim() : undefined,
      };

      const result = await submitContactForm(payload);

      if (result.success) {
        const refId = result.data?.id
          ? `AST-APP-${result.data.id.substring(0, 8).toUpperCase()}`
          : `AST-APP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        router.push(
          `/careers/confirmation?ref=${encodeURIComponent(refId)}&role=${encodeURIComponent(roleTitle)}`
        );
      } else {
        setErrorMessage(result.error || 'Failed to submit application. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Job application submission error:', err);
      setErrorMessage('An unexpected error occurred. Please try again or reach out to us at careers@astraiv.com.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="apply" className="scroll-mt-28">
      <div className="p-8 sm:p-12 rounded-3xl bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border/80 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Direct Application</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading">
              Apply for {roleTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
              Reviewed directly by senior engineering architects within 48 business hours. No third-party recruiter filters.
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm font-medium flex items-start gap-3 mb-8"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Hidden honeypot */}
            <input
              type="text"
              name="astraiv_work_portal_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Phone / WhatsApp (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Location & Timezone <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. London, UK (UTC+0) / Berlin, Germany"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Experience & GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  Relevant Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                >
                  <option value="1-3 years">1 - 3 Years</option>
                  <option value="3-5 years">3 - 5 Years</option>
                  <option value="5-8 years">5 - 8 Years (Senior)</option>
                  <option value="8+ years">8+ Years (Staff / Principal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  GitHub Profile URL
                </label>
                <div className="relative">
                  <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: LinkedIn or Portfolio */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Portfolio or LinkedIn URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username or https://myportfolio.dev"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Resume Upload / Link Selector */}
            <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/70 border border-border/70 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Resume / Curriculum Vitae <span className="text-primary">*</span>
                </label>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setResumeMode('upload')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      resumeMode === 'upload'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    File Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode('link')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      resumeMode === 'link'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    URL / Cloud Link
                  </button>
                </div>
              </div>

              {resumeMode === 'upload' ? (
                <div className="relative border-2 border-dashed border-border/80 dark:border-slate-800 rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>{resumeFile.name} (Ready to submit)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-6 w-6 text-primary" />
                      <span className="text-xs sm:text-sm font-medium">
                        Click to upload your resume (PDF, DOCX up to 10MB)
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or https://notion.so/resume"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Candidate Cover Note */}
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Why Astraiv & Recent Accomplishment (Optional)
              </label>
              <textarea
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Tell us about a complex architecture problem you solved recently or why you want to build with us..."
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transmitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span>Submit Application for {roleTitle}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-muted-foreground">
              By submitting, your data is processed strictly under our NDA protocols and privacy policy. No unsolicited third-party disclosure.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
