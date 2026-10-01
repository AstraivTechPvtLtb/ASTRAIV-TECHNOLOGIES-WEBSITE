import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmailSyntax,
  validatePhone,
  validateProjectMessage,
  countWords,
  normalizeName,
  normalizeEmail,
} from './contact-rules';
import {
  nameFieldSchema,
  emailFieldSchema,
  phoneFieldSchema,
  projectMessageFieldSchema,
  standardContactSchema,
} from './contact';

describe('Project Inquiry Form Validation Suite (Test Matrix)', () => {
  describe('1. Full Name Validation', () => {
    it('accepts valid alphabetic names with spaces', () => {
      const validNames = [
        'Akash Das',
        'John Smith',
        'Rahul Sharma',
        'Mary Jane Watson',
      ];
      for (const name of validNames) {
        expect(validateName(name).isValid).toBe(true);
        expect(nameFieldSchema.safeParse(name).success).toBe(true);
      }
    });

    it('rejects numbers, special characters, symbols, emojis, and code injection', () => {
      const invalidNames = [
        'Akash123',
        'Akash@Das',
        'Rahul_123',
        'John!',
        '#Akash',
        '123456',
        '@@@@',
        'Akash<>',
        'Akash_Das',
        'Akash 🚀',
        '<script>alert(1)</script>',
      ];
      for (const name of invalidNames) {
        const result = validateName(name);
        expect(result.isValid).toBe(false);
        expect(result.error).toMatch(/Name can contain letters and spaces only/i);

        const zodRes = nameFieldSchema.safeParse(name);
        expect(zodRes.success).toBe(false);
      }
    });

    it('normalizes internal spaces and trims leading/trailing whitespace', () => {
      expect(normalizeName('   Akash    Das   ')).toBe('Akash Das');
      expect(validateName('   Akash    Das   ').isValid).toBe(true);
      expect(nameFieldSchema.safeParse('   Akash    Das   ').success).toBe(true);
    });

    it('enforces maximum length of 30 letters (less is fine, cannot exceed 30)', () => {
      // Exactly 30 characters -> PASS
      const name30 = 'Christopher Alexander Robinson'; // 30 chars
      expect(name30.length).toBe(30);
      expect(validateName(name30).isValid).toBe(true);
      expect(nameFieldSchema.safeParse(name30).success).toBe(true);

      // 20 characters -> PASS
      const name20 = 'Alexander Washington'; // 20 chars
      expect(validateName(name20).isValid).toBe(true);

      // Exceeding 30 characters -> FAIL
      const name32 = 'Christopher Alexander Washington'; // 32 chars
      expect(name32.length).toBeGreaterThan(30);
      const res32 = validateName(name32);
      expect(res32.isValid).toBe(false);
      expect(res32.error).toBe('Name cannot exceed 30 characters.');
      expect(nameFieldSchema.safeParse(name32).success).toBe(false);
    });

    it('rejects empty, whitespace-only, or single-character names', () => {
      expect(validateName('').isValid).toBe(false);
      expect(validateName('   ').isValid).toBe(false);
      expect(validateName('A').isValid).toBe(false);
    });
  });

  describe('2. Email Address Validation (Syntax Layer)', () => {
    it('accepts legitimate email formats', () => {
      const validEmails = [
        'info@astraivtechnologies.com',
        'user@gmail.com',
        'john.smith@company.co.in',
        'alex.o-connor@domain.org',
      ];
      for (const email of validEmails) {
        expect(validateEmailSyntax(email).isValid).toBe(true);
        expect(emailFieldSchema.safeParse(email).success).toBe(true);
      }
    });

    it('rejects malformed email syntax (missing @, missing domain, missing TLD, spaces)', () => {
      const invalidEmails = [
        'abc',
        'abc@',
        '@gmail.com',
        'akash gmail.com',
        'akash@gmail',
        'akash@@gmail.com',
        'user@.com',
        'user@domain..com',
      ];
      for (const email of invalidEmails) {
        const result = validateEmailSyntax(email);
        expect(result.isValid).toBe(false);
        expect(emailFieldSchema.safeParse(email).success).toBe(false);
      }
    });

    it('normalizes email addresses by trimming and lowercasing', () => {
      expect(normalizeEmail('  USER@Gmail.COM  ')).toBe('user@gmail.com');
    });

    it('rejects disposable and temporary burner email domains', () => {
      const disposableEmails = [
        'attacker@mailinator.com',
        'temp@guerrillamail.com',
        'bot@tempmail.com',
        'burner@10minutemail.com',
      ];
      for (const email of disposableEmails) {
        const result = validateEmailSyntax(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toMatch(/disposable/i);
      }
    });
  });

  describe('3. Mobile / Phone Number Validation', () => {
    it('allows empty/undefined phone because it is optional', () => {
      expect(validatePhone('').isValid).toBe(true);
      expect(validatePhone(undefined).isValid).toBe(true);
      expect(validatePhone('   ').isValid).toBe(true);
      expect(phoneFieldSchema.safeParse('').success).toBe(true);
      expect(phoneFieldSchema.safeParse(undefined).success).toBe(true);
    });

    it('strictly requires exactly 10 digits for India (+91)', () => {
      // 10 digits -> PASS
      expect(validatePhone('9876543210').isValid).toBe(true);
      expect(validatePhone('+91 98765 43210').isValid).toBe(true);
      expect(validatePhone('+91 9876543210').isValid).toBe(true);

      // 9 digits -> FAIL
      const res9 = validatePhone('987654321');
      expect(res9.isValid).toBe(false);
      expect(res9.error).toMatch(/10 digits/i);

      // 11 digits -> FAIL
      const res11 = validatePhone('98765432101');
      expect(res11.isValid).toBe(false);
      expect(res11.error).toMatch(/10 digits/i);

      // Letters or symbols -> FAIL
      const resLetters = validatePhone('98765abc10');
      expect(resLetters.isValid).toBe(false);
      expect(resLetters.error).toMatch(/digits only/i);

      const resSymbols = validatePhone('98765@3210');
      expect(resSymbols.isValid).toBe(false);
      expect(resSymbols.error).toMatch(/digits only/i);
    });

    it('validates other supported regions based on country numbering format', () => {
      // United States (+1): exactly 10 digits
      expect(validatePhone('+1 (555) 012-3456').isValid).toBe(true);
      expect(validatePhone('+1 555-012').isValid).toBe(false);

      // Singapore (+65): exactly 8 digits
      expect(validatePhone('+65 8123 4567').isValid).toBe(true);
      expect(validatePhone('+65 8123 456').isValid).toBe(false); // 7 digits
    });

    it('rejects partial phone numbers even though field is optional', () => {
      expect(validatePhone('123').isValid).toBe(false);
      expect(phoneFieldSchema.safeParse('123').success).toBe(false);
    });
  });

  describe('4. Project Details / Message Validation (Word-based: 21 to 199 words)', () => {
    const makeWords = (count: number) => Array.from({ length: count }, (_, i) => `word${i + 1}`).join(' ');

    it('accurately counts meaningful words with various whitespace and newlines', () => {
      expect(countWords('   Hello    world   ')).toBe(2);
      expect(countWords('Line one\nLine two\n\nLine three')).toBe(6);
      expect(countWords('')).toBe(0);
    });

    it('rejects 0 to 20 words (minimum 21 required)', () => {
      // 20 words -> FAIL
      const text20 = makeWords(20);
      const res20 = validateProjectMessage(text20);
      expect(res20.isValid).toBe(false);
      expect(res20.error).toMatch(/at least 21 words/i);
      expect(projectMessageFieldSchema.safeParse(text20).success).toBe(false);

      // 10 words -> FAIL
      const text10 = makeWords(10);
      expect(validateProjectMessage(text10).isValid).toBe(false);

      // Empty -> FAIL
      expect(validateProjectMessage('').isValid).toBe(false);
    });

    it('accepts valid range from 21 words up to 199 words', () => {
      // 21 words -> PASS
      const text21 = makeWords(21);
      expect(validateProjectMessage(text21).isValid).toBe(true);
      expect(projectMessageFieldSchema.safeParse(text21).success).toBe(true);

      // 100 words -> PASS
      const text100 = makeWords(100);
      expect(validateProjectMessage(text100).isValid).toBe(true);
      expect(projectMessageFieldSchema.safeParse(text100).success).toBe(true);

      // 199 words -> PASS
      const text199 = makeWords(199);
      expect(validateProjectMessage(text199).isValid).toBe(true);
      expect(projectMessageFieldSchema.safeParse(text199).success).toBe(true);
    });

    it('rejects 200 words or more (maximum 199 allowed)', () => {
      // 200 words -> FAIL
      const text200 = makeWords(200);
      const res200 = validateProjectMessage(text200);
      expect(res200.isValid).toBe(false);
      expect(res200.error).toMatch(/fewer than 200 words/i);
      expect(projectMessageFieldSchema.safeParse(text200).success).toBe(false);

      // 201 words -> FAIL
      const text201 = makeWords(201);
      expect(validateProjectMessage(text201).isValid).toBe(false);
    });
  });

  describe('5. Full Standard Contact Schema Integration', () => {
    it('validates a complete project enquiry payload adhering to all criteria', () => {
      const payload = {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@enterprise-tech.in',
        phone: '+91 98765 43210',
        company: 'Astraiv Technologies LLP',
        service: 'ai-solutions',
        message:
          'We require an enterprise multi-agent cognitive architecture to automate workflow orchestration across our cloud infrastructure. The system should support vector search, low latency streaming, and strict role based access controls.',
      };

      const result = standardContactSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('fails when any individual field breaks criteria', () => {
      const payloadBadName = {
        name: 'Rahul123',
        email: 'rahul@enterprise.in',
        service: 'ai-solutions',
        message: Array.from({ length: 25 }, () => 'validword').join(' '),
      };
      expect(standardContactSchema.safeParse(payloadBadName).success).toBe(false);

      const payloadBadPhone = {
        name: 'Rahul Sharma',
        email: 'rahul@enterprise.in',
        phone: '12345', // invalid phone length
        service: 'ai-solutions',
        message: Array.from({ length: 25 }, () => 'validword').join(' '),
      };
      expect(standardContactSchema.safeParse(payloadBadPhone).success).toBe(false);
    });
  });
});
