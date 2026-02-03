# ⚡ Tepi Kilat

**Edge-first full-stack starter template** — SvelteKit + Cloudflare D1 + Drizzle ORM with authentication, email verification, and file uploads. Deployed on Cloudflare's edge network for maximum speed.

![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-orange?style=flat-square&logo=svelte)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔐 Authentication (Built-in)
- **Email/Password** - Secure registration & login with PBKDF2 password hashing (Web Crypto API)
- **Google OAuth** - One-click login with Google via Arctic
- **Email Verification** - Verify email addresses via Resend
- **Password Reset** - Complete forgot/reset password flow
- **Session Management** - Secure HTTP-only cookies with Lucia Auth 3.x

### 📁 File Uploads
- **Avatar Upload** - Profile picture with automatic WebP conversion
- **Presigned URLs** - Direct upload to Cloudflare R2 for large files
- **Image Processing** - Canvas API-based WebP conversion
- **CDN Delivery** - Fast global delivery via Cloudflare R2

### 🎨 UI/UX (Dark Elegance Theme)
- **Dark Mode Only** - Beautiful "Dark Elegance" theme with Tailwind CSS 4.x
- **Responsive** - Mobile-first design
- **Loading States** - Smooth transitions
- **Form Validation** - Server-side validation with Zod 4.x

