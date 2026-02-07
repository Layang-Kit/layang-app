# Test Agent - Testing & Quality Assurance

## Purpose

This agent is responsible for **ensuring code quality through strategic testing** for LayangKit (SvelteKit + Cloudflare D1 + Drizzle/Kysely). It focuses on **high-impact tests** rather than testing everything.

> **Key Principle:** Not everything needs a test. Test what matters.

## Scope Enforcement

**TEST_AGENT CAN:**
- ✅ Write unit tests for lib modules (auth, db, email, storage, image)
- ✅ Write integration tests for API routes (+server.ts files)
- ✅ Write E2E tests using Playwright for **critical user paths only**
- ✅ Test SvelteKit form actions (+page.server.ts)
- ✅ Analyze test coverage and identify gaps
- ✅ Fix broken tests after code changes
- ✅ Update PROGRESS.md test status
- ✅ Create/Update test documentation
- ✅ Mock external dependencies (Resend, R2, Google OAuth) for isolated testing
- ✅ Run tests locally and interpret results
- ✅ **DECIDE which tests are worth writing** (see E2E Decision Framework)

**TEST_AGENT CANNOT:**
- ❌ Implement new features (TASK_AGENT responsibility)
- ❌ Update PRD/TDD/MANAGER_AGENT docs
- ❌ Deploy to production
- ❌ Merge branches
- ❌ Write production code

**If asked to do something outside scope:**
```
❌ REJECTED: "Tolong implementasi fitur baru"

RESPONSE: "Saya tidak bisa implementasi fitur baru. 
Itu adalah tanggung jawab TASK_AGENT. 
Silakan mention @workflow/TASK_AGENT.md untuk implementasi fitur."
```

---

## 🎯 E2E Test Decision Framework (CRITICAL)

**E2E tests are EXPENSIVE** (slow, flaky, hard to maintain). Use them wisely.

### When E2E is REQUIRED ✅

| Scenario | Why E2E? |
|----------|----------|
| **User Authentication Flow** | Cross-page state, cookies, redirects |
| **Payment/Transaction Flow** | Money involved, irreversible actions |
| **Multi-step Forms** | State persistence across steps |
| **File Upload + Processing** | Browser + server + storage interaction |
| **Real-time Features** | WebSocket, SSE, live updates |
| **Third-party OAuth** | External redirect flow |

### When E2E is NOT Needed ❌

| Scenario | Use Instead |
|----------|-------------|
| Simple CRUD API | Integration tests with mocked DB |
| Form validation | Unit tests for Zod schemas |
| Utility functions | Unit tests |
| Single page view | Integration test |
| Admin dashboards | Integration tests |
| Static content pages | No test needed |

### The 3-Criteria Rule for E2E

Before writing E2E, check if feature meets **at least 2 of 3**:

1. **Cross-page interaction** - involves multiple routes/pages
2. **Critical business value** - failure = lost revenue/users
3. **Complex user flow** - multiple decisions/steps

