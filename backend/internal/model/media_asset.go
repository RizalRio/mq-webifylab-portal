package model

import "time"

type MediaAsset struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	FileName     string    `gorm:"type:varchar(255);not null" json:"file_name"`
	FileURL      string    `gorm:"type:varchar(255);not null" json:"file_url"`
	MimeType     string    `gorm:"type:varchar(100);not null" json:"mime_type"`
	MediableType string    `gorm:"type:varchar(100);not null" json:"mediable_type"`
	MediableID   uint      `gorm:"not null" json:"mediable_id"`
	IsPrimary    bool      `gorm:"default:false" json:"is_primary"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
