package model

import "time"

type Portfolio struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `gorm:"type:text;not null" json:"description"`
	ClientName  *string   `gorm:"type:varchar(255)" json:"client_name"`
	ProjectURL  *string   `gorm:"type:varchar(255)" json:"project_url"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relasi GORM (Otomatis ditangani)
	Technologies []Technology `gorm:"many2many:portfolio_technologies;" json:"technologies"`
	MediaAssets  []MediaAsset `gorm:"polymorphic:Mediable;polymorphicValue:portfolios" json:"media_assets"`
}
