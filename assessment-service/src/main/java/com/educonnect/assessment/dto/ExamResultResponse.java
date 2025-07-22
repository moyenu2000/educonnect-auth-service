package com.educonnect.assessment.dto;

import com.educonnect.assessment.entity.ExamAnswer;
import java.time.LocalDateTime;
import java.util.List;

public class ExamResultResponse {
    private Long submissionId;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Integer unanswered;
    private Integer timeTaken;
    private Integer rank;
    private Double percentile;
    private Boolean passed;
    private LocalDateTime submittedAt;
    private List<ExamAnswer> answers;
    private ExamPerformance performance;
    private RankingInfo ranking;

    public static class ExamPerformance {
        private Double accuracy;
        private Integer averageTimePerQuestion;
        private String feedback;

        public Double getAccuracy() {
            return accuracy;
        }

        public void setAccuracy(Double accuracy) {
            this.accuracy = accuracy;
        }

        public Integer getAverageTimePerQuestion() {
            return averageTimePerQuestion;
        }

        public void setAverageTimePerQuestion(Integer averageTimePerQuestion) {
            this.averageTimePerQuestion = averageTimePerQuestion;
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
        }
    }

    public static class RankingInfo {
        private Integer totalParticipants;
        private Integer userRank;
        private String category;

        public Integer getTotalParticipants() {
            return totalParticipants;
        }

        public void setTotalParticipants(Integer totalParticipants) {
            this.totalParticipants = totalParticipants;
        }

        public Integer getUserRank() {
            return userRank;
        }

        public void setUserRank(Integer userRank) {
            this.userRank = userRank;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }

    public Integer getUnanswered() {
        return unanswered;
    }

    public void setUnanswered(Integer unanswered) {
        this.unanswered = unanswered;
    }

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Double getPercentile() {
        return percentile;
    }

    public void setPercentile(Double percentile) {
        this.percentile = percentile;
    }

    public Boolean getPassed() {
        return passed;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public List<ExamAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<ExamAnswer> answers) {
        this.answers = answers;
    }

    public ExamPerformance getPerformance() {
        return performance;
    }

    public void setPerformance(ExamPerformance performance) {
        this.performance = performance;
    }

    public RankingInfo getRanking() {
        return ranking;
    }

    public void setRanking(RankingInfo ranking) {
        this.ranking = ranking;
    }
}