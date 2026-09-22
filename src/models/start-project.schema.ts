import { z } from 'zod';
import { StartProjectType } from '@/models/types';

export const CANONICAL_PROJECT_TYPES: readonly StartProjectType[] = [
  'AI Solution',
  'Custom Software',
  'Web Application',
  'Mobile Application',
  'Cloud / DevOps',
  'UI/UX',
  'Business Automation',
  'Technology Consulting',
  'Not Sure',
] as const;

export const startProjectSchema = z.object({
  // Step 1
  projectType: z.enum(
    CANONICAL_PROJECT_TYPES as unknown as [StartProjectType, ...StartProjectType[]],
    { message: 'Please select a valid project discipline.' }
  ),

  // Step 2
  projectDescription: z
    .string()
    .min(15, 'Project description must be at least 15 characters long.')
    .max(5000, 'Project description cannot exceed 5000 characters.'),
  industry: z.string().min(2, 'Please specify your industry or domain.'),
  productType: z.string().min(2, 'Please indicate your product state.'),
  challenges: z.array(z.string()).default([]),

  // Step 3
  budgetRange: z.string().min(1, 'Please select an estimated budget range.'),
  timeline: z.string().min(1, 'Please select your target timeline.'),
  projectStage: z.string().min(1, 'Please select your current project stage.'),

  // Step 4
  name: z.string().min(2, 'Full name must be at least 2 characters long.').max(120),
  email: z.string().email('Please provide a valid business email address.').toLowerCase().trim(),
  company: z.string().min(2, 'Company or organization name must be at least 2 characters long.').max(150),
  phone: z.string().optional(),
  preferredContact: z.string().optional(),

  // Attribution & Origin Telemetry
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  serviceId: z.string().optional(),
  solutionId: z.string().optional(),
  industryId: z.string().optional(),

  // Anti-Spam & Duplicate Submission Guard Fields
  honeypot: z.string().optional(),
  clientTimestamp: z.number().optional(),
  idempotencyKey: z.string().optional(),
});
