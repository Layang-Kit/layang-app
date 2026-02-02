import { json, error, type RequestHandler } from '@sveltejs/kit';
import { createAuthAdapter, createLucia } from '$lib/auth/lucia';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '$lib/auth/password';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  try {
    // Check if D1 binding exists
    if (!platform?.env.DB) {
      throw error(500, { message: 'Database not available' });
    }

    const body = await request.json();
    
    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      throw error(400, { 
        message: 'Validation failed'
      });
    }

    const { email, password } = result.data;

    // Find user
    const user = await locals.db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      throw error(401, { message: 'Invalid email or password' });
    }

    // Check if user has password (OAuth users might not have one)
    if (!user.passwordHash) {
      throw error(401, { 
        message: 'Please use Google login for this account' 
      });
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      throw error(401, { message: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw error(403, { 
        message: 'Please verify your email before logging in. Check your inbox or request a new verification email.' 
      });
    }

    // Create session
    const adapter = createAuthAdapter(platform.env.DB);
    const lucia = createLucia(adapter);
    
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return json(
      { 
        success: true, 
        message: 'Login successful',
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          provider: user.provider
        }
      },
      {
        headers: {
          'Set-Cookie': sessionCookie.serialize()
        }
      }
    );

  } catch (err: any) {
    console.error('Login error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Login failed' });
  }
};
