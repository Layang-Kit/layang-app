import { json, error, type RequestHandler } from '@sveltejs/kit';
import { createAuthAdapter, createLucia } from '$lib/auth/lucia';

export const POST: RequestHandler = async ({ locals, cookies, platform }) => {
  try {
    // Check if D1 binding exists
    if (!platform?.env.DB) {
      throw error(500, { message: 'Database not available' });
    }

    // Get session ID from cookie
    const sessionId = cookies.get('auth_session');
    
    if (!sessionId) {
      return json({ success: true, message: 'Already logged out' });
    }

    // Invalidate session
    const adapter = createAuthAdapter(platform.env.DB);
    const lucia = createLucia(adapter);
    
    await lucia.invalidateSession(sessionId);

    // Create blank session cookie
    const blankCookie = lucia.createBlankSessionCookie();

    return json(
      { success: true, message: 'Logout successful' },
      {
        headers: {
          'Set-Cookie': blankCookie.serialize()
        }
      }
    );

  } catch (err: any) {
    console.error('Logout error:', err);
    
    if (err.status) throw err;
    
    throw error(500, { message: 'Logout failed' });
  }
};
