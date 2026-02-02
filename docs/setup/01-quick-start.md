# Quick Start - 5 Menit Setup

Setup project SvelteKit Cloudflare D1 dalam 5 menit.

## ✅ Prerequisites

- Node.js 18+ (check: `node --version`)
- npm atau pnpm
- Akun Cloudflare (gratis)

## 🚀 Langkah Setup

### 1. Clone & Install (1 menit)

```bash
# Clone repository
git clone https://github.com/yourusername/sveltekit-cf-d1-boilerplate.git
cd sveltekit-cf-d1-boilerplate

# Install dependencies
npm install
```

### 2. Setup Database D1 (2 menit)

```bash
# Login ke Wrangler (jika belum)
npx wrangler login

# Buat database D1
npx wrangler d1 create my-app-db

# Copy database_id yang muncul, contoh:
# database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

Edit `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "paste-database-id-di-sini"  # <-- Ganti ini
```

### 3. Setup Environment Variables (1 menit)

```bash
# Copy template
cp .env.example .env

# Edit .env dengan editor favorit
# Isi minimal:
# - CLOUDFLARE_ACCOUNT_ID
# - CLOUDFLARE_DATABASE_ID (sama dengan wrangler.toml)
# - CLOUDFLARE_API_TOKEN
```

Cara dapatkan API Token:
1. [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens
2. Create Token → Custom token
3. Permissions:
   - Account: D1:Edit
   - Zone: (tidak perlu)
4. Copy token ke `.env`

### 4. Apply Database Migration (1 menit)

```bash
# Migration untuk local development
npm run db:migrate:local
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka browser: http://localhost:5173

## 🎉 Selesai!

Anda sekarang punya:
- ✅ SvelteKit app berjalan
- ✅ Database D1 terhubung
- ✅ Authentication system (register/login)
- ✅ Dashboard page

## 🔄 Next Steps

Tambahkan fitur opsional:

1. **[Google Login](04-google-oauth.md)** - Login dengan Google
2. **[Email Verification](05-resend-email.md)** - Verifikasi email user
3. **[File Upload](06-cloudflare-r2.md)** - Upload avatar dan file

## 🐛 Troubleshooting

| Error | Solusi |
|-------|--------|
| "D1 binding not found" | Check `wrangler.toml` database_id |
| "Database not available" | Pastikan `npm run db:migrate:local` sudah dijalankan |
| "Cannot find module" | Jalankan `npm install` ulang |

## 📖 Dokumentasi Lanjutan

- [Environment Variables Lengkap](02-environment-variables.md)
- [Database Setup Detail](03-database-d1.md)
- [Authentication Guide](../guides/01-authentication.md)
