package service

import (
	"math"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"github.com/RizalRio/webifylab-backend/internal/repository"
)

type SaaSService interface {
	GetActiveSaaS(params dto.PaginationQueryParams) (dto.PagedResponse, error)
	GetSaaSByID(id uint) (model.SaaSProduct, error)
	CreateSaaS(req dto.SaaSRequest) (model.SaaSProduct, error)
	UpdateSaaS(id uint, req dto.SaaSRequest) error
	DeleteSaaS(id uint) error
}

type saasService struct {
	repo repository.SaaSRepository
}

func NewSaaSService(repo repository.SaaSRepository) SaaSService {
	return &saasService{repo}
}

func (s *saasService) GetActiveSaaS(params dto.PaginationQueryParams) (dto.PagedResponse, error) {
	var response dto.PagedResponse

	products, totalData, err := s.repo.FindAllActive(params)
	if err != nil {
		return response, err
	}

	totalPage := int64(math.Ceil(float64(totalData) / float64(params.Limit)))
	if totalPage == 0 {
		totalPage = 1
	}

	response.TotalData = totalData
	response.TotalPage = totalPage
	response.CurrentPage = params.Page
	response.Limit = params.Limit
	response.Data = products

	return response, nil
}

func (s *saasService) GetSaaSByID(id uint) (model.SaaSProduct, error) {
	return s.repo.FindByIDWithMedia(id)
}

func (s *saasService) CreateSaaS(req dto.SaaSRequest) (model.SaaSProduct, error) {
	product := model.SaaSProduct{
		Name:         req.Name,
		Slug:         req.Slug,
		Tagline:      req.Tagline,
		Description:  req.Description,
		SubdomainURL: req.SubdomainURL,
		IsActive:     *req.IsActive,
	}
	err := s.repo.Create(&product)
	return product, err
}

func (s *saasService) UpdateSaaS(id uint, req dto.SaaSRequest) error {
	// Pastikan produknya ada terlebih dahulu
	_, err := s.repo.FindByIDWithMedia(id)
	if err != nil {
		return err
	}

	updatedProduct := model.SaaSProduct{
		Name:         req.Name,
		Slug:         req.Slug,
		Tagline:      req.Tagline,
		Description:  req.Description,
		SubdomainURL: req.SubdomainURL,
		IsActive:     *req.IsActive,
	}

	return s.repo.Update(id, &updatedProduct)
}

func (s *saasService) DeleteSaaS(id uint) error {
	return s.repo.Delete(id)
}
