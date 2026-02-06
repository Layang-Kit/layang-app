import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateId } from '$lib/auth/session';

// GET /api/users
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const users = await locals.db
      .selectFrom('users')
      .leftJoin('posts', 'users.id', 'posts.author_id')
      .select([
        'users.id',
        'users.email',
        'users.name',
        'users.provider',
        'users.created_at',
        'posts.id as post_id',
        'posts.title as post_title',
        'posts.published as post_published'
      ])
      .orderBy('users.created_at', 'desc')
      .execute();
    
    // Group posts by user
    const usersMap = new Map();
    for (const row of users) {
      if (!usersMap.has(row.id)) {
        usersMap.set(row.id, {
          id: row.id,
          email: row.email,
          name: row.name,
          provider: row.provider,
          created_at: row.created_at,
          posts: []
        });
      }
      if (row.post_id) {
        usersMap.get(row.id).posts.push({
          id: row.post_id,
          title: row.post_title,
          published: row.post_published
        });
      }
    }
    
    return json({ success: true, data: Array.from(usersMap.values()) });
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
