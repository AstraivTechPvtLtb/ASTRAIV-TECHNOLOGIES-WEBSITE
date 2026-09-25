import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema, forgotPasswordSchema } from './auth';

describe('Authentication Validation Schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid credentials', () => {
      const valid = {
        email: 'engineer@astraiv.com',
        password: 'SecurePassword123',
        rememberMe: true,
      };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects missing or empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'Password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/Email is required/i);
      }
    });

    it('rejects invalid email formats', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email-string',
        password: 'Password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/valid email/i);
      }
    });

    it('rejects passwords shorter than 6 characters', () => {
      const result = loginSchema.safeParse({
        email: 'engineer@astraiv.com',
        password: '12345',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/at least 6 characters/i);
      }
    });
  });

  describe('signupSchema', () => {
    const validSignup = {
      name: 'Sarah Connor',
      email: 'sarah@astraiv.com',
      password: 'StrongPassword1',
      confirmPassword: 'StrongPassword1',
    };

    it('accepts fully compliant registration data', () => {
      const result = signupSchema.safeParse(validSignup);
      expect(result.success).toBe(true);
    });

    it('rejects names shorter than 2 characters or longer than 50', () => {
      expect(signupSchema.safeParse({ ...validSignup, name: 'S' }).success).toBe(false);
      expect(signupSchema.safeParse({ ...validSignup, name: 'S'.repeat(51) }).success).toBe(false);
    });

    it('enforces password complexity: requires uppercase letter', () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: 'lowercase123',
        confirmPassword: 'lowercase123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/uppercase letter/i);
      }
    });

    it('enforces password complexity: requires a number', () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: 'NoNumbersHere',
        confirmPassword: 'NoNumbersHere',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/contain at least one number/i);
      }
    });

    it('rejects mismatched password and confirmPassword', () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: 'StrongPassword1',
        confirmPassword: 'DifferentPassword2',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/Passwords don't match/i);
      }
    });
  });

  describe('forgotPasswordSchema', () => {
    it('accepts valid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'reset@astraiv.com' });
      expect(result.success).toBe(true);
    });

    it('rejects empty or invalid email', () => {
      expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
      expect(forgotPasswordSchema.safeParse({ email: 'notanemail' }).success).toBe(false);
    });
  });
});