### 🛠️ Tech Stack
| Category | Technology |
|----------|------------|
| Framework | [SvelteKit 2.x](https://kit.svelte.dev/) + [Svelte 5.x (Runes)](https://svelte.dev/) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| ORM | [Drizzle ORM 0.40](https://orm.drizzle.team/) |
| Auth | [Lucia 3.x](https://lucia-auth.com/) + [Arctic](https://arcticjs.dev/) |
| Password Hashing | Web Crypto API (PBKDF2) |
| Email | [Resend](https://resend.com/) |
| Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| Styling | [Tailwind CSS 4.x](https://tailwindcss.com/) |
| Icons | [Lucide](https://lucide.dev/) |
| Build | [Vite 6.x](https://vitejs.dev/) |

## 📚 Documentation

Lihat folder [`docs/`](docs/) untuk dokumentasi lengkap:

- **[Quick Start](docs/setup/quick-start.md)** - Setup dalam 5 menit
- **[Environment Variables](docs/setup/environment-variables.md)** - Konfigurasi lengkap
- **[Architecture](docs/architecture.md)** - Arsitektur project
- **[Setup Guides](docs/setup/)** - Panduan setup semua layanan
- **[Feature Guides](docs/guides/)** - Panduan menggunakan fitur
- **[Troubleshooting](docs/troubleshooting/)** - Solusi masalah umum

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account
- (Optional) Resend account for email
- (Optional) Google Cloud Console for OAuth

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/maulanashalihin/svelte-kit-cloudflare-starter.git
cd svelte-kit-cloudflare-starter

# Install dependencies
npm install
```

### 2. Setup Database

```bash
# Create D1 database
npx wrangler d1 create my-database

# Copy database ID to wrangler.toml
# [[d1_databases]]
# binding = "DB"
# database_id = "your-database-id-here"
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
```

Required variables:
```env
# Cloudflare (Required)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: Email Verification
RESEND_API_TOKEN=re_your_token
FROM_EMAIL=noreply@yourdomain.com

# Optional: File Uploads (R2)
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 4. Generate & Apply Migrations

```bash
# Generate migrations from schema (run this first if drizzle/ folder is empty)
npm run db:generate

# Apply migrations to local database
npm run db:migrate:local

# Or apply to production database
npm run db:migrate
```

> **Note:** Run `db:generate` whenever you make changes to `src/lib/db/schema.ts`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📚 Project Structure

```
.
├── src/
│   ├── lib/
│   │   ├── auth/           # Lucia auth, password hashing, Google OAuth
│   │   ├── db/             # Drizzle schema, types, client factory
│   │   ├── email/          # Resend email service & templates
│   │   ├── image/          # WebP image processing (Canvas API)
│   │   └── storage/        # R2 storage helpers & presigned URLs
│   ├── routes/
│   │   ├── auth/           # Auth API endpoints (login, register, etc)
│   │   ├── api/            # API endpoints (profile, users, upload)
│   │   ├── (examples)/     # Example patterns (server-load, form-actions)
│   │   ├── dashboard/      # Dashboard page (protected)
│   │   ├── profile/        # Profile page (protected)
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   └── ...
│   ├── hooks.server.ts     # Server hooks (DB + Auth injection)
│   ├── app.css             # Global styles (Tailwind 4)
│   └── app.html            # HTML template (dark theme)
├── drizzle/                # Database migrations
├── workflow/               # Workflow agents & documentation
├── scripts/                # Seed scripts
├── static/                 # Static assets
├── wrangler.toml           # Cloudflare config
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                  # Start dev server (Vite)
npm run check                # Type-check with svelte-check

# Building
npm run build                # Build for production
npm run preview              # Preview production build locally

# Database
npm run db:generate          # Generate migrations from schema.ts
npm run db:migrate:local     # Apply migrations to local D1
npm run db:migrate           # Apply migrations to production D1
npm run db:refresh:local     # Reset local DB + reapply migrations
npm run db:seed              # Seed database via HTTP API
npm run db:seed:local        # Execute seed.sql locally
npm run db:studio            # Open Drizzle Studio GUI

# Cloudflare
npm run cf:typegen           # Generate Cloudflare Workers types
npm run deploy               # Deploy to Cloudflare Pages
```

## 📖 Usage Guide

### Authentication Flow

1. **Register** - User registers with email/password
2. **Verify Email** - Verification email sent via Resend
3. **Click Link** - User clicks verification link (`/auth/verify-email?token=xxx`)
4. **Login** - User can now login (email must be verified)
5. **Google OAuth** - Alternative login via Google

### File Uploads

**For Images (with WebP conversion):**
```typescript
// POST /api/upload/image
const formData = new FormData();
formData.append('file', imageFile);
formData.append('type', 'avatar'); // 'avatar' | 'general'

const res = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData
});

const { url } = await res.json();
// Returns WebP image URL on R2
```

**For Other Files (presigned URL):**
```typescript
// 1. Get presigned URL
const res = await fetch('/api/upload/presign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filename: 'document.pdf',
    contentType: 'application/pdf',
    prefix: 'documents'
  })
});

const { uploadUrl, publicUrl } = await res.json();

// 2. Upload directly to R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'application/pdf' }
});
```

### Server Load Pattern (Recommended)

```typescript
// routes/dashboard/+page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  // Query directly from server - no API needed!
  const users = await locals.db.query.users.findMany();
  return { users };
};
```

### Form Actions Pattern (Recommended)

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

## 🌐 Deployment

### 1. Login & Deploy

```bash
# Login to Wrangler
npx wrangler login

# Deploy to Cloudflare Pages
npm run deploy
```

### 2. Configure Environment Variables

In Cloudflare Dashboard:
1. Go to **Pages** > Your Project > **Settings** > **Functions** > **Environment Variables**
2. Add all required variables from `.env`

### 3. Bind D1 Database & R2 Bucket

In `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_id = "your-database-id"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "your-bucket"
```

Or configure via Dashboard: **Pages** > Settings > **Bindings**

## 🔒 Security Features

- ✅ **PBKDF2 Password Hashing** - Secure password storage with Web Crypto API
- ✅ **HTTP-only Cookies** - Session cookies can't be accessed via JavaScript
- ✅ **CSRF Protection** - State parameter in OAuth flow
- ✅ **Input Validation** - Zod 4.x validation on all inputs
- ✅ **SQL Injection Protection** - Via Drizzle ORM parameterized queries
- ✅ **Secure Headers** - Cloudflare Pages security headers

## 🐛 Troubleshooting

### "D1 binding not found"
Make sure `wrangler.toml` has correct `database_id` and you've created the database.

### "Email not sending"
Check `RESEND_API_TOKEN` and `FROM_EMAIL` environment variables. Verify email domain is verified in Resend.

### "Upload failed"
Verify R2 credentials and bucket name. Check browser console for detailed errors.

### "Build fails on Cloudflare"
Ensure all environment variables are set in Cloudflare Dashboard, not just locally.

See [docs/troubleshooting/](docs/troubleshooting/) for more solutions.

## 📖 References

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Lucia Auth](https://lucia-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

---

**Tepi Kilat** — *Cepat deploy ke edge, aman dengan auth built-in* ⚡

Built with ❤️ using [SvelteKit](https://kit.svelte.dev/) and [Cloudflare](https://cloudflare.com/)
