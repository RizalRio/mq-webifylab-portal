***

```markdown
# 🏗️ WebifyLab - System Architecture

Dokumen ini menjelaskan desain arsitektur sistem dari **WebifyLab**. Memahami gambaran besar sistem sebelum menulis kode adalah langkah krusial untuk memastikan aplikasi yang dibangun skalabel, aman, dan mudah di-*maintain*.

WebifyLab menggunakan model **Arsitektur 3-Tier (Tiga Tingkat)** berbasis *Client-Server*. Model ini memisahkan sistem menjadi tiga lapisan utama: Presentasi (*Frontend*), Logika Bisnis (*Backend API*), dan Manajemen Data (*Database*).

## 🗺️ Diagram Arsitektur Tingkat Tinggi

```mermaid
graph TD
    subgraph "Tier 1: Presentation Layer"
        Public[Public Web - Company Profile]
        Admin[Admin Dashboard]
    end

    subgraph "Tier 2: Application Layer (Golang + Gin)"
        Router[Router / Handler]
        Service[Service / Usecase]
        Repo[Repository]
        Router --> Service
        Service --> Repo
    end

    subgraph "Tier 3: Data & Storage Layer"
        DB[(PostgreSQL)]
        Storage[Media Storage]
    end

    User((User / Admin)) -->|Browse & Interact| Public
    AdminUser((Admin)) -->|Manage Content| Admin
    
    Public -->|REST API (JSON)| Router
    Admin -->|REST API + JWT| Router
    
    Repo -->|GORM / SQL| DB
    Service -->|File Handling| Storage
