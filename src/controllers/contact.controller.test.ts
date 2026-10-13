import { describe, it, expect } from 'vitest';
import { submitContactForm } from './contact.controller';

describe('Contact Form Controller & Validation', () => {
  describe('Standard Client Inquiries', () => {
    it('accepts and processes a valid general prospective client enquiry', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        phone: '+91 98765 43210',
        company: 'Wall Street Innovations',
        service: 'Custom Software Development',
        message:
          'We require a real-time portfolio management microservices backend with automated compliance logging, event-driven streaming pipelines, and secure enterprise single sign-on integration for our multi-tenant users.',
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBeDefined();
      expect(res.data?.service).toBe('Contact Us');
      expect(res.message).toMatch(/Our solutions architect will contact you within 24 hours/i);
    });

    it('rejects submissions with invalid name containing numbers or symbols', async () => {
      const res = await submitContactForm({
        name: 'Jordan123',
        email: 'jordan@investments-enterprise.com',
        service: 'Custom Software Development',
        message:
          'We require a real-time portfolio management microservices backend with automated compliance logging, event-driven streaming pipelines, and secure enterprise single sign-on integration.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Name can contain letters and spaces only/i);
    });

    it('rejects submissions with name exceeding 30 characters', async () => {
      const res = await submitContactForm({
        name: 'Christopher Alexander Washington', // 32 characters
        email: 'jordan@investments-enterprise.com',
        service: 'Custom Software Development',
        message:
          'We require a real-time portfolio management microservices backend with automated compliance logging, event-driven streaming pipelines, and secure enterprise single sign-on integration.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/cannot exceed 30 characters/i);
    });

    it('rejects submissions with invalid email format', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'not-a-valid-email',
        service: 'Custom Software Development',
        message:
          'We require a real-time portfolio management microservices backend with automated compliance logging, event-driven streaming pipelines, and secure enterprise single sign-on integration.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/valid email/i);
    });

    it('rejects submissions with invalid phone number (e.g. India 9 digits)', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        phone: '+91 98765 4321', // 9 digits
        service: 'Custom Software Development',
        message:
          'We require a real-time portfolio management microservices backend with automated compliance logging, event-driven streaming pipelines, and secure enterprise single sign-on integration.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/10 digits/i);
    });

    it('rejects submissions with message shorter than 21 words', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        service: 'AI Solutions',
        message: 'This message contains only eight words right here.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/at least 21 words/i);
    });

    it('rejects submissions with message containing 200 words or more', async () => {
      const words200 = Array.from({ length: 200 }, (_, i) => `word${i + 1}`).join(' ');
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        service: 'AI Solutions',
        message: words200,
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/fewer than 200 words/i);
    });

    it('rejects submissions without a chosen service', async () => {
      const res = await submitContactForm({
        name: 'Jordan Belfort',
        email: 'jordan@investments-enterprise.com',
        service: '',
        message:
          'We require a real-time portfolio management microservices backend with automated compliance logging, event-driven streaming pipelines, and secure enterprise single sign-on integration.',
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Please select a service/i);
    });
  });

  describe('Careers & Job Application Submissions', () => {
    it('processes a job application containing role and resume link', async () => {
      const res = await submitContactForm({
        name: 'Evelyn Reed',
        email: 'evelyn.reed@ai-research.org',
        company: 'Stanford AI Lab',
        phone: '+1 (555) 012-3456',
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

    it('processes a valid base64 PDF resume upload via StorageProvider with safe key', async () => {
      const validPdfBuffer = Buffer.concat([
        Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF'),
        Buffer.alloc(512),
      ]);
      const base64Data = validPdfBuffer.toString('base64');

      const res = await submitContactForm({
        name: 'Elena Rostova',
        email: 'elena.rostova@ai-quantum.org',
        company: 'CERN Computing',
        role: 'Quantum ML Scientist',
        resumeName: 'Elena_Rostova_CV.pdf',
        resumeData: `data:application/pdf;base64,${base64Data}`,
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBeDefined();
      expect(res.data?.message).toMatch(/Resume Link: resumes\/\d{4}-\d{2}-\d{2}\/[a-f0-9]{32}\.pdf/);
      // Ensure no public URL is exposed
      expect(res.data?.message).not.toContain('http://');
      expect(res.data?.message).not.toContain('https://');
      expect(res.data?.message).not.toContain('.data/resumes');
    });

    it('rejects base64 resume upload with fraudulent MIME or corrupted magic bytes', async () => {
      // Fake PDF with invalid magic bytes (MZ header / executable)
      const fakePdfBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00FakePEHeaderHere');
      const base64Data = fakePdfBuffer.toString('base64');

      const res = await submitContactForm({
        name: 'Malicious Attacker',
        email: 'attacker@exploit-research.net',
        role: 'Penetration Tester',
        resumeName: 'payload.pdf',
        resumeData: `data:application/pdf;base64,${base64Data}`,
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Only valid PDF and DOCX/i);
    });


    it('rejects base64 resume upload exceeding 10MB size limit', async () => {
      // Over 10MB payload (10.5MB base64 string)
      const oversizedBase64 = 'A'.repeat(10.5 * 1024 * 1024 * 1.37 + 100);

      const res = await submitContactForm({
        name: 'Heavy Candidate',
        email: 'heavy@largefiles.org',
        role: 'Senior Architect',
        resumeName: 'huge_portfolio.pdf',
        resumeData: `data:application/pdf;base64,${oversizedBase64}`,
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/exceeds the 10MB size limit/i);
    });
  });
});

