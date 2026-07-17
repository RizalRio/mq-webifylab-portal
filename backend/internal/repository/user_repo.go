package repository

import (
	"github.com/RizalRio/webifylab-backend/internal/model"
	"gorm.io/gorm"
)

type UserRepository interface {
	FindByEmail(email string) (model.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) FindByEmail(email string) (model.User, error) {
	var user model.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return user, err
}
