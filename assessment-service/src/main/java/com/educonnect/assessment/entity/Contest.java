package com.educonnect.assessment.entity;

import com.educonnect.assessment.enums.ContestStatus;
import com.educonnect.assessment.enums.ContestType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contests")
public class Contest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContestType type;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime startTime;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime endTime;

    @NotNull
    @Column(nullable = false)
    private Integer duration; // in minutes

    @ElementCollection
    @CollectionTable(name = "contest_problems", joinColumns = @JoinColumn(name = "contest_id"))
    @Column(name = "problem_id")
    private List<Long> problemIds;

    @ElementCollection
    @CollectionTable(name = "contest_prizes", joinColumns = @JoinColumn(name = "contest_id"))
    @Column(name = "prize")
    private List<String> prizes;

    @Column(columnDefinition = "TEXT")
    private String rules;

    @Column(nullable = false)
    private Integer participants = 0;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContestStatus status = ContestStatus.UPCOMING;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContestType getType() {
        return type;
    }

    public void setType(ContestType type) {
        this.type = type;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public List<Long> getProblemIds() {
        return problemIds;
    }

    public void setProblemIds(List<Long> problemIds) {
        this.problemIds = problemIds;
    }

    public List<String> getPrizes() {
        return prizes;
    }

    public void setPrizes(List<String> prizes) {
        this.prizes = prizes;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }

    public Integer getParticipants() {
        return participants;
    }

    public void setParticipants(Integer participants) {
        this.participants = participants;
    }

    public ContestStatus getStatus() {
        return status;
    }

    public void setStatus(ContestStatus status) {
        this.status = status;
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