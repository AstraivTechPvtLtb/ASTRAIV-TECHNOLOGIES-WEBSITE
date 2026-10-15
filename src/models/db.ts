/**
 * @file client/src/models/db.ts
 * @description [MODEL] Prisma ORM database connection client for the Client Website & Portal.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function getCleanConnectionString(): string {
  let raw = process.env.DATABASE_URL?.trim();

  if (!raw) {
    if (
      process.env.NODE_ENV === 'test' ||
      Boolean(process.env.VITEST) ||
      Boolean(process.env.CI) ||
      process.env.NEXT_PHASE === 'phase-production-build'
    ) {
      raw = 'postgresql://postgres:postgres@localhost:5432/astraiv_db';
    } else {
      throw new Error(
        '[Database Error]: DATABASE_URL environment variable is missing. A valid PostgreSQL connection string is required.'
      );
    }
  }

  const conn = raw.trim().replace(/^["']|["']$/g, '').trim();

  return conn;
}


const connectionString = getCleanConnectionString();
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    ssl: isLocalhost
      ? false
      : {
          rejectUnauthorized: true,
          ...(process.env.PGSSLROOTCERT ? { ca: fs.readFileSync(process.env.PGSSLROOTCERT).toString() } : {}),
        },
    max: 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });
const adapter = new PrismaPg(pool);

// Discard cached PrismaClient if Review model does not have the new relational fields
if (globalForPrisma.prisma) {
  try {
    const fields = (globalForPrisma.prisma as unknown as { _runtimeDataModel?: { models?: { Review?: { fields?: Array<{ name: string }> } } } })?._runtimeDataModel?.models?.Review?.fields;
    if (!fields || !fields.some((f) => f.name === 'projectId')) {
      globalForPrisma.prisma = undefined;
    }
  } catch {
    globalForPrisma.prisma = undefined;
  }
}

const isTest = Boolean(process.env.VITEST) || process.env.NODE_ENV === 'test';

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isTest ? [] : process.env.DEBUG_PRISMA ? ['error', 'warn'] : [],
  });

globalForPrisma.prisma = db;
globalForPrisma.pool = pool;

export { pool };

