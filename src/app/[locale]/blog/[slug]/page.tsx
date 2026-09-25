import { permanentRedirect, notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Canonical 308 redirect from legacy /blog/[slug] to scalable /insights/[slug]
  permanentRedirect(`/${locale}/insights/${slug}`);
}
