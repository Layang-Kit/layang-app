# Batch Task Agent - Execute All Tasks in One Shot (SvelteKit Cloudflare)

## Purpose

This agent is responsible for **executing ALL pending development tasks** from `workflow/PROGRESS.md` in a single continuous run. Unlike TASK_AGENT yang bekerja per task dan menunggu konfirmasi user, BATCH_TASK_AGENT mengerjakan semua task pending sekaligus tanpa stop.

**Use Case:**
- Bootstrap project dengan banyak fitur awal
- MVP development dengan deadline ketat
- Menyelesaikan backlog yang sudah jelas requirement-nya
- Build prototype dengan fitur lengkap sekaligus

---

## Scope Enforcement

**BATCH_TASK_AGENT CAN:**
- ✅ Read all pending tasks from PROGRESS.md
- ✅ Execute ALL pending tasks in sequence (1 shoot)
- ✅ Create feature branch automatically
- ✅ Implement features (pages, API routes, components)
- ✅ Run database migrations
- ✅ Update PROGRESS.md after each task completion
- ✅ Commit ALL changes after all tasks completed
- ✅ Push changes to trigger CI/CD
- ✅ Report progress summary di akhir

**BATCH_TASK_AGENT CANNOT:**
- ❌ Stop untuk konfirmasi user di tengah proses
- ❌ Update PRD.md atau TDD.md
- ❌ Create release notes
- ❌ Approve deployment
- ❌ Deploy to production
- ❌ Merge branches
- ❌ Menambah task baru ke PROGRESS.md

---

## Commit Strategies

### Mode A: Atomic Commits (Recommended ✅)
**Commit per task/feature**

```
feat: add user authentication [BATCH_AGENT_20250203_201500]
feat: setup database schema [BATCH_AGENT_20250203_201500]
feat: create dashboard page [BATCH_AGENT_20250203_201500]
feat: implement profile page [BATCH_AGENT_20250203_201500]
```

**Advantages:**
- ✅ **Easier code review** - Reviewer bisa fokus per fitur
- ✅ **Selective rollback** - Revert satu fitur tanpa affect lainnya
- ✅ **Clean history** - Setiap commit = satu fitur lengkap
- ✅ **Better bisect** - Debug easier dengan git bisect
- ✅ **Safer deployment** - Kalau ada issue, tahu fitur mana yang bermasalah

**Use when:**
- Team collaboration (ada code review)
- Production projects
- Complex features yang perlu isolation
- Open source projects

### Mode B: Single Batch Commit
**Satu commit besar di akhir**

```
feat: implement batch tasks [BATCH_AGENT_20250203_201500]
- User authentication system
- Database schema setup  
- Dashboard page
- Profile page
- API routes
```

**Advantages:**
- ✅ **Faster execution** - No commit overhead
- ✅ **Simple history** - Hanya 1 commit untuk semua
- ✅ **Good for MVP** - Rapid prototyping
- ✅ **Less noise** - Tidak spam commit history

**Use when:**
- Solo projects / personal development
- MVP / prototype phase
- Initial project setup
- Semua fitur saling dependent (tidak bisa dipisah)

### Recommendation
**Default: Mode A (Atomic)** - Meskipun agak lebih lambat, atomic commits jauh lebih maintainable untuk jangka panjang. Mode B hanya untuk kasus khusus seperti MVP atau prototype.

---

## Execution Strategy

### Phase 1: Discovery & Planning
```
1. Generate Agent ID: BATCH_AGENT_YYYYMMDD_HHMMSS
2. Read PROGRESS.md → Identify ALL pending tasks
3. Read TDD.md → Understand technical requirements
4. Check existing code structure
5. Create execution plan (task queue)
6. Lock ALL pending tasks: [LOCKED: BATCH_AGENT_xxx]
7. Auto-create feature branch: feature/batch-{timestamp}
```

### Phase 2: Sequential Execution
```
For each task in queue:
    ├── Analyze task requirements
    ├── Check dependencies (DB schema, components, etc.)
    ├── Implement backend (API/Server Load/Form Actions)
    ├── Implement frontend (Page/Component)
    ├── Update database if needed
    ├── Mark task [x] completed in PROGRESS.md
    └── Log progress
```

### Phase 3: Finalization (Two Commit Modes)

#### Mode A: Atomic Commits (Recommended for Review)
```
1. Commit per task during execution
2. Each commit: "feat: [feature-name] [BATCH_AGENT_xxx]"
3. Push after each commit (optional)
4. Final type check & build
5. Generate execution summary
```

#### Mode B: Single Batch Commit (For MVP Speed)
```
1. Run type check: npm run check
2. Run build test: npm run build
3. Commit ALL changes: "feat: implement batch tasks [BATCH_AGENT_xxx]"
4. Push to origin
5. Generate execution summary report
6. Unlock all tasks (remove [LOCKED: ...])
```

**Default: Mode A (Atomic)** - Kecuali user minta Mode B

---

## How It Works

### 1. User Triggers Agent

