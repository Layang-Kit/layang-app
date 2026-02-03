# 🚀 Setup Guides

Panduan setup dan konfigurasi project SvelteKit Cloudflare D1.

---

## 📋 Setup Checklist

Setup dasar (wajib):
- [ ] [Quick Start](quick-start.md) - Setup project dalam 5 menit
- [ ] [Environment Variables](environment-variables.md) - Konfigurasi `.env`
- [ ] [Database](database.md) - Setup Cloudflare D1

Setup fitur opsional:
- [ ] [Google OAuth](google-oauth.md) - Login dengan Google
- [ ] [Email](email.md) - Email verification dengan Resend
- [ ] [File Storage](file-storage.md) - File upload dengan Cloudflare R2

---

## 🎯 Urutan Setup Untuk Pemula

### Step 1: Quick Start
Mulai dengan [Quick Start](quick-start.md) untuk:
- Clone repository
- Install dependencies
- Setup project structure
- Jalankan dev server

### Step 2: Environment Variables
Lanjut ke [Environment Variables](environment-variables.md) untuk:
- Copy `.env.example` ke `.env`
- Isi variabel yang diperlukan
- Konfigurasi Cloudflare credentials

### Step 3: Database Setup
Setup [Database](database.md) untuk:
- Buat D1 database di Cloudflare
- Generate dan apply migrations
- Seed database dengan data awal

### Step 4: Fitur Opsional
Setelah basic setup berjalan, tambahkan fitur:
- **Google OAuth** - Untuk login dengan Google
- **Email** - Untuk email verification dan forgot password
- **File Storage** - Untuk upload avatar dan file

---

## ⚡ Quick Commands

```bash
# Development
npm run dev

# Database
npm run db:generate    # Generate migrations
npm run db:migrate     # Apply migrations
npm run db:studio      # Open Drizzle Studio

# Type checking
npm run check

# Build
npm run build
```

---

## 🆘 Troubleshooting

Jika mengalami masalah saat setup:
- [Database Issues](../troubleshooting/database.md)
- [Authentication Issues](../troubleshooting/authentication.md)
- [Deployment Issues](../troubleshooting/deployment.md)

---

[← Kembali ke Documentation](../readme.md)
