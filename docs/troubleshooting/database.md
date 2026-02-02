# Troubleshooting - Database Issues

Solusi untuk masalah database Cloudflare D1.

## ❌ "D1 binding not found"

### Penyebab
- `database_id` di `wrangler.toml` salah
- Database belum dibuat
- Typo di binding name

### Solusi

1. Check `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "a1b2c3d4-..."  # Pastikan ID benar
```

2. Verifikasi database exists:
```bash
npx wrangler d1 list
```

3. Jika tidak ada, create baru:
```bash
npx wrangler d1 create DB
```

---

## ❌ "Database not available"

### Penyebab
- Migration belum dijalankan
- Table belum dibuat

### Solusi

```bash
# Apply migrations
npm run db:migrate:local

# Check tables
npx wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table'"
```

---

## ❌ "Migration failed"

### Penyebab
- SQL syntax error
- Table sudah exists
- Constraint violation

### Solusi

1. Check migration file:
```bash
cat drizzle/0000_initial.sql
```

2. Reset dan re-migrate:
```bash
# Hati-hati: ini hapus semua data!
npx wrangler d1 execute DB --local --command "DROP TABLE IF EXISTS users"
npm run db:migrate:local
```

3. Atau create migration baru:
```bash
npm run db:generate
```

---

## ❌ "Permission denied"

### Penyebab
- API token tidak punya permission D1:Edit

### Solusi

1. Buat token baru di Dashboard:
   - My Profile → API Tokens
   - Create Token → Custom
   - Permissions: Account → D1 → Edit

2. Update `.env`:
```env
CLOUDFLARE_API_TOKEN=token_baru
```

---

## ❌ Drizzle Studio tidak connect

### Penyebab
- Drizzle config salah
- Database tidak accessible

### Solusi

1. Check `drizzle.config.ts`:
```typescript
export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'd1-http',
  // ... credentials
};
```

2. Pastikan `.env` terisi:
```env
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_DATABASE_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
```

3. Jalankan studio:
```bash
npm run db:studio
```

---

## 🔧 Check Database Health

### Via API

```bash
curl http://localhost:5173/api/health
```

Expected:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2024-01-..."
}
```

### Via Wrangler CLI

```bash
# List tables
npx wrangler d1 execute DB --local --command ".tables"

# Count users
npx wrangler d1 execute DB --local --command "SELECT COUNT(*) FROM users"

# Check schema
npx wrangler d1 execute DB --local --command "PRAGMA table_info(users)"
```

---

## 📞 Masih Bermasalah?

Check:
1. [Cloudflare D1 Status](https://www.cloudflarestatus.com/)
2. [D1 Documentation](https://developers.cloudflare.com/d1/)
3. [Drizzle ORM Docs](https://orm.drizzle.team/docs)
