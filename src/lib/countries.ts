export interface Country {
  code: string;       // ISO 2-letter code (e.g. 'IN', 'US')
  name: string;       // Country name (e.g. 'India', 'United States')
  dialCode: string;   // Dial code (e.g. '+91', '+1')
  flag: string;       // Flag emoji (e.g. '🇮🇳', '🇺🇸')
  format: string;     // Digit mask format (e.g. '(###) ###-####' or '##### #####')
  placeholder: string;// Example placeholder (e.g. '(555) 000-0000' or '81674 09664')
}

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', format: '##### #####', placeholder: '81674 09664' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', format: '(###) ###-####', placeholder: '(555) 000-0000' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', format: '#### ######', placeholder: '7911 123456' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: '(###) ###-####', placeholder: '(555) 000-0000' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', format: '### ### ###', placeholder: '412 345 678' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', format: '## ### ####', placeholder: '50 123 4567' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', format: '#### ####', placeholder: '8123 4567' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', format: '#### #######', placeholder: '1512 3456789' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: '# ## ## ## ##', placeholder: '6 12 34 56 78' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', format: '## #### ####', placeholder: '90 1234 5678' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', format: '## ### ####', placeholder: '50 123 4567' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', format: '#### ####', placeholder: '3312 3456' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', format: '#### ####', placeholder: '9123 4567' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', format: '#### ####', placeholder: '9123 4567' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', format: '#### ####', placeholder: '3600 1234' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', format: '####-######', placeholder: '1712-345678' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', format: '###-#######', placeholder: '984-1234567' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', format: '## ### ####', placeholder: '71 234 5678' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', format: '### #######', placeholder: '300 1234567' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', format: '##-### ####', placeholder: '12-345 6789' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', format: '###-###-####', placeholder: '812-345-6789' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', format: '### ### ####', placeholder: '917 123 4567' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', format: '## ### ####', placeholder: '81 234 5678' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', format: '### ### ####', placeholder: '912 345 678' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', format: '##-####-####', placeholder: '10-1234-5678' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', format: '### #### ####', placeholder: '138 0013 8000' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰', format: '#### ####', placeholder: '9123 4567' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼', format: '### ### ###', placeholder: '912 345 678' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', format: '### ### ####', placeholder: '210 123 4567' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', format: '# ########', placeholder: '6 12345678' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', format: '## ### ## ##', placeholder: '79 123 45 67' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', format: '## ### ## ##', placeholder: '70 123 45 67' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', format: '### ## ###', placeholder: '412 34 567' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', format: '## ## ## ##', placeholder: '20 12 34 56' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', format: '## #######', placeholder: '40 1234567' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', format: '## ### ####', placeholder: '83 123 4567' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', format: '### ### ####', placeholder: '312 345 6789' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', format: '### ## ## ##', placeholder: '612 34 56 78' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', format: '### ### ###', placeholder: '912 345 678' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', format: '### ## ## ##', placeholder: '470 12 34 56' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', format: '### #######', placeholder: '664 1234567' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', format: '### ### ###', placeholder: '512 345 678' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', format: '### ### ###', placeholder: '601 123 456' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺', format: '## ### ####', placeholder: '20 123 4567' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴', format: '### ### ###', placeholder: '712 345 678' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', format: '### ### ####', placeholder: '691 234 5678' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', format: '### ### ## ##', placeholder: '532 123 45 67' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', format: '##-###-####', placeholder: '50-123-4567' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', format: '## ### ####', placeholder: '71 234 5678' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', format: '### ### ####', placeholder: '802 123 4567' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', format: '### ######', placeholder: '712 345678' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', format: '## #### ####', placeholder: '10 1234 5678' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', format: '## #### ####', placeholder: '55 1234 5678' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', format: '(##) #####-####', placeholder: '(11) 91234-5678' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', format: '## ####-####', placeholder: '11 1234-5678' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', format: '# #### ####', placeholder: '9 1234 5678' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', format: '### ### ####', placeholder: '300 123 4567' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', format: '### ### ###', placeholder: '912 345 678' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫', format: '## ### ####', placeholder: '70 123 4567' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱', format: '### ### ###', placeholder: '691 234 567' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿', format: '## ## ## ##', placeholder: '55 12 34 56' },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩', format: '### ###', placeholder: '312 345' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴', format: '### ### ###', placeholder: '923 456 789' },
  { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲', format: '## ######', placeholder: '77 123456' },
  { code: 'AW', name: 'Aruba', dialCode: '+297', flag: '🇦🇼', format: '### ####', placeholder: '560 1234' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿', format: '## ### ## ##', placeholder: '50 123 45 67' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸', format: '###-####', placeholder: '359-1234' },
  { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧', format: '###-####', placeholder: '230-1234' },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾', format: '## ###-##-##', placeholder: '29 123-45-67' },
  { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿', format: '###-####', placeholder: '622-1234' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯', format: '## ## ## ##', placeholder: '97 12 34 56' },
  { code: 'BM', name: 'Bermuda', dialCode: '+1441', flag: '🇧🇲', format: '###-####', placeholder: '292-1234' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹', format: '## ### ###', placeholder: '17 123 456' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴', format: '#### ####', placeholder: '7123 4567' },
  { code: 'BA', name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦', format: '## ###-###', placeholder: '61 123-456' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼', format: '## ### ###', placeholder: '71 234 567' },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳', format: '### ####', placeholder: '712 3456' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', format: '### ### ###', placeholder: '878 123 456' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', format: '## ## ## ##', placeholder: '70 12 34 56' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮', format: '## ## ## ##', placeholder: '79 12 34 56' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭', format: '## ### ###', placeholder: '12 345 678' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲', format: '# ## ## ## ##', placeholder: '6 71 23 45 67' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻', format: '### ## ##', placeholder: '991 23 45' },
  { code: 'KY', name: 'Cayman Islands', dialCode: '+1345', flag: '🇰🇾', format: '###-####', placeholder: '926-1234' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', format: '#### ####', placeholder: '8312 3456' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷', format: '## ### ####', placeholder: '91 234 5678' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺', format: '# #######', placeholder: '5 1234567' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾', format: '## ######', placeholder: '99 123456' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1809', flag: '🇩🇴', format: '###-####', placeholder: '234-5678' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', format: '## ### ####', placeholder: '99 123 4567' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪', format: '#### ####', placeholder: '5123 4567' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹', format: '## ### ####', placeholder: '91 123 4567' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯', format: '### ####', placeholder: '701 2345' },
  { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪', format: '### ## ## ##', placeholder: '599 12 34 56' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', format: '## ### ####', placeholder: '24 123 4567' },
  { code: 'GI', name: 'Gibraltar', dialCode: '+350', flag: '🇬🇮', format: '##### ###', placeholder: '57123 456' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', format: '#### ####', placeholder: '5123 4567' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾', format: '### ####', placeholder: '623 4567' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', format: '####-####', placeholder: '9123-4567' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸', format: '### ####', placeholder: '612 3456' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶', format: '### ### ####', placeholder: '790 123 4567' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲', format: '###-####', placeholder: '312-3456' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', format: '# #### ####', placeholder: '7 9012 3456' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿', format: '(###) ###-##-##', placeholder: '(771) 000-00-00' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻', format: '## ### ###', placeholder: '21 234 567' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', format: '## ### ###', placeholder: '71 123 456' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹', format: '### #####', placeholder: '612 34567' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', format: '### ### ###', placeholder: '621 123 456' },
  { code: 'MO', name: 'Macau', dialCode: '+853', flag: '🇲🇴', format: '#### ####', placeholder: '6612 3456' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹', format: '#### ####', placeholder: '9912 3456' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺', format: '#### ####', placeholder: '5251 2345' },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩', format: '#### ####', placeholder: '6212 3456' },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨', format: '## ## ## ##', placeholder: '06 12 34 56' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳', format: '#### ####', placeholder: '8812 3456' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪', format: '## ### ###', placeholder: '67 123 456' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', format: '## ####-###', placeholder: '65 1234-567' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲', format: '## ### ####', placeholder: '92 501 2345' },
  { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦', format: '####-####', placeholder: '6123-4567' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾', format: '### ### ###', placeholder: '981 123 456' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸', format: '## ###-####', placeholder: '60 123-4567' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰', format: '### ### ###', placeholder: '912 345 678' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮', format: '## ### ###', placeholder: '41 234 567' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿', format: '### ### ###', placeholder: '712 345 678' },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', flag: '🇹🇹', format: '###-####', placeholder: '291-2345' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳', format: '## ### ###', placeholder: '20 123 456' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬', format: '### ### ###', placeholder: '712 345 678' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦', format: '## ### ## ##', placeholder: '50 123 45 67' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', format: '### ### ###', placeholder: '942 345 678' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿', format: '## ### ## ##', placeholder: '90 123 45 67' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', format: '###-#######', placeholder: '412-1234567' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼', format: '## ### ####', placeholder: '77 123 4567' },
];

/**
 * Formats raw digits or phone input string according to a country's formatting mask.
 */
export function formatPhoneNumber(value: string, format?: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  if (!format) {
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 10) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10)}`;
  }

  let formatted = '';
  let digitIndex = 0;

  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    const char = format[i];
    if (char === '#') {
      formatted += digits[digitIndex++];
    } else {
      formatted += char;
    }
  }

  // Append remaining digits if any
  if (digitIndex < digits.length) {
    const remaining = digits.slice(digitIndex);
    formatted += (formatted.length > 0 ? ' ' : '') + remaining;
  }

  return formatted;
}

/**
 * Finds country by dial code or matching phone prefix.
 */
export function findCountryByDialCode(dialCode: string): Country | undefined {
  const clean = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return COUNTRIES.find((c) => c.dialCode === clean);
}

/**
 * Auto-detects country from a given raw phone string input.
 */
export function detectCountryFromPhone(phone: string): { country: Country; localNumber: string } | null {
  if (!phone || !phone.startsWith('+')) return null;
  
  // Sort countries by dialCode length descending to match longer dial codes first (e.g. +1242 before +1)
  const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
  
  for (const country of sorted) {
    if (phone.startsWith(country.dialCode)) {
      const localNumber = phone.slice(country.dialCode.length).trimStart();
      return { country, localNumber };
    }
  }
  
  return null;
}
