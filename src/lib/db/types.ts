import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { users, posts, sessions, passwordResetTokens, emailVerificationTokens } from './schema';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
export type PasswordResetToken = InferSelectModel<typeof passwordResetTokens>;
export type EmailVerificationToken = InferSelectModel<typeof emailVerificationTokens>;

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
