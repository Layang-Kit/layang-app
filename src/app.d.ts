/// <reference types="@cloudflare/workers-types" />

import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type * as schema from '$lib/db/schema';

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
    }
  }
}

export {};
