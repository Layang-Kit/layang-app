// Database exports
// Note: Kysely instance is created in hooks.server.ts
// Schema is kept for Drizzle Kit migrations only

export * as schema from './schema';
export type { Database, DB } from './kysely-types';
export type {
  User,
  NewUser,
  Post,
  NewPost,
  DbSession,
  NewSession,
  PasswordResetToken,
  EmailVerificationToken,
  AuthProvider,
  RegisterInput,
  LoginInput,
  GoogleUser,
  ProfileUpdateInput
} from './types';
