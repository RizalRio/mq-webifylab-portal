package dto

type TechnologyRequest struct {
	Name    string  `json:"name" binding:"required"`
	IconURL *string `json:"icon_url"` // Pointer agar bersifat opsional jika belum ada ikon
}
