import { describe, it, expect } from 'vitest';
import { formatPhoneNumber, detectCountryFromPhone, COUNTRIES } from '../lib/countries';

describe('Country and Phone Number Formatting', () => {
  it('formats Indian phone numbers correctly', () => {
    const formatted = formatPhoneNumber('8167409664', '##### #####');
    expect(formatted).toBe('81674 09664');
  });

  it('formats US phone numbers with parenthesis and dash', () => {
    const formatted = formatPhoneNumber('4155552671', '(###) ###-####');
    expect(formatted).toBe('(415) 555-2671');
  });

  it('formats UK phone numbers correctly', () => {
    const formatted = formatPhoneNumber('7911123456', '#### ######');
    expect(formatted).toBe('7911 123456');
  });

  it('formats Australian phone numbers correctly', () => {
    const formatted = formatPhoneNumber('412345678', '### ### ###');
    expect(formatted).toBe('412 345 678');
  });

  it('handles partial digits during typing gracefully', () => {
    expect(formatPhoneNumber('415', '(###) ###-####')).toBe('(415');
    expect(formatPhoneNumber('4155', '(###) ###-####')).toBe('(415) 5');
    expect(formatPhoneNumber('415555', '(###) ###-####')).toBe('(415) 555');
    expect(formatPhoneNumber('4155552', '(###) ###-####')).toBe('(415) 555-2');
  });

  it('handles empty input gracefully', () => {
    expect(formatPhoneNumber('', '(###) ###-####')).toBe('');
  });

  it('detects country code correctly when user pastes or types with + prefix', () => {
    const detectedUS = detectCountryFromPhone('+1 415 555 2671');
    expect(detectedUS?.country.code).toBe('US');
    expect(detectedUS?.localNumber).toBe('415 555 2671');

    const detectedIN = detectCountryFromPhone('+91 81674 09664');
    expect(detectedIN?.country.code).toBe('IN');

    const detectedGB = detectCountryFromPhone('+44 7911 123456');
    expect(detectedGB?.country.code).toBe('GB');
  });

  it('has valid format and placeholder for all defined countries', () => {
    for (const country of COUNTRIES) {
      expect(country.code).toBeDefined();
      expect(country.dialCode).toMatch(/^\+\d+$/);
      expect(country.format).toBeDefined();
      expect(country.placeholder).toBeDefined();
    }
  });
});
