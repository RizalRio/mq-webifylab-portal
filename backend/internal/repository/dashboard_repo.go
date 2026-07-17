package repository

import (
	"github.com/RizalRio/webifylab-backend/internal/model"
	"gorm.io/gorm"
)

type DashboardRepository interface {
	GetStats() (int64, int64, int64, int64, error)
}

type dashboardRepository struct {
	db *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) DashboardRepository {
	return &dashboardRepository{db}
}

func (r *dashboardRepository) GetStats() (int64, int64, int64, int64, error) {
	var totalPortfolios, totalActiveSaaS, totalUnreadMessages, totalTechnologies int64

	// 1. Hitung total seluruh portofolio
	if err := r.db.Model(&model.Portfolio{}).Count(&totalPortfolios).Error; err != nil {
		return 0, 0, 0, 0, err
	}

	// 2. Hitung total produk SaaS yang berstatus aktif
	if err := r.db.Model(&model.SaaSProduct{}).Where("is_active = ?", true).Count(&totalActiveSaaS).Error; err != nil {
		return 0, 0, 0, 0, err
	}

	// 3. Hitung total pesan masuk yang belum dibaca (is_read = false)
	if err := r.db.Model(&model.ContactMessage{}).Where("is_read = ?", false).Count(&totalUnreadMessages).Error; err != nil {
		return 0, 0, 0, 0, err
	}

	// 4. Hitung total seluruh teknologi
	if err := r.db.Model(&model.Technology{}).Count(&totalTechnologies).Error; err != nil {
		return 0, 0, 0, 0, err
	}

	return totalPortfolios, totalActiveSaaS, totalUnreadMessages, totalTechnologies, nil
}
