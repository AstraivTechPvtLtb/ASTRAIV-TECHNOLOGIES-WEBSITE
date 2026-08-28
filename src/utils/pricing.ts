export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  country: string;
  flag: string;
  locale: string;
  rate: number; // approximate rate relative to USD
  customStarterMonthly?: number;
  customStarterYearly?: number;
  customProMonthly?: number;
  customProYearly?: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    country: 'India',
    flag: '🇮🇳',
    locale: 'en-IN',
    rate: 86.5,
    customStarterMonthly: 399999,
    customStarterYearly: 319999,
    customProMonthly: 799999,
    customProYearly: 639999,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    flag: '🇺🇸',
    locale: 'en-US',
    rate: 1,
    customStarterMonthly: 4999,
    customStarterYearly: 3999,
    customProMonthly: 9999,
    customProYearly: 7999,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    flag: '🇬🇧',
    locale: 'en-GB',
    rate: 0.79,
    customStarterMonthly: 3999,
    customStarterYearly: 3199,
    customProMonthly: 7999,
    customProYearly: 6399,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'European Union',
    flag: '🇪🇺',
    locale: 'en-IE',
    rate: 0.92,
    customStarterMonthly: 4599,
    customStarterYearly: 3699,
    customProMonthly: 9199,
    customProYearly: 7399,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    country: 'Canada',
    flag: '🇨🇦',
    locale: 'en-CA',
    rate: 1.38,
    customStarterMonthly: 6899,
    customStarterYearly: 5499,
    customProMonthly: 13799,
    customProYearly: 10999,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    country: 'Australia',
    flag: '🇦🇺',
    locale: 'en-AU',
    rate: 1.55,
    customStarterMonthly: 7749,
    customStarterYearly: 6199,
    customProMonthly: 15499,
    customProYearly: 12399,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    name: 'UAE Dirham',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    locale: 'en-AE',
    rate: 3.67,
    customStarterMonthly: 18350,
    customStarterYearly: 14680,
    customProMonthly: 36700,
    customProYearly: 29360,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    name: 'Saudi Riyal',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    locale: 'ar-SA',
    rate: 3.75,
    customStarterMonthly: 18750,
    customStarterYearly: 15000,
    customProMonthly: 37500,
    customProYearly: 30000,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    country: 'Singapore',
    flag: '🇸🇬',
    locale: 'en-SG',
    rate: 1.35,
    customStarterMonthly: 6750,
    customStarterYearly: 5400,
    customProMonthly: 13500,
    customProYearly: 10800,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    country: 'Japan',
    flag: '🇯🇵',
    locale: 'ja-JP',
    rate: 155,
    customStarterMonthly: 775000,
    customStarterYearly: 620000,
    customProMonthly: 1550000,
    customProYearly: 1240000,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    country: 'Switzerland',
    flag: '🇨🇭',
    locale: 'de-CH',
    rate: 0.90,
    customStarterMonthly: 4499,
    customStarterYearly: 3599,
    customProMonthly: 8999,
    customProYearly: 7199,
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    country: 'Brazil',
    flag: '🇧🇷',
    locale: 'pt-BR',
    rate: 5.80,
    customStarterMonthly: 28999,
    customStarterYearly: 23199,
    customProMonthly: 57999,
    customProYearly: 46399,
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    country: 'China',
    flag: '🇨🇳',
    locale: 'zh-CN',
    rate: 7.25,
    customStarterMonthly: 35999,
    customStarterYearly: 28799,
    customProMonthly: 71999,
    customProYearly: 57599,
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    country: 'South Korea',
    flag: '🇰🇷',
    locale: 'ko-KR',
    rate: 1400,
    customStarterMonthly: 6990000,
    customStarterYearly: 5590000,
    customProMonthly: 13990000,
    customProYearly: 11190000,
  },
  NZD: {
    code: 'NZD',
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    country: 'New Zealand',
    flag: '🇳🇿',
    locale: 'en-NZ',
    rate: 1.72,
    customStarterMonthly: 8599,
    customStarterYearly: 6879,
    customProMonthly: 17199,
    customProYearly: 13759,
  },
  MXN: {
    code: 'MXN',
    symbol: 'MX$',
    name: 'Mexican Peso',
    country: 'Mexico',
    flag: '🇲🇽',
    locale: 'es-MX',
    rate: 20.2,
    customStarterMonthly: 99990,
    customStarterYearly: 79990,
    customProMonthly: 199990,
    customProYearly: 159990,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    country: 'South Africa',
    flag: '🇿🇦',
    locale: 'en-ZA',
    rate: 18.2,
    customStarterMonthly: 89990,
    customStarterYearly: 71990,
    customProMonthly: 179990,
    customProYearly: 143990,
  },
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    country: 'Turkey',
    flag: '🇹🇷',
    locale: 'tr-TR',
    rate: 36.0,
    customStarterMonthly: 179990,
    customStarterYearly: 143990,
    customProMonthly: 359990,
    customProYearly: 287990,
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    country: 'Sweden',
    flag: '🇸🇪',
    locale: 'sv-SE',
    rate: 10.8,
    customStarterMonthly: 53990,
    customStarterYearly: 43190,
    customProMonthly: 107990,
    customProYearly: 86390,
  },
  NOK: {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Krone',
    country: 'Norway',
    flag: '🇳🇴',
    locale: 'nb-NO',
    rate: 11.0,
    customStarterMonthly: 54990,
    customStarterYearly: 43990,
    customProMonthly: 109990,
    customProYearly: 87990,
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    country: 'Denmark',
    flag: '🇩🇰',
    locale: 'da-DK',
    rate: 6.9,
    customStarterMonthly: 34490,
    customStarterYearly: 27590,
    customProMonthly: 68990,
    customProYearly: 55190,
  },
  PLN: {
    code: 'PLN',
    symbol: 'zł',
    name: 'Polish Zloty',
    country: 'Poland',
    flag: '🇵🇱',
    locale: 'pl-PL',
    rate: 4.0,
    customStarterMonthly: 19990,
    customStarterYearly: 15990,
    customProMonthly: 39990,
    customProYearly: 31990,
  },
  IDR: {
    code: 'IDR',
    symbol: 'Rp',
    name: 'Indonesian Rupiah',
    country: 'Indonesia',
    flag: '🇮🇩',
    locale: 'id-ID',
    rate: 16000,
    customStarterMonthly: 79990000,
    customStarterYearly: 63990000,
    customProMonthly: 159990000,
    customProYearly: 127990000,
  },
  THB: {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    country: 'Thailand',
    flag: '🇹🇭',
    locale: 'th-TH',
    rate: 35.0,
    customStarterMonthly: 174990,
    customStarterYearly: 139990,
    customProMonthly: 349990,
    customProYearly: 279990,
  },
  MYR: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit',
    country: 'Malaysia',
    flag: '🇲🇾',
    locale: 'ms-MY',
    rate: 4.5,
    customStarterMonthly: 22490,
    customStarterYearly: 17990,
    customProMonthly: 44990,
    customProYearly: 35990,
  },
  PHP: {
    code: 'PHP',
    symbol: '₱',
    name: 'Philippine Peso',
    country: 'Philippines',
    flag: '🇵🇭',
    locale: 'en-PH',
    rate: 58.0,
    customStarterMonthly: 289990,
    customStarterYearly: 231990,
    customProMonthly: 579990,
    customProYearly: 463990,
  },
  VND: {
    code: 'VND',
    symbol: '₫',
    name: 'Vietnamese Dong',
    country: 'Vietnam',
    flag: '🇻🇳',
    locale: 'vi-VN',
    rate: 25400,
    customStarterMonthly: 126990000,
    customStarterYearly: 101590000,
    customProMonthly: 253990000,
    customProYearly: 203190000,
  },
  BDT: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    country: 'Bangladesh',
    flag: '🇧🇩',
    locale: 'bn-BD',
    rate: 120,
    customStarterMonthly: 599900,
    customStarterYearly: 479900,
    customProMonthly: 1199900,
    customProYearly: 959900,
  },
  PKR: {
    code: 'PKR',
    symbol: '₨',
    name: 'Pakistani Rupee',
    country: 'Pakistan',
    flag: '🇵🇰',
    locale: 'ur-PK',
    rate: 278,
    customStarterMonthly: 1389900,
    customStarterYearly: 1111900,
    customProMonthly: 2779900,
    customProYearly: 2223900,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    country: 'Nigeria',
    flag: '🇳🇬',
    locale: 'en-NG',
    rate: 1550,
    customStarterMonthly: 7749000,
    customStarterYearly: 6199000,
    customProMonthly: 15499000,
    customProYearly: 12399000,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    country: 'Kenya',
    flag: '🇰🇪',
    locale: 'en-KE',
    rate: 129,
    customStarterMonthly: 644900,
    customStarterYearly: 515900,
    customProMonthly: 1289900,
    customProYearly: 1031900,
  },
  EGP: {
    code: 'EGP',
    symbol: 'E£',
    name: 'Egyptian Pound',
    country: 'Egypt',
    flag: '🇪🇬',
    locale: 'ar-EG',
    rate: 50,
    customStarterMonthly: 249950,
    customStarterYearly: 199950,
    customProMonthly: 499950,
    customProYearly: 399950,
  },
  HKD: {
    code: 'HKD',
    symbol: 'HK$',
    name: 'Hong Kong Dollar',
    country: 'Hong Kong',
    flag: '🇭🇰',
    locale: 'zh-HK',
    rate: 7.78,
    customStarterMonthly: 38890,
    customStarterYearly: 31090,
    customProMonthly: 77790,
    customProYearly: 62190,
  },
  TWD: {
    code: 'TWD',
    symbol: 'NT$',
    name: 'New Taiwan Dollar',
    country: 'Taiwan',
    flag: '🇹🇼',
    locale: 'zh-TW',
    rate: 32.5,
    customStarterMonthly: 162490,
    customStarterYearly: 129990,
    customProMonthly: 324990,
    customProYearly: 259990,
  },
  ILS: {
    code: 'ILS',
    symbol: '₪',
    name: 'Israeli Shekel',
    country: 'Israel',
    flag: '🇮🇱',
    locale: 'he-IL',
    rate: 3.65,
    customStarterMonthly: 18250,
    customStarterYearly: 14600,
    customProMonthly: 36500,
    customProYearly: 29200,
  },
  CLP: {
    code: 'CLP',
    symbol: 'CLP$',
    name: 'Chilean Peso',
    country: 'Chile',
    flag: '🇨🇱',
    locale: 'es-CL',
    rate: 960,
    customStarterMonthly: 4799000,
    customStarterYearly: 3839000,
    customProMonthly: 9599000,
    customProYearly: 7679000,
  },
  COP: {
    code: 'COP',
    symbol: 'COL$',
    name: 'Colombian Peso',
    country: 'Colombia',
    flag: '🇨🇴',
    locale: 'es-CO',
    rate: 4150,
    customStarterMonthly: 20745000,
    customStarterYearly: 16595000,
    customProMonthly: 41490000,
    customProYearly: 33190000,
  },
};

