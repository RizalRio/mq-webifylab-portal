package handler

import (
	"net/http"
	"strconv"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type SaaSHandler struct {
	service service.SaaSService
}

func NewSaaSHandler(service service.SaaSService) *SaaSHandler {
	return &SaaSHandler{service}
}

// GET /api/v1/saas (Public)
func (h *SaaSHandler) GetActiveSaaS(c *gin.Context) {
	var params dto.PaginationQueryParams

	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Parameter tidak valid"})
		return
	}

	pagedData, err := h.service.GetActiveSaaS(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal mengambil data SaaS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   pagedData,
	})
}

// POST /api/v1/admin/saas (Admin Only)
func (h *SaaSHandler) CreateSaaS(c *gin.Context) {
	var req dto.SaaSRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Validasi gagal", "errors": err.Error()})
		return
	}

	product, err := h.service.CreateSaaS(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal menambah produk SaaS"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Produk SaaS berhasil ditambahkan", "data": product})
}

// PUT /api/v1/admin/saas/:id (Admin Only)
func (h *SaaSHandler) UpdateSaaS(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "ID tidak valid"})
		return
	}

	var req dto.SaaSRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Validasi gagal", "errors": err.Error()})
		return
	}

	err = h.service.UpdateSaaS(uint(id), req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Produk SaaS tidak ditemukan atau gagal diperbarui"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Produk SaaS berhasil diperbarui"})
}

// DELETE /api/v1/admin/saas/:id (Admin Only)
func (h *SaaSHandler) DeleteSaaS(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "ID tidak valid"})
		return
	}

	err = h.service.DeleteSaaS(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Produk SaaS tidak ditemukan atau gagal dihapus",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Produk SaaS berhasil dihapus",
	})
}

// GET /api/v1/saas/:id (Public)
func (h *SaaSHandler) GetSaaSDetail(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format ID tidak valid"})
		return
	}

	saas, err := h.service.GetSaaSByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Produk SaaS tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   saas,
	})
}
