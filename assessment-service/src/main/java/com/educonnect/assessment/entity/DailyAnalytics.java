package com.educonnect.assessment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_analytics",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date", "subject_id"}))
public class DailyAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subject_id")
    private Long subjectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", insertable = false, updatable = false)
    @JsonIgnore
    private Subject subject;

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "questions_attempted")
    private Integer questionsAttempted = 0;

    @Column(name = "questions_solved")
    private Integer questionsSolved = 0;

    @Column(name = "total_points_earned")
    private Integer totalPointsEarned = 0;

    @Column(name = "average_time_seconds")
    private Integer averageTimeSeconds = 0;

    @Column(name = "accuracy_percentage", precision = 5, scale = 2)
    private BigDecimal accuracyPercentage = BigDecimal.ZERO;

    @Column(name = "streak_maintained")
    private Boolean streakMaintained = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
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

    // Constructors
    public DailyAnalytics() {}

    public DailyAnalytics(Long userId, Long subjectId, LocalDate date) {
        this.userId = userId;
        this.subjectId = subjectId;
        this.date = date;
    }

    // Helper methods for calculations
    public void updateStats(int attempted, int correct, int totalPoints, int totalTime) {
        this.questionsAttempted = attempted;
        this.questionsSolved = correct;
        this.totalPointsEarned = totalPoints;
        
        if (attempted > 0) {
            this.averageTimeSeconds = totalTime / attempted;
            this.accuracyPercentage = BigDecimal.valueOf((double) correct / attempted * 100)
                    .setScale(2, BigDecimal.ROUND_HALF_UP);
        }
        
        this.streakMaintained = (attempted > 0 && correct == attempted);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getQuestionsAttempted() {
        return questionsAttempted;
    }

    public void setQuestionsAttempted(Integer questionsAttempted) {
        this.questionsAttempted = questionsAttempted;
    }

    public Integer getQuestionsSolved() {
        return questionsSolved;
    }

    public void setQuestionsSolved(Integer questionsSolved) {
        this.questionsSolved = questionsSolved;
    }

    public Integer getTotalPointsEarned() {
        return totalPointsEarned;
    }

    public void setTotalPointsEarned(Integer totalPointsEarned) {
        this.totalPointsEarned = totalPointsEarned;
    }

    public Integer getAverageTimeSeconds() {
        return averageTimeSeconds;
    }

    public void setAverageTimeSeconds(Integer averageTimeSeconds) {
        this.averageTimeSeconds = averageTimeSeconds;
    }

    public BigDecimal getAccuracyPercentage() {
        return accuracyPercentage;
    }

    public void setAccuracyPercentage(BigDecimal accuracyPercentage) {
        this.accuracyPercentage = accuracyPercentage;
    }

    public Boolean getStreakMaintained() {
        return streakMaintained;
    }

    public void setStreakMaintained(Boolean streakMaintained) {
        this.streakMaintained = streakMaintained;
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