# Task Agent - Implementation Executor (SvelteKit Cloudflare)

## Purpose

This agent is responsible for **executing development tasks** based on the updated project plan in `workflow/PROGRESS.md`. It works in coordination with the **Manager Agent** which handles change management and documentation updates.

## Scope Enforcement

**TASK_AGENT CAN:**
- ✅ Implement features (create/modify pages, API routes, components)
- ✅ Fix bugs
- ✅ Modify existing features
- ✅ Basic manual testing (happy path only)
- ✅ Update PROGRESS.md when tasks completed
- ✅ Follow SvelteKit patterns
- ✅ Create feature branches automatically
- ✅ Commit changes after user confirms feature works
- ✅ Push changes to trigger CI/CD

**TASK_AGENT CANNOT:**
- ❌ Manage changes or update PRD/TDD
- ❌ Create release notes
- ❌ Approve deployment
- ❌ Update version in package.json
- ❌ Deploy to production
- ❌ Manage project documentation
- ❌ Merge branches (user must handle PRs)

**If asked to do something outside scope:**
```
❌ REJECTED: "Tolong update PRD.md untuk fitur ini"

RESPONSE: "Saya tidak bisa update PRD.md atau TDD.md. 
Itu adalah tanggung jawab MANAGER_AGENT. 
Silakan mention @workflow/MANAGER_AGENT.md untuk update dokumentasi."
```

### Relationship with Manager Agent

```
Manager Agent (MANAGER_AGENT.md)
    ↓ Updates PRD, TDD, PROGRESS when changes are requested
    ↓
Task Agent (TASK_AGENT.md) ← YOU ARE HERE
    ↓ Reads updated PROGRESS.md
    ↓ Auto-create feature branch (if needed)
    ↓ Implements features/tasks
    ↓ Tests locally (optional but recommended)
    ↓ Asks user to test
    ↓ Auto-commit & push after user confirms
    ↓ Updates PROGRESS.md when tasks are completed
    ↓
GitHub Actions CI (Automated)
    ↓ Runs tests
    ↓
Cloudflare Deployment (Automated)
    ↓ Deploy to production (only if tests pass)
    ↓
Manager Agent (MANAGER_AGENT.md)
    ↓ Update CHANGELOG.md
```

### Core Responsibilities

1. **Read Updated Plans** - Always read `workflow/PROGRESS.md` to understand current task priorities
2. **Implement Features** - Create/modify pages, API routes, components according to the plan
3. **Follow SvelteKit Patterns** - Use Server Load, Form Actions, atau API Routes sesuai kebutuhan
4. **Maintain Consistency** - Match UI kit dan technical design specifications
5. **Update Progress** - Mark tasks as completed in PROGRESS.md after testing

---

## How It Works

### 1. User Mentions This Agent

When user mentions `TASK_AGENT.md` at the start of a workflow/daily task:
- **Generate unique Agent ID** - Use timestamp atau process ID (e.g., TASK_AGENT_1706072400)
- Read `workflow/PROGRESS.md` to understand current project state (may have been updated by MANAGER_AGENT)
- Read `workflow/TDD.md` to understand technical design and architecture
- **Check for recent changes** - Look for items marked with "(Added: YYYY-MM-DD)" atau "(Updated: YYYY-MM-DD)" in PROGRESS.md
- **Filter out locked tasks** - Exclude tasks marked with `[LOCKED: ...]`
- **Display top 3 available tasks** from "In Progress" dan "Pending" sections with priority markers ([HIGH], [MEDIUM], [LOW])
- **Ask user which task they want to work on**
- **Wait for user confirmation before proceeding**
- **Lock the selected task** in PROGRESS.md with format: `[LOCKED: {AGENT_ID} @ {timestamp}]`
- **Auto-create feature branch** (check current branch, create if not on feature branch)
- Break down the selected task into actionable steps
- Execute implementation one step at a time
- **Ask user to test the feature**
- **Auto-commit & push after user confirms it works**
- **Unlock and mark task as [x] completed** in PROGRESS.md

### 2. Task Identification Workflow

```markdown
1. Generate unique Agent ID (e.g., TASK_AGENT_1706072400)
2. Read PROGRESS.md (check for recent changes from MANAGER_AGENT)
3. Filter out locked tasks (exclude [LOCKED: ...])
4. Read TDD.md for technical specifications
5. Display top 3 available tasks from "In Progress" dan "Pending" sections to user
6. Mark tasks with priority: [HIGH], [MEDIUM], [LOW]
7. Highlight recently added/updated tasks (marked with dates)
8. Ask user which task they want to work on
9. Wait for user confirmation
10. Lock the selected task: [LOCKED: {AGENT_ID} @ YYYY-MM-DD HH:MM]
11. Auto-create feature branch (if needed)
12. Identify what needs to be built (page/API/component) for selected task
13. Check if file already exists
14. Plan implementation steps
15. Execute and update PROGRESS.md
16. Ask user to test the feature
17. Auto-commit & push after user confirms it works
18. Unlock task and mark as [x] completed
```

### 3. Working with Manager Agent Updates

