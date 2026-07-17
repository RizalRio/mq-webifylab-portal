package main

import (
	"fmt"

	"github.com/RizalRio/webifylab-backend/config"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// 1. Koneksi ke Database menggunakan config yang sudah kita buat
	config.ConnectDB()
	db := config.DB

	fmt.Println("🌱 Menjalankan Database Seeder...")

	// 2. Membersihkan data lama (Opsional, agar seeder bisa di-run berulang kali tanpa error duplikat)
	db.Exec("TRUNCATE TABLE users, portfolios, technologies, portfolio_technologies, media_assets RESTART IDENTITY CASCADE")

	// 3. Seed User (Admin)
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	admin := model.User{
		Name:     "Admin WebifyLab",
		Email:    "admin@webifylab.my.id",
		Password: string(hashedPassword),
	}
	db.Create(&admin)
	fmt.Println("✅ Admin user seeded!")

	// 4. Seed Technologies
	techs := []model.Technology{
		{Name: "Golang", IconURL: func(s string) *string { return &s }("/icons/golang.svg")},
		{Name: "PostgreSQL", IconURL: func(s string) *string { return &s }("/icons/postgres.svg")},
		{Name: "Flutter", IconURL: func(s string) *string { return &s }("/icons/flutter.svg")},
		{Name: "Next.js", IconURL: func(s string) *string { return &s }("/icons/nextjs.svg")},
	}
	db.Create(&techs)
	fmt.Println("✅ Technologies seeded!")

	// 5. Seed Portfolios & Polymorphic Media
	// Menggunakan mock data dari skema
	clientName := "PT Maju Jaya"
	portfolio1 := model.Portfolio{
		Title:       "Sistem ERP Terintegrasi",
		Description: "Platform ERP custom dengan arsitektur microservices dan RBAC kompleks.",
		ClientName:  &clientName,
		// Menghubungkan relasi many-to-many
		Technologies: []model.Technology{techs[0], techs[1]},
		// Menghubungkan relasi polymorphic media
		MediaAssets: []model.MediaAsset{
			{FileName: "erp_cover.webp", FileURL: "/uploads/erp_cover.webp", MimeType: "image/webp", IsPrimary: true},
			{FileName: "erp_ss1.webp", FileURL: "/uploads/erp_ss1.webp", MimeType: "image/webp", IsPrimary: false},
		},
	}

	portfolio2 := model.Portfolio{
		Title:        "WebifyLab Company Profile",
		Description:  "Proyek R&D untuk profil agensi, eksplorasi arsitektur Clean Architecture.",
		ClientName:   nil, // Proyek R&D/Internal
		Technologies: []model.Technology{techs[0], techs[3]},
		MediaAssets: []model.MediaAsset{
			{FileName: "webify_cover.webp", FileURL: "/uploads/webify_cover.webp", MimeType: "image/webp", IsPrimary: true},
		},
	}

	db.Create(&portfolio1)
	db.Create(&portfolio2)
	fmt.Println("✅ Portfolios & Media Assets seeded!")

	fmt.Println("🎉 Seeding selesai dengan sukses!")
}
