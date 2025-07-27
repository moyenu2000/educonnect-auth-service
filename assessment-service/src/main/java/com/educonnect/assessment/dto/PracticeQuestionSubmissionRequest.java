package com.educonnect.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class PracticeQuestionSubmissionRequest {
    
    @NotBlank(message = "Answer is required")
    private String answer;
    
    @NotNull(message = "Time taken is required")
    @Min(value = 1, message = "Time taken must be at least 1 second")
    private Integer timeTaken;
    
    private String explanation;
    
    private String deviceInfo;
    
    // Constructors
    public PracticeQuestionSubmissionRequest() {}
    
    public PracticeQuestionSubmissionRequest(String answer, Integer timeTaken) {
        this.answer = answer;
        this.timeTaken = timeTaken;
    }
    
    // Getters and Setters
    public String getAnswer() {
        return answer;
    }
    
    public void setAnswer(String answer) {
        this.answer = answer;
    }
    
    public Integer getTimeTaken() {
        return timeTaken;
    }
    
    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }
    
    public String getExplanation() {
        return explanation;
    }
    
    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
    
    public String getDeviceInfo() {
        return deviceInfo;
    }
    
    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }
}