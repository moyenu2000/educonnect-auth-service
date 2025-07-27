package com.educonnect.assessment.dto;

import java.time.LocalDateTime;

public class PracticeQuestionSubmissionResponse {
    
    private Long id;
    private Long userId;
    private Long questionId;
    private String answer;
    private Boolean isCorrect;
    private Integer pointsEarned;
    private Integer timeTakenSeconds;
    private LocalDateTime submittedAt;
    
    // Additional feedback fields
    private String correctAnswer;
    private String explanation;
    private Boolean isLatestAttempt;
    private Integer attemptNumber;
    private Integer bestScore;
    
    // Constructors
    public PracticeQuestionSubmissionResponse() {}
    
    public PracticeQuestionSubmissionResponse(Long id, Long userId, Long questionId, 
                                            String answer, Boolean isCorrect, 
                                            Integer pointsEarned, Integer timeTakenSeconds, 
                                            LocalDateTime submittedAt) {
        this.id = id;
        this.userId = userId;
        this.questionId = questionId;
        this.answer = answer;
        this.isCorrect = isCorrect;
        this.pointsEarned = pointsEarned;
        this.timeTakenSeconds = timeTakenSeconds;
        this.submittedAt = submittedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    
    public String getAnswer() {
        return answer;
    }
    
    public void setAnswer(String answer) {
        this.answer = answer;
    }
    
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    
    public Integer getPointsEarned() {
        return pointsEarned;
    }
    
    public void setPointsEarned(Integer pointsEarned) {
        this.pointsEarned = pointsEarned;
    }
    
    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }
    
    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public String getCorrectAnswer() {
        return correctAnswer;
    }
    
    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
    
    public String getExplanation() {
        return explanation;
    }
    
    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
    
    public Boolean getIsLatestAttempt() {
        return isLatestAttempt;
    }
    
    public void setIsLatestAttempt(Boolean isLatestAttempt) {
        this.isLatestAttempt = isLatestAttempt;
    }
    
    public Integer getAttemptNumber() {
        return attemptNumber;
    }
    
    public void setAttemptNumber(Integer attemptNumber) {
        this.attemptNumber = attemptNumber;
    }
    
    public Integer getBestScore() {
        return bestScore;
    }
    
    public void setBestScore(Integer bestScore) {
        this.bestScore = bestScore;
    }
}