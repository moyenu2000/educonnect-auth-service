package com.educonnect.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ExamFinishRequest {
    @NotBlank(message = "Session ID is required")
    private String sessionId;
    
    @NotNull(message = "Final answers are required")
    private List<FinalAnswer> finalAnswers;

    public static class FinalAnswer {
        @NotNull(message = "Question ID is required")
        private Long questionId;
        
        @NotBlank(message = "Answer is required")
        private String answer;

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
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<FinalAnswer> getFinalAnswers() {
        return finalAnswers;
    }

    public void setFinalAnswers(List<FinalAnswer> finalAnswers) {
        this.finalAnswers = finalAnswers;
    }
}