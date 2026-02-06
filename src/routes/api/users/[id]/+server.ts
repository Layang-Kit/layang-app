import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const id = params.id;
  
  const rows = await locals.db
    .selectFrom('users')
    .leftJoin('posts', 'users.id', 'posts.author_id')
    .where('users.id', '=', id)
    .select([
      'users.id',
      'users.email',
      'users.name',
      'users.provider',
      'users.created_at',
      'posts.id as post_id',
      'posts.title as post_title',
      'posts.content as post_content',
      'posts.published as post_published'
    ])
    .execute();
  
  if (rows.length === 0) {
    throw error(404, { message: 'User not found' });
  }
  
  // Group posts
  const user = {
    id: rows[0].id,
    email: rows[0].email,
    name: rows[0].name,
    provider: rows[0].provider,
    created_at: rows[0].created_at,
    posts: rows
      .filter(r => r.post_id !== null)
      .map(r => ({
        id: r.post_id,
        title: r.post_title,
        content: r.post_content,
        published: r.post_published
      }))
  };
  
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
