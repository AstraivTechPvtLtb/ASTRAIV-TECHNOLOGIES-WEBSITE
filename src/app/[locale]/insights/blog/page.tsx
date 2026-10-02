import { redirect } from 'next/navigation';

interface InsightsBlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InsightsBlogPage({ params }: InsightsBlogPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/insights#blog`);
}
