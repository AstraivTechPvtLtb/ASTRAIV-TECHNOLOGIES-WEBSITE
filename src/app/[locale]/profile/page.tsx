import { auth } from '@/config/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardRole } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, ShieldAlert, Calendar } from 'lucide-react';
import { formatDate } from '@/utils';

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  const user = session.user;

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile' },
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
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">User Profile</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Manage your personal dashboard details, security roles, and linked authentication accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Avatar card */}
          <Card className="border border-border/40 text-center p-6 flex flex-col items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover shadow-md border-2 border-primary/20 mb-4"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shadow-inner mb-4">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            <span className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border bg-primary/10 text-primary dark:text-accent border-primary/20">
              {user.role || 'USER'} ROLE
            </span>
          </Card>

          {/* Details form/cards */}
          <Card className="md:col-span-2 border border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">Account Information</CardTitle>
              <CardDescription>Personal details and authorization levels registered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                {/* Full name detail */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Full Name</span>
                  <div className="h-10.5 rounded-lg border border-border/45 bg-muted/20 px-3.5 flex items-center gap-2.5 font-bold text-foreground">
                    <User className="h-4.5 w-4.5 text-muted-foreground/60" />
                    {user.name}
                  </div>
                </div>

                {/* Email detail */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Email Address</span>
                  <div className="h-10.5 rounded-lg border border-border/45 bg-muted/20 px-3.5 flex items-center gap-2.5 font-bold text-foreground">
                    <Mail className="h-4.5 w-4.5 text-muted-foreground/60" />
                    {user.email}
                  </div>
                </div>

                {/* System role detail */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Access Permissions</span>
                  <div className="h-10.5 rounded-lg border border-border/45 bg-muted/20 px-3.5 flex items-center gap-2.5 font-bold text-foreground">
                    <ShieldAlert className="h-4.5 w-4.5 text-muted-foreground/60" />
                    {user.role || 'USER'} Level
                  </div>
                </div>

                {/* Join date detail */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Registration Date</span>
                  <div className="h-10.5 rounded-lg border border-border/45 bg-muted/20 px-3.5 flex items-center gap-2.5 font-bold text-foreground">
                    <Calendar className="h-4.5 w-4.5 text-muted-foreground/60" />
                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
