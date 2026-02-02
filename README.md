# SvelteKit + Cloudflare D1 + Drizzle ORM Boilerplate

Full-stack edge-ready boilerplate dengan teknologi modern:

- **SvelteKit** - Framework full-stack
- **Cloudflare D1** - SQLite edge database
- **Drizzle ORM** - Type-safe SQL-like ORM
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Type safety

## 📁 Project Structure

```
.
├── src/
│   ├── lib/
│   │   └── db/
│   │       ├── schema.ts      # Database schema
│   │       ├── index.ts       # DB client
│   │       └── types.ts       # TypeScript types
│   ├── routes/
│   │   ├── api/
│   │   │   ├── health/        # Health check endpoint
│   │   │   └── users/         # Users CRUD API
│   │   ├── dashboard/         # Dashboard page
│   │   ├── +layout.svelte     # Root layout
│   │   └── +page.svelte       # Home page
│   ├── app.d.ts               # App types
│   ├── app.html               # HTML template
│   ├── app.css                # Global styles
│   └── hooks.server.ts        # Server hooks (DB injection)
├── drizzle/                   # Migrations
├── wrangler.toml              # Cloudflare config
└── drizzle.config.ts          # Drizzle config
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup D1 Database

```bash
# Create database
npx wrangler d1 create DB

# Copy database_id ke wrangler.toml
```

### 3. Apply Migration

```bash
# Local development
npm run db:migrate:local

# Production
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Deploy to Production

```bash
npm run deploy
```

## 📝 Environment Variables

Copy `.env.example` ke `.env` dan isi dengan credential Cloudflare:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token
```

> **Note:** API token butuh permission `Cloudflare Pages:Edit` dan `D1:Edit`

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |
| GET | `/api/users/[id]` | Get user by ID |
| DELETE | `/api/users/[id]` | Delete user |

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview with wrangler |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run db:generate` | Generate migration |
| `npm run db:migrate` | Apply migration (remote) |
| `npm run db:migrate:local` | Apply migration (local) |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run cf:typegen` | Generate types |

## 📄 License

MIT
