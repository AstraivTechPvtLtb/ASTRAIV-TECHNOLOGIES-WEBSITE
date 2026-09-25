import { describe, it, expect } from 'vitest';
import { startProjectSchema, CANONICAL_PROJECT_TYPES } from './start-project.schema';

describe('Start Project Schema Validation', () => {
  const validPayload = {
    projectType: 'AI Solution',
    projectDescription: 'We need an enterprise-grade autonomous customer service and intelligence pipeline.',
    industry: 'Fintech & Banking',
    productType: 'Brand New Product',
    challenges: ['Legacy integration', 'High security compliance'],
    budgetRange: '$25,000 - $50,000',
    timeline: '1 - 3 months',
    projectStage: 'Idea / Concept',
    name: 'Alexander Wright',
    email: 'alexander@astraiv-client.com',
    company: 'Fintech Dynamics Corp',
    phone: '+1 555-0199',
    preferredContact: 'Email',
  };

  describe('Project Type Discipline Validation', () => {
    it('accepts all canonical project types', () => {
      for (const pType of CANONICAL_PROJECT_TYPES) {
        const result = startProjectSchema.safeParse({
          ...validPayload,
          projectType: pType,
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects unrecognized or misspelled project types', () => {
      const result = startProjectSchema.safeParse({
        ...validPayload,
        projectType: 'Cryptocurrency Miner',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/valid project discipline/i);
      }
    });
  });

  describe('Project Scope & Description Boundaries', () => {
    it('rejects descriptions shorter than 15 characters', () => {
      const result = startProjectSchema.safeParse({
        ...validPayload,
        projectDescription: 'Too short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/at least 15 characters/i);
      }
    });

    it('accepts descriptions at boundary length (15 chars)', () => {
      const result = startProjectSchema.safeParse({
        ...validPayload,
        projectDescription: '123456789012345',
      });
      expect(result.success).toBe(true);
    });

    it('rejects descriptions exceeding 5000 characters', () => {
      const oversized = 'a'.repeat(5001);
      const result = startProjectSchema.safeParse({
        ...validPayload,
        projectDescription: oversized,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/cannot exceed 5000 characters/i);
      }
    });

    it('requires industry specification (min 2 chars)', () => {
      const result = startProjectSchema.safeParse({
        ...validPayload,
        industry: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('requires productType specification (min 2 chars)', () => {
      const result = startProjectSchema.safeParse({
        ...validPayload,
        productType: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Parameters & Timelines', () => {
    it('requires budgetRange, timeline, and projectStage to be non-empty', () => {
      expect(startProjectSchema.safeParse({ ...validPayload, budgetRange: '' }).success).toBe(false);
      expect(startProjectSchema.safeParse({ ...validPayload, timeline: '' }).success).toBe(false);
      expect(startProjectSchema.safeParse({ ...validPayload, projectStage: '' }).success).toBe(false);
    });
  });

  describe('Contact Details & Sanitization', () => {
    it('normalizes email to lowercase and trims surrounding whitespace', () => {
      const result = startProjectSchema.safeParse({
        ...validPayload,
        email: '  ALEXANDER@Astraiv-Client.COM  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('alexander@astraiv-client.com');
      }
    });

    it('rejects malformed email addresses', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingusername.com',
        'alexander@.com',
        'alexander@domain..com',
        'spaces in@email.com',
      ];
      for (const email of invalidEmails) {
        const result = startProjectSchema.safeParse({ ...validPayload, email });
        expect(result.success).toBe(false);
      }
    });

    it('requires contact name to be between 2 and 120 characters', () => {
      expect(startProjectSchema.safeParse({ ...validPayload, name: 'A' }).success).toBe(false);
      expect(startProjectSchema.safeParse({ ...validPayload, name: 'a'.repeat(121) }).success).toBe(false);
      expect(startProjectSchema.safeParse({ ...validPayload, name: 'Valid Name' }).success).toBe(true);
    });

    it('requires company name to be between 2 and 150 characters', () => {
      expect(startProjectSchema.safeParse({ ...validPayload, company: 'X' }).success).toBe(false);
      expect(startProjectSchema.safeParse({ ...validPayload, company: 'x'.repeat(151) }).success).toBe(false);
      expect(startProjectSchema.safeParse({ ...validPayload, company: 'Acme Corp' }).success).toBe(true);
    });
  });

  describe('Security & Telemetry Fields', () => {
    it('permits optional honeypot, timestamps, and attribution tags', () => {
      const telemetryPayload = {
        ...validPayload,
        honeypot: '',
        clientTimestamp: Date.now() - 5000,
        idempotencyKey: 'idemp-xyz-123',
        sourcePage: '/services/ai-development',
        utmSource: 'linkedin',
        utmMedium: 'cpc',
        utmCampaign: 'enterprise-q3',
        serviceId: 'ai-development',
      };
      const result = startProjectSchema.safeParse(telemetryPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.utmSource).toBe('linkedin');
        expect(result.data.serviceId).toBe('ai-development');
      }
    });
  });
});
