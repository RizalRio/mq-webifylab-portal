package dto

type DashboardStatsResponse struct {
	TotalPortfolios     int64 `json:"total_portfolios"`
	TotalActiveSaaS     int64 `json:"total_active_saas"`
	TotalUnreadMessages int64 `json:"total_unread_messages"`
	TotalTechnologies   int64 `json:"total_technologies"`
}
