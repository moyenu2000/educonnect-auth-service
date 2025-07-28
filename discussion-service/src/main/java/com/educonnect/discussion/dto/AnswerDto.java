package com.educonnect.discussion.dto;

import com.educonnect.discussion.entity.Answer;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnswerDto {
    private Long id;
    private String content;
    private UserDto author;
    private Long discussionId;
    private List<String> attachments;
    private Boolean isAnonymous;
    private Integer upvotesCount;
    private Integer downvotesCount;
    private Boolean isAccepted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean upvoted;
    private Boolean downvoted;

    public AnswerDto() {}

    public AnswerDto(Answer answer) {
        this.id = answer.getId();
        this.content = answer.getContent();
        this.author = answer.getAuthor() != null ? new UserDto(answer.getAuthor()) : null;
        this.discussionId = answer.getDiscussion() != null ? answer.getDiscussion().getId() : null;
        this.attachments = answer.getAttachments();
        this.isAnonymous = answer.getIsAnonymous();
        this.upvotesCount = answer.getUpvotesCount();
        this.downvotesCount = answer.getDownvotesCount();
        this.isAccepted = answer.getIsAccepted();
        this.createdAt = answer.getCreatedAt();
        this.updatedAt = answer.getUpdatedAt();
    }

    public static AnswerDto fromEntity(Answer answer) {
        return new AnswerDto(answer);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UserDto getAuthor() {
        return author;
    }

    public void setAuthor(UserDto author) {
        this.author = author;
    }

    public Long getDiscussionId() {
        return discussionId;
    }

    public void setDiscussionId(Long discussionId) {
        this.discussionId = discussionId;
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

    public Boolean getIsAccepted() {
        return isAccepted;
    }

    public void setIsAccepted(Boolean isAccepted) {
        this.isAccepted = isAccepted;
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
}