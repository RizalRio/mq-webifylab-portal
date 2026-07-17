# MQ WebifyLab Portal

**MQ WebifyLab Portal** adalah aplikasi web monorepo yang berfungsi sebagai portal profil perusahaan, showcase portofolio, dan manajemen produk SaaS. Proyek ini dibangun dengan arsitektur modern menggunakan **Golang** untuk backend dan **Next.js** untuk frontend.

## 🚀 Tech Stack

### Backend

- **Language:** Golang
- **Hot Reload:** Air (`.air.toml`)
- **Authentication:** JWT (JSON Web Token)
- **Database:** Relational Database (Konfigurasi di `config/database.go`)
- **Architecture:** Clean Architecture (Handler -> Service -> Repository -> Model)

### Frontend

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / PostCSS
- **Linting:** ESLint

---

## ✨ Fitur Utama

### 🌐 Public Pages (Halaman Publik)

- **Landing Page:** Hero section, About, Services, dan Tech Stack.
- **Portfolio Showcase:** Menampilkan proyek-proyek yang telah dikerjakan.
- **SaaS Showcase:** Katalog dan detail produk SaaS.
- **Pricing & Testimonials:** Informasi harga dan ulasan klien.
- **Contact Form:** Form pengiriman pesan yang terintegrasi dengan dashboard admin.

### 🔐 Admin Dashboard

- **Authentication:** Login admin dengan JWT.
- **Dashboard Overview:** Statistik dan ringkasan data.
- **Portfolio Management:** CRUD untuk data portofolio.
- **SaaS Products Management:** CRUD untuk produk SaaS termasuk upload gambar/media.
- **Technologies Management:** Manajemen tech stack yang digunakan.
- **Messages Inbox:** Membaca dan mengelola pesan dari form kontak.

---

## 📁 Struktur Proyek

Proyek ini menggunakan struktur monorepo:

```text
mq-webifylab-portal/
├── backend/          # Backend API (Golang)
│   ├── cmd/          # Entry point (main.go) & Database seeder
│   ├── config/       # Konfigurasi database & environment
│   ├── internal/     # Core business logic (dto, handler, model, repo, service)
│   ├── pkg/          # Reusable packages (auth, middleware, response)
│   └── public/       # Public assets & uploaded files
├── frontend/         # Frontend Web (Next.js)
│   ├── app/          # App router (Public pages & Admin dashboard)
│   └── public/       # Static assets (images, icons)
└── docs/             # Dokumentasi proyek (API, Arsitektur, DB Schema, Deployment)
```

---

## 🛠️ Prasyarat

Pastikan Anda telah menginstal:

- [Go](https://go.dev/dl/) (versi 1.21 atau lebih baru)
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru) & npm
- [Air](https://github.com/air-verse/air) (untuk hot-reload backend)
- Database Server (MySQL/PostgreSQL sesuai konfigurasi)

---

## ⚙️ Instalasi & Menjalankan Proyek

### 1. Backend (Golang)

```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
go mod tidy

# (Opsional) Setup environment variables
# Buat file .env di root folder backend dan sesuaikan konfigurasi database

# Jalankan database seeder (jika diperlukan)
go run cmd/seeder/main.go

# Menjalankan server development (dengan Air hot-reload)
air
# ATAU menggunakan Makefile
make run

# Server akan berjalan di http://localhost:8080 (sesuaikan port di config)
```

### 2. Frontend (Next.js)

```bash
# Buka terminal baru, masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Menjalankan server development
npm run dev

# Frontend akan berjalan di http://localhost:3000
```

---

## 📖 Dokumentasi

Dokumentasi lengkap mengenai proyek ini dapat ditemukan di folder [`docs/`](./docs/):

- [API Documentation](./docs/API_DOCUMENTATION.md) - Endpoint dan cara penggunaan API.
- [Architecture](./docs/ARCHITETURE.md) - Penjelasan arsitektur sistem dan desain.
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Struktur tabel dan relasi database.
- [Deployment](./docs/DEPLOYMENT.md) - Panduan deployment ke production.

---

## 📝 Scripts (Frontend)

- `npm run dev`: Menjalankan aplikasi di mode development.
- `npm run build`: Build aplikasi untuk production.
- `npm run start`: Menjalankan aplikasi hasil build.
- `npm run lint`: Menjalankan ESLint untuk mengecek error kode.

---

## 👨‍💻 Developer

Dikembangkan oleh **Rizal**

- Web Developer | Informatics Student | AI Engineer | Data Analyst | Gamer

---

## 📄 License

Proyek ini dibuat untuk keperluan Internal WebifyLab dan Portfolio.
