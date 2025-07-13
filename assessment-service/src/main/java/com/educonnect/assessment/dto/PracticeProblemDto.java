package com.educonnect.assessment.dto;

import com.educonnect.assessment.dto.QuestionResponse;
import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.ProblemStatus;
import com.educonnect.assessment.enums.QuestionType;

import java.time.LocalDateTime;
import java.util.List;

public class PracticeProblemDto {
    private Long id;
    private QuestionResponse question;
    private Difficulty difficulty;
    private Long topicId;
    private Long subjectId;
    private QuestionType type;
    private Integer points;
    private List<String> hints;
    private List<Long> similarProblems;
    private ProblemStatus status;
    private Integer attempts;
    private Boolean solved;
    private Boolean bookmarked;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QuestionResponse getQuestion() {
        return question;
    }

    public void setQuestion(QuestionResponse question) {
        this.question = question;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public QuestionType getType() {
        return type;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public List<String> getHints() {
        return hints;
    }

    public void setHints(List<String> hints) {
        this.hints = hints;
    }

    public List<Long> getSimilarProblems() {
        return similarProblems;
    }

    public void setSimilarProblems(List<Long> similarProblems) {
        this.similarProblems = similarProblems;
    }

    public ProblemStatus getStatus() {
        return status;
    }

    public void setStatus(ProblemStatus status) {
        this.status = status;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public Boolean getSolved() {
        return solved;
    }

    public void setSolved(Boolean solved) {
        this.solved = solved;
    }

    public Boolean getBookmarked() {
        return bookmarked;
    }

    public void setBookmarked(Boolean bookmarked) {
        this.bookmarked = bookmarked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}