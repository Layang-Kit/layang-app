import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateId } from '$lib/auth/session';

// GET /api/users
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const users = await locals.db
      .selectFrom('users')
      .select([
        'users.id',
        'users.email',
        'users.name',
        'users.provider',
        'users.created_at'
      ])
      .orderBy('users.created_at', 'desc')
      .execute();
    
    return json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    throw error(500, { message: 'Failed to fetch users' });
  }
};

// POST /api/users
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const body = await request.json() as { email?: string; name?: string };
    
    if (!body.email || !body.name) {
      throw error(400, { message: 'Email and name required' });
    }
    
    const userId = generateId();
    
    await locals.db
      .insertInto('users')
      .values({
        id: userId,
        email: body.email,
        name: body.name,
        provider: 'email',
        email_verified: 0,
        is_admin: 0,
        created_at: Date.now(),
        updated_at: Date.now()
      })
      .execute();
    
    const user = await locals.db
      .selectFrom('users')
      .where('id', '=', userId)
      .selectAll()
      .executeTakeFirst();
    
    return json({ success: true, data: user }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('UNIQUE constraint failed')) {
      throw error(409, { message: 'Email already exists' });
    }
    throw error(500, { message: 'Failed to create user' });
  }
};
