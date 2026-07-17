package handler

import (
	"net/http"

	"github.com/RizalRio/webifylab-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	service service.DashboardService
}

func NewDashboardHandler(service service.DashboardService) *DashboardHandler {
	return &DashboardHandler{service}
}

// GET /api/v1/admin/dashboard/stats
func (h *DashboardHandler) GetStats(c *gin.Context) {
	stats, err := h.service.GetDashboardStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal memuat statistik dashboard",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   stats,
	})
}
