import { permanentRedirect, notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Canonical 308 redirect from legacy /blog to scalable /insights/blog hub
  permanentRedirect(`/${locale}/insights/blog`);
}
