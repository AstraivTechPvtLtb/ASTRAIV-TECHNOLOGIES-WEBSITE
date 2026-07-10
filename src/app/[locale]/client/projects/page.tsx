import { auth } from '@/config/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db/prisma';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardRole } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Calendar, DollarSign, UserCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';
import { cn } from '@/lib/utils';

interface ClientProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ClientProjectsPage({ params }: ClientProjectsPageProps) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const user = session.user;

  // Protect client route
  if (user.role !== 'CLIENT' && user.role !== 'ADMIN') {
    redirect(`/${locale}/dashboard`);
  }

  // Fetch client projects
  const projects = await db.project.findMany({
    where: user.role === 'ADMIN' ? {} : { clientId: user.id },
    include: { manager: true },
    orderBy: { updatedAt: 'desc' },
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-600 dark:text-green-450 border border-green-500/20';
      case 'ACTIVE':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-450 border border-sky-500/20';
      case 'PLANNING':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border border-amber-500/20';
      case 'ON_HOLD':
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-450 border border-slate-500/20';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 100;
      case 'ACTIVE':
        return 65;
      case 'PLANNING':
        return 15;
      case 'ON_HOLD':
      default:
        return 45;
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Projects' },
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
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">My Projects</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Track real-time milestones, budget consumption, and timelines for your active software builds.
          </p>
        </div>

        {projects.length === 0 ? (
          <Card className="border border-border/40 p-12 text-center flex flex-col items-center justify-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/60 mb-4" />
            <h3 className="text-lg font-bold text-foreground">No Projects Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1">
              Your account doesn&apos;t have any active software development projects registered. Contact our architects to kickoff a new build.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const progress = getProgressPercentage(project.status);
              return (
                <Card key={project.id} className="border border-border/40 hover:shadow-lg dark:hover:shadow-primary/5 transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">{project.name}</CardTitle>
                        <CardDescription className="text-xs mt-1.5 line-clamp-2">
                          {project.description || 'No project description loaded.'}
                        </CardDescription>
                      </div>
                      <span className={cn('text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0', getStatusBadgeClass(project.status))}>
                        {project.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-0">
                    {/* Progress slider bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">Milestone Progress</span>
                        <span className="text-foreground">{progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta stats details */}
                    <div className="grid grid-cols-2 gap-4.5 pt-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary dark:text-accent shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 leading-tight">Timeline</span>
                          <span className="font-semibold text-foreground truncate block mt-0.5">
                            {project.startDate ? formatDate(project.startDate) : 'TBD'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 leading-tight">Allocated Budget</span>
                          <span className="font-semibold text-foreground truncate block mt-0.5">
                            {project.budget ? formatCurrency(project.budget) : 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Project Manager Card */}
                    {project.manager && (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border/20 bg-muted/30">
                        {project.manager.image ? (
                          <img
                            src={project.manager.image}
                            alt={project.manager.name}
                            className="h-8.5 w-8.5 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-8.5 w-8.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {project.manager.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 text-xs">
                          <span className="block text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">Assigned Architect</span>
                          <span className="font-bold text-foreground truncate block mt-0.5">{project.manager.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-primary dark:text-accent font-bold">
                          <UserCheck className="h-3.5 w-3.5" />
                          Online
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
