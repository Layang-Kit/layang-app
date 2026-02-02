import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table with auth support
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // UUID for Lucia auth
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  // Auth fields
  passwordHash: text('password_hash'), // null for OAuth users
  provider: text('provider', { enum: ['email', 'google'] }).notNull().default('email'),
  googleId: text('google_id').unique(), // for Google OAuth
  avatar: text('avatar'), // profile picture URL
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Sessions table for Lucia auth
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

// Posts table (existing)
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
  published: integer('published', { mode: 'boolean' }).default(false),
  authorId: text('author_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  posts: many(posts)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}));
