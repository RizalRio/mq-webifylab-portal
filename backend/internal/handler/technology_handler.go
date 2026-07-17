package handler

import (
	"net/http"
	"strconv"

	"github.com/RizalRio/webifylab-backend/internal/dto"
	"github.com/RizalRio/webifylab-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type TechnologyHandler struct {
	service service.TechnologyService
}

func NewTechnologyHandler(service service.TechnologyService) *TechnologyHandler {
	return &TechnologyHandler{service}
}

// POST /api/v1/admin/technologies (Admin Only)
func (h *TechnologyHandler) Create(c *gin.Context) {
	var req dto.TechnologyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Validasi gagal", "errors": err.Error()})
		return
	}

	tech, err := h.service.CreateTech(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal menambahkan teknologi (mungkin nama sudah terdaftar)"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Teknologi berhasil ditambahkan", "data": tech})
}

// GET /api/v1/technologies (Public)
func (h *TechnologyHandler) GetAll(c *gin.Context) {
	techs, err := h.service.GetAllTechs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal mengambil daftar teknologi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": techs})
}

// PUT /api/v1/admin/technologies/:id (Admin Only)
func (h *TechnologyHandler) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "ID tidak valid"})
		return
	}

	var req dto.TechnologyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Validasi gagal", "errors": err.Error()})
		return
	}

	if err := h.service.UpdateTech(uint(id), req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal memperbarui teknologi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Teknologi berhasil diperbarui"})
}

// DELETE /api/v1/admin/technologies/:id (Admin Only)
func (h *TechnologyHandler) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "ID tidak valid"})
		return
	}

	if err := h.service.DeleteTech(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Teknologi tidak ditemukan atau gagal dihapus"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Teknologi berhasil dihapus"})
}