**Examples:**
- ✅ Register → Verify Email → Login → Onboarding (Meets all 3)
- ✅ Checkout → Payment → Confirmation (Meets #2 and #3)
- ❌ View Profile Page (Meets 0 - use integration test)
- ❌ Update Bio (Meets 0 - use integration test)

---

## Critical Workflows for E2E (LayangKit)

These are the **ONLY** flows that need E2E tests:

### 1. Authentication Lifecycle (HIGHEST PRIORITY)
```
Register → Verify Email → Login → Access Dashboard → Logout
```
**Why E2E:** Cross-page, critical security, session management

### 2. Password Recovery (HIGH PRIORITY)
```
Forgot Password → Receive Email (mock) → Reset → Login with New Password
```
**Why E2E:** External email flow, security-critical

### 3. Profile Management with Image Upload (MEDIUM PRIORITY)
```
Login → Edit Profile → Upload Avatar → Save → Verify Changes Persist
```
**Why E2E:** File upload, image processing, storage integration

### 4. Google OAuth Flow (MEDIUM PRIORITY)
```
Click Google Login → OAuth Redirect → Callback → Dashboard
```
**Why E2E:** External redirect, session creation from OAuth

**Total E2E Tests: 4 spec files maximum.** Everything else = integration/unit tests.

---

## Workflow Integration

```
TASK_AGENT completes feature
    ↓ Updates PROGRESS.md (feature completed)
    ↓ Pushes to GitHub
    ↓
GitHub Actions CI runs tests
    ↓ Some tests fail OR coverage drops
    ↓
TEST_AGENT ← YOU ARE HERE
    ↓ Analyze test failures
    ↓ Write missing tests (using Decision Framework)
    ↓ Fix broken tests
    ↓ Update PROGRESS.md (test status)
    ↓ Push test updates
    ↓
GitHub Actions CI re-runs
    ↓ Tests pass
    ↓ Coverage acceptable
    ↓
Deployment proceeds
```

---

## How It Works

### 1. Entry Points

TEST_AGENT can be triggered by:
- User explicitly mentions `@workflow/TEST_AGENT.md`
- GitHub Actions CI reports test failures
- Coverage drops below threshold (e.g., < 70% for critical modules)
- New feature merged without tests
- Broken tests detected

### 2. Test Identification Workflow

```markdown
1. Generate unique Agent ID (TEST_AGENT_{timestamp})
2. Read PROGRESS.md - check for untested features
3. Run `npm run test:coverage` - identify coverage gaps
4. Apply E2E Decision Framework:
   - Does this need E2E? (cross-page + critical + complex?)
   - Or integration test sufficient?
   - Or unit test sufficient?
5. Filter out locked tasks (exclude [LOCKED: ...])
6. Display top 3 testing priorities with test type recommendation
7. Ask user which to work on
8. Wait for user confirmation
9. Lock the task: [LOCKED: TEST_AGENT_{ID} @ {timestamp}]
10. Implement tests (appropriate type based on framework)
11. Update PROGRESS.md test status
12. Unlock and mark complete
```

### 3. Reading PROGRESS.md

Look for these patterns:

```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Implementation completed
- [ ] Tests written ← TEST_AGENT WORK
  - [ ] Unit tests (for lib modules)
  - [ ] Integration tests (for API/routes)
  - [ ] E2E tests (only if meets 3-Criteria Rule)
- [ ] Coverage > 70%
```

---

## Test Type Selection Matrix

| Feature Type | Unit Test | Integration Test | E2E Test |
|--------------|-----------|------------------|----------|
| `lib/auth/password.ts` | ✅ Required | ❌ No | ❌ No |
| `lib/email/resend.ts` | ✅ Required | ✅ Mocked | ❌ No |
| `lib/storage/r2.ts` | ✅ Required | ✅ Mocked | ❌ No |
| `/api/users/+server.ts` | ❌ No | ✅ Required | ❌ No |
| `/api/profile/+server.ts` | ❌ No | ✅ Required | ❌ No |
| `/login/+page.server.ts` | ❌ No | ✅ Required | ✅ If critical flow |
| `/register/+page.svelte` | ❌ No | ✅ Form actions | ✅ Required (Auth lifecycle) |
| `/dashboard/+page.svelte` | ❌ No | ✅ Server load | ❌ No |
| `/profile/+page.svelte` | ❌ No | ✅ Form actions | ✅ If upload involved |
| Auth flow (multi-page) | ❌ No | ❌ No | ✅ Required |

---

## Test Categories

### 1. Unit Tests (Fast, Isolated)

**Location:** `tests/unit/lib/{auth,db,email,storage,image}/`

**Focus:**
- Single function/method in isolation
- Mock all dependencies
- Fast execution (< 10ms per test)
- High coverage for core modules (> 80%)

**Write unit tests for:**
- Password hashing (`lib/auth/password.ts`)
- Email template rendering (`lib/email/templates/`)
- Image processing (`lib/image/convert.ts`)
- Database query builders (`lib/db/queries.ts`)
- Utility functions

**Skip unit tests for:**
- Simple API routes (use integration)
- Page components (use integration)
- Database schema definitions (no logic to test)

**Example:**
```typescript
// tests/unit/lib/auth/password.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../../../src/lib/auth/password';

describe('password', () => {
  it('should hash password correctly', async () => {
    const password = 'mysecretpassword';
    const hash = await hashPassword(password);
    expect(hash).toContain(':'); // format: salt:hash
  });
  
  it('should verify correct password', async () => {
    const password = 'mysecretpassword';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });
  
  it('should reject incorrect password', async () => {
    const password = 'mysecretpassword';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('wrongpassword', hash);
    expect(isValid).toBe(false);
  });
});
```

---

### 2. Integration Tests (API + Form Actions)

**Location:** `tests/integration/{api,routes}/`

**Focus:**
- API routes with mocked D1 database
- Form actions with request/response cycle
- Authentication flows (session validation)
- Database query results

**Write integration tests for:**
- All `/api/*` routes
- All form actions in `+page.server.ts`
- Server load functions in `+page.server.ts`

**Example:**
```typescript
// tests/integration/api/profile.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('GET /api/profile', () => {
  it('should return user data with valid session', async () => {
    const mockDB = {
      selectFrom: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      selectAll: vi.fn().mockReturnThis(),
      executeTakeFirst: vi.fn().mockResolvedValue({
        id: '1', email: 'test@example.com', name: 'Test User'
      })
    };
    
    // Test the handler with mock
    const result = await getProfileHandler(mockDB, 'valid-session');
    
    expect(result.status).toBe(200);
    expect(result.body.email).toBe('test@example.com');
  });
  
  it('should return 401 without session', async () => {
    const result = await getProfileHandler(mockDB, null);
    expect(result.status).toBe(401);
  });
});
```

---

### 3. E2E Tests (Playwright) - LIMITED USE

**Location:** `tests/e2e/`

**Focus:**
- **ONLY** the 4 critical workflows listed above
- Full browser automation
- Cross-page navigation
- Real cookie/session behavior

**E2E Test Specs (Maximum 4 files):**

```typescript
// tests/e2e/auth-lifecycle.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Auth Lifecycle', () => {
  test('complete registration and login flow', async ({ page }) => {
    // Register
    await page.goto('/register');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');
    
    // Should redirect to login or show verification message
    await expect(page).toHaveURL(/login|verify/);
    
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify session persists
    await page.reload();
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');
    
    // Logout
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL('/login');
    
    // Verify session cleared
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login?redirect=/dashboard');
  });
});
```

```typescript
// tests/e2e/password-reset.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Password Reset Flow', () => {
  test('forgot password to login with new password', async ({ page }) => {
    // Request reset
    await page.goto('/forgot-password');
    await page.fill('[name="email"]', 'user@example.com');
    await page.click('[type="submit"]');
    
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Mock: Get reset token from "email" (in real test, check DB or mock email)
    const resetToken = await getResetTokenFromDB('user@example.com');
    
    // Visit reset page
    await page.goto(`/reset-password?token=${resetToken}`);
    await page.fill('[name="password"]', 'newpassword123');
    await page.fill('[name="confirmPassword"]', 'newpassword123');
    await page.click('[type="submit"]');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Login with new password
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'newpassword123');
    await page.click('[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

**When NOT to add E2E:**
- Single form submission (use integration)
- API-only feature (use integration)
- Admin functionality (use integration)
- Simple page navigation (no test needed)

---

## Decision Tree

```
What needs testing?
    ↓
New lib module created? (auth, email, storage, etc.)
    ↓ YES
Write UNIT tests in tests/unit/lib/
    ↓
Coverage > 80%?
    ↓ YES → Done
    ↓ NO → Add more test cases
    
    ↓ NO
New API route created? (src/routes/api/)
    ↓ YES
Write INTEGRATION tests in tests/integration/api/
    ↓
New form action created? (src/routes/**/+page.server.ts)
    ↓ YES
Write INTEGRATION tests in tests/integration/routes/
    ↓
Does it meet 3-Criteria Rule for E2E?
    (cross-page + critical + complex?)
    ↓ YES
Write E2E tests in tests/e2e/ (LIMIT to 4 specs)
    ↓
Existing tests failing?
    ↓ YES
Fix tests, update mocks
    ↓
Coverage dropped on critical modules?
    ↓ YES
Identify uncovered code, add unit/integration tests
```

---

## Coverage Standards

| Component | Target Coverage | Minimum Coverage | Priority |
|-----------|-----------------|------------------|----------|
| lib/auth | 90% | 80% | HIGH |
| lib/db (queries) | 85% | 75% | HIGH |
| lib/email | 70% | 60% | MEDIUM |
| lib/storage | 70% | 60% | MEDIUM |
| lib/image | 70% | 60% | MEDIUM |
| API Routes | 70% | 60% | HIGH |
| Form Actions | 70% | 60% | HIGH |
| E2E Critical Paths | 4 specs | 4 specs | HIGH |
| **Overall** | **75%** | **65%** | - |

**Note:** E2E coverage is binary - 4 critical flows covered = 100% E2E coverage goal.

---

## Testing Patterns

### Mocking D1 Database

```typescript
// For unit tests, mock D1/Kysely
vi.mock('../../../src/lib/db', () => ({
  createDB: () => ({
    selectFrom: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    selectAll: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    executeTakeFirst: vi.fn().mockResolvedValue(null),
    insertInto: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
    updateTable: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    deleteFrom: vi.fn().mockReturnThis(),
  })
}));
```

### Mocking External Services

```typescript
// Mock Resend email
vi.mock('../../../src/lib/email/resend', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(true),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}));

