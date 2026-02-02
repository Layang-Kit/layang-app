/// <reference types="@cloudflare/workers-types" />

import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type * as schema from '$lib/db/schema';
import type { Session, User } from 'lucia';

declare global {
  namespace App {
    interface Platform {
      env: {
        DB: D1Database;
      };
      context: ExecutionContext;
    }
    
    interface Locals {
      db: DrizzleD1Database<typeof schema>;
      user: User | null;
      session: Session | null;
    }
  }
}

export {};
