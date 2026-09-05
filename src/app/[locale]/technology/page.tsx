import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Navbar, Footer, TechnologyView } from '@/views';
import { Metadata } from 'next';

interface TechnologyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TechnologyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Technology' });
  return {
    title: `${t('title')} | Astraiv Technologies`,
    description: t('description'),
  };
}

export default async function TechnologyPage({ params }: TechnologyPageProps) {
  const { locale } = await params;
  
  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Technology' });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow z-10 relative">
        <TechnologyView
          badge={t('badge')}
          title={t('title')}
          description={t('description')}
        />
      </main>

      <Footer />
    </div>
  );
}
