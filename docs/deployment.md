# 🚀 Deployment Guide

Deploy aplikasi SvelteKit ke Cloudflare Pages via GitHub dalam 10 menit.

---

## 🎯 Overview

Cloudflare Pages dengan Git Integration adalah cara termudah untuk deploy:
- ✅ **Auto-deploy** - Push ke GitHub = auto deploy
- ✅ **Gratis** - Unlimited requests, 500 builds/month
- ✅ **Global CDN** - 300+ lokasi edge
- ✅ **Edge Functions** - SvelteKit SSR berjalan di edge
- ✅ **D1 Integration** - Database via Dashboard

---

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:

```markdown
- [ ] Project sudah di-push ke GitHub
- [ ] `npm run build` berhasil locally
- [ ] Database D1 sudah dibuat di Cloudflare
- [ ] Environment variables sudah disiapkan
- [ ] `wrangler.toml` sudah dikonfigurasi
```

### Test Build Locally

```bash
# Type check
npm run check

# Build
npm run build

# Preview (optional)
npm run preview
```

---

## 🚀 Deployment Steps (Git Integration)

### Step 1: Buat Project di Dashboard (2 menit)

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Workers & Pages → **Create application**
3. Pilih **Pages** → **Connect to Git**
4. Connect GitHub account → Pilih repository kamu
5. Configure build:
   - **Project name:** `layang-app` (atau nama bebas)
   - **Production branch:** `main`
   - **Framework preset:** `SvelteKit`
   - **Build command:** `npm run build`
   - **Build output directory:** `.svelte-kit/cloudflare`

6. Click **Save and Deploy**

> ⏱️ Build pertama akan memakan waktu ~2-3 menit.

---

### Step 2: Set D1 Database Binding (WAJIB) ⚠️

Setelah project terbuat:

1. Pilih project kamu → **Settings** → **Bindings**
2. Click **Add** → **D1 database bindings**
3. **Variable name:** `DB`
4. **D1 database:** Pilih database yang sudah dibuat
5. Click **Save**

> ⚠️ **PENTING:** Tanpa setting ini, aplikasi akan error 500 karena tidak bisa connect ke database!

---

### Step 3: Set Environment Variables

1. Settings → **Environment variables**
2. Add variables (Production environment):

**Required untuk Email:**
```
RESEND_API_TOKEN=re_xxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
```

**Untuk R2 (jika pakai file upload):**
```
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=xxx
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

**Untuk Google OAuth:**
```
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

> 💡 **Tip:** Lihat [Environment Variables](setup/environment-variables.md) untuk detail mendapatkan nilai-nilai ini.

---

### Step 4: Redeploy

Setelah setting binding dan env vars:

1. **Deployments** tab
2. Pilih deployment terbaru → **Retry deployment**

Atau push commit baru ke GitHub:
```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

🎉 **Selesai!** Aplikasi sudah online di `https://layang-app.pages.dev`

---

## 🗄️ Production Database Migration

### Apply Migration ke Production

```bash
# Apply migration ke D1 production
npm run db:migrate
```

**Atau via Wrangler:**
```bash
npx wrangler d1 migrations apply DB --remote
```

### Verify Production DB

```bash
# Check tables di production
npx wrangler d1 execute DB --remote --command "SELECT name FROM sqlite_master WHERE type='table'"

# Check data users
npx wrangler d1 execute DB --remote --command "SELECT email, name, created_at FROM users"
```

---

## 🌐 Custom Domain

### Setup Custom Domain

1. Dashboard → Pages → Project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter domain: `yourdomain.com`
4. Follow DNS setup instructions

### DNS Configuration

Tambahkan DNS records di Cloudflare (atau domain provider):

```
Type: CNAME
Name: www
Target: layang-app.pages.dev
```

Untuk apex domain (@):
```
Type: CNAME
Name: @
Target: layang-app.pages.dev
```

> 💡 Cloudflare secara otomatis menangani CNAME flattening untuk apex domain.

---

## 📋 Production Checklist

### Security
- [ ] Environment variables di-set di Cloudflare Dashboard (bukan di repo)
- [ ] Tidak ada secret di codebase (check `.env.example` tidak ada real values)
- [ ] HTTPS enabled (otomatis di Cloudflare)

### Database
- [ ] D1 binding di-set di Dashboard (Settings → Bindings) dengan variable name `DB`
- [ ] Migration applied ke production (`npm run db:migrate`)
- [ ] Seed data (jika perlu)

### Features
- [ ] Register/Login working
- [ ] Google OAuth callback URL updated untuk production domain
- [ ] Email sending working (if enabled)
- [ ] File upload working (if enabled)

### Monitoring
- [ ] Test dengan `curl https://your-domain.pages.dev/api/health`
- [ ] Monitor logs: `npm run logs`

---

