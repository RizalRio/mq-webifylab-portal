package model

type Technology struct {
	ID      uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name    string  `gorm:"type:varchar(100);not null;unique" json:"name"`
	IconURL *string `gorm:"type:varchar(255)" json:"icon_url"`
}
