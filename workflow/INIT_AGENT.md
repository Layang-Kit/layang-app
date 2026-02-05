# Project Initialization Workflow - SvelteKit Cloudflare Starter

Panduan lengkap untuk memulai project baru dengan SvelteKit + Cloudflare D1 + Drizzle ORM.

## Scope Enforcement

**INIT_AGENT CAN:**
- ✅ Create project infrastructure
- ✅ Setup Cloudflare configuration
- ✅ Create documentation (README, PRD, TDD, PROGRESS, ui-kit)
- ✅ Setup design system
- ✅ Create layout components
- ✅ Customize auth pages
- ✅ Setup database migrations
- ✅ Git init and first commit
- ✅ **MUST STOP and wait for user approval after Step 7 (Review Documentation)**

**INIT_AGENT CANNOT:**
- ❌ Implement features or write business logic code
- ❌ Create API endpoints atau server routes
- ❌ Manage changes atau update PRD/TDD setelah initialization
- ❌ Deploy to production
- ❌ Create release notes

**If asked to do something outside scope:**
```
❌ REJECTED: "Tolong implementasi fitur ini"

RESPONSE: "Saya tidak bisa implementasi fitur atau menulis code. 
Itu adalah tanggung jawab TASK_AGENT. 
Silakan mention @workflow/TASK_AGENT.md untuk implementasi fitur."
```

**Note:** INIT_AGENT hanya untuk setup project awal. Setelah initialization selesai, gunakan TASK_AGENT untuk implementasi fitur.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | SvelteKit 2.x |
| UI Library | Svelte 5.x |
| Styling | Tailwind CSS 4.x |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM 0.40 |
| Auth | Lucia Auth 3.x + Arctic |
| Password Hashing | Web Crypto API (PBKDF2) |
| Email | Resend |
| Storage | Cloudflare R2 |
| Build Tool | Vite 6.x |
| Adapter | @sveltejs/adapter-cloudflare |
| Deployment | Cloudflare Pages |

---

## Initialization Steps

Ikuti urutan ini saat memulai project baru:

### 1. Listen to user

Tanyakan user untuk:
- Nama project
- Deskripsi project
- Fitur utama

Konfirmasi ke user setelah mendapatkan informasi. Jangan lanjut ke step selanjutnya sebelum mendapatkan konfirmasi.

 

### 2. Create/Replace README.md

Tanyakan user untuk:
- Nama project
- Deskripsi project
- Fitur utama

Buat `README.md` dengan konten:
- Nama dan deskripsi project
- Quick start guide (installation, usage)
- Tech stack
- List fitur
- Environment setup

### 3. Create workflow/PRD.md

Dokumen Product Requirements yang berisi:
- Objectives dan goals
- List fitur
- Success criteria
- **Design specifications** (branding colors, typography, design system, visual identity)

### 4. Create workflow/TDD.md

Dokumen Technical Design yang berisi:
- Technical architecture dan system design
- Database schema dan relationships
- API endpoints dan routes
- Data models dan flow
- Security considerations
- Technical specifications dari PRD.md

### 5. Create workflow/ui-kit.html

Dokumen UI Design System yang berisi:
- Color palette dan theme tokens
- Typography styles (headings, body text)
- Button styles dan variants
- Form input styles
- Card dan container styles
- Status badges dan feedback components
- Layout patterns dan spacing
- Icon usage guidelines

