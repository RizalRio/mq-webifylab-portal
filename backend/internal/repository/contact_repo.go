package repository

import (
	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"gorm.io/gorm"
)

type ContactRepository interface {
	Create(message *model.ContactMessage) error
	FindAll(params dto.PaginationQueryParams) ([]model.ContactMessage, int64, error)
	FindByID(id uint) (model.ContactMessage, error)
	MarkAsRead(id uint) error
	Delete(id uint) error
}

type contactRepository struct {
	db *gorm.DB
}

func NewContactRepository(db *gorm.DB) ContactRepository {
	return &contactRepository{db}
}

func (r *contactRepository) Create(message *model.ContactMessage) error {
	return r.db.Create(message).Error
}

func (r *contactRepository) FindAll(params dto.PaginationQueryParams) ([]model.ContactMessage, int64, error) {
	var messages []model.ContactMessage
	var totalData int64

	// 1. Inisialisasi query dasar
	query := r.db.Model(&model.ContactMessage{})

	// 2. Logika Pencarian (Jika parameter search diisi oleh user)
	if params.Search != "" {
		// Mencari berdasarkan nama pengirim atau subjek pesan (Case-Insensitive Menggunakan ILIKE di PostgreSQL)
		searchTerm := "%" + params.Search + "%"
		query = query.Where("sender_name ILIKE ? OR subject ILIKE ?", searchTerm, searchTerm)
	}

	// 3. Hitung total data yang cocok dengan kriteria pencarian sebelum dipotong paginasi
	if err := query.Count(&totalData).Error; err != nil {
		return nil, 0, err
	}

	// 4. Hitung Offset untuk melompati data halaman sebelumnya
	// Rumus: (page - 1) * limit
	offset := (params.Page - 1) * params.Limit

	// 5. Eksekusi query dengan Limit, Offset, dan Order terbaru
	err := query.Order("created_at desc").Limit(params.Limit).Offset(offset).Find(&messages).Error

	return messages, totalData, err
}

func (r *contactRepository) FindByID(id uint) (model.ContactMessage, error) {
	var message model.ContactMessage
	err := r.db.First(&message, id).Error
	return message, err
}

func (r *contactRepository) MarkAsRead(id uint) error {
	// Mengubah field is_read menjadi true
	return r.db.Model(&model.ContactMessage{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *contactRepository) Delete(id uint) error {
	var message model.ContactMessage
	if err := r.db.First(&message, id).Error; err != nil {
		return err
	}
	return r.db.Delete(&message).Error
}
