package handler

import (
	"net/http"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	service service.MediaService
}

func NewMediaHandler(service service.MediaService) *MediaHandler {
	return &MediaHandler{service}
}

// POST /api/v1/admin/media
func (h *MediaHandler) Upload(c *gin.Context) {
	var req dto.UploadMediaRequest

	// Menggunakan ShouldBind agar GIN memparsing request multipart/form-data
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format form tidak valid", "errors": err.Error()})
		return
	}

	// Eksekusi proses upload di service
	media, err := h.service.UploadMedia(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "File media berhasil diunggah",
		"data":    media,
	})
}
