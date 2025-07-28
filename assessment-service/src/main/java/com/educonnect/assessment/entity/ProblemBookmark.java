package com.educonnect.assessment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "problem_bookmarks", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "problemId"}))
public class ProblemBookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long userId;

    @NotNull
    @Column(nullable = false)
    private Long problemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problemId", insertable = false, updatable = false)
    @JsonIgnore
    private PracticeProblem problem;

    @Column(nullable = false, updatable = false)
    private LocalDateTime bookmarkedAt;

    @PrePersist
    protected void onCreate() {
        bookmarkedAt = LocalDateTime.now();
    }

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

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public PracticeProblem getProblem() {
        return problem;
    }

    public void setProblem(PracticeProblem problem) {
        this.problem = problem;
    }

    public LocalDateTime getBookmarkedAt() {
        return bookmarkedAt;
    }

    public void setBookmarkedAt(LocalDateTime bookmarkedAt) {
        this.bookmarkedAt = bookmarkedAt;
    }
}