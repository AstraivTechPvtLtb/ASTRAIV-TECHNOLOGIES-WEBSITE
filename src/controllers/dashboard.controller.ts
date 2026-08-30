'use server';

/**
 * @file client/src/controllers/dashboard.controller.ts
 * @description [CONTROLLER] Business logic for aggregating dashboard data and statistics in the Client Portal.
 */

import { db } from '@/models/db';
import { CRMLead } from '@prisma/client';
import { ProjectWithRelations } from './projects.controller';
import { TicketWithRelations } from './tickets.controller';


export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTickets: number;
  openTickets: number;
  totalLeads: number;
  wonLeads: number;
  totalClients: number;
  totalBudget: number;
}

export interface DashboardData {
  stats: DashboardStats;
  projects: ProjectWithRelations[];
  tickets: TicketWithRelations[];
  leads: CRMLead[];
}

/**
 * Aggregates all telemetry and relation lists required for the dashboard view.
 */
export async function getDashboardData(user: { id: string; role: string }): Promise<DashboardData> {
  try {
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
    }

    const stats: DashboardStats = {
      totalProjects: user.role === 'ADMIN' ? await db.project.count() : projects.length,
      activeProjects:
        user.role === 'ADMIN'
          ? await db.project.count({ where: { status: 'ACTIVE' } })
          : projects.filter((p) => p.status === 'ACTIVE').length,
      totalTickets: user.role === 'ADMIN' ? await db.clientTicket.count() : tickets.length,
      openTickets:
        user.role === 'ADMIN'
          ? await db.clientTicket.count({ where: { status: 'OPEN' } })
          : tickets.filter((t) => t.status === 'OPEN').length,
      totalLeads: user.role === 'ADMIN' ? await db.cRMLead.count() : 0,
      wonLeads: user.role === 'ADMIN' ? await db.cRMLead.count({ where: { status: 'WON' } }) : 0,
      totalClients: user.role === 'ADMIN' ? await db.user.count({ where: { role: 'CLIENT' } }) : 0,
      totalBudget: projects.reduce((acc, p) => acc + (p.budget || 0), 0),
    };

    return {
      stats,
      projects,
      tickets,
      leads,
    };
  } catch (error) {
    console.error('[Get Dashboard Data Error]:', error);
    return {
      stats: {
        totalProjects: 0,
        activeProjects: 0,
        totalTickets: 0,
        openTickets: 0,
        totalLeads: 0,
        wonLeads: 0,
        totalClients: 0,
        totalBudget: 0,
      },
      projects: [],
      tickets: [],
      leads: [],
    };
  }
}
