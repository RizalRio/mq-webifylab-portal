package dto

// Kriteria Query Parameter dari URL (e.g., ?page=1&limit=10&search=budi)
type PaginationQueryParams struct {
	Page   int    `form:"page,default=1"`
	Limit  int    `form:"limit,default=10"`
	Search string `form:"search"`
}

// Format Response yang menyertakan Metadata Paginasi untuk Frontend
type PagedResponse struct {
	TotalData   int64       `json:"total_data"`
	TotalPage   int64       `json:"total_page"`
	CurrentPage int         `json:"current_page"`
	Limit       int         `json:"limit"`
	Data        interface{} `json:"data"`
}
