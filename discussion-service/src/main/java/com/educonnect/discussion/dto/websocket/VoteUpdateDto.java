package com.educonnect.discussion.dto.websocket;

public class VoteUpdateDto {
    private Long targetId;
    private String targetType; // DISCUSSION or ANSWER
    private Integer upvotesCount;
    private Integer downvotesCount;
    private String userVote; // UPVOTE, DOWNVOTE, or NONE

    public VoteUpdateDto() {}

    public VoteUpdateDto(Long targetId, String targetType, Integer upvotesCount, Integer downvotesCount, String userVote) {
        this.targetId = targetId;
        this.targetType = targetType;
        this.upvotesCount = upvotesCount;
        this.downvotesCount = downvotesCount;
        this.userVote = userVote;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
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

    public String getUserVote() {
        return userVote;
    }

    public void setUserVote(String userVote) {
        this.userVote = userVote;
    }
}