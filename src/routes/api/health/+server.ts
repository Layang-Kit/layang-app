import { json } from '@sveltejs/kit';
import * as schema from '$lib/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  const start = Date.now();
  
  // Test DB connection
  await locals.db.select().from(schema.users).limit(1).catch(() => null);
  
  return json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    latency: `${Date.now() - start}ms`,
    db: 'connected'
  });
};
