import { redirect } from 'next/navigation';
import { getCurrentUserSession, getClientTickets } from '@/controllers';
import { DashboardLayout } from '@/views/layouts/dashboard-layout';
import { DashboardRole } from '@/views/layouts/sidebar';
import { TicketsView } from '@/views/portal/tickets-view';

export const dynamic = 'force-dynamic';

interface ClientTicketsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ClientTicketsPage({ params }: ClientTicketsPageProps) {
  const { locale } = await params;
  
  // Obtain current session via Auth Controller
  const user = await getCurrentUserSession();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Protect client route - only client and admin profiles are allowed
  if (user.role !== 'CLIENT' && user.role !== 'ADMIN' && user.role !== 'PROJECT_MANAGER') {
    redirect(`/${locale}/dashboard`);
  }

  // Fetch client tickets via Tickets Controller
  const tickets = await getClientTickets(user);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Support Desk' },
  ];

  return (
    <DashboardLayout
      role={user.role as DashboardRole}
      userName={user.name}
      userEmail={user.email}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">Support Tickets Desk</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            File priority bugs, system questions, and trace engineering sprints addressing your tickets.
          </p>
        </div>

        <TicketsView
          tickets={JSON.parse(JSON.stringify(tickets))}
          clientId={user.id}
          role={user.role}
        />
      </div>
    </DashboardLayout>
  );
}
