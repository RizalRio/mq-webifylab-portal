package model

import "time"

type ContactMessage struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	SenderName  string    `gorm:"type:varchar(255);not null" json:"sender_name"`
	SenderEmail string    `gorm:"type:varchar(255);not null" json:"sender_email"`
	SenderPhone *string   `gorm:"type:varchar(50)" json:"sender_phone"`
	Subject     string    `gorm:"type:varchar(255);not null" json:"subject"`
	Message     string    `gorm:"type:text;not null" json:"message"`
	IsRead      bool      `gorm:"default:false" json:"is_read"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}
