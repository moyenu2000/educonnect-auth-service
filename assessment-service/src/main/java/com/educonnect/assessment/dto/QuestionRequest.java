package com.educonnect.assessment.dto;

import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class QuestionRequest {
    @NotBlank(message = "Question text is required")
    private String text;

    @NotNull(message = "Question type is required")
    private QuestionType type;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    private Long topicId;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    private List<QuestionOptionRequest> options;

    private Long correctAnswerOptionId;

    private String correctAnswerText;

    private String explanation;

    private Integer points = 1;

    private List<String> tags;

    private List<String> attachments;

    private Boolean createPracticeProblem = false;

    private String hintText;

    private Integer hintLevel = 1;

    private String solutionSteps;

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

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public List<QuestionOptionRequest> getOptions() {
        return options;
    }

    public void setOptions(List<QuestionOptionRequest> options) {
        this.options = options;
    }

    public Long getCorrectAnswerOptionId() {
        return correctAnswerOptionId;
    }

    public void setCorrectAnswerOptionId(Long correctAnswerOptionId) {
        this.correctAnswerOptionId = correctAnswerOptionId;
    }

    public String getCorrectAnswerText() {
        return correctAnswerText;
    }

    public void setCorrectAnswerText(String correctAnswerText) {
        this.correctAnswerText = correctAnswerText;
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

    public Boolean getCreatePracticeProblem() {
        return createPracticeProblem;
    }

    public void setCreatePracticeProblem(Boolean createPracticeProblem) {
        this.createPracticeProblem = createPracticeProblem;
    }

    public String getHintText() {
        return hintText;
    }

    public void setHintText(String hintText) {
        this.hintText = hintText;
    }

    public Integer getHintLevel() {
        return hintLevel;
    }

    public void setHintLevel(Integer hintLevel) {
        this.hintLevel = hintLevel;
    }

    public String getSolutionSteps() {
        return solutionSteps;
    }

    public void setSolutionSteps(String solutionSteps) {
        this.solutionSteps = solutionSteps;
    }
}