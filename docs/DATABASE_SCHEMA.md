```markdown
# 📊 WebifyLab - Database Schema Documentation

Dokumen ini berisi spesifikasi teknis struktur database untuk pengembangan backend dan manajemen data pada proyek **WebifyLab**. Database ini dirancang menggunakan pendekatan relasional (PostgreSQL) dengan fitur *Polymorphic Association* untuk manajemen media yang fleksibel.

## 🗺️ 1. Gambaran Umum Relasi (ERD Overview)

- **`users`**: *Standalone* (Autentikasi Admin).
- **`portfolios`** ↔ **`technologies`**: Relasi *Many-to-Many* melalui tabel pivot **`portfolio_technologies`**.
- **`portfolios`** & **`saas_products`** ← **`media_assets`**: Relasi *Polymorphic One-to-Many*. Satu entitas bisa memiliki banyak gambar.
- **`contact_messages`**: *Standalone* (Menampung *inbox* dari *public user*).

---

## 📖 2. Kamus Data (Data Dictionary)

### 2.1. Tabel `users`
**Fungsi:** Autentikasi admin untuk akses *back-office*.
| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGSERIAL | `PRIMARY KEY` | ID unik admin (Auto-increment). |
| `name` | VARCHAR(255) | `NOT NULL` | Nama lengkap admin. |
| `email` | VARCHAR(255) | `NOT NULL`, `UNIQUE` | Email untuk login. |
| `password` | VARCHAR(255) | `NOT NULL` | Hash password (disarankan bcrypt/argon2). |
| `created_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu pembuatan akun. |
| `updated_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu pembaruan data. |

### 2.2. Tabel `portfolios`
**Fungsi:** Menyimpan data proyek (komersial & R&D).
| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGSERIAL | `PRIMARY KEY` | ID unik portofolio. |
| `title` | VARCHAR(255) | `NOT NULL` | Judul proyek. |
| `description` | TEXT | `NOT NULL` | Detail studi kasus/solusi. |
| `client_name` | VARCHAR(255) | `NULLABLE` | Nama klien (Kosongkan jika proyek R&D). |
| `project_url` | VARCHAR(255) | `NULLABLE` | Tautan live website. |
| `created_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu pembuatan. |
| `updated_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu pembaruan. |

### 2.3. Tabel `technologies`
**Fungsi:** Master data *tech stack*.
| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGSERIAL | `PRIMARY KEY` | ID unik teknologi. |
| `name` | VARCHAR(100) | `NOT NULL`, `UNIQUE` | Nama teknologi (misal: Laravel). |
| `icon_url` | VARCHAR(255) | `NULLABLE` | URL ikon/logo. |

### 2.4. Tabel `portfolio_technologies`
**Fungsi:** Pivot table relasi *Many-to-Many*.
| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `portfolio_id` | BIGINT | `FK -> portfolios.id`, `ON DELETE CASCADE` | ID portofolio. |
| `technology_id` | BIGINT | `FK -> technologies.id`, `ON DELETE CASCADE` | ID teknologi. |
*(Catatan: Kombinasi `portfolio_id` dan `technology_id` bertindak sebagai Composite Primary Key).*

### 2.5. Tabel `saas_products`
**Fungsi:** Etalase produk SaaS.
| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGSERIAL | `PRIMARY KEY` | ID unik produk. |
| `name` | VARCHAR(255) | `NOT NULL` | Nama produk SaaS. |
| `slug` | VARCHAR(100) | `NOT NULL`, `UNIQUE` | URL ramah SEO. |
| `tagline` | VARCHAR(255) | `NOT NULL` | Hook promosi. |
| `description` | TEXT | `NOT NULL` | Penjelasan fitur. |
| `subdomain_url` | VARCHAR(255) | `NOT NULL` | Link aplikasi (misal: `https://pos...`). |
| `is_active` | BOOLEAN | `DEFAULT TRUE` | Status tayang. |
| `created_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu pembuatan. |
| `updated_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu pembaruan. |

### 2.6. Tabel `media_assets`
**Fungsi:** Polymorphic table untuk semua aset gambar.
| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGSERIAL | `PRIMARY KEY` | ID unik media. |
| `file_name` | VARCHAR(255) | `NOT NULL` | Nama file fisik. |
| `file_url` | VARCHAR(255) | `NOT NULL` | Path/URL akses file. |
| `mime_type` | VARCHAR(100) | `NOT NULL` | Tipe MIME (misal: `image/webp`). |
| `mediable_type` | VARCHAR(100) | `NOT NULL` | Entitas pemilik (`'portfolios'` / `'saas_products'`). |
| `mediable_id` | BIGINT | `NOT NULL` | ID dari entitas pemilik. |
| `is_primary` | BOOLEAN | `DEFAULT FALSE` | Penanda gambar utama/thumbnail. |
| `created_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu *upload*. |
| `updated_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu modifikasi. |

