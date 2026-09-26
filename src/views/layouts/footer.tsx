import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { SocialPlatformIcon } from '@/views/ui/icons';
import { Phone, Mail, MapPin } from 'lucide-react';
import { getPublicFooterData } from '@/controllers/footer.controller';
import { ROUTES } from '@/routes';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const footerData = await getPublicFooterData();

  const columns = [
    {
      title: 'Services',
      links: [
        { label: 'AI Development', href: '/services/ai-development' },
        { label: 'Custom Software', href: '/services/custom-software' },
        { label: 'Web Applications', href: '/services/web-development' },
        { label: 'Cloud Engineering', href: '/services/cloud-engineering' },
        { label: 'DevOps & CI/CD', href: '/services/devops' },
        { label: 'UI/UX Design', href: '/services/ui-ux-design' },
        { label: 'Explore Services', href: ROUTES.PUBLIC.SERVICES },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'AI & Business Automation', href: '/solutions/ai-business-automation' },
        { label: 'Cloud Modernization', href: '/solutions/legacy-modernization' },
        { label: 'Enterprise SaaS Platforms', href: '/solutions/saas-platforms' },
        { label: 'Data & Analytics', href: '/solutions/data-analytics' },
        { label: 'Workflow Automation', href: '/solutions/business-process-automation' },
        { label: 'Explore Solutions', href: ROUTES.PUBLIC.SOLUTIONS },
      ],
    },
    {
      title: 'Work & Trust',
      links: [
        { label: 'Featured Case Studies', href: ROUTES.PUBLIC.CASE_STUDIES },
        { label: 'Client Testimonials', href: ROUTES.PUBLIC.WORK_TESTIMONIALS },
        { label: 'Rewards & Accolades', href: ROUTES.PUBLIC.REWARDS_ACCOLADES },
        { label: 'Industries We Serve', href: ROUTES.PUBLIC.INDUSTRIES },
        { label: 'Client Portal', href: ROUTES.PUBLIC.CLIENT_PORTAL },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Why Astraiv', href: ROUTES.PUBLIC.COMPANY_ANCHORS.WHY_US },
        { label: 'Our Process', href: ROUTES.PUBLIC.COMPANY_ANCHORS.PROCESS },
        { label: 'Tech Insights & Blog', href: ROUTES.PUBLIC.INSIGHTS },
        { label: 'Flexible Pricing', href: ROUTES.PUBLIC.PRICING },
        { label: 'FAQs', href: ROUTES.PUBLIC.FAQ },
        { label: 'Careers', href: ROUTES.PUBLIC.CAREERS },
      ],
    },
  ];

  return (
    <footer
      style={{
        isolation: 'isolate',
        position: 'relative',
        zIndex: 40,
        backgroundColor: '#000a18',
      }}
      className="relative z-40 bg-[#000a18] text-[#F8FAFC] border-t border-[#0d2038] py-16 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr_0.85fr_1.3fr] gap-8 xl:gap-9 items-start text-left">
        {/* Brand details and dynamic social icons (Left Column) */}
        <div className="flex flex-col gap-4 text-left">
          <Link href={ROUTES.PUBLIC.HOME} className="inline-block">
            <Image
              src="/logo-full.png"
              alt="Astraiv Technologies Logo"
              width={140}
              height={40}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain hover:opacity-90 transition-opacity"
              unoptimized
              priority
            />
          </Link>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            {footerData.brandTagline}
          </p>

          {/* Social Network Icon redirects */}
          <div className="flex items-center flex-wrap gap-2.5 mt-2">
            {footerData.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg bg-[#00142e] border border-[#0d2a4d] hover:border-blue-400/40 hover:text-blue-400 text-slate-400 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label={`${social.name} (opens in new window)`}
                title={`${social.name} (opens in new window)`}
              >
                <SocialPlatformIcon platform={social.platform || social.icon} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns with aligned headers & uniform line height */}
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 min-h-[20px] flex items-center">
              {column.title}
            </h3>
            <ul className="flex flex-col gap-1.5">
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link href={link.href} className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors py-1 inline-flex items-center min-h-[26px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Support contacts */}
        <div className="flex flex-col text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 min-h-[20px] flex items-center">
            Contact Us
          </h3>
          <div className="flex flex-col gap-3.5">
            {/* Call */}
            <a
              href={`tel:${footerData.phone.replace(/[^\d+]/g, '') || footerData.phone}`}
              className="flex items-center gap-3 group text-left transition-colors"
            >
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-blue-500/15 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:scale-105 transition-all duration-300 shadow-xs">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                  Call Us
                </span>
                <span className="text-xs lg:text-[13px] xl:text-sm text-slate-400 group-hover:text-slate-200 transition-colors font-medium whitespace-nowrap">
                  {footerData.phone}
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${footerData.email}`}
              className="flex items-center gap-3 group text-left transition-colors"
            >
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-blue-500/15 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:scale-105 transition-all duration-300 shadow-xs">
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                  Send Email
                </span>
                <span className="text-xs lg:text-[13px] xl:text-sm text-slate-400 group-hover:text-slate-200 transition-colors font-medium break-all sm:break-normal">
                  {footerData.email}
                </span>
              </div>
            </a>

            {/* Address */}
            <a
              href={footerData.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group text-left transition-colors"
            >
              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-blue-500/15 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:scale-105 transition-all duration-300 shadow-xs">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                  Address
                </span>
                <span className="text-xs lg:text-[13px] xl:text-sm text-slate-400 group-hover:text-slate-200 transition-colors font-medium break-words">
                  {footerData.address}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          &copy; {currentYear} {footerData.copyrightText}
        </p>

        <div className="flex items-center gap-6">
          <Link href={ROUTES.PUBLIC.PRIVACY} className="hover:text-slate-300 transition-colors py-1.5 inline-flex items-center min-h-[28px]">
            Privacy Policy
          </Link>
          <Link href={ROUTES.PUBLIC.TERMS} className="hover:text-slate-300 transition-colors py-1.5 inline-flex items-center min-h-[28px]">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
