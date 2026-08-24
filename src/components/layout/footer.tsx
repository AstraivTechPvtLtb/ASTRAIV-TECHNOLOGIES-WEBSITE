import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/icons';

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
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-900 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 items-start text-left">
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

        {/* Support contacts Column */}
        <div className="flex flex-col text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 min-h-[20px] flex items-center">
            Contacts
          </h4>
          <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-400">
            <p className="leading-relaxed">
              100 Pine Street<br />
              San Francisco, CA 94111
            </p>
            <a href="mailto:info@astraiv.com" className="font-semibold text-accent hover:underline">
              info@astraiv.com
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
