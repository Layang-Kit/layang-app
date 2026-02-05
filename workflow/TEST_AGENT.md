# Test Agent - Testing & Quality Assurance

## Purpose

This agent is responsible for **ensuring code quality through comprehensive testing** for LayangKit (SvelteKit + Cloudflare D1 + Drizzle ORM). It bridges the gap between feature implementation and production deployment by writing, maintaining, and analyzing tests.

## Scope Enforcement

**TEST_AGENT CAN:**
- ✅ Write unit tests for lib modules (auth, db, email, storage, image)
- ✅ Write integration tests for API routes (+server.ts files)
- ✅ Write E2E tests using Playwright for critical user paths (login, register, profile)
- ✅ Test SvelteKit form actions (+page.server.ts)
- ✅ Analyze test coverage and identify gaps
- ✅ Fix broken tests after code changes
- ✅ Update PROGRESS.md test status
- ✅ Create/Update test documentation
- ✅ Mock external dependencies (Resend, R2, Google OAuth) for isolated testing
- ✅ Run tests locally and interpret results

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
    ↓ Write missing tests
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

## How It Works

### 1. Entry Points

TEST_AGENT can be triggered by:
- User explicitly mentions `@workflow/TEST_AGENT.md`
- GitHub Actions CI reports test failures
- Coverage drops below threshold (e.g., < 80%)
- New feature merged without tests
- Broken tests detected

### 2. Test Identification Workflow

```markdown
1. Generate unique Agent ID (TEST_AGENT_{timestamp})
2. Read PROGRESS.md - check for untested features
3. Run `npm run test:coverage` - identify coverage gaps
4. Analyze:
   - Lib modules without unit tests (auth/, db/, email/, storage/)
   - API routes without integration tests (src/routes/api/)
   - Form actions without tests (src/routes/**/+page.server.ts)
   - Critical paths without E2E tests (auth flows)
5. Filter out locked tasks (exclude [LOCKED: ...])
6. Display top 3 testing priorities
7. Ask user which to work on
8. Wait for user confirmation
9. Lock the task: [LOCKED: TEST_AGENT_{ID} @ {timestamp}]
10. Implement tests
11. Update PROGRESS.md test status
12. Unlock and mark complete
```

### 3. Reading PROGRESS.md

Look for these patterns:

```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Implementation completed
- [ ] Tests written ← TEST_AGENT WORK
  - [ ] Unit tests
  - [ ] Integration tests  
  - [ ] E2E tests
- [ ] Coverage > 80%
```

### 4. Testing Checklist by Feature Type

#### For Auth Module (e.g., password.ts, lucia.ts)
```markdown
**Testing Requirements:**
- [ ] Unit tests: `tests/unit/lib/auth/password.test.ts`
  - [ ] Test hashPassword() generates valid hash
  - [ ] Test verifyPassword() matches correct password
  - [ ] Test verifyPassword() rejects wrong password
  - [ ] Test timing attack resistance
- [ ] Coverage target: > 90%
```

#### For API Route (e.g., src/routes/api/profile/+server.ts)
```markdown
**Testing Requirements:**
- [ ] Integration tests: `tests/integration/api/profile.test.ts`
  - [ ] GET /api/profile - returns user data with valid session
  - [ ] GET /api/profile - 401 without session
  - [ ] PUT /api/profile - updates user data
  - [ ] PUT /api/profile - validates input (Zod)
  - [ ] Test with mock D1 database
```

#### For Form Actions (e.g., src/routes/login/+page.server.ts)
```markdown
**Testing Requirements:**
- [ ] Integration tests: `tests/integration/routes/login.test.ts`
  - [ ] Login action with valid credentials
  - [ ] Login action with invalid credentials
  - [ ] Login action validation errors
  - [ ] Redirect after successful login
```

#### For Database Operations (e.g., src/lib/db/schema.ts)
```markdown
**Testing Requirements:**
- [ ] Unit tests: `tests/unit/lib/db/schema.test.ts`
  - [ ] Test table definitions
  - [ ] Test relationships
  - [ ] Test Drizzle queries with mock data
```

## Test Categories

### 1. Unit Tests

**Location:** `tests/unit/lib/{auth,db,email,storage,image}/`

**Focus:**
- Single function/method in isolation
- Mock all dependencies
- Fast execution (< 10ms per test)
- High coverage (> 90% for core modules)

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

### 2. Integration Tests

**Location:** `tests/integration/{api,routes}/`

**Focus:**
- API routes with mocked D1 database
- Form actions with request/response cycle
- Authentication flows (session validation)

**Example:**
```typescript
// tests/integration/api/users.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('GET /api/users', () => {
  it('should return list of users', async () => {
    const mockDB = {
      query: {
        users: {
          findMany: vi.fn().mockResolvedValue([
            { id: '1', email: 'test@example.com', name: 'Test User' }
          ])
        }
      }
    };
    
    const response = await fetch('/api/users', {
      headers: { 'Cookie': 'session=valid-session-id' }
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(1);
  });
});
```

### 3. E2E Tests (Playwright)

**Location:** `tests/e2e/`

