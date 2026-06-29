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
        { label: 'Web Development', href: '/services#web-development' },
        { label: 'Cloud Solutions', href: '/services#cloud' },
        { label: 'AI Integration', href: '/services#ai' },
        { label: 'Business Automation', href: '/services#automation' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { label: 'SaaS Platform', href: '/platform' },
        { label: 'Client Portal', href: '/client' },
        { label: 'Help Desk', href: '/support' },
        { label: 'API Reference', href: '/api-docs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Insights Blog', href: '/blog' },
        { label: 'Work Portfolio', href: '/portfolio' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-card border-t border-border/40 py-16 px-6">
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
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Building next-generation, premium software and SaaS solutions for modern tech companies.
          </p>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">Subscribe to Insights</h5>
            <div className="flex gap-2 mt-1">
              <Input type="email" placeholder="you@example.com" className="h-9 text-xs bg-background/55" />
              <Button size="sm" className="h-9 text-xs font-semibold px-4">Join</Button>
            </div>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col gap-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{column.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Support contacts */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Contacts</h4>
          <p className="text-sm text-muted-foreground">
            100 Pine Street<br />
            San Francisco, CA 94111
          </p>
          <a href="mailto:info@astraiv.com" className="text-sm font-semibold text-primary hover:underline">
            info@astraiv.com
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} Astraiv Technologies. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <GithubIcon className="h-4 w-4" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <TwitterIcon className="h-4 w-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
