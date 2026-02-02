# Troubleshooting - File Upload Issues

Solusi untuk masalah upload file dan gambar.

## ❌ "Storage not configured"

### Penyebab
- Environment variables R2 tidak terisi
- `.env` file tidak ada

### Solusi

1. Check `.env`:
```env
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=xxx
```

2. Restart dev server setelah edit `.env`

---

## ❌ "The Access Key ID you provided does not exist"

### Penyebab
- Access Key salah atau expired
- Key sudah di-delete

### Solusi

1. Buat API Token baru:
   - Cloudflare Dashboard → R2
   - Manage R2 API Tokens → Create
   - Simpan Access Key ID dan Secret

2. Update `.env` dengan credentials baru

---

## ❌ "NoSuchBucket"

### Penyebab
- Bucket name salah
- Bucket belum dibuat

### Solusi

1. Check bucket name (bukan URL):
```env
# Salah
R2_BUCKET_NAME=https://pub-xxx.r2.dev

# Benar
R2_BUCKET_NAME=my-app-uploads
```

2. Verifikasi bucket exists:
   - Dashboard → R2 → Lihat list buckets

---

## ❌ "Upload failed: 403 Forbidden"

### Penyebab
- API token tidak punya write permission
- Token scope salah bucket

### Solusi

1. Buat token dengan permission "Object Read & Write"
2. Pilih bucket yang benar saat create token

---

## ❌ Image tidak muncul setelah upload

### Penyebab
1. Bucket tidak public
2. R2_PUBLIC_URL salah
3. File belum selesai upload

### Solusi

### Jika bucket public:

1. Check bucket settings:
   - R2 → Bucket → Settings
   - Public Access → Allow

2. Check `.env`:
```env
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### Jika bucket private:

Gunakan presigned URL, atau enable public access.

---

## ❌ "File too large"

### Penyebab
- File > 5MB (limit untuk image upload)

### Solusi

1. Compress image:
   - Gunakan tool online (tinypng.com)
   - Atau resize image lebih kecil

2. Untuk file besar, gunakan presigned URL (limit lebih tinggi)

---

## ❌ "Invalid file type"

### Penyebab
- Format file tidak didukung

### Solusi

Image upload support:
- ✅ JPG, PNG, GIF, WebP
- ❌ SVG, BMP, TIFF, RAW

File upload (presign) support:
- ✅ PDF, ZIP, JSON, TXT, CSV, Excel, Word
- ❌ EXE, DLL (executable files)

---

## ❌ "Failed to process image"

### Penyebab
- Image corrupt
- Format tidak standar
- Canvas API error

### Solusi

1. Coba image lain
2. Convert ke JPG/PNG dulu
3. Check image bisa dibuka di browser

---

## 🔧 Debug Upload

### Check di Console

```javascript
// Setelah upload, check response
const res = await fetch('/api/upload/image', {...});
const data = await res.json();
console.log(data);
// Should return: { success: true, url: '...' }
```

### Check di R2 Dashboard

1. Dashboard → R2 → Bucket
2. Lihat Objects
3. Cek file sudah ada atau belum

---

## 📞 Masih Bermasalah?

Check:
- [R2 Setup Guide](../setup/06-cloudflare-r2.md)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
