import { setRequestLocale } from 'next-intl/server';
import { permanentRedirect } from 'next/navigation';

interface PortfolioSlugPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PortfolioSlugPage({ params }: PortfolioSlugPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  permanentRedirect(`/${locale}/work/case-studies/${slug}`);
}
