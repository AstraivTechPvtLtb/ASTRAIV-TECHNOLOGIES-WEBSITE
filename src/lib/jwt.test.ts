import { describe, it, expect } from 'vitest';
import {
  signAccessToken,
  signRefreshToken,
  generateAuthTokens,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAuthTokens,
  extractBearerToken,
  ACCESS_TOKEN_EXPIRY_SECONDS,
  REFRESH_TOKEN_EXPIRY_SECONDS,
  getJwtSecretKey,
} from './jwt';

describe('Client JWT Module', () => {
  const mockUser = {
    id: 'user_test_123',
    email: 'client@astraiv.com',
    role: 'CLIENT',
    fullName: 'Test Client User',
  };

  it('secret key is at least 64 bytes (512 bits)', () => {
    const key = getJwtSecretKey();
    expect(key.length).toBeGreaterThanOrEqual(64);
  });

  it('access token expiry is 60 days and refresh token is 30 days', () => {
    expect(ACCESS_TOKEN_EXPIRY_SECONDS).toBe(60 * 24 * 60 * 60); // 5,184,000s
    expect(REFRESH_TOKEN_EXPIRY_SECONDS).toBe(30 * 24 * 60 * 60); // 2,592,000s
  });

  it('signs and verifies access token with correct payload claims', async () => {
    const token = await signAccessToken({
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      fullName: mockUser.fullName,
    });

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const verification = await verifyAccessToken(token);
    expect(verification.valid).toBe(true);
    expect(verification.payload?.userId).toBe(mockUser.id);
    expect(verification.payload?.email).toBe(mockUser.email);
    expect(verification.payload?.role).toBe(mockUser.role);
    expect(verification.payload?.tokenType).toBe('access');
  });

  it('signs and verifies refresh token with correct tokenType', async () => {
    const token = await signRefreshToken({
      userId: mockUser.id,
      email: mockUser.email,
    });

    const verification = await verifyRefreshToken(token);
    expect(verification.valid).toBe(true);
    expect(verification.payload?.userId).toBe(mockUser.id);
    expect(verification.payload?.tokenType).toBe('refresh');
  });

  it('rejects access token when verified as refresh token and vice versa', async () => {
    const accessToken = await signAccessToken({
      userId: mockUser.id,
      email: mockUser.email,
    });
    const refreshCheck = await verifyRefreshToken(accessToken);
    expect(refreshCheck.valid).toBe(false);
    expect(refreshCheck.error).toContain('expected refresh token');

    const refreshToken = await signRefreshToken({
      userId: mockUser.id,
      email: mockUser.email,
    });
    const accessCheck = await verifyAccessToken(refreshToken);
    expect(accessCheck.valid).toBe(false);
    expect(accessCheck.error).toContain('expected access token');
  });

  it('generates paired tokens and performs refresh token rotation', async () => {
    const auth = await generateAuthTokens(mockUser);
    expect(auth.accessToken).toBeDefined();
    expect(auth.refreshToken).toBeDefined();
    expect(auth.accessExpiresIn).toBe(ACCESS_TOKEN_EXPIRY_SECONDS);
    expect(auth.refreshExpiresIn).toBe(REFRESH_TOKEN_EXPIRY_SECONDS);

    const refreshResult = await refreshAuthTokens(auth.refreshToken);
    expect(refreshResult.success).toBe(true);
    expect(refreshResult.tokens?.accessToken).toBeDefined();
    expect(refreshResult.tokens?.refreshToken).toBeDefined();
  });

  it('correctly extracts bearer tokens from Authorization header', () => {
    expect(extractBearerToken('Bearer my_token_123')).toBe('my_token_123');
    expect(extractBearerToken('Basic xyz')).toBeNull();
    expect(extractBearerToken(null)).toBeNull();
  });
});
