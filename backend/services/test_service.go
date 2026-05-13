package services

import (
	"errors"
	"time"

	"github.com/Srishti63/testtracker/backend/models"
	"github.com/Srishti63/testtracker/backend/repository"
)

type TestService struct{
	Repo *repository.TestRepository
}

func(s *TestService) ProcessTestEntry(subject string,obtained float64, total float64, testDate time.Time)(models.TestRecord,error){

	if(total<=0){
		return models.TestRecord{}, errors.New("total marks must be greater than 0")
	}

	if(obtained > total){
		return  models.TestRecord{}, errors.New("obtained marks can't be more than total marks")
	}

	percentage := ((obtained/total)* 100)

	record := models.TestRecord{
		Subject: subject,
		MarksObtained: obtained,
		TotalMarks: total,
		Percentage : percentage,
		TestDate: testDate,
	}

	if err := s.Repo.Save(record); err != nil {
		return models.TestRecord{}, err
	}

	return record,nil

}

func(s *TestService) GetAllTests() ([]models.TestRecord, error) {
	return s.Repo.GetAll()
}

func(s * TestService) GetHeatmapData(userID uint) (map[string]int,error){
	tests, err := s.Repo.GetByUserID(userID)

	if err != nil{
		return  nil, err
	}
	heatmap := make(map[string]int)
	for _,tests := range tests{
		dateStr := tests.TestDate.Format("2006-01-02")
        heatmap[dateStr]++
	}
	return  heatmap,nil
}

func (s *TestService) GetProgressData(userID uint) ([]map[string]any, error) {
    tests, err := s.Repo.GetByUserID(userID)
    if err != nil {
        return nil, err
    }

    var progress []map[string]any
    for _, t := range tests {
        progress = append(progress, map[string]any{
            "date":       t.TestDate.Format("2006-01-02"),
            "percentage": t.Percentage,
        })
    }
    return progress, nil
}

func(s *TestService) DeleteTest(id string) error {
	return s.Repo.Delete(id);
}

func(s *TestService) DeleteAll(subject string) error{
	return s.Repo.DeletBySubject(subject);
}