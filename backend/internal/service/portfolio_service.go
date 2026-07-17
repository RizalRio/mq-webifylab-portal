package service

import (
	"math"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/model"
	"github.com/RizalRio/webifylab-backend/internal/repository"
)

type PortfolioService interface {
	GetAllPortfolios(params dto.PaginationQueryParams) (dto.PagedResponse, error)
	GetPortfolioByID(id uint) (model.Portfolio, error)
	CreatePortfolio(req dto.CreatePortfolioRequest) (model.Portfolio, error)
	UpdatePortfolio(id uint, req dto.CreatePortfolioRequest) error
	DeletePortfolio(id uint) error
}

type portfolioService struct {
	repo repository.PortfolioRepository
}

func NewPortfolioService(repo repository.PortfolioRepository) PortfolioService {
	return &portfolioService{repo}
}

func (s *portfolioService) GetAllPortfolios(params dto.PaginationQueryParams) (dto.PagedResponse, error) {
	var response dto.PagedResponse

	portfolios, totalData, err := s.repo.FindAll(params)
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
	response.Data = portfolios

	return response, nil
}

func (s *portfolioService) GetPortfolioByID(id uint) (model.Portfolio, error) {
	return s.repo.FindByID(id)
}

func (s *portfolioService) CreatePortfolio(req dto.CreatePortfolioRequest) (model.Portfolio, error) {
	portfolio := model.Portfolio{
		Title:       req.Title,
		Description: req.Description,
		ClientName:  req.ClientName,
		ProjectURL:  req.ProjectURL,
	}

	err := s.repo.Create(&portfolio, req.TechnologyIDs)
	return portfolio, err
}

func (s *portfolioService) UpdatePortfolio(id uint, req dto.CreatePortfolioRequest) error {
	portfolioUpdate := model.Portfolio{
		Title:       req.Title,
		Description: req.Description,
		ClientName:  req.ClientName,
		ProjectURL:  req.ProjectURL,
	}

	return s.repo.Update(id, &portfolioUpdate, req.TechnologyIDs)
}

func (s *portfolioService) DeletePortfolio(id uint) error {
	return s.repo.Delete(id)
}