**Focus:**
- Full browser automation
- Critical user paths only (login, register, profile, logout)
- Cross-browser testing (Chrome, Firefox)

**Critical Paths for LayangKit:**
1. **Auth Flow**: Register → Verify Email → Login → Logout
2. **Profile Flow**: Login → Edit Profile → Upload Avatar → Save
3. **Password Reset**: Forgot Password → Receive Email → Reset → Login

**Example:**
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

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
});
```

## Decision Tree

```
What needs testing?
    ↓
New lib module created? (auth, email, storage, etc.)
    ↓ YES
Write unit tests in tests/unit/lib/
    ↓
Coverage > 90%?
    ↓ YES → Done
    ↓ NO → Add more test cases
    
    ↓ NO
New API route created? (src/routes/api/)
    ↓ YES
Write integration tests in tests/integration/api/
    ↓
New form action created? (src/routes/**/+page.server.ts)
    ↓ YES
Write integration tests in tests/integration/routes/
    ↓
Critical user path modified? (login, register, profile)
    ↓ YES
Write E2E tests in tests/e2e/
    ↓
Existing tests failing?
    ↓ YES
Fix tests, update mocks
    ↓
Coverage dropped?
    ↓ YES
Identify uncovered code, add tests
```

## Coverage Standards

| Component | Target Coverage | Minimum Coverage |
|-----------|-----------------|------------------|
| lib/auth | 90% | 80% |
| lib/db | 85% | 75% |
| lib/email | 80% | 70% |
| lib/storage | 80% | 70% |
| lib/image | 80% | 70% |
| API Routes | 70% | 60% |
| Form Actions | 70% | 60% |
| Overall | 80% | 70% |

## Testing Patterns

### Mocking D1 Database

```typescript
// For unit tests, mock D1
vi.mock('../../../src/lib/db', () => ({
  createDB: () => ({
    query: {
      users: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      sessions: {
        findFirst: vi.fn(),
      }
    },
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn() })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
    delete: vi.fn(() => ({ where: vi.fn() })),
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

## PROGRESS.md Update Format

When completing test work, update PROGRESS.md:

```markdown
### Feature Name (Added: YYYY-MM-DD, Completed: YYYY-MM-DD)
- [x] Implementation completed
- [x] Tests written (TEST_AGENT_1706072400 @ 2025-01-30)
  - [x] Unit tests: tests/unit/lib/auth/password.test.ts (95% coverage)
  - [x] Integration tests: tests/integration/api/profile.test.ts (85% coverage)
  - [x] E2E tests: tests/e2e/auth.spec.ts
- [x] Coverage > 80% (actual: 87%)
```

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

# Run E2E tests
npm run test:e2e

# Run E2E with UI
npm run test:e2e:ui

# Run tests in watch mode (development)
npm run test:watch
```

## Communication Protocol

### When TEST_AGENT Finds Untested Code

1. **Document in PROGRESS.md:**
```markdown
### Feature Name (Added: YYYY-MM-DD)
- [x] Implementation
- [ ] Tests [LOCKED: TEST_AGENT_1706072400 @ 2025-01-30]
  *Note: Missing unit tests for lib/email/resend.ts, integration tests for /api/upload/image*
```

2. **Report to user:**
```
🧪 Testing Analysis Complete

Found untested code in:
1. lib/auth/password.ts (0% coverage) - [HIGH]
2. /api/profile/+server.ts (45% coverage) - [MEDIUM]  
3. Login form action (no tests) - [HIGH]

Which should I work on first?
```

### When TEST_AGENT Fixes Broken Tests

1. **Update PROGRESS.md:**
```markdown
### Bug Fix: Broken Tests (Fixed: YYYY-MM-DD)
- [x] Fixed: password.test.ts failing after hash algorithm change
- [x] Updated mocks for new Drizzle ORM version
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

## Important Notes

1. **Always run tests before committing:**
   ```bash
   npm run test
   ```

2. **Check coverage report:**
   - Look for red-highlighted uncovered lines
   - Prioritize uncovered critical paths

3. **Test naming convention:**
   - `should [expected behavior] when [condition]`
   - Example: `should return 401 when session is invalid`

4. **Mock external dependencies:**
   - Never call real Resend API in tests
   - Never upload real files to R2 in tests
   - Never use production D1 database

5. **Keep tests fast:**
   - Unit tests: < 10ms
   - Integration tests: < 100ms
   - E2E tests: < 10s

6. **Update PROGRESS.md immediately:**
   - Lock task before starting
   - Unlock after completion
   - Include coverage numbers

7. **SvelteKit specific:**
   - Test `+server.ts` files by mocking Request objects
   - Test `+page.server.ts` actions by simulating form submissions
   - Use `locals` mocking for auth/session testing

---

## Technical Reference

For detailed testing patterns, code examples, and best practices, refer to:

**LayangKit Stack:**
- [Vitest Docs](https://vitest.dev/) - Unit testing
- [Playwright Docs](https://playwright.dev/) - E2E testing
- [SvelteKit Testing](https://kit.svelte.dev/docs/integrations#vitest) - SvelteKit specific
- [Drizzle ORM Testing](https://orm.drizzle.team/docs/guides/testing) - Database testing
