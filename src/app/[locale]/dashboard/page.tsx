import { auth } from '@/config/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db/prisma';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardRole } from '@/components/layout/sidebar';
import { Project, ClientTicket, CRMLead, User } from '@prisma/client';

type ProjectWithRelations = Project & {
  client?: User | null;
  manager?: User | null;
};

type TicketWithRelations = ClientTicket & {
  client?: User | null;
  assignedTo?: User | null;
};

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Obtain current session via Better Auth API handler
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protect dashboard page from unauthorized users
  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const user = session.user;

  // Retrieve user statistics and relation lists depending on user role
  let projects: ProjectWithRelations[] = [];
  let tickets: TicketWithRelations[] = [];
  let leads: CRMLead[] = [];

  if (user.role === 'ADMIN') {
    projects = await db.project.findMany({
      include: { client: true, manager: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });
    tickets = await db.clientTicket.findMany({
      include: { client: true, assignedTo: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });
    leads = await db.cRMLead.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });
  } else if (user.role === 'PROJECT_MANAGER') {
    projects = await db.project.findMany({
      where: { managerId: user.id },
      include: { client: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });
    tickets = await db.clientTicket.findMany({
      where: { assignedToId: user.id },
      include: { client: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });
  } else if (user.role === 'CLIENT') {
    projects = await db.project.findMany({
      where: { clientId: user.id },
      include: { manager: true },
      orderBy: { updatedAt: 'desc' },
    });
    tickets = await db.clientTicket.findMany({
      where: { clientId: user.id },
      include: { assignedTo: true },
      orderBy: { updatedAt: 'desc' },
    });
  } else {
    // Standard User - has no relation lists
    projects = [];
    tickets = [];
    leads = [];
  }

  // Aggregate statistics for the dashboards cards widgets
  const stats = {
    totalProjects: user.role === 'ADMIN' ? await db.project.count() : projects.length,
    activeProjects: user.role === 'ADMIN' 
      ? await db.project.count({ where: { status: 'ACTIVE' } })
      : projects.filter(p => p.status === 'ACTIVE').length,
    totalTickets: user.role === 'ADMIN' ? await db.clientTicket.count() : tickets.length,
    openTickets: user.role === 'ADMIN'
      ? await db.clientTicket.count({ where: { status: 'OPEN' } })
      : tickets.filter(t => t.status === 'OPEN').length,
    totalLeads: user.role === 'ADMIN' ? await db.cRMLead.count() : 0,
    wonLeads: user.role === 'ADMIN' ? await db.cRMLead.count({ where: { status: 'WON' } }) : 0,
    totalClients: user.role === 'ADMIN' ? await db.user.count({ where: { role: 'CLIENT' } }) : 0,
    totalBudget: projects.reduce((acc, p) => acc + (p.budget || 0), 0),
  };

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
