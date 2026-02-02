-- Migration: Add authentication support
-- Drop old tables (data will be lost, but this is a fresh auth setup)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Create new users table with auth fields
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- UUID for Lucia auth
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT,   -- null for OAuth users
  provider TEXT NOT NULL DEFAULT 'email' CHECK (provider IN ('email', 'google')),
  google_id TEXT UNIQUE,
  avatar TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create sessions table for Lucia auth
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

-- Create posts table (updated for new user.id type)
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  published INTEGER DEFAULT 0,
  author_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_posts_author ON posts(author_id);
