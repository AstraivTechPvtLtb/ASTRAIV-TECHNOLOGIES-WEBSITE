import { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Navbar, Footer } from '@/views';
import { StartProjectWizard } from '@/views/sections/start-project/start-project-wizard';
import { StartProjectSkeleton } from './loading';
import { Sparkles } from 'lucide-react';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

interface StartProjectPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: StartProjectPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Start a Project | Astraiv Technologies',
    description:
      'Initiate your custom software, AI solution, web application, or cloud project with Astraiv Technologies. Complete our 5-step project scoping wizard for a guaranteed 24-hour architect review.',
    path: '/start-project',
    locale,
  });
}

export default async function StartProjectPage({ params }: StartProjectPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Start Project', path: '/start-project' },
        ]}
      />
      <Navbar />

      <main id="main-content" className="pt-28 pb-16 flex-grow z-10 relative">
        {/* Page Hero Header */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 mb-4 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 border border-primary/20 dark:border-blue-400/20 mb-4 select-none">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ENTERPRISE PROJECT SCOPING</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            Start Your Project with{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Astraiv
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed font-medium">
            Tell us about your project, parameters, and timeline. Our senior solutions architects will assess feasibility, prepare preliminary architectural notes, and get back to you within 24 hours.
          </p>
        </div>

        <Suspense fallback={<StartProjectSkeleton />}>
          <StartProjectWizard />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
