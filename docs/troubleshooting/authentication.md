# Troubleshooting - Authentication Issues

Solusi untuk masalah login, register, dan auth.

## ❌ "Email already registered"

### Penyebab
- Email sudah dipakai user lain
- User sudah register sebelumnya

### Solusi
- Gunakan email lain, atau
- Login dengan email tersebut (jika punya password)

---

## ❌ "Invalid email or password"

### Penyebab
- Password salah
- Caps lock menyala
- Email salah ketik

### Solusi

1. Check caps lock
2. Pastikan email benar
3. Reset password jika lupa:
   - `/forgot-password`
   - Masukkan email
   - Check inbox untuk link reset

---

## ❌ "Please verify your email before logging in"

### Penyebab
- Email belum diverifikasi
- Verification email belum diklik

### Solusi

1. Check inbox/spam untuk email verifikasi
2. Atau resend dari profile page:
   - Login (akan redirect ke verify page)
   - Klik "Resend verification email"
   - Check inbox lagi

---

## ❌ "Please use Google login for this account"

### Penyebab
- Account dibuat via Google OAuth (bukan email/password)

### Solusi
- Login dengan tombol "Continue with Google"
- Atau create account baru dengan email berbeda

---

## ❌ Google Login: "redirect_uri_mismatch"

### Penyebab
- Redirect URI di Google Cloud Console tidak match

### Solusi

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client ID
4. Tambahkan Authorized redirect URIs:
   ```
   http://localhost:5173/auth/google/callback
   https://yourdomain.pages.dev/auth/google/callback
   ```
5. Pastikan exact match (http/https, no trailing slash)

---

## ❌ Google Login: "access_denied"

### Penyebab
- User belum ditambahkan sebagai test user

### Solusi

1. Google Cloud Console
2. APIs & Services → OAuth consent screen
3. Scroll ke Test users
4. Add user email yang digunakan untuk login

---

## ❌ "Token expired" / "Invalid token"

### Penyebab
- Reset password token expired (1 jam)
- Verification token expired (24 jam)

### Solusi

1. Minta token baru:
   - Forgot password → Request lagi
   - Verification email → Resend dari profile

---

## ❌ Session tidak persist

### Penyebab
- Cookie tidak diset properly
- Browser block third-party cookies

### Solusi

1. Check browser cookie settings:
   - Allow cookies untuk domain Anda
   - Disable "Block third-party cookies" (jika development)

2. Check di Application tab (DevTools):
   - Cookies → should see `auth_session`

---

## ❌ "Registration failed"

### Penyebab
- Validation error
- Database error

### Solusi

Check password requirements:
- Min 8 characters
- 1 uppercase letter
- 1 number

Contoh valid: `MyP@ssw0rd123`

---

## 🔧 Debug Auth

### Check Session

```javascript
// Di browser console
document.cookie
// Should contain: auth_session=xxx
```

### Check API Response

```bash
# Test login
curl -X POST http://localhost:5173/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

---

## 📞 Masih Bermasalah?

Check:
- [Lucia Auth Docs](https://lucia-auth.com/)
- [OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
