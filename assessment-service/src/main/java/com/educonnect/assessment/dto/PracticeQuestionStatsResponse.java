package com.educonnect.assessment.dto;

public class PracticeQuestionStatsResponse {
    
    private Long totalSubmissions;
    private Long correctSubmissions;
    private Long totalPoints;
    private Long uniqueQuestions;
    private Long solvedQuestions;
    private Double accuracyPercentage;
    private Double averagePointsPerQuestion;
    
    // Constructors
    public PracticeQuestionStatsResponse() {}
    
    public PracticeQuestionStatsResponse(Long totalSubmissions, Long correctSubmissions, 
                                       Long totalPoints, Long uniqueQuestions, Long solvedQuestions) {
        this.totalSubmissions = totalSubmissions;
        this.correctSubmissions = correctSubmissions;
        this.totalPoints = totalPoints;
        this.uniqueQuestions = uniqueQuestions;
        this.solvedQuestions = solvedQuestions;
        
        // Calculate derived fields
        if (totalSubmissions > 0) {
            this.accuracyPercentage = (correctSubmissions.doubleValue() / totalSubmissions.doubleValue()) * 100;
        } else {
            this.accuracyPercentage = 0.0;
        }
        
        if (uniqueQuestions > 0) {
            this.averagePointsPerQuestion = totalPoints.doubleValue() / uniqueQuestions.doubleValue();
        } else {
            this.averagePointsPerQuestion = 0.0;
        }
    }
    
    // Getters and Setters
    public Long getTotalSubmissions() {
        return totalSubmissions;
    }
    
    public void setTotalSubmissions(Long totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }
    
    public Long getCorrectSubmissions() {
        return correctSubmissions;
    }
    
    public void setCorrectSubmissions(Long correctSubmissions) {
        this.correctSubmissions = correctSubmissions;
    }
    
    public Long getTotalPoints() {
        return totalPoints;
    }
    
    public void setTotalPoints(Long totalPoints) {
        this.totalPoints = totalPoints;
    }
    
    public Long getUniqueQuestions() {
        return uniqueQuestions;
    }
    
    public void setUniqueQuestions(Long uniqueQuestions) {
        this.uniqueQuestions = uniqueQuestions;
    }
    
    public Long getSolvedQuestions() {
        return solvedQuestions;
    }
    
    public void setSolvedQuestions(Long solvedQuestions) {
        this.solvedQuestions = solvedQuestions;
    }
    
    public Double getAccuracyPercentage() {
        return accuracyPercentage;
    }
    
    public void setAccuracyPercentage(Double accuracyPercentage) {
        this.accuracyPercentage = accuracyPercentage;
    }
    
    public Double getAveragePointsPerQuestion() {
        return averagePointsPerQuestion;
    }
    
    public void setAveragePointsPerQuestion(Double averagePointsPerQuestion) {
        this.averagePointsPerQuestion = averagePointsPerQuestion;
    }
}