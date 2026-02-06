import { json, error, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

// Get current user profile
export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      throw error(401, { message: 'Unauthorized' });
    }
    
    // Get user from database (to get full profile data)
    const user = await locals.db
      .selectFrom('users')
      .where('id', '=', locals.user.id)
      .select([
        'id',
        'email',
        'name',
        'bio',
        'location',
        'website',
        'avatar',
        'provider',
        'email_verified',
        'created_at'
      ])
      .executeTakeFirst();
    
    if (!user) {
      throw error(404, { message: 'User not found' });
    }
    
    return json({ user });
    
  } catch (err: any) {
    console.error('Get profile error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Failed to get profile' });
  }
};

// Update user profile
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal(''))
});

export const PUT: RequestHandler = async ({ request, locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      throw error(401, { message: 'Unauthorized' });
    }
    
    const body = await request.json();
    
    // Validate input
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      throw error(400, { message: 'Invalid input' });
    }
    
    const { name, bio, location, website } = result.data;
    
    // Build update object (only include defined fields)
    const updateData: Record<string, unknown> = {
      updated_at: Date.now()
    };
    
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website || null;
    
    // Update user
    await locals.db
      .updateTable('users')
      .set(updateData)
      .where('id', '=', locals.user.id)
      .execute();
    
    return json({
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (err: any) {
    console.error('Update profile error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Failed to update profile' });
  }
};
