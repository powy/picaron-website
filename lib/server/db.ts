import pg from 'pg';
import { shouldUseSsl } from '../../scripts/db/ssl-policy.mjs';

export type Db = pg.Pool;

/** Anything that can run a query: the pool, or a client inside a transaction. */
export type Queryable = Pick<pg.Pool, 'query'> | pg.PoolClient;

// Cached on globalThis so Next.js dev hot reloads don't open a new pool (and
// leak connections) on every edit.
const globalForDb = globalThis as unknown as { picaronPools?: Map<string, pg.Pool> };

export function getPool(databaseUrl: string, max = 5): pg.Pool {
  globalForDb.picaronPools ??= new Map();
  let pool = globalForDb.picaronPools.get(databaseUrl);
  if (!pool) {
    pool = new pg.Pool({ connectionString: databaseUrl, ssl: shouldUseSsl(databaseUrl), max });
    globalForDb.picaronPools.set(databaseUrl, pool);
  }
  return pool;
}

export async function withTransaction<T>(pool: pg.Pool, fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
