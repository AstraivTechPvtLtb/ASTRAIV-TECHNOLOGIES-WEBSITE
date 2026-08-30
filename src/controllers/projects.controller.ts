'use server';

/**
 * @file client/src/controllers/projects.controller.ts
 * @description [CONTROLLER] Business logic for querying and managing client projects in the portal.
 */

import { db } from '@/models/db';
import { Project, User } from '@prisma/client';

export type ProjectWithRelations = Project & {
  client?: User | null;
  manager?: User | null;
};

/**
 * Retrieves projects assigned to or managed by the authenticated user.
 */
export async function getClientProjects(user: { id: string; role: string }): Promise<ProjectWithRelations[]> {
  try {
    if (user.role === 'ADMIN') {
      return await db.project.findMany({
        include: { client: true, manager: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

    if (user.role === 'PROJECT_MANAGER') {
      return await db.project.findMany({
        where: { managerId: user.id },
        include: { client: true, manager: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

    // Default: CLIENT role
    return await db.project.findMany({
      where: { clientId: user.id },
      include: { manager: true },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (error) {
    console.error('[Get Client Projects Error]:', error);
    return [];
  }
}
