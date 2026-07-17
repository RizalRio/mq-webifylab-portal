package dto

type CreatePortfolioRequest struct {
	Title         string  `json:"title" binding:"required"`
	Description   string  `json:"description" binding:"required"`
	ClientName    *string `json:"client_name"`                       // Pointer karena bisa null
	ProjectURL    *string `json:"project_url"`                       // Pointer karena bisa null
	TechnologyIDs []uint  `json:"technology_ids" binding:"required"` // Array ID teknologi
}
