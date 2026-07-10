import { auth } from '@/config/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db/prisma';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardRole } from '@/components/layout/sidebar';
import { TicketsView } from '@/components/dashboard/tickets-view';

interface ClientTicketsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ClientTicketsPage({ params }: ClientTicketsPageProps) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const user = session.user;

  // Protect client route - only client and admin profiles are allowed
  if (user.role !== 'CLIENT' && user.role !== 'ADMIN' && user.role !== 'PROJECT_MANAGER') {
    redirect(`/${locale}/dashboard`);
  }

  // Fetch client tickets or all tickets for admin
  const tickets = await db.clientTicket.findMany({
    where: user.role === 'CLIENT' ? { clientId: user.id } : {},
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

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
