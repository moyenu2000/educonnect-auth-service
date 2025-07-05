package com.educonnect.discussion.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ai_queries", indexes = {
    @Index(name = "idx_ai_query_user", columnList = "user_id"),
    @Index(name = "idx_ai_query_subject", columnList = "subject_id"),
    @Index(name = "idx_ai_query_created", columnList = "created_at")
})
public class AIQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @NotNull
    @Column(nullable = false)
    private String type; // CONCEPT, PROBLEM, EXPLANATION, HOMEWORK

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "topic_id")
    private Long topicId;

    @Column(columnDefinition = "TEXT")
    private String context;

    @Column(nullable = false)
    private Double confidence;

    @ElementCollection
    @CollectionTable(name = "ai_query_sources", joinColumns = @JoinColumn(name = "ai_query_id"))
    @Column(name = "source")
    private List<String> sources;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
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

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}