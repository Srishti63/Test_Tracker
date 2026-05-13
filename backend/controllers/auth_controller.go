package controllers

import (
	"net/http"

	"github.com/Srishti63/testtracker/backend/services"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	Service *services.UserService
}

func (ctrl *AuthController) SignUpHandler(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} 

	if err := ctrl.Service.SignUp(input.Username, input.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully!"})

}

func (ctrl *AuthController) LoginHandler(c *gin.Context) {
    var input struct {
        // 'U' capital so that  Gin can access it 
        Username string `json:"username" binding:"required"` 
        Password string `json:"password" binding:"required"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input format"})
        return 
    }

    user, err := ctrl.Service.Login(input.Username, input.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
        return
    }

    token, err := ctrl.Service.GenerateAccessToken(user.ID)

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error":"could not generate token"})
        return
    }
    c.JSON(http.StatusOK, gin.H{
        "message": "Login successful!",
        "user_id": user.ID,
        "token" : token,
    })
}


