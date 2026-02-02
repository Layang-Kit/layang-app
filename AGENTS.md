# AGENTS.md - SvelteKit + Cloudflare D1 + Drizzle ORM Boilerplate

## Project Overview

This is a full-stack edge-ready boilerplate application built with:

- **SvelteKit** - Full-stack framework with file-based routing
- **Cloudflare D1** - SQLite edge database running on Cloudflare's edge network
- **Drizzle ORM** - Type-safe SQL-like ORM for database operations
- **Lucia Auth** - Session-based authentication with Google OAuth
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

The application provides a complete authentication system with user management, demonstrating best practices for SvelteKit data loading patterns.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | SvelteKit 2.x |
| UI Library | Svelte 4.x |
| Styling | Tailwind CSS 3.4 (Custom "Dark Elegance" theme) |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM 0.29 |
| Auth | Lucia Auth 3.x + Arctic |
| Password Hashing | Web Crypto API (PBKDF2) |
| Email | Resend |
| Storage | Cloudflare R2 |
| Image Processing | Canvas API (WebP conversion) |
| Build Tool | Vite 5.x |
| Adapter | @sveltejs/adapter-cloudflare |
| Deployment | Cloudflare Pages |

## Project Structure

```
.
├── src/
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── lucia.ts           # Lucia auth configuration
│   │   │   ├── google.ts          # Google OAuth setup
│   │   │   └── password.ts        # Web Crypto password hashing
│   │   ├── db/
│   │   ├── email/
│   │   │   ├── resend.ts          # Resend email client
│   │   │   └── templates/         # Email templates
│   │   ├── image/
│   │   │   └── convert.ts         # Image processing (WebP)
│   │   └── storage/
│   │       └── r2.ts              # Cloudflare R2 client
│   │       ├── schema.ts          # Database schema (users, posts, sessions, tokens)
│   │       ├── index.ts           # DB client factory function
│   │       └── types.ts           # TypeScript type definitions
│   ├── routes/
│   │   ├── (examples)/            # Example patterns (group route)
│   │   │   ├── server-load-example/     # Server Load pattern demo
│   │   │   └── form-actions-example/    # Form Actions pattern demo
│   │   ├── api/
│   │   │   ├── health/            # Health check endpoint
│   │   │   ├── profile/           # Profile API (GET/PUT)
│   │   │   └── users/             # Users CRUD API
│   │   ├── auth/
│   │   │   ├── forgot-password/   # Forgot password API
│   │   │   ├── google/            # Google OAuth endpoints
│   │   │   ├── login/             # Login API
│   │   │   ├── logout/            # Logout API
│   │   │   ├── register/          # Register API
│   │   │   └── reset-password/    # Reset password API
│   │   ├── dashboard/             # Dashboard page (protected)
│   │   ├── forgot-password/       # Forgot password page
│   │   ├── login/                 # Login page
│   │   ├── profile/               # Profile page (protected)
│   │   ├── register/              # Register page
│   │   ├── reset-password/        # Reset password page
│   │   ├── +layout.svelte         # Root layout with navigation
│   │   └── +page.svelte           # Home page
│   ├── app.d.ts                   # App type declarations
│   ├── app.html                   # HTML template (dark theme)
│   ├── app.css                    # Global styles (Tailwind)
│   └── hooks.server.ts            # Server hooks (DB + Auth injection)
├── drizzle/                       # Database migrations
│   ├── 0000_initial.sql           # Initial schema
│   ├── 0001_auth.sql              # Auth schema (users, sessions, tokens)
│   └── seed.sql                   # Seed data
├── scripts/
│   └── seed.ts                    # TypeScript seed script
├── SVELTEKIT_DATA_PATTERNS.md     # Documentation for data patterns
├── svelte.config.js               # SvelteKit configuration
├── vite.config.ts                 # Vite configuration
├── drizzle.config.ts              # Drizzle Kit configuration
├── wrangler.toml                  # Cloudflare Wrangler configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

## Database Schema

### users
- `id` - TEXT PRIMARY KEY (UUID)
- `email` - TEXT NOT NULL UNIQUE
- `name` - TEXT NOT NULL
- `bio` - TEXT (optional)
- `location` - TEXT (optional)
- `website` - TEXT (optional)
- `password_hash` - TEXT (null for OAuth users)
- `provider` - TEXT ('email' | 'google')
- `google_id` - TEXT UNIQUE (for Google OAuth)
- `avatar` - TEXT (profile picture URL)
- `email_verified` - INTEGER (boolean)
- `created_at` - INTEGER (timestamp)
- `updated_at` - INTEGER (timestamp)

### sessions (Lucia Auth)
- `id` - TEXT PRIMARY KEY
- `user_id` - TEXT NOT NULL (FK to users.id)
- `expires_at` - INTEGER (timestamp)

### password_reset_tokens
- `id` - TEXT PRIMARY KEY
- `user_id` - TEXT NOT NULL (FK to users.id)
- `token_hash` - TEXT NOT NULL
- `expires_at` - INTEGER (timestamp)
- `used` - INTEGER (boolean)
- `created_at` - INTEGER (timestamp)

### email_verification_tokens
- `id` - TEXT PRIMARY KEY
- `user_id` - TEXT NOT NULL (FK to users.id)
- `token_hash` - TEXT NOT NULL
- `expires_at` - INTEGER (timestamp)
- `used` - INTEGER (boolean)
- `created_at` - INTEGER (timestamp)

### posts
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `title` - TEXT NOT NULL
- `content` - TEXT
- `published` - INTEGER (boolean)
- `author_id` - TEXT (FK to users.id)
- `created_at` - INTEGER (timestamp)
- `updated_at` - INTEGER (timestamp)

## Build and Development Commands

```bash
# Development
npm run dev                    # Start development server

