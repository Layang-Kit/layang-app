import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/db/schema';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  if (event.platform?.env.DB) {
    event.locals.db = drizzle(event.platform.env.DB, { schema });
  } else {
    throw new Error('D1 Database binding not found');
  }
  
  return resolve(event);
};
