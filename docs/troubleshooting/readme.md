# 🐛 Troubleshooting

Panduan mengatasi masalah umum dan error.

---

## 📂 Categories

| Category | Common Issues |
|----------|---------------|
| [Database](database.md) | Migration errors, connection issues, query problems |
| [Authentication](authentication.md) | Login failures, session issues, OAuth errors |
| [File Upload](file-upload.md) | Upload failures, R2 connection, file size errors |
| [Deployment](deployment.md) | Build errors, Cloudflare issues, env var problems |

---

## 🔍 Quick Diagnostics

### Check Environment
```bash
# Node version (should be 18+)
node --version

# Check env file
cat .env | grep -E "(CLOUDFLARE|GOOGLE|RESEND)"

# Database status
npm run db:migrate:local -- --dry-run
```

### Check Logs
```bash
# Development logs
npm run dev

# Build logs
npm run build 2>&1 | tee build.log
```

---

## 🚨 Common Errors

### "D1 binding not found"
**Solution:** [Database Setup](../setup/database.md)

### "Invalid session"
**Solution:** [Authentication Issues](authentication.md)

### "Failed to upload"
**Solution:** [File Upload Issues](file-upload.md)

### "Build failed"
**Solution:** [Deployment Issues](deployment.md)

---

## 💡 Debug Tips

1. **Check browser console** - Frontend errors
2. **Check terminal** - Server errors
3. **Check Network tab** - API request/response
4. **Check `.svelte-kit`** - Generated files

---

## 🆘 Still Stuck?

1. Check [Common Mistakes](../common-mistakes.md)
2. Review [Architecture](../architecture.md)
3. Check [Glossary](../glossary.md) untuk istilah teknis
4. Lihat [AGENTS.md](../../AGENTS.md) untuk technical details

---

## 📝 Reporting Issues

Jika menemukan bug:
1. Document steps to reproduce
2. Include error messages
3. Include environment info
4. Create minimal reproduction

---

[← Kembali ke Documentation](../readme.md)
