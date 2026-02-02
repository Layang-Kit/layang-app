import { config } from 'dotenv';
config();

const DB_ID = process.env.CLOUDFLARE_DATABASE_ID!;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

async function query(sql: string, params?: any[]) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );
  return res.json();
}

async function seed() {
  console.log('🌱 Seeding database...\n');
  
  // Insert users
  const users = [
    { email: 'john@example.com', name: 'John Doe' },
    { email: 'jane@example.com', name: 'Jane Smith' },
    { email: 'bob@example.com', name: 'Bob Wilson' },
  ];
  
  for (const user of users) {
    await query(
      'INSERT OR IGNORE INTO users (email, name) VALUES (?, ?)',
      [user.email, user.name]
    );
    console.log(`✅ User: ${user.name}`);
  }
  
  // Insert posts
  const posts = [
    { title: 'Hello World', content: 'My first post!', published: 1, author_email: 'john@example.com' },
    { title: 'SvelteKit Tips', content: 'Best practices for SvelteKit', published: 1, author_email: 'jane@example.com' },
    { title: 'Draft Post', content: 'Work in progress...', published: 0, author_email: 'bob@example.com' },
  ];
  
  for (const post of posts) {
    // Get user id first
    const userResult = await query('SELECT id FROM users WHERE email = ?', [post.author_email]);
    const userId = userResult.result?.[0]?.results?.[0]?.id;
    
    if (userId) {
      await query(
        'INSERT OR IGNORE INTO posts (title, content, published, author_id) VALUES (?, ?, ?, ?)',
        [post.title, post.content, post.published, userId]
      );
      console.log(`✅ Post: ${post.title}`);
    }
  }
  
  console.log('\n🎉 Seeding complete!');
  
  // Verify data
  const usersResult = await query('SELECT * FROM users');
  const postsResult = await query('SELECT * FROM posts');
  
  console.log('\n📊 Current data:');
  console.log(`Users: ${usersResult.result?.[0]?.results?.length || 0}`);
  console.log(`Posts: ${postsResult.result?.[0]?.results?.length || 0}`);
}

seed().catch(console.error);
