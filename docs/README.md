# 📚 Documentation

Selamat datang di dokumentasi SvelteKit Cloudflare D1 Boilerplate!

---

## 🎯 Who Is This For?

### 👶 For Beginners
Baru pertama kali dengan SvelteKit atau edge development? Mulai dari sini:

1. **[Quick Start](setup/01-quick-start.md)** - Setup dalam 5 menit
2. **[Glossary](GLOSSARY.md)** - Pelajari istilah teknis
3. **[Common Mistakes](COMMON_MISTAKES.md)** - Hindari kesalahan umum

### 🚀 For Experienced Developers
Sudah familiar dengan web dev? Lihat ini:

1. **[Architecture](ARCHITECTURE.md)** - Understand the system design
2. **[ADR](ADR.md)** - Architecture decisions explained
3. **[Performance](PERFORMANCE.md)** - Optimization techniques
4. **[Security](SECURITY.md)** - Hardening guide

---

## 📖 Table of Contents

### 🚀 Getting Started

| Document | Description | For |
|----------|-------------|-----|
| [Quick Start](setup/01-quick-start.md) | Setup project dalam 5 menit | Beginners |
| [Environment Variables](setup/02-environment-variables.md) | Konfigurasi `.env` lengkap | Everyone |
| [Database Setup](setup/03-database-d1.md) | Setup Cloudflare D1 | Everyone |
| [Google OAuth](setup/04-google-oauth.md) | Login dengan Google | Optional |
| [Resend Email](setup/05-resend-email.md) | Email verification | Optional |
| [Cloudflare R2](setup/06-cloudflare-r2.md) | File upload | Optional |

### 🎓 Learning Resources

| Document | Description | For |
|----------|-------------|-----|
| [Glossary](GLOSSARY.md) | Istilah teknis dijelaskan | Beginners |
| [Common Mistakes](COMMON_MISTAKES.md) | Kesalahan umum & solusi | Beginners |
| [Architecture](ARCHITECTURE.md) | System design & diagrams | Everyone |
| [SvelteKit Patterns](guides/04-sveltekit-patterns.md) | Best practices patterns | Intermediate |

### 🛠️ Feature Guides

| Document | Description | For |
|----------|-------------|-----|
| [Authentication](guides/01-authentication.md) | Login, register, OAuth | Everyone |
| [File Uploads](guides/02-file-uploads.md) | Upload avatar & files | Everyone |
| [Profile Management](guides/03-profile-management.md) | Edit profil & settings | Everyone |
| [Local vs Production DB](guides/05-local-vs-production-database.md) | Switch database mode | Everyone |
| [Customizing Schema](CUSTOMIZING_SCHEMA.md) | Modify database schema | Advanced |

### 🏗️ Advanced Topics

| Document | Description | For |
|----------|-------------|-----|
| [ADR](ADR.md) | Architecture Decision Records | Advanced |
| [Performance](PERFORMANCE.md) | Optimization guide | Advanced |
| [Security](SECURITY.md) | Hardening & best practices | Advanced |
| [API Reference](API_REFERENCE.md) | Complete API docs | Developers |

### 🐛 Troubleshooting

| Document | Description |
|----------|-------------|
| [Database Issues](troubleshooting/database.md) | Database problems & solutions |
| [Authentication Issues](troubleshooting/authentication.md) | Auth problems & solutions |
| [Upload Issues](troubleshooting/upload.md) | File upload problems |
| [Deployment Issues](troubleshooting/deployment.md) | Deployment problems |

---

## 🗂️ Project Structure

```
docs/
├── README.md                          # You are here
├── GLOSSARY.md                        # Technical terms explained
├── ARCHITECTURE.md                    # System architecture
├── ADR.md                             # Architecture decisions
├── PERFORMANCE.md                     # Optimization guide
├── SECURITY.md                        # Security hardening
├── CUSTOMIZING_SCHEMA.md              # Database modifications
├── API_REFERENCE.md                   # API documentation
├── COMMON_MISTAKES.md                 # Common pitfalls
│
├── setup/                             # Setup & configuration
│   ├── 01-quick-start.md
│   ├── 02-environment-variables.md
│   ├── 03-database-d1.md
│   ├── 04-google-oauth.md
│   ├── 05-resend-email.md
│   └── 06-cloudflare-r2.md
│
├── guides/                            # Feature guides
│   ├── 01-authentication.md
│   ├── 02-file-uploads.md
│   ├── 03-profile-management.md
│   ├── 04-sveltekit-patterns.md
│   └── 05-local-vs-production-database.md
│
└── troubleshooting/                   # Problem solving
    ├── database.md
    ├── authentication.md
    ├── upload.md
    └── deployment.md
```

---

## 🎯 Learning Paths

### Path 1: Quick Start (30 minutes)
For: Mau langsung jalan

1. [Quick Start](setup/01-quick-start.md)
2. [Environment Variables](setup/02-environment-variables.md)
3. Start coding! 💻

### Path 2: Deep Understanding (2 hours)
For: Mau paham konsep

1. [Glossary](GLOSSARY.md)
2. [Architecture](ARCHITECTURE.md)
3. [SvelteKit Patterns](guides/04-sveltekit-patterns.md)
4. [Common Mistakes](COMMON_MISTAKES.md)

### Path 3: Production Ready (1 day)
For: Mau deploy ke production

1. Semua setup guides
2. [Security](SECURITY.md)
3. [Performance](PERFORMANCE.md)
4. [Local vs Production DB](guides/05-local-vs-production-database.md)

---

## 💡 Quick Tips

### For Beginners
- 📖 Baca [Glossary](GLOSSARY.md) kalau ketemu istilah asing
- ⚠️ Check [Common Mistakes](COMMON_MISTAKES.md) sebelum debug
- 🎨 Lihat [SvelteKit Patterns](guides/04-sveltekit-patterns.md) untuk best practices

### For Experts
- 🏗️ Review [ADR](ADR.md) untuk understand design decisions
- ⚡ Check [Performance](PERFORMANCE.md) untuk optimization
- 🔐 Follow [Security](SECURITY.md) untuk production hardening
- 📚 Use [API Reference](API_REFERENCE.md) untuk development

---

## 🔗 External Resources

### Official Documentation
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Lucia Auth Docs](https://lucia-auth.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)

### Dashboard Links
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Resend Dashboard](https://resend.com)

### Community
- [Svelte Discord](https://svelte.dev/chat)
- [Cloudflare Discord](https://discord.cloudflare.com)

---

## 🤝 Contributing

Dokumentasi ini terbuka untuk improvement! Jika menemukan:
- ❌ Error atau typo
- 🆕 Topik yang belum tercakup
- 💡 Cara penjelasan yang lebih baik

Silakan kontribusi via pull request.

---

**Happy coding! 🚀**

Need help? Check troubleshooting section atau lihat [AGENTS.md](../AGENTS.md) untuk technical details.
