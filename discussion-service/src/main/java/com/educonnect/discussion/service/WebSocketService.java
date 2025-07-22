package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.websocket.*;

public interface WebSocketService {
    
    void handleSendMessage(MessageSendDto messageDto, Long senderId);
    
    void handleTypingStart(TypingDto typingDto, Long senderId, String senderName);
    
    void handleTypingStop(TypingDto typingDto, Long senderId, String senderName);
    
    void handleMarkMessageAsRead(MessageReadDto messageReadDto, Long userId);
    
    void handleCreateGroupDiscussion(Long groupId, GroupDiscussionDto discussionDto, Long authorId);
    
    void handleCreateGroupAnswer(Long groupId, GroupAnswerDto answerDto, Long authorId);
    
    void handleGroupVote(Long groupId, VoteDto voteDto, Long userId);
    
    void broadcastVoteUpdate(Long targetId, String targetType, Integer upvotes, Integer downvotes);
    
    void broadcastNotification(Long userId, String title, String content);
}