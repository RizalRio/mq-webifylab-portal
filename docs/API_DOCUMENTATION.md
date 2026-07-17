```markdown
# 🚀 WebifyLab - API Documentation

Dokumen ini berisi referensi lengkap untuk *RESTful API* yang digunakan pada proyek **WebifyLab**. API ini dirancang untuk melayani kebutuhan *landing page* (publik) dan *dashboard back-office* (admin).

## 📌 Informasi Dasar

- **Base URL**: `https://api.webifylab.my.id/api/v1` (Produksi) / `http://localhost:8000/api/v1` (Lokal)
- **Format Data**: Semua *request* dan *response* menggunakan format `JSON`.
- **Versi API**: `v1` (terdapat di URL path).

---

## 🔐 Autentikasi & Otorisasi

API ini membagi akses menjadi dua kategori:
1. **Public Access**: Dapat diakses oleh siapa saja tanpa token (biasanya untuk *landing page*).
2. **Admin Access**: Memerlukan *token* JWT yang valid. Token didapatkan setelah admin berhasil login.

**Cara menggunakan Token Admin:**
Sertakan *header* berikut pada setiap *request* ke endpoint `/admin/...`:
```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 📦 Format Respons Standar

### Respons Sukses (Success)
```json
{
  "status": "success",
  "message": "Deskripsi operasi berhasil",
  "data": { ... } // Bisa berupa Object atau Array
}
```

### Respons Error (Error)
```json
{
  "status": "error",
  "message": "Deskripsi kesalahan (misal: Email atau password salah)",
  "errors": { ... } // Opsional, berisi detail validasi input
}
```

---

## 📖 Daftar Endpoint

### 1. Autentikasi (Admin)

#### Login Admin
Mendapatkan token JWT untuk akses *dashboard*.
- **Endpoint**: `POST /auth/login`
- **Akses**: Public

**Request Body:**
```json
{
  "email": "admin@webifylab.my.id",
  "password": "supersecretpassword"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin WebifyLab"
    }
  }
}
```

---

### 2. Portofolio & Teknologi

#### A. Ambil Daftar Portofolio
Menampilkan daftar proyek dengan *pagination*. Data yang dikembalikan sudah mencakup relasi teknologi dan gambar utama (*primary image*).
- **Endpoint**: `GET /portfolios`
- **Akses**: Public
- **Query Params**: 
  - `limit` (integer, default: 6)
  - `page` (integer, default: 1)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "current_page": 1,
    "total": 12,
    "items": [
      {
        "id": 1,
        "title": "E-Commerce App",
        "client_name": "PT Maju",
        "technologies": [
          {"id": 1, "name": "Golang", "icon_url": "/icons/go.svg"}
        ],
        "primary_image": {
          "file_url": "https://storage.../ecommerce-cover.webp"
        }
      }
    ]
  }
}
```

#### B. Detail Portofolio
Menampilkan detail lengkap proyek beserta seluruh galeri gambar (*media assets*).
- **Endpoint**: `GET /portfolios/:id`
- **Akses**: Public

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "E-Commerce App",
    "description": "Platform e-commerce custom dengan fitur multi-tenant...",
    "client_name": "PT Maju",
    "project_url": "https://majujaya.com",
    "technologies": [ ... ],
    "media_assets": [
      {"id": 10, "file_url": "...", "is_primary": true},
      {"id": 11, "file_url": "...", "is_primary": false}
    ]
  }
}
```

#### C. Tambah Portofolio Baru (Admin)
- **Endpoint**: `POST /admin/portfolios`
- **Akses**: Admin (Bearer Token)

**Request Body:**
```json
{
  "title": "Task Manager System",
  "description": "Sistem manajemen tugas dengan RBAC...",
  "client_name": null, 
  "project_url": "https://github.com/.../task-manager",
  "technology_ids": [1, 3, 4] 
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Portofolio berhasil ditambahkan",
  "data": { "id": 15, "title": "Task Manager System" }
}
```
*(Catatan: Gunakan `id` yang dikembalikan untuk melakukan upload gambar di endpoint Media).*

---

### 3. Media Assets (Upload Gambar)

Endpoint serbaguna (*Polymorphic*) untuk mengunggah gambar ke portofolio atau produk SaaS.
- **Endpoint**: `POST /admin/media`
- **Akses**: Admin (Bearer Token)
- **Content-Type**: `multipart/form-data`

**Request Form Data:**
| Key | Value | Keterangan |
|---|---|---|
| `file` | (Binary File) | File gambar (Max 2MB, format: jpg, png, webp). |
| `mediable_type` | String | Nama entitas: `'portfolios'` atau `'saas_products'`. |
| `mediable_id` | Integer | ID dari entitas pemilik (misal: ID portofolio). |
| `is_primary` | Boolean | `true` untuk gambar utama/thumbnail, `false` untuk galeri. |

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Media berhasil diunggah",
  "data": {
    "id": 25,
    "file_url": "https://storage.../task-manager-cover.webp",
    "is_primary": true
  }
}
```