# Building
npm run build                  # Build for production
npm run check                  # Type-check with svelte-check

# Preview & Deploy
npm run preview                # Preview production build locally
npm run deploy                 # Deploy to Cloudflare Pages

# Database Operations
npm run db:generate            # Generate Drizzle migration
npm run db:migrate             # Apply migrations to remote D1
npm run db:migrate:local       # Apply migrations to local D1
npm run db:seed                # Seed database via HTTP API
npm run db:seed:local          # Execute seed.sql locally
npm run db:studio              # Open Drizzle Studio GUI
npm run cf:typegen             # Generate Cloudflare Workers types
```

## Environment Configuration

Create a `.env` file from `.env.example`:

```bash
# Required for Drizzle Kit CLI
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token

# Optional - for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional - for Email Verification (Resend)
RESEND_API_TOKEN=re_your_api_token
FROM_EMAIL=noreply@yourdomain.com

# Optional - for File/Image Uploads (Cloudflare R2)
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-yourid.r2.dev
```

**API Token Requirements:**
- Account: D1:Edit, Cloudflare Pages:Edit
- Zone: Read

## Pages & Routes

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/login` | Login (email + Google OAuth) |
| `/register` | Register new account |
| `/forgot-password` | Request password reset |
| `/reset-password` | Reset password with token |

### Protected Pages (Require Auth)
| Route | Description |
|-------|-------------|
| `/dashboard` | User dashboard with stats |
| `/profile` | Edit profile, change password |

### Example Pages (Documentation)
| Route | Description |
|-------|-------------|
| `/server-load-example` | Demo: Server Load pattern |
| `/form-actions-example` | Demo: Form Actions pattern |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register with email/password (sends verification email) |
| POST | `/auth/login` | Login with email/password (requires verified email) |
| POST | `/auth/logout` | Logout current session |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| POST | `/auth/forgot-password` | Request reset token |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/verify-email` | Verify email with token |
| POST | `/auth/resend-verification` | Resend verification email |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user profile |
| PUT | `/api/profile` | Update profile |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create new user |
| GET | `/api/users/[id]` | Get user by ID |
| DELETE | `/api/users/[id]` | Delete user |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/presign` | Get presigned URL for direct R2 upload (files) |
| POST | `/api/upload/image` | Upload image → convert to WebP → store in R2 |
| DELETE | `/api/upload/image` | Delete image from R2 |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with DB status |

## SvelteKit Data Patterns

This project demonstrates the **recommended patterns** for SvelteKit data loading:

### 1. Server Load (for GET requests)

Use `+page.server.ts` `load()` function instead of API + fetch:

```typescript
// routes/dashboard/+page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  // Query directly from server - no API needed!
  const users = await locals.db.query.users.findMany();
  return { users };
};
```

```svelte
<!-- routes/dashboard/+page.svelte -->
<script>
  export let data; // Data auto-populated from load()
</script>

{#each data.users as user}
  <UserCard {user} />
{/each}
```