/**
 * Maps common time zones to supported currency codes.
 */
const TIMEZONE_TO_CURRENCY: Record<string, string> = {
  // India
  'Asia/Kolkata': 'INR',
  'Asia/Calcutta': 'INR',
  
  // UK
  'Europe/London': 'GBP',
  'Europe/Belfast': 'GBP',
  
  // Europe (EUR)
  'Europe/Paris': 'EUR',
  'Europe/Berlin': 'EUR',
  'Europe/Rome': 'EUR',
  'Europe/Madrid': 'EUR',
  'Europe/Amsterdam': 'EUR',
  'Europe/Brussels': 'EUR',
  'Europe/Vienna': 'EUR',
  'Europe/Dublin': 'EUR',
  'Europe/Helsinki': 'EUR',
  'Europe/Athens': 'EUR',
  'Europe/Lisbon': 'EUR',
  
  // USA & Americas
  'America/New_York': 'USD',
  'America/Chicago': 'USD',
  'America/Denver': 'USD',
  'America/Los_Angeles': 'USD',
  'America/Phoenix': 'USD',
  'America/Anchorage': 'USD',
  'America/Honolulu': 'USD',
  'America/Detroit': 'USD',
  'America/Indianapolis': 'USD',
  
  // Canada
  'America/Toronto': 'CAD',
  'America/Vancouver': 'CAD',
  'America/Montreal': 'CAD',
  'America/Edmonton': 'CAD',
  'America/Winnipeg': 'CAD',
  'America/Halifax': 'CAD',

  // Australia
  'Australia/Sydney': 'AUD',
  'Australia/Melbourne': 'AUD',
  'Australia/Brisbane': 'AUD',
  'Australia/Perth': 'AUD',
  'Australia/Adelaide': 'AUD',
  'Australia/Hobart': 'AUD',

  // Japan
  'Asia/Tokyo': 'JPY',

  // UAE
  'Asia/Dubai': 'AED',
  'Asia/Muscat': 'AED',

  // Saudi Arabia
  'Asia/Riyadh': 'SAR',

  // Singapore
  'Asia/Singapore': 'SGD',

  // Switzerland
  'Europe/Zurich': 'CHF',
  'Europe/Geneva': 'CHF',

  // Brazil
  'America/Sao_Paulo': 'BRL',
  'America/Rio_Branco': 'BRL',
  'America/Manaus': 'BRL',
  'America/Fortaleza': 'BRL',

  // China
  'Asia/Shanghai': 'CNY',
  'Asia/Chongqing': 'CNY',
  'Asia/Urumqi': 'CNY',

  // South Korea
  'Asia/Seoul': 'KRW',

  // New Zealand
  'Pacific/Auckland': 'NZD',
  'Pacific/Chatham': 'NZD',

  // Mexico
  'America/Mexico_City': 'MXN',
  'America/Cancun': 'MXN',
  'America/Monterrey': 'MXN',

  // South Africa
  'Africa/Johannesburg': 'ZAR',

  // Turkey
  'Europe/Istanbul': 'TRY',

  // Sweden
  'Europe/Stockholm': 'SEK',

  // Norway
  'Europe/Oslo': 'NOK',

  // Denmark
  'Europe/Copenhagen': 'DKK',

  // Poland
  'Europe/Warsaw': 'PLN',

  // Indonesia
  'Asia/Jakarta': 'IDR',
  'Asia/Makassar': 'IDR',
  'Asia/Jayapura': 'IDR',

  // Thailand
  'Asia/Bangkok': 'THB',

  // Malaysia
  'Asia/Kuala_Lumpur': 'MYR',

  // Philippines
  'Asia/Manila': 'PHP',

  // Vietnam
  'Asia/Ho_Chi_Minh': 'VND',

  // Bangladesh
  'Asia/Dhaka': 'BDT',

  // Pakistan
  'Asia/Karachi': 'PKR',

  // Nigeria
  'Africa/Lagos': 'NGN',

  // Kenya
  'Africa/Nairobi': 'KES',

  // Egypt
  'Africa/Cairo': 'EGP',

  // Hong Kong
  'Asia/Hong_Kong': 'HKD',

  // Taiwan
  'Asia/Taipei': 'TWD',

  // Israel
  'Asia/Jerusalem': 'ILS',

  // Chile
  'America/Santiago': 'CLP',

  // Colombia
  'America/Bogota': 'COP',
};

