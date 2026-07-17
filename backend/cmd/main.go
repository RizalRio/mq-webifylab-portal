package main

import (
	"log"
	"os"
	"time"

	"github.com/RizalRio/webifylab-backend/config"
	"github.com/RizalRio/webifylab-backend/internal/handler"
	"github.com/RizalRio/webifylab-backend/internal/repository"
	"github.com/RizalRio/webifylab-backend/internal/service"
	"github.com/RizalRio/webifylab-backend/pkg/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDB()

	// ---- Dependency Injection ----
	// Portfolio
	portfolioRepo := repository.NewPortfolioRepository(config.DB)
	portfolioService := service.NewPortfolioService(portfolioRepo)
	portfolioHandler := handler.NewPortfolioHandler(portfolioService)

	// Auth
	userRepo := repository.NewUserRepository(config.DB)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)

	// SaaS
	saasRepo := repository.NewSaaSRepository(config.DB)
	saasService := service.NewSaaSService(saasRepo)
	saasHandler := handler.NewSaaSHandler(saasService)

	// Media
	mediaRepo := repository.NewMediaRepository(config.DB)
	mediaService := service.NewMediaService(mediaRepo)
	mediaHandler := handler.NewMediaHandler(mediaService)

	// Contact
	contactRepo := repository.NewContactRepository(config.DB)
	contactService := service.NewContactService(contactRepo)
	contactHandler := handler.NewContactHandler(contactService)

	// Dashboard
	dashboardRepo := repository.NewDashboardRepository(config.DB)
	dashboardService := service.NewDashboardService(dashboardRepo)
	dashboardHandler := handler.NewDashboardHandler(dashboardService)

	// Technology
	techRepo := repository.NewTechnologyRepository(config.DB)
	techService := service.NewTechnologyService(techRepo)
	techHandler := handler.NewTechnologyHandler(techService)

	router := gin.Default()

	// --- MIDDLEWARE CORS ---
	router.Use(cors.New(cors.Config{
		// Tentukan URL frontend yang diizinkan mengakses API ini.
		// Tambahkan URL production nantinya jika sudah di-deploy.
		AllowOrigins: []string{
			"http://localhost:3000", // Default port untuk Next.js / React
			"http://localhost:8080", // Default port untuk Vue / Flutter Web
			"http://localhost:5173", // Default port untuk Vite
			"https://webifylab.my.id",
			"https://www.webifylab.my.id",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.Static("/public/uploads", "./public/uploads")

	// Grouping Rute API v1
	v1 := router.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "success", "message": "WebifyLab API is running!"})
		})

		// Rute Publik Portofolio

		// Rute Portofolio
		v1.GET("/portfolios", portfolioHandler.GetPortfolios)
		v1.GET("/portfolios/:id", portfolioHandler.GetPortfolioDetail)

		// Rute SaaS
		v1.GET("/saas", saasHandler.GetActiveSaaS)
		v1.GET("/saas/:id", saasHandler.GetSaaSDetail)

		// Rute Kontak
		v1.POST("/contact", contactHandler.SubmitMessage)

		// Rute Media
		v1.POST("/media", mediaHandler.Upload)

		// Rute Teknologi
		v1.GET("/technologies", techHandler.GetAll)

		// Rute Auth
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/login", authHandler.Login)
		}

		// --- RUTE ADMIN ---
		adminGroup := v1.Group("/admin")
		adminGroup.Use(middleware.RequireAuth()) // Pasang satpam di sini
		{
			// Endpoint Statistik Dashboard
			adminGroup.GET("/dashboard/stats", dashboardHandler.GetStats)

			// Endpoints Admin SaaS
			adminGroup.POST("/saas", saasHandler.CreateSaaS)
			adminGroup.PUT("/saas/:id", saasHandler.UpdateSaaS)
			adminGroup.DELETE("/saas/:id", saasHandler.DeleteSaaS)

			// Endpoints Admin Portofolio
			adminGroup.POST("/portfolios", portfolioHandler.CreatePortfolio)
			adminGroup.PUT("/portfolios/:id", portfolioHandler.UpdatePortfolio)
			adminGroup.DELETE("/portfolios/:id", portfolioHandler.DeletePortfolio)

			// Endpoint Admin Media
			adminGroup.POST("/media", mediaHandler.Upload)

			// Endpoints Admin Contact Messages
			adminGroup.GET("/messages", contactHandler.GetAllMessages)
			adminGroup.GET("/messages/:id", contactHandler.GetMessageDetail)
			adminGroup.PATCH("/messages/:id/read", contactHandler.MarkAsRead)
			adminGroup.DELETE("/messages/:id", contactHandler.DeleteMessage)

			// Endpoints Admin Technologies
			adminGroup.POST("/technologies", techHandler.Create)
			adminGroup.PUT("/technologies/:id", techHandler.Update)
			adminGroup.DELETE("/technologies/:id", techHandler.Delete)
		}
	}

	// Menjalankan server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("Server is running on port %s", port)
	router.Run(":" + port)
}
