'use server';

/**
 * @file client/src/controllers/start-project.controller.ts
 * @description [CONTROLLER] Business logic, validation, anti-spam, and persistence for the Start a Project wizard.
 */

import { z } from 'zod';
import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import {
  StartProjectFormInput,
  StartProjectSubmissionResponse,
  ClientActionResponse,
} from '@/models/types';
import { startProjectSchema } from '@/models/start-project.schema';


// Cache recently submitted emails in-memory (window: 5 minutes) to protect against duplicate spam
const recentSubmissionsCache = new Map<
  string,
  { timestamp: number; referenceId: string; id: string; leadNumber: string }
>();

function cleanupSubmissionCache() {
  const now = Date.now();
  for (const [key, value] of recentSubmissionsCache.entries()) {
    if (now - value.timestamp > 5 * 60 * 1000) {
      recentSubmissionsCache.delete(key);
    }
  }
}

/**
 * Maps human-readable wizard project types to canonical service IDs.
 */
function mapProjectTypeToServiceId(type: string): string {
  switch (type) {
    case 'AI Solution':
      return 'ai-development';
    case 'Custom Software':
      return 'custom-software';
    case 'Web Application':
      return 'web-applications';
    case 'Mobile Application':
      return 'mobile-development';
    case 'Cloud / DevOps':
      return 'cloud-engineering';
    case 'UI/UX':
      return 'ui-ux-design';
    case 'Business Automation':
      return 'business-automation';
    case 'Technology Consulting':
      return 'technology-consulting';
    default:
      return 'custom-software';
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Generates sequential, memorable lead numbers e.g. AST-LEAD-1005
 * Safely computes the true maximum sequence to ensure zero unique constraint collisions.
 */
export async function generateLeadNumber(): Promise<string> {
  try {
    const leads = await db.cRMLead.findMany({
      where: { leadNumber: { startsWith: 'AST-LEAD-' } },
      select: { leadNumber: true },
    });

    let maxSeq = 1000;
    for (const item of leads) {
      if (item.leadNumber) {
        const match = item.leadNumber.match(/AST-LEAD-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    }

    return `AST-LEAD-${maxSeq + 1}`;
  } catch (err) {
    console.warn('[Lead Number Generator Fallback]:', err);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `AST-LEAD-${randomSuffix}`;
  }
}

/**
 * Formats multi-step form data into a structured dossier suitable for Admin Enquiries & CRM notes.
 */
function formatProjectBrief(
  data: z.infer<typeof startProjectSchema>,
  leadNumber: string,
  sourcePage: string
): string {
  return [
    `=== START A PROJECT BRIEF [${leadNumber}] ===`,
    `Attribution Source Page: ${sourcePage}`,
    data.utmSource ? `UTM Source: ${data.utmSource}` : '',
    data.utmMedium ? `UTM Medium: ${data.utmMedium}` : '',
    data.utmCampaign ? `UTM Campaign: ${data.utmCampaign}` : '',
    `Project Discipline: ${data.projectType}`,
    `Industry / Domain: ${data.industry}`,
    `Product Status: ${data.productType}`,
    `Target Stage: ${data.projectStage}`,
    `Budget Scope: ${data.budgetRange}`,
    `Target Timeline: ${data.timeline}`,
    `Preferred Contact Method: ${data.preferredContact || 'Email'}`,
    `Primary Challenges: ${data.challenges.length > 0 ? data.challenges.join(', ') : 'None specified'}`,
    '',
    `--- CONTACT DETAILS ---`,
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'Not provided'}`,
    '',
    `--- PROJECT SPECIFICATIONS & OBJECTIVES ---`,
    data.projectDescription.trim(),
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Server action to validate, verify anti-spam, and ingest prospective client project briefs.
 * Securely stores full lead details and attribution without exposing private records publicly.
 */
export async function submitStartProject(
  rawInput: StartProjectFormInput
): Promise<ClientActionResponse<StartProjectSubmissionResponse>> {
  try {
    cleanupSubmissionCache();

    // 1. Anti-Spam Check: Honeypot trap
    if (rawInput.honeypot && rawInput.honeypot.trim().length > 0) {
      console.warn('[Spam Detected]: Honeypot field filled by client.', rawInput.honeypot);
      const fakeLeadNumber = `AST-LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        data: {
          id: 'spm-' + Math.random().toString(36).substring(2, 9),
          leadNumber: fakeLeadNumber,
          referenceId: fakeLeadNumber,
          message: 'Your project brief has been received.',
          projectType: rawInput.projectType || 'Custom Software',
          submittedAt: new Date().toISOString(),
        },
        message: 'Your project brief has been received. Our architects will contact you within 24 hours.',
      };
    }

    // 2. Anti-Spam Check: Submission Velocity
    if (rawInput.clientTimestamp) {
      const elapsedMs = Date.now() - rawInput.clientTimestamp;
      if (elapsedMs < 2500) {
        console.warn('[Spam Velocity Warning]: Multi-step form submitted in < 2.5s.', elapsedMs);
        return {
          success: false,
          error: 'Submission was completed too quickly. Please review your inputs and submit organically.',
        };
      }
    }

    // 3. Schema Validation
    const validated = startProjectSchema.parse(rawInput);

    // 4. Duplicate Submission Check (Within 5-minute sliding window)
    const duplicateKey = `${validated.email}_${validated.projectType}`;
    const cached = recentSubmissionsCache.get(duplicateKey);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return {
        success: true,
        data: {
          id: cached.id,
          leadNumber: cached.leadNumber,
          referenceId: cached.referenceId,
          message: 'Your project brief was recently received and is already assigned to a senior solutions architect.',
          projectType: validated.projectType,
          submittedAt: new Date(cached.timestamp).toISOString(),
        },
        message: 'Your project brief has already been safely recorded. We will be in touch shortly!',
      };
    }

    // Resolve source page and attribution
    const sourcePage = validated.sourcePage?.trim() || '/start-project';
    const serviceId = validated.serviceId?.trim() || mapProjectTypeToServiceId(validated.projectType);
    const industryId = validated.industryId?.trim() || slugify(validated.industry);

    // Generate readable lead number
    const leadNumber = await generateLeadNumber();
    const formattedBrief = formatProjectBrief(validated, leadNumber, sourcePage);
    let submissionId = '';

    // 5. Database Ingestion: Primary Local PostgreSQL via Prisma
    if (!isSupabaseConfigured()) {
      // Ingest into CRMLead (primary lead lifecycle table)
      const lead = await db.cRMLead.create({
        data: {
          leadNumber,
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          company: validated.company,
          serviceId,
          solutionId: validated.solutionId || null,
          industryId,
          projectDescription: validated.projectDescription,
          budgetRange: validated.budgetRange,
          timeline: validated.timeline,
          sourcePage,
          utmSource: validated.utmSource || null,
          utmMedium: validated.utmMedium || null,
          utmCampaign: validated.utmCampaign || null,
          status: 'NEW', // Initial lifecycle stage
          source: 'WEBSITE_START_PROJECT',
          notes: formattedBrief,
        },
      });
      submissionId = lead.id;

      // Also create contact_submissions record for inquiry cross-referencing
      try {
        await db.contactSubmission.create({
          data: {
            name: validated.name,
            email: validated.email,
            phone: validated.phone || null,
            company: validated.company,
            service: `Project [${leadNumber}]: ${validated.projectType}`,
            message: formattedBrief,
            status: 'pending',
          },
        });
      } catch (subErr) {
        console.warn('[Contact Submission Sync Notice]:', subErr);
      }
    } else {
      // Supabase Cloud Fallback
      const supabase = await createSupabaseClient();
      const { data: leadData, error: leadError } = await (supabase as any)
        .from('crm_lead')
        .insert({
          lead_number: leadNumber,
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          company: validated.company,
          service_id: serviceId,
          solution_id: validated.solutionId || null,
          industry_id: industryId,
          project_description: validated.projectDescription,
          budget_range: validated.budgetRange,
          timeline: validated.timeline,
          source_page: sourcePage,
          utm_source: validated.utmSource || null,
          utm_medium: validated.utmMedium || null,
          utm_campaign: validated.utmCampaign || null,
          status: 'NEW',
          source: 'WEBSITE_START_PROJECT',
          notes: formattedBrief,
        })
        .select('id')
        .single();

      if (leadError) throw leadError;
      submissionId = leadData.id;

      // Sync with contact_submissions
      try {
        await supabase.from('contact_submissions').insert({
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          company: validated.company,
          service: `Project [${leadNumber}]: ${validated.projectType}`,
          message: formattedBrief,
          status: 'pending',
        });
      } catch (err) {
        console.warn('[Supabase Sync Warning]:', err);
      }
    }

    // Cache successful submission to prevent duplicates
    recentSubmissionsCache.set(duplicateKey, {
      timestamp: Date.now(),
      referenceId: leadNumber,
      leadNumber,
      id: submissionId,
    });

    // Return non-sensitive public receipt token only
    return {
      success: true,
      data: {
        id: submissionId,
        leadNumber,
        referenceId: leadNumber,
        message: 'Your project specifications have been securely transmitted to our engineering team.',
        projectType: validated.projectType,
        submittedAt: new Date().toISOString(),
      },
      message: 'Your project brief has been received. Our solutions architect will contact you within 24 hours.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation error in project submission.',
      };
    }

    console.error('[Start Project Controller Error]:', error);
    return {
      success: false,
      error: 'An error occurred while securing your project submission. Please try again or email info@astraivtechnologies.com.',
    };
  }
}
