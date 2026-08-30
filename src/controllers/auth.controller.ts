'use server';

/**
 * @file client/src/controllers/auth.controller.ts
 * @description [CONTROLLER] Authentication and session management controller for the Client Portal.
 */

import { headers } from 'next/headers';
import { auth } from '@/models/auth';

export interface ClientUserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

/**
 * Retrieves the currently authenticated user from Better Auth session headers.
 */
export async function getCurrentUserSession(): Promise<ClientUserSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role || 'USER',
      image: session.user.image,
    };
  } catch (error) {
    console.error('[Get Current User Session Error]:', error);
    return null;
  }
}
