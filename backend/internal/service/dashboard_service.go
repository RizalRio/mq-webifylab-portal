package service

import (
	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/repository"
)

type DashboardService interface {
	GetDashboardStats() (dto.DashboardStatsResponse, error)
}

type dashboardService struct {
	repo repository.DashboardRepository
}

func NewDashboardService(repo repository.DashboardRepository) DashboardService {
	return &dashboardService{repo}
}

func (s *dashboardService) GetDashboardStats() (dto.DashboardStatsResponse, error) {
	var res dto.DashboardStatsResponse

	portfolios, saas, unread, techs, err := s.repo.GetStats()
	if err != nil {
		return res, err
	}

	res.TotalPortfolios = portfolios
	res.TotalActiveSaaS = saas
	res.TotalUnreadMessages = unread
	res.TotalTechnologies = techs

	return res, nil
}
