package repository

import (
	"github.com/RizalRio/webifylab-backend/internal/model"
	"gorm.io/gorm"
)

type MediaRepository interface {
	Create(media *model.MediaAsset) error
}

type mediaRepository struct {
	db *gorm.DB
}

func NewMediaRepository(db *gorm.DB) MediaRepository {
	return &mediaRepository{db}
}

func (r *mediaRepository) Create(media *model.MediaAsset) error {
	return r.db.Create(media).Error
}
