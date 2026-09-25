import { describe, it, expect } from 'vitest';
import { submitStartProject } from '@/controllers/start-project.controller';
import { submitContactForm } from '@/controllers/contact.controller';

describe('Integration: Multi-Form Submissions & Processing Pipeline', () => {
  describe('Start a Project Wizard Flow', () => {
    it('successfully processes full 5-step project brief with attribution telemetry', async () => {
      const uniqueSuffix = Date.now().toString(36);
      const payload = {
        projectType: 'Web Application' as const,
        projectDescription: 'Building a next-generation healthcare compliance portal with HIPAA-compliant audit trails.',
        industry: 'Healthcare & HealthTech',
        productType: 'Brand New Product',
        challenges: ['Regulatory compliance', 'High concurrency'],
        budgetRange: '$50,000 - $100,000',
        timeline: '3 - 6 months',
        projectStage: 'Prototype Available',
        name: 'Dr. Gregory House',
        email: `greghouse_${uniqueSuffix}@princeton-plainsboro.org`,
        company: 'Princeton Diagnostics LLC',
        phone: '+1 555-0182',
        preferredContact: 'Email',
        sourcePage: '/services/web-applications',
        utmSource: 'google-ads',
        utmMedium: 'cpc',
        utmCampaign: 'enterprise-healthcare',
        clientTimestamp: Date.now() - 6000, // 6 seconds elapsed (organic submission)
      };

      const res = await submitStartProject(payload);

      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data?.leadNumber).toMatch(/^AST-LEAD-\d+/);
      expect(res.data?.projectType).toBe('Web Application');

      // Idempotency: immediately submitting same brief within 5 mins returns cached reference
      const duplicateRes = await submitStartProject(payload);
      expect(duplicateRes.success).toBe(true);
      expect(duplicateRes.data?.leadNumber).toBe(res.data?.leadNumber);
    });

    it('safely simulates success when honeypot is populated without creating production spam', async () => {
      const botPayload = {
        projectType: 'AI Solution' as const,
        projectDescription: 'Spam automated message for lead test.',
        industry: 'Fintech',
        productType: 'New',
        challenges: [],
        budgetRange: '$25,000',
        timeline: '1 month',
        projectStage: 'Idea',
        name: 'Spam Bot',
        email: 'spambot@darkweb.ru',
        company: 'Botnet Corp',
        honeypot: 'http://malicious-advertisement.ru',
        clientTimestamp: Date.now() - 5000,
      };

      const res = await submitStartProject(botPayload);

      // Must succeed so bot is deceived, but lead is flagged synthetic
      expect(res.success).toBe(true);
      expect(res.data?.leadNumber).toMatch(/^AST-LEAD-/);
    });

    it('rejects submissions completed in under 2.5 seconds (bot velocity)', async () => {
      const fastBotPayload = {
        projectType: 'Custom Software' as const,
        projectDescription: 'Instant programmatic form fill by script.',
        industry: 'Fintech',
        productType: 'New',
        challenges: [],
        budgetRange: '$25,000',
        timeline: '1 month',
        projectStage: 'Idea',
        name: 'Velocity Bot',
        email: 'velocity@bot.io',
        company: 'Fast Script Inc',
        clientTimestamp: Date.now() - 300, // 300ms elapsed
      };

      const res = await submitStartProject(fastBotPayload);

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/too quickly/i);
    });
  });

  describe('Contact & Career Application Form Flow', () => {
    it('processes client general inquiry and returns reference ID', async () => {
      const inquiry = {
        name: 'Elena Rostova',
        email: 'elena@rostova-energy.com',
        phone: '+44 20 7946 0991',
        company: 'Rostova Clean Energy',
        service: 'Cloud Engineering',
        message: 'Looking for Kubernetes multi-region architecture setup and Terraform automation.',
      };

      const res = await submitContactForm(inquiry);

      expect(res.success).toBe(true);
      expect(res.data?.id).toBeDefined();
      expect(res.message).toMatch(/solutions architect will contact you within 24 hours/i);
    });

    it('processes career role applicant and returns engineering review confirmation', async () => {
      const application = {
        name: 'David Chen',
        email: 'david.chen@distributed-systems.dev',
        phone: '+1 415-555-0133',
        company: 'Autonomous Robotics Inc',
        role: 'Senior Distributed Systems Architect',
        resumeUrl: 'https://github.com/david-chen/cv.pdf',
      };

      const res = await submitContactForm(application);

      expect(res.success).toBe(true);
      expect(res.data?.id).toBeDefined();
      expect(res.message).toMatch(/engineering leads will review your resume within 48 business hours/i);
    });
  });
});
