package repository

import (
	"github.com/RizalRio/webifylab-backend/internal/model"
	"gorm.io/gorm"
)

type TechnologyRepository interface {
	Create(tech *model.Technology) error
	FindAll() ([]model.Technology, error)
	FindByID(id uint) (model.Technology, error)
	Update(id uint, tech *model.Technology) error
	Delete(id uint) error
}

type technologyRepository struct {
	db *gorm.DB
}

func NewTechnologyRepository(db *gorm.DB) TechnologyRepository {
	return &technologyRepository{db}
}

func (r *technologyRepository) Create(tech *model.Technology) error {
	return r.db.Create(tech).Error
}

func (r *technologyRepository) FindAll() ([]model.Technology, error) {
	var techs []model.Technology
	err := r.db.Order("name asc").Find(&techs).Error
	return techs, err
}

func (r *technologyRepository) FindByID(id uint) (model.Technology, error) {
	var tech model.Technology
	err := r.db.First(&tech, id).Error
	return tech, err
}

func (r *technologyRepository) Update(id uint, tech *model.Technology) error {
	return r.db.Model(&model.Technology{}).Where("id = ?", id).Updates(tech).Error
}

func (r *technologyRepository) Delete(id uint) error {
	// Menggunakan Transaction agar penghapusan data aman (ACID compliant)
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 1. Cari data teknologi untuk memastikan ID tersebut ada
		var tech model.Technology
		if err := tx.First(&tech, id).Error; err != nil {
			return err
		}

		// 2. Putuskan paksa semua ikatan di tabel pivot (portfolio_technologies)
		// Kita menggunakan raw query karena lebih efisien untuk menghapus dari sisi child
		if err := tx.Exec("DELETE FROM portfolio_technologies WHERE technology_id = ?", id).Error; err != nil {
			return err
		}

		// 3. Setelah ikatannya bersih, hapus data teknologinya
		if err := tx.Delete(&tech).Error; err != nil {
			return err
		}

		return nil
	})
}
