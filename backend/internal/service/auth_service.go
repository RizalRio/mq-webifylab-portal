package service

import (
	"errors"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/repository"
	"github.com/RizalRio/webifylab-backend/pkg/auth"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Login(req dto.LoginRequest) (dto.LoginResponse, error)
}

type authService struct {
	repo repository.UserRepository
}

func NewAuthService(repo repository.UserRepository) AuthService {
	return &authService{repo}
}

func (s *authService) Login(req dto.LoginRequest) (dto.LoginResponse, error) {
	var res dto.LoginResponse

	// 1. Cari user berdasarkan email
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return res, errors.New("email atau password salah")
	}

	// 2. Verifikasi Password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return res, errors.New("email atau password salah")
	}

	// 3. Generate JWT Token
	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return res, errors.New("gagal membuat token autentikasi")
	}

	// 4. Susun Response
	res.Token = token
	res.User.ID = user.ID
	res.User.Name = user.Name

	return res, nil
}
