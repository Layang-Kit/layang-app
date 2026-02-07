import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const id = params.id;
  
  const user = await locals.db
    .selectFrom('users')
    .where('users.id', '=', id)
    .selectAll()
    .executeTakeFirst();
  
  if (!user) {
    throw error(404, { message: 'User not found' });
  }
  
  return json({ success: true, data: user });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const id = params.id;
  
  await locals.db
    .deleteFrom('users')
    .where('id', '=', id)
    .execute();
  
  return json({ success: true, message: 'User deleted' });
};
