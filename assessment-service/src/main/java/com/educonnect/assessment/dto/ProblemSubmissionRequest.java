package com.educonnect.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProblemSubmissionRequest {
    @NotBlank(message = "Answer is required")
    private String answer;
    
    @NotNull(message = "Time taken is required")
    private Integer timeTaken;
    
    private String workingSteps;

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

    public String getWorkingSteps() {
        return workingSteps;
    }

    public void setWorkingSteps(String workingSteps) {
        this.workingSteps = workingSteps;
    }
}