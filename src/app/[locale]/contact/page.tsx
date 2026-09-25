import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Navbar, Footer, ContactSection } from '@/views';
import { createPageMetadata, BreadcrumbSchema } from '@/lib/seo';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: 'Contact Our Engineering Team | Astraiv Technologies',
    description:
      'Get in touch with Astraiv Technologies for custom software development, AI solutions, web applications, and enterprise digital transformation.',
    path: '/contact',
    locale,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  
  // Set the request locale for server-side localized rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground flex flex-col justify-between relative overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <Navbar />
      <main id="main-content" className="pt-24 flex-grow z-10 relative">
        <ContactSection isPageHero={true} />
      </main>
      <Footer />
    </div>
  );
}

