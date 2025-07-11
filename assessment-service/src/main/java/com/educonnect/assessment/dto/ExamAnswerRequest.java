package com.educonnect.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ExamAnswerRequest {
    @NotBlank(message = "Session ID is required")
    private String sessionId;
    
    @NotNull(message = "Question ID is required")
    private Long questionId;
    
    @NotBlank(message = "Answer is required")
    private String answer;
    
    @NotNull(message = "Time taken is required")
    private Integer timeTaken;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
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

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }
}