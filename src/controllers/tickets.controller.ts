'use server';

/**
 * @file client/src/controllers/tickets.controller.ts
 * @description [CONTROLLER] Business logic for managing Client Portal support tickets and workflows.
 */

import { db } from '@/models/db';
import { revalidatePath } from 'next/cache';
import { TicketPriority, TicketStatus, ClientActionResponse } from '@/models/types';
import { getCurrentUserSession } from './auth.controller';

export interface CreateTicketInput {
  subject: string;
  description: string;
  priority?: TicketPriority;
}

/**
 * Creates a support ticket submitted by an authenticated client.
 */
export async function createClientTicket(input: CreateTicketInput): Promise<ClientActionResponse> {
  try {
    const session = await getCurrentUserSession();

    if (!session) {
      return { success: false, error: 'Unauthorized. Please sign in to open a support ticket.' };
    }

    const ticket = await db.clientTicket.create({
      data: {
        subject: input.subject,
        description: input.description,
        priority: input.priority || 'MEDIUM',
        status: 'OPEN',
        clientId: session.id,
      },
    });

    revalidatePath('/[locale]/client/tickets', 'page');
    revalidatePath('/[locale]/dashboard', 'page');

    return { success: true, data: ticket };
  } catch (err: unknown) {
    console.error('[Create Client Ticket Error]:', err);
    return { success: false, error: 'Failed to create support ticket. Please try again.' };
  }
}

/**
 * Updates status or priority of a support ticket.
 */
export async function updateClientTicket(
  ticketId: string,
  updates: { status?: TicketStatus; priority?: TicketPriority }
): Promise<ClientActionResponse> {
  try {
    const session = await getCurrentUserSession();

    if (!session) {
      return { success: false, error: 'Unauthorized.' };
    }

    const ticket = await db.clientTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return { success: false, error: 'Support ticket not found.' };
    }

    const isStaff = session.role === 'ADMIN' || session.role === 'PROJECT_MANAGER';
    if (!isStaff && ticket.clientId !== session.id) {
      return { success: false, error: 'Forbidden: You do not have permission to modify this ticket.' };
    }

    await db.clientTicket.update({
      where: { id: ticketId },
      data: updates,
    });

    revalidatePath('/[locale]/client/tickets', 'page');
    revalidatePath('/[locale]/dashboard', 'page');

    return { success: true };
  } catch (err: unknown) {
    console.error('[Update Client Ticket Error]:', err);
    return { success: false, error: 'Failed to update support ticket.' };
  }
}

/**
 * Server action to create a support ticket with session-derived identity.
 */
export async function createTicketAction(data: {
  subject: string;
  description: string;
  priority?: string;
  clientId?: string;
}) {
  const session = await getCurrentUserSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to create a support ticket.');
  }

  const subject = data.subject?.trim();
  const description = data.description?.trim();

  if (!subject || !description) {
    throw new Error('Subject and description are required for ticket creation.');
  }

  if (subject.length > 200) {
    throw new Error('Subject must be 200 characters or fewer.');
  }

  if (description.length > 10000) {
    throw new Error('Description must be 10,000 characters or fewer.');
  }

  // Prevent client ID spoofing: strictly enforce authenticated session user ID
  const clientId = session.id;
  const priority = data.priority || 'MEDIUM';

  try {
    const ticket = await db.clientTicket.create({
      data: {
        subject,
        description,
        priority,
        clientId,
        status: 'OPEN',
      },
    });

    revalidatePath('/[locale]/client/tickets', 'page');
    revalidatePath('/[locale]/dashboard', 'page');
    
    return { success: true, ticket };
  } catch (error: unknown) {
    console.error('Error creating support ticket:', error);
    throw new Error('Failed to submit the ticket to the database. Please try again.');
  }
}

export interface TicketWithRelations {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  clientId: string;
  assignedToId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignedTo?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
}

/**
 * Retrieves support tickets based on the user's role and identity.
 */
export async function getClientTickets(user?: { id: string; role: string }): Promise<TicketWithRelations[]> {
  try {
    const sessionUser = await getCurrentUserSession().catch(() => null);
    if (!sessionUser) {
      return [];
    }

    const activeUser = {
      id: sessionUser.role === 'ADMIN' && user?.id ? user.id : sessionUser.id,
      role: sessionUser.role,
    };

    const isClient = activeUser.role === 'CLIENT';
    const isProjectManager = activeUser.role === 'PROJECT_MANAGER';

    let whereClause = {};
    if (isClient) {
      whereClause = { clientId: activeUser.id };
    } else if (isProjectManager) {
      whereClause = { assignedToId: activeUser.id };
    }

    return await db.clientTicket.findMany({
      where: whereClause,
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
  } catch (err: unknown) {
    console.error('[Get Client Tickets Error]:', err);
    return [];
  }
}

