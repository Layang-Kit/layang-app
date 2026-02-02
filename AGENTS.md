# AGENTS.md - SvelteKit + Cloudflare D1 + Drizzle ORM Boilerplate

## Project Overview

This is a full-stack edge-ready boilerplate application built with:

- **SvelteKit** - Full-stack framework with file-based routing
- **Cloudflare D1** - SQLite edge database running on Cloudflare's edge network
- **Drizzle ORM** - Type-safe SQL-like ORM for database operations
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

The application provides a simple user management system with posts, demonstrating CRUD operations on Cloudflare's edge infrastructure.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | SvelteKit 2.x |
| UI Library | Svelte 4.x |
| Styling | Tailwind CSS 3.4 |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM 0.29 |
| Build Tool | Vite 5.x |
| Adapter | @sveltejs/adapter-cloudflare |
| Deployment | Cloudflare Pages |

## Project Structure

```
.
├── src/
│   ├── lib/
│   │   └── db/
│   │       ├── schema.ts      # Database schema (users, posts tables)
│   │       ├── index.ts       # DB client factory function
│   │       └── types.ts       # TypeScript type definitions
│   ├── routes/
│   │   ├── api/
│   │   │   ├── health/        # Health check endpoint (+server.ts)
│   │   │   └── users/         # Users CRUD API
│   │   │       ├── +server.ts       # List & Create users
│   │   │       └── [id]/
│   │   │           └── +server.ts   # Get & Delete user by ID
│   │   ├── dashboard/         # Dashboard page (+page.svelte)
│   │   ├── +layout.svelte     # Root layout with global styles
│   │   └── +page.svelte       # Home page
│   ├── app.d.ts               # App type declarations (Platform, Locals)
│   ├── app.html               # HTML template (dark theme)
│   ├── app.css                # Global styles (Tailwind directives)
│   └── hooks.server.ts        # Server hooks (injects DB into locals)
├── drizzle/                   # Database migrations
│   ├── 0000_initial.sql       # Initial schema migration
│   └── seed.sql               # Seed data for development
├── scripts/
│   └── seed.ts                # TypeScript seed script using D1 HTTP API
├── svelte.config.js           # SvelteKit configuration (Cloudflare adapter)
├── vite.config.ts             # Vite configuration
├── drizzle.config.ts          # Drizzle Kit configuration
├── wrangler.toml              # Cloudflare Wrangler configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Database Schema

The database consists of two main tables with relations:

### users
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `email` - TEXT NOT NULL UNIQUE
- `name` - TEXT NOT NULL
- `created_at` - INTEGER (timestamp)

### posts
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `title` - TEXT NOT NULL
- `content` - TEXT
- `published` - INTEGER (boolean)
- `author_id` - INTEGER (FK to users.id, CASCADE delete)
- `created_at` - INTEGER (timestamp)

Relations: One user has many posts.

## Build and Development Commands

```bash
# Development
npm run dev              # Start development server with Vite

# Building
npm run build            # Build for production (outputs to .svelte-kit/cloudflare)
npm run check            # Type-check with svelte-check

# Preview & Deploy
npm run preview          # Preview production build locally with Wrangler
npm run deploy           # Deploy to Cloudflare Pages

# Database Operations
npm run db:generate      # Generate Drizzle migration files
npm run db:migrate       # Apply migrations to remote D1 database
npm run db:migrate:local # Apply migrations to local D1 database
npm run db:seed:local    # Execute seed.sql on local database
npm run db:studio        # Open Drizzle Studio GUI
npm run cf:typegen       # Generate Cloudflare Workers types
```

## Environment Configuration

Create a `.env` file from `.env.example`:

```bash
# Required for Drizzle Kit CLI (migration & studio)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token_with_edit_permission
```

**API Token Requirements:**
- Account: D1:Edit
- Zone: Read (if applicable)

Get your API token from: https://dash.cloudflare.com/profile/api-tokens

## Cloudflare Configuration (wrangler.toml)

```toml
name = "sveltekit-d1-app"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "your-database-id"
preview_database_id = "DB"
migrations_dir = "drizzle"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with DB connectivity test |
| GET | `/api/users` | List all users with their posts |
| POST | `/api/users` | Create new user (email, name required) |
| GET | `/api/users/[id]` | Get user by ID with posts |
| DELETE | `/api/users/[id]` | Delete user by ID |

## Key Architectural Patterns

### Database Access Pattern

The database is accessed through SvelteKit's `locals` object, injected via server hooks:

```typescript
// src/hooks.server.ts
export const handle: Handle = async ({ event, resolve }) => {
  if (event.platform?.env.DB) {
    event.locals.db = drizzle(event.platform.env.DB, { schema });
  }
  return resolve(event);
};
```

In API routes, access the database via `locals.db`:
```typescript
export const GET: RequestHandler = async ({ locals }) => {
  const users = await locals.db.query.users.findMany({
    with: { posts: true }
  });
  return json({ success: true, data: users });
};
```

### Type Safety

Type definitions are in `src/app.d.ts`:
- `App.Platform.env.DB` - D1Database binding
- `App.Locals.db` - DrizzleD1Database instance

## UI/UX Conventions

- **Theme**: Dark mode only (configured in `app.html`)
- **Color Scheme**: 
  - Background: `bg-gray-900`
  - Cards: `bg-gray-800`
  - Primary accent: `text-blue-400`
  - Success accent: `text-green-400`
- **Layout**: Container with max-width (`max-w-4xl`, `mx-auto`)
- **Icons**: Lucide Svelte icons

## Testing Strategy

Currently, this project does not include automated tests. Manual testing can be done via:

1. **Health Check**: Visit `/api/health` to verify DB connectivity
2. **Dashboard**: Visit `/dashboard` to view users list
3. **API Testing**: Use curl or Postman to test CRUD endpoints

Example test commands:
```bash
# Health check
curl http://localhost:5173/api/health

# Create user
curl -X POST http://localhost:5173/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# List users
curl http://localhost:5173/api/users
```

## Deployment Process

1. **Build**: `npm run build` - Creates production bundle in `.svelte-kit/cloudflare`
2. **Migrate**: `npm run db:migrate` - Apply pending migrations to production D1
3. **Deploy**: `npm run deploy` - Upload to Cloudflare Pages

## Security Considerations

1. **Environment Variables**: Never commit `.env` files - they contain sensitive API tokens
2. **CORS**: Currently no CORS configuration - add if needed for external API access
3. **Input Validation**: Basic validation in API routes using Zod (imported but minimally used)
4. **SQL Injection**: Protected by Drizzle ORM's parameterized queries
5. **Unique Constraints**: Email field has UNIQUE constraint to prevent duplicates

## Development Workflow

1. Run `npm install` to install dependencies
2. Copy `.env.example` to `.env` and fill in Cloudflare credentials
3. Run `npm run db:migrate:local` to set up local database
4. Run `npm run db:seed:local` to populate with test data
5. Run `npm run dev` to start development server
6. Make changes and test locally
7. Run `npm run build` and `npm run preview` to test production build
8. Deploy with `npm run deploy`

## Common Issues

1. **D1 binding not found**: Ensure `wrangler.toml` has correct database_id and the database exists
2. **Type errors**: Run `npm run cf:typegen` to regenerate Cloudflare types
3. **Migration failures**: Check that `drizzle.config.ts` has correct credentials

## Useful Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
