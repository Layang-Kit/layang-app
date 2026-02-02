import { json, error, type RequestHandler } from '@sveltejs/kit';
import { users, passwordResetTokens } from '$lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { z } from 'zod';
import { hashPassword } from '$lib/auth/password';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

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
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      throw error(400, { message: 'Invalid input' });
    }

    const { token, email, password } = result.data;

    // Find user by email
    const user = await locals.db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      throw error(400, { message: 'Invalid or expired reset token' });
    }

    // Hash the provided token
    const tokenHash = await hashToken(token);

    // Find valid token
    const resetToken = await locals.db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.userId, user.id),
        eq(passwordResetTokens.tokenHash, tokenHash),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    });

    if (!resetToken) {
      throw error(400, { message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await locals.db.update(users)
      .set({ 
        passwordHash,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Mark token as used
    await locals.db.update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id));

    // Delete all sessions for this user (force re-login)
    // Note: You might want to keep this optional depending on your security requirements

    return json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (err: any) {
    console.error('Reset password error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Failed to reset password' });
  }
};
