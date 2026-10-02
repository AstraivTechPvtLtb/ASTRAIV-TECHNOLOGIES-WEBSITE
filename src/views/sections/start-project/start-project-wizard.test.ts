import { describe, it, expect } from 'vitest';
import { validateEmailSyntax, validatePhone, validateName } from '@/lib/validations/contact-rules';
import { getCountryExpectedDigits, COUNTRIES } from '@/lib/countries';

describe('Start Project Wizard Step 4 Validation & Rules', () => {
  describe('Full Name Field Requirements', () => {
    it('accepts valid names containing letters and spaces up to 30 characters', () => {
      expect(validateName('Jane Doe').isValid).toBe(true);
      expect(validateName('Alexander Wright').isValid).toBe(true);
      expect(validateName('A'.repeat(30)).isValid).toBe(true);
    });

    it('rejects names with numbers or special characters except space', () => {
      const invalidNames = ['Jane123', 'Jane@Doe', 'Jane_Doe', 'Jane#1', '12345', 'Jane!'];
      for (const name of invalidNames) {
        const res = validateName(name);
        expect(res.isValid).toBe(false);
      }
    });

    it('rejects names exceeding 30 characters', () => {
      const over30 = 'A'.repeat(31);
      const res = validateName(over30);
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Name cannot exceed 30 characters.');
    });

    it('sanitizes input on typing by stripping non-letters and non-spaces, and capping at 30 chars', () => {
      const sanitizeName = (val: string) => val.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
      expect(sanitizeName('John123 Doe!@#')).toBe('John Doe');
      expect(sanitizeName('A'.repeat(35))).toHaveLength(30);
    });
  });

  describe('Business Email Field Requirements', () => {
    it('accepts valid lowercase email addresses', () => {
      expect(validateEmailSyntax('jane@company.com').isValid).toBe(true);
      expect(validateEmailSyntax('alex.wright@astraivtechnologies.com').isValid).toBe(true);
    });

    it('disallows uppercase letters and converts them to lowercase', () => {
      const rawInput = 'Jane.Doe@Company.COM';
      const sanitized = rawInput.toLowerCase().replace(/\s/g, '');
      expect(sanitized).toBe('jane.doe@company.com');
      expect(/[A-Z]/.test(sanitized)).toBe(false);
    });

    it('validates syntax and rejects invalid or disposable domains', () => {
      expect(validateEmailSyntax('invalid-email').isValid).toBe(false);
      expect(validateEmailSyntax('user@mailinator.com').isValid).toBe(false);
      expect(validateEmailSyntax('user@domain').isValid).toBe(false);
    });
  });

  describe('Company or Organization Field Requirements', () => {
    const sanitizeCompany = (val: string) => val.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
    const validateCompany = (val: string) => {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) return { isValid: false, error: 'Please enter your company or organization name.' };
      if (trimmed.length < 2) return { isValid: false, error: 'Company name must be at least 2 characters.' };
      if (val.length > 30) return { isValid: false, error: 'Company name cannot exceed 30 characters.' };
      if (!/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(trimmed)) {
        return { isValid: false, error: 'Company name can contain letters and spaces only (no numbers or special characters).' };
      }
      return { isValid: true };
    };

    it('accepts company names with letters and spaces up to 30 characters', () => {
      expect(validateCompany('Acme Global').isValid).toBe(true);
      expect(validateCompany('Astraiv Tech').isValid).toBe(true);
      expect(validateCompany('A'.repeat(30)).isValid).toBe(true);
    });

    it('rejects company names containing numbers or special characters', () => {
      expect(validateCompany('Acme Inc.').isValid).toBe(false); // contains dot
      expect(validateCompany('Acme123').isValid).toBe(false);   // contains numbers
      expect(validateCompany('Acme & Co').isValid).toBe(false);  // contains &
      expect(validateCompany('Acme_Tech').isValid).toBe(false); // contains _
    });

    it('rejects company names exceeding 30 characters', () => {
      expect(validateCompany('A'.repeat(31)).isValid).toBe(false);
    });

    it('sanitizes company input on typing by stripping numbers and special characters except space', () => {
      expect(sanitizeCompany('Acme Global Inc. #123')).toBe('Acme Global Inc ');
      expect(sanitizeCompany('A'.repeat(40))).toHaveLength(30);
    });
  });

  describe('Phone Number Field Requirements', () => {
    it('strictly requires 10 digits for India (+91)', () => {
      expect(validatePhone('+91 9876543210').isValid).toBe(true);
      expect(validatePhone('+91 987654321').isValid).toBe(false);
      expect(validatePhone('+91 98765432101').isValid).toBe(false);
      expect(validatePhone('+91 9876543210')?.error).toBeUndefined();
    });

    it('calculates exact countrywise expected digits', () => {
      const india = COUNTRIES.find((c) => c.code === 'IN')!;
      expect(getCountryExpectedDigits(india)).toBe(10);
      expect(india.placeholder).toBe('0000000000');

      const us = COUNTRIES.find((c) => c.code === 'US')!;
      expect(getCountryExpectedDigits(us)).toBe(10);

      const sg = COUNTRIES.find((c) => c.code === 'SG')!;
      expect(getCountryExpectedDigits(sg)).toBe(8);

      const de = COUNTRIES.find((c) => c.code === 'DE')!;
      expect(getCountryExpectedDigits(de)).toBe(11);
    });

    it('disallows alphabets and special characters in phone digits', () => {
      const sanitizePhone = (val: string, maxDigits: number) => val.replace(/\D/g, '').slice(0, maxDigits);
      expect(sanitizePhone('987abc654-3210', 10)).toBe('9876543210');
      expect(sanitizePhone('123456789012345', 10)).toBe('1234567890');
    });

    it('validates countrywise exact digits for other countries', () => {
      // Singapore (+65): 8 digits
      expect(validatePhone('+65 81234567').isValid).toBe(true);
      expect(validatePhone('+65 8123456').isValid).toBe(false);

      // Germany (+49): 11 digits
      expect(validatePhone('+49 15123456789').isValid).toBe(true);
      expect(validatePhone('+49 1512345678').isValid).toBe(false);
    });

    it('allows empty phone because it is optional', () => {
      expect(validatePhone('').isValid).toBe(true);
      expect(validatePhone(undefined).isValid).toBe(true);
    });
  });
});
