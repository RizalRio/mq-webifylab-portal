package repository

import (
	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"gorm.io/gorm"
)

type SaaSRepository interface {
	FindAllActive(params dto.PaginationQueryParams) ([]model.SaaSProduct, int64, error)
	FindByIDWithMedia(id uint) (model.SaaSProduct, error)
	Create(saas *model.SaaSProduct) error
	Update(id uint, saas *model.SaaSProduct) error
	Delete(id uint) error
}

type saasRepository struct {
	db *gorm.DB
}

func NewSaaSRepository(db *gorm.DB) SaaSRepository {
	return &saasRepository{db}
}

func (r *saasRepository) FindAllActive(params dto.PaginationQueryParams) ([]model.SaaSProduct, int64, error) {
	var products []model.SaaSProduct
	var totalData int64

	// Wajib hanya yang aktif
	query := r.db.Model(&model.SaaSProduct{}).Where("is_active = ?", true)

	if params.Search != "" {
		searchTerm := "%" + params.Search + "%"
		query = query.Where("name ILIKE ? OR tagline ILIKE ?", searchTerm, searchTerm)
	}

	if err := query.Count(&totalData).Error; err != nil {
		return nil, 0, err
	}

	offset := (params.Page - 1) * params.Limit
	err := query.Preload("MediaAssets").
		Order("created_at desc").
		Limit(params.Limit).
		Offset(offset).
		Find(&products).Error

	return products, totalData, err
}
func (r *saasRepository) Create(saas *model.SaaSProduct) error {
	return r.db.Create(saas).Error
}

func (r *saasRepository) FindByIDWithMedia(id uint) (model.SaaSProduct, error) {
	var saas model.SaaSProduct
	// Cari berdasarkan ID dan muat relasi Polymorphic Media Assets-nya
	err := r.db.Preload("MediaAssets").First(&saas, id).Error
	return saas, err
}

func (r *saasRepository) Update(id uint, saas *model.SaaSProduct) error {
	return r.db.Model(&model.SaaSProduct{}).Where("id = ?", id).Updates(saas).Error
}

func (r *saasRepository) Delete(id uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 1. Pastikan produk SaaS-nya ada di database
		var saas model.SaaSProduct
		if err := tx.First(&saas, id).Error; err != nil {
			return err // Mengembalikan ErrRecordNotFound jika ID tidak ada
		}

		// 2. Bersihkan data Polymorphic Media Assets yang menempel pada produk SaaS ini
		// Menggunakan target mediable_type = 'saas_products' sesuai kamus data
		if err := tx.Where("mediable_type = ? AND mediable_id = ?", "saas_products", id).Delete(&model.MediaAsset{}).Error; err != nil {
			return err
		}

		// 3. Hapus data induk SaaS Product setelah relasi medianya bersih
		if err := tx.Delete(&saas).Error; err != nil {
			return err
		}

		return nil
	})
}
