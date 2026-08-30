'use server';

/**
 * @file client/src/controllers/tickets.controller.ts
 * @description [CONTROLLER] Business logic for managing Client Portal support tickets and workflows.
 */

import { db } from '@/models/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/models/auth';
import { headers } from 'next/headers';
import { TicketPriority, TicketStatus, ClientActionResponse } from '@/models/types';

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized. Please sign in to open a support ticket.' };
    }

    const ticket = await db.clientTicket.create({
      data: {
        subject: input.subject,
        description: input.description,
        priority: input.priority || 'MEDIUM',
        status: 'OPEN',
        clientId: session.user.id,
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized.' };
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
 * Server action to create a support ticket with specific client ID.
 */
export async function createTicketAction(data: {
  subject: string;
  description: string;
  priority: string;
  clientId: string;
}) {
  if (!data.subject || !data.description || !data.clientId) {
    throw new Error('Missing required fields for ticket creation.');
  }

  try {
    const ticket = await db.clientTicket.create({
      data: {
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        clientId: data.clientId,
        status: 'OPEN',
      },
    });

    revalidatePath('/[locale]/client/tickets', 'page');
    revalidatePath('/[locale]/dashboard', 'page');
    
    return { success: true, ticket };
  } catch (error: unknown) {
    console.error('Error creating support ticket:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit the ticket to the database.';
    throw new Error(message);
  }
}

