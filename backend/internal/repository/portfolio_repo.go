package repository

import (
	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"gorm.io/gorm"
)

type PortfolioRepository interface {
	FindAll(params dto.PaginationQueryParams) ([]model.Portfolio, int64, error)
	FindByID(id uint) (model.Portfolio, error)
	Create(portfolio *model.Portfolio, techIDs []uint) error
	Update(id uint, portfolio *model.Portfolio, techIDs []uint) error
	Delete(id uint) error
}

type portfolioRepository struct {
	db *gorm.DB
}

func NewPortfolioRepository(db *gorm.DB) PortfolioRepository {
	return &portfolioRepository{db}
}

func (r *portfolioRepository) FindAll(params dto.PaginationQueryParams) ([]model.Portfolio, int64, error) {
	var portfolios []model.Portfolio
	var totalData int64

	query := r.db.Model(&model.Portfolio{})

	// Logika Pencarian
	if params.Search != "" {
		searchTerm := "%" + params.Search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", searchTerm, searchTerm)
	}

	// Hitung Total Data
	if err := query.Count(&totalData).Error; err != nil {
		return nil, 0, err
	}

	// Hitung Offset & Eksekusi Query
	offset := (params.Page - 1) * params.Limit
	err := query.Preload("Technologies").
		Preload("MediaAssets").
		Order("created_at desc").
		Limit(params.Limit).
		Offset(offset).
		Find(&portfolios).Error

	return portfolios, totalData, err
}

func (r *portfolioRepository) FindByID(id uint) (model.Portfolio, error) {
	var portfolio model.Portfolio
	// Tarik semua relasinya untuk halaman detail
	err := r.db.Preload("Technologies").Preload("MediaAssets").First(&portfolio, id).Error
	return portfolio, err
}

func (r *portfolioRepository) Create(portfolio *model.Portfolio, techIDs []uint) error {
	// Memulai transaksi database agar aman
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 1. Cari data teknologi berdasarkan ID yang dikirim
		var techs []model.Technology
		if len(techIDs) > 0 {
			if err := tx.Where("id IN ?", techIDs).Find(&techs).Error; err != nil {
				return err
			}
		}

		// 2. Tempelkan teknologi ke dalam objek portofolio
		portfolio.Technologies = techs

		// 3. Simpan ke database (GORM akan otomatis mengisi tabel pivot portfolio_technologies)
		if err := tx.Create(portfolio).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *portfolioRepository) Update(id uint, portfolio *model.Portfolio, techIDs []uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 1. Pastikan portofolio dengan ID tersebut ada
		var existing model.Portfolio
		if err := tx.First(&existing, id).Error; err != nil {
			return err
		}

		// 2. Perbarui field dasar (Title, Description, ClientName, ProjectURL)
		if err := tx.Model(&existing).Updates(portfolio).Error; err != nil {
			return err
		}

		// 3. Tarik data teknologi yang baru
		var techs []model.Technology
		if len(techIDs) > 0 {
			if err := tx.Where("id IN ?", techIDs).Find(&techs).Error; err != nil {
				return err
			}
		}

		// 4. Timpa (Replace) relasi lama di tabel pivot dengan yang baru
		if err := tx.Model(&existing).Association("Technologies").Replace(techs); err != nil {
			return err
		}

		return nil
	})
}

func (r *portfolioRepository) Delete(id uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 1. Cari data portofolio terlebih dahulu untuk memastikan ID-nya ada
		var portfolio model.Portfolio
		if err := tx.First(&portfolio, id).Error; err != nil {
			return err // Mengembalikan ErrRecordNotFound jika data tidak ada
		}

		// 2. Bersihkan hubungan Many-to-Many di tabel pivot (portfolio_technologies)
		// Ini akan menghapus baris di tabel pivot yang memiliki portfolio_id = id
		if err := tx.Model(&portfolio).Association("Technologies").Clear(); err != nil {
			return err
		}

		// 3. Bersihkan data Polymorphic Media Assets yang menempel pada portofolio ini
		// Agar tidak ada data gambar yang menjadi "yatim piatu" di database
		if err := tx.Where("mediable_type = ? AND mediable_id = ?", "portfolios", id).Delete(&model.MediaAsset{}).Error; err != nil {
			return err
		}

		// 4. Setelah semua relasi bersih, barulah aman untuk menghapus data induknya
		if err := tx.Delete(&portfolio).Error; err != nil {
			return err
		}

		return nil
	})
}
