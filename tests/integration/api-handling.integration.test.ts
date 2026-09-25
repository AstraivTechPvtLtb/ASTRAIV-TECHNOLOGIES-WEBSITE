import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as startProjectHandler } from '@/app/api/start-project/route';
import { GET as reviewsGetHandler } from '@/app/api/reviews/route';

describe('Integration: API Route Handlers', () => {
  describe('POST /api/start-project', () => {
    it('returns status 200 and lead reference when valid payload is submitted', async () => {
      const validPayload = {
        projectType: 'Cloud / DevOps',
        projectDescription: 'Architecting a multi-region resilient Kubernetes deployment on AWS with Terraform.',
        industry: 'Fintech & Banking',
        productType: 'Brand New Product',
        challenges: ['High availability', 'Disaster recovery'],
        budgetRange: '$50,000 - $100,000',
        timeline: '3 - 6 months',
        projectStage: 'Prototype Available',
        name: 'Rachel Zane',
        email: 'rachel.zane@cloud-ventures.com',
        company: 'Zane Enterprise Systems',
        phone: '+1 555-0199',
        clientTimestamp: Date.now() - 5000,
      };

      const req = new NextRequest('http://localhost:3000/api/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      const res = await startProjectHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data?.leadNumber).toMatch(/^AST-LEAD-/);
    });

    it('returns status 400 when missing required fields or failing validation', async () => {
      const invalidPayload = {
        projectType: 'NotARealDiscipline',
        projectDescription: 'Short',
        name: '',
      };

      const req = new NextRequest('http://localhost:3000/api/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      const res = await startProjectHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toBeDefined();
    });

    it('returns status 200 with safe synthetic lead when honeypot trap is triggered', async () => {
      const spamPayload = {
        projectType: 'AI Solution',
        projectDescription: 'Spam text message filled by automated crawler.',
        industry: 'Fintech',
        productType: 'Brand New Product',
        challenges: [],
        budgetRange: '$25,000',
        timeline: '1 month',
        projectStage: 'Idea',
        name: 'Bot Crawler',
        email: 'bot@crawler.ru',
        company: 'Botnet Inc',
        honeypot: 'http://malicious-spam-url.ru',
      };

      const req = new NextRequest('http://localhost:3000/api/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spamPayload),
      });

      const res = await startProjectHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data?.leadNumber).toMatch(/^AST-LEAD-/);
    });
  });

  describe('GET /api/reviews', () => {
    it('returns status 200 with sanitized array of approved client reviews', async () => {
      const req = new NextRequest('http://localhost:3000/api/reviews?limit=5', {
        method: 'GET',
      });

      const res = await reviewsGetHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);

      // Verify privacy stripping
      const review = json.data[0];
      expect(review.displayName).toBeDefined();
      expect(review.review).toBeDefined();
      expect(review.adminNotes).toBeUndefined();
      expect(review.clientEmail).toBeUndefined();
    });
  });
});
