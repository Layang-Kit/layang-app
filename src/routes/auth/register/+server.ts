import { json, error, type RequestHandler } from '@sveltejs/kit';
import { generateId, createAuthAdapter, createLucia } from '$lib/auth/lucia';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '$lib/auth/password';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  try {
    // Check if D1 binding exists
    if (!platform?.env.DB) {
      throw error(500, { message: 'Database not available' });
    }

    const body = await request.json();
    
    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      throw error(400, { 
        message: 'Validation failed'
      });
    }

    const { email, name, password } = result.data;

    // Check if user already exists
    const existingUser = await locals.db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      throw error(409, { message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate user ID
    const userId = generateId();

    // Create user
    await locals.db.insert(users).values({
      id: userId,
      email,
      name,
      passwordHash,
      provider: 'email'
    });

    // Create session
    const adapter = createAuthAdapter(platform.env.DB);
    const lucia = createLucia(adapter);
    
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return json(
      { 
        success: true, 
        message: 'Registration successful',
        user: { id: userId, email, name }
      },
      {
        status: 201,
        headers: {
          'Set-Cookie': sessionCookie.serialize()
        }
      }
    );

  } catch (err: any) {
    console.error('Registration error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Registration failed' });
  }
};
