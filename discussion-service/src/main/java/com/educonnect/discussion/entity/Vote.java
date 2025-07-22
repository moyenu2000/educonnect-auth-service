package com.educonnect.discussion.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "votes", 
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "discussion_id"}),
        @UniqueConstraint(columnNames = {"user_id", "answer_id"})
    },
    indexes = {
        @Index(name = "idx_vote_user", columnList = "user_id"),
        @Index(name = "idx_vote_discussion", columnList = "discussion_id"),
        @Index(name = "idx_vote_answer", columnList = "answer_id")
    }
)
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discussion_id")
    private Discussion discussion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id")
    private Answer answer;

    @NotNull
    @Column(name = "is_upvote", nullable = false)
    private Boolean isUpvote;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Discussion getDiscussion() {
        return discussion;
    }

    public void setDiscussion(Discussion discussion) {
        this.discussion = discussion;
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public Boolean getIsUpvote() {
        return isUpvote;
    }

    public void setIsUpvote(Boolean isUpvote) {
        this.isUpvote = isUpvote;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}