```
# Mode Atomic (Default) - Commit per fitur
User: "@workflow/BATCH_TASK_AGENT.md, execute all pending tasks"

# Mode Batch - Single commit di akhir
User: "@workflow/BATCH_TASK_AGENT.md, execute all pending tasks with batch commit"
```

Agent akan:
1. Generate unique Batch Agent ID
2. **Tampilkan summary** semua pending tasks yang akan dikerjakan
3. **Tanya commit mode**: "Use atomic commits (per feature) or batch commit (single)?"
4. **Tanya konfirmasi SEKALI**: "Proceed with all {N} tasks? (yes/no)"
5. Jika yes → Execute semua tanpa berhenti
6. Jika no → Cancel

### 2. Task Discovery

```typescript
// Pseudo-code untuk task discovery
const pendingTasks = parseProgressMD()
  .filter(task => task.status === 'pending')
  .filter(task => !task.locked)
  .sort((a, b) => priorityWeight(b) - priorityWeight(a));

console.log(`Found ${pendingTasks.length} pending tasks:`);
pendingTasks.forEach((task, i) => {
  console.log(`${i+1}. [${task.priority}] ${task.name}`);
});
```

### 3. Execution Queue

Tasks dieksekusi berurutan berdasarkan priority:
1. **HIGH priority** first
2. **Database migrations** first (dependencies)
3. **Shared components** first (dependencies)
4. **MEDIUM priority** next
5. **LOW priority** last

### 4. Continuous Execution Mode

Agent akan:
- **TIDAK berhenti** untuk konfirmasi di tengah
- **Auto-fix** error kecil (typo, import missing)
- **Skip** task yang blocked oleh dependency
- **Log** setiap action yang dilakukan
- **Report** progress setiap 25%

---

## Execution Report Format

### Real-time Progress Update

```
[BATCH_AGENT_20250203_201500] Starting batch execution...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TASK QUEUE (7 tasks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1/7] [HIGH] User Authentication System
[2/7] [HIGH] Database Schema Setup  
[3/7] [MEDIUM] Dashboard Page
[4/7] [MEDIUM] User Profile Page
[5/7] [MEDIUM] API Routes
[6/7] [LOW] Email Notifications
[7/7] [LOW] Analytics Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 EXECUTING TASK 1/7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Creating database schema...
→ Generating migration...
→ Creating auth pages...
→ Creating API routes...
→ Testing build...
✅ Task 1 completed (3m 45s)

[25%] ████░░░░░░░░░░░░░░░░ 2/7 tasks done
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ BATCH EXECUTION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tasks: 7
Completed: 7
Skipped: 0
Failed: 0
Total Time: 18m 32s

Files Created: 24
Files Modified: 3
Database Migrations: 2

Commit: feat: implement batch tasks [BATCH_AGENT_20250203_201500]
Branch: feature/batch-20250203-201500
```

---

## Implementation Checklist (Per Task)

Sama dengan TASK_AGENT, tapi dijalankan otomatis:

### Backend
- [ ] Create `+page.server.ts` (Server Load / Form Actions)
- [ ] Create `+server.ts` (API Routes jika diperlukan)
- [ ] Implement validation (Zod)
- [ ] Database operations via `locals.db`

### Frontend
- [ ] Create `+page.svelte`
- [ ] Use Svelte 5 runes (`$state`, `$props`, `$derived`)
- [ ] Use `enhance` untuk forms
- [ ] Match UI kit dari `workflow/ui-kit.html`

### Database
- [ ] Update `src/lib/db/schema.ts` jika perlu
- [ ] Generate migration: `npm run db:generate`
- [ ] Apply migration: `npm run db:migrate:local`

### Progress
- [ ] Mark task `[x] completed` di PROGRESS.md
- [ ] Add completion timestamp
- [ ] **Atomic mode**: Commit task dengan message deskriptif

---

## Error Handling Strategy

### Auto-Fixable Errors
Agent akan otomatis fix:
- Missing imports
- Typo dalam nama variabel
- Formatting issues
- Missing type annotations

### Skip & Continue
Agent akan skip task jika:
- Dependency belum tersedia (mark as blocked)
- Requirement ambigu (log warning)
- File sudah exists dan tidak perlu modifikasi

### Hard Fail (Stop Execution)
Agent akan stop jika:
- Database connection fail
- Build error yang tidak bisa di-fix
- Syntax error kritis
- Permission denied

---

## Decision Tree

```
User mentions @workflow/BATCH_TASK_AGENT.md
    ↓
Generate Batch Agent ID
    ↓
Read PROGRESS.md → List ALL pending tasks
    ↓
Display summary & ask ONCE: "Proceed? (yes/no)"
    ↓
User confirms YES
    ↓
Lock ALL pending tasks
    ↓
Create feature branch: feature/batch-{timestamp}
    ↓
FOR EACH task in priority order:
    ├── Analyze requirements
    ├── Check dependencies
    ├── Implement feature
    ├── Update PROGRESS.md
    └── Log progress
    ↓
Final checks (type check, build)
    ↓
Commit ALL changes
    ↓
Push to origin
    ↓
Generate execution summary
    ↓
Report completion to user
```

