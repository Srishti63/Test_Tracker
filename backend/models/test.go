package models

import "time"

type TestRecord struct {
	ID            uint      `gorm:"primaryKey"  json:"id"`
	Subject       string    `json:"subject"`
	MarksObtained float64   `json:"marks_obtained"`
	TotalMarks    float64   `json:"total_marks"`
	Percentage    float64    `json:"percentage"`
	TestDate      time.Time `json:"test_date"`
	CreatedAt     time.Time `json:"created_at"`
}
