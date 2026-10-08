'use server';

/**
 * @file client/src/controllers/application.controller.ts
 * @description [CONTROLLER] Unified candidate application ingestion engine for job-specific and speculative applications.
 */

import { db } from '@/models/db';
import { getStorageProvider } from '@/lib/storage';
import { Prisma } from '@prisma/client';

export interface SubmitApplicationPayload {
  type: 'job' | 'speculative';
  jobId?: string | null;
  jobSlug?: string | null;
  jobTitle?: string | null;
  applicantName: string;
  email: string;
  phone?: string | null;
  location: string;
  experienceLevel: 'Fresher' | 'Experienced' | 'Both' | string;
  experienceYears?: string | null;
  categoryInterests?: string[];
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  linkedinUrl?: string | null;
  resumeType: 'upload' | 'link';
  stagingKey?: string | null;
  finalKey?: string | null;
  sessionToken?: string | null;
  originalFilename?: string | null;
  declaredMimeType?: string | null;
  resumeUrl?: string | null;
  candidateNote?: string | null;
  privacyConsent: boolean;
  honeypot?: string;
}

export interface ApplicationSubmissionResult {
  success: boolean;
  referenceId?: string;
  error?: string;
}

function generateApplicationNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AST-APP-${rand}`;
}

/**
 * Submits a candidate application to the Astraiv recruitment engine.
 */
export async function submitCandidateApplication(
  payload: SubmitApplicationPayload
): Promise<ApplicationSubmissionResult> {
  try {
    // 1. Anti-bot honeypot trap
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      // Silently return fake success to prevent bot retry loops
      return { success: true, referenceId: generateApplicationNumber() };
    }

    // 2. Validate essential identity fields
    const name = payload.applicantName.trim();
    const email = payload.email.trim().toLowerCase();
    const location = payload.location.trim();

    if (!name || name.length < 2) {
      return { success: false, error: 'Please enter a valid candidate name.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!location) {
      return { success: false, error: 'Please specify your location or primary timezone.' };
    }

    if (!payload.privacyConsent) {
      return { success: false, error: 'Please acknowledge the privacy policy to submit your application.' };
    }

    // 3. Resolve Job Opening if job-specific
    let resolvedJobId: string | null = null;
    let resolvedJobTitle = payload.jobTitle || 'General Engineering Candidate';

    if (payload.type === 'job') {
      if (payload.jobId) {
        const job = await db.jobOpening.findUnique({ where: { id: payload.jobId } });
        if (job) {
          if (!job.active) {
            return { success: false, error: 'This job opening is currently closed for new applications.' };
          }
          resolvedJobId = job.id;
          resolvedJobTitle = job.title;
        }
      } else if (payload.jobSlug) {
        const job = await db.jobOpening.findUnique({ where: { slug: payload.jobSlug } });
        if (job) {
          if (!job.active) {
            return { success: false, error: 'This job opening is currently closed for new applications.' };
          }
          resolvedJobId = job.id;
          resolvedJobTitle = job.title;
        }
      }
    } else {
      resolvedJobTitle = payload.jobTitle || 'Speculative Application';
    }

    // 4. Validate Resume: File upload vs External link
    let resumeStorageProvider: string | null = null;
    let resumeStorageKey: string | null = null;
    let resumeOriginalName: string | null = null;
    let resumeMimeType: string | null = null;
    let resumeSizeBytes: number | null = null;
    let resumeUrl: string | null = null;

    if (payload.resumeType === 'upload') {
      if (!payload.stagingKey || !payload.finalKey || !payload.sessionToken) {
        return { success: false, error: 'Resume upload session details are missing. Please re-upload your document.' };
      }

      const storageProvider = getStorageProvider();
      const verifyResult = await storageProvider.verifyAndPromoteObject({
        stagingKey: payload.stagingKey,
        finalKey: payload.finalKey,
        expectedMime: payload.declaredMimeType || 'application/pdf',
        sessionToken: payload.sessionToken,
      });

      if (!verifyResult.verified) {
        return {
          success: false,
          error: verifyResult.error || 'Failed to verify resume document structure. Only valid PDF and DOCX documents are accepted.',
        };
      }

      resumeStorageProvider = storageProvider.providerName;
      resumeStorageKey = payload.finalKey;
      resumeOriginalName = payload.originalFilename || 'resume.pdf';
      resumeMimeType = verifyResult.verifiedMime;
      resumeSizeBytes = verifyResult.actualSizeBytes;
    } else {
      // External link validation
      if (!payload.resumeUrl || !payload.resumeUrl.trim()) {
        return { success: false, error: 'Please provide a valid resume link (Google Drive, Notion, or LinkedIn).' };
      }

      const rawUrl = payload.resumeUrl.trim();
      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        return { success: false, error: 'Resume link must start with https://' };
      }
      resumeUrl = rawUrl;
    }

    // 5. Generate authoritative application number
    const applicationNumber = generateApplicationNumber();

    // 6. Write record to PostgreSQL job_applications table
    try {
      await db.jobApplication.create({
        data: {
          applicationNumber,
          type: payload.type || 'job_specific',
          jobOpeningId: resolvedJobId || null,
          roleTitle: resolvedJobTitle || 'Engineering Candidate',
          department: payload.categoryInterests?.[0] || 'Engineering',
          candidateName: name,
          email,
          phone: payload.phone?.trim() || null,
          countryCode: payload.phone?.startsWith('+') ? payload.phone.split(' ')[0] : null,
          location,
          experienceLevel: (payload.experienceLevel || 'experienced').toLowerCase(),
          experienceYears: payload.experienceYears != null && !isNaN(Number(payload.experienceYears)) ? Number(payload.experienceYears) : null,
          githubUrl: payload.githubUrl?.trim() || null,
          portfolioUrl: payload.portfolioUrl?.trim() || null,
          linkedinUrl: payload.linkedinUrl?.trim() || null,
          coverNote: payload.candidateNote?.trim() || null,
          resumeType: payload.resumeType || 'upload',
          resumeUrl,
          resumeStorageKey,
          resumeStorageProvider: resumeStorageProvider || 'r2',
          resumeOriginalName,
          resumeMimeType,
          resumeSizeBytes,
          resumeValidationStatus: 'verified',
          status: 'pending',
        },
      });
    } catch {
      // Direct raw query fallback if Prisma Client instance in long-running dev server hasn't reloaded
      await db.$executeRaw`
        INSERT INTO job_applications (
          application_number,
          type,
          job_opening_id,
          role_title,
          department,
          candidate_name,
          email,
          phone,
          location,
          experience_level,
          experience_years,
          github_url,
          portfolio_url,
          linkedin_url,
          cover_note,
          resume_type,
          resume_url,
          resume_storage_key,
          resume_storage_provider,
          resume_original_name,
          resume_mime_type,
          resume_size_bytes,
          resume_validation_status,
          status,
          created_at,
          updated_at
        ) VALUES (
          ${applicationNumber},
          ${payload.type || 'job_specific'},
          ${resolvedJobId || null},
          ${resolvedJobTitle || 'Engineering Candidate'},
          ${payload.categoryInterests?.[0] || 'Engineering'},
          ${name},
          ${email},
          ${payload.phone?.trim() || null},
          ${location},
          ${(payload.experienceLevel || 'experienced').toLowerCase()},
          ${payload.experienceYears || null},
          ${payload.githubUrl?.trim() || null},
          ${payload.portfolioUrl?.trim() || null},
          ${payload.linkedinUrl?.trim() || null},
          ${payload.candidateNote?.trim() || null},
          ${payload.resumeType || 'upload'},
          ${resumeUrl},
          ${resumeStorageKey},
          ${resumeStorageProvider || 'r2'},
          ${resumeOriginalName},
          ${resumeMimeType},
          ${resumeSizeBytes},
          'verified',
          'pending',
          NOW(),
          NOW()
        )
      `;
    }

    return {
      success: true,
      referenceId: applicationNumber,
    };
  } catch (err) {
    console.error('[Submit Candidate Application Error]:', err);
    return {
      success: false,
      error: 'An unexpected error occurred while saving your application. Please try again.',
    };
  }
}
