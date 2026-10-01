'use server';

/**
 * @file client/src/controllers/contact.controller.ts
 * @description [CONTROLLER] Business logic and server actions for client contact form submissions and lead ingestion.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import { ContactFormInput, ClientActionResponse } from '@/models/types';
import { z } from 'zod';
import {
  standardContactSchema,
  roleApplicationSchema,
  normalizeName,
  normalizeEmail,
} from '@/lib/validations/contact';
import { verifyEmailAddress } from '@/lib/services/email-verifier';

import { promises as fs } from 'fs';
import path from 'path';

export interface ContactSubmissionResult {
  id: string;
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  service?: string;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Handles submission of prospective client inquiries and job applications.
 */
export async function submitContactForm(
  formData: ContactFormInput
): Promise<ClientActionResponse<ContactSubmissionResult>> {
  try {
    // 1. Anti-Spam: Honeypot check
    if (formData.honeypot && formData.honeypot.trim().length > 0) {
      console.warn('[Spam Detected]: Contact form honeypot populated.');
      return {
        success: true,
        data: { id: 'spm-' + Math.random().toString(36).substring(2, 9) },
        message: 'Your inquiry has been received. Our solutions architect will contact you within 24 hours.',
      };
    }

    const isJobApplication = Boolean(formData.role || formData.resumeName || formData.resumeUrl || formData.resumeData);

    let finalService = formData.service || '';
    let finalMessage = formData.message || '';
    let validatedName = formData.name;
    let validatedEmail = formData.email;
    let validatedPhone = formData.phone;
    let validatedCompany = formData.company;

    if (isJobApplication) {
      const validated = roleApplicationSchema.parse(formData);
      validatedName = validated.name;
      validatedEmail = validated.email;
      validatedPhone = validated.phone;
      validatedCompany = validated.company;

      const roleTitle = validated.role || 'Engineering Opportunity';
      finalService = `Job Application: ${roleTitle}`;

      let resumeLink = validated.resumeUrl || '';

      // If a file was uploaded as base64, strictly validate format, size, and sanitize filename
      if (validated.resumeData && validated.resumeName) {
        const ext = path.extname(validated.resumeName).toLowerCase();
        const allowedExtensions = ['.pdf', '.doc', '.docx'];

        if (!allowedExtensions.includes(ext)) {
          return {
            success: false,
            error: 'Invalid file format. Only PDF, DOC, and DOCX resume attachments are permitted.',
          };
        }

        const base64Data = validated.resumeData.replace(/^data:[^;]+;base64,/, '');
        // Approximate size check: 5MB maximum
        if (base64Data.length > 5 * 1024 * 1024 * 1.37) {
          return {
            success: false,
            error: 'Resume attachment exceeds the 5MB size limit.',
          };
        }

        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
          await fs.mkdir(uploadsDir, { recursive: true });

          const baseName = path.basename(validated.resumeName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
          const safeFilename = `${Date.now()}-${baseName}${ext}`;
          const filePath = path.join(uploadsDir, safeFilename);

          await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));

          resumeLink = `/uploads/resumes/${safeFilename}`;
        } catch (fileErr) {
          console.error('[Resume Save Warning]:', fileErr);
          // Fallback: keep resumeName if local disk write encounters permission issue
        }
      }

      finalMessage = [
        `=== JOB APPLICATION ===`,
        `Role Applied: ${roleTitle}`,
        validated.resumeName ? `Resume File: ${validated.resumeName}` : null,
        resumeLink ? `Resume Link: ${resumeLink}` : null,
        validated.company ? `Current/Previous Company: ${validated.company}` : null,
        validated.phone ? `Contact Phone: ${validated.phone}` : null,
      ]
        .filter(Boolean)
        .join('\n');
    } else {
      const validated = standardContactSchema.parse(formData);
      validatedName = normalizeName(validated.name);
      validatedEmail = normalizeEmail(validated.email);
      validatedPhone = validated.phone;
      validatedCompany = validated.company;
      finalService = 'Contact Us';

      const serviceLabelMap: Record<string, string> = {
        'ai-solutions': 'AI Solutions & Autonomous Agents',
        'web-applications': 'Web Applications & SaaS Platforms',
        'custom-software': 'Custom Software Development',
        'cloud-solutions': 'Cloud Solutions & Infrastructure',
        'website-development': 'Corporate Website Development',
        'mobile-apps': 'Mobile Applications (iOS & Android)',
        'ui-ux-design': 'UI/UX Design & Design Systems',
        'devops-ci-cd': 'DevOps, CI/CD & Kubernetes',
        'business-automation': 'Business Process Automation',
        'enterprise-software': 'Enterprise Software & Microservices',
        'digital-transformation': 'Digital Transformation & Modernization',
        'it-consulting': 'IT Consulting & Architecture Audits',
        'general-inquiry': 'Other / Custom Engineering Project',
      };

      const requestedTopic = serviceLabelMap[validated.service] || validated.service;
      if (requestedTopic && requestedTopic !== 'Contact Us') {
        finalMessage = `Requested Service: ${requestedTopic}\n\n${validated.message}`;
      } else {
        finalMessage = validated.message;
      }
    }

    // 2. Server-side Email Deliverability & Verification check
    const emailVerification = await verifyEmailAddress(validatedEmail);
    if (!emailVerification.isValid) {
      return {
        success: false,
        error: emailVerification.error || 'Please enter a valid and deliverable email address.',
      };
    }

    // 3. Primary Local PostgreSQL via Prisma ORM
    if (!isSupabaseConfigured()) {
      const submission = await db.contactSubmission.create({
        data: {
          name: validatedName,
          email: validatedEmail,
          phone: validatedPhone || null,
          company: validatedCompany || null,
          service: finalService,
          message: finalMessage,
          status: 'pending',
        },
      });

      const enquiryData = {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        company: submission.company,
        service: submission.service,
        message: submission.message,
        status: submission.status,
        created_at: submission.createdAt.toISOString(),
        updated_at: submission.updatedAt.toISOString(),
      };

      // Real-Time Socket Broadcast to Admin Portal
      try {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4001';
        fetch(`${socketUrl}/api/broadcast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_enquiry',
            data: enquiryData,
          }),
        }).catch((broadcastErr) => {
          console.warn('[Socket Broadcast Warning]:', (broadcastErr as Error)?.message || broadcastErr);
        });
      } catch {
        // non-blocking
      }

      return {
        success: true,
        data: enquiryData,
        message: isJobApplication
          ? 'Your application has been received. Our engineering leads will review your resume within 48 business hours.'
          : 'Your inquiry has been received. Our solutions architect will contact you within 24 hours.',
      };
    }

    // 2. Supabase Cloud Fallback
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: validatedName,
        email: validatedEmail,
        phone: validatedPhone || null,
        company: validatedCompany || null,
        service: finalService,
        message: finalMessage,
        status: 'pending',
      })
      .select('id, name, email, phone, company, service, message, status, created_at, updated_at')
      .single();

    if (error) throw error;

    const enquiryData = {
      id: data.id,
      name: data.name || validatedName,
      email: data.email || validatedEmail,
      phone: data.phone || validatedPhone || null,
      company: data.company || validatedCompany || null,
      service: data.service || finalService,
      message: data.message || finalMessage,
      status: data.status || 'pending',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };

    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4001';
      fetch(`${socketUrl}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_enquiry',
          data: enquiryData,
        }),
      }).catch((broadcastErr) => {
        console.warn('[Socket Broadcast Warning]:', (broadcastErr as Error)?.message || broadcastErr);
      });
    } catch {
      // non-blocking
    }

    return {
      success: true,
      data: enquiryData,
      message: isJobApplication
        ? 'Your application has been received. Our engineering leads will review your resume within 48 business hours.'
        : 'Your inquiry has been received. Our solutions architect will contact you within 24 hours.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation error',
      };
    }

    console.error('[Contact Form Controller Error]:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while transmitting your request. Please try again or email us directly.',
    };
  }
}

/**
 * Backward compatibility alias for submitContactForm.
 */
export async function submitContactEnquiry(data: Parameters<typeof submitContactForm>[0]) {
  return submitContactForm(data);
}