## 🔧 Troubleshooting Deployment

### Error 500 Setelah Deploy

**Penyebab #1: D1 Binding Belum Di-set**
```
Solution:
1. Dashboard → Project → Settings → Bindings
2. Add D1 database binding → Variable name: DB
3. Save → Redeploy
```

**Penyebab #2: Environment Variables Belum Di-set**
```
Solution:
1. Settings → Environment variables
2. Add semua required variables
3. Redeploy
```

**Penyebab #3: Build Failed**

```bash
# Check build locally
npm run check
npm run build
```

Common issues:
- TypeScript errors → Run `npm run check`
- Missing imports → Check case sensitivity (Linux case-sensitive)
- Node version mismatch → Set di Dashboard: Settings → Build & deployments → Build system version = 2

### Error: "D1 binding not found"

**Cek:**
1. Sudah set binding di Dashboard? (Settings → Bindings)
2. Variable name benar? (harus `DB` sesuai `wrangler.toml`)
3. Sudah redeploy setelah set binding?

### Error: "Invalid session" / "Authentication failed"

**Cek:**
1. Environment variables `RESEND_API_TOKEN` dan `FROM_EMAIL` sudah di-set?
2. Untuk Google OAuth: redirect URI production sudah didaftarkan di Google Cloud Console?

### Build System Version

Jika build failed, cek build system version:

1. Dashboard → Project → Settings → Build & deployments
2. Build system version: **Version 2 (Beta)**
3. Build command: `npm run build`
4. Build output directory: `.svelte-kit/cloudflare`

---

## 🔄 Continuous Deployment

Dengan Git Integration, setiap push ke branch `main` akan otomatis deploy ke production.

### Preview Deployments

Push ke branch lain akan membuat preview deployment:
```bash
git checkout -b feature/new-page
git push origin feature/new-page
```

Preview URL: `https://feature-new-page.layang-app.pages.dev`

### Deploy Hooks (Optional)

Untuk trigger deploy dari external (CI/CD lain):

1. Pages → Project → Settings → Build & deployments
2. Deploy hooks → Create deploy hook
3. Gunakan URL untuk trigger deploy:

```bash
curl -X POST https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxx
```

---

## 📝 wrangler.toml vs Dashboard Bindings

| | `wrangler.toml` | Dashboard Bindings |
|---|---|---|
| **Gunakan untuk** | Local development | Production |
| **D1 Database** | ✅ `preview_database_id` | ✅ Variable name: `DB` |
| **R2 Bucket** | ❌ Not supported | ✅ Settings → Bindings |
| **KV** | ❌ Not supported | ✅ Settings → Bindings |

> ℹ️ Untuk Git Integration deployment, `wrangler.toml` **tidak** digunakan untuk production binding. Semua binding harus di-set via Dashboard.

---

## 📊 Monitoring

### View Production Logs (Real-time)

```bash
# Monitor logs real-time
npm run logs

# Atau langsung dengan wrangler
npx wrangler pages deployment tail --project-name=layang-app --format=pretty
```

### Cloudflare Analytics

Dashboard → Pages → Project → **Analytics**

Metrics yang tersedia:
- Total requests
- Bandwidth usage
- Build duration
- Error rate

### Health Check API

```bash
curl https://your-domain.pages.dev/api/health
```

Expected response:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎯 Production Best Practices

### 1. Environment Variables
- ❌ Jangan commit `.env`
- ✅ Gunakan Cloudflare Dashboard untuk production secrets
- ✅ Gunakan `.env.example` sebagai template (tanpa real values)
- ✅ Different values untuk dev vs production

### 2. Database
- ✅ Always backup sebelum migration besar
- ✅ Test migration di local dulu (`npm run db:migrate:local`)
- ✅ Gunakan transactions untuk data integrity

### 3. Performance
- ✅ Enable Cloudflare caching (default on)
- ✅ Optimize images (WebP, responsive)
- ✅ Minimize JavaScript bundle

### 4. Security Headers

Tambahkan di `src/hooks.server.ts`:

```typescript
export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
};
```

---

## 🎉 Deployment Complete!

Aplikasi kamu sekarang:
- ✅ Live di internet
- ✅ Auto-deploy dari GitHub
- ✅ Dihost di 300+ edge locations
- ✅ Dapat HTTPS otomatis
- ✅ Scalable tanpa batas

### What's Next?

- [Wrangler Commands](wrangler-commands.md) - Manage via CLI
- [Troubleshooting](troubleshooting/common-issues.md) - Debug issues
- [Customizing Schema](customizing-schema.md) - Add new features

---

**Selamat! 🚀** Aplikasi sudah live!

```bash
# Quick commands untuk monitoring
npm run logs              # View production logs
npm run db:migrate        # Apply migrations
npm run deploy            # Manual deploy (jika perlu)
```
