import { redirect } from 'next/navigation';
import { getCurrentUserSession, getDashboardData } from '@/controllers';
import { DashboardView } from '@/views/portal/dashboard-view';
import { DashboardLayout } from '@/views/layouts/dashboard-layout';
import { DashboardRole } from '@/views/layouts/sidebar';

export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Obtain current session via Auth Controller
  const user = await getCurrentUserSession();

  // Protect dashboard page from unauthorized users
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Obtain dashboard telemetry via Dashboard Controller
  const { stats, projects, tickets, leads } = await getDashboardData(user);

  const breadcrumbs = [{ label: 'Dashboard' }];

  return (
    <DashboardLayout
      role={user.role as DashboardRole}
      userName={user.name}
      userEmail={user.email}
      breadcrumbs={breadcrumbs}
    >
      <DashboardView
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'USER',
          image: user.image,
        }}
        stats={stats}
        projects={JSON.parse(JSON.stringify(projects))}
        tickets={JSON.parse(JSON.stringify(tickets))}
        leads={JSON.parse(JSON.stringify(leads))}
      />
    </DashboardLayout>
  );
}
