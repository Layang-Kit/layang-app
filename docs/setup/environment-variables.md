# Environment Variables - Konfigurasi Lengkap

Panduan lengkap mengisi file `.env` untuk semua layanan.

---

## 📋 File .env.example

Project ini sudah include `.env.example` dengan semua variabel yang dibutuhkan.

```bash
# Copy template
cp .env.example .env

# Edit file
nano .env  # atau code .env, vim .env, dll
```

---

## 🔴 WAJIB (Minimal Setup)

### Cloudflare D1 Database

| Variable | Dari Mana | Contoh |
|----------|-----------|--------|
| `CLOUDFLARE_ACCOUNT_ID` | Dashboard kanan atas / Workers & Pages | `1a2b3c4d5e6f7g8h9i0j` |
| `CLOUDFLARE_DATABASE_ID` | `wrangler d1 create` output / wrangler.toml | `abc123def-456...` |
| `CLOUDFLARE_API_TOKEN` | Profile → API Tokens → Create | `abcd1234...` |

#### Cara Mendapatkan:

**Account ID:**
1. Dashboard Cloudflare → Lihat sidebar kanan
2. Atau Workers & Pages → Account ID di panel kanan

**Database ID:**
1. Setelah `npx wrangler d1 create DB`, copy ID
2. Atau lihat di `wrangler.toml`

**API Token:**
1. Dashboard → My Profile (kanan atas) → API Tokens
2. Create Token → Custom token
3. Permissions:
   - Account: D1:Edit
   - Zone: Read (opsional)
4. Continue → Create
5. Copy token (hanya muncul sekali!)

---

## 🟡 OPTIONAL (Fitur Tambahan)

### Google OAuth (Login dengan Google)

| Variable | Dari Mana |
|----------|-----------|
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials |

```env
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxx
```

#### Setup Google OAuth:

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih existing
3. APIs & Services → Credentials
4. Create Credentials → OAuth client ID
5. Configure consent screen:
   - User Type: External
   - App name: Nama aplikasi Anda
   - User support email: Email Anda
   - Developer contact: Email Anda
6. Create OAuth client ID:
   - Application type: Web application
   - Name: SvelteKit App
   - Authorized redirect URIs:
     ```
     http://localhost:5173/auth/google/callback
     https://yourdomain.pages.dev/auth/google/callback
     ```
7. Copy Client ID dan Client Secret ke `.env`

---

### Resend Email (Email Verification)

| Variable | Dari Mana |
|----------|-----------|
| `RESEND_API_TOKEN` | Resend Dashboard → API Keys |
| `FROM_EMAIL` | Domain yang diverifikasi di Resend |

```env
RESEND_API_TOKEN=re_xxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

**Note:** Untuk development bisa pakai `onboarding@resend.dev`

#### Setup Resend:

1. Buat akun di [Resend](https://resend.com)
2. Dashboard → API Keys → Create API Key
3. Copy API key ke `.env`
4. (Optional) Add dan verify domain Anda untuk production
5. Untuk development, gunakan `onboarding@resend.dev`

---

### Cloudflare R2 (File Upload)

| Variable | Dari Mana |
|----------|-----------|
| `R2_ACCOUNT_ID` | Sama dengan Cloudflare Account ID |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 → Manage R2 API Tokens |
| `R2_BUCKET_NAME` | Nama bucket yang dibuat |
| `R2_PUBLIC_URL` | R2 → Bucket → Settings → Public URL |

```env
R2_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
R2_ACCESS_KEY_ID=abc123...
R2_SECRET_ACCESS_KEY=xyz789...
R2_BUCKET_NAME=my-app-uploads
R2_PUBLIC_URL=https://pub-abc123.r2.dev
```

#### Setup R2:

1. Dashboard Cloudflare → R2
2. Create bucket → Beri nama (contoh: `my-app-uploads`)
3. Settings → Public Access → Allow Access
4. Copy Public URL ke `.env`
5. Manage R2 API Tokens → Create API Token:
   - Permission: Object Read & Write
   - Select bucket: my-app-uploads
6. Copy Access Key ID dan Secret Access Key ke `.env`

---

## 📝 Contoh .env Lengkap

```bash
# ============================================================================
# REQUIRED - Database (WAJIB)
# ============================================================================
CLOUDFLARE_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
CLOUDFLARE_DATABASE_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
CLOUDFLARE_API_TOKEN=abcd1234xxxxxxxx

# ============================================================================
# OPTIONAL - Google Login
# ============================================================================
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxx

# ============================================================================
# OPTIONAL - Email Verification
# ============================================================================
RESEND_API_TOKEN=re_xxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# ============================================================================
# OPTIONAL - File Upload
# ============================================================================
R2_ACCOUNT_ID=1a2b3c4d5e6f7g8h9i0j
R2_ACCESS_KEY_ID=abc123...
R2_SECRET_ACCESS_KEY=xyz789...
R2_BUCKET_NAME=my-app-uploads
R2_PUBLIC_URL=https://pub-abc123.r2.dev
```

---

## 🔒 Keamanan

### Jangan pernah:

- ❌ Commit `.env` ke git (sudah di `.gitignore`)
- ❌ Share API token di chat/email
- ❌ Hardcode credentials di code

### Best Practices:

- ✅ Gunakan `.env.example` untuk template
- ✅ Rotate API tokens secara berkala
- ✅ Gunakan token dengan permission minimal
- ✅ Different tokens untuk dev dan production

---

## 🚀 Production Deployment

Untuk production di Cloudflare Pages:

1. Build project: `npm run build`
2. Deploy: `npm run deploy`
3. Dashboard Cloudflare → Pages → Your Project → Settings → Functions
4. Add Environment Variables disana

**Note:** Environment variables di Cloudflare Pages terpisah dari local `.env`

---

## 🐛 Common Issues

| Error | Penyebab | Solusi |
|-------|----------|--------|
| "D1 binding not found" | Database ID salah | Check `wrangler.toml` dan `.env` |
| "API token invalid" | Token expired/salah | Buat token baru |
| "Cannot access R2" | Access key salah | Check R2 API Tokens |
| "Email not sent" | Resend token salah | Verifikasi token di Resend dashboard |
| "redirect_uri_mismatch" | Redirect URI belum didaftarkan | Tambahkan di Google Cloud Console |

---

## 📖 Lanjutan

- [Quick Start](quick-start.md) - Setup 5 menit
- [Database Setup](database.md) - D1 configuration
- [Authentication Guide](../guides/authentication.md) - Auth implementation
- [File Uploads Guide](../guides/file-uploads.md) - R2 upload implementation
