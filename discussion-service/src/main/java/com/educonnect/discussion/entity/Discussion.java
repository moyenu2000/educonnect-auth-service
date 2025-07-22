package com.educonnect.discussion.entity;

import com.educonnect.discussion.enums.ClassLevel;
import com.educonnect.discussion.enums.DiscussionStatus;
import com.educonnect.discussion.enums.DiscussionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "discussions", indexes = {
    @Index(name = "idx_discussion_author", columnList = "author_id"),
    @Index(name = "idx_discussion_subject", columnList = "subject_id"),
    @Index(name = "idx_discussion_topic", columnList = "topic_id"),
    @Index(name = "idx_discussion_type", columnList = "type"),
    @Index(name = "idx_discussion_status", columnList = "status"),
    @Index(name = "idx_discussion_created", columnList = "created_at")
})
public class Discussion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscussionType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(name = "subject_id")
    private Long subjectId;

    @Column(name = "topic_id")
    private Long topicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "class_level")
    private ClassLevel classLevel;

    @ElementCollection
    @CollectionTable(name = "discussion_tags", joinColumns = @JoinColumn(name = "discussion_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "discussion_attachments", joinColumns = @JoinColumn(name = "discussion_id"))
    @Column(name = "attachment_url")
    private List<String> attachments = new ArrayList<>();

    @Column(name = "is_anonymous", nullable = false)
    private Boolean isAnonymous = false;

    @Column(name = "upvotes_count", nullable = false)
    private Integer upvotesCount = 0;

    @Column(name = "downvotes_count", nullable = false)
    private Integer downvotesCount = 0;

    @Column(name = "answers_count", nullable = false)
    private Integer answersCount = 0;

    @Column(name = "views_count", nullable = false)
    private Integer viewsCount = 0;

    @Column(name = "has_accepted_answer", nullable = false)
    private Boolean hasAcceptedAnswer = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscussionStatus status = DiscussionStatus.ACTIVE;

    @Column(name = "group_id")
    private Long groupId;

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public DiscussionType getType() {
        return type;
    }

    public void setType(DiscussionType type) {
        this.type = type;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
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

    public ClassLevel getClassLevel() {
        return classLevel;
    }

    public void setClassLevel(ClassLevel classLevel) {
        this.classLevel = classLevel;
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

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public Integer getUpvotesCount() {
        return upvotesCount;
    }

    public void setUpvotesCount(Integer upvotesCount) {
        this.upvotesCount = upvotesCount;
    }

    public Integer getDownvotesCount() {
        return downvotesCount;
    }

    public void setDownvotesCount(Integer downvotesCount) {
        this.downvotesCount = downvotesCount;
    }

    public Integer getAnswersCount() {
        return answersCount;
    }

    public void setAnswersCount(Integer answersCount) {
        this.answersCount = answersCount;
    }

    public Integer getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(Integer viewsCount) {
        this.viewsCount = viewsCount;
    }

    public Boolean getHasAcceptedAnswer() {
        return hasAcceptedAnswer;
    }

    public void setHasAcceptedAnswer(Boolean hasAcceptedAnswer) {
        this.hasAcceptedAnswer = hasAcceptedAnswer;
    }

    public DiscussionStatus getStatus() {
        return status;
    }

    public void setStatus(DiscussionStatus status) {
        this.status = status;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
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