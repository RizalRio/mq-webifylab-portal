package handler

import (
	"net/http"
	"strconv"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type ContactHandler struct {
	service service.ContactService
}

func NewContactHandler(service service.ContactService) *ContactHandler {
	return &ContactHandler{service}
}

// POST /api/v1/contact (Public)
func (h *ContactHandler) SubmitMessage(c *gin.Context) {
	var req dto.CreateContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Data tidak lengkap atau email tidak valid", "errors": err.Error()})
		return
	}

	if err := h.service.SubmitMessage(req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal mengirim pesan"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Pesan berhasil dikirim"})
}

// GET /api/v1/admin/messages (Admin Only)
func (h *ContactHandler) GetAllMessages(c *gin.Context) {
	var params dto.PaginationQueryParams

	// Membaca Query Parameter dari URL (?page=1&limit=10&search=xxx)
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Parameter tidak valid"})
		return
	}

	// Jalankan service
	pagedData, err := h.service.GetAllMessages(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal mengambil daftar pesan"})
		return
	}

	// Kembalikan data berpaginasi
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   pagedData,
	})
}

// GET /api/v1/admin/messages/:id (Admin Only)
func (h *ContactHandler) GetMessageDetail(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format ID tidak valid"})
		return
	}

	message, err := h.service.GetMessageByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Pesan tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": message})
}

// PATCH /api/v1/admin/messages/:id/read (Admin Only)
func (h *ContactHandler) MarkAsRead(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format ID tidak valid"})
		return
	}

	if err := h.service.MarkMessageAsRead(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal memperbarui status pesan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Pesan ditandai sudah dibaca"})
}

// DELETE /api/v1/admin/messages/:id (Admin Only)
func (h *ContactHandler) DeleteMessage(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format ID tidak valid"})
		return
	}

	if err := h.service.DeleteMessage(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Pesan tidak ditemukan atau gagal dihapus"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Pesan berhasil dihapus"})
}
