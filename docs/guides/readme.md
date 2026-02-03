# 📖 Feature Guides

Panduan penggunaan fitur-fitur utama aplikasi.

---

## 🛠️ Available Guides

| Guide | Description | Difficulty |
|-------|-------------|------------|
| [Authentication](authentication.md) | Login, register, Google OAuth | Beginner |
| [Profile Management](profile-management.md) | Edit profil, avatar, settings | Beginner |
| [File Uploads](file-uploads.md) | Upload avatar & files | Intermediate |
| [Database Workflow](database-workflow.md) | Local vs Production database | Intermediate |
| [SvelteKit Patterns](patterns.md) | Best practices & patterns | Advanced |

---

## 🎯 By Topic

### Authentication & Users
- [Authentication](authentication.md) - Flow login, register, dan OAuth
- [Profile Management](profile-management.md) - Manage user profile

### Data & Storage
- [File Uploads](file-uploads.md) - Handle file uploads
- [Database Workflow](database-workflow.md) - Switch antara local dan production DB

### Development Patterns
- [SvelteKit Patterns](patterns.md) - Best practices untuk data loading dan forms

---

## 📝 Contoh Penggunaan

### Authentication Flow
```
1. User register → Email verification
2. User login → Session created
3. Access protected routes → Auth check
4. Logout → Session destroyed
```

### File Upload Flow
```
1. User select file
2. Client validate file type & size
3. Upload ke R2 storage
4. Save URL ke database
```

---

## 🔗 Related Documentation

- [Setup Guides](../setup/readme.md) - Setup project
- [Troubleshooting](../troubleshooting/readme.md) - Problem solving
- [Architecture](../architecture.md) - System design
- [API Reference](../api-reference.md) - API documentation

---

[← Kembali ke Documentation](../readme.md)