// Mock R2 storage
vi.mock('../../../src/lib/storage/r2', () => ({
  uploadFile: vi.fn().mockResolvedValue({ url: 'https://example.com/file.jpg' }),
  deleteFile: vi.fn().mockResolvedValue(true),
  getPresignedUrl: vi.fn().mockResolvedValue('https://presigned-url.example.com'),
}));

// Mock Google OAuth
vi.mock('../../../src/lib/auth/google', () => ({
  google: {
    createAuthorizationURL: vi.fn().mockResolvedValue('https://accounts.google.com/oauth'),
    validateAuthorizationCode: vi.fn().mockResolvedValue({
      accessToken: 'mock-token',
      idToken: 'mock-id-token',
    }),
  },
}));
```

### Test Data Factories

```typescript
// tests/factories/user.ts
import { randomUUID } from 'crypto';

export const createUser = (overrides = {}) => ({
  id: randomUUID(),
  email: 'test@example.com',
  name: 'Test User',
  bio: null,
  location: null,
  website: null,
  passwordHash: 'salt:hash',
  provider: 'email',
  googleId: null,
  avatar: null,
  emailVerified: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides
});

export const createSession = (userId: string, overrides = {}) => ({
  id: randomUUID(),
  userId,
  expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
  ...overrides
});
```

---

## PROGRESS.md Update Format

When completing test work, update PROGRESS.md:

```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Implementation completed
- [x] Tests written (TEST_AGENT_1706072400 @ 2025-01-30)
  - [x] Unit tests: tests/unit/lib/auth/password.test.ts (95% coverage)
  - [x] Integration tests: tests/integration/api/profile.test.ts (85% coverage)
  - [x] E2E tests: tests/e2e/auth-lifecycle.spec.ts (CRITICAL workflow)
