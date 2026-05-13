package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddlewareHandler() gin.HandlerFunc{
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")
		if authHeader == ""{
			c.JSON(http.StatusUnauthorized,gin.H{"error": "Authorization header missing"})
			c.Abort()
			return 
		}

		tokenString := strings.TrimPrefix(authHeader,"Bearer ")
		fmt.Println("TOKEN RECEIVED:", tokenString)

		var jwt_key = []byte(os.Getenv("JWT_SECRET"))
		fmt.Println("SECRET USED:", os.Getenv("JWT_SECRET"))
		if tokenString == authHeader{
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token format"})
			c.Abort()
			return 
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return  jwt_key,nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return 
		}

		if claims,ok := token.Claims.(jwt.MapClaims);ok && token.Valid {
			userID := uint(claims["user_id"].(float64))
			c.Set("userID", userID)
		}

		c.Next()

	}
}

