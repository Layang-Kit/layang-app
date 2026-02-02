# 🚀 SvelteKit + Cloudflare D1 Boilerplate

A modern, full-stack starter template with authentication, email verification, and file uploads - all running on Cloudflare's edge network.

![SvelteKit](https://img.shields.io/badge/SvelteKit-4.0-orange?style=flat-square&logo=svelte)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?style=flat-square&logo=drizzle&logoColor=black)

## ✨ Features

### 🔐 Authentication
- **Email/Password** - Secure registration & login with PBKDF2 password hashing
- **Google OAuth** - One-click login with Google
- **Email Verification** - Verify email addresses via Resend
- **Password Reset** - Forgot/reset password flow
- **Session Management** - Secure HTTP-only cookies with Lucia Auth

### 📁 File Uploads
- **Avatar Upload** - Profile picture upload with WebP conversion
- **Presigned URLs** - Direct upload to Cloudflare R2 for large files
- **Image Processing** - Automatic WebP conversion and resizing
- **CDN Delivery** - Fast global delivery via Cloudflare

### 🎨 UI/UX
- **Dark Mode** - Beautiful dark theme with Tailwind CSS
- **Responsive** - Mobile-first design
- **Loading States** - Smooth transitions and skeletons
- **Toast Notifications** - User-friendly feedback

### 🛠️ Tech Stack
| Category | Technology |
|----------|------------|
| Framework | [SvelteKit](https://kit.svelte.dev/) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [Lucia](https://lucia-auth.com/) + [Arctic](https://arcticjs.dev/) |
| Email | [Resend](https://resend.com/) |
| Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [Lucide](https://lucide.dev/) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account
- (Optional) Resend account for email
- (Optional) Google Cloud Console for OAuth

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/sveltekit-cf-d1-boilerplate.git
cd sveltekit-cf-d1-boilerplate

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

# Optional: File Uploads
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 4. Run Migrations

```bash
# Apply database migrations (local)
npm run db:migrate:local

# Or apply to production
npm run db:migrate
```

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
│   │   ├── auth/           # Authentication utilities
│   │   ├── db/             # Database schema & types
│   │   ├── email/          # Email service (Resend)
│   │   ├── image/          # Image processing
│   │   └── storage/        # R2 storage helpers
│   ├── routes/
│   │   ├── (auth)/         # Auth pages (login, register, etc)
│   │   ├── api/            # API endpoints
│   │   ├── dashboard/      # Dashboard page
│   │   └── profile/        # Profile page
│   └── app.html            # HTML template
├── drizzle/                # Database migrations
├── static/                 # Static assets
├── wrangler.toml           # Cloudflare config
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:migrate       # Apply migrations (production)
npm run db:migrate:local # Apply migrations (local)
npm run db:generate      # Generate Drizzle migrations
npm run db:studio        # Open Drizzle Studio GUI

# Deployment
npm run deploy           # Deploy to Cloudflare Pages
```

## 📖 Usage Guide

### Authentication Flow

1. **Register** - User registers with email/password
2. **Verify Email** - Verification email sent via Resend
3. **Click Link** - User clicks verification link in email
4. **Login** - User can now login (email must be verified)

### File Uploads

**For Images (Avatar):**
```typescript
// POST /api/upload/image
const formData = new FormData();
formData.append('file', imageFile);
formData.append('type', 'avatar'); // or 'general'

const res = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData
});

const { url } = await res.json();
// Returns WebP image URL
```

**For Other Files:**
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

## 🌐 Deployment

### 1. Setup Cloudflare Pages

```bash
# Login to Wrangler
npx wrangler login

# Deploy
npm run deploy
```

### 2. Configure Environment Variables

In Cloudflare Dashboard:
1. Go to **Pages** > Your Project > **Settings** > **Functions**
2. Add environment variables:
   - `RESEND_API_TOKEN`
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - etc.

### 3. Bind R2 Bucket

In `wrangler.toml`:
```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "your-bucket"
```

Or via Dashboard: **Pages** > Settings > **R2 Buckets**

## 🔒 Security Features

- ✅ **PBKDF2 Password Hashing** - Secure password storage
- ✅ **HTTP-only Cookies** - Session cookies can't be accessed via JavaScript
- ✅ **CSRF Protection** - State parameter in OAuth flow
- ✅ **Input Validation** - Zod validation on all inputs
- ✅ **SQL Injection Protection** - Via Drizzle ORM parameterized queries
- ✅ **Rate Limiting** - Built into Resend and Cloudflare

## 🐛 Troubleshooting

### "D1 binding not found"
Make sure `wrangler.toml` has correct `database_id` and you've created the database.

### "Email not sending"
Check `RESEND_API_TOKEN` and `FROM_EMAIL` environment variables. Verify email domain is verified in Resend.

### "Upload failed"
Verify R2 credentials and bucket name. Check browser console for detailed errors.

### "Build fails on Cloudflare"
Ensure all environment variables are set in Cloudflare Dashboard, not just locally.

## 📖 Documentation

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Lucia Auth](https://lucia-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

---

Built with ❤️ using [SvelteKit](https://kit.svelte.dev/) and [Cloudflare](https://cloudflare.com/)
