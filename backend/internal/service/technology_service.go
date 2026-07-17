package service

import (
	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"github.com/RizalRio/webifylab-backend/internal/repository"
)

type TechnologyService interface {
	CreateTech(req dto.TechnologyRequest) (model.Technology, error)
	GetAllTechs() ([]model.Technology, error)
	UpdateTech(id uint, req dto.TechnologyRequest) error
	DeleteTech(id uint) error
}

type technologyService struct {
	repo repository.TechnologyRepository
}

func NewTechnologyService(repo repository.TechnologyRepository) TechnologyService {
	return &technologyService{repo}
}

func (s *technologyService) CreateTech(req dto.TechnologyRequest) (model.Technology, error) {
	tech := model.Technology{
		Name:    req.Name,
		IconURL: req.IconURL,
	}
	err := s.repo.Create(&tech)
	return tech, err
}

func (s *technologyService) GetAllTechs() ([]model.Technology, error) {
	return s.repo.FindAll()
}

func (s *technologyService) UpdateTech(id uint, req dto.TechnologyRequest) error {
	updatedTech := model.Technology{
		Name:    req.Name,
		IconURL: req.IconURL,
	}
	return s.repo.Update(id, &updatedTech)
}

func (s *technologyService) DeleteTech(id uint) error {
	return s.repo.Delete(id)
}
