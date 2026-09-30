import { z } from 'zod';
import {
  validateName,
  validateEmailSyntax,
  validatePhone,
  countWords,
} from './contact-rules';

export * from './contact-rules';

/**
 * Zod schema for Full Name validation.
 * Accepts English alphabetic letters A-Z and a-z, and single spaces between words.
 * Rejects numbers, symbols, emojis, HTML, punctuation, and leading/trailing/multiple spaces.
 */
export const nameFieldSchema = z
  .string()
  .min(1, { message: 'Full Name is required.' })
  .superRefine((val, ctx) => {
    const res = validateName(val);
    if (!res.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: res.error || 'Name can contain letters and spaces only.',
      });
    }
  });

/**
 * Zod schema for Email Address syntax and disposable domain validation.
 */
export const emailFieldSchema = z
  .string()
  .min(1, { message: 'Email Address is required.' })
  .superRefine((val, ctx) => {
    const res = validateEmailSyntax(val);
    if (!res.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: res.error || 'Please enter a valid email address.',
      });
    }
  });

/**
 * Zod schema for Phone Number validation.
 * Optional field: empty string or undefined is allowed.
 * When provided, verifies digits-only national number and region-specific digit counts (India strictly 10 digits).
 */
export const phoneFieldSchema = z
  .string()
  .optional()
  .superRefine((val, ctx) => {
    const res = validatePhone(val);
    if (!res.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: res.error || 'Please enter a valid phone number.',
      });
    }
  });

/**
 * Zod schema for Project Details / Message validation.
 * Strictly WORD-based: More than 20 words AND Less than 200 words (21 to 199 words).
 */
export const projectMessageFieldSchema = z
  .string()
  .min(1, { message: 'Project details are required.' })
  .superRefine((val, ctx) => {
    const words = countWords(val);
    if (words <= 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least 21 words about your project.',
      });
    } else if (words >= 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Project details must contain fewer than 200 words.',
      });
    }
  });

/**
 * Server-side validated schema for standard client project inquiries.
 */
export const standardContactSchema = z.object({
  name: nameFieldSchema,
  email: emailFieldSchema,
  phone: phoneFieldSchema,
  company: z.string().max(150, { message: 'Company name cannot exceed 150 characters.' }).optional(),
  service: z.string().min(1, { message: 'Please select a service.' }),
  message: projectMessageFieldSchema,
});

/**
 * Server-side validated schema for career and role applications.
 */
export const roleApplicationSchema = z
  .object({
    name: nameFieldSchema,
    email: emailFieldSchema,
    phone: phoneFieldSchema,
    company: z.string().max(150, { message: 'Company name cannot exceed 150 characters.' }).optional(),
    role: z.string().optional(),
    resumeName: z.string().optional(),
    resumeUrl: z.string().optional(),
    resumeData: z.string().optional(),
  })
  .refine((data) => data.resumeName || data.resumeUrl || data.resumeData, {
    message: 'Please provide your resume by uploading a file or entering a link.',
    path: ['resumeName'],
  });

/**
 * Unified client-side form schema supporting both Project Inquiry and Apply for Role.
 */
export const contactFormSchema = z
  .object({
    name: nameFieldSchema,
    email: emailFieldSchema,
    phone: phoneFieldSchema,
    company: z.string().max(150, { message: 'Company name cannot exceed 150 characters.' }).optional(),
    service: z.string().optional(),
    message: z.string().optional(),
    isApplying: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isApplying) {
      if (!data.service || data.service.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a service.',
          path: ['service'],
        });
      }
      if (!data.message || data.message.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Project details are required.',
          path: ['message'],
        });
      } else {
        const words = countWords(data.message);
        if (words <= 20) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please provide at least 21 words about your project.',
            path: ['message'],
          });
        } else if (words >= 200) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Project details must contain fewer than 200 words.',
            path: ['message'],
          });
        }
      }
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type StandardContactInput = z.infer<typeof standardContactSchema>;
