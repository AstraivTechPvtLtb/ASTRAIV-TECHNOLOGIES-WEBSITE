'use client';

import { Project, ClientTicket, CRMLead, User } from '@prisma/client';

type ProjectWithRelations = Project & {
  client?: User | null;
  manager?: User | null;
};

type TicketWithRelations = ClientTicket & {
  client?: User | null;
  assignedTo?: User | null;
};

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  LifeBuoy,
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { DataCard } from '@/components/dashboard/data-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface DashboardViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalTickets: number;
    openTickets: number;
    totalLeads: number;
    wonLeads: number;
    totalClients: number;
    totalBudget: number;
  };
  projects: ProjectWithRelations[];
  tickets: TicketWithRelations[];
  leads: CRMLead[];
}

export function DashboardView({
  user,
  stats,
  projects,
  tickets,
  leads,
}: DashboardViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock chart data representing standard analytics
  const revenueChartData = [
    { name: 'Jan', revenue: 45000, leads: 12 },
    { name: 'Feb', revenue: 52000, leads: 15 },
    { name: 'Mar', revenue: 49000, leads: 11 },
    { name: 'Apr', revenue: 63000, leads: 19 },
    { name: 'May', revenue: 58000, leads: 14 },
    { name: 'Jun', revenue: 71000, leads: 22 },
    { name: 'Jul', revenue: 85000, leads: 28 },
  ];

  const clientProgressChartData = [
    { name: 'Project Kickoff', progress: 100 },
    { name: 'Wireframing & UI Design', progress: 85 },
    { name: 'API Specifications', progress: 60 },
    { name: 'Dashboard Features', progress: 40 },
    { name: 'Client Portal Integration', progress: 10 },
  ];

  // Helper to color project status badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'RESOLVED':
      case 'WON':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20';
      case 'ACTIVE':
      case 'IN_PROGRESS':
      case 'QUALIFIED':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
      case 'PLANNING':
      case 'NEW':
      case 'CONTACTED':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'ON_HOLD':
      case 'CLOSED':
      case 'PROPOSAL_SENT':
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* 1. Hey Header block */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground flex items-center gap-2">
            Hey {user.name.split(' ')[0]} <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {user.role === 'ADMIN' && "Here's what's happening across Astraiv accounts today."}
            {user.role === 'PROJECT_MANAGER' && "Manage your assigned software projects and deliverables."}
            {user.role === 'CLIENT' && "Track your active software implementations and support desk."}
            {user.role === 'USER' && "Welcome to your personal Astraiv dashboard area."}
          </p>
        </div>

        {/* Dynamic header shortcuts */}
        <div className="flex gap-2">
          {user.role === 'CLIENT' && (
            <Link href="/client/tickets">
              <Button size="sm" className="gap-1.5 cursor-pointer h-10 px-4.5 rounded-[12px]">
                <PlusCircle className="h-4 w-4" />
                Open Ticket
              </Button>
            </Link>
          )}
          {user.role === 'ADMIN' && (
            <Link href="/admin/leads">
              <Button size="sm" className="gap-1.5 cursor-pointer h-10 px-4.5 rounded-[12px]">
                <TrendingUp className="h-4 w-4" />
                CRM Leads
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      {/* 2. Top Metric Widgets Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {user.role === 'ADMIN' ? (
          <>
            <DataCard
              title="Total Revenue"
              value={formatCurrency(215000)}
              change={12.4}
              timeframe="from last month"
              icon={<DollarSign className="h-4.5 w-4.5 text-primary dark:text-accent" />}
            />
            <DataCard
              title="Active Projects"
              value={`${stats.activeProjects}/${stats.totalProjects}`}
              change={8.5}
              timeframe="active builders"
              icon={<FolderKanban className="h-4.5 w-4.5 text-secondary" />}
            />
            <DataCard
              title="CRM Leads"
              value={stats.totalLeads}
              change={18.2}
              timeframe="new leads"
              icon={<TrendingUp className="h-4.5 w-4.5 text-emerald-500" />}
            />
            <DataCard
              title="Support Desk"
              value={`${stats.openTickets} Open`}
              change={-5.0}
              timeframe="resolved tickets"
              icon={<LifeBuoy className="h-4.5 w-4.5 text-amber-500" />}
            />
          </>
        ) : user.role === 'PROJECT_MANAGER' ? (
          <>
            <DataCard
              title="Managed Projects"
              value={stats.totalProjects}
              icon={<FolderKanban className="h-4.5 w-4.5 text-primary" />}
            />
            <DataCard
              title="Active Sprints"
              value={stats.activeProjects}
              icon={<Briefcase className="h-4.5 w-4.5 text-secondary" />}
            />
            <DataCard
              title="Assigned Tickets"
              value={stats.totalTickets}
              icon={<LifeBuoy className="h-4.5 w-4.5 text-amber-500" />}
            />
            <DataCard
              title="Open Issues"
              value={stats.openTickets}
              icon={<Layers className="h-4.5 w-4.5 text-destructive" />}
            />
          </>
        ) : (
          // CLIENT or Standard USER
          <>
            <DataCard
              title="My Projects"
              value={stats.totalProjects}
              icon={<FolderKanban className="h-4.5 w-4.5 text-primary" />}
            />
            <DataCard
              title="Active Workflows"
              value={stats.activeProjects}
              icon={<Briefcase className="h-4.5 w-4.5 text-secondary" />}
            />
            <DataCard
              title="Total Budget Block"
              value={formatCurrency(stats.totalBudget)}
              icon={<DollarSign className="h-4.5 w-4.5 text-emerald-500" />}
            />
            <DataCard
              title="Support Tickets"
              value={`${stats.openTickets} Active`}
              icon={<LifeBuoy className="h-4.5 w-4.5 text-amber-500" />}
            />
          </>
        )}
      </motion.div>

      {/* 3. Primary Chart Block */}
      {mounted && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-bold tracking-tight text-foreground">
                {user.role === 'ADMIN' ? 'Revenue Analytics' : 'Development Sprint Progress'}
              </CardTitle>
              <CardDescription>
                {user.role === 'ADMIN' ? 'Estimated CRM revenues and leads conversion rates' : 'Current build status milestone progression'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {user.role === 'ADMIN' ? (
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                ) : (
                  <BarChart data={clientProgressChartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} width={130} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="progress" fill="var(--color-secondary)" radius={[0, 6, 6, 0]} barSize={12}>
                      {clientProgressChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="border border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">Interactive Cockpit</CardTitle>
              <CardDescription>Shortcut widgets for platform execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === 'CLIENT' ? (
                <>
                  <div className="flex items-center gap-3 p-3.5 rounded-lg border border-border/40 bg-muted/40 hover:bg-muted/80 transition-colors">
                    <div className="h-8.5 w-8.5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <LifeBuoy className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground">Submit Help Ticket</h4>
                      <p className="text-[10px] text-muted-foreground truncate">File database locks or frontend bugs</p>
                    </div>
                    <Link href="/client/tickets">
                      <ArrowRight className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-lg border border-border/40 bg-muted/40 hover:bg-muted/80 transition-colors">
                    <div className="h-8.5 w-8.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground">Billing Logs</h4>
                      <p className="text-[10px] text-muted-foreground truncate">Inspect monthly invoices and Stripe setups</p>
                    </div>
                    <Link href="/client/billing">
                      <ArrowRight className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                </>
              ) : (
                // ADMIN / PM shortcuts
                <>
                  <div className="flex items-center gap-3 p-3.5 rounded-lg border border-border/40 bg-muted/40 hover:bg-muted/80 transition-colors">
                    <div className="h-8.5 w-8.5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground">User Management</h4>
                      <p className="text-[10px] text-muted-foreground truncate">Configure user roles and directory permissions</p>
                    </div>
                    <Link href="/admin/users">
                      <ArrowRight className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-lg border border-border/40 bg-muted/40 hover:bg-muted/80 transition-colors">
                    <div className="h-8.5 w-8.5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground">SLA Support Queue</h4>
                      <p className="text-[10px] text-muted-foreground truncate">Inspect active developer support issues</p>
                    </div>
                    <Link href="/admin/tickets">
                      <ArrowRight className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                </>
              )}

              <div className="p-4 bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/5 rounded-[12px] border border-primary/10 text-xs flex flex-col gap-2 mt-4 relative overflow-hidden group">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                  Astraiv AI Engine Ready
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Our neural CRM and automatic ticket scoring model is loaded and ready. Swap config files to execute live runs.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 4. Active Items lists */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Queue */}
        <Card className="border border-border/40">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">Active Software Builds</CardTitle>
                <CardDescription>Sprints, scopes, and budgets currently in execution</CardDescription>
              </div>
              <Link href={user.role === 'CLIENT' ? '/client/projects' : '/admin/projects'} className="text-xs font-semibold text-primary dark:text-accent hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-border/20">
              {projects.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                  No active projects found.
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="p-4.5 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-bold text-foreground truncate">{project.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          Budget: {project.budget ? formatCurrency(project.budget) : 'TBD'}
                        </span>
                        {project.startDate && (
                          <span className="text-[10px] text-muted-foreground/60">
                            • Started {formatDate(project.startDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={cn('text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider', getStatusBadgeClass(project.status))}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tickets / CRM Queue */}
        {user.role === 'ADMIN' ? (
          <Card className="border border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Recent CRM Leads</CardTitle>
                  <CardDescription>Hot leads submitted from marketing channels</CardDescription>
                </div>
                <Link href="/admin/leads" className="text-xs font-semibold text-primary dark:text-accent hover:underline flex items-center gap-1">
                  View Leads <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-border/20">
                {leads.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                    No CRM leads recorded.
                  </div>
                ) : (
                  leads.map((lead) => (
                    <div key={lead.id} className="p-4.5 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-xs font-bold text-foreground truncate">{lead.name}</h4>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{lead.company || lead.email}</p>
                      </div>
                      <span className={cn('text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider', getStatusBadgeClass(lead.status))}>
                        {lead.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Client or PM Tickets view
          <Card className="border border-border/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Support Tickets Desk</CardTitle>
                  <CardDescription>Active priority bugs and SLA tasks</CardDescription>
                </div>
                <Link href={user.role === 'CLIENT' ? '/client/tickets' : '/admin/tickets'} className="text-xs font-semibold text-primary dark:text-accent hover:underline flex items-center gap-1">
                  View Desk <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-border/20">
                {tickets.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                    No support tickets open.
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4.5 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-xs font-bold text-foreground truncate">{ticket.subject}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            'text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm',
                            ticket.priority === 'HIGH' || ticket.priority === 'URGENT'
                              ? 'bg-destructive/10 text-destructive'
                              : ticket.priority === 'MEDIUM'
                              ? 'bg-primary/10 text-primary dark:text-accent'
                              : 'bg-muted text-muted-foreground'
                          )}>
                            {ticket.priority} PRIORITY
                          </span>
                          <span className="text-[10px] text-muted-foreground/60">
                            Updated {formatDate(ticket.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <span className={cn('text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider', getStatusBadgeClass(ticket.status))}>
                        {ticket.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
