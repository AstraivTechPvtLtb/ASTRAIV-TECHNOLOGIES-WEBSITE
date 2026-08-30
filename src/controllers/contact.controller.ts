'use server';

/**
 * @file client/src/controllers/contact.controller.ts
 * @description [CONTROLLER] Business logic and server actions for client contact form submissions and lead ingestion.
 */

import { db } from '@/models/db';
import { isSupabaseConfigured, createClient as createSupabaseClient } from '@/lib/supabase/server';
import { ContactFormInput, ClientActionResponse } from '@/models/types';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

/**
 * Handles submission of prospective client inquiries.
 */
export async function submitContactForm(
  formData: ContactFormInput
): Promise<ClientActionResponse<{ id: string }>> {
  try {
    const validated = contactSchema.parse(formData);

    // 1. Primary Local PostgreSQL via Prisma ORM
    if (!isSupabaseConfigured()) {
      const submission = await db.contactSubmission.create({
        data: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          company: validated.company || null,
          service: validated.service,
          message: validated.message,
          status: 'pending',
        },
      });

      return {
        success: true,
        data: { id: submission.id },
        message: 'Your inquiry has been received. Our solutions architect will contact you within 24 hours.',
      };
    }

    // 2. Supabase Cloud Fallback
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        company: validated.company || null,
        service: validated.service,
        message: validated.message,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) throw error;

    return {
      success: true,
      data: { id: data.id },
      message: 'Your inquiry has been received. Our solutions architect will contact you within 24 hours.',
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
export const submitContactEnquiry = submitContactForm;

