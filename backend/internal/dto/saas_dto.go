package dto

type SaaSRequest struct {
	Name         string `json:"name" binding:"required"`
	Slug         string `json:"slug" binding:"required"`
	Tagline      string `json:"tagline" binding:"required"`
	Description  string `json:"description" binding:"required"`
	SubdomainURL string `json:"subdomain_url" binding:"required,url"`
	IsActive     *bool  `json:"is_active" binding:"required"` // Menggunakan pointer agar nilai false tidak dianggap kosong oleh validator
}
