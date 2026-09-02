import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/views/ui/icons';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Services',
      links: [
        { label: 'AI Solutions & RAG', href: '/#services' },
        { label: 'SaaS Development', href: '/#services' },
        { label: 'Custom Systems', href: '/#services' },
        { label: 'Cloud & Infrastructure', href: '/#services' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { label: 'Why Astraiv', href: '/#why-us' },
        { label: 'Industries We Serve', href: '/#industries' },
        { label: 'Our Technologies', href: '/technology#technologies' },
        { label: 'AI Capabilities', href: '/technology#ai-expertise' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Development Process', href: '/#process' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Flexible Pricing', href: '/#pricing' },
        { label: 'Frequently Asked Qs', href: '/faq' },
      ],
    },
  ];

  return (
    <footer className="relative z-30 bg-slate-950 text-slate-100 border-t border-slate-900 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_1.5fr] gap-8 lg:gap-8 xl:gap-10 items-start text-left">
        {/* Brand details and social icons (Left Column) */}
        <div className="flex flex-col gap-4 text-left">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-full.png"
              alt="Astraiv Technologies Logo"
              width={140}
              height={40}
              className="object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Your trusted partner for AI, enterprise software, and scalable cloud systems.
          </p>

          <div className="flex items-center gap-2.5 mt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent text-slate-400 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <TwitterIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent text-slate-400 flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-accent hover:text-accent text-slate-400 flex items-center justify-center transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Link columns with aligned headers & uniform line height */}
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 min-h-[20px] flex items-center">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-3">
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href={link.href} className="text-xs sm:text-sm text-slate-400 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Support contacts */}
        <div className="flex flex-col text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 min-h-[20px] flex items-center">
            Contact Us
          </h4>
          <div className="flex flex-col gap-3.5">
            {/* Call */}
            <a
              href="tel:+918167409664"
              className="flex items-center gap-3 group text-left transition-colors"
            >
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-accent/10 text-accent border border-accent/20 group-hover:bg-accent group-hover:text-slate-950 group-hover:border-accent group-hover:scale-105 transition-all duration-300 shadow-xs">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 group-hover:text-accent transition-colors">
                  Call Us
                </span>
                <span className="text-xs lg:text-[13px] xl:text-sm text-slate-400 group-hover:text-slate-200 transition-colors font-medium whitespace-nowrap">
                  +91 8167409664
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@astraivtechnologies.com"
              className="flex items-center gap-3 group text-left transition-colors"
            >
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-accent/10 text-accent border border-accent/20 group-hover:bg-accent group-hover:text-slate-950 group-hover:border-accent group-hover:scale-105 transition-all duration-300 shadow-xs">
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 group-hover:text-accent transition-colors">
                  Send Email
                </span>
                <span className="text-xs lg:text-[13px] xl:text-sm text-slate-400 group-hover:text-slate-200 transition-colors font-medium whitespace-nowrap">
                  info@astraivtechnologies.com
                </span>
              </div>
            </a>

            {/* Address */}
            <a
              href="https://maps.google.com/?q=Ashoknagar,+Kolkata"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group text-left transition-colors"
            >
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-accent/10 text-accent border border-accent/20 group-hover:bg-accent group-hover:text-slate-950 group-hover:border-accent group-hover:scale-105 transition-all duration-300 shadow-xs">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 group-hover:text-accent transition-colors">
                  Address
                </span>
                <span className="text-xs lg:text-[13px] xl:text-sm text-slate-400 group-hover:text-slate-200 transition-colors font-medium whitespace-nowrap">
                  Ashoknagar, Kolkata
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          &copy; {currentYear} Astraiv Technologies. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <Link href="/faq" className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/faq" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
