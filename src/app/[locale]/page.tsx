import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { SectionHeader } from '@/components/sections/section-header';
import { ServiceCard } from '@/components/sections/service-card';
import { TeamCard } from '@/components/sections/team-card';
import { PricingCard } from '@/components/sections/pricing-card';
import { TestimonialCard } from '@/components/sections/testimonial-card';
import { ContactForm } from '@/components/sections/contact-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Globe,
  Terminal,
  Layers,
  Sparkles,
  Bot,
  Cloud,
  Settings,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // Set the request locale for server caching
  setRequestLocale(locale);

  // Load language bundles
  const t = await getTranslations('Home');
  const tServices = await getTranslations('Services');
  const tCommon = await getTranslations('Common');

  // Monochromatic premium mock logo cloud data
  const clients = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark Industries'];

  // Services configurations with corresponding icons
  const services = [
    {
      icon: <Globe className="h-5 w-5" />,
      title: tServices('webDev'),
      description: tServices('webDevDesc'),
      href: '/services#web-development',
    },
    {
      icon: <Terminal className="h-5 w-5" />,
      title: tServices('webApps'),
      description: tServices('webAppsDesc'),
      href: '/services#web-applications',
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: tServices('uiux'),
      description: tServices('uiuxDesc'),
      href: '/services#ui-ux-design',
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: tServices('branding'),
      description: tServices('brandingDesc'),
      href: '/services#brand-identity',
    },
    {
      icon: <Bot className="h-5 w-5" />,
      title: tServices('aiSolutions'),
      description: tServices('aiSolutionsDesc'),
      href: '/services#ai-solutions',
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: tServices('cloud'),
      description: tServices('cloudDesc'),
      href: '/services#cloud-solutions',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: tServices('automation'),
      description: tServices('automationDesc'),
      href: '/services#business-automation',
    },
  ];

  // Testimonials testimonials data
  const testimonials = [
    {
      quote: "Astraiv's team is exceptional. They restructured our entire cloud architecture on AWS using Next.js and reduced our server overhead by 40%. The UI aesthetics are Stripe-level premium.",
      authorName: 'Sarah Jenkins',
      authorRole: 'VP of Engineering',
      authorCompany: 'Vercel Staging Partner',
    },
    {
      quote: "Working with Astraiv Technologies has automated our entire CRM sync pipeline and customer portal. The project was delivered ahead of schedule and the code quality is flawless.",
      authorName: 'Marcus Vance',
      authorRole: 'Founder',
      authorCompany: 'Linear Integrations',
    },
    {
      quote: "Their attention to design details, micro-animations, and WCAG accessibility is unmatched. Our clients have commented on the dashboard speed. It feels incredibly premium.",
      authorName: 'Elena Rostova',
      authorRole: 'CTO',
      authorCompany: 'Framer Modules',
    },
  ];

  // Team configurations
  const team = [
    {
      name: 'Arghya Chowdhury',
      role: 'Founder & Chief Architect',
      imageUrl: '/logo-icon.jpg', // Placeholder team image (using logo icon for mock symmetry)
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'David Chen',
      role: 'Head of Cloud Solutions',
      imageUrl: '/logo-icon.jpg',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Sofia Martinez',
      role: 'Director of UI/UX',
      imageUrl: '/logo-icon.jpg',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  ];

  // Pricing configuration
  const pricing = [
    {
      name: 'Starter Plan',
      price: '$4,999',
      description: 'Ideal for early-stage startups needing a premium marketing website and brand system.',
      features: [
        'Custom Web Design (Framer/Next.js)',
        'SEO & Performance Tuning',
        'Standard Contact Integrations',
        '2 rounds of layout revisions',
        'Email Support',
      ],
      buttonText: 'Start Building',
    },
    {
      name: 'Professional Plan',
      price: '$9,999',
      description: 'Our most popular plan, covering custom web applications, SaaS dashboards, and database setup.',
      features: [
        'Everything in Starter',
        'SaaS Dashboard & User Login',
        'Prisma & Postgres integrations',
        'Stripe payment stub setup',
        '2 weeks post-launch SLA',
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
      ],
      buttonText: 'Book a consultation',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Headers */}
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Hero Area */}
        <HeroSection
          badgeText={t('heroBadge')}
          headline={t('heroHeadline')}
          subheadline={t('heroSubheadline')}
          ctaText={tCommon('getStarted')}
          ctaHref="/auth/signup"
          secondaryCtaText={tCommon('contactUs')}
          secondaryCtaHref="#contact"
        />

        {/* Monochromatic client logo cloud */}
        <section className="py-12 bg-muted/20 border-b border-border/20 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-6">
              {t('trustedBy')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-items-center opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
              {clients.map((client, index) => (
                <div key={index} className="text-sm font-bold tracking-widest text-muted-foreground select-none uppercase">
                  {client}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Listings */}
        <section id="services" className="py-20 md:py-28 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              badge="Services"
              title={tServices('title')}
              description={tServices('subtitle')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Masonry */}
        <section id="testimonials" className="py-20 md:py-28 px-6 bg-muted/15 border-y border-border/25">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              badge="Success Stories"
              title={t('testimonialsTitle')}
              description={t('testimonialsSubtitle')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {testimonials.map((test, index) => (
                <TestimonialCard
                  key={index}
                  quote={test.quote}
                  authorName={test.authorName}
                  authorRole={test.authorRole}
                  authorCompany={test.authorCompany}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section id="team" className="py-20 md:py-28 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              badge="The Team"
              title={t('teamTitle')}
              description={t('teamSubtitle')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <TeamCard
                  key={index}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                  github={member.github}
                  linkedin={member.linkedin}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Engagement Pricing Tiers */}
        <section id="pricing" className="py-20 md:py-28 px-6 bg-muted/10 border-y border-border/20">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              badge="Pricing"
              title={t('pricingTitle')}
              description={t('pricingSubtitle')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {pricing.map((tier, index) => (
                <PricingCard
                  key={index}
                  name={tier.name}
                  price={tier.price}
                  description={tier.description}
                  features={tier.features}
                  buttonText={tier.buttonText}
                  isPopular={tier.isPopular}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section id="faq" className="py-20 md:py-28 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              badge="Faq"
              title={t('faqTitle')}
              description={t('faqSubtitle')}
            />
            <Accordion className="w-full mt-10 space-y-4">
              <AccordionItem value="item-1" className="border border-border/40 rounded-xl px-5 bg-card/40 backdrop-blur-xs">
                <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline">
                  {t('faq1Q')}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {t('faq1A')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border/40 rounded-xl px-5 bg-card/40 backdrop-blur-xs">
                <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline">
                  {t('faq2Q')}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {t('faq2A')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-border/40 rounded-xl px-5 bg-card/40 backdrop-blur-xs">
                <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline">
                  {t('faq3Q')}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {t('faq3A')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-20 md:py-28 px-6 bg-muted/15 border-t border-border/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contact details */}
            <div className="flex flex-col gap-6 text-left">
              <span className="inline-flex self-start px-3.5 py-1 text-xs font-semibold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground uppercase w-fit">
                Get in Touch
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80">
                {t('ctaTitle')}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                {t('ctaSubtitle')}
              </p>

              <div className="flex flex-col gap-5 mt-4">
                <div className="flex items-center gap-4 text-foreground/80">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold">info@astraiv.com</span>
                </div>
                <div className="flex items-center gap-4 text-foreground/80">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold">+1 (555) 019-9231</span>
                </div>
                <div className="flex items-center gap-4 text-foreground/80">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold leading-relaxed">
                    100 Pine Street, San Francisco, CA 94111
                  </span>
                </div>
              </div>
            </div>

            {/* Reusable Contact Form */}
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
