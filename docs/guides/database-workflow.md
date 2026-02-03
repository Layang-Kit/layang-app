# Local vs Production Database

Panduan lengkap cara switch antara database lokal (SQLite) dan Cloudflare D1 (production).

---

## 📋 Overview

Project ini menggunakan **dua mode database**:

| Mode | Lokasi | Kapan Digunakan |
|------|--------|-----------------|
| **Local** | File SQLite di `.wrangler/state/v3/d1/` | Development (`npm run dev`) |
| **Production** | Cloudflare D1 (edge) | Production (`npm run deploy`) |

---

## ⚙️ Konfigurasi

### wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "83111ad0-7fa8-4723-b8d2-96ad00e60e04"      # Remote D1 ID
preview_database_id = "DB"                                   # "DB" = local, di-comment = remote
migrations_dir = "drizzle"
```

**Kunci:** `preview_database_id`

| Nilai | Hasil saat `npm run dev` |
|-------|--------------------------|
| `preview_database_id = "DB"` | **Local SQLite** ✅ Recommended for dev |
| `# preview_database_id = ...` | **Remote D1** (production database) |
| Hapus baris tersebut | **Remote D1** |

---

## 🔄 Switch ke Production (Deploy)

### Langkah 1: Comment preview_database_id

```toml
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "83111ad0-7fa8-4723-b8d2-96ad00e60e04"
# preview_database_id = "DB"  # Comment this line for production
```

### Langkah 2: Apply Migrations ke Production

```bash
# Apply semua migrasi ke database remote
npm run db:migrate

# Atau manual:
npx wrangler d1 migrations apply DB --remote
```

### Langkah 3: Verify Database

```bash
# Cek tabel di production
npx wrangler d1 execute DB --remote --command="SELECT name FROM sqlite_master WHERE type='table'"

# Cek data users
npx wrangler d1 execute DB --remote --command="SELECT email, name, created_at FROM users"
```

### Langkah 4: Deploy

```bash
npm run build
npm run deploy
```

---

## 🔄 Switch ke Local (Development)

### Langkah 1: Uncomment preview_database_id

```toml
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "83111ad0-7fa8-4723-b8d2-96ad00e60e04"
preview_database_id = "DB"  # Uncomment for local development
```

### Langkah 2: Start Dev Server

```bash
npm run dev
```

Database otomatis dibuat di `.wrangler/state/v3/d1/` saat pertama kali diakses.

---

## 🗑️ Reset Database

### Reset Local Database

```bash
# Hapus semua data dan apply ulang migrasi
npm run db:refresh:local

# Atau manual:
rm -rf .wrangler/state/d1
npm run db:migrate:local
```

### Reset Production Database

**⚠️ Hati-hati! Ini menghapus semua data production!**

Cloudflare tidak mendukung drop database via CLI. Pilihan:

1. **Via Dashboard:**
   - Buka https://dash.cloudflare.com
   - Workers & Pages → D1
   - Delete database → Create new

2. **Drop tables satu per satu:**
   ```bash
   npx wrangler d1 execute DB --remote --command="DROP TABLE IF EXISTS users"
   npx wrangler d1 execute DB --remote --command="DROP TABLE IF EXISTS sessions"
   # ... dst
   ```

3. **Re-create database:**
   ```bash
   # Hapus database lama
   npx wrangler d1 delete DB
   
   # Buat baru
   npx wrangler d1 create DB
   
   # Update database_id di wrangler.toml
   # Apply migrasi
   npm run db:migrate
   ```

---

## 📤 Copy Data: Local → Production

Kalau ada data di lokal yang mau dipindah ke production:

```bash
# 1. Export data lokal
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/xxx.sqlite ".dump users" > users_export.sql

# 2. Edit file SQL (hapus CREATE TABLE, hanya INSERT saja)

# 3. Import ke production
npx wrangler d1 execute DB --remote --file=./users_export.sql
```

---

## 🧪 Testing Production Locally

Kalau mau test pakai database production saat development:

```bash
# 1. Comment preview_database_id di wrangler.toml
# 2. Pastikan CLOUDFLARE_API_TOKEN valid di .env

# 3. Jalankan dev dengan binding remote
npx wrangler pages dev .svelte-kit/cloudflare --binding DB=<database_id>
```

---

## 📊 Command Cheat Sheet

| Task | Local | Production |
|------|-------|------------|
| **Apply migrations** | `npm run db:migrate:local` | `npm run db:migrate` |
| **Execute SQL** | `npx wrangler d1 execute DB --local --command="..."` | `npx wrangler d1 execute DB --remote --command="..."` |
| **View data** | `sqlite3 .wrangler/state/v3/d1/...sqlite` | `npx wrangler d1 execute DB --remote --command="SELECT * FROM users"` |
| **Reset** | `rm -rf .wrangler/state/d1` | Via dashboard atau drop tables |
| **Backup** | Copy file `.sqlite` | `npx wrangler d1 export DB --remote --output=./backup.sql` |

---

## ⚠️ Common Issues

### "Database binding not found"

**Penyebab:** `preview_database_id` di-comment tapi dev server berjalan

**Solusi:**
```bash
# Jika mau pakai local:
uncomment preview_database_id = "DB" di wrangler.toml

# Jika mau pakai remote:
pastikan API token valid
npx wrangler login  # jika belum login
```

### "table users has no column named X"

**Penyebab:** Schema di code tidak match dengan database

**Solusi (local):**
```bash
npm run db:refresh:local
```

**Solusi (production):**
```bash
npm run db:migrate
```

### "D1_ERROR: no such table: email_verification_tokens"

**Penyebab:** Migrasi belum diapply

**Solusi:**
```bash
# Local
npm run db:migrate:local

# Production
npm run db:migrate
```

---

## 📝 Best Practices

1. **Selalu pakai local saat development** - Lebih cepat, tidak terkena rate limit
2. **Jangan commit perubahan `preview_database_id`** ke git - Bisa accident deploy ke production
3. **Backup sebelum migrasi production** - Export data dulu
4. **Test migrasi di local dulu** - Sebelum apply ke production
5. **Gunakan database terpisah** - `DB` (prod) dan `DB_DEV` (dev) jika sering switch

---

## 📖 Resources

- [Cloudflare D1 Wrangler Commands](https://developers.cloudflare.com/d1/wrangler-commands/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
