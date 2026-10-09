/**
 * @file client/src/models/db.ts
 * @description [MODEL] Prisma ORM database connection client for the Client Website & Portal.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function getCleanConnectionString(): string {
  let raw = process.env.DATABASE_URL?.trim();

  if (!raw) {
    if (process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST)) {
      raw = 'postgresql://postgres:postgres@localhost:5432/astraiv_db';
    } else {
      throw new Error(
        '[Database Error]: DATABASE_URL environment variable is missing. A valid PostgreSQL connection string is required.'
      );
    }
  }

  let conn = raw.trim().replace(/^["']|["']$/g, '').trim();

  // If a pooler.supabase.com URL uses port 5432 (session mode), automatically upgrade to port 6543 (transaction mode with pgbouncer)
  // to avoid (EMAXCONNSESSION) max clients reached errors on serverless
  if (conn.includes('pooler.supabase.com:5432')) {
    conn = conn.replace('pooler.supabase.com:5432', 'pooler.supabase.com:6543');
    if (!conn.includes('pgbouncer=true')) {
      conn += (conn.includes('?') ? '&' : '?') + 'pgbouncer=true';
    }
  }

  return conn;
}

const connectionString = getCleanConnectionString();
const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
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

