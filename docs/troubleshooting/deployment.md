# Troubleshooting - Deployment Issues

Solusi untuk masalah deployment ke Cloudflare Pages.

## ❌ Build Failed

### Penyebab
- TypeScript errors
- Missing dependencies
- Import errors

### Solusi

1. Check local build:
```bash
npm run check    # Type check
npm run build    # Build test
```

2. Fix errors sebelum deploy

3. Check `svelte.config.js`:
```javascript
import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: { adapter: adapter() }
};
```

---

## ❌ "D1 binding not found" (Production)

### Penyebab
- Database binding tidak diset di Pages

### Solusi

1. Dashboard → Pages → Your Project
2. Settings → Functions
3. Bindings → D1 Databases
4. Add binding:
   - Variable name: `DB`
   - Database: Pilih database Anda

---

## ❌ Environment Variables tidak terbaca

### Penyebab
- Variables tidak di-set di Pages dashboard
- Hanya di-set di local `.env`

### Solusi

1. Dashboard → Pages → Your Project
2. Settings → Functions
3. Environment Variables
4. Add variables:
   - `RESEND_API_TOKEN`
   - `R2_ACCESS_KEY_ID`
   - dll.

**Note:** Environment variables di Pages terpisah dari local `.env`

---

## ❌ Google OAuth tidak work di production

### Penyebab
- Redirect URI belum didaftarkan untuk production domain

### Solusi

1. Google Cloud Console → Credentials
2. Edit OAuth 2.0 Client ID
3. Tambahkan redirect URI production:
   ```
   https://your-domain.pages.dev/auth/google/callback
   ```

---

## ❌ "This deployment does not exist"

### Penyebab
- Build belum selesai
- Deployment failed

### Solusi

1. Check build logs di Dashboard
2. Fix errors
3. Re-deploy:
```bash
npm run deploy
```

---

## ❌ Custom domain tidak work

### Penyebab
- DNS belum propagate
- SSL certificate pending

### Solusi

1. Dashboard → Pages → Your Project
4. Custom Domains
5. Check status:
   - 🟡 Active: Sudah beres
   - 🟠 Pending: Tunggu propagate (bisa 24-48 jam)

---

## ❌ "Function exceeded size limit"

### Penyebab
- Bundle size terlalu besar
- Terlalu banyak dependencies

### Solusi

1. Check `vite.config.ts`:
```typescript
export default {
  build: {
    target: 'esnext', // atau 'es2022'
    minify: true
  }
};
```

2. Remove unused dependencies

---

## 🔧 Debug Deployment

### Check Logs

Dashboard → Pages → Your Project → Functions tab → Logs

### Rollback

Jika ada masalah:
1. Dashboard → Pages
2. Pilih deployment sebelumnya
3. Click "..." → "Rollback"

---

## 📋 Pre-deployment Checklist

Sebelum deploy, pastikan:

- [ ] `npm run build` berhasil
- [ ] `npm run check` 0 errors
- [ ] D1 database binding diset
- [ ] Environment variables di-set di dashboard
- [ ] Google OAuth redirect URI production sudah ditambah
- [ ] R2 bucket public (jika perlu)

---

## 📞 Masih Bermasalah?

Check:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Build Troubleshooting](https://developers.cloudflare.com/pages/platform/known-issues/)
