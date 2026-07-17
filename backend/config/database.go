package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/RizalRio/webifylab-backend/internal/model"
)

var DB *gorm.DB

func ConnectDB() {
	// Load file .env
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Error loading .env file, reading from system env instead")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	fmt.Println("✅ Database connection successful!")

	// Menjalankan Auto Migration
	err = db.AutoMigrate(
		&model.User{},
		&model.Technology{},
		&model.Portfolio{},
		&model.SaaSProduct{},
		&model.MediaAsset{},
		&model.ContactMessage{},
	)

	if err != nil {
		log.Fatal("Failed to auto-migrate database: ", err)
	}

	fmt.Println("✅ Database migration completed!")
	DB = db
}