**Benefits:**
- ✅ 1 request only (server renders HTML with data)
- ✅ SEO friendly
- ✅ No loading states needed
- ✅ Type-safe

### 2. Form Actions (for POST/PUT/DELETE)

Use `+page.server.ts` `actions` instead of API endpoints:

```typescript
// routes/register/+page.server.ts
export const actions: Actions = {
  register: async ({ request, locals }) => {
    const form = await request.formData();
    // Validate, process, return result
    return { success: true };
  }
};
```

```svelte
<!-- routes/register/+page.svelte -->
<form method="POST" action="?/register">
  <input name="email" />
  <button type="submit">Register</button>
</form>
```

**Benefits:**
- ✅ Works without JavaScript!
- ✅ No API endpoint needed
- ✅ Progressive enhancement with `use:enhance`

See `SVELTEKIT_DATA_PATTERNS.md` for detailed documentation.

## Key Architectural Patterns

### Authentication Flow

1. **Registration/Login**: Form submits to `actions` → Create session → Set cookie
2. **Session Validation**: `hooks.server.ts` validates session on every request
3. **Protected Routes**: Check `locals.user` in `load()` or page
4. **Logout**: Invalidate session + clear cookie

### Database Access Pattern

Database is accessed through SvelteKit's `locals` object:

```typescript
// src/hooks.server.ts
export const handle: Handle = async ({ event, resolve }) => {
  // Inject DB
  if (event.platform?.env.DB) {
    event.locals.db = drizzle(event.platform.env.DB, { schema });
  }
  
  // Inject Auth (Lucia)
  const adapter = createAuthAdapter(event.platform.env.DB);
  const lucia = createLucia(adapter);
  // ... validate session
  
  return resolve(event);
};
```

### Password Hashing

Using Web Crypto API (Cloudflare Workers compatible):

```typescript
// src/lib/auth/password.ts
export async function hashPassword(password: string): Promise<string> {
  // PBKDF2 with SHA-256
  // 100,000 iterations
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Constant-time comparison
}
```

## UI/UX Conventions

- **Theme**: Dark mode only (Dark Elegance)
- **Color Scheme**: 
  - Background: `bg-neutral-950` (true black)
  - Surface: `bg-neutral-900` (soft black)
  - Cards: `bg-neutral-900/50` with `border-neutral-800`
  - Primary Accent: `text-accent-500` (warm amber #f59e0b)
  - Secondary Accent: `text-rose-400` (soft rose)
  - Success: `text-emerald-400`
  - Error: `text-rose-400`
  - Text Primary: `text-neutral-100`
  - Text Secondary: `text-neutral-500`
  - Border: `border-neutral-800` (subtle)
- **Layout**: Container with max-width (`max-w-4xl`)
- **Icons**: Lucide Svelte (Hexagon for logo, minimal style)
- **Forms**: Server-side validation with error display

## Testing Strategy

1. **Health Check**: Visit `/api/health`
2. **Auth Flow**: 
   - Register at `/register`
   - Login at `/login`
   - Check dashboard at `/dashboard`
3. **API Testing**: Use curl or Postman

```bash
# Health check
curl http://localhost:5173/api/health

# Login
curl -X POST http://localhost:5173/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Deployment Process

1. **Build**: `npm run build`
2. **Migrate**: `npm run db:migrate`
3. **Deploy**: `npm run deploy`

## Security Considerations

1. **Environment Variables**: `.env` in `.gitignore`
2. **Session Security**: HttpOnly cookies, secure in production
3. **Password Hashing**: PBKDF2 with salt
4. **CSRF Protection**: State parameter in OAuth
5. **Input Validation**: Zod validation on server
6. **SQL Injection**: Protected by Drizzle ORM

## Development Workflow

1. `npm install`
2. Copy `.env.example` to `.env`
3. `npm run db:migrate:local`
4. `npm run dev`
5. Test at `http://localhost:5173`
6. Deploy with `npm run deploy`

## Common Issues

1. **D1 binding not found**: Check `wrangler.toml` database_id
2. **Type errors**: Run `npm run cf:typegen`
3. **OAuth errors**: Verify Google credentials and redirect URIs
4. **Session issues**: Clear cookies and try again

## Useful Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Lucia Auth Docs](https://lucia-auth.com/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Arctic OAuth](https://arcticjs.dev/)
