import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { TechSection } from '@/components/sections/tech-section';
import { AiSection } from '@/components/sections/ai-section';
import { CircuitBackground } from '@/components/sections/circuit-background';
import { Metadata } from 'next';

interface TechnologyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TechnologyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Technology' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TechnologyPage({ params }: TechnologyPageProps) {
  const { locale } = await params;
  
  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Technology' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary selection:text-white flex flex-col justify-between relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      
      <main className="pt-24 flex-grow z-10 relative">
        {/* Intro Hero Section */}
        <section className="pt-16 pb-6 px-6 text-center max-w-4xl mx-auto flex flex-col gap-4">
          <span className="inline-flex self-center px-3.5 py-1 text-xs font-semibold tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 dark:bg-primary/20 dark:text-primary-foreground uppercase w-fit animate-fade-in">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/75 bg-clip-text leading-tight md:leading-normal">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-semibold">
            {t('description')}
          </p>
        </section>

        {/* 1. Tech Stack Section */}
        <TechSection />

        {/* 2. AI Capabilities Section */}
        <AiSection />


      </main>

      <Footer />
    </div>
  );
}
