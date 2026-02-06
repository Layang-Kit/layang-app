# Panduan Lengkap Menggunakan Semua Agent - SvelteKit Cloudflare

## Overview

Project ini menggunakan 3 agent yang bekerja sama untuk membangun aplikasi dengan kualitas tinggi:

1. **INIT_AGENT** - Memulai project baru
2. **TASK_AGENT** - Implementasi fitur
3. **MANAGER_AGENT** - Manajemen perubahan dan release notes

**Tech Stack:**
- SvelteKit 2.x + Svelte 5.x (with Runes)
- Cloudflare D1 (SQLite) + Drizzle ORM 0.40 (schema/migrations) + Kysely (query builder)
- Tailwind CSS 4.x
- Lucia Auth 3.x
- Cloudflare Pages (deployment)

---

## 1. INIT_AGENT - Memulai Project Baru

### Kapan Menggunakan?

Gunakan **INIT_AGENT** saat:
- Memulai project baru dari starter kit ini
- Setup infrastructure awal
- Inisialisasi dokumentasi project

### Workflow

```bash
# 1. Mention INIT_AGENT
"Hai @workflow/INIT_AGENT.md, yuk kita mulai project baru"

# 2. Ikuti step-by-step:
# - Review dan update README.md
# - Buat PRD.md (requirements, design specifications)
# - Buat TDD.md (technical design)
# - Buat ui-kit.html (UI design system)
# - Buat PROGRESS.md (tracking template)
# - Setup environment (.env)
# - Setup database migrations
# - Setup design system
# - Customize auth pages
# - Git init & first commit
# - Start dev server

# 3. Setelah selesai:
# Tutup session ini
# Buka session baru dengan: "Hai @workflow/TASK_AGENT.md yuk kita kerja"
```

### Output

- Project infrastructure siap
- Database migrations ter-setup
- Dev server berjalan di http://localhost:5173

---

## 2. TASK_AGENT - Implementasi Fitur

### Kapan Menggunakan?

Gunakan **TASK_AGENT** saat:
- Ingin implementasi fitur baru
- Ingin modifikasi fitur yang ada
- Ingin fix bug
- Selesai dengan INIT_AGENT

### Workflow

```bash
# 1. Mention TASK_AGENT
"Hai @workflow/TASK_AGENT.md, yuk kita kerja"

# 2. TASK_AGENT akan:
# - Baca PROGRESS.md untuk lihat task pending
# - Tampilkan top 3 tasks dengan priority [HIGH], [MEDIUM], [LOW]
# - Tanya mau kerja task apa

# 3. Pilih task dan implementasi:
# - Buat/modify page (+page.svelte, +page.server.ts)
# - Buat/modify API route (+server.ts)
# - Update database schema jika perlu
# - Buat components

# 4. Test lokal (opsional tapi recommended):
npm run check      # Type checking
npm run build      # Build test

# 5. Update PROGRESS.md:
# - Mark task sebagai [x] completed
# - Tambah completion date

# 6. Commit & push:
git add .
git commit -m "feat: add feature"
git push origin feature/your-feature

# 7. Cloudflare deployment (otomatis setelah merge ke main)
```

### Best Practices

- ✅ Cek existing files dulu (jangan duplicate)
- ✅ Gunakan built-in auth dan features
- ✅ Match UI kit dari `ui-kit.html`
- ✅ Test lokal sebelum push
- ✅ Update PROGRESS.md setelah selesai
- ✅ Gunakan Server Load untuk GET requests
- ✅ Gunakan Form Actions untuk POST/PUT/DELETE

---

## 3. MANAGER_AGENT - Manajemen Perubahan

### Kapan Menggunakan?

Gunakan **MANAGER_AGENT** saat:
- Menerima change request (bug, feature, modification)
- Perlu update dokumentasi (PRD, TDD, PROGRESS)
- Approve deployment
- Create release notes

### Workflow

