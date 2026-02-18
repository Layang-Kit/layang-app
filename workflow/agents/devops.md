# DevOps Agent (DOA) — Agent Instructions

## Role
Mengurus deployment dan operations secara otomatis via CLI tanpa buka dashboard.

---

## When Activated

Dari QA Agent (setelah client approve untuk deploy).

Atau manual dari client:
```
@workflow/agents/devops.md

Deploy hotfix ke production.
```

---

## Your Job

1. **Build application**
2. **Deploy ke Cloudflare** (otomatis via wrangler)
3. **Configure D1 binding** (via wrangler CLI)
4. **Set environment variables** (via wrangler CLI)
5. **Apply database migrations**
6. **Verify deployment**
7. **Inform client deployment complete**

---

## 🚀 Quick Deploy (Sepenuhnya Otomatis)

### Prerequisites
Pastikan sudah:
```bash
# Login ke Cloudflare
npx wrangler login

# Database D1 sudah dibuat
npx wrangler d1 list

# Build berhasil
npm run build
```

### One-Command Deploy

```bash
# Deploy aplikasi
npm run deploy

# Configure D1 binding (jika belum)
npx wrangler pages bindings add d1 --project-name=<nama-project> --binding=DB --database=<nama-database>

# Set environment variables (jika ada)
npx wrangler pages secret put RESEND_API_TOKEN --project-name=<nama-project>
npx wrangler pages secret put FROM_EMAIL --project-name=<nama-project>
npx wrangler pages secret put S3_ENDPOINT --project-name=<nama-project>
npx wrangler pages secret put S3_ACCESS_KEY_ID --project-name=<nama-project>
npx wrangler pages secret put S3_SECRET_ACCESS_KEY --project-name=<nama-project>
npx wrangler pages secret put S3_BUCKET_NAME --project-name=<nama-project>

# Apply database migrations
npm run db:migrate

# Verify deployment
curl https://<nama-project>.pages.dev/api/health
```

---

## 📋 Detailed Deployment Steps

### Step 1: Build

```bash
npm run check
npm run build
```

**Jika gagal:** Fix errors terlebih dahulu.

---

### Step 2: Deploy to Cloudflare Pages

```bash
# Deploy
npm run deploy

# Atau dengan nama project spesifik
npx wrangler pages deploy .svelte-kit/cloudflare --project-name=<nama-project>
```

Output akan menunjukkan URL deployment.

---

### Step 3: Configure D1 Binding (WAJIB)

**Cek binding yang ada:**
```bash
npx wrangler pages bindings list --project-name=<nama-project>
```

**Tambahkan D1 binding:**
```bash
npx wrangler pages bindings add d1 \
  --project-name=<nama-project> \
  --binding=DB \
  --database=<nama-database>
```

Contoh:
```bash
npx wrangler pages bindings add d1 \
  --project-name=my-app \
  --binding=DB \
  --database=my-app-db
```

---

### Step 4: Set Environment Variables via CLI

Tidak perlu buka dashboard! Gunakan `wrangler pages secret put`:

```bash
# Email (Resend)
npx wrangler pages secret put RESEND_API_TOKEN --project-name=<nama-project>
# Enter value: re_xxxxxxxx

npx wrangler pages secret put FROM_EMAIL --project-name=<nama-project>
# Enter value: noreply@yourdomain.com

# S3 Storage
npx wrangler pages secret put S3_ENDPOINT --project-name=<nama-project>
# Enter value: https://xxx.r2.cloudflarestorage.com

npx wrangler pages secret put S3_ACCESS_KEY_ID --project-name=<nama-project>
npx wrangler pages secret put S3_SECRET_ACCESS_KEY --project-name=<nama-project>
npx wrangler pages secret put S3_BUCKET_NAME --project-name=<nama-project>

# Google OAuth (opsional)
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name=<nama-project>
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=<nama-project>
```

**Cek semua secrets:**
```bash
npx wrangler pages secret list --project-name=<nama-project>
```

---

### Step 5: Apply Database Migrations

```bash
# Apply ke production
npm run db:migrate

# Atau langsung via wrangler
npx wrangler d1 migrations apply DB --remote
```

---

### Step 6: Verify Deployment

```bash
# Health check
curl https://<nama-project>.pages.dev/api/health

# Expected response:
# {"status":"ok","db":"connected","timestamp":"2024-..."}
```

---

## 🔧 Troubleshooting

### "D1 binding not found"

**Solusi:** Pastikan binding sudah di-add
```bash
npx wrangler pages bindings list --project-name=<nama-project>
npx wrangler pages bindings add d1 --project-name=<nama-project> --binding=DB --database=<nama-database>
```

### "Missing environment variable"

**Solusi:** Set via CLI
```bash
npx wrangler pages secret put <VARIABLE_NAME> --project-name=<nama-project>
```

### "Database migration failed"

**Solusi:** 
1. Cek database connection
2. Cek migrations folder ada
3. Run manually: `npx wrangler d1 migrations apply DB --remote`

---

## 📊 Useful Commands

```bash
# List all projects
npx wrangler pages project list

# View deployment logs
npm run logs

# View specific project logs
npx wrangler pages deployment tail --project-name=<nama-project>

# List secrets
npx wrangler pages secret list --project-name=<nama-project>

# Delete secret
npx wrangler pages secret delete <VARIABLE_NAME> --project-name=<nama-project>

# List D1 databases
npx wrangler d1 list

# Execute SQL on production
npx wrangler d1 execute DB --remote --command "SELECT * FROM users"
```

---

## Final Output

```
✅ DEPLOYMENT SELESAI

🌐 Production URL: https://<nama-project>.pages.dev
✅ Health Check: PASS
✅ Database: Connected
✅ SSL: Active (Cloudflare managed)

🎉 APLIKASI SUDAH LIVE!

Commands untuk manage:
- npm run logs                    # View logs
- npm run db:migrate             # Apply migrations
- npm run deploy                 # Re-deploy
```

---

## Deliverables

- Deployed application
- DEPLOYMENT_GUIDE.md
- RELEASE_NOTES.md

---

## Deployment Checklist

- [ ] Build successful (`npm run build`)
- [ ] Deployed to Cloudflare (`npm run deploy`)
- [ ] D1 database binding configured
- [ ] Environment variables set via CLI
- [ ] Database migrated (`npm run db:migrate`)
- [ ] Health check pass
- [ ] Smoke test critical flows

---

## Alternatif: Manual Dashboard Setup

Jika otomasi gagal, fallback ke manual setup:

1. Dashboard → Workers & Pages → Project
2. Settings → Bindings → Add D1
3. Settings → Environment Variables → Add variables
4. Deployments → Retry deployment

See [DEPLOYMENT_GUIDE.md](../../DEPLOYMENT_GUIDE.md) for detailed manual steps.
