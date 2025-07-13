package com.educonnect.assessment.entity;

import com.educonnect.assessment.enums.Difficulty;
import com.educonnect.assessment.enums.ProblemStatus;
import com.educonnect.assessment.enums.QuestionType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "practice_problems")
public class PracticeProblem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionId", insertable = false, updatable = false)
    @JsonIgnore
    private Question question;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @NotNull
    @Column(nullable = false)
    private Long topicId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topicId", insertable = false, updatable = false)
    @JsonIgnore
    private Topic topic;

    @NotNull
    @Column(nullable = false)
    private Long subjectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subjectId", insertable = false, updatable = false)
    @JsonIgnore
    private Subject subject;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false)
    private Integer points = 10;

    @Column(name = "hint_text")
    private String hintText;

    @Column(name = "hint_level")
    private Integer hintLevel = 1;

    @Column(name = "solution_steps", columnDefinition = "TEXT")
    private String solutionSteps;

    @ElementCollection
    @CollectionTable(name = "practice_problem_hints", joinColumns = @JoinColumn(name = "problem_id"))
    @Column(name = "hint_text")
    @OrderColumn(name = "hint_order")
    private List<String> hints;

    @ElementCollection
    @CollectionTable(name = "practice_problem_similar", joinColumns = @JoinColumn(name = "problem_id"))
    @Column(name = "similar_problem_id")
    private List<Long> similarProblems;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
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

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
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
}