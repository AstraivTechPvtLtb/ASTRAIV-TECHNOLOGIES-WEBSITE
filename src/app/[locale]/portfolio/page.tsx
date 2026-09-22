import { setRequestLocale } from 'next-intl/server';
import { permanentRedirect } from 'next/navigation';

interface PortfolioPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  permanentRedirect(`/${locale}/work/case-studies`);
}
