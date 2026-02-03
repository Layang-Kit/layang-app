# SvelteKit Data Loading Patterns

SvelteKit punya 3 pattern untuk data loading. Mari kita bahas masing-masing:

## 📊 Perbandingan Pattern

| Pattern | Request | SEO | JS Required | Use Case |
|---------|---------|-----|-------------|----------|
| **API + Fetch** | 2 | ❌ Bad | ✅ Yes | Rarely needed |
| **Server Load** | 1 | ✅ Good | ❌ No | GET data |
| **Form Actions** | 1 | ✅ Good | ❌ No | POST/PUT/DELETE |

---

## ❌ Pattern 1: API + Fetch (Anti-pattern di SvelteKit)

```
Browser → Load Page → Fetch API → Render Data
   ↑         ↑          ↑           ↑
   │         │          │           │
   └─────────┴──── 2 Request ───────┘
```

### Contoh (JANGAN DILAKUKAN):

```typescript
// routes/api/users/+server.ts
export const GET = async () => {
  const users = await db.query.users.findMany();
  return json({ users });
};
```

```svelte
<!-- routes/dashboard/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let users = [];
  let loading = true;
  
  onMount(async () => {
    // ❌ Fetch dari browser = 2 request!
    const res = await fetch('/api/users');
    const data = await res.json();
    users = data.users;
    loading = false;
  });
</script>

{#if loading}
  <LoadingSpinner />
{:else}
  {#each users as user}
    <UserCard {user} />
  {/each}
{/if}
```

### Masalah:
- ✅ 2 request (page + API)
- ✅ Perlu loading state
- ✅ SEO jelek (HTML kosong saat crawl)
- ✅ Flash of unauthenticated content (FOUC)

---

## ✅ Pattern 2: Server Load (Recommended untuk GET)

```
Browser ──────── 1 Request ────────→ Server
                                      ↓
                              Load Function
                              Query Database
                                      ↓
                              Render HTML
                                      ↓
Browser ←──── HTML dengan data ─────┘
```

### Contoh:

```typescript
// routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // ✅ Langsung query di server!
  const users = await locals.db.query.users.findMany();
  
  // ✅ Return data → otomatis available di page
  return { users };
};
```

```svelte
<!-- routes/dashboard/+page.svelte -->
<script>
  // ✅ Data langsung dari server!
  let { data } = $props();
</script>

<!-- ✅ Langsung render, no loading! -->
{#each data.users as user}
  <UserCard {user} />
{/each}
```

### Keuntungan:
- ✅ 1 request saja
- ✅ SEO friendly (HTML lengkap)
- ✅ No loading state needed
- ✅ Type-safe
- ✅ Bisa access secrets di server

---

## ✅ Pattern 3: Form Actions (Recommended untuk POST/PUT/DELETE)

```
Browser ───── Form Submit ──────→ Server Action
                                    ↓
                              Process Form
                              (Validate, DB, etc)
                                    ↓
                          Return Result / Redirect
                                    ↓
Browser ←──── Result / New Page ──┘
```

### Contoh:

```typescript
// routes/register/+page.server.ts
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  register: async ({ request, locals }) => {
    const form = await request.formData();
    
    // Validasi
    const email = form.get('email');
    if (!email) {
      return fail(400, { error: 'Email required' });
    }
    
    // Process
    await locals.db.insert(users).values({ email });
    
    // Redirect atau return success
    throw redirect(303, '/dashboard');
  }
};
```

```svelte
<!-- routes/register/+page.svelte -->
<script>
  let { form } = $props(); // Data dari action return
</script>

<!-- ✅ Form POST langsung ke server -->
<form method="POST" action="?/register">
  <input name="email" type="email" required />
  
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
  
  <button type="submit">Register</button>
</form>
```

### Keuntungan:
- ✅ Works tanpa JavaScript!
- ✅ 1 request untuk form
- ✅ No API endpoint needed
- ✅ Secure (logic di server)
- ✅ Progressive enhancement dengan `use:enhance`

---

## 🔄 Progressive Enhancement dengan `use:enhance`

Form Actions work tanpa JS, tapi kita bisa tambahkan UX yang lebih baik:

```svelte
<script>
  import { enhance } from '$app/forms';
  
  let loading = $state(false);
</script>

<form
  method="POST"
  action="?/createUser"
  use:enhance={() => {
    // Called saat form submit
    loading = true;
    
    return async ({ result, update }) => {
      // Called saat server response
      loading = false;
      
      if (result.type === 'success') {
        // Update form tanpa reload
        update();
      }
    };
  }}
>
  <input name="name" />
  <button type="submit" disabled={loading}>
    {loading ? 'Creating...' : 'Create'}
  </button>
</form>
```

### Apa yang `use:enhance` berikan:
1. **Loading states** - Disable button saat submitting
2. **Prevent double submit** - Auto-disable form saat submitting
3. **Handle result** - Process success/error tanpa page reload
4. **Optimistic updates** - Update UI sebelum server confirm

---

## 📁 Struktur File yang Benar

```
src/routes/
├── dashboard/
│   ├── +page.server.ts      # ⬅️ Server load untuk GET
│   └── +page.svelte         # ⬅️ Render data dari load()
│
├── register/
│   ├── +page.server.ts      # ⬅️ Form action untuk POST
│   └── +page.svelte         # ⬅️ Form yang submit ke action
│
└── api/                     # ⬅️ Hanya untuk external API
    └── external/
        └── webhook/+server.ts
```

### Kapan pakai `/api/*`?
- External API (webhooks, third-party)
- Mobile app API
- Internal service-to-service
- JANGAN untuk internal SvelteKit pages!

---

## 🎯 Contoh Lengkap: Convert API pattern ke Server Load

### Sebelum (❌ API Pattern):

```typescript
// routes/api/users/+server.ts
export const GET = async () => {
  const users = await db.query.users.findMany();
  return json({ users });
};
```

```svelte
<!-- routes/users/+page.svelte -->
<script>
  let users = [];
  let loading = true;
  
  onMount(async () => {
    const res = await fetch('/api/users');  // ❌ Extra request
    const data = await res.json();
    users = data.users;
    loading = false;
  });
</script>
```

### Sesudah (✅ Server Load):

```typescript
// routes/users/+page.server.ts
export const load = async ({ locals }) => {
  const users = await locals.db.query.users.findMany();
  return { users };  // ✅ Langsung ke page
};
```

```svelte
<!-- routes/users/+page.svelte -->
<script>
  let { data } = $props();  // ✅ Auto-populated dari load()
</script>

{#each data.users as user}
  <UserCard {user} />
{/each}
```

---

## 📚 Checklist Migration

- [ ] Hapus `/api/*` routes yang hanya dipakai internal
- [ ] Pindahkan data fetching ke `+page.server.ts` `load()`
- [ ] Pindahkan form submission ke `+page.server.ts` `actions`
- [ ] Ganti `fetch()` di browser dengan `let { data } = $props()`
- [ ] Hapus loading states yang tidak perlu
- [ ] Tambahkan `use:enhance` untuk form UX

---

## 🔗 Resources

- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
- [Loading Data](https://kit.svelte.dev/docs/load)
- [Form Actions](https://kit.svelte.dev/docs/form-actions)
- [Progressive Enhancement](https://kit.svelte.dev/docs/form-actions#progressive-enhancement)
