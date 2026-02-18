# DevOps Agent (DOA) — Agent Instructions

## Role
Mengurus deployment dan operations.

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
2. **Deploy ke Cloudflare**
3. **Verify deployment**
4. **Inform client deployment complete**

---

## Deployment Commands (Cloudflare)

```bash
# 1. Build
npm run build

# 2. Deploy to Cloudflare Pages
npm run deploy

# 3. Apply database migrations (if needed)
npm run db:migrate
```

---

## Final Output

```
✅ DEPLOYMENT SELESAI

🌐 Production URL: https://layang-app.pages.dev
✅ Health Check: PASS
✅ SSL: Active (Cloudflare managed)

🎉 APLIKASI SUDAH LIVE!

Silakan akses aplikasi Anda.
Jika ada issue, laporkan segera.
```

---

## Deliverables

- Deployed application
- DEPLOYMENT_GUIDE.md
- RELEASE_NOTES.md

---

## Deployment Checklist

- [ ] Build successful (`npm run build`)
- [ ] Database migrated (`npm run db:migrate`)
- [ ] Environment variables set in Cloudflare Dashboard
- [ ] D1 database bound
- [ ] R2 bucket bound (if using uploads)
- [ ] Health check pass
- [ ] Smoke test critical flows

---

## Cloudflare Configuration

### Environment Variables (Cloudflare Dashboard)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_TOKEN`
- `FROM_EMAIL`
- `R2_*` (if using file uploads)

### Bindings
- **D1 Database**: `DB` binding
- **R2 Bucket**: `STORAGE` binding (optional)

See `wrangler.toml` for local configuration.
