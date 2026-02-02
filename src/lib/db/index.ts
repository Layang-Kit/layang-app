import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { D1Database } from '@cloudflare/workers-types';

export { schema };
export type DB = typeof schema;

export function createDB(d1: D1Database) {
  return drizzle(d1, { schema });
}
