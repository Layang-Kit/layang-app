import { json, error, type RequestHandler } from '@sveltejs/kit';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Get current user profile
export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user) {
      throw error(401, { message: 'Unauthorized' });
    }
    
    // Get user from database (to get full profile data)
    const user = await locals.db.query.users.findFirst({
      where: eq(users.id, locals.user.id),
      columns: {
        id: true,
        email: true,
        name: true,
        bio: true,
        location: true,
        website: true,
        avatar: true,
        provider: true,
        emailVerified: true,
        createdAt: true
      }
    });
    
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
    const updateData: any = {
      updatedAt: Date.now()
    };
    
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website || null;
    
    // Update user
    await locals.db.update(users)
      .set(updateData)
      .where(eq(users.id, locals.user.id));
    
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
