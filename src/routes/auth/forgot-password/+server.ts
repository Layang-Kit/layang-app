import { json, error, type RequestHandler } from '@sveltejs/kit';
import { generateId } from '$lib/auth/lucia';
import { users, passwordResetTokens } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash token using SHA-256
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const body = await request.json();
    
    // Validate input
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      throw error(400, { message: 'Invalid email address' });
    }

    const { email } = result.data;

    // Find user by email
    const user = await locals.db.query.users.findFirst({
      where: eq(users.email, email)
    });

    // Don't reveal if user exists (security best practice)
    // But for better UX, we'll just return success
    if (!user) {
      return json({
        success: true,
        message: 'If an account exists, password reset instructions have been sent'
      });
    }

    // Check if user has a password (OAuth users might not have one)
    if (!user.passwordHash) {
      return json({
        success: true,
        message: 'If an account exists, password reset instructions have been sent'
      });
    }

    // Generate reset token
    const token = generateToken();
    const tokenHash = await hashToken(token);

    // Delete any existing unused tokens for this user
    await locals.db.delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));

    // Create new reset token (expires in 1 hour)
    const expiresAt = Date.now() + 60 * 60 * 1000;

    await locals.db.insert(passwordResetTokens).values({
      id: generateId(),
      userId: user.id,
      tokenHash,
      expiresAt
    });

    // TODO: Send email with reset link
    // For development, we'll log the link to console
    const resetUrl = `/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    console.log('\n🔐 Password Reset Link:\n', resetUrl, '\n');

    // In production, you would send an email here
    // Example:
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset your password',
    //   html: `Click here to reset: <a href="${resetUrl}">${resetUrl}</a>`
    // });

    return json({
      success: true,
      message: 'If an account exists, password reset instructions have been sent',
      // Only for development - remove in production!
      devLink: resetUrl
    });

  } catch (err: any) {
    console.error('Forgot password error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Failed to process request' });
  }
};
