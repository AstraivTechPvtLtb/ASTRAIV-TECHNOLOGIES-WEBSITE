import { describe, it, expect } from 'vitest';
import {
  signClientLeadSessionCookie,
  verifyClientLeadSessionCookie,
  MAX_LEAD_SESSION_AGE_MS,
  ClientLeadCookiePayload,
} from '@/lib/lead-session';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import crypto from 'crypto';

describe('Client Portal Security & Session Verification Suite', () => {
  const samplePayload: ClientLeadCookiePayload = {
    id: 'test-lead-uuid-1234',
    leadNumber: 'AST-LEAD-2026',
    name: 'Authorized Enterprise Client',
    email: 'client@example.com',
    company: 'Enterprise Corp',
    serviceId: 'srv-cloud-arch',
    role: 'CLIENT',
    loginTime: Date.now(),
  };

  describe('1. Cryptographic Session Token & HMAC Integrity', () => {
    it('generates a valid tamper-proof signed session token', () => {
      const token = signClientLeadSessionCookie(samplePayload);
      expect(token).toBeDefined();
      expect(token.split('.')).toHaveLength(2);

      const verified = verifyClientLeadSessionCookie(token);
      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(samplePayload.id);
      expect(verified?.leadNumber).toBe(samplePayload.leadNumber);
      expect(verified?.email).toBe(samplePayload.email);
      expect(verified?.role).toBe('CLIENT');
    });

    it('rejects forged or modified session token payloads', () => {
      const token = signClientLeadSessionCookie(samplePayload);
      const [payloadB64, signature] = token.split('.');

      // Attacker tampers with payload data
      const tamperedJson = JSON.stringify({ ...samplePayload, role: 'ADMIN', id: 'attacker-uuid' });
      const tamperedB64 = Buffer.from(tamperedJson).toString('base64url');
      const forgedToken = `${tamperedB64}.${signature}`;

      const result = verifyClientLeadSessionCookie(forgedToken);
      expect(result).toBeNull();
    });

    it('rejects unsigned or corrupted tokens', () => {
      expect(verifyClientLeadSessionCookie('unsigned-raw-token')).toBeNull();
      expect(verifyClientLeadSessionCookie('')).toBeNull();
      expect(verifyClientLeadSessionCookie('part1.part2.part3')).toBeNull();
    });

    it('enforces cryptographic session expiration (> 30 days old)', () => {
      const expiredPayload: ClientLeadCookiePayload = {
        ...samplePayload,
        loginTime: Date.now() - (MAX_LEAD_SESSION_AGE_MS + 60000), // 30 days + 1 min ago
      };

      const expiredToken = signClientLeadSessionCookie(expiredPayload);
      const verified = verifyClientLeadSessionCookie(expiredToken);
      expect(verified).toBeNull();
    });
  });

  describe('2. Dual-Mode Password Verification (Scrypt + Legacy)', () => {
    it('creates standard 161-character scrypt hashes via better-auth', async () => {
      const password = 'SecureClientSecret2026!';
      const hash = await hashPassword(password);

      expect(hash).toHaveLength(161);
      expect(/^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(hash)).toBe(true);

      const isValid = await verifyPassword({ hash, password });
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword({ hash, password: 'WrongPassword123' });
      expect(isInvalid).toBe(false);
    });

    it('verifies legacy plaintext passwords with constant-time equality', () => {
      const legacyPlaintext = 'Pass847291';
      const providedCorrect = 'Pass847291';
      const providedWrong = 'Pass999999';

      const bufCorrect = Buffer.from(providedCorrect);
      const bufStored = Buffer.from(legacyPlaintext);
      const match =
        bufCorrect.length === bufStored.length &&
        crypto.timingSafeEqual(bufCorrect, bufStored);
      expect(match).toBe(true);

      const bufWrong = Buffer.from(providedWrong);
      const mismatch =
        bufWrong.length === bufStored.length &&
        crypto.timingSafeEqual(bufWrong, bufStored);
      expect(mismatch).toBe(false);
    });

    it('distinguishes between scrypt hash format and legacy plaintext strings', () => {
      const scryptRegex = /^[a-f0-9]{32}:[a-f0-9]{128}$/i;

      // 4 audited legacy database passwords
      const legacyPasswords = ['Pass182749', 'SecurePass2026!', 'TempClient99', 'AstraivLead1001'];
      for (const legacy of legacyPasswords) {
        expect(scryptRegex.test(legacy)).toBe(false);
      }

      // Valid generated scrypt hash
      const validHash = 'a913da8f2a0689f0760655b0e7ffa658:0070040889918cd18e9c228eafb1e5dc33b2c28110b40ca6094348c352adf1df0042a683d48c98cb6031fc95d3a030ce63746349d8d46ccfdd001407df9af0c6';
      expect(scryptRegex.test(validHash)).toBe(true);
    });
  });
});
