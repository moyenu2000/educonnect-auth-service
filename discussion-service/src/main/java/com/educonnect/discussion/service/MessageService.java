package com.educonnect.discussion.service;

import com.educonnect.discussion.dto.ConversationDto;
import com.educonnect.discussion.dto.MessageDto;
import com.educonnect.discussion.dto.MessageRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Conversation;
import com.educonnect.discussion.entity.Message;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface MessageService {
    
    PagedResponse<ConversationDto> getUserConversations(Long userId, Pageable pageable);
    
    PagedResponse<MessageDto> getConversationMessages(Long conversationId, LocalDateTime before, Pageable pageable, Long currentUserId);
    
    MessageDto sendMessage(MessageRequest request, Long senderId);
    
    MessageDto updateMessage(Long messageId, String content, Long currentUserId);
    
    void deleteMessage(Long messageId, Long currentUserId);
    
    void markMessageAsRead(Long messageId, Long currentUserId);
    
    Long getUnreadMessagesCount(Long userId);
    
    Conversation getOrCreateConversation(Long user1Id, Long user2Id);
}