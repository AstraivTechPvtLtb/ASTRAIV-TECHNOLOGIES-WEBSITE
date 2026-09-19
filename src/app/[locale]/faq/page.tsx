import { redirect } from '@/i18n/routing';
import { ROUTES } from '@/routes';

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  redirect({ href: ROUTES.PUBLIC.BLOG_FAQ_ANCHOR, locale });
}
