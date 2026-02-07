import { config } from 'dotenv';
config();

const DB_ID = process.env.CLOUDFLARE_DATABASE_ID!;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
  
  // Generate UUIDs for users
  const user1Id = generateUUID();
  const user2Id = generateUUID();
  const user3Id = generateUUID();
  
  // Insert users
  const users = [
    { id: user1Id, email: 'john@example.com', name: 'John Doe', provider: 'email' },
    { id: user2Id, email: 'jane@example.com', name: 'Jane Smith', provider: 'google' },
    { id: user3Id, email: 'bob@example.com', name: 'Bob Wilson', provider: 'email' },
  ];
  
  for (const user of users) {
    await query(
      `INSERT OR IGNORE INTO users (id, email, name, provider) VALUES (?, ?, ?, ?)`,
      [user.id, user.email, user.name, user.provider]
    );
    console.log(`✅ User: ${user.name} (${user.provider})`);
  }
  
  console.log('\n🎉 Seeding complete!');
  
  // Verify data
  const usersResult = await query('SELECT * FROM users');
  
  console.log('\n📊 Current data:');
  console.log(`Users: ${usersResult.result?.[0]?.results?.length || 0}`);
}

seed().catch(console.error);
