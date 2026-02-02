# 📚 Documentation

Selamat datang di dokumentasi SvelteKit Cloudflare D1 Boilerplate!

## 🚀 Untuk Memulai

Baru pertama kali menggunakan project ini? Mulai dari sini:

1. **[Quick Start](setup/01-quick-start.md)** - Setup project dalam 5 menit
2. **[Environment Variables](setup/02-environment-variables.md)** - Konfigurasi `.env`

## 📖 Setup Layanan (Pilih sesuai kebutuhan)

| Layanan | Status | Guide |
|---------|--------|-------|
| Database (D1) | **Wajib** | [Setup D1](setup/03-database-d1.md) |
| Google Login | Optional | [Setup Google OAuth](setup/04-google-oauth.md) |
| Email Verification | Optional | [Setup Resend Email](setup/05-resend-email.md) |
| File Upload | Optional | [Setup Cloudflare R2](setup/06-cloudflare-r2.md) |

## 🎯 Feature Guides

Panduan menggunakan fitur-fitur aplikasi:

- **[Authentication](guides/01-authentication.md)** - Login, register, reset password
- **[File Uploads](guides/02-file-uploads.md)** - Upload avatar dan file
- **[Profile Management](guides/03-profile-management.md)** - Edit profil dan settings
- **[SvelteKit Patterns](guides/04-sveltekit-patterns.md)** - Server Load & Form Actions

## 🐛 Troubleshooting

Masalah umum dan solusinya:

- **[Database Issues](troubleshooting/database.md)**
- **[Authentication Issues](troubleshooting/authentication.md)**
- **[Upload Issues](troubleshooting/upload.md)**
- **[Deployment Issues](troubleshooting/deployment.md)**

## 📁 Struktur Dokumentasi

```
docs/
├── README.md                          # Anda di sini
├── setup/                             # Setup & konfigurasi
│   ├── 01-quick-start.md             # 5 menit setup
│   ├── 02-environment-variables.md   # .env lengkap
│   ├── 03-database-d1.md             # Database (wajib)
│   ├── 04-google-oauth.md            # Google login
│   ├── 05-resend-email.md            # Email verification
│   └── 06-cloudflare-r2.md           # File upload
├── guides/                            # Panduan penggunaan
│   ├── 01-authentication.md
│   ├── 02-file-uploads.md
│   ├── 03-profile-management.md
│   └── 04-sveltekit-patterns.md
└── troubleshooting/                   # Solusi masalah
    ├── database.md
    ├── authentication.md
    ├── upload.md
    └── deployment.md
```

## 💡 Tips

- **Development**: Mulai dengan Quick Start, lalu setup Database
- **Production**: Setup semua layanan (Database, Email, R2, Google OAuth)
- **Hanya fitur dasar**: Database saja sudah cukup

## 🔗 Link Penting

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Resend Dashboard](https://resend.com)
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)

---

**Butuh bantuan?** Check troubleshooting section atau lihat AGENTS.md untuk technical details.