/**
 * Maps country code suffixes from navigator.language (e.g. "en-IN" -> "IN") to currency codes.
 */
const COUNTRY_CODE_TO_CURRENCY: Record<string, string> = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  UK: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  PT: 'EUR',
  CA: 'CAD',
  AU: 'AUD',
  AE: 'AED',
  SA: 'SAR',
  SG: 'SGD',
  JP: 'JPY',
  CH: 'CHF',
  BR: 'BRL',
  CN: 'CNY',
  KR: 'KRW',
  NZ: 'NZD',
  MX: 'MXN',
  ZA: 'ZAR',
  TR: 'TRY',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  PL: 'PLN',
  ID: 'IDR',
  TH: 'THB',
  MY: 'MYR',
  PH: 'PHP',
  VN: 'VND',
  BD: 'BDT',
  PK: 'PKR',
  NG: 'NGN',
  KE: 'KES',
  EG: 'EGP',
  HK: 'HKD',
  TW: 'TWD',
  IL: 'ILS',
  CL: 'CLP',
  CO: 'COP',
};

/**
 * Detects the user's currency based on time zone and browser locale.
 */
export function detectUserCurrency(): string {
  if (typeof window === 'undefined') {
    return 'USD';
  }

  // 1. Try resolving via TimeZone
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone) {
      if (TIMEZONE_TO_CURRENCY[timeZone]) {
        return TIMEZONE_TO_CURRENCY[timeZone];
      }
      
      // Secondary check for partial timezone matches (e.g. "Europe/...")
      if (timeZone.startsWith('Europe/')) {
        return 'EUR';
      }
      if (timeZone.startsWith('America/')) {
        return 'USD';
      }
      if (timeZone.startsWith('Australia/')) {
        return 'AUD';
      }
    }
  } catch {
    // Ignore timezone resolution error
  }

  // 2. Try resolving via navigator.languages or navigator.language
  try {
    const languages = (navigator.languages && navigator.languages.length > 0)
      ? navigator.languages
      : [navigator.language || ''];

    for (const lang of languages) {
      if (!lang) continue;
      
      // Match locale suffix like "en-IN", "hi-IN", "en-GB"
      const parts = lang.split(/[-_]/);
      if (parts.length > 1) {
        const country = parts[parts.length - 1].toUpperCase();
        if (COUNTRY_CODE_TO_CURRENCY[country]) {
          return COUNTRY_CODE_TO_CURRENCY[country];
        }
      }
      
      // Language code checks
      const primaryLang = parts[0].toLowerCase();
      if (primaryLang === 'hi' || primaryLang === 'bn' || primaryLang === 'ta' || primaryLang === 'te' || primaryLang === 'mr' || primaryLang === 'gu') {
        return 'INR';
      }
      if (primaryLang === 'ja') return 'JPY';
      if (primaryLang === 'ko') return 'KRW';
    }
  } catch {
    // Ignore locale resolution error
  }

  return 'USD';
}

/**
 * Formats a localized price for a given currency and plan type.
 */
export function getPlanPrice(
  currencyCode: string,
  plan: 'starter' | 'pro',
  billingCycle: 'monthly' | 'yearly'
): string {
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;

  let amount: number;

  if (plan === 'starter') {
    if (billingCycle === 'monthly') {
      amount = currency.customStarterMonthly ?? Math.round(4999 * currency.rate);
    } else {
      amount = currency.customStarterYearly ?? Math.round(3999 * currency.rate);
    }
  } else {
    if (billingCycle === 'monthly') {
      amount = currency.customProMonthly ?? Math.round(9999 * currency.rate);
    } else {
      amount = currency.customProYearly ?? Math.round(7999 * currency.rate);
    }
  }

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
}