### 2.7. Tabel `contact_messages`
**Fungsi:** Menampung *leads* dari formulir kontak.
| Kolom | Tipe Data | Constraint | Keterangan |
|---|---|---|---|
| `id` | BIGSERIAL | `PRIMARY KEY` | ID unik pesan. |
| `sender_name` | VARCHAR(255) | `NOT NULL` | Nama pengirim. |
| `sender_email` | VARCHAR(255) | `NOT NULL` | Email pengirim. |
| `sender_phone` | VARCHAR(50) | `NULLABLE` | Nomor WA/Telepon. |
| `subject` | VARCHAR(255) | `NOT NULL` | Subjek pesan. |
| `message` | TEXT | `NOT NULL` | Isi pesan. |
| `is_read` | BOOLEAN | `DEFAULT FALSE` | Status sudah dibaca. |
| `created_at` | TIMESTAMP | `DEFAULT CURRENT_TIMESTAMP` | Waktu pesan diterima. |

---

## 🔗 3. Aturan Bisnis & Relasi (Business Rules)

1. **Cascade Deleting**: Pada tabel `portfolio_technologies`, jika sebuah portofolio dihapus dari tabel `portfolios`, maka seluruh catatan teknologi yang terkait dengan portofolio tersebut akan **otomatis terhapus** (`ON DELETE CASCADE`).
2. **Polymorphic Media**: Tabel `media_assets` tidak memiliki *Foreign Key* konvensional. Relasi dijembatani oleh dua kolom: `mediable_type` (String nama tabel) dan `mediable_id` (ID baris).
   - *Contoh*: Untuk mengambil gambar portofolio ID 5, query-nya adalah: `WHERE mediable_type = 'portfolios' AND mediable_id = 5`.
3. **Soft Deletion (Opsional)**: Sangat disarankan untuk mengimplementasikan *Soft Deletes* di level ORM pada tabel `portfolios`, `saas_products`, dan `users` untuk mencegah hilangnya data secara permanen saat admin salah klik hapus.

---

## ⚡ 4. Rekomendasi Indexing (Untuk Optimasi Query)

Untuk memastikan performa *backend* tetap ngebut saat data mulai banyak, tambahkan *Index* pada kolom-kolom berikut di database:

```sql
-- Index untuk pencarian berdasarkan slug produk
CREATE INDEX idx_saas_slug ON saas_products(slug);

-- Index untuk filter status produk aktif
CREATE INDEX idx_saas_active ON saas_products(is_active);

-- Index untuk filter pesan yang belum dibaca di dashboard admin
CREATE INDEX idx_messages_read ON contact_messages(is_read);

-- Composite Index untuk query Polymorphic Media (Sangat Krusial!)
CREATE INDEX idx_media_polymorphic ON media_assets(mediable_type, mediable_id);

-- Index untuk Foreign Key di tabel pivot
CREATE INDEX idx_pivot_portfolio ON portfolio_technologies(portfolio_id);
CREATE INDEX idx_pivot_tech ON portfolio_technologies(technology_id);
```

---

## 🌱 5. Contoh Data (Seed Data Mockup)

Sebagai bayangan saat melakukan *seeding* atau *mockup* API:

**`technologies`**
| id | name | icon_url |
|---|---|---|
| 1 | Laravel | /icons/laravel.svg |
| 2 | PostgreSQL | /icons/pg.svg |

**`portfolios`**
| id | title | client_name |
|---|---|---|
| 10 | Sistem ERP Terintegrasi | PT Maju Jaya |
| 11 | WebifyLab Company Profile | NULL *(R&D)* |

**`portfolio_technologies`**
| portfolio_id | technology_id |
|---|---|
| 10 | 1 |
| 10 | 2 |

**`media_assets`**
| id | file_url | mediable_type | mediable_id | is_primary |
|---|---|---|---|---|
| 1 | /uploads/erp_cover.webp | portfolios | 10 | true |
| 2 | /uploads/erp_ss1.webp | portfolios | 10 | false |
```