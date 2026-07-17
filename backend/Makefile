# Mendefinisikan perintah-perintah agar tidak bentrok dengan nama folder/file
.PHONY: dev build run clean

# Menjalankan server lokal dengan fitur hot-reload (Air)
dev:
	@echo "🚀 Menjalankan CompileDaemon..."
	CompileDaemon -command="./tmp/main.exe" -build="go build -o ./tmp/main.exe ./cmd/main.go"

# Melakukan compile aplikasi untuk production
build:
	@echo "🛠️ Membangun binary aplikasi..."
	go build -o ./tmp/main.exe ./cmd/main.go
	@echo "✅ Build selesai!"

# Menjalankan binary yang sudah di-compile tanpa fitur reload
run: build
	@echo "🚀 Menjalankan aplikasi..."
	./tmp/main

# Membersihkan file sementara dan hasil build lama
clean:
	@echo "🧹 Membersihkan folder tmp..."
	@if exist tmp rmdir /s /q tmp
	@echo "✅ Bersih!"

# Menjalankan database seeder
seed:
	@echo "🌱 Menjalankan Seeder..."
	go run ./cmd/seeder/main.go