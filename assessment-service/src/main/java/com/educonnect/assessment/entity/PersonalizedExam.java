package com.educonnect.assessment.entity;

import com.educonnect.assessment.enums.ClassLevel;
import com.educonnect.assessment.enums.ExamStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "personalized_exams")
public class PersonalizedExam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long userId;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private Long subjectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subjectId", insertable = false, updatable = false)
    private Subject subject;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClassLevel classLevel;

    @NotNull
    @Column(nullable = false)
    private Integer duration; // in minutes

    @ElementCollection
    @CollectionTable(name = "personalized_exam_questions", joinColumns = @JoinColumn(name = "exam_id"))
    @Column(name = "question_id")
    private List<Long> questionIds;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer passingScore = 60;

    @Column(nullable = false)
    private Integer score = 0;

    @Column(nullable = false)
    private Integer correctAnswers = 0;

    @Column(nullable = false)
    private Integer incorrectAnswers = 0;

    @Column(nullable = false)
    private Integer unansweredQuestions = 0;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamStatus status = ExamStatus.SCHEDULED;

    @Column
    private LocalDateTime startedAt;

    @Column
    private LocalDateTime completedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (questionIds != null) {
            totalQuestions = questionIds.size();
            unansweredQuestions = totalQuestions;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public ClassLevel getClassLevel() { return classLevel; }
    public void setClassLevel(ClassLevel classLevel) { this.classLevel = classLevel; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public List<Long> getQuestionIds() { return questionIds; }
    public void setQuestionIds(List<Long> questionIds) { 
        this.questionIds = questionIds;
        if (questionIds != null) {
            this.totalQuestions = questionIds.size();
        }
    }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getPassingScore() { return passingScore; }
    public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }

    public Integer getIncorrectAnswers() { return incorrectAnswers; }
    public void setIncorrectAnswers(Integer incorrectAnswers) { this.incorrectAnswers = incorrectAnswers; }

    public Integer getUnansweredQuestions() { return unansweredQuestions; }
    public void setUnansweredQuestions(Integer unansweredQuestions) { this.unansweredQuestions = unansweredQuestions; }

    public ExamStatus getStatus() { return status; }
    public void setStatus(ExamStatus status) { this.status = status; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}