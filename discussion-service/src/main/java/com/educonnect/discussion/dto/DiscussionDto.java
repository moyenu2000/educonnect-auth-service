package com.educonnect.discussion.dto;

import com.educonnect.discussion.entity.Discussion;
import com.educonnect.discussion.enums.ClassLevel;
import com.educonnect.discussion.enums.DiscussionStatus;
import com.educonnect.discussion.enums.DiscussionType;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DiscussionDto {
    private Long id;
    private String title;
    private String content;
    private DiscussionType type;
    private UserDto author;
    private Long subjectId;
    private Long topicId;
    private ClassLevel classLevel;
    private List<String> tags;
    private List<String> attachments;
    private Boolean isAnonymous;
    private Integer upvotesCount;
    private Integer downvotesCount;
    private Integer answersCount;
    private Integer viewsCount;
    private Boolean hasAcceptedAnswer;
    private DiscussionStatus status;
    private Long groupId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean upvoted;
    private Boolean downvoted;
    private Boolean bookmarked;

    public DiscussionDto() {}

    public DiscussionDto(Discussion discussion) {
        this.id = discussion.getId();
        this.title = discussion.getTitle();
        this.content = discussion.getContent();
        this.type = discussion.getType();
        this.author = discussion.getAuthor() != null ? new UserDto(discussion.getAuthor()) : null;
        this.subjectId = discussion.getSubjectId();
        this.topicId = discussion.getTopicId();
        this.classLevel = discussion.getClassLevel();
        this.tags = discussion.getTags();
        this.attachments = discussion.getAttachments();
        this.isAnonymous = discussion.getIsAnonymous();
        this.upvotesCount = discussion.getUpvotesCount();
        this.downvotesCount = discussion.getDownvotesCount();
        this.answersCount = discussion.getAnswersCount();
        this.viewsCount = discussion.getViewsCount();
        this.hasAcceptedAnswer = discussion.getHasAcceptedAnswer();
        this.status = discussion.getStatus();
        this.groupId = discussion.getGroupId();
        this.createdAt = discussion.getCreatedAt();
        this.updatedAt = discussion.getUpdatedAt();
    }

    public static DiscussionDto fromEntity(Discussion discussion) {
        return new DiscussionDto(discussion);
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

    public UserDto getAuthor() {
        return author;
    }

    public void setAuthor(UserDto author) {
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

    public Boolean getUpvoted() {
        return upvoted;
    }

    public void setUpvoted(Boolean upvoted) {
        this.upvoted = upvoted;
    }

    public Boolean getDownvoted() {
        return downvoted;
    }

    public void setDownvoted(Boolean downvoted) {
        this.downvoted = downvoted;
    }

    public Boolean getBookmarked() {
        return bookmarked;
    }

    public void setBookmarked(Boolean bookmarked) {
        this.bookmarked = bookmarked;
    }
}