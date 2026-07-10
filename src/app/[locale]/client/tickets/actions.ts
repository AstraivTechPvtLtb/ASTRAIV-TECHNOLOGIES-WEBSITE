'use server';

import { db } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

interface CreateTicketInput {
  subject: string;
  description: string;
  priority: string;
  clientId: string;
}

/**
 * Server action to create a support ticket in the database.
 * Auto-revalidates the client support tickets page on success.
 */
export async function createTicketAction(data: CreateTicketInput) {
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

    // Revalidate client ticket routes so the list immediately updates without page reload
    revalidatePath('/[locale]/client/tickets', 'page');
    revalidatePath('/[locale]/dashboard', 'page');
    
    return { success: true, ticket };
  } catch (error: unknown) {
    console.error('Error creating support ticket:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit the ticket to the database.';
    throw new Error(message);
  }
}
