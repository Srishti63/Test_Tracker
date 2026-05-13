package controllers

import (
	"net/http"
	"time"

	"github.com/Srishti63/testtracker/backend/services"
	"github.com/gin-gonic/gin"
)

type CreateTestRequest struct {
	Subject       string    `json:"subject" binding:"required"`
	MarksObtained float64   `json:"marks_obtained" binding:"required"`
	TotalMarks    float64   `json:"total_marks" binding:"required"`
	TestDate      time.Time `json:"test_date" binding:"required"`
}

type TestController struct {
	Service *services.TestService
}

func(tc *TestController) CreateTestHandler(c *gin.Context){
	var input CreateTestRequest

	if err := c.ShouldBindJSON(&input); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return 
	}
	
	record, err := tc.Service.ProcessTestEntry(input.Subject,input.MarksObtained,input.TotalMarks, input.TestDate)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated,gin.H{
		"message":"test record processed successfully",
		"data" : record,
	})
}

func(tc *TestController) GetAllTestsHandler(c *gin.Context){
	records, err := tc.Service.GetAllTests()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "tests fetched successfully",
		"data": records,
	})
}

func (ctrl *TestController) GetHeatmapHandler(c *gin.Context) {
    val, _ := c.Get("userID")
    userID := val.(uint)

    data, err := ctrl.Service.GetHeatmapData(userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch heatmap"})
        return
    }

    c.JSON(http.StatusOK, data)
}

func(ctrl *TestController) GetProgressData(c *gin.Context) {
	val,_ := c.Get("userID")
	userID := val.(uint)

	data, err := ctrl.Service.GetProgressData(userID)
	if err != nil{
		c.JSON(http.StatusInternalServerError , gin.H{"error":"No data found"})
		return
	}

	c.JSON(http.StatusOK, data)

}

func (ctrl *TestController) DeleteTestHandler(c *gin.Context){
	ID := c.Param("id")
	if err := ctrl.Service.DeleteTest(ID); err != nil{
		c.JSON(http.StatusInternalServerError , gin.H{"error": "Failed to delete"})
		return 
	}
	c.JSON(http.StatusOK , gin.H{"message":"test deleted successfully"})
}

func(ctrl *TestController) DeleteAllHandler(c *gin.Context) {
	subject := c.Param("subject")
	if err := ctrl.Service.DeleteAll(subject); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete tests"})
		return 
	}
	c.JSON(http.StatusOK, gin.H{"message": "All tests deleted successfully!"})
}