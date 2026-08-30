'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { SectionHeader } from './section-header';
import { PricingCard } from './pricing-card';
import { detectUserCurrency, getPlanPrice, SUPPORTED_CURRENCIES, CurrencyConfig } from '@/utils/pricing';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Detect user region/currency on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('astraiv_pricing_currency');
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        setCurrencyCode(saved);
      } else {
        const detected = detectUserCurrency();
        if (SUPPORTED_CURRENCIES[detected]) {
          setCurrencyCode(detected);
        }
      }
    } catch {
      // Fallback silently if storage is unavailable
    }
  }, []);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isDropdownOpen]);

  const handleCurrencyChange = (newCode: string) => {
    setCurrencyCode(newCode);
    setIsDropdownOpen(false);
    try {
      localStorage.setItem('astraiv_pricing_currency', newCode);
    } catch {
      // ignore localStorage errors
    }
  };

  const currentCurrency: CurrencyConfig = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;

  const starterPrice = mounted
    ? getPlanPrice(currencyCode, 'starter', billingCycle)
    : billingCycle === 'monthly' ? '$4,999' : '$3,999';

  const proPrice = mounted
    ? getPlanPrice(currencyCode, 'pro', billingCycle)
    : billingCycle === 'monthly' ? '$9,999' : '$7,999';

  const filteredCurrencies = Object.values(SUPPORTED_CURRENCIES).filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
    );
  });

  const plans = [
    {
      name: 'Starter Plan',
      price: starterPrice,
      description: 'Ideal for early-stage startups needing a premium marketing website and brand system.',
      features: [
        'Custom Web Design (Framer/Next.js)',
        'SEO & Performance Tuning',
        'Standard Contact Integrations',
        '2 rounds of layout revisions',
        'Production Deployment & CI/CD',
        'Dedicated Email Support',
      ],
      buttonText: 'Start Building',
    },
    {
      name: 'Professional Plan',
      price: proPrice,
      description: 'Our most popular plan, covering custom web applications, SaaS dashboards, and database setup.',
      features: [
        'Everything in Starter',
        'SaaS Dashboard & User Login',
        'Prisma & Postgres integrations',
        'Stripe payment stub setup',
        '2 weeks post-launch SLA support',
        'Dedicated Slack support channel',
      ],
      buttonText: 'Hire Our Architects',
      isPopular: true,
    },
    {
      name: 'Enterprise Plan',
      price: 'Custom',
      description: 'For companies requiring dedicated cloud infrastructure, AI integrations, and full SLA support.',
      features: [
        'Custom AI & Agent workflow stubs',
        'Cloudflare R2 CDNs config',
        'AWS load-balanced hosting setup',
        'Role-Based admin dashboards',
        'Priority SLA 24/7 Response time',
        'Unlimited revision approvals',
      ],
      buttonText: 'Book a Consultation',
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 px-6 bg-transparent border-y border-border/20 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Pricing"
          title="Flexible Engagement Models"
          description="Choose a plan that matches your engineering velocity. No hidden contracts, completely transparent timelines."
        />

        {/* Controls: Region Currency Selector & Billing Cycle Toggle */}
        <div className="flex flex-col items-center justify-center gap-5 mt-10 mb-8">
          
          {/* Custom Region / Currency selector badge (No native select flicker or text clipping) */}
          <div
            className="relative"
            ref={dropdownRef}
          >
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium bg-card/90 dark:bg-slate-800/90 hover:bg-muted/80 dark:hover:bg-slate-700/80 border border-border shadow-xs text-foreground backdrop-blur-md transition-all cursor-pointer select-none"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-label="Select pricing currency"
            >
              <Globe className="w-3.5 h-3.5 text-primary dark:text-accent shrink-0" />
              <span className="text-muted-foreground hidden sm:inline">Pricing for:</span>
              <span className="text-sm shrink-0 leading-none">{currentCurrency.flag}</span>
              <span className="font-semibold text-foreground">{currentCurrency.country}</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground/80">
                {currentCurrency.code} {currentCurrency.symbol}
              </span>
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.div>
            </button>

            {/* Custom Animated Currency Dropdown List */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 sm:w-84 max-w-[90vw] z-50 bg-white/98 dark:bg-slate-900/98 border border-border rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/60 backdrop-blur-2xl overflow-hidden flex flex-col"
                  role="listbox"
                >
                  {/* Search Input */}
                  <div className="p-2.5 border-b border-border/60 bg-muted/30 dark:bg-slate-950/40">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search country or currency..."
                        className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg bg-card dark:bg-slate-800/80 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary dark:focus:ring-accent"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Currencies List */}
                  <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 overscroll-contain">
                    {filteredCurrencies.length > 0 ? (
                      filteredCurrencies.map((c) => {
                        const isSelected = c.code === currencyCode;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleCurrencyChange(c.code)}
                            role="option"
                            aria-selected={isSelected}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent font-semibold'
                                : 'text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/70'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className="text-base shrink-0 leading-none">{c.flag}</span>
                              <span className="truncate text-foreground font-medium">{c.country}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground">
                                {c.code} {c.symbol}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-primary dark:text-accent shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        No currencies found matching &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              aria-label="Toggle billing cycle"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-xs rounded-full p-1 transition-colors duration-300 relative focus:outline-hidden cursor-pointer"
            >
              <motion.div
                layout
                className="w-6 h-6 bg-primary dark:bg-accent rounded-full"
                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-md border border-emerald-500/20">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="h-full flex flex-col"
            >
              <PricingCard
                name={plan.name}
                price={plan.price}
                period={billingCycle === 'monthly' ? '/mo' : '/yr'}
                description={plan.description}
                features={plan.features}
                buttonText={plan.buttonText}
                isPopular={plan.isPopular}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
