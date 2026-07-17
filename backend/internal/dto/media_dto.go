package dto

import "mime/multipart"

type UploadMediaRequest struct {
	MediableID   uint                  `form:"mediable_id" binding:"required"`
	MediableType string                `form:"mediable_type" binding:"required,oneof=portfolios saas_products"`
	IsPrimary    bool                  `form:"is_primary"`
	File         *multipart.FileHeader `form:"file" binding:"required"`
}
