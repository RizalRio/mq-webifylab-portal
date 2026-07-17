package model

import "time"

type SaaSProduct struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Name         string    `gorm:"type:varchar(255);not null" json:"name"`
	Slug         string    `gorm:"type:varchar(100);not null;unique" json:"slug"`
	Tagline      string    `gorm:"type:varchar(255);not null" json:"tagline"`
	Description  string    `gorm:"type:text;not null" json:"description"`
	SubdomainURL string    `gorm:"type:varchar(255);not null" json:"subdomain_url"`
	IsActive     bool      `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relasi GORM
	MediaAssets []MediaAsset `gorm:"polymorphic:Mediable;polymorphicValue:saas_products" json:"media_assets"`
}
