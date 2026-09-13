'use server';

/**
 * @file client/src/controllers/contact.controller.ts
 * @description [CONTROLLER] Business logic and server actions for client contact form submissions and lead ingestion.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import { ContactFormInput, ClientActionResponse } from '@/models/types';
import { z } from 'zod';

import { promises as fs } from 'fs';
import path from 'path';

const standardContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

const roleApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  resumeName: z.string().optional(),
  resumeUrl: z.string().optional(),
  resumeData: z.string().optional(),
}).refine((data) => data.resumeName || data.resumeUrl || data.resumeData, {
  message: 'Please provide your resume by uploading a file or entering a link.',
  path: ['resumeName'],
});

/**
 * Handles submission of prospective client inquiries and job applications.
 */
export async function submitContactForm(
  formData: ContactFormInput
): Promise<ClientActionResponse<{ id: string }>> {
  try {
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

      // If a file was uploaded as base64, save to public/uploads/resumes/
      if (validated.resumeData && validated.resumeName) {
        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
          await fs.mkdir(uploadsDir, { recursive: true });

          const safeFilename = `${Date.now()}-${validated.resumeName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filePath = path.join(uploadsDir, safeFilename);

          const base64Data = validated.resumeData.replace(/^data:[^;]+;base64,/, '');
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
      validatedName = validated.name;
      validatedEmail = validated.email;
      validatedPhone = validated.phone;
      validatedCompany = validated.company;
      finalService = validated.service;
      finalMessage = validated.message;
    }

    // 1. Primary Local PostgreSQL via Prisma ORM
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

      return {
        success: true,
        data: { id: submission.id },
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
      .select('id')
      .single();

    if (error) throw error;

    return {
      success: true,
      data: { id: data.id },
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

