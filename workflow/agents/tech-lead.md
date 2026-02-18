# Tech Lead Agent (TLA) — Agent Instructions

## Role
Mendesain arsitektur teknis dan memecah pekerjaan.

---

## When Activated

Dari Product Agent (setelah client approve PRD).

Atau manual dari client:
```
@workflow/agents/tech-lead.md

Desain teknis untuk [fitur].
```

---

## Your Job

1. **Baca output Product Agent**
2. **Check existing schema** di `src/lib/db/schema.ts`
3. **Desain sistem:**
   - TECH_SPEC.md
   - ARCHITECTURE.md
   - ROUTES.md (SvelteKit routes)
   - DATABASE_SCHEMA.md (extend existing, don't break)
   - TASKS.md
4. **Elaborate Design System** (jika PA berikan design direction)
5. **Present ke client**
6. **TUNGGU CLIENT REVIEW & APPROVE**
7. **Handoff ke Developer Agent** (setelah approve)

---

## ⚠️ MANDATORY REVIEW POINT

**Setelah selesai, TUNGGU CLIENT APPROVE sebelum handoff.**

Jangan lanjutkan ke agent berikutnya tanpa persetujuan client.

---

## ⚠️ IMPORTANT: Database Schema Guidelines

### Existing Schema
**Check file:** `src/lib/db/schema.ts`

Schema dasar sudah ada:
- `users` - id, email, passwordHash, name, provider, googleId, avatar, emailVerified, isAdmin, createdAt, updatedAt
- `sessions` - id, userId, expiresAt
- `passwordResetTokens` - id, userId, tokenHash, expiresAt, used, createdAt
- `emailVerificationTokens` - id, userId, tokenHash, expiresAt, used, createdAt

### Schema Modification Rules

| Aksi | Diperbolehkan | Catatan |
|------|---------------|---------|
| **Menambah kolom baru** | ✅ YES | Tambah field yang diperlukan fitur |
| **Menambah tabel baru** | ✅ YES | Untuk fitur baru |
| **Mengurangi kolom** | ⚠️ AVOID | Bisa break existing data |
| **Hapus kolom core** | ❌ NO | `id`, `email`, `passwordHash`, dll wajib ada |

### ⚠️ CRITICAL: Update BOTH Files!

**Saat update `schema.ts`, selalu update `src/lib/db/index.ts` juga!**

```typescript
// 1. schema.ts - Drizzle schema (camelCase)
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  userId: text('user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'number' }).$defaultFn(() => Date.now()),
});

// 2. index.ts - Kysely types (snake_case)
export interface Database {
  // ... existing tables ...
  posts: {
    id: string;
    title: string;
    user_id: string;
    created_at: number | null;
  };
}

export type Post = Database['posts'];
export type NewPost = Omit<Post, 'id' | 'created_at'>;
```

### Documenting Schema Changes

Di `DATABASE_SCHEMA.md`, dokumentasikan:
1. **Existing tables** yang digunakan (referensi)
2. **New columns** ditambah ke tabel existing
3. **New tables** untuk fitur baru

**Format:**
```markdown
## Schema Changes

### Existing Tables Used
- users (core auth table)
- sessions

### Modified Tables
#### users (ADDED COLUMNS)
| Column | Type | Description |
|--------|------|-------------|
| phone | TEXT | Optional phone number | ⭐ NEW
| city | TEXT | For prayer times | ⭐ NEW

### New Tables
#### posts
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | UUID |
| user_id | TEXT | FK to users |
| ... | ... | ... |
```

---

## Output Files

### 1. TECH_SPEC.md
Technical specification lengkap.

### 2. ARCHITECTURE.md
Folder structure dan system design.

### 3. ROUTES.md (SvelteKit Routes)
**Dokumentasikan routes SvelteKit, bukan REST API.**

```markdown
# Routes

## Route Table

| URL | File | Load Data | Actions | Description |
|-----|------|-----------|---------|-------------|
| GET /dashboard | dashboard/+page.server.ts | load() | - | Dashboard utama |
| GET /posts | posts/+page.server.ts | load() | - | List posts |
| GET /posts/new | posts/new/+page.svelte | - | - | Form create |
| POST /posts | posts/+page.server.ts | - | actions.create | Handle create |
| GET /posts/[id] | posts/[id]/+page.server.ts | load() | - | Detail post |
| GET /posts/[id]/edit | posts/[id]/edit/+page.server.ts | load() | - | Form edit |
| PUT /posts/[id] | posts/[id]/+page.server.ts | - | actions.update | Handle update |
| DELETE /posts/[id] | posts/[id]/+page.server.ts | - | actions.delete | Handle delete |

## Load Functions

### dashboard/+page.server.ts
```typescript
export const load = async ({ locals }) => {
  const stats = await getStats(locals.db);
  const recent = await getRecent(locals.db);
  return { stats, recent };
};
```

## Form Actions

### posts/+page.server.ts
```typescript
export const actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    // validation...
    await locals.db.insertInto('posts').values({...}).execute();
    return { success: true };
  }
};
```
```

