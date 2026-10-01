import { detectCountryFromPhone } from '@/lib/countries';

/**
 * Regular expression strictly matching English alphabetic characters and spaces between words.
 * Disallows numbers, symbols, emojis, HTML, punctuation, and leading/trailing/repeated spaces.
 * Format: ^[A-Za-z]+(?: [A-Za-z]+)*$
 */
export const NAME_REGEX = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

/**
 * Standard RFC-compliant email syntax regular expression.
 * Rejects missing @, missing domain, missing TLD, whitespace, double @@, and malformed characters.
 */
export const EMAIL_SYNTAX_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Known disposable and temporary burner email domains.
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'throwawaymail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'dispostable.com',
  'fakeinbox.com',
  'maildrop.cc',
  'temp-mail.org',
  'generator.email',
  'mohmal.com',
  'getnada.com',
  'crazymailing.com',
  'burnermail.io',
  'tempmailo.com',
]);

/**
 * Counts meaningful words in a string after trimming and collapsing whitespace.
 */
export function countWords(text: string | null | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Normalizes a full name by trimming surrounding whitespace and collapsing repeated internal spaces.
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Validates a person's full name according to strict alphabetic and single-space constraints.
 */
export function validateName(name: string | null | undefined): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Full Name is required.' };
  }
  const normalized = normalizeName(name);
  if (normalized.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  if (!NAME_REGEX.test(normalized)) {
    return { isValid: false, error: 'Name can contain letters and spaces only.' };
  }
  if (normalized.length > 30) {
    return { isValid: false, error: 'Name cannot exceed 30 characters.' };
  }
  return { isValid: true };
}

/**
 * Normalizes email address by trimming whitespace and lowercasing.
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Performs local format and disposable check on an email address.
 */
export function validateEmailSyntax(email: string | null | undefined): { isValid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email Address is required.' };
  }

  const trimmed = email.trim();

  // Reject internal spaces
  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'Email cannot contain spaces.' };
  }

  // Reject multiple @
  if ((trimmed.match(/@/g) || []).length !== 1) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const [localPart, domainPart] = trimmed.split('@');
  if (!localPart || !domainPart) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Please enter a valid email address with a domain extension.' };
  }

  const domainParts = domainPart.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, error: 'Please enter a valid email domain extension.' };
  }

  if (!EMAIL_SYNTAX_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const normalizedDomain = domainPart.toLowerCase();
  if (DISPOSABLE_EMAIL_DOMAINS.has(normalizedDomain)) {
    return {
      isValid: false,
      error: 'Disposable and temporary email addresses are not accepted.',
    };
  }

  return { isValid: true };
}

/**
 * Validates a phone number based on selected country/region dial code.
 * Empty value is valid because phone is optional.
 * When provided, national number must contain ONLY digits and strictly match country requirements.
 */
export function validatePhone(phone: string | null | undefined): { isValid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: true }; // Phone is optional
  }

  const trimmed = phone.trim();

  // Reject any letters, emojis, or disallowed characters
  if (/[a-zA-Z]/.test(trimmed)) {
    return { isValid: false, error: 'Phone number can contain digits only.' };
  }
  if (/[@#$%^&*=_<>{}[\]~`|\\!?;:'"]/.test(trimmed)) {
    return { isValid: false, error: 'Phone number can contain digits only.' };
  }

  // Detect country if leading +
  if (trimmed.startsWith('+')) {
    const detected = detectCountryFromPhone(trimmed);
    if (detected) {
      const nationalDigits = detected.localNumber.replace(/\D/g, '');

      // India (+91) strictly requires 10 national digits
      if (detected.country.code === 'IN') {
        if (nationalDigits.length !== 10) {
          return { isValid: false, error: 'India mobile number must be exactly 10 digits.' };
        }
        return { isValid: true };
      }

      // Other countries: calculate expected digits from country.format mask
      const expectedDigits = (detected.country.format.match(/#/g) || []).length;
      if (expectedDigits > 0 && nationalDigits.length !== expectedDigits) {
        return {
          isValid: false,
          error: `Phone number for ${detected.country.name} must be exactly ${expectedDigits} digits.`,
        };
      }

      if (nationalDigits.length < 6 || nationalDigits.length > 15) {
        return { isValid: false, error: 'Please enter a valid phone number.' };
      }

      return { isValid: true };
    }
  }

  // If no dial code detected or only national digits supplied (defaults to India)
  const rawDigits = trimmed.replace(/\D/g, '');
  if (rawDigits.length !== 10) {
    return { isValid: false, error: 'India mobile number must be exactly 10 digits.' };
  }

  return { isValid: true };
}

/**
 * Validates project details word count:
 * Must be more than 20 words AND less than 200 words (21 to 199 words).
 */
export function validateProjectMessage(message: string | null | undefined): { isValid: boolean; error?: string } {
  if (!message || message.trim() === '') {
    return { isValid: false, error: 'Project details are required.' };
  }

  const words = countWords(message);
  if (words <= 20) {
    return { isValid: false, error: 'Please provide at least 21 words about your project.' };
  }
  if (words >= 200) {
    return { isValid: false, error: 'Project details must contain fewer than 200 words.' };
  }

  return { isValid: true };
}
