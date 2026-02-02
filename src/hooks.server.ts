import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/db/schema';
import { createAuthAdapter, createLucia, validateSession } from '$lib/auth/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Initialize database
  if (event.platform?.env.DB) {
    event.locals.db = drizzle(event.platform.env.DB, { schema });
  } else {
    throw new Error('D1 Database binding not found');
  }
  
  // Initialize auth
  const adapter = createAuthAdapter(event.platform.env.DB);
  const lucia = createLucia(adapter);
  
  // Get session from cookie
  const sessionId = event.cookies.get(lucia.sessionCookieName) ?? null;
  
  if (sessionId) {
    // Validate session
    const { user, session } = await validateSession(lucia, sessionId);
    
    if (session && session.fresh) {
      // Session was refreshed, update cookie
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      });
    }
    
    if (!session) {
      // Session invalid, clear cookie
      const blankCookie = lucia.createBlankSessionCookie();
      event.cookies.set(blankCookie.name, blankCookie.value, {
        path: '.',
        ...blankCookie.attributes
      });
    }
    
    // Set user in locals
    event.locals.user = user;
    event.locals.session = session;
  } else {
    event.locals.user = null;
    event.locals.session = null;
  }
  
  return resolve(event);
};
