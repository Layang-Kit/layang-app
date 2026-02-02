import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { emailVerificationTokens, users } from '$lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

// Hash token using SHA-256
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const load: PageServerLoad = async ({ url, locals }) => {
  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email');
  
  // Validate required params
  if (!token || !email) {
    return {
      success: false,
      message: 'Invalid verification link. Missing token or email.'
    };
  }
  
  try {
    // Find user by email
    const user = await locals.db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (!user) {
      return {
        success: false,
        message: 'User not found.'
      };
    }
    
    // Check if already verified
    if (user.emailVerified) {
      return {
        success: true,
        alreadyVerified: true,
        message: 'Your email is already verified!'
      };
    }
    
    // Hash the provided token
    const tokenHash = await hashToken(token);
    
    // Find valid token
    const verificationToken = await locals.db.query.emailVerificationTokens.findFirst({
      where: and(
        eq(emailVerificationTokens.userId, user.id),
        eq(emailVerificationTokens.tokenHash, tokenHash),
        eq(emailVerificationTokens.used, false),
        gt(emailVerificationTokens.expiresAt, Date.now())
      )
    });
    
    if (!verificationToken) {
      return {
        success: false,
        message: 'Invalid or expired verification link. Please request a new one.'
      };
    }
    
    // Mark email as verified
    await locals.db.update(users)
      .set({ 
        emailVerified: true,
        updatedAt: Date.now()
      })
      .where(eq(users.id, user.id));
    
    // Mark token as used
    await locals.db.update(emailVerificationTokens)
      .set({ used: true })
      .where(eq(emailVerificationTokens.id, verificationToken.id));
    
    return {
      success: true,
      message: 'Email verified successfully! You can now log in.'
    };
    
  } catch (err) {
    console.error('Email verification error:', err);
    return {
      success: false,
      message: 'An error occurred during verification. Please try again.'
    };
  }
};
