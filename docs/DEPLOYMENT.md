```markdown
# 🚀 WebifyLab - Deployment Guide

Dokumen ini memandu proses *deployment* aplikasi WebifyLab ke server produksi (VPS) menggunakan **Docker** dan **Docker Compose**. 

Mengingat spesifikasi server yang digunakan relatif terbatas (**RAM 1GB, Storage 20GB**), panduan ini sangat menekankan pada **efisiensi resource**, **keamanan**, dan **persistensi data**.

---

## 📋 1. Prasyarat & Spesifikasi Server

*   **VPS**: Minimal 1 vCPU, 1GB RAM, 20GB SSD.
*   **OS**: Ubuntu 22.04 LTS / Debian 12 (Direkomendasikan).
*   **Software**: Docker & Docker Compose (Latest Stable).
*   **Domain**: `webifylab.my.id` (Sudah diarahkan *A Record*-nya ke IP Public VPS).

---

## ⚡ 2. Strategi Optimasi VPS (Wajib Dilakukan)

Sebelum menyentuh Docker, server harus dipersiapkan agar tidak *crash* saat proses *build* atau *traffic spike*.

### A. Buat Swap Memory (Sangat Penting!)
Karena RAM fisik hanya 1GB, proses *compile* Golang atau *build* frontend bisa membuat VPS kehabisan memori (OOM Killed). **Wajib** membuat *Swap space* sebesar 2GB.
```bash
# Buat file swap 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Agar permanen setelah reboot
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### B. Frontend Berbasis Static (SSG)
Hindari menjalankan Node.js server (seperti Next.js SSR) di VPS 1GB. Terapkan *Static Site Generation* (SSG). *Build* frontend menjadi sekumpulan file HTML/CSS/JS statis, lalu *serve* langsung menggunakan Nginx. Ini akan memangkas konsumsi RAM secara drastis (hampir 0% saat *idle*).

### C. Gunakan Image Alpine
Untuk setiap *container* Docker, gunakan basis sistem operasi **Alpine Linux** (misal: `postgres:15-alpine`, `golang:1.21-alpine`). Ini akan menghemat *storage* 20GB secara signifikan karena ukuran *image* Alpine jauh lebih kecil dibanding Debian/Ubuntu.

---

## 🐳 3. Arsitektur Container Docker

Kita menggunakan **Docker Compose** untuk mengorkestrasi 3 *container* utama yang saling terisolasi namun berkomunikasi melalui *network* internal Docker (`webifylab_network`).

1.  **`db` (PostgreSQL)**: Menjalankan *database*. Data di-*mount* ke *volume* lokal agar persisten.
2.  **`api` (Golang Backend)**: Menjalankan *binary* Golang. Konsumsi RAM sangat rendah (bisa di bawah 30MB).
3.  **`web` (Nginx)**: Berperan ganda sebagai *Web Server* (menyajikan file statis frontend) dan **Reverse Proxy** (meneruskan `/api/*` ke container Golang) sekaligus pengelola SSL.

---

## 🛠️ 4. Konfigurasi Docker (Multi-Stage Build)

Agar *image* Docker tidak membengkak (ratusan MB menjadi hanya ~20MB), kita gunakan teknik **Multi-Stage Build**.

### A. `Dockerfile` untuk Backend (Golang)
```dockerfile
# Stage 1: Build Binary
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Build dengan CGO disabled untuk static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

# Stage 2: Run Binary (Hanya menyalin binary, tanpa source code)
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
# Buat folder untuk media upload
RUN mkdir -p /app/uploads
EXPOSE 8080
CMD ["./main"]
```

### B. `docker-compose.yml`
File ini menyatukan semua *container*, *volume*, dan *network*.
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - webifylab_network

  api:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    environment:
      - DB_HOST=db
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - media_uploads:/app/uploads # Persistent storage untuk gambar
    depends_on:
      - db
    networks:
      - webifylab_network

  web:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html # File statis frontend (SSG)
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - media_uploads:/usr/share/nginx/html/uploads # Share folder upload dari API
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
    depends_on:
      - api
    networks:
      - webifylab_network