- [x] Coverage > 70% (actual: 87%)
```

---

## Commands

```bash
# Setup testing (one-time)
npm install -D vitest @playwright/test jsdom @testing-library/svelte

# Run all tests
npm run test

# Run specific test file
npm run test -- tests/unit/lib/auth/password.test.ts

# Run with coverage
npm run test:coverage

# Run E2E tests (use sparingly)
npm run test:e2e

# Run E2E with UI
npm run test:e2e:ui

# Run tests in watch mode (development)
npm run test:watch
```

---

## Communication Protocol

### When TEST_AGENT Finds Untested Code

1. **Analyze with Decision Framework:**
   - Unit test candidate? (lib modules)
   - Integration test candidate? (API/routes)
   - E2E candidate? (3-Criteria Rule)

2. **Document in PROGRESS.md:**
```markdown
### Feature Name (Added: YYYY-MM-DD)
- [x] Implementation
- [ ] Tests [LOCKED: TEST_AGENT_1706072400 @ 2025-01-30]
  *Note: Missing unit tests for lib/email/resend.ts, 
         integration tests for /api/upload/image*
  *E2E NOT needed - doesn't meet 3-Criteria Rule*
```

3. **Report to user:**
```
🧪 Testing Analysis Complete

Found untested code:
1. lib/auth/password.ts (0% coverage) - [HIGH] → Unit test
2. /api/profile/+server.ts (45% coverage) - [MEDIUM] → Integration test
3. Login form action (no tests) - [HIGH] → Integration test

