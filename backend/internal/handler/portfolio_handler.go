package handler

import (
	"net/http"
	"strconv"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type PortfolioHandler struct {
	service service.PortfolioService
}

func NewPortfolioHandler(service service.PortfolioService) *PortfolioHandler {
	return &PortfolioHandler{service}
}

// GET /api/v1/portfolios (Public)
func (h *PortfolioHandler) GetPortfolios(c *gin.Context) {
	var params dto.PaginationQueryParams

	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Parameter tidak valid"})
		return
	}

	pagedData, err := h.service.GetAllPortfolios(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal mengambil daftar portofolio"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   pagedData,
	})
}

// GET /api/v1/portfolios/:id (Public)
func (h *PortfolioHandler) GetPortfolioDetail(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format ID tidak valid"})
		return
	}

	portfolio, err := h.service.GetPortfolioByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Portofolio tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": portfolio})
}

// POST /api/v1/admin/portfolios (Admin Only)
func (h *PortfolioHandler) CreatePortfolio(c *gin.Context) {
	var req dto.CreatePortfolioRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Validasi gagal", "errors": err.Error()})
		return
	}

	portfolio, err := h.service.CreatePortfolio(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal menyimpan portofolio"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "Portofolio berhasil ditambahkan",
		"data": gin.H{
			"id":    portfolio.ID,
			"title": portfolio.Title,
		},
	})
}

// PUT /api/v1/admin/portfolios/:id
func (h *PortfolioHandler) UpdatePortfolio(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format ID tidak valid"})
		return
	}

	var req dto.CreatePortfolioRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Validasi gagal", "errors": err.Error()})
		return
	}

	err = h.service.UpdatePortfolio(uint(id), req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Portofolio tidak ditemukan atau gagal diperbarui"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Portofolio berhasil diperbarui"})
}

// DELETE /api/v1/admin/portfolios/:id
func (h *PortfolioHandler) DeletePortfolio(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Format ID tidak valid"})
		return
	}

	err = h.service.DeletePortfolio(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Portofolio tidak ditemukan atau gagal dihapus"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Portofolio berhasil dihapus"})
}
