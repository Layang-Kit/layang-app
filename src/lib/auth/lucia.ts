import { Lucia, type Session, type User } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';
import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/db/schema';

// Create adapter factory function
export function createAuthAdapter(db: D1Database) {
  const drizzleDb = drizzle(db, { schema });
  return new DrizzleSQLiteAdapter(drizzleDb as any, schema.sessions as any, schema.users as any);
}

// Create Lucia instance
export function createLucia(adapter: any) {
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !dev
      }
    },
    getUserAttributes: (attributes) => {
      return {
        id: attributes.id,
        email: attributes.email,
        name: attributes.name,
        provider: attributes.provider,
        avatar: attributes.avatar,
        createdAt: attributes.created_at
      };
    }
  });
}

// Types
declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof createLucia>;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      name: string;
      provider: 'email' | 'google';
      avatar: string | null;
      created_at: number;
    };
  }
}

// Session validation helper
export async function validateSession(
  lucia: ReturnType<typeof createLucia>,
  sessionId: string
): Promise<{ user: User | null; session: Session | null }> {
  if (!sessionId) {
    return { user: null, session: null };
  }
  
  try {
    const result = await lucia.validateSession(sessionId);
    return result;
  } catch {
    return { user: null, session: null };
  }
}

// Generate user ID
export function generateId(): string {
  return crypto.randomUUID();
}
