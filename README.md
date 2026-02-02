# SvelteKit + Cloudflare D1 + Drizzle ORM Boilerplate

Full-stack edge-ready boilerplate dengan teknologi modern:

- **SvelteKit** - Framework full-stack
- **Cloudflare D1** - SQLite edge database
- **Drizzle ORM** - Type-safe SQL-like ORM
- **Lucia Auth** - Session-based authentication
- **Google OAuth** - Social login support
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Type safety

## 📁 Project Structure

```
.
├── src/
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── lucia.ts       # Lucia auth configuration
│   │   │   ├── google.ts      # Google OAuth setup
│   │   │   └── password.ts    # Password hashing (Web Crypto)
│   │   └── db/
│   │       ├── schema.ts      # Database schema
│   │       ├── index.ts       # DB client
│   │       └── types.ts       # TypeScript types
│   ├── routes/
│   │   ├── api/
│   │   │   └── users/         # Users CRUD API
│   │   ├── auth/
│   │   │   ├── login/         # Login API
│   │   │   ├── register/      # Register API
│   │   │   ├── logout/        # Logout API
│   │   │   └── google/        # Google OAuth
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── +layout.svelte     # Root layout
│   │   └── +page.svelte       # Home page
│   ├── app.d.ts               # App types
│   ├── app.html               # HTML template
│   ├── app.css                # Global styles
│   └── hooks.server.ts        # Server hooks (Auth + DB)
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

### 4. Configure Environment Variables

Copy `.env.example` ke `.env` dan isi:

```bash
# Cloudflare (required)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token

# Google OAuth (optional - untuk Google login)
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Run Development Server

```bash
npm run dev
```

Akses:
- Home: `http://localhost:5173`
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`

### 6. Deploy to Production

```bash
npm run deploy
```

## 🔐 Authentication Features

### Email/Password Auth
- Registration dengan validasi password
- Login dengan session-based auth
- Password hashing menggunakan Web Crypto API (PBKDF2)
- Logout dengan session invalidation

### Google OAuth
- One-click login/register dengan Google
- Automatic account linking jika email sudah terdaftar
- PKCE flow untuk keamanan

### Session Management
- Session cookie dengan HttpOnly
- Auto session refresh
- Secure di production (HTTPS only)

## 📚 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register dengan email/password |
| POST | `/auth/login` | Login dengan email/password |
| POST | `/auth/logout` | Logout |
| GET | `/auth/google` | Google OAuth login |
| GET | `/auth/google/callback` | Google OAuth callback |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |
| GET | `/api/users/[id]` | Get user by ID |
| DELETE | `/api/users/[id]` | Delete user |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview with wrangler |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run check` | TypeScript check |
| `npm run db:generate` | Generate migration |
| `npm run db:migrate` | Apply migration (remote) |
| `npm run db:migrate:local` | Apply migration (local) |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run cf:typegen` | Generate types |

## 🔑 Setup Google OAuth

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen (External untuk testing)
6. Application type: **Web application**
7. Authorized redirect URIs:
   - Local: `http://localhost:5173/auth/google/callback`
   - Production: `https://your-domain.pages.dev/auth/google/callback`
8. Copy Client ID dan Client Secret ke `.env`

## 📄 License

MIT
