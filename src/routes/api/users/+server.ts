import { json, error } from '@sveltejs/kit';
import * as schema from '$lib/db/schema';
import type { RequestHandler } from './$types';

// GET /api/users
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const users = await locals.db.query.users.findMany({
      with: { posts: true },
      orderBy: (users, { desc }) => [desc(users.createdAt)]
    });
    
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
    
    const result = await locals.db.insert(schema.users).values({
      email: body.email,
      name: body.name
    }).returning();
    
    return json({ success: true, data: result[0] }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes('UNIQUE constraint failed')) {
      throw error(409, { message: 'Email already exists' });
    }
    throw error(500, { message: 'Failed to create user' });
  }
};
