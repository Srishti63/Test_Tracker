package services

import (
	"os"
	"time"

	"github.com/Srishti63/testtracker/backend/models"
	"github.com/Srishti63/testtracker/backend/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct{
	Repo *repository.UserRepository
}

func(s * UserService) SignUp(username , password string) error{
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password),bcrypt.DefaultCost)
	if err != nil{
		return  err
	}

	user := &models.User{
		Username: username,
		Password: string(hashedPassword),
	}

	return s.Repo.CreateUser(user)
}

func(s *UserService) Login(username string, password string) (*models.User, error){
	user, err := s.Repo.FindByUserName(username)

	if err != nil {
		return nil, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password),[]byte(password))

	if err != nil{
		return nil, err
	}

	return user ,nil
}

func(s *UserService) GenerateAccessToken(userID uint) (string, error){

	claims := jwt.MapClaims{
		"user_id" : userID,
		"exp" : time.Now().Add(time.Hour * 24).Unix(),
		"iat" : time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
    if err != nil {
        return "", err
    }

    return tokenString, nil
}