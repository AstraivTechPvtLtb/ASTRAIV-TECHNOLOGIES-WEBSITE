import { redirect } from '@/i18n/routing';

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  redirect({ href: '/blog#faq', locale });
}
