package repository

import(
	"gorm.io/gorm"
	"github.com/Srishti63/testtracker/backend/models"
)

type TestRepository struct{
	DB *gorm.DB
}

func (r *TestRepository) Save(test models.TestRecord) error{
	return r.DB.Create(&test).Error
}

func(r *TestRepository) GetByUserID(userId uint) ([]models.TestRecord, error){
	var tests []models.TestRecord
	err := r.DB.Where("user_id = ?", userId).Order("test_date asc").Find(&tests).Error
	return tests,err
}

func (r *TestRepository) GetAll() ([]models.TestRecord, error){
	var tests []models.TestRecord
	err := r.DB.Find(&tests).Error
	return tests,err;
}

func(r *TestRepository) Delete(id string) error {
	return r.DB.Delete(&models.TestRecord{}, id).Error;
}

func(r *TestRepository) DeletBySubject(subject string) error{
	return r.DB.Where("subject = ?", subject).Delete(&models.TestRecord{}).Error
}