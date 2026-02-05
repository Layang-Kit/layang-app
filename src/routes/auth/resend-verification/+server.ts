import { json, error, type RequestHandler } from '@sveltejs/kit';
import { generateId } from '$lib/auth/session';
import { emailVerificationTokens, users } from '$lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { sendEmail } from '$lib/email/resend';
import { generateVerificationEmail } from '$lib/email/templates/verification';

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

export const POST: RequestHandler = async ({ request, locals, url }) => {
  try {
    // Get email from form data or JSON
    let email: string;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await request.json() as { email?: string };
      email = body.email || '';
    } else {
      const formData = await request.formData();
      email = formData.get('email') as string;
    }
    
    if (!email) {
      throw error(400, { message: 'Email is required' });
    }
    
    // Find user
    const user = await locals.db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (!user) {
      // Don't reveal if user exists
      return json({
        success: true,
        message: 'If an account exists, a verification email has been sent.'
      });
    }
    
    // Check if already verified
    if (user.emailVerified) {
      return json({
        success: true,
        message: 'Email is already verified.'
      });
    }
    
    // Check for recent token (rate limiting - 1 minute)
    const oneMinuteAgo = Date.now() - 60 * 1000;
    const recentToken = await locals.db.query.emailVerificationTokens.findFirst({
      where: and(
        eq(emailVerificationTokens.userId, user.id),
        gt(emailVerificationTokens.createdAt, oneMinuteAgo)
      )
    });
    
    if (recentToken) {
      throw error(429, { 
        message: 'Please wait a minute before requesting another email.' 
      });
    }
    
    // Generate new token
    const token = generateToken();
    const tokenHash = await hashToken(token);
    
    // Delete old unused tokens for this user
    await locals.db.delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, user.id));
    
    // Create new token (expires in 24 hours)
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    
    await locals.db.insert(emailVerificationTokens).values({
      id: generateId(),
      userId: user.id,
      tokenHash,
      expiresAt
    });
    
    // Generate verification URL
    const verificationUrl = `${url.origin}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Send email
    const emailTemplate = generateVerificationEmail({
      name: user.name,
      verificationUrl,
      expiresIn: '24 hours'
    });
    
    const result = await sendEmail({
      to: email,
      subject: 'Verify your email address',
      html: emailTemplate.html,
      text: emailTemplate.text
    });
    
    if (!result.success) {
      console.error('Failed to send verification email:', result.error);
      // Don't expose error to user for security
    }
    
    return json({
      success: true,
      message: 'If an account exists, a verification email has been sent.',
      // For development only
      ...(process.env.NODE_ENV === 'development' && {
        devLink: verificationUrl
      })
    });
    
  } catch (err: any) {
    console.error('Resend verification error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Failed to send verification email' });
  }
};
