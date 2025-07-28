package com.educonnect.assessment.dto;

import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;

import java.time.LocalDateTime;
import java.util.List;

public class PracticeQuestionResponse {
    
    private Long id;
    private Long questionId;
    private String text;
    private QuestionType type;
    private Long subjectId;
    private String subjectName;
    private Long topicId;
    private String topicName;
    private Difficulty difficulty;
    private List<QuestionOptionResponse> options;
    private String explanation;
    private Integer points;
    private List<String> tags;
    private List<String> attachments;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Submission status for current user
    private String submissionStatus; // SOLVED, ATTEMPTED, NOT_ATTEMPTED
    private Boolean hasAttempted;
    private Boolean hasSolved;
    private Integer totalAttempts;
    private Integer bestScore;
    private LocalDateTime lastAttemptAt;
    
    // Practice problem specific fields
    private String hintText;
    private List<String> hints;
    private String solutionSteps;
    
    // Constructors
    public PracticeQuestionResponse() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public QuestionType getType() {
        return type;
    }
    
    public void setType(QuestionType type) {
        this.type = type;
    }
    
    public Long getSubjectId() {
        return subjectId;
    }
    
    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
    
    public String getSubjectName() {
        return subjectName;
    }
    
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
    
    public Long getTopicId() {
        return topicId;
    }
    
    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
    
    public String getTopicName() {
        return topicName;
    }
    
    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }
    
    public Difficulty getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }
    
    public List<QuestionOptionResponse> getOptions() {
        return options;
    }
    
    public void setOptions(List<QuestionOptionResponse> options) {
        this.options = options;
    }
    
    public String getExplanation() {
        return explanation;
    }
    
    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
    
    public Integer getPoints() {
        return points;
    }
    
    public void setPoints(Integer points) {
        this.points = points;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public List<String> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getSubmissionStatus() {
        return submissionStatus;
    }
    
    public void setSubmissionStatus(String submissionStatus) {
        this.submissionStatus = submissionStatus;
    }
    
    public Boolean getHasAttempted() {
        return hasAttempted;
    }
    
    public void setHasAttempted(Boolean hasAttempted) {
        this.hasAttempted = hasAttempted;
    }
    
    public Boolean getHasSolved() {
        return hasSolved;
    }
    
    public void setHasSolved(Boolean hasSolved) {
        this.hasSolved = hasSolved;
    }
    
    public Integer getTotalAttempts() {
        return totalAttempts;
    }
    
    public void setTotalAttempts(Integer totalAttempts) {
        this.totalAttempts = totalAttempts;
    }
    
    public Integer getBestScore() {
        return bestScore;
    }
    
    public void setBestScore(Integer bestScore) {
        this.bestScore = bestScore;
    }
    
    public LocalDateTime getLastAttemptAt() {
        return lastAttemptAt;
    }
    
    public void setLastAttemptAt(LocalDateTime lastAttemptAt) {
        this.lastAttemptAt = lastAttemptAt;
    }
    
    public String getHintText() {
        return hintText;
    }
    
    public void setHintText(String hintText) {
        this.hintText = hintText;
    }
    
    public List<String> getHints() {
        return hints;
    }
    
    public void setHints(List<String> hints) {
        this.hints = hints;
    }
    
    public String getSolutionSteps() {
        return solutionSteps;
    }
    
    public void setSolutionSteps(String solutionSteps) {
        this.solutionSteps = solutionSteps;
    }
}