---

### 4. SaaS Products (Etalase Produk)

#### A. Ambil Daftar SaaS Aktif
Menampilkan produk SaaS yang sedang dipromosikan (`is_active: true`).
- **Endpoint**: `GET /saas`
- **Akses**: Public

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Webify POS",
      "slug": "pos",
      "tagline": "Sistem Kasir Modern & Terintegrasi",
      "subdomain_url": "https://pos.webifylab.my.id",
      "primary_image": {"file_url": "https://storage.../pos-hero.webp"}
    }
  ]
}
```

#### B. Manajemen SaaS (Admin)
- **Tambah Produk**: `POST /admin/saas`
- **Ubah Produk**: `PUT /admin/saas/:id` (Bisa digunakan untuk mengubah status `is_active` menjadi `false` untuk menyembunyikan produk).

**Request Body (Contoh PUT):**
```json
{
  "name": "Webify POS",
  "tagline": "Sistem Kasir Modern v2.0",
  "is_active": false
}
```

---

### 5. Pesan Kontak (Contact Messages)

#### A. Kirim Pesan (Public)
Digunakan pada formulir "Hubungi Kami" di *landing page*.
- **Endpoint**: `POST /contact`
- **Akses**: Public

**Request Body:**
```json
{
  "sender_name": "Budi Santoso",
  "sender_email": "budi@email.com",
  "sender_phone": "08123456789",
  "subject": "Tanya Jasa Pembuatan Company Profile",
  "message": "Halo, saya tertarik membuat website untuk perusahaan saya..."
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Pesan Anda berhasil dikirim, tim kami akan segera menghubungi."
}
```

#### B. Lihat Daftar Pesan Masuk (Admin)
- **Endpoint**: `GET /admin/messages`
- **Akses**: Admin (Bearer Token)
- **Query Params**: `?is_read=false` (Opsional, untuk filter pesan belum dibaca).

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 5,
      "sender_name": "Budi Santoso",
      "subject": "Tanya Jasa Pembuatan Company Profile",
      "is_read": false,
      "created_at": "2026-07-08T10:00:00Z"
    }
  ]
}
```

#### C. Tandai Pesan Sudah Dibaca (Admin)
- **Endpoint**: `PATCH /admin/messages/:id/read`
- **Akses**: Admin (Bearer Token)

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Pesan ditandai sebagai sudah dibaca"
}
```

---

## ⚠️ Penanganan Error (Error Codes)

| HTTP Status | Keterangan |
|---|---|
| `200 OK` | Request berhasil (GET, PUT, PATCH). |
| `201 Created` | Data baru berhasil dibuat (POST). |
| `400 Bad Request` | Validasi input gagal (misal: email tidak valid, file terlalu besar). |
| `401 Unauthorized` | Token JWT tidak ada, kadaluarsa, atau tidak valid. |
| `403 Forbidden` | Token valid, tapi user tidak punya hak akses (misal: bukan admin). |
| `404 Not Found` | Resource (ID portofolio, pesan, dll) tidak ditemukan. |
| `500 Internal Server Error` | Kesalahan pada sisi server. |
```

***