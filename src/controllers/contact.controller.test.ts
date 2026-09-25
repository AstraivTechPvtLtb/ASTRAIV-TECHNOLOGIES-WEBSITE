import { describe, it, expect } from 'vitest';
import { submitContactForm } from './contact.controller';

describe('Contact Form Controller & Validation', () => {
  describe('Standard Client Inquiries', () => {
    it('accepts and processes a valid general prospective client enquiry', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        phone: '+1 555-0144',
        company: 'Wall Street Innovations',
        service: 'Custom Software Development',
        message: 'We require a real-time portfolio management microservices backend.',
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBeDefined();
      expect(res.message).toMatch(/Our solutions architect will contact you within 24 hours/i);
    });

    it('rejects submissions with invalid email format', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'not-a-valid-email',
        service: 'Custom Software Development',
        message: 'We require a real-time portfolio management backend.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/valid email/i);
    });

    it('rejects submissions with message shorter than 10 characters', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        service: 'AI Solutions',
        message: 'Help me',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/at least 10 characters/i);
    });

    it('rejects submissions without a chosen service', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        service: '',
        message: 'We have a detailed RFP ready for your team.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Please select a service/i);
    });
  });

  describe('Careers & Job Application Submissions', () => {
    it('processes a job application containing role and resume link', async () => {
      const res = await submitContactForm({
        name: 'Dr. Evelyn Reed',
        email: 'evelyn.reed@ai-research.org',
        company: 'Stanford AI Lab',
        phone: '+1 555-9876',
        role: 'Lead AI Engineer',
        resumeUrl: 'https://linkedin.com/in/evelyn-reed',
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBeDefined();
      expect(res.message).toMatch(/Our engineering leads will review your resume within 48 business hours/i);
    });

    it('processes a job application containing an attached resume filename', async () => {
      const res = await submitContactForm({
        name: 'Marcus Brody',
        email: 'marcus.brody@devops-lead.com',
        company: 'Global Cloud Systems',
        role: 'Staff DevOps Architect',
        resumeName: 'Marcus_Brody_Principal_Architect_CV.pdf',
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBeDefined();
    });

    it('rejects job application if resume is completely omitted', async () => {
      const res = await submitContactForm({
        name: 'Anonymous Candidate',
        email: 'candidate@domain.com',
        role: 'Full Stack Engineer',
        // No resumeName, resumeUrl, or resumeData
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Please provide your resume by uploading a file or entering a link/i);
    });
  });
});
