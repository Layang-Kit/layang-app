# 📚 Documentation

Selamat datang di dokumentasi SvelteKit Cloudflare D1 Boilerplate!

---

## 🎯 Who Is This For?

### 👶 For Beginners
Baru pertama kali dengan SvelteKit atau edge development? Mulai dari sini:

1. **[Quick Start](setup/quick-start.md)** - Setup dalam 5 menit
2. **[Glossary](glossary.md)** - Pelajari istilah teknis
3. **[Common Mistakes](common-mistakes.md)** - Hindari kesalahan umum

### 🚀 For Experienced Developers
Sudah familiar dengan web dev? Lihat ini:

1. **[Architecture](architecture.md)** - Understand the system design
2. **[ADR](adr.md)** - Architecture decisions explained
3. **[Performance](performance.md)** - Optimization techniques
4. **[Security](security.md)** - Hardening guide

---

## 📖 Table of Contents

### 🚀 Getting Started

| Document | Description | For |
|----------|-------------|-----|
| [Quick Start](setup/quick-start.md) | Setup project dalam 5 menit | Beginners |
| [Environment Variables](setup/environment-variables.md) | Konfigurasi `.env` lengkap | Everyone |
| [Database Setup](setup/database.md) | Setup Cloudflare D1 | Everyone |
| [Google OAuth](setup/google-oauth.md) | Login dengan Google | Optional |
| [Email Setup](setup/email.md) | Email verification | Optional |
| [File Storage](setup/file-storage.md) | File upload dengan R2 | Optional |

### 🎓 Learning Resources

| Document | Description | For |
|----------|-------------|-----|
| [Glossary](glossary.md) | Istilah teknis dijelaskan | Beginners |
| [Common Mistakes](common-mistakes.md) | Kesalahan umum & solusi | Beginners |
| [Architecture](architecture.md) | System design & diagrams | Everyone |
| [SvelteKit Patterns](guides/patterns.md) | Best practices patterns | Intermediate |

### 🛠️ Feature Guides

| Document | Description | For |
|----------|-------------|-----|
| [Authentication](guides/authentication.md) | Login, register, OAuth | Everyone |
| [File Uploads](guides/file-uploads.md) | Upload avatar & files | Everyone |
| [Profile Management](guides/profile-management.md) | Edit profil & settings | Everyone |
| [Database Workflow](guides/database-workflow.md) | Local vs Production DB | Everyone |
| [Customizing Schema](customizing-schema.md) | Modify database schema | Advanced |

### 🏗️ Advanced Topics

| Document | Description | For |
|----------|-------------|-----|
| [ADR](adr.md) | Architecture Decision Records | Advanced |
| [Performance](performance.md) | Optimization guide | Advanced |
| [Security](security.md) | Hardening & best practices | Advanced |
| [API Reference](api-reference.md) | Complete API docs | Developers |

### 🐛 Troubleshooting

| Document | Description |
|----------|-------------|
| [Database Issues](troubleshooting/database.md) | Database problems & solutions |
| [Authentication Issues](troubleshooting/authentication.md) | Auth problems & solutions |
| [File Upload Issues](troubleshooting/file-upload.md) | File upload problems |
| [Deployment Issues](troubleshooting/deployment.md) | Deployment problems |

---

## 🗂️ Project Structure

```
docs/
├── readme.md                    # You are here
├── glossary.md                  # Technical terms explained
├── architecture.md              # System architecture
├── adr.md                       # Architecture decisions
├── performance.md               # Optimization guide
├── security.md                  # Security hardening
├── customizing-schema.md        # Database modifications
├── api-reference.md             # API documentation
├── common-mistakes.md           # Common pitfalls
│
├── setup/                       # Setup & configuration
│   ├── quick-start.md
│   ├── environment-variables.md
│   ├── database.md
│   ├── google-oauth.md
│   ├── email.md
│   └── file-storage.md
│
├── guides/                      # Feature guides
│   ├── authentication.md
│   ├── file-uploads.md
│   ├── profile-management.md
│   ├── patterns.md
│   └── database-workflow.md
│
└── troubleshooting/             # Problem solving
    ├── database.md
    ├── authentication.md
    ├── file-upload.md
    └── deployment.md
```

---

## 🎯 Learning Paths

### Path 1: Quick Start (30 minutes)
For: Mau langsung jalan

1. [Quick Start](setup/quick-start.md)
2. [Environment Variables](setup/environment-variables.md)
3. Start coding! 💻

### Path 2: Deep Understanding (2 hours)
For: Mau paham konsep

1. [Glossary](glossary.md)
2. [Architecture](architecture.md)
3. [SvelteKit Patterns](guides/patterns.md)
4. [Common Mistakes](common-mistakes.md)

### Path 3: Production Ready (1 day)
For: Mau deploy ke production

1. Semua setup guides
2. [Security](security.md)
3. [Performance](performance.md)
4. [Database Workflow](guides/database-workflow.md)

---

## 💡 Quick Tips

### For Beginners
- 📖 Baca [Glossary](glossary.md) kalau ketemu istilah asing
- ⚠️ Check [Common Mistakes](common-mistakes.md) sebelum debug
- 🎨 Lihat [SvelteKit Patterns](guides/patterns.md) untuk best practices

### For Experts
- 🏗️ Review [ADR](adr.md) untuk understand design decisions
- ⚡ Check [Performance](performance.md) untuk optimization
- 🔐 Follow [Security](security.md) untuk production hardening
- 📚 Use [API Reference](api-reference.md) untuk development

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
