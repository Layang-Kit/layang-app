-- Seed data for development
INSERT INTO users (email, name) VALUES 
  ('john@example.com', 'John Doe'),
  ('jane@example.com', 'Jane Smith'),
  ('bob@example.com', 'Bob Wilson');

INSERT INTO posts (title, content, published, author_id) VALUES 
  ('Hello World', 'My first post!', 1, 1),
  ('SvelteKit Tips', 'Best practices for SvelteKit', 1, 2),
  ('Draft Post', 'Work in progress...', 0, 3);
