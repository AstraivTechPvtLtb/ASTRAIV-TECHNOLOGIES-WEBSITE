import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import {
  Navbar,
  Footer,
  WhySection,
  ProcessSection,
  TestimonialsSection,
  CareersSection,
  PricingSection,
  ContactSection,
} from '@/views';
import {
  Zap,
  Target,
  Globe2,
  Layers,
} from 'lucide-react';

interface CompanyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  await params;
  return {
    title: 'Company | Astraiv Technologies',
    description:
      'Learn about Astraiv Technologies: our engineering philosophy, agile delivery process, senior talent, client reviews, careers, and flexible pricing models.',
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pillars = [
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: 'Architectural Rigor',
      description:
        'We reject fragile codebases and short-term hacks. Every platform is designed on modular, strictly typed architectures built to withstand rapid enterprise scale.',
    },
    {
      icon: <Target className="h-6 w-6 text-secondary" />,
      title: 'Conversion Psychology',
      description:
        'Software must feel as good as it functions. We blend cognitive interaction principles with high aesthetics to build instant user trust and authority.',
    },
    {
      icon: <Zap className="h-6 w-6 text-accent" />,
      title: 'Sprint Velocity',
      description:
        'Transparent two-week sprint cadences, automated CI/CD checks, and direct founder-level communication remove red tape and accelerate time-to-market.',
    },
    {
      icon: <Globe2 className="h-6 w-6 text-emerald-500" />,
      title: 'Global Mission',
      description:
        'Partnering with forward-thinking enterprises and ambitious startups worldwide to deploy battle-tested web, cloud, and autonomous AI infrastructure.',
    },
  ];

  const quickNav = [
    { label: 'About', href: '#about' },
    { label: 'Why Astraiv', href: '#why-us' },
    { label: 'Our Process', href: '#process' },
    { label: 'Client Reviews', href: '#reviews' },
    { label: 'Careers', href: '#careers' },
    { label: 'Pricing & Models', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      {/* Global Navigation */}
      <Navbar />

      <main className="flex-grow z-10 relative">
        {/* 1. Philosophy Pillars & Quick Navigation */}
        <section
          id="about"
          className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center scroll-mt-24 relative"
        >
          {/* Quick Jump Navigation Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl p-1.5 bg-card/80 dark:bg-slate-900/80 backdrop-blur-xl border border-border/60 dark:border-slate-800/80 rounded-2xl shadow-xs mb-10">
            {quickNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mission & Philosophy Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-7 bg-card/85 dark:bg-slate-900/85 backdrop-blur-xl border border-border/50 dark:border-slate-800/80 rounded-2xl shadow-xs hover:shadow-md hover:border-primary/30 dark:hover:border-accent/30 transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-border/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Why Astraiv Section */}
        <WhySection />

        {/* 3. Our Process Section */}
        <ProcessSection />

        {/* 4. Client Reviews Section (supports both #reviews and #testimonials anchors) */}
        <div id="reviews" className="scroll-mt-24">
          <TestimonialsSection />
        </div>

        {/* 5. Careers Section */}
        <CareersSection />

        {/* 6. Pricing & Models Section */}
        <PricingSection />

        {/* 7. Contact Consultation Section */}
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