**Theme:** Dark Elegance (default dari starter kit)
- Background: `bg-neutral-950` (true black)
- Surface: `bg-neutral-900` (soft black)
- Primary Accent: `text-accent-500` (warm amber #f59e0b)
- Text Primary: `text-neutral-100`
- Text Secondary: `text-neutral-500`

### 6. Create workflow/PROGRESS.md

Template tracking development:

```markdown
# Development Progress

## Completed
- [x] Initial setup
- [x] README.md created
- [x] workflow/PRD.md created
- [x] workflow/TDD.md created
- [x] workflow/ui-kit.html created
- [x] workflow/PROGRESS.md created

## In Progress
- [ ] Feature 1

## Pending
- [ ] Feature 2

---

## Features

### [Feature Name]
- [ ] Pages: +page.svelte, +page.server.ts
- [ ] API Routes: +server.ts
- [ ] Database: Schema updates, migrations
- [ ] Components: Svelte components

---

## Migrations
### Completed
- [ ] migration_name

### Pending
- [ ] migration_name
```

### 7. Review Documentation ⛔ MANDATORY

**🚨 CRITICAL: DO NOT SKIP THIS STEP 🚨**

Step ini **WAJIB** dan **TIDAK BOLEH DILEWATI**. INIT_AGENT harus **BERHENTI** di sini dan menunggu user review.

**Yang harus direview user:**
- `README.md` - Project overview, features, tech stack
- `workflow/PRD.md` - Requirements, design specifications
- `workflow/TDD.md` - Technical design document (architecture, database, API)
- `workflow/ui-kit.html` - UI design system dan components
- `workflow/PROGRESS.md` - Development tracking template

**Format permintaan review ke user:**
```
## 📋 Review Required

Saya sudah membuat dokumentasi awal project. Mohon review dan konfirmasi sebelum lanjut:

### 📁 Files yang perlu direview:
1. **README.md** - Project overview dan fitur
2. **workflow/PRD.md** - Product requirements dan design specs  
3. **workflow/TDD.md** - Technical design dan database schema
4. **workflow/ui-kit.html** - UI design system (buka di browser)
5. **workflow/PROGRESS.md** - Development tracking

### ✅ Apa yang perlu dicek:
- [ ] Nama project dan deskripsi sudah benar?
- [ ] Fitur-fitur sudah lengkap?
- [ ] Design specifications (warna, typography) sesuai branding?
- [ ] Database schema sudah sesuai kebutuhan?
- [ ] Ada yang perlu diubah/ditambah?

**Silakan reply:**
- "Lanjutkan" / "Oke" / "👍" - jika sudah OK
- Atau beritahu apa yang perlu diubah

⛔ **Saya akan menunggu konfirmasi Anda sebelum melanjutkan ke step berikutnya.**
```

**⛔ STOP - DO NOT PROCEED UNTIL USER CONFIRMS ⛔**

### 8. Setup Environment

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Isi environment variables:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_DATABASE_ID`
- `CLOUDFLARE_API_TOKEN`
- `GOOGLE_CLIENT_ID` (opsional)
- `GOOGLE_CLIENT_SECRET` (opsional)
- `RESEND_API_TOKEN` (opsional)

### 9. Setup Database

```bash
# Generate migrations
npm run db:generate

# Run local migrations
npm run db:migrate:local

# Seed database
npm run db:seed:local
```

### 10. Setup Design System

Konfigurasi theme:
- Update `src/app.css` dengan Tailwind 4 CSS-first configuration (branding colors, typography, design tokens) dari `workflow/PRD.md` dan `workflow/ui-kit.html`
- Update `src/app.css` dengan custom styles jika diperlukan

### 11. Create Layout Components

Buat layout components di `src/lib/components/layouts/`:
- `AppShell.svelte` - Main app shell dengan navigation
- `Sidebar.svelte` - Sidebar navigation (jika diperlukan)
- `Header.svelte` - Top header bar

Ikuti design system dari `workflow/ui-kit.html`.

### 12. Customize Auth Pages

Update built-in auth pages untuk match design system:

- `src/routes/login/+page.svelte`
- `src/routes/register/+page.svelte`
- `src/routes/forgot-password/+page.svelte`
- `src/routes/reset-password/+page.svelte`

### 13. Git Init and First Commit

```bash
git init
git add .
git commit -m "Initial commit: Project setup"
```

### 14. Start Dev Server

```bash
npm run dev
```

### 15. Complete Initialization

**Proses INIT AGENT selesai!**

Setelah dev server berjalan dengan baik:
1. Tutup session ini
2. Buka session baru dan mulai dengan: **"Hai @[workflow/TASK_AGENT.md] yuk kita kerja"**
3. Lanjutkan implementasi fitur sesuai `workflow/PROGRESS.md`

---

## Important Notes

- **Selalu ikuti urutan ini** - Jangan skip steps
- **⛔ STEP 7 (Review Documentation) WAJIB** - INIT_AGENT harus BERHENTI dan menunggu user review & approve sebelum lanjut ke step 8
- **Jangan auto-lanjut setelah buat dokumentasi** - Tunggu explicit confirmation dari user
- **Gunakan built-in functionality** - Cek dulu apakah fitur sudah ada di starter kit
- **Test sebelum commit** - Pastikan semua berjalan dengan baik sebelum commit
- **Default PORT** - SvelteKit default PORT adalah 5173

---

## SvelteKit Patterns

### Server Load Pattern (for GET requests)

Gunakan `+page.server.ts` `load()` function:

```typescript
// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  const posts = await locals.db.query.posts.findMany();
  return { user, posts };
};
```

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>

{#each data.posts as post}
  <PostCard {post} />
{/each}
```

### Form Actions Pattern (for POST/PUT/DELETE)

Gunakan `+page.server.ts` `actions`:

```typescript
// src/routes/posts/+page.server.ts
import type { Actions } from './$types';

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const title = form.get('title') as string;
    
    await locals.db.insert(posts).values({ title });
    
    return { success: true };
  }
};
```

```svelte
<!-- src/routes/posts/+page.svelte -->
<form method="POST" action="?/create">
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

### API Routes Pattern

```typescript
// src/routes/api/posts/+server.ts
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  const posts = await locals.db.query.posts.findMany();
  return json(posts);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json();
  const post = await locals.db.insert(posts).values(body).returning();
  return json(post);
};
```

---

## Core Principle: Maximize Existing Functionality

**ALWAYS check and use existing features before creating new ones.**

**Built-in Features:**
- **Auth System** - Lucia Auth dengan email/password + Google OAuth
- **Database** - Drizzle ORM dengan D1
- **File Upload** - Cloudflare R2 integration
- **Email** - Resend email templates
- **Image Processing** - WebP conversion

**Built-in Pages:**
- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password
- `/dashboard` - User dashboard
- `/profile` - User profile

**Built-in API Endpoints:**
- `/api/health` - Health check
- `/api/profile` - Profile API (GET/PUT)
- `/api/users` - Users CRUD API
- `/auth/*` - Authentication endpoints

**Rule:** If functionality exists, **use or modify** existing code instead of creating redundant features.

---

## Common Implementation Patterns

### Database Schema Update

```typescript
// src/lib/db/schema.ts
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
  published: integer('published', { mode: 'boolean' }).default(false),
  authorId: text('author_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});
```

### Create Migration

```bash
npm run db:generate
```

### Database Access Pattern

```typescript
// Access via locals (injected by hooks.server.ts)
export const load = async ({ locals }) => {
  const posts = await locals.db.query.posts.findMany();
  return { posts };
};
```

---

## Next Steps

Setelah project initialization selesai, lanjutkan dengan:
1. Implementasi fitur pertama sesuai `workflow/PROGRESS.md`
2. Gunakan `workflow/TASK_AGENT.md` untuk panduan implementasi fitur
3. Update `workflow/PROGRESS.md` setelah setiap fitur selesai