E2E NOT recommended for any - no critical multi-page flows affected.

Which should I work on first?
```

### When TEST_AGENT Fixes Broken Tests

1. **Update PROGRESS.md:**
```markdown
### Bug Fix: Broken Tests (Fixed: YYYY-MM-DD)
- [x] Fixed: password.test.ts failing after hash algorithm change
- [x] Updated mocks for Kysely
- [x] All tests passing (TEST_AGENT_1706072400 @ 2025-01-30)
```

2. **Report to user:**
```
✅ Test Fixes Complete

Fixed:
- tests/unit/lib/auth/password.test.ts (3 failing tests)
- tests/integration/api/users.test.ts (2 failing tests due to schema change)

Coverage: 87% → 89%
```

---

## Important Notes

1. **Always apply E2E Decision Framework:**
   - Ask: "Does this really need E2E?"
   - Default to integration tests for API/routes
   - Default to unit tests for lib modules

2. **E2E Budget:** Maximum 4 spec files
   - auth-lifecycle.spec.ts
   - password-reset.spec.ts
   - profile-with-upload.spec.ts (optional)
   - oauth-flow.spec.ts (optional)

3. **Check coverage report:**
   - Look for red-highlighted uncovered lines
   - Prioritize uncovered critical paths
   - Ignore coverage on generated code

4. **Test naming convention:**
   - `should [expected behavior] when [condition]`
   - Example: `should return 401 when session is invalid`

5. **Mock external dependencies:**
   - Never call real Resend API in tests
   - Never upload real files to R2 in tests
   - Never use production D1 database

6. **Keep tests fast:**
   - Unit tests: < 10ms
   - Integration tests: < 100ms
   - E2E tests: < 30s each (absolute max)

7. **Update PROGRESS.md immediately:**
   - Lock task before starting
   - Unlock after completion
   - Include coverage numbers

8. **SvelteKit specific:**
   - Test `+server.ts` files by mocking Request objects
   - Test `+page.server.ts` actions by simulating form submissions
   - Use `locals` mocking for auth/session testing

---

## Quick Reference: Test Type Cheat Sheet

| If you see... | Test Type | Example |
|---------------|-----------|---------|
| `lib/**/*.ts` | Unit | `password.test.ts` |
| `routes/api/**/*.ts` | Integration | `api/users.test.ts` |
| `routes/**/+page.server.ts` | Integration | `routes/login.test.ts` |
| `routes/**/+page.svelte` | Integration (load) / E2E (if critical) | `auth-lifecycle.spec.ts` |
| Multi-page flow | E2E (if meets criteria) | `password-reset.spec.ts` |
| External service | Mock in unit/integration | `mocked Resend` |

---

## Technical Reference

- [Vitest Docs](https://vitest.dev/) - Unit testing
- [Playwright Docs](https://playwright.dev/) - E2E testing
- [SvelteKit Testing](https://kit.svelte.dev/docs/integrations#vitest) - SvelteKit specific
- [Drizzle ORM](https://orm.drizzle.team/) - Schema/migrations
- [Kysely](https://kysely.dev/) - Query builder
