'use client';

import { ClientTicket } from '@prisma/client';

type TicketWithRelations = ClientTicket & {
  client?: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignedTo?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
};

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy,
  PlusCircle,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDate } from '@/utils';
import { cn } from '@/lib/utils';
import { createTicketAction } from '@/app/[locale]/client/tickets/actions';

// Zod schema for ticket filing
const ticketFormSchema = z.object({
  subject: z
    .string()
    .min(1, { message: 'Subject is required' })
    .min(5, { message: 'Subject must be at least 5 characters long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .min(10, { message: 'Description must be at least 10 characters long' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});

type TicketFormInput = z.infer<typeof ticketFormSchema>;

interface TicketsViewProps {
  tickets: TicketWithRelations[];
  clientId: string;
  role: string;
}

export function TicketsView({ tickets, clientId, role }: TicketsViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormInput>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      subject: '',
      description: '',
      priority: 'MEDIUM',
    },
  });

  // Calculate ticket counters for left sidebar
  const counts = {
    ALL: tickets.length,
    OPEN: tickets.filter((t) => t.status === 'OPEN').length,
    IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    RESOLVED: tickets.filter((t) => t.status === 'RESOLVED').length,
    CLOSED: tickets.filter((t) => t.status === 'CLOSED').length,
  };

  // Filter and search logic
  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = activeFilter === 'ALL' ? true : ticket.status === activeFilter;
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.client?.name && ticket.client.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const onSubmit = (data: TicketFormInput) => {
    setStatusMsg(null);
    startTransition(async () => {
      try {
        await createTicketAction({
          subject: data.subject,
          description: data.description,
          priority: data.priority,
          clientId: clientId,
        });
        setStatusMsg({ type: 'success', text: 'Ticket successfully filed! Our architects will review it shortly.' });
        reset();
        setTimeout(() => {
          setIsDialogOpen(false);
          setStatusMsg(null);
        }, 1500);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to file the ticket. Please try again.';
        setStatusMsg({ type: 'error', text: message });
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'HIGH':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM':
        return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
      case 'LOW':
      default:
        return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20';
      case 'IN_PROGRESS':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
      case 'OPEN':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'CLOSED':
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Sidebar - Filters */}
      <Card className="w-full md:w-64 border border-border/40 shrink-0">
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="px-3.5 py-2 font-heading font-extrabold text-xs uppercase tracking-wider text-muted-foreground/60">
            Status Filters
          </div>

          {[
            { id: 'ALL', label: 'All Tickets', count: counts.ALL },
            { id: 'OPEN', label: 'Open', count: counts.OPEN },
            { id: 'IN_PROGRESS', label: 'In Progress', count: counts.IN_PROGRESS },
            { id: 'RESOLVED', label: 'Resolved', count: counts.RESOLVED },
            { id: 'CLOSED', label: 'Closed', count: counts.CLOSED },
          ].map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span>{item.label}</span>
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold', isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground')}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Main Workspace - Tickets List */}
      <div className="flex-1 flex flex-col gap-6 w-full">
        {/* Search, Filter, and Action header bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card border-border/40 h-10 placeholder:text-muted-foreground/50 rounded-[12px] text-xs font-semibold"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger render={<Button className="gap-1.5 cursor-pointer h-10 px-4.5 rounded-[12px] text-xs font-bold w-full sm:w-auto" />}>
                <PlusCircle className="h-4.5 w-4.5" />
                File Support Ticket
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg glass-dark border border-slate-800 text-slate-100 rounded-[20px] p-8 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading font-extrabold text-xl text-white">File Support Ticket</DialogTitle>
                  <DialogDescription className="text-slate-400 font-medium text-xs mt-1">
                    Describe your software deliverable issues. A project manager will assign a senior developer immediately.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                  {/* Status alert in modal */}
                  <AnimatePresence mode="wait">
                    {statusMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          'flex items-start gap-2 text-xs rounded-lg p-3 font-semibold',
                          statusMsg.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-destructive/10 border border-destructive/20 text-destructive'
                        )}
                      >
                        {statusMsg.type === 'success' ? (
                          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                        ) : (
                          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                        )}
                        <span>{statusMsg.text}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Subject input */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                      Ticket Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="e.g., Stripe sandbox webhook failing on checkout"
                      className={cn(
                        'border-slate-800 bg-slate-900/50 text-slate-200 placeholder:text-slate-600 focus-visible:border-primary text-sm',
                        errors.subject && 'border-destructive focus-visible:ring-destructive/30'
                      )}
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Description text */}
                  <div className="space-y-1.5">
                    <label htmlFor="description" className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                      Detailed Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      placeholder="Provide step-by-step replication details, error logs, and environment configurations..."
                      className={cn(
                        'w-full rounded-[12px] border border-slate-800 bg-slate-900/50 text-slate-200 placeholder:text-slate-600 px-3.5 py-2 text-sm outline-none transition-colors focus:border-primary disabled:opacity-50',
                        errors.description && 'border-destructive'
                      )}
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Priority select */}
                  <div className="space-y-1.5">
                    <label htmlFor="priority" className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                      Priority Level
                    </label>
                    <select
                      id="priority"
                      className="w-full rounded-[12px] border border-slate-800 bg-slate-900 text-slate-200 px-3.5 py-2 text-sm outline-none transition-colors focus:border-primary h-11"
                      {...register('priority')}
                    >
                      <option value="LOW">Low - General Question</option>
                      <option value="MEDIUM">Medium - Build Query</option>
                      <option value="HIGH">High - Blocking Execution</option>
                      <option value="URGENT">Urgent - Staging/Production Crash</option>
                    </select>
                  </div>

                  {/* Action submit button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white font-bold tracking-wide rounded-[12px] flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-primary/20 hover:scale-[1.01] transition-all"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Filing Support Ticket...
                      </>
                    ) : (
                      'Submit Ticket'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Datatable list layout */}
        <Card className="border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/45 bg-muted/40 text-muted-foreground font-bold tracking-wide uppercase">
                  <th className="p-4 font-semibold">Requester</th>
                  <th className="p-4 font-semibold">Subject & Scope</th>
                  <th className="p-4 font-semibold">Assignee</th>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-slate-700 dark:text-slate-350">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground font-semibold">
                      No support tickets match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-muted/10 transition-colors">
                      {/* Requester column */}
                      <td className="p-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                            {ticket.client?.name.substring(0, 2).toUpperCase() || 'US'}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">{ticket.client?.name || 'Client Account'}</span>
                            <span className="text-[10px] text-muted-foreground block leading-tight">{ticket.client?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Subject column */}
                      <td className="p-4 max-w-sm">
                        <span className="font-bold text-foreground block leading-normal">{ticket.subject}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{ticket.description}</span>
                      </td>

                      {/* Assignee column */}
                      <td className="p-4">
                        {ticket.assignedTo ? (
                          <div className="flex items-center gap-2">
                            {ticket.assignedTo.image ? (
                              <img src={ticket.assignedTo.image} alt={ticket.assignedTo.name} className="h-6 w-6 rounded-full object-cover" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[9px]">
                                {ticket.assignedTo.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <span className="font-bold text-foreground">{ticket.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold px-2 py-0.5 rounded-sm inline-flex items-center gap-1 border border-slate-200/40">
                            <ShieldAlert className="h-3 w-3" />
                            Triage Queue
                          </span>
                        )}
                      </td>

                      {/* Priority column */}
                      <td className="p-4">
                        <span className={cn('text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase border', getPriorityColor(ticket.priority))}>
                          {ticket.priority}
                        </span>
                      </td>

                      {/* Status column */}
                      <td className="p-4">
                        <span className={cn('text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider', getStatusBadgeClass(ticket.status))}>
                          {ticket.status}
                        </span>
                      </td>

                      {/* Last updated column */}
                      <td className="p-4 text-muted-foreground font-semibold">
                        {formatDate(ticket.updatedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