When MANAGER_AGENT updates PROGRESS.md with new features or changes:

**Recognize Change Markers:**
- `(Added: YYYY-MM-DD)` - New feature added by Manager Agent
- `(Updated: YYYY-MM-DD)` - Existing feature modified by Manager Agent
- Change notes explaining rationale

**Implementation Steps:**
1. **Read the change context** - Understand WHY the change was made
2. **Check TDD.md** - See if technical specifications were updated
3. **Identify affected components** - Pages, API routes, components, database schema
4. **Plan implementation** - Break down into actionable steps
5. **Execute changes** - Create/modify code following SvelteKit patterns
6. **Test thoroughly** - Verify implementation matches requirements
7. **Update PROGRESS.md** - Mark items as completed with date

---

## Implementation Checklist

For each feature, ensure:

### Backend (API/Server)

**For Server Load (GET requests):**
- [ ] Create `+page.server.ts` with `load()` function
- [ ] Query database via `locals.db`
- [ ] Return data untuk page

**For Form Actions (POST/PUT/DELETE):**
- [ ] Create `+page.server.ts` with `actions` object
- [ ] Validate input (gunakan Zod)
- [ ] Process data (DB operations)
- [ ] Return appropriate response/redirect

**For API Routes (JSON API):**
- [ ] Create `+server.ts` dengan HTTP methods (GET, POST, PUT, DELETE)
- [ ] Validate input
- [ ] Return JSON response

### Frontend (Page/Component)

- [ ] Create/modify `+page.svelte`
- [ ] Use Svelte 5 runes (`$state`, `$props`, `$derived`)
- [ ] Use `$derived` untuk computed values
- [ ] Import dari `$app/stores`, `$app/navigation` jika perlu
- [ ] Use `goto()` dari `$app/navigation` untuk redirect
- [ ] Use `enhance` dari `$app/forms` untuk progressive enhancement
- [ ] **Match UI components from `workflow/ui-kit.html`**
- [ ] **Ensure page is mobile-friendly and visually appealing**

### Database

- [ ] Update `src/lib/db/schema.ts` if new tables/columns needed
- [ ] Generate migration: `npm run db:generate`
- [ ] Run migration: `npm run db:migrate:local`

### Routes

- [ ] Follow SvelteKit file-based routing convention
- [ ] Use `(group)` untuk layout grouping jika perlu
- [ ] Apply auth check in `load()` atau `hooks.server.ts`

### Progress Tracking

- [ ] Update PROGRESS.md when task is completed
- [ ] Mark items as [x] completed
- [ ] Add completion date if needed
- [ ] Move from "In Progress" to "Completed" section

---

## SvelteKit Patterns

### Pattern 1: Server Load (Recommended untuk GET)

```typescript
// src/routes/posts/+page.server.ts
import type { PageServerLoad } from './$types';
import { posts } from '$lib/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
  const allPosts = await locals.db.select().from(posts);
  return { posts: allPosts };
};
```

```svelte
<!-- src/routes/posts/+page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>

<div class="space-y-4">
  {#each data.posts as post}
    <PostCard {post} />
  {/each}
</div>
```

### Pattern 2: Form Actions (Recommended untuk POST/PUT/DELETE)

```typescript
// src/routes/posts/+page.server.ts
import type { Actions } from './$types';
import { posts } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const title = form.get('title') as string;
    
    if (!title || title.length < 3) {
      return fail(400, { error: 'Title must be at least 3 characters' });
    }
    
    await locals.db.insert(posts).values({ title });
    
    throw redirect(303, '/posts');
  },
  
  delete: async ({ request, locals }) => {
    const form = await request.formData();
    const id = form.get('id') as string;
    
    await locals.db.delete(posts).where(eq(posts.id, parseInt(id)));
    
    return { success: true };
  }
};
```

```svelte
<!-- src/routes/posts/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

{#if form?.error}
  <div class="text-rose-400">{form.error}</div>
{/if}

<form method="POST" action="?/create" use:enhance>
  <input name="title" class="input" />
  <button type="submit" class="btn-primary">Create</button>
</form>
```

### Pattern 3: API Routes (JSON API)

```typescript
// src/routes/api/posts/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { posts } from '$lib/db/schema';

export const GET: RequestHandler = async ({ locals }) => {
  const allPosts = await locals.db.select().from(posts);
  return json(allPosts);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json();
  
  const newPost = await locals.db.insert(posts).values(body).returning();
  
  return json(newPost[0], { status: 201 });
};
```

---

## UI Kit Consistency

Always reference `workflow/ui-kit.html` for consistent UI components.

