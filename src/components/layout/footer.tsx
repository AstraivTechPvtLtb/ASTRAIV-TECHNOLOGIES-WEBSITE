import { Link } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
        {label: 'Portfolio', href: '/portfolio' },
        { label: 'Flexible Pricing', href: '/#pricing' },
        { label: 'Frequently Asked Qs', href: '/#faq' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-900 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-12">
        {/* Brand details and newsletter */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6 text-left">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-full.png"
              alt="Astraiv Technologies Logo"
              width={150}
              height={45}
              className="object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
          
          <p className="text-sm text-slate-400 leading-relaxed">
            Building next-generation, premium software and SaaS solutions for modern tech companies.
          </p>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">Subscribe to Insights</h5>
            <div className="flex gap-2 mt-1">
              <Input type="email" placeholder="you@example.com" className="h-9 text-xs bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-secondary" />
              <Button size="sm" className="h-9 text-xs font-semibold px-4 bg-secondary hover:bg-secondary/90 text-white">Join</Button>
            </div>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col gap-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{column.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Support contacts */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Contacts</h4>
          <p className="text-sm text-slate-400">
            100 Pine Street<br />
            San Francisco, CA 94111
          </p>
          <a href="mailto:info@astraiv.com" className="text-sm font-semibold text-accent hover:underline">
            info@astraiv.com
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          &copy; {currentYear} Astraiv Technologies. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors">
            <GithubIcon className="h-4 w-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors">
            <TwitterIcon className="h-4 w-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-100 transition-colors">
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
