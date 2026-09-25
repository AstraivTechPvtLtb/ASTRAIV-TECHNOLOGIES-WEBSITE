'use server';

/**
 * @file client/src/controllers/projects.controller.ts
 * @description [CONTROLLER] Business logic for querying and managing client projects in the portal.
 */

import { db } from '@/models/db';
import { Project, User } from '@prisma/client';
import { auth } from '@/models/auth';
import { headers } from 'next/headers';

export type ProjectWithRelations = Project & {
  client?: User | null;
  manager?: User | null;
};

/**
 * Retrieves projects assigned to or managed by the authenticated user.
 */
export async function getClientProjects(user?: { id: string; role: string }): Promise<ProjectWithRelations[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }).catch(() => null);

    // Prioritize verified session from cookie/headers over caller input
    const activeUser = session?.user
      ? { id: session.user.id, role: session.user.role || 'CLIENT' }
      : user;

    if (!activeUser || !activeUser.id) {
      return [];
    }

    if (activeUser.role === 'ADMIN') {
      return await db.project.findMany({
        include: { client: true, manager: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

    if (activeUser.role === 'PROJECT_MANAGER') {
      return await db.project.findMany({
        where: { managerId: activeUser.id },
        include: { client: true, manager: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

    // Default: CLIENT role
    return await db.project.findMany({
      where: { clientId: activeUser.id },
      include: { manager: true },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (error) {
    console.error('[Get Client Projects Error]:', error);
    return [];
  }
}
