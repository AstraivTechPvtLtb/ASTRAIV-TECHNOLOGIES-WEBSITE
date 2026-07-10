import { auth } from '@/config/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardRole } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils';
import { cn } from '@/lib/utils';

interface ClientBillingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ClientBillingPage({ params }: ClientBillingPageProps) {
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

  // Simulated billing logs (Stripe placeholder representation)
  const invoices = [
    { id: 'INV-2026-003', date: '2026-07-01', amount: 8500, status: 'PAID', plan: 'Monthly Enterprise SLA Retainer' },
    { id: 'INV-2026-002', date: '2026-06-15', amount: 15000, status: 'PAID', plan: 'Astraiv Dashboard Portal Rebuild - 50% Milestone' },
    { id: 'INV-2026-001', date: '2026-05-01', amount: 20000, status: 'PAID', plan: 'Brand Identity Design Phase' },
  ];

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Billing & Invoices' },
  ];

  return (
    <DashboardLayout
      role={user.role as DashboardRole}
      userName={user.name}
      userEmail={user.email}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground">Billing & Invoices</h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Review transaction histories, billing cycles, active retention programs, and download PDF invoices.
            </p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 cursor-pointer h-10 px-4.5 rounded-[12px] text-xs font-bold bg-card border-border/40 hover:bg-muted/80">
            Payment Portal
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 2. Account Tier and Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
                Enterprise Retainer SLA
                <CheckCircle2 className="h-4.5 w-4.5 text-green-500 fill-green-500/10 shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Monthly cycle renewed automatically</p>
            </CardContent>
          </Card>

          <Card className="border border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Billing Block</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-1">
                {formatCurrency(8500)}
                <span className="text-xs text-muted-foreground font-semibold ml-1">/ Month</span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Next invoice date: August 1, 2026</p>
            </CardContent>
          </Card>

          <Card className="border border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stripe Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="h-10 w-12 rounded-md bg-muted border border-border/30 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 uppercase">
                Visa
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-foreground truncate">Visa ending in 4242</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5">Expires 12 / 2029</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Invoices History Table */}
        <Card className="border border-border/40 overflow-hidden">
          <CardHeader className="border-b border-border/20 bg-muted/20">
            <CardTitle className="text-base font-bold text-foreground">Transaction History</CardTitle>
            <CardDescription>Historical invoicing records processed via Stripe</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/45 bg-muted/40 text-muted-foreground font-bold tracking-wide uppercase">
                  <th className="p-4 font-semibold">Invoice ID</th>
                  <th className="p-4 font-semibold">Plan Description</th>
                  <th className="p-4 font-semibold">Billing Date</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-slate-700 dark:text-slate-350">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/10 transition-colors">
                    {/* Invoice ID */}
                    <td className="p-4 font-bold text-foreground">{inv.id}</td>
                    
                    {/* Description */}
                    <td className="p-4 font-semibold text-foreground max-w-xs truncate">{inv.plan}</td>
                    
                    {/* Billing Date */}
                    <td className="p-4 text-muted-foreground font-semibold">{formatDate(inv.date)}</td>
                    
                    {/* Amount */}
                    <td className="p-4 font-bold text-foreground">{formatCurrency(inv.amount)}</td>
                    
                    {/* Status */}
                    <td className="p-4">
                      <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {inv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <Button size="icon-xs" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