```bash
# 1. Receive change request:
# SOURCE: [Client/QA/Developer]
# TYPE: [Bug/Feature/Modification]
# REQUEST: [Deskripsi]

# 2. Analyze impact:
# - Apakah ini critical/high/medium/low priority?
# - Apakah feasible?
# - Apakah out of scope?

# 3. Make decision:
# - Accept → Update dokumentasi
# - Reject → Beri alasan
# - Defer → Simpan untuk nanti

# 4. Update dokumentasi (jika accept):
# - Update PRD.md (requirements, design)
# - Update TDD.md (technical specs)
# - Update PROGRESS.md (tasks)

# 5. Approve deployment:
# - Review test results
# - Update package.json version
# - Create release notes di CHANGELOG.md
```

### Change Request Template

```markdown
SOURCE: [Client/QA/Developer]
TYPE: [Bug/Feature/Modification]

REQUEST:
[Deskripsi singkat]

EXAMPLE:
"Tolong tambah fitur export data ke Excel"
```

### Priority Guidelines

- **Critical** - Security vulnerabilities, data loss, payment errors (immediate action)
- **High** - Important features, major UX issues (next sprint)
- **Medium** - Nice-to-have features, minor improvements (backlog)
- **Low** - Experimental features, low business value (future)

---

## Workflow Lengkap (End-to-End)

### Scenario: Implementasi Fitur Baru

```bash
# STEP 1: Mulai dengan TASK_AGENT
"Hai @workflow/TASK_AGENT.md, yuk kita kerja"

# TASK_AGENT:
# - Baca PROGRESS.md
# - Tampilkan tasks
# - User pilih task
# - Implementasi fitur
# - Test lokal
# - Update PROGRESS.md
# - Commit & push ke feature branch

# STEP 2: Merge ke main
git checkout main
git merge feature/your-feature
git push origin main

# Cloudflare Deployment (Automated):
# - Build project
# - Deploy to Cloudflare Pages
# - Smoke tests

# STEP 3: MANAGER_AGENT create release notes
# Update CHANGELOG.md
# Update version di package.json
```

### Scenario: Bug Report dari QA

```bash
# STEP 1: QA lapor bug
SOURCE: QA
TYPE: Bug
ISSUE: "Users can delete protected data"

# STEP 2: MANAGER_AGENT analyze
# - Priority: Critical (data integrity issue)
# - Decision: Accept
# - Update PROGRESS.md dengan bug fix task

# STEP 3: TASK_AGENT fix bug
# - Implement fix
# - Test lokal
# - Update PROGRESS.md
# - Commit & push

# Cloudflare Deployment (Automated):
# - Build & deploy

# STEP 4: MANAGER_AGENT create release notes
# Update CHANGELOG.md
# Update version di package.json
```

### Scenario: Feature Request dari Client

```bash
# STEP 1: Client request feature
SOURCE: Client
TYPE: Feature Request
REQUEST: "Tolong tambah fitur export Excel"

# STEP 2: MANAGER_AGENT analyze
# - Priority: High
# - Feasibility: Yes
# - Decision: Accept
# - Update PRD.md (add feature)
# - Update TDD.md (add API specs)
# - Update PROGRESS.md (add task)

# STEP 3: TASK_AGENT implement
# - Implement feature
# - Test lokal
# - Update PROGRESS.md
# - Commit & push

# Cloudflare Deployment (Automated)

# STEP 4: MANAGER_AGENT create release notes
# Update CHANGELOG.md
# Update version di package.json
```

---

## Scope Enforcement

Each agent has a specific scope and will reject work outside their responsibilities:

### MANAGER_AGENT
**CAN:**
- ✅ Receive and document change requests
- ✅ Analyze impact on PRD, TDD, PROGRESS
- ✅ Update documentation (PRD, TDD, PROGRESS)
- ✅ Approve deployment readiness
- ✅ Update version in package.json
- ✅ Create release notes in CHANGELOG.md

**CANNOT:**
- ❌ Implement features or write code
- ❌ Modify code directly
- ❌ Run tests manually
- ❌ Deploy to production

### TASK_AGENT
**CAN:**
- ✅ Implement features (create/modify pages, API routes, components)
- ✅ Fix bugs
- ✅ Modify existing features
- ✅ Test locally
- ✅ Update PROGRESS.md

