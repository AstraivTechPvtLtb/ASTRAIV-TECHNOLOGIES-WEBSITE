import { auth } from '@/config/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardRole } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Globe, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
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
    { label: 'Settings' },
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
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">Account Settings</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            Configure system configurations, notification priorities, and interface localization variables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications Card */}
          <Card className="border border-border/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary dark:text-accent" />
                <CardTitle className="text-base font-bold text-foreground">Notifications</CardTitle>
              </div>
              <CardDescription>Manage how we notify you of sprint updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/25 text-xs font-semibold">
                <div>
                  <span className="text-foreground block">Email Digest</span>
                  <span className="text-muted-foreground block text-[10px] font-medium mt-0.5">Receive weekly project status summaries</span>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary rounded-sm cursor-pointer" />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border/25 text-xs font-semibold">
                <div>
                  <span className="text-foreground block">Support Updates</span>
                  <span className="text-muted-foreground block text-[10px] font-medium mt-0.5">Get immediate notifications when developers resolve tickets</span>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary rounded-sm cursor-pointer" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-foreground block">Slack Integration</span>
                  <span className="text-muted-foreground block text-[10px] font-medium mt-0.5">Push active ticket triggers into private customer slack channels</span>
                </div>
                <input type="checkbox" className="h-4 w-4 accent-primary rounded-sm cursor-pointer" />
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="border border-border/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-secondary" />
                <CardTitle className="text-base font-bold text-foreground">Regional & Language</CardTitle>
              </div>
              <CardDescription>Configure localization variables and timezone contexts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Default Interface Language</label>
                <select className="h-11 rounded-[12px] border border-border/45 bg-background text-sm font-semibold px-3 w-full">
                  <option value="en">English (US)</option>
                  <option value="es">Español (ES)</option>
                  <option value="bn">Bengali (BN)</option>
                  <option value="hi">Hindi (HI)</option>
                  <option value="ar">Arabic (AR)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Local System Timezone</label>
                <select className="h-11 rounded-[12px] border border-border/45 bg-background text-sm font-semibold px-3 w-full">
                  <option value="UTC">UTC (Greenwich Mean Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="IST">IST (Indian Standard Time)</option>
                  <option value="AST">AST (Arabian Standard Time)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
