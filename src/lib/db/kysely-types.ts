// Kysely Database Types - Generated from Drizzle Schema
// NOTE: Keep in sync with schema.ts

export interface Database {
  users: {
    id: string;
    email: string;
    name: string;
    bio: string | null;
    location: string | null;
    website: string | null;
    password_hash: string | null;
    provider: 'email' | 'google';
    google_id: string | null;
    avatar: string | null;
    email_verified: number; // SQLite boolean = 0/1
    is_admin: number;
    created_at: number;
    updated_at: number;
  };

  sessions: {
    id: string;
    user_id: string;
    expires_at: number;
  };

  password_reset_tokens: {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: number;
    used: number; // SQLite boolean = 0/1
    created_at: number;
  };

  email_verification_tokens: {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: number;
    used: number; // SQLite boolean = 0/1
    created_at: number;
  };
 
}

// Helper type for Kysely instance
export type DB = Database;
