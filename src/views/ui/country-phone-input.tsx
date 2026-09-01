'use client';

import * as React from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { COUNTRIES, Country, detectCountryFromPhone, formatPhoneNumber } from '@/lib/countries';
import { cn } from '@/lib/utils';

export interface CountryPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  name?: string;
}

export const CountryPhoneInput = React.forwardRef<HTMLInputElement, CountryPhoneInputProps>(
  (
    {
      value = '',
      onChange,
      placeholder,
      className,
      disabled = false,
      error = false,
      id,
      name,
    },
    ref
  ) => {
    // Default country: India (+91)
    const defaultCountry = COUNTRIES.find((c) => c.code === 'IN') || COUNTRIES[0];
    const [selectedCountry, setSelectedCountry] = React.useState<Country>(defaultCountry);
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Dynamic placeholder based on selected country if not explicitly specified
    const activePlaceholder = placeholder || selectedCountry.placeholder || '98765 43210';

    // Synchronize initial value or externally controlled value
    React.useEffect(() => {
      if (value) {
        const detected = detectCountryFromPhone(value);
        if (detected) {
          setSelectedCountry(detected.country);
          const formatted = formatPhoneNumber(detected.localNumber, detected.country.format);
          setPhoneNumber(formatted);
          return;
        }
        // If value starts with current country dialCode
        if (value.startsWith(selectedCountry.dialCode)) {
          const raw = value.slice(selectedCountry.dialCode.length).trimStart();
          const formatted = formatPhoneNumber(raw, selectedCountry.format);
          setPhoneNumber(formatted);
        } else {
          const formatted = formatPhoneNumber(value, selectedCountry.format);
          setPhoneNumber(formatted);
        }
      } else {
        setPhoneNumber('');
      }
    }, [value, selectedCountry.dialCode, selectedCountry.format]);

    // Handle outside clicks to close the dropdown
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        // Focus search input when open
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    // Update parent with full formatted phone number
    const triggerChange = (country: Country, formattedNumber: string) => {
      const trimmed = formattedNumber.trim();
      const fullValue = trimmed ? `${country.dialCode} ${trimmed}` : '';
      onChange?.(fullValue);
    };

    // When phone input changes
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputVal = e.target.value;

      // Auto-detect country if user types/pastes a + dial code
      if (inputVal.startsWith('+')) {
        const detected = detectCountryFromPhone(inputVal);
        if (detected) {
          setSelectedCountry(detected.country);
          const formatted = formatPhoneNumber(detected.localNumber, detected.country.format);
          setPhoneNumber(formatted);
          triggerChange(detected.country, formatted);
          return;
        }
      }

      // Handle backspace when user deletes punctuation mask characters
      let rawDigits = inputVal.replace(/\D/g, '');
      const prevDigits = phoneNumber.replace(/\D/g, '');
      if (inputVal.length < phoneNumber.length && rawDigits === prevDigits && rawDigits.length > 0) {
        rawDigits = rawDigits.slice(0, -1);
      }

      const formatted = formatPhoneNumber(rawDigits, selectedCountry.format);
      setPhoneNumber(formatted);
      triggerChange(selectedCountry, formatted);
    };

    // When a country is selected from dropdown
    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      setSearchQuery('');
      
      // Automatically re-format existing number with the new country format
      const rawDigits = phoneNumber.replace(/\D/g, '');
      const newFormatted = rawDigits ? formatPhoneNumber(rawDigits, country.format) : '';
      setPhoneNumber(newFormatted);
      triggerChange(country, newFormatted);
    };

    // Filter countries based on search query
    const filteredCountries = React.useMemo(() => {
      if (!searchQuery.trim()) return COUNTRIES;
      const query = searchQuery.toLowerCase().trim();
      return COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.dialCode.includes(query) ||
          c.code.toLowerCase().includes(query)
      );
    }, [searchQuery]);

    return (
      <div ref={containerRef} className="relative w-full">
        <div
          className={cn(
            'flex items-stretch h-11 w-full rounded-lg border transition-all duration-200 overflow-hidden',
            'bg-slate-100/40 hover:bg-slate-100/60 focus-within:bg-white',
            'dark:bg-slate-950/40 dark:hover:bg-slate-950/60 dark:focus-within:bg-slate-950/90',
            'border-slate-200 dark:border-slate-800',
            'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:focus-within:ring-primary/30',
            error ? 'border-destructive focus-within:ring-destructive/30' : '',
            disabled ? 'opacity-50 pointer-events-none' : '',
            className
          )}
        >
          {/* Country Selector Trigger */}
          <button
            type="button"
            id="country-code-selector"
            aria-label="Select country code"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-200/50 dark:bg-slate-900/60 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 text-foreground border-r border-slate-200 dark:border-slate-800 transition-colors shrink-0 text-sm font-medium select-none cursor-pointer outline-none"
          >
            <span className="text-base leading-none" role="img" aria-label={selectedCountry.name}>
              {selectedCountry.flag}
            </span>
            <span className="text-xs font-semibold text-foreground/90 tracking-tight">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                isOpen ? 'rotate-180 text-foreground' : ''
              )}
            />
          </button>

          {/* Local Phone Number Input */}
          <input
            ref={ref}
            type="tel"
            id={id}
            name={name}
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={activePlaceholder}
            disabled={disabled}
            className="flex-1 bg-transparent px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 dark:placeholder:text-muted-foreground/50 outline-none border-0 w-full min-w-0 font-normal selection:bg-primary/20 selection:text-foreground"
          />
        </div>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-72 sm:w-84 rounded-xl border border-slate-200/80 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-2 animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Search Box */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full h-9 pl-8 pr-3 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Countries List */}
            <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No country found matching &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = c.code === selectedCountry.code;
                  return (
                    <button
                      key={`${c.code}-${c.dialCode}`}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left cursor-pointer',
                        isSelected
                          ? 'bg-primary/15 text-primary font-bold dark:bg-primary/25 dark:text-primary-foreground'
                          : 'text-foreground/90 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-base shrink-0 leading-none">{c.flag}</span>
                        <span className="truncate text-foreground font-medium">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          ({c.code})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="font-semibold text-xs text-muted-foreground">
                          {c.dialCode}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CountryPhoneInput.displayName = 'CountryPhoneInput';