volumes:
  pgdata:
  media_uploads:
  certbot-etc:
  certbot-var:

networks:
  webifylab_network:
    driver: bridge
```

### C. `nginx.conf` (Reverse Proxy & Static Server)
```nginx
server {
    listen 80;
    server_name webifylab.my.id;

    # Serve Frontend Static Files
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html; # Fallback untuk SPA routing
    }

    # Serve Uploaded Media (Polymorphic Assets)
    location /uploads/ {
        alias /usr/share/nginx/html/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Reverse Proxy ke Golang API
    location /api/ {
        proxy_pass http://api:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🚀 5. Langkah Eksekusi Deployment

### Langkah 1: Persiapan Environment
Di dalam VPS, buat file `.env` di direktori root proyek untuk menyimpan *secret*.
```bash
nano .env
```
Isi dengan:
```env
DB_USER=webify_user
DB_PASSWORD=super_secret_password_123
DB_NAME=webifylab_db
JWT_SECRET=your_jwt_secret_key_here
```

### Langkah 2: Build & Jalankan Container
Pastikan kamu sudah melakukan `git pull` kode terbaru, lalu jalankan:
```bash
docker-compose up -d --build
```
Perintah ini akan mengunduh *image*, melakukan *compile* Golang di dalam container, dan menjalankan semuanya di *background*.

### Langkah 3: Setup SSL (HTTPS) dengan Certbot
Gunakan Certbot untuk mendapatkan SSL gratis dari Let's Encrypt.
```bash
# Install certbot di VPS (Host machine)
sudo apt install certbot

# Generate SSL (Pastikan port 80 tidak diblokir firewall)
sudo certbot certonly --standalone -d webifylab.my.id

# Copy sertifikat ke volume Docker agar bisa dibaca Nginx
sudo cp -Lr /etc/letsencrypt/live/webifylab.my.id /var/lib/docker/volumes/webifylab_certbot-etc/_data/live/
```
*(Catatan: Setelah SSL aktif, ubah `nginx.conf` untuk me-*listen* port 443 dan menambahkan blok `ssl_certificate`)*.

---

## 🧹 6. Manajemen Storage & Maintenance (Peringatan 20GB)

*Storage* 20GB akan cepat penuh oleh *system logs*, *build cache*, dan *dangling images*.

### A. Otomatisasi Pruning (Cron Job)
Jadwalkan pembersihan *cache* Docker setiap minggu agar storage tidak penuh.
```bash
crontab -e
```
Tambahkan baris ini untuk menjalankan *prune* setiap hari Minggu jam 3 pagi:
```text
0 3 * * 0 docker system prune -af --volumes >> /var/log/docker-prune.log 2>&1
```
*(Peringatan: `--volumes` akan menghapus volume yang tidak dipakai oleh container manapun. Pastikan volume `pgdata` dan `media_uploads` tetap ter-attach).*

### B. Backup Database Rutin
Jangan sampai data hilang! Buat *script* sederhana untuk mem-backup PostgreSQL ke file `.sql` dan unggah ke cloud storage (atau download manual via SCP).
```bash
# Contoh command backup
docker-compose exec -T db pg_dump -U $DB_USER $DB_NAME > backup_$(date +%F).sql
```

---

## 🩺 7. Monitoring & Troubleshooting

*   **Cek Status Container**: `docker-compose ps`
*   **Lihat Logs API**: `docker-compose logs -f api`
*   **Lihat Logs Nginx**: `docker-compose logs -f web`
*   **Masuk ke dalam Database**: `docker-compose exec db psql -U webify_user -d webifylab_db`
*   **Restart Service Tertentu**: `docker-compose restart api`

Dengan arsitektur ini, WebifyLab dapat berjalan sangat stabil di VPS 1GB RAM, dengan keamanan SSL, performa tinggi dari Golang & Nginx, serta efisiensi storage berkat Alpine & Multi-stage build.
```