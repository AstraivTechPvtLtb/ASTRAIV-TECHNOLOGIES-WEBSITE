import { describe, it, expect } from 'vitest';
import { submitCandidateApplication } from './application.controller';

describe('Candidate Application Controller & Submission Engine', () => {
  it('silently simulates success when bot honeypot is populated without creating pollution', async () => {
    const result = await submitCandidateApplication({
      type: 'job',
      jobTitle: 'Senior Full-Stack Architect',
      applicantName: 'Spam Bot',
      email: 'bot@spamnetwork.com',
      location: 'Internet',
      experienceLevel: 'Experienced',
      resumeType: 'link',
      resumeUrl: 'https://drive.google.com/resume',
      privacyConsent: true,
      honeypot: 'filled_by_automated_bot',
    });

    expect(result.success).toBe(true);
    expect(result.referenceId).toMatch(/^AST-APP-/);
  });

  it('rejects candidate submission with missing or invalid name', async () => {
    const result = await submitCandidateApplication({
      type: 'job',
      jobTitle: 'Senior Full-Stack Architect',
      applicantName: '',
      email: 'alex@example.com',
      location: 'Bengaluru, India',
      experienceLevel: 'Experienced',
      resumeType: 'link',
      resumeUrl: 'https://drive.google.com/resume',
      privacyConsent: true,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('valid candidate name');
  });

  it('rejects candidate submission with invalid email format', async () => {
    const result = await submitCandidateApplication({
      type: 'job',
      jobTitle: 'Senior Full-Stack Architect',
      applicantName: 'Alex Morgan',
      email: 'not-an-email',
      location: 'Bengaluru, India',
      experienceLevel: 'Experienced',
      resumeType: 'link',
      resumeUrl: 'https://drive.google.com/resume',
      privacyConsent: true,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('valid email address');
  });

  it('rejects candidate submission with missing location / timezone', async () => {
    const result = await submitCandidateApplication({
      type: 'job',
      jobTitle: 'Senior Full-Stack Architect',
      applicantName: 'Alex Morgan',
      email: 'alex@example.com',
      location: '',
      experienceLevel: 'Experienced',
      resumeType: 'link',
      resumeUrl: 'https://drive.google.com/resume',
      privacyConsent: true,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('specify your location');
  });

  it('rejects candidate submission without privacy consent', async () => {
    const result = await submitCandidateApplication({
      type: 'job',
      jobTitle: 'Senior Full-Stack Architect',
      applicantName: 'Alex Morgan',
      email: 'alex@example.com',
      location: 'Bengaluru, India',
      experienceLevel: 'Experienced',
      resumeType: 'link',
      resumeUrl: 'https://drive.google.com/resume',
      privacyConsent: false,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('privacy policy');
  });

  it('processes a valid speculative candidate application with Fresher experience level and external link', async () => {
    const result = await submitCandidateApplication({
      type: 'speculative',
      jobTitle: 'Speculative Candidate',
      applicantName: 'Priya Sharma',
      email: 'priya.sharma@domain.com',
      phone: '+91 98765 43210',
      location: 'Kolkata, India (IST)',
      experienceLevel: 'Fresher',
      categoryInterests: ['AI & Automation', 'Engineering & Architecture'],
      githubUrl: 'https://github.com/priyasharma',
      portfolioUrl: 'https://priya.dev',
      resumeType: 'link',
      resumeUrl: 'https://drive.google.com/file/d/12345/view',
      candidateNote: 'Passionate about building autonomous agent swarms and distributed systems.',
      privacyConsent: true,
    });

    expect(result.success).toBe(true);
    expect(result.referenceId).toMatch(/^AST-APP-/);
  });
});