```

---

## 📊 Detail Lapisan Arsitektur

### 1. Tier 1: Presentation Layer (Frontend / Client)
Lapisan antarmuka yang berinteraksi langsung dengan pengguna. Di WebifyLab, lapisan ini dibagi menjadi dua entitas utama:

*   **Public Facing Web (Company Profile):** 
    *   **Fungsi:** Halaman publik tempat calon klien melihat portofolio, layanan, iklan produk SaaS, dan mengisi form kontak.
    *   **Fokus:** SEO (*Search Engine Optimization*), *Core Web Vitals* (kecepatan), dan estetika visual.
    *   **Tech Stack:** Framework Modern (React/Next.js/Vue) + **Tailwind CSS** untuk desain yang responsif dan konsisten.
    *   **Catatan:** Seluruh tata letak dan skema warna diprototipekan secara matang di **Figma** sebelum proses *slicing* kode dimulai.
*   **Admin Dashboard (Back-Office):** 
    *   **Fungsi:** Portal privat bagi admin untuk mengelola konten web (CRUD Portofolio, Teknologi, SaaS, dan membaca pesan masuk).
    *   **Fokus:** Fungsionalitas, kecepatan operasi data, dan keamanan akses.
    *   **Keamanan:** Memerlukan autentikasi (*Login*) untuk mengaksesnya.

### 2. Tier 2: Application Layer (Backend RESTful API)
Ini adalah "otak" dari sistem WebifyLab. Lapisan ini murni menangani logika bisnis, keamanan, dan memproses *request* dari *Frontend*.

*   **Teknologi Utama:** **Golang** dipadukan dengan framework **Gin**. Pemilihan ini didasarkan pada performa *routing* API yang sangat cepat (high-performance) dengan konsumsi *resource* (RAM/CPU) yang minimal.
*   **Komunikasi Data:** Backend berkomunikasi dengan *Frontend* menggunakan standar **RESTful API**, menerima dan mengirimkan data dalam format **JSON**.
*   **Keamanan (Auth & Authz):** Mengimplementasikan **JWT (JSON Web Token)**. Saat admin *login*, backend menerbitkan token. Token ini wajib disertakan di *header* (`Authorization: Bearer <token>`) pada setiap *request* ke *endpoint* admin.
*   **File Handling:** Mengatur proses penerimaan *upload* aset gambar (`multipart/form-data`), memvalidasi tipe file (`mime_type`), dan menyimpannya ke *storage*.

#### 🧠 Arsitektur Internal Backend (Clean Architecture Pattern)
Agar kode Golang tetap rapi, *testable*, dan tidak *coupled* seiring berkembangnya fitur, backend mengadopsi pola desain berlapis:

1.  **Router / Handler:** Lapisan terdepan. Menerima *request* HTTP, mengurai JSON/Form-Data, dan melakukan validasi input dasar.
2.  **Service (Usecase):** Berisi inti aturan bisnis. Contoh: memvalidasi apakah ukuran gambar melebihi batas, memastikan slug unik, atau mengatur logika *polymorphic relation*.
3.  **Repository:** Lapisan yang khusus bertugas mengeksekusi perintah (query) ke *database*. Handler dan Service tidak boleh tahu cara menulis query SQL; mereka hanya memanggil method dari Repository.

### 3. Tier 3: Data Access & Storage Layer
Lapisan terbawah yang bertugas menyimpan seluruh data dan *state* aplikasi secara persisten dan terstruktur.

*   **Database Relasional:** Menggunakan **PostgreSQL**. Database ini dihubungkan ke backend Golang melalui ORM **GORM**. GORM memudahkan pemetaan struktur tabel kompleks (seperti *Polymorphic Association* pada `media_assets`) menjadi *struct* kode tanpa perlu menulis *raw SQL* yang panjang.
*   **Media Storage:** Tempat penyimpanan fisik untuk file gambar. 
    *   **Fase Awal:** Disimpan di direktori server lokal (misal: `/public/uploads`).
    *   **Desain Decoupled:** Arsitektur penyimpanan file dibuat abstrak (menggunakan *interface* di Golang). Ini memastikan bahwa jika sewaktu-waktu kita ingin memindahkannya ke layanan *Cloud Storage* (seperti AWS S3 atau Google Cloud Storage), kita hanya perlu mengubah konfigurasi di satu tempat tanpa merusak logika bisnis di lapisan *Service*.

---

## 🔄 Alur Kerja Sistem (System Flow)

Sebagai ilustrasi, berikut adalah langkah-langkah bagaimana lapisan-lapisan ini bekerja sama saat pengunjung membuka halaman portofolio:

1.  **Request:** Pengunjung membuka `webifylab.my.id/portfolios`. *Frontend* mengirimkan *request* HTTP `GET` ke *Backend API*.
2.  **Routing:** *Router* Gin di *Backend* menerima *request* tersebut dan meneruskannya ke `PortfolioHandler`.
3.  **Business Logic:** `PortfolioHandler` memanggil `PortfolioService`.
4.  **Data Retrieval:** `PortfolioService` meminta data ke `PortfolioRepository`.
5.  **Database Query:** `PortfolioRepository` (menggunakan GORM) melakukan *query* ke **PostgreSQL** untuk menarik data tabel `portfolios`, di-*join* dengan `technologies`, dan menarik data `media_assets` yang berstatus `is_primary = true`.
6.  **Response:** PostgreSQL mengembalikan data ke *Backend*. *Backend* membungkus data tersebut ke dalam format JSON standar dan mengirimkannya kembali ke *Frontend* (HTTP 200 OK).
7.  **Rendering:** *Frontend* menerima JSON, lalu Tailwind CSS bertugas merendernya menjadi kartu-kartu portofolio yang indah di layar pengguna.

---

## 📂 Struktur Folder Backend (Golang)

Berikut adalah implementasi nyata dari pola *Handler-Service-Repository* di dalam struktur folder proyek:

```text
backend/
├── cmd/
│   └── main.go                 # Entry point aplikasi (inisialisasi server Gin)
├── internal/
│   ├── handler/                # Menerima request HTTP, parsing JSON, validasi dasar
│   │   ├── portfolio_handler.go
│   │   └── auth_handler.go
│   ├── service/                # Logika bisnis utama (Usecase)
│   │   ├── portfolio_service.go
│   │   └── auth_service.go
│   ├── repository/             # Query database (GORM)
│   │   ├── portfolio_repo.go
│   │   └── user_repo.go
│   ├── model/                  # Struct entitas database (Mapping ke tabel)
│   │   ├── portfolio.go
│   │   └── user.go
│   └── dto/                    # Data Transfer Object (Format Request/Response JSON)
│       ├── portfolio_dto.go
│       └── auth_dto.go
├── pkg/                        # Package utilitas yang bisa dipakai ulang (Reusable)
│   ├── auth/                   # Utilitas Generate & Verify JWT
│   ├── response/               # Helper format response JSON standar
│   └── middleware/             # Middleware autentikasi (Cek Bearer Token)
├── config/                     # Konfigurasi DB, Environment Variables
└── go.mod                      # Dependency management
```
```

***