---

## SvelteKit Patterns (Same as TASK_AGENT)

### Pattern 1: Server Load (GET)
```typescript
export const load: PageServerLoad = async ({ locals }) => {
  const data = await locals.db
    .selectFrom('users')
    .selectAll()
    .execute();
  return { data };
};
```

### Pattern 2: Form Actions (POST/PUT/DELETE)
```typescript
export const actions: Actions = {
  actionName: async ({ request, locals }) => {
    const form = await request.formData();
    // validate, process, return
  }
};
```

### Pattern 3: API Routes (JSON)
```typescript
export const GET: RequestHandler = async ({ locals }) => {
  return json(data);
};
```

---

## UI Kit Consistency

Refer to `workflow/ui-kit.html`:
- Background: `bg-neutral-950`
- Surface: `bg-neutral-900`
- Cards: `bg-neutral-900/50` with `border-neutral-800`
- Primary: `text-accent-500` (amber)
- Success: `text-emerald-400`
- Error: `text-rose-400`
- Text Primary: `text-neutral-100`
- Text Secondary: `text-neutral-500`

---

## Task Locking Format

```markdown
### Feature Name
- [ ] Task 1 [LOCKED: BATCH_AGENT_20250203_201500]
- [ ] Task 2 [LOCKED: BATCH_AGENT_20250203_201500]
- [ ] Task 3 [LOCKED: BATCH_AGENT_20250203_201500]
```

Remove `[LOCKED: ...]` dan ganti dengan `[x]` setelah selesai.

---

## Communication Pattern

### Start
```
🔥 BATCH TASK AGENT ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agent ID: BATCH_AGENT_20250203_201500
Pending Tasks: 7
Estimated Time: ~20 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 TASKS TO EXECUTE:
1. [HIGH] User Authentication
2. [HIGH] Database Setup
3. [MEDIUM] Dashboard
...

⚠️  This will execute ALL tasks without stopping.
Type "yes" to proceed or "no" to cancel.
```

### During Execution
```
[45%] ████████░░░░░░░░░░░░ Task 3/7: Dashboard
→ Creating +page.server.ts...
→ Creating +page.svelte...
✅ Task completed (2m 12s)
```

### Completion
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ BATCH EXECUTION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY:
• Total Tasks: 7
• Completed: 7 ✅
• Failed: 0 ❌
• Skipped: 0 ⏭️
• Total Time: 18m 45s

📁 FILES CREATED:
• src/routes/auth/+page.svelte
• src/routes/auth/+page.server.ts
• src/lib/components/UserCard.svelte
• ... (24 files total)

🗄️  DATABASE:
• Migrations: 2
• Schema updates: 3 tables

💾 GIT:
• Branch: feature/batch-20250203-201500
• Commit: feat: implement batch tasks [BATCH_AGENT_20250203_201500]
• Status: Pushed to origin ✅

Next: Review changes in GitHub and create PR.
```

---

## Important Notes

1. **Server is already running** - Do NOT run `npm run dev`
2. **Check existing files first** - Avoid overwriting
3. **Follow SvelteKit patterns** - Server Load untuk GET, Form Actions untuk POST
4. **Match UI kit exactly** - Use colors, spacing dari ui-kit.html
5. **Database migrations** - Generate dan apply setelah schema changes
6. **Default: Atomic commits** - Commit per task (recommended)
7. **Type check before commit** - Pastikan build sukses
8. **Push triggers CI/CD** - GitHub Actions akan deploy otomatis
9. **Choose commit mode wisely** - Atomic untuk production, Batch untuk MVP

---

## Comparison: TASK_AGENT vs BATCH_TASK_AGENT

| Feature | TASK_AGENT | BATCH_TASK_AGENT |
|---------|------------|------------------|
| Execution | Per task | All tasks at once |
| User confirmation | Per task | Once at start |
| Stopping | Yes, waits for user | No continuous |
| Best for | Incremental updates | MVP, initial build |
| Commit frequency | Per task | **Configurable: Atomic or Batch** |
| Error handling | Ask user | Auto-fix or skip |
| Time estimate | Variable | ~20-30 min for 7 tasks |

### Commit Mode Comparison

| Aspect | Atomic (Per Task) | Batch (Single) |
|--------|-------------------|----------------|
| Code Review | ✅ Easy per feature | ❌ Hard (too big) |
| Rollback | ✅ Selective | ❌ All or nothing |
| History | ✅ Clean | ⚠️ Single large commit |
| Speed | ⚠️ Slower (commit overhead) | ✅ Fastest |
| Best for | Team/Production | Solo/MVP |

---

## Quick Reference

- `workflow/PROGRESS.md` - Task list
- `workflow/TDD.md` - Technical specs
- `workflow/ui-kit.html` - UI reference
- `workflow/TASK_AGENT.md` - Single task mode
- `AGENTS.md` - Starter kit docs
