// Database Types for Kysely
// These are derived from the Kysely Database interface

import type { Database } from './kysely-types';

// User types
export type User = Database['users'];
export type NewUser = Omit<Database['users'], 'id'> & { id?: string };

// Post types
export type Post = Database['posts'];
export type NewPost = Omit<Database['posts'], 'id'> & { id?: number };

// Session types
export type DbSession = Database['sessions'];
export type NewSession = Database['sessions'];

// Token types
export type PasswordResetToken = Database['password_reset_tokens'];
export type EmailVerificationToken = Database['email_verification_tokens'];

// Auth types
export type AuthProvider = 'email' | 'google';

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface ProfileUpdateInput {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}
