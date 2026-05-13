package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/Srishti63/testtracker/backend/controllers"
	"github.com/Srishti63/testtracker/backend/middleware"
	"github.com/Srishti63/testtracker/backend/models"
	"github.com/Srishti63/testtracker/backend/repository"
	"github.com/Srishti63/testtracker/backend/services"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading this .env file", err)
	}


	// 1. DATABASE SETUP
	// Using SQLite 
	db, err := gorm.Open(sqlite.Open("test_tracker.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// AutoMigrate will create the "test_records" ,"user" table automatically based on struct
	db.AutoMigrate(&models.TestRecord{}, &models.User{}) 

	// 2. DEPENDENCY INJECTION (The "Wiring")
	// ---WIRING FOR TEST----
	testRepo := &repository.TestRepository{DB: db}
	testService := &services.TestService{Repo: testRepo}
	testController := &controllers.TestController{Service: testService}

	// --- WIRING FOR SIGN UP---
	userRepo := &repository.UserRepository{DB: db}
	userService := &services.UserService{Repo: userRepo}
	authController := &controllers.AuthController{Service: userService}

	// 3. ROUTER SETUP
	r := gin.Default()

	// Handle CORS 
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 4. ROUTES

	// public routes ==

	r.POST("/signup", authController.SignUpHandler)
	r.POST("/login", authController.LoginHandler)

	api := r.Group("/api")
	api.Use(middleware.AuthMiddlewareHandler())
	{
		api.POST("/tests", testController.CreateTestHandler)
		api.GET("/tests", testController.GetAllTestsHandler)
		api.GET("/tests/heatmap", testController.GetHeatmapHandler)
		api.GET("/tests/progress", testController.GetProgressData)
		api.DELETE("/tests/:id",testController.DeleteTestHandler)
		api.DELETE("/tests/subject/:subject", testController.DeleteAllHandler)

	}
	// 5. START SERVER
	log.Println("Server starting on :8080...")
	r.Run(":8080")
}