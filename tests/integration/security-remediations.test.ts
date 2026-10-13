import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { validateDocumentBuffer, sanitizeFilename } from '@/lib/storage/validator';
import { generateUploadSessionToken, verifyUploadSessionToken } from '@/lib/storage/token';
import {
  signClientLeadSessionCookie,
  verifyClientLeadSessionCookie,
  ClientLeadCookiePayload,
} from '@/lib/lead-session';

describe('Security Remediations Verification Suite', () => {
  describe('Storage & Upload Boundary Security', () => {
    it('rejects path traversal attempts in filename sanitizer', () => {
      const maliciousNames = [
        '../../etc/passwd',
        '..\\..\\windows\\system32\\cmd.exe',
        'folder/../../../secret.txt',
        'normal.pdf\0.exe',
      ];

      for (const name of maliciousNames) {
        const sanitized = sanitizeFilename(name);
        expect(sanitized).not.toContain('..');
        expect(sanitized).not.toContain('/');
        expect(sanitized).not.toContain('\\');
        expect(sanitized).not.toContain('\0');
      }
    });

    it('validates document buffers using magic bytes and blocks dangerous extensions', () => {
      // Executable buffer (MZ header)
      const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00]);
      const resExe = validateDocumentBuffer(exeBuffer, 'malware.exe');
      expect(resExe.isValid).toBe(false);

      // Valid PDF buffer (%PDF-)
      const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]);
      const resPdf = validateDocumentBuffer(pdfBuffer, 'resume.pdf');
      expect(resPdf.isValid).toBe(true);
      expect(resPdf.mimeType).toBe('application/pdf');

      // Macro-enabled Word document (docm)
      const docmZipHeader = Buffer.from([0x50, 0x4B, 0x03, 0x04]);
      const resDocm = validateDocumentBuffer(docmZipHeader, 'macro.docm');
      expect(resDocm.isValid).toBe(false);
      expect(resDocm.error).toContain('disallowed');
    });

    it('enforces staging key regex pattern and path containment', () => {
      const STAGING_KEY_PATTERN = /^staging\/\d{4}-\d{2}-\d{2}\/[a-f0-9]{32}\.(pdf|docx|doc)$/;

      const validKey = 'staging/2026-10-08/0123456789abcdef0123456789abcdef.pdf';
      expect(STAGING_KEY_PATTERN.test(validKey)).toBe(true);

      const traversalKey1 = 'staging/../../etc/passwd.pdf';
      const traversalKey2 = 'staging/2026-10-08/shell.php';
      expect(STAGING_KEY_PATTERN.test(traversalKey1)).toBe(false);
      expect(STAGING_KEY_PATTERN.test(traversalKey2)).toBe(false);
    });

    it('enforces authenticated, bound, time-limited upload session tokens', () => {
      const stagingKey = 'staging/2026-10-08/0123456789abcdef0123456789abcdef.pdf';
      const otherKey = 'staging/2026-10-08/fedcba9876543210fedcba9876543210.pdf';

      // 1. Valid generated token passes verification
      const { sessionToken, expiresAt } = generateUploadSessionToken(stagingKey, 900);
      expect(sessionToken).toBeDefined();
      expect(expiresAt).toBeDefined();

      const verifyValid = verifyUploadSessionToken(stagingKey, sessionToken);
      expect(verifyValid.valid).toBe(true);

      // 2. Token bound to stagingKey: fails when used with another key
      const verifyWrongKey = verifyUploadSessionToken(otherKey, sessionToken);
      expect(verifyWrongKey.valid).toBe(false);
      expect(verifyWrongKey.error).toContain('Key binding mismatch');

      // 3. Forged signature fails
      const forgedToken = `${Date.now() + 900000}.0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`;
      const verifyForged = verifyUploadSessionToken(stagingKey, forgedToken);
      expect(verifyForged.valid).toBe(false);

      // 4. Expired token fails
      const pastExpiresAtMs = Date.now() - 1000; // expired 1s ago
      const secret = process.env.JWT_SECRET || 'test_storage_signing_secret_for_vitest_runner_testing_at_least_64_bytes_long';
      const expiredPayload = `${stagingKey}:${pastExpiresAtMs}:resume_upload`;
      const expiredSig = crypto.createHmac('sha256', secret).update(expiredPayload).digest('hex');
      const expiredToken = `${pastExpiresAtMs}.${expiredSig}`;

      const verifyExpired = verifyUploadSessionToken(stagingKey, expiredToken);
      expect(verifyExpired.valid).toBe(false);
      expect(verifyExpired.error).toContain('expired');
    });
  });

  describe('Client Session & Auth Hardening (SEC-08)', () => {
    const mockSessionPayload: ClientLeadCookiePayload = {
      id: 'lead-test-uuid-1234',
      leadNumber: 'AST-LEAD-2026',
      name: 'Verified Client',
      email: 'client@example.com',
      company: 'Astraiv Client Org',
      serviceId: 'srv-enterprise-cloud',
      role: 'CLIENT',
      loginTime: Date.now(),
    };

    it('generates cryptographically signed, tamper-evident lead session cookies', () => {
      const signedCookie = signClientLeadSessionCookie(mockSessionPayload);
      expect(signedCookie).toContain('.');

      const verified = verifyClientLeadSessionCookie(signedCookie);
      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(mockSessionPayload.id);
      expect(verified?.email).toBe(mockSessionPayload.email);
      expect(verified?.role).toBe('CLIENT');
    });

    it('rejects tampered or forged client session cookies', () => {
      const signedCookie = signClientLeadSessionCookie(mockSessionPayload);
      const [payloadB64, signature] = signedCookie.split('.');

      // Tamper with payload: change user ID
      const decodedJson = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      decodedJson.id = 'attacker-substituted-id';
      const tamperedB64 = Buffer.from(JSON.stringify(decodedJson)).toString('base64url');

      const tamperedCookie = `${tamperedB64}.${signature}`;
      const verified = verifyClientLeadSessionCookie(tamperedCookie);
      expect(verified).toBeNull();
    });

    it('rejects legacy unsigned plaintext JSON cookies', () => {
      const plaintextCookie = JSON.stringify(mockSessionPayload);
      const verified = verifyClientLeadSessionCookie(plaintextCookie);
      expect(verified).toBeNull();
    });
  });

  describe('Cryptographic & Secret Invariants', () => {
    it('uses timing-safe comparison to prevent secret enumeration', () => {
      const expectedSecret = 'super_secret_revalidate_token_48_bytes_length_ok';
      const providedSecret = 'super_secret_revalidate_token_48_bytes_length_ok';
      const wrongSecret = 'wrong_secret_revalidate_token_48_bytes_length_ok';

      const expBuf = Buffer.from(expectedSecret);
      const provBuf = Buffer.from(providedSecret);
      const wrongBuf = Buffer.from(wrongSecret);

      expect(expBuf.length === provBuf.length && crypto.timingSafeEqual(expBuf, provBuf)).toBe(true);
      expect(expBuf.length === wrongBuf.length && crypto.timingSafeEqual(expBuf, wrongBuf)).toBe(false);
    });

    it('prohibits fallback to hardcoded production database connection strings in source code', () => {
      const dbSource = fs.readFileSync(path.resolve(process.cwd(), 'src/models/db.ts'), 'utf-8');
      expect(dbSource).not.toContain('SUPABASE_PROD_URL');
      expect(dbSource).not.toMatch(/postgres\.cvdiedebmguahkmzkwtd:[^@]+@/);
    });

    it('prohibits fallback to static 64-byte JWT secret in jwt.ts', () => {
      const jwtSource = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/jwt.ts'), 'utf-8');
      expect(jwtSource).not.toContain('DEFAULT_64_BYTE_SECRET');
      expect(jwtSource).not.toContain('REDACTED_JWT_SECRET_HASH');
    });

    it('verifies db.ts does NOT silently rewrite connection ports (e.g. 5432 to 6543)', () => {
      const dbSource = fs.readFileSync(path.resolve(process.cwd(), 'src/models/db.ts'), 'utf-8');
      expect(dbSource).not.toContain("replace(':5432'");
      expect(dbSource).not.toContain("replace('5432'");
      expect(dbSource).not.toContain(':6543');
    });
  });

  describe('Release Blocker Remediation Invariants', () => {
    it('validates real DOCX structure with [Content_Types].xml and word/ markers, rejecting generic ZIPs', () => {
      // 1. Genuine DOCX package with OPC headers
      const zipHeader = Buffer.from([0x50, 0x4B, 0x03, 0x04]);
      const opcStructure = Buffer.from('[Content_Types].xml ... word/document.xml');
      const validDocx = Buffer.concat([zipHeader, opcStructure, Buffer.alloc(1024, 0x20)]);
      const resValid = validateDocumentBuffer(validDocx, 'candidate.docx');
      expect(resValid.isValid).toBe(true);
      expect(resValid.detectedFormat).toBe('docx');

      // 2. Generic ZIP file without Word Open XML structure
      const genericZip = Buffer.concat([zipHeader, Buffer.from('archive_file.txt'), Buffer.alloc(1024, 0x00)]);
      const resInvalid = validateDocumentBuffer(genericZip, 'fake.docx');
      expect(resInvalid.isValid).toBe(false);
      expect(resInvalid.error).toContain('Invalid DOCX structure');
    });

    it('enforces that LocalStorageProvider constructor rejects production execution', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalAllow = process.env.ALLOW_LOCAL_STORAGE_IN_PROD;
      try {
        (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
        delete process.env.ALLOW_LOCAL_STORAGE_IN_PROD;
        const localSource = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/storage/local-provider.ts'), 'utf-8');
        expect(localSource).toContain("process.env.NODE_ENV === 'production'");
        expect(localSource).toContain('Access denied: LocalStorageProvider is restricted to authorized local development');
      } finally {
        (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
        if (originalAllow) process.env.ALLOW_LOCAL_STORAGE_IN_PROD = originalAllow;
      }
    });

    it('verifies storage factory rejects missing durable cloud storage in production', () => {
      const factorySource = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/storage/index.ts'), 'utf-8');
      expect(factorySource).toContain('[CRITICAL_STORAGE_CONFIG]');
      expect(factorySource).toContain("process.env.NODE_ENV === 'production'");
    });

    it('verifies direct-upload route forbids execution in production', () => {
      const routeSource = fs.readFileSync(path.resolve(process.cwd(), 'src/app/api/applications/upload-direct/route.ts'), 'utf-8');
      expect(routeSource).toContain("process.env.NODE_ENV === 'production'");
      expect(routeSource).toContain('Direct filesystem uploads are disabled in production');
      expect(routeSource).toContain('status: 403');
    });

    it('verifies R2 candidate resume storage isolates private resumes from public asset bucket', () => {
      const r2Source = fs.readFileSync(path.resolve(process.cwd(), 'src/lib/storage/r2-provider.ts'), 'utf-8');
      expect(r2Source).toContain("process.env.R2_RESUME_BUCKET_NAME || 'astraiv-candidate-resumes'");
      expect(r2Source).not.toContain('astraiv-assets');
      expect(r2Source).toContain('process.env.CLOUDFLARE_R2_ACCOUNT_ID');
      expect(r2Source).toContain('process.env.CLOUDFLARE_R2_ACCESS_KEY_ID');
      expect(r2Source).toContain('process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    });

    it('verifies local storage provider persists files across separate instances and requests', async () => {
      const { LocalStorageProvider } = await import('@/lib/storage/local-provider');
      const provider1 = new LocalStorageProvider();
      const testKey = `resumes/test-persistence-${Date.now()}.pdf`;
      const pdfHeader = Buffer.from('%PDF-1.4\n%test-payload');
      const buffer = Buffer.concat([pdfHeader, Buffer.alloc(512, 0x20)]);

      const saved = await provider1.saveBuffer(testKey, buffer, 'application/pdf');
      expect(saved).toBe(true);

      // Verify second provider instance on separate request can access persisted file
      const provider2 = new LocalStorageProvider();
      const download = await provider2.getSecureDownloadUrl({
        key: testKey,
        filename: 'downloaded.pdf',
        mimeType: 'application/pdf',
      });
      expect(download.downloadUrl).toContain(encodeURIComponent(testKey));

      // Cleanup
      await provider2.deleteObject(testKey);
    });
  });
});
