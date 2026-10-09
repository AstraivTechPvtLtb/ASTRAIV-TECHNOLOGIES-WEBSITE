/**
 * @file client/src/lib/lead-session.ts
 * @description [SECURITY] Cryptographic signing and verification for Client Lead Portal sessions.
 */

import crypto from 'crypto';

export const CLIENT_LEAD_COOKIE = 'astraiv_client_lead';

export interface ClientLeadCookiePayload {
  id: string;
  leadNumber: string;
  name: string;
  email: string;
  company?: string | null;
  serviceId?: string | null;
  role: 'CLIENT';
  loginTime: number;
}

function getLeadSessionSecret(): string {
  const secret = process.env.LEAD_SESSION_SECRET || process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST)) {
      return 'test_fallback_jwt_secret_at_least_64_characters_for_vitest_runner_testing_only';
    }
    throw new Error('[Auth Security Error]: LEAD_SESSION_SECRET, JWT_SECRET or BETTER_AUTH_SECRET environment variable is required.');
  }
  return secret;
}

/**
 * Signs the client lead session payload into an authenticated, tamper-proof cookie value.
 */
export function signClientLeadSessionCookie(payload: ClientLeadCookiePayload): string {
  const secret = getLeadSessionSecret();
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export const MAX_LEAD_SESSION_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days maximum session validity

/**
 * Validates the HMAC signature of the client lead session cookie and decodes payload.
 * Rejects forged, unsigned, or expired cookies.
 */
export function verifyClientLeadSessionCookie(tokenString: string): ClientLeadCookiePayload | null {
  if (!tokenString || typeof tokenString !== 'string') return null;
  const parts = tokenString.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  try {
    const secret = getLeadSessionSecret();
    const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const parsed = JSON.parse(jsonStr) as ClientLeadCookiePayload;

    // Enforce cryptographic session expiration
    if (
      !parsed.loginTime ||
      typeof parsed.loginTime !== 'number' ||
      Date.now() - parsed.loginTime > MAX_LEAD_SESSION_AGE_MS
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
