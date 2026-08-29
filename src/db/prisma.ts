import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:Akashindia123%40@localhost:5432/astraiv_tech?schema=public';
  
  // Use connection pool for direct database queries
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
  });
  
  // Prevent unhandled errors on idle clients from crashing the process
  pool.on('error', (err) => {
    console.warn('PostgreSQL pool background error:', err?.message || err);
  });

  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}
export default db;