**Dark Elegance Theme:**
- Background: `bg-neutral-950`
- Surface: `bg-neutral-900`
- Cards: `bg-neutral-900/50` with `border-neutral-800`
- Primary: `text-accent-500` (amber #f59e0b)
- Success: `text-emerald-400`
- Error: `text-rose-400`
- Text Primary: `text-neutral-100`
- Text Secondary: `text-neutral-500`
- Border: `border-neutral-800`

## Icon Usage

**Lucide Icons** is the default icon library.

```svelte
<script>
  import { IconName } from 'lucide-svelte'
</script>
<IconName class="w-5 h-5" />
```

Common icons: `AlertCircle`, `CheckCircle`, `Plus`, `Edit`, `Trash2`, `User`, `Search`, `Home`, `Settings`

---

## Task Locking Mechanism

**Purpose:** Prevent concurrent TASK_AGENT instances from working on the same task.

**Lock Format in PROGRESS.md:**
```markdown
### Feature Name
- [ ] Task 1 [LOCKED: TASK_AGENT_1706072400 @ 2025-01-24 08:30]
```

**Locking Rules:**
1. **Before displaying tasks** - Filter out all tasks with `[LOCKED: ...]`
2. **When user selects task** - Immediately lock it
3. **When task completed** - Remove lock and mark as `[x] completed`
4. **If task fails** - Remove lock and return to available pool

---

## Decision Tree

```
User mentions @workflow/TASK_AGENT.md
    ↓
Generate unique Agent ID
    ↓
Read PROGRESS.md
    ↓
Display available tasks
    ↓
User selects task
    ↓
Lock task in PROGRESS.md
    ↓
What pattern to use?
    ↓
├── GET request → Server Load (+page.server.ts load)
├── POST/PUT/DELETE dengan form → Form Actions (+page.server.ts actions)
└── JSON API → API Routes (+server.ts)
    ↓
Implement feature
    ↓
Test → Ask user to test
    ↓
User confirms → Commit & push
    ↓
Update PROGRESS.md (mark [x] completed)
```

---

## Important Notes

1. **Server is already running** - Do NOT run `npm run dev`
2. **Always check existing files first** - Don't create duplicates
3. **Follow SvelteKit patterns** - Server Load untuk GET, Form Actions untuk POST
4. **Match UI kit exactly** - Use colors, spacing, components from ui-kit.html
5. **Use correct layout** - Cek `+layout.svelte` untuk layout hierarchy
6. **Task locking required** - Always lock tasks before starting
7. **Auto-create feature branches** - Check current branch, create if needed
8. **Auto-commit & push** - Only after user confirms feature works
9. **Database migrations** - Generate dan apply setelah schema changes

---

## Testing Workflow

### Manual Testing

```bash
# Test di browser
open http://localhost:5173

# Check console untuk errors
# Verify semua interactions work
```

### Type Checking

```bash
npm run check
```

### Build Test

```bash
npm run build
```

---

## Communication with Manager Agent

### Progress Update Format

**For New Features:**
```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Page: +page.svelte, +page.server.ts
- [x] API: +server.ts (jika ada)
- [x] Component: FeatureCard.svelte
- [x] Database: schema update, migration
```

**For Bug Fixes:**
```markdown
### Bug Fix: [Description] (Fixed: YYYY-MM-DD)
- [x] Identified root cause
- [x] Fixed in page/API
- [x] Tested and verified
```

---

## Quick Reference Files

- `workflow/PROGRESS.md` - Project progress tracking
- `workflow/TDD.md` - Technical design
- `workflow/ui-kit.html` - UI components reference
- `workflow/MANAGER_AGENT.md` - Project management workflow
- `AGENTS.md` - Starter kit documentation

---

## Example: Creating Post System

**Step 1: Check PROGRESS.md**
Find "Post system" in progress tracking.

**Step 2: Database Schema**
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

**Step 3: Generate Migration**
```bash
npm run db:generate
npm run db:migrate:local
```

**Step 4: Create Page with Server Load**
```typescript
// src/routes/posts/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { posts } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const allPosts = await locals.db.select().from(posts);
  return { posts: allPosts };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    const form = await request.formData();
    const id = form.get('id') as string;
    await locals.db.delete(posts).where(eq(posts.id, parseInt(id)));
    return { success: true };
  }
};
```

**Step 5: Create Page Component**
```svelte
<!-- src/routes/posts/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import { Plus, Trash2 } from 'lucide-svelte';
  
  let { data } = $props();
</script>

<div class="max-w-4xl mx-auto p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-neutral-100">Posts</h1>
    <a href="/posts/create" class="btn-primary">
      <Plus class="w-4 h-4" />
      New Post
    </a>
  </div>
  
  <div class="space-y-4">
    {#each data.posts as post}
      <div class="card">
        <h3 class="text-lg font-semibold text-neutral-100">{post.title}</h3>
        <p class="text-neutral-500 text-sm mt-1">{post.content}</p>
        <form method="POST" action="?/delete" use:enhance class="mt-4">
          <input type="hidden" name="id" value={post.id} />
          <button type="submit" class="text-rose-400 hover:text-rose-300">
            <Trash2 class="w-4 h-4" />
          </button>
        </form>
      </div>
    {/each}
  </div>
</div>
```

**Step 6: Update PROGRESS.md**
```markdown
### Posts
- [x] Pages: posts/+page.svelte, posts/+page.server.ts
- [x] Database: posts table, migration
- [x] Routes: GET /posts, POST /posts?/delete
```
