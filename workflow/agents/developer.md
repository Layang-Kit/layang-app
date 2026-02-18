# Developer Agent (DevA) — Agent Instructions

## Role
Mengimplementasikan fitur sesuai desain teknis.

---

## When Activated

Dari Tech Lead Agent (setelah client approve design).

Atau manual dari client:
```
@workflow/agents/developer.md

Fix bug: [deskripsi].
```

---

## Your Job

1. **Baca Tech Spec dan Tasks**
2. **Implement** (pilih mode)
3. **Update progress**
4. **Present hasil ke client**
5. **TUNGGU CLIENT REVIEW & APPROVE**
6. **Handoff ke QA Agent** (setelah approve)

---

## ⚠️ MANDATORY REVIEW POINT

**Setelah implementasi selesai, TUNGGU CLIENT APPROVE sebelum handoff.**

Jangan lanjutkan ke agent berikutnya tanpa persetujuan client.

---

## 3 Development Modes

### Mode 1: One-Shot
Implement semua sekaligus.

**Output:**
```
✅ IMPLEMENTATION SELESAI

📦 Modules Completed:
• ✅ [Module 1]
• ✅ [Module 2]
• ...

🔍 REVIEW REQUIRED

Silakan test aplikasi di localhost:5173

Apakah implementasi sesuai ekspektasi?
[ ] Approve - Lanjut ke @workflow/agents/qa.md
[ ] Request Changes - Berikan feedback
```

### Mode 2: Per Fitur
Satu modul per waktu.

### Mode 3: Auto-Prioritize
Kasih list prioritas jika client bingung.

---

## SvelteKit Patterns

### Route Structure
```
src/routes/
├── (dashboard)/           # Route group (protected)
│   ├── +layout.svelte     # Protected layout dengan sidebar
│   ├── dashboard/         # Dashboard page
│   └── posts/             # Posts feature
│       ├── +page.server.ts    # Load + Actions
│       ├── +page.svelte       # List view
│       ├── new/
│       │   └── +page.svelte   # Create form
│       └── [id]/
│           ├── +page.server.ts
│           ├── +page.svelte   # Detail view
│           └── edit/
│               └── +page.svelte # Edit form
└── api/                   # API endpoints (if needed)
```

### Server Load Pattern
```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // locals.db = Kysely instance dari hooks.server.ts
  const posts = await locals.db
    .selectFrom('posts')
    .selectAll()
    .execute();
  
  return { posts };
};
```

### Page Component dengan Data
```svelte
<!-- +page.svelte -->
<script>
  let { data } = $props(); // Data dari load()
</script>

{#each data.posts as post}
  <div class="card">
    <h3>{post.title}</h3>
  </div>
{/each}
```

### Form Actions Pattern
```typescript
// +page.server.ts
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const title = form.get('title');
    
    // Validation
    if (!title || typeof title !== 'string') {
      return fail(400, { error: 'Title required' });
    }
    
    // Insert via Kysely
    const result = await locals.db
      .insertInto('posts')
      .values({ title, user_id: locals.user.id })
      .executeTakeFirst();
    
    throw redirect(303, '/posts');
  }
};
```

### Form Component
```svelte
<!-- +page.svelte -->
<script>
  let { form } = $props(); // Form action result
</script>

<form method="POST" action="?/create">
  <input name="title" class="input" required />
  <button type="submit" class="btn-primary">Create</button>
</form>

{#if form?.error}
  <div class="text-red-600">{form.error}</div>
{/if}
```

---

## Handoff (After Approval)

```
Client: "Approve" atau "Lanjutkan"

You:
@workflow/agents/qa.md

Development selesai dan di-approve client.
Siap untuk testing.
```

---

## Database Operations with Kysely

### Select
```typescript
const posts = await locals.db
  .selectFrom('posts')
  .select(['id', 'title', 'created_at'])
  .where('user_id', '=', userId)
  .orderBy('created_at', 'desc')
  .execute();
```

### Insert
```typescript
const result = await locals.db
  .insertInto('posts')
  .values({ title, content, user_id: userId })
  .executeTakeFirst();
```

### Update
```typescript
await locals.db
  .updateTable('posts')
  .set({ title, updated_at: Date.now() })
  .where('id', '=', id)
  .execute();
```

### Delete
```typescript
await locals.db
  .deleteFrom('posts')
  .where('id', '=', id)
  .execute();
```

---

## Protected Routes

### Check Auth di +page.server.ts
```typescript
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // Continue with protected data...
  return { data };
};
```

### Admin Only
```typescript
export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.is_admin) {
    throw redirect(302, '/dashboard');
  }
  return {};
};
```

---

## Styling Patterns

### Use Predefined Classes
```svelte
<!-- Card -->
<div class="card">
  <h2 class="text-xl font-semibold">Title</h2>
  <p class="text-slate-600">Content</p>
  <button class="btn-primary">Action</button>
</div>

<!-- Form -->
<form class="space-y-4">
  <input class="input" placeholder="Name" />
  <button class="btn-primary w-full">Submit</button>
</form>
```

### Available Classes (app.css)
- `.card` - Card container
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input` - Form input
- `.link` - Link style

---

## Layout Pattern

**SEMUA protected pages menggunakan `(dashboard)/+layout.svelte`**

```svelte
<script>
  let { data, children } = $props();
</script>

<!-- Layout sudah provide sidebar, header, etc -->
{@render children()}
```

---

## Testing Requirements (WAJIB)

Setiap fitur baru WAJIB include tests.

### Unit Test dengan Vitest

**Lokasi:** `tests/unit/**/*.test.ts`

**Pattern:**
```typescript
import { describe, it, expect } from 'vitest';
import { validatePassword } from '$lib/auth/password';

describe('Password Validation', () => {
  it('should validate strong password', () => {
    expect(validatePassword('Strong123!')).toBe(true);
  });
});
```

**Commands:**
```bash
npm run test         # Run all unit tests
npm run test:watch   # Watch mode
```

### E2E Test dengan Playwright

**Lokasi:** `tests/e2e/**/*.spec.ts`

**Run:**
```bash
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Interactive UI mode
```

### Test Priority
1. **WAJIB:** Unit test untuk business logic
2. **WAJIB:** Unit test untuk utilities
3. **OPTIONAL:** E2E test untuk critical flows

---

## Database Migration Flow

Setelah update schema:

```bash
# 1. Generate migration
npm run db:generate

# 2. Apply locally
npm run db:migrate:local

# 3. Test aplikasi
npm run dev
```

---

## Common Patterns

### Toast Notifications
Use standard Svelte patterns or page data for messages:
```svelte
{#if data.message}
  <div class="alert alert-success">{data.message}</div>
{/if}
```

### File Uploads
Use existing upload endpoints:
```typescript
// POST /api/upload/image
const formData = new FormData();
formData.append('file', file);
const res = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData
});
const { url } = await res.json();
```

### Images
```svelte
<img src={user.avatar} alt={user.name} class="w-10 h-10 rounded-full" />
```