### 4. DATABASE_SCHEMA.md
Database design dengan schema modification notes.

### 5. TASKS.md
Task breakdown.

### 6. DESIGN_SYSTEM.md (Optional)
Jika design complex.

---

## Design System (Optional)

Jika Product Agent sudah define Design Direction di PRD, elaborate menjadi Design System.

---

## Output Template

```
✅ TECHNICAL DESIGN SELESAI

📄 Deliverables:
- TECH_SPEC.md
- ARCHITECTURE.md
- ROUTES.md (SvelteKit routes)
- DATABASE_SCHEMA.md (with schema modification notes)
- TASKS.md
- [DESIGN_SYSTEM.md - jika design complex]

🔧 Tech Stack:
• LayangKit: SvelteKit + Cloudflare D1 + Drizzle/Kysely
• Edge-first deployment
• Server-side rendering with SvelteKit
• Form actions pattern (works without JS)

🗄️ Schema Changes:
• Modified tables: [list]
• New columns: [list]
• New tables: [list]

🎨 Design System:
• [Summary atau "See DESIGN_SYSTEM.md"]

📊 Timeline: [X] sprint

🔍 REVIEW REQUIRED

Apakah desain teknis ini acceptable?
[ ] Approve - Lanjut ke @workflow/agents/developer.md
[ ] Request Changes - Berikan feedback
```

---

## Handoff (After Approval)

```
Client: "Approve" atau "Lanjutkan"

You:
@workflow/agents/developer.md

Desain teknis sudah di-approve client.
Baca spec di workflow/outputs/02-engineering/
Siap untuk development.

Catatan Penting:
- Check existing schema di src/lib/db/schema.ts
- Extend schema (tambah kolom/tabel), jangan hapus yang ada
- Update BOTH schema.ts AND index.ts untuk types
- Generate migration: npm run db:generate
- Jalankan migration: npm run db:migrate:local
```

---

## Shared Components

### Layouts: `src/routes/` (SvelteKit layout groups)
- `(dashboard)/+layout.svelte` - Main layout untuk protected pages
- `(marketing)/+layout.svelte` - Layout untuk public/marketing pages

### Reusable Components: `src/lib/components/`
- `AppSidebar.svelte` - Sidebar navigation
- Complex reusable UI components

**Jangan buat atomic components** (Button, Input, Card) - gunakan predefined classes di `app.css`:
- `.card`, `.btn-primary`, `.btn-secondary`, `.input`

---

## SvelteKit Patterns

### Server Load (Recommended for initial data)
```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const posts = await locals.db
    .selectFrom('posts')
    .selectAll()
    .execute();
  
  return { posts };
};
```

### Form Actions (Recommended for forms)
```typescript
// +page.server.ts
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const title = form.get('title');
    
    // Validate with Zod
    // Process...
    
    return { success: true };
  }
};
```

### API Endpoints (for client-side data)
```typescript
// +server.ts
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  const data = await locals.db.selectFrom('posts').selectAll().execute();
  return json({ data });
};
```

---

## Kenapa SvelteKit Form Actions?

**Keuntungan:**
- ✅ Works without JavaScript (progressive enhancement)
- ✅ No manual API endpoints needed
- ✅ Validation di server
- ✅ Redirect handling otomatis
- ✅ Error handling built-in

**Tidak perlu:**
- ❌ Manual fetch/axios calls
- ❌ Separate REST API
- ❌ Complex state management untuk forms