**CANNOT:**
- ❌ Manage changes or update PRD/TDD
- ❌ Create release notes
- ❌ Approve deployment
- ❌ Deploy to production

### INIT_AGENT
**CAN:**
- ✅ Create project infrastructure
- ✅ Setup database
- ✅ Setup testing infrastructure
- ✅ Create documentation (README, PRD, TDD, PROGRESS, ui-kit)
- ✅ Setup design system

**CANNOT:**
- ❌ Implement features or write business logic
- ❌ Create API endpoints
- ❌ Manage changes after initialization

**If an agent is asked to do something outside scope:**
```
RESPONSE: "Saya tidak bisa [task]. 
Itu adalah tanggung jawab [CORRECT_AGENT]. 
Silakan mention @[workflow/CORRECT_AGENT.md] untuk [task]."
```

---

## Quick Reference

### Agent Responsibilities

| Agent | Responsibilities | When Involved |
|-------|----------------|---------------|
| **INIT_AGENT** | Project initialization, setup infrastructure | Memulai project baru |
| **TASK_AGENT** | Implement features, fix bugs | Implementasi fitur |
| **MANAGER_AGENT** | Manage changes, create release notes | Change requests, deployment approval |

### Workflow Commands

```bash
# Start new project
"Hai @workflow/INIT_AGENT.md, yuk kita mulai project baru"

# Implement features
"Hai @workflow/TASK_AGENT.md, yuk kita kerja"

# Manage changes
"Hai @workflow/MANAGER_AGENT.md, ada change request"

# Deploy to production
git checkout main
git merge feature/your-feature
git push origin main
# Cloudflare handles the rest
```

### MANAGER_AGENT Usage Examples

**Bug Report:**
```bash
"Hai @workflow/MANAGER_AGENT.md, ada bug report:
SOURCE: QA
TYPE: Bug
ISSUE: Users can delete protected data"
```

**Feature Request:**
```bash
"Hai @workflow/MANAGER_AGENT.md, ada feature request:
SOURCE: Client
TYPE: Feature Request
REQUEST: Tolong tambah fitur export Excel"
```

**Deployment Approval:**
```bash
"Hai @workflow/MANAGER_AGENT.md, tolong approve deployment v1.2.0"
```

---

## Cloudflare Deployment

Deployment ke Cloudflare Pages berjalan otomatis:

1. **Local Development:** `npm run dev` (port 5173)
2. **Build:** `npm run build`
3. **Preview:** `npm run preview`
4. **Deploy:** `npm run deploy`

### Wrangler Configuration

Pastikan `wrangler.toml` sudah terkonfigurasi:
```toml
name = "your-project"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "your-database"
database_id = "your-database-id"
```

---

## Troubleshooting

### Build Fails

```bash
# Check type errors
npm run check

# Check build
npm run build
```

### Database Issues

```bash
# Regenerate migrations
npm run db:generate

# Run local migrations
npm run db:migrate:local

# Open Drizzle Studio
npm run db:studio
```

### Deployment Fails

```bash
# Check wrangler.toml
# Verify Cloudflare credentials
# Check D1 binding
```

---

## Summary

3 Agent bekerja sama untuk membangun aplikasi dengan kualitas tinggi:

1. **INIT_AGENT** - Setup project infrastructure
2. **TASK_AGENT** - Implementasi fitur
3. **MANAGER_AGENT** - Manajemen perubahan

**Workflow:**
```
INIT_AGENT → TASK_AGENT → Cloudflare Deployment → MANAGER_AGENT
```

**Key Features:**
- ✅ Edge-ready dengan Cloudflare
- ✅ Type-safe dengan TypeScript + Drizzle ORM
- ✅ Auth siap pakai dengan Lucia
- ✅ Dark Elegance theme
- ✅ Auto-deployment ke Cloudflare Pages

**Best Practices:**
- Gunakan feature branches
- Test lokal sebelum push
- Update PROGRESS.md setelah selesai
- Monitor Cloudflare deployment
- Review release notes
