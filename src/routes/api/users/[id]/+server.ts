import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const id = params.id;
  const user = await locals.db.query.users.findFirst({
    where: eq(schema.users.id, id),
    with: { posts: true }
  });
  
  if (!user) throw error(404, { message: 'User not found' });
  
  return json({ success: true, data: user });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const id = params.id;
  await locals.db.delete(schema.users).where(eq(schema.users.id, id));
  return json({ success: true, message: 'User deleted' });
};
