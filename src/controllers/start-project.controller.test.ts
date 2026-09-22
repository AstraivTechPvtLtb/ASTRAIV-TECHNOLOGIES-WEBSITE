import { describe, it, expect } from 'vitest';
import { submitStartProject } from './start-project.controller';
import {
  CANONICAL_PROJECT_TYPES,
  startProjectSchema,
} from '@/models/start-project.schema';
import { StartProjectFormInput } from '@/models/types';

describe('Start a Project Controller & Validation Layer', () => {
  const validFormData: StartProjectFormInput = {
    projectType: 'AI Solution',
    projectDescription: 'We are engineering an autonomous RAG workflow and multi-agent knowledge base.',
    industry: 'Fintech & Banking',
    productType: 'Brand New Product',
    challenges: ['AI / LLM agent integration needed', 'Fast time-to-market required'],
    budgetRange: '$25,000 - $50,000',
    timeline: '1 - 3 months',
    projectStage: 'Idea / Concept',
    name: 'Sarah Connor',
    email: 'sarah@skynet-defense.com',
    company: 'Cyberdyne Systems',
    phone: '+1 555-0199',
    preferredContact: 'Email',
    honeypot: '',
    clientTimestamp: Date.now() - 10000, // 10s ago (normal human)
  };

  it('contains all 9 canonical project types required by specifications', () => {
    expect(CANONICAL_PROJECT_TYPES).toEqual([
      'AI Solution',
      'Custom Software',
      'Web Application',
      'Mobile Application',
      'Cloud / DevOps',
      'UI/UX',
      'Business Automation',
      'Technology Consulting',
      'Not Sure',
    ]);
  });

  describe('startProjectSchema validation', () => {
    it('successfully parses valid input', () => {
      const parsed = startProjectSchema.parse(validFormData);
      expect(parsed.projectType).toBe('AI Solution');
      expect(parsed.email).toBe('sarah@skynet-defense.com');
      expect(parsed.name).toBe('Sarah Connor');
    });

    it('rejects invalid project type', () => {
      expect(() => {
        startProjectSchema.parse({
          ...validFormData,
          projectType: 'Quantum Teleportation' as any,
        });
      }).toThrow();
    });

    it('rejects description shorter than 15 characters', () => {
      expect(() => {
        startProjectSchema.parse({
          ...validFormData,
          projectDescription: 'Too short',
        });
      }).toThrow('Project description must be at least 15 characters long.');
    });

    it('rejects invalid email formats', () => {
      expect(() => {
        startProjectSchema.parse({
          ...validFormData,
          email: 'not-an-email',
        });
      }).toThrow('Please provide a valid business email address.');
    });

    it('rejects empty company name', () => {
      expect(() => {
        startProjectSchema.parse({
          ...validFormData,
          company: '',
        });
      }).toThrow();
    });

    it('accepts and preserves sourcePage and UTM attribution fields', () => {
      const parsed = startProjectSchema.parse({
        ...validFormData,
        sourcePage: '/services/ai-development',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'enterprise_ai_2026',
        serviceId: 'ai-development',
        industryId: 'fintech-banking',
      });
      expect(parsed.sourcePage).toBe('/services/ai-development');
      expect(parsed.utmSource).toBe('google');
      expect(parsed.utmCampaign).toBe('enterprise_ai_2026');
      expect(parsed.serviceId).toBe('ai-development');
    });
  });

  describe('Anti-Spam Heuristics', () => {
    it('silently rejects bot submission when honeypot is populated', async () => {
      const botPayload: StartProjectFormInput = {
        ...validFormData,
        honeypot: 'http://spam-link.ru',
      };

      const result = await submitStartProject(botPayload);
      expect(result.success).toBe(true);
      expect(result.data?.id).toContain('spm-');
    });

    it('rejects automated fast bot submission completed under 2.5 seconds', async () => {
      const fastBotPayload: StartProjectFormInput = {
        ...validFormData,
        clientTimestamp: Date.now() - 500, // Only 500ms elapsed
      };

      const result = await submitStartProject(fastBotPayload);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Submission was completed too quickly');
    });
  });

  describe('Lead Number & Attribution Ingestion', () => {
    it('successfully processes valid project brief with source_page attribution and returns safe public receipt', async () => {
      const uniqueEmail = `test-${Date.now()}@astraivtechnologies.com`;
      const submissionPayload: StartProjectFormInput = {
        ...validFormData,
        email: uniqueEmail,
        sourcePage: '/services/ai-development',
        utmSource: 'linkedin',
        utmMedium: 'paid',
        utmCampaign: 'ai_q3',
        clientTimestamp: Date.now() - 15000,
      };

      const result = await submitStartProject(submissionPayload);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.leadNumber).toMatch(/^AST-LEAD-\d+$/);
      expect(result.data?.referenceId).toMatch(/^AST-LEAD-\d+$/);

      // Verify privacy guard: ensure no internal notes or sensitive data are leaked in response
      const responseKeys = Object.keys(result.data || {});
      expect(responseKeys).not.toContain('notes');
      expect(responseKeys).not.toContain('assignedTo');
      expect(responseKeys).not.toContain('db');
    });
  });
});
