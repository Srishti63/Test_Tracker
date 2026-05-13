package repository

import (
	"github.com/Srishti63/testtracker/backend/models"	
	"gorm.io/gorm"
)

type UserRepository struct{
	DB *gorm.DB
}

func (r *UserRepository) CreateUser(user *models.User) error{
	return r.DB.Create(user).Error
}

func (r *UserRepository) FindByUserName(username string) (*models.User, error){
	var user models.User
	err := r.DB.Where("username = ?",username).First(&user).Error
	return &user, err

}

