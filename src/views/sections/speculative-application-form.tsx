'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
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
  UserCheck,
  Search,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/views/ui/select';
import { GithubIcon } from '@/views/ui/icons';
import { submitCandidateApplication } from '@/controllers/application.controller';
import type { PublicCareersPageContent } from '@/models/types';

interface SpeculativeApplicationFormProps {
  initialRole?: string;
  roles?: Array<string | { id: string; title: string; slug: string }>;
  categories?: Array<{ id: string; name: string; slug: string }>;
  careersContent?: PublicCareersPageContent;
}

interface StagedResume {
  file: File;
  stagingKey: string;
  finalKey: string;
  sessionToken: string;
  uploadMethod: 'direct-put' | 'api-relay';
  declaredMimeType: string;
}

const DEFAULT_ROLES = [
  'Senior Full-Stack Architect',
  'AI Systems & LLM Engineer',
  'Cloud Infrastructure & DevOps Lead',
  'Lead UI/UX Designer & Systems Architect',
  'Principal Distributed Systems Engineer',
];

export function SpeculativeApplicationForm({
  initialRole = 'Open Application · Fresher & Experienced',
  roles,
  categories,
  careersContent,
}: SpeculativeApplicationFormProps) {
  const router = useRouter();

  // Extract exact active job roles created in admin / shown on careers portal
  const availableRoles = useMemo(() => {
    if (roles && roles.length > 0) {
      const titles = roles
        .map((r) => (typeof r === 'string' ? r : r.title))
        .filter((t): t is string => Boolean(t && t.trim()));
      if (titles.length > 0) {
        return Array.from(new Set(titles));
      }
    }
    return DEFAULT_ROLES;
  }, [roles]);

  // Split into Top 5 roles and remaining roles for the dropdown
  const top5Roles = useMemo(() => availableRoles.slice(0, 5), [availableRoles]);
  const dropdownRoles = useMemo(() => availableRoles.slice(5), [availableRoles]);

  // Dropdown state for "More Roles"
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Close "More Roles" dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreOpen]);

  // Filtered dropdown roles based on search query
  const filteredDropdownRoles = useMemo(() => {
    const q = roleSearchQuery.trim().toLowerCase();
    if (!q) return dropdownRoles;
    return dropdownRoles.filter((r) => r.toLowerCase().includes(q));
  }, [dropdownRoles, roleSearchQuery]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    if (
      initialRole &&
      initialRole !== 'Open Application · Fresher & Experienced' &&
      initialRole !== 'Speculative Candidate' &&
      initialRole !== 'Speculative Senior Architect'
    ) {
      const match = availableRoles.find(
        (r) =>
          r.toLowerCase() === initialRole.toLowerCase() ||
          initialRole.toLowerCase().includes(r.toLowerCase()) ||
          r.toLowerCase().includes(initialRole.toLowerCase())
      );
      if (match) return [match];
      return [initialRole];
    }
    return [availableRoles[0] || 'Senior Full-Stack Architect'];
  });

  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Count how many roles from the dropdown are currently selected
  const selectedDropdownCount = useMemo(() => {
    return dropdownRoles.filter((r) => selectedInterests.includes(r)).length;
  }, [dropdownRoles, selectedInterests]);

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  // Real-time phone sanitizer: only allows digits, spaces, and at most one leading '+'
  const handlePhoneChange = (val: string) => {
    let sanitized = val.replace(/[^\d+ ]/g, '');
    if (sanitized.startsWith('+')) {
      sanitized = '+' + sanitized.slice(1).replace(/\+/g, '');
    } else {
      sanitized = sanitized.replace(/\+/g, '');
    }
    setPhone(sanitized);
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const validateEmail = (val: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  const validatePhone = (val: string): boolean => {
    if (!val.trim()) return true; // optional field
    const digits = val.replace(/\D/g, '');
    const validFormat = /^\+?[0-9\s-]{7,20}$/.test(val.trim());
    return validFormat && digits.length >= 7 && digits.length <= 16;
  };

  const handleBlur = (field: string) => {
    switch (field) {
      case 'fullName':
        if (fullName.trim() && fullName.trim().length < 2) {
          setFieldErrors((prev) => ({ ...prev, fullName: 'Full Name must be at least 2 characters.' }));
        } else if (fullName.trim()) {
          setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
        }
        break;
      case 'email':
        if (email.trim() && !validateEmail(email)) {
          setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address (e.g. yourmail@email.com).' }));
        } else if (email.trim()) {
          setFieldErrors((prev) => ({ ...prev, email: undefined }));
        }
        break;
      case 'phone':
        if (phone.trim() && !validatePhone(phone)) {
          setFieldErrors((prev) => ({ ...prev, phone: 'Please enter a valid international phone number (e.g. +1 000 000 0000 or +44 0000 000000).' }));
        } else {
          setFieldErrors((prev) => ({ ...prev, phone: undefined }));
        }
        break;
      case 'location':
        if (location.trim() && location.trim().length < 2) {
          setFieldErrors((prev) => ({ ...prev, location: 'Location must be at least 2 characters.' }));
        } else if (location.trim()) {
          setFieldErrors((prev) => ({ ...prev, location: undefined }));
        }
        break;
      case 'resumeUrl':
        if (resumeUrl.trim() && !resumeUrl.trim().startsWith('http://') && !resumeUrl.trim().startsWith('https://')) {
          setFieldErrors((prev) => ({ ...prev, resumeUrl: 'Resume link must start with https://' }));
        } else {
          setFieldErrors((prev) => ({ ...prev, resumeUrl: undefined }));
        }
        break;
    }
  };

  // Validation for submit button activation:
  // Requires: fullName (min 2), valid email, valid phone (if provided), location (min 2), resume uploaded/linked, and NDA privacy consent checked
  const hasValidResume = resumeMode === 'upload' ? Boolean(stagedResume) : Boolean(resumeUrl.trim() && (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')));
  const isEmailValid = validateEmail(email);
  const isPhoneValid = validatePhone(phone);
  const isFullNameValid = fullName.trim().length >= 2;
  const isLocationValid = location.trim().length >= 2;

  const isFormValid = Boolean(
    isFullNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isLocationValid &&
    hasValidResume &&
    privacyConsent &&
    !isSubmitting &&
    !isUploadingFile
  );

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

    const errors: Record<string, string | undefined> = {};
    if (!isFullNameValid) {
      errors.fullName = 'Please enter your full name (minimum 2 characters).';
    }
    if (!isEmailValid) {
      errors.email = 'Please provide a valid email address (e.g. yourmail@email.com).';
    }
    if (!isPhoneValid) {
      errors.phone = 'Please enter a valid international phone number with country code.';
    }
    if (!isLocationValid) {
      errors.location = 'Please specify your location.';
    }
    if (resumeMode === 'upload' && !stagedResume) {
      errors.resume = 'Please upload your resume in PDF, DOC, or DOCX format, or provide a cloud link.';
    }
    if (resumeMode === 'link' && (!resumeUrl.trim() || (!resumeUrl.startsWith('http://') && !resumeUrl.startsWith('https://')))) {
      errors.resumeUrl = 'Please provide a valid HTTPS link to your resume or Google Drive document.';
    }
    if (!privacyConsent) {
      errors.privacy = 'Please acknowledge that your profile is stored privately under NDA.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage(Object.values(errors).filter(Boolean)[0] || 'Please complete all required fields correctly.');
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
      setErrorMessage('An unexpected error occurred. Please try again or email careers@astraivtechnologies.com directly.');
      setIsSubmitting(false);
    }
  };

  const formHeading = careersContent?.speculativePageCopy?.formHeading || 'Speculative Application';
  const formBadge = careersContent?.speculativePageCopy?.formBadge || initialRole || 'Open Application · Fresher & Experienced';
  const formSubheading = careersContent?.speculativePageCopy?.formSubheading || 'Tell us about your technical depth, open-source projects, or architectural interests.';
  const ndaCheckboxLabel = careersContent?.speculativePageCopy?.ndaCheckboxLabel || 'By submitting, your profile is stored privately and reviewed strictly by our engineering founders under NDA.';
  const submitButtonText = careersContent?.speculativePageCopy?.submitButtonText || 'Submit Speculative Application';
  const slaNote = careersContent?.speculativePageCopy?.slaNote || 'Private recruitment engine • Direct founder review SLA 48h';

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-8 rounded-3xl border border-border/80 bg-card/90 dark:bg-slate-900/80 backdrop-blur-xl feature-card-shadow text-left relative overflow-hidden transition-all duration-300">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <h2 className="text-xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
            <UserCheck className="h-5 w-5 text-primary dark:text-cyan-400" />
            <span>{formHeading}</span>
          </h2>
          <span className="text-[11px] font-medium px-3 py-1 rounded-full skill-badge-gradient text-foreground shadow-xs">
            {formBadge}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-light dark:font-normal">
          {formSubheading}
        </p>
      </div>

      {errorMessage && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-normal flex items-start gap-2.5"
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
            <label htmlFor="spec-name" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                onBlur={() => handleBlur('fullName')}
                placeholder="Your Full Name"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 transition-all ${
                  fieldErrors.fullName
                    ? 'border-destructive focus:ring-destructive/50'
                    : 'border-border/80 dark:border-border/40 focus:ring-primary'
                }`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{fieldErrors.fullName}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="spec-email" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={() => handleBlur('email')}
                placeholder="yourmail@email.com"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 transition-all ${
                  fieldErrors.email
                    ? 'border-destructive focus:ring-destructive/50'
                    : 'border-border/80 dark:border-border/40 focus:ring-primary'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Phone & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="spec-phone" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
              Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+00 00000 00000"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 transition-all ${
                  fieldErrors.phone
                    ? 'border-destructive focus:ring-destructive/50'
                    : 'border-border/80 dark:border-border/40 focus:ring-primary'
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{fieldErrors.phone}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="spec-location" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
              Location <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="spec-location"
                type="text"
                required
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (fieldErrors.location) setFieldErrors((prev) => ({ ...prev, location: undefined }));
                }}
                onBlur={() => handleBlur('location')}
                placeholder="Your Location"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 transition-all ${
                  fieldErrors.location
                    ? 'border-destructive focus:ring-destructive/50'
                    : 'border-border/80 dark:border-border/40 focus:ring-primary'
                }`}
              />
            </div>
            {fieldErrors.location && (
              <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{fieldErrors.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Experience Level with UI Select Component for Dark & Light Theme Optimization */}
        <div>
          <label htmlFor="spec-experience" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
            Experience Level
          </label>
          <Select value={experienceLevel} onValueChange={(val) => setExperienceLevel(val || 'Fresher')}>
            <SelectTrigger
              id="spec-experience"
              aria-label="Select Experience Level"
              className="w-full h-11 px-3.5 bg-background/50 hover:bg-background/80 focus:bg-background border-border/80 dark:border-border/40 text-foreground text-xs font-normal transition-all duration-200 text-left justify-between rounded-xl"
            >
              <SelectValue placeholder="Select Experience Level" />
            </SelectTrigger>
            <SelectContent className="bg-popover/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/90 dark:border-slate-800 rounded-xl shadow-xl z-50">
              <SelectItem value="Fresher">Fresher (Zero Work Exp / Graduate / Student Projects)</SelectItem>
              <SelectItem value="0-1 years">0 - 1 Year (Early Career / Internships)</SelectItem>
              <SelectItem value="1-3 years">1 - 3 Years (Junior / Mid-Level)</SelectItem>
              <SelectItem value="3-5 years">3 - 5 Years (Mid-Level Engineer)</SelectItem>
              <SelectItem value="5-8 years">5 - 8 Years (Senior Architect)</SelectItem>
              <SelectItem value="8+ years">8+ Years (Staff / Principal Engineer)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Areas of Interest Chips - Top 5 Active Roles + 6th Searchable More Roles Dropdown */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-foreground/90 uppercase tracking-wider">
              Areas of Specialty & Interest
            </label>
            <span className="text-[10.5px] text-muted-foreground font-light">
              Select roles matching your technical depth
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Top 5 roles as chips */}
            {top5Roles.map((roleName) => {
              const isSelected = selectedInterests.includes(roleName);
              return (
                <button
                  key={roleName}
                  type="button"
                  onClick={() => toggleInterest(roleName)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'filter-btn-active font-medium scale-[1.02]'
                      : 'filter-btn-gradient font-normal hover:text-foreground'
                  }`}
                >
                  {roleName}
                </button>
              );
            })}

            {/* 6th Option: More Roles Dropdown with Search Bar */}
            {dropdownRoles.length > 0 && (
              <div className="relative" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  aria-expanded={isMoreOpen}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    selectedDropdownCount > 0
                      ? 'filter-btn-active font-medium scale-[1.02]'
                      : 'filter-btn-gradient font-normal hover:text-foreground'
                  }`}
                >
                  <span>
                    {selectedDropdownCount > 0
                      ? `+ More Roles (${selectedDropdownCount})`
                      : `+ More Roles (${dropdownRoles.length})`}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isMoreOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 sm:w-80 p-2.5 rounded-2xl bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/90 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-left feature-card-shadow"
                    >
                      {/* Search Bar Inside Dropdown */}
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search additional roles..."
                          value={roleSearchQuery}
                          onChange={(e) => setRoleSearchQuery(e.target.value)}
                          className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-background/80 hover:bg-background focus:bg-background border border-border/80 dark:border-border/50 text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
                          autoFocus
                        />
                      </div>

                      {/* Scrollable list of other roles */}
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                        {filteredDropdownRoles.map((roleName) => {
                          const isSelected = selectedInterests.includes(roleName);
                          return (
                            <button
                              key={roleName}
                              type="button"
                              onClick={() => toggleInterest(roleName)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-primary/15 text-primary dark:text-cyan-400 font-medium border border-primary/30'
                                  : 'hover:bg-muted text-foreground/80 hover:text-foreground font-normal'
                              }`}
                            >
                              <span className="truncate">{roleName}</span>
                              {isSelected ? (
                                <Check className="h-4 w-4 text-primary dark:text-cyan-400 shrink-0 ml-2" />
                              ) : (
                                <span className="h-4 w-4 rounded-md border border-border/80 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}

                        {filteredDropdownRoles.length === 0 && (
                          <div className="py-4 text-center text-xs text-muted-foreground font-light">
                            No additional roles matching &quot;{roleSearchQuery}&quot;
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* GitHub & Portfolio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="spec-github" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
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
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="spec-portfolio" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
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
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Resume File Upload or Cloud Link */}
        <div className="p-4.5 rounded-2xl bg-muted/20 dark:bg-slate-950/60 border border-border/70 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-medium text-foreground uppercase tracking-wider">
              Resume / CV <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setResumeMode('upload');
                  setErrorMessage(null);
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  resumeMode === 'upload'
                    ? 'bg-card text-foreground shadow-xs font-medium'
                    : 'text-muted-foreground hover:text-foreground font-normal'
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
                    ? 'bg-card text-foreground shadow-xs font-medium'
                    : 'text-muted-foreground hover:text-foreground font-normal'
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
                      <p className="text-xs font-medium text-foreground truncate">{stagedResume.file.name}</p>
                      <p className="text-[11px] text-muted-foreground font-light">
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
                      <span className="text-xs font-medium text-foreground">
                        Uploading & verifying document... ({uploadProgress}%)
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-primary" />
                      <span className="text-xs font-medium text-foreground">
                        Upload resume (PDF, DOCX up to 10MB)
                      </span>
                      <span className="text-[10.5px] text-muted-foreground font-light">
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
                onChange={(e) => {
                  setResumeUrl(e.target.value);
                  if (fieldErrors.resumeUrl || fieldErrors.resume) {
                    setFieldErrors((prev) => ({ ...prev, resumeUrl: undefined, resume: undefined }));
                  }
                }}
                onBlur={() => handleBlur('resumeUrl')}
                placeholder="https://drive.google.com/file/d/... or https://notion.so/resume"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 transition-all ${
                  fieldErrors.resumeUrl || fieldErrors.resume
                    ? 'border-destructive focus:ring-destructive/50'
                    : 'border-border/80 dark:border-border/40 focus:ring-primary'
                }`}
              />
            </div>
          )}
          {(fieldErrors.resume || fieldErrors.resumeUrl) && (
            <p className="text-[11px] text-destructive mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{fieldErrors.resume || fieldErrors.resumeUrl}</span>
            </p>
          )}
        </div>

        {/* Candidate Note / Elevator Pitch */}
        <div>
          <label htmlFor="spec-note" className="block text-xs font-medium text-foreground/90 uppercase tracking-wider mb-1.5">
            Technical Background & Elevator Pitch (Optional)
          </label>
          <textarea
            id="spec-note"
            rows={3}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="Tell us what technologies you build with, your favorite technical problem, or what role you aspire to create..."
            className="w-full p-3.5 rounded-xl bg-background/50 hover:bg-background/80 focus:bg-background border border-border/80 dark:border-border/40 text-foreground text-xs font-normal focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
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
            className="mt-1 h-4 w-4 rounded-md border-border text-primary focus:ring-primary cursor-pointer accent-primary shrink-0"
          />
          <label htmlFor="spec-privacy" className="text-[11px] text-muted-foreground leading-relaxed cursor-pointer select-none font-light">
            {ndaCheckboxLabel}
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-xs uppercase tracking-wider shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none disabled:bg-muted disabled:text-muted-foreground disabled:border disabled:border-border/60 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Transmitting Candidate Profile...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10.5px] text-muted-foreground font-medium">
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span>{slaNote}</span>
        </div>
      </form>
    </div>
  );